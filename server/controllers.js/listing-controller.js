import Listing from "../models/listing-model.js";

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
