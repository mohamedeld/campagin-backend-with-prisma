import express from "express";
import {createDonation,getAllDonations,getSingleDonation,updateDonation,deleteDonation} from "../controller/denotionController.js";
import { validateCreateDonation } from "../utils/validators/donationValidator.js";
import { protect } from "../controller/authController.js";
const router = express.Router();

router.route("/").post(protect,validateCreateDonation,createDonation);
router.route("/").get(protect,getAllDonations);
router.route("/:id").get(protect,getSingleDonation).patch(protect,updateDonation).delete(protect,deleteDonation);

export default router;