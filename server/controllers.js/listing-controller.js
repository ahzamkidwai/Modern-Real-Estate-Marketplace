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
