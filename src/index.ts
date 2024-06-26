import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/authRoutes";
import bodyParser from "body-parser";
import { saveTwilioClient, saveTwilioEmailClient } from "./comms/twilioConfig";
import { testEmail, testSMS } from "./controllers/testController";
import client from "twilio";
import sgMail from "@sendgrid/mail";
import { userRouter } from "./routes/userRoutes";
import cors from 'cors';
import { categoriesRouter } from "./routes/categoriesRouter";
import { productRouter } from "./routes/productRoutes";
import { cartRouter } from "./routes/cartRoutes";
import { adminRoutes } from "./routes/adminRoutes";
import { stripeRouter } from "./routes/stripeRoutes";
import { stripeWebhook } from "./controllers/stripeController";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

saveTwilioClient(client(accountSid, authToken));
saveTwilioEmailClient(sgMail);

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

app.get("/health", (req: Request, res: Response) => {
  res.send("Running");
});

app.get("/test/sms", testSMS);
app.get("/test/email", testEmail);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/categories", categoriesRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/admin", adminRoutes);
app.use("/stripe", stripeRouter)
app.use("/webhook", stripeWebhook)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
