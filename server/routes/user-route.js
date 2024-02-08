import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  getUserListings,
} from "../controllers.js/user-controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
// router.route("/listings/:id").get(verifyToken, getUserListings);
router.get("/listings/:id", verifyToken, getUserListings);

export default router;
