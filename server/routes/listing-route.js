import express from "express";
import {
  createListing,
  deleteListing,
} from "../controllers.js/listing-controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.route("/create").post(verifyToken, createListing);
// router.route("/delete/:id").delete(verifyToken,deleteListing);
router
  .delete("/delete/:id", verifyToken, deleteListing)
  
export default router;
