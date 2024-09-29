import express from "express";
import {createCampaign,getAllCampaigns,getCampaignProgress,getSingleCampaign,updateCampaign,deleteCampaign} from "../controller/campaignsController.js";
import { validateCreateCampaign } from "../utils/validators/campaignValidator.js";
import { protect } from "../controller/authController.js";
const router = express.Router();

router.route("/campaign").post(protect,validateCreateCampaign,createCampaign);
router.route("/campaigns").get(protect,getAllCampaigns);
router.route("/campaigns/progess").get(protect,getCampaignProgress);
router.route("/campaigns/:id").get(protect,getSingleCampaign).patch(protect,updateCampaign).delete(protect,deleteCampaign);

export default router;