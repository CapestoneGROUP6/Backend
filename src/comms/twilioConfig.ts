import { MailService } from "@sendgrid/mail";

let twilioClient: any;
let twilioEmailClient: MailService;

export const saveTwilioClient = (client: any) => {
  twilioClient = client;
};

export const saveTwilioEmailClient = (sgMail: MailService) => {
  twilioEmailClient = sgMail;
};

const getSMSClient = () => {
  return twilioClient;
};

const getEmailClient = () => {
  return twilioEmailClient;
};

export const sendSMS = async (body: string, number: string) => {
  const smsFlag = process.env.SMS == "true";
  if (!smsFlag) {
    return {
      status: true,
    };
  }
  const client = getSMSClient();
  const response = await client.messages.create({
    from: "+18672925333",
    body,
    to: number,
  });
  return response;
};

export const sendEmail = async (
  toMail: string,
  subject: string,
  text: string,
) => {
  const emailFlag = process.env.EMAIL == "true";
  if (!emailFlag) {
    return {
      status: true,
    };
  }
  const client = getEmailClient();
  const msg = {
    to: toMail,
    from: process.env.SENDGRID_FROM_MAIL || "",
    subject,
    text
  };
  const response = await client.send(msg);
  return response;
};
