import express from "express";
import {PrismaClient} from "@prisma/client";
import cors from "cors"
import dotnev from "dotenv";
import globalErrors from "./controller/errorController.js";
import authRoutes from "./routes/useRoute.js";
import campaignRoutes from "./routes/campaignsRoute.js";
import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotnev.config();
export const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json({ limit: '20kb' }));
app.use(compression());
process.on('uncaughtException', (err) => {
  console.log('unhandler exception shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});
app.use(helmet())
const limiter = rateLimit({
  windowMs: 24 * 60 * 3, // next request to endpoint
  max: 100, // maximal request for all endpoint
  message: 'To many request, send back request after 3 minutes',
});
// routes
app.use("/",limiter);
app.use("/api/v1",authRoutes);
app.use("/api/v1",campaignRoutes);


app.use(globalErrors);
const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{
  console.log("Server is connected successfully");
})


// error outside express
process.on('unhandledRejection', (error) => {
  console.log(`UnhandledRejection ${error}`);
  server.close(() => {
    console.error('Shut down...');
    process.exit(1);
  });
});