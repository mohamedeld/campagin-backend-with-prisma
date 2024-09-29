import express from "express";
import {signUp,login} from "../controller/authController.js"
import { loginValidator, signUpValidator } from "../utils/validators/userValidator.js";
const router = express.Router();

router.route("/signUp").post(signUpValidator,signUp);
router.route("/login").post(loginValidator,login);

export default router;