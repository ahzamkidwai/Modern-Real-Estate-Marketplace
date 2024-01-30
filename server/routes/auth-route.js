import express from "express";
import { signup, signin, google } from "../controllers.js/auth-controller.js";
const router = express.Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/google").post(google);

export default router;
