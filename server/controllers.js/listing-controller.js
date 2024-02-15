import Listing from "../models/listing-model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(200).json({
      success: true,
      message: "Listing Created Successfully.",
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listingData = await Listing.findById(req.params.id);
    console.log(
      "Listing Data to be deleted : " + listingData,
      " req.params.id : " + req.params.id
    );
    console.log("Request User inside deleteListing Handler : ", req.user);
    if (!listingData) {
      return next(404, "Listing Not Found");
    }

    if (req.user.id !== listingData.userRef) {
      return next(401, "You can only delete your own listings");
    }
    console.log("delete karne ke liye yaha tak a agyehain");
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Listing Deleted Successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  console.log("UPDATE LISTING HANDLER IS CALLED ");
  console.log("req.user is : ", req.user.id);
  console.log("req.params is : ", req.params.id);

  try {
    const listingData = await Listing.findById(req.params.id);
    if (!listingData) {
      return next(errorHandler(404, "Listing Not Found"));
    }
    if (req.user.id !== listingData.userRef) {
      return next(401, "You can only update your own listings");
    }
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log("Updated Listing is : ", updatedListing);
    return res.status(200).json({
      success: true,
      message: "Listing Updated Successfully",
      updatedListing,
    });
  } catch (error) {
    console.log("Error occured in updateListing catch block " + error.message);
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing Not Found"));
    }
    return res.status(200).json({
      success: true,
      message: "Listing is found successfully.",
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    console.log("getListings Handler is called");
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndexF) || 0;

    // When user have not selected Offer button OR There is no offer in URL i.e. Undefined
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    console.log("Limit is : ", limit);

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json({
      success: true,
      message: "Listings find successfully by search bar",
      listings,
    });
  } catch (error) {
    next(error);
  }
};
