import catchAsync from "../utils/catchAsync.js";
import {prisma} from "../index.js";
import { paginate } from "../utils/pagination.js";
import AppError from "../utils/appError.js";

export const getAllCampaigns = catchAsync(async (req,res,next)=>{
  const { page = 1, limit = 10 } = req.query;
    const paginatedCampaigns = await paginate(prisma.campaign, page, limit);
    if(!paginatedCampaigns){
      return next(new AppError("campaigns is not found"));
    }
    res.status(200).json(paginatedCampaigns);
});

export const getCampaignProgress = catchAsync(async (req, res, next) => {
  const campaigns = await prisma.campaign.findMany({
    include: {
      donations: {
        select: {
          amount: true,
        },
      },
    },
  });

  const progressData = campaigns.map(campaign => {
    const totalRaised = campaign.donations.reduce((sum, donation) => sum + donation.amount, 0);
    const progressPercentage = campaign.targetAmount ? (totalRaised / campaign.targetAmount) * 100 : 0;
  
    // Determine if the campaign is active
    const currentDate = new Date();
    const isActive = currentDate >= new Date(campaign.startDate) && currentDate <= new Date(campaign.endDate);
  
    return {
      id: campaign.id,
      title: campaign.title,
      totalRaised,
      targetAmount: campaign.targetAmount,
      progressPercentage: parseFloat(progressPercentage.toFixed(2)), // Fix to 2 decimal points
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      isActive, // Add active status
    };
  });
  
  res.status(200).json(progressData);
});

export const getSingleCampaign = catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const campaign = await prisma.campaign.findFirst({
    where:{
      id
    }
  });
  if(!campaign){
    return next(new AppError("id is invalid"));
  }
  res.status(200).json(campaign)
})

export const createCampaign = catchAsync(async (req, res, next) => {
  const { title, description, targetAmount, currentAmount, deadline,startDate,endDate } = req.body;

  const newCampaign = await prisma.campaign.create({
    data: {
      title,
      description,
      currentAmount,
      deadline,
      targetAmount,
      userId:req?.user?.id,
      startDate,
      endDate
    },
  });

  res.status(201).json(newCampaign);
});

export const updateCampaign = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, startDate, endDate } = req.body;

  const updatedCampaign = await prisma.campaign.update({
    where: { id },
    data: {
      title,
      description,
      startDate,
      endDate,
    },
  });

  if (!updatedCampaign) {
    return next(new AppError("Campaign not found", 404));
  }

  res.status(200).json(updatedCampaign);
});

export const deleteCampaign = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedCampaign = await prisma.campaign.delete({
    where: { id },
  });

  if (!deletedCampaign) {
    return next(new AppError("Campaign not found", 404));
  }

  res.status(204).json({ message: "Campaign deleted successfully" });
});