import { sendEmail, sendSMS } from "./twilioConfig";

export const sendTestSMS = async () => {
  return sendSMS("TEst Message from Twilio", "+12267539069");
};

export const sendTestEmail = async () => {
  return sendEmail(
    "pullapavankumar.ca@gmail.com",
    "Subject",
    "This is a test email"
  );
};

export const sendForgotPasswordSMS = async (otp: number, number: string) => {
  return sendSMS("OTP to reset your Password is " + otp, number);
};

export const sendForgotPasswordEmail = async (otp: number, email: string) => {
  return sendEmail(
     email,
    "FORGOT PASSWORD",
    "ONE TIME PASSWORD TO RESET YOUR PASSWORD is " + otp
  );
};
