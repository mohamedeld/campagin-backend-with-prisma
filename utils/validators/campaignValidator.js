import { body } from "express-validator";
export const validateCreateCampaign = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('targetAmount').isFloat({ gt: 0 }).withMessage('Target Amount must be a positive number'),
  body('currentAmount').optional().isFloat({ gte: 0 }).withMessage('Current Amount must be a non-negative number'),
  body('deadline').isISO8601().withMessage('Deadline must be a valid date'),
];