import express from "express";
import {createCampaign,getAllCampaigns,getCampaignProgress,getSingleCampaign,updateCampaign,deleteCampaign} from "../controller/campaignsController.js";
import { validateCreateCampaign } from "../utils/validators/campaignValidator.js";
import { protect } from "../controller/authController.js";
const router = express.Router();

router.route("/").post(protect,validateCreateCampaign,createCampaign);
router.route("/").get(protect,getAllCampaigns);
router.route("/progess").get(protect,getCampaignProgress);
router.route("/:id").get(protect,getSingleCampaign).patch(protect,updateCampaign).delete(protect,deleteCampaign);

export default router;