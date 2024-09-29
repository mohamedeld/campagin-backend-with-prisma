import { body } from "express-validator";

export const validateCreateDonation = [
  body('campaignId').isInt().withMessage('Campaign ID must be an integer'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
];