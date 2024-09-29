import catchAsync from "../utils/catchAsync.js";
import {prisma} from "../index.js";
import AppError from "../utils/appError.js";
import { paginate } from "../utils/pagination.js";


export const createDonation = catchAsync(async (req, res, next) => {
  const { campaignId, amount } = req.body;

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign) {
    return next(new AppError("Campaign not found", 404));
  }

  const currentDate = new Date();
  if (currentDate < new Date(campaign.startDate) || currentDate > new Date(campaign.endDate)) {
    return next(new AppError("Cannot donate to an inactive campaign", 400));
  }

  const newDonation = await prisma.donation.create({
    data: {
      amount,
      userId: req.user.id, // Assuming user ID is in req.user
      campaignId,
    },
  });

  res.status(201).json(newDonation);
});

export const getAllDonations = catchAsync(async (req,res,next)=>{
  const { page = 1, limit = 10 } = req.query;
    const paginatedDonations = await paginate(prisma.donation, page, limit);
    if(!paginatedDonations){
      return next(new AppError("Donations is not found"));
    }
    res.status(200).json(paginatedDonations);
});


export const getSingleDonation = catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const donation = await prisma.donation.findFirst({
    where:{
      id
    }
  });
  if(!donation){
    return next(new AppError("id is invalid"));
  }
  res.status(200).json(donation)
});

export const updateDonation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { amount } = req.body;

  const updateDonation = await prisma.donation.update({
    where: { id },
    data: {
      amount
    },
  });

  if (!updateDonation) {
    return next(new AppError("Donation not found", 404));
  }

  res.status(200).json(updateDonation);
});

export const deleteDonation = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedDonation = await prisma.donation.delete({
    where: { id },
  });

  if (!deletedDonation) {
    return next(new AppError("Donation not found", 404));
  }

  res.status(204).json({ message: "Donation deleted successfully" });
});