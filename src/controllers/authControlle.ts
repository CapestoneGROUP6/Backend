import { NextFunction } from "connect";
import { Request, Response } from "express";
import {
  validateEmail,
  validatePassword,
  validateUserName,
} from "../utils/validations";
import { comparePasswords, hashPassword } from "../utils/passwordencryption";
import { generate4DigitPassword } from "../utils/commonUtil";
import { PrismaClient, user } from "@prisma/client";
import { sendForgotPasswordEmail, sendForgotPasswordSMS } from "../comms/comms";
import { JwtUtil } from "../utils/JwtUtil";
import { CustomRequest, GoogleLinkRequest } from "../customTypes";

const prisma = new PrismaClient();

export type LoginRequest = {
  userName: string;
  password: string;
};

export type SignupRequest = {
  userName: string;
  password: string;
  email: string;
};

export type SingUPResponse = {
  user?: user;
  status: boolean;
  message?: string | null;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  otp: number;
  newPassword: string;
  email: string;
};

export const login = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const data = body as LoginRequest;
  const { userName, password } = data || {};

  try {
    //Validations

    const userValidationStatus = validateUserName(userName);
    const passwordValidationStatus = validatePassword(password);

    if (!userValidationStatus.valid || !passwordValidationStatus.valid) {
      return res.json({
        status: false,
        message:
          userValidationStatus.message || passwordValidationStatus.message,
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        NAME: userName,
      },
    });
    if (!existingUser || !existingUser?.ID) {
      return res.json({
        status: false,
        message: "Username doesn't  exist in the system.",
      });
    }

    if (existingUser.ROLE?.toLocaleLowerCase() === 'admin') {
      return res.json({
        status: false,
        message: "User cannot login as he admin",
      });
    }

    if (existingUser.disabled === 1) {
      return res.json({
        status: false,
        message: "Your Account has been disabled by Admin",
      });
    }

    //Password matching...
    const isMAtching = await comparePasswords(
      password,
      existingUser.PASSWORD || ""
    );
    if (!isMAtching) {
      return res.json({
        status: false,
        message: "Invalid Password",
      });
    }

    return res.json({
      status: true,
      token: JwtUtil.generateToken({ id: existingUser.ID }),
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

  export const  googleAccountLink = async(req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { email, uid, displayName, phoneNumber } = req.body as GoogleLinkRequest

    if (!email || !uid || !displayName) {
      return res.json({
        status: false,
        message: "DEtails Not REceived From GOogle",
      });
    }

    const _user = await prisma.user.findFirst({
      where:{
        GOOGLE_ID: uid 
      }
    })

    if (_user) {
      return res.json({
        status: true,
        token: JwtUtil.generateToken({ id: _user.ID }),
      });
    }

    const user = await prisma.user.findFirst({
      where:{
        EMAIL: email 
      }
    })
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          EMAIL: email,
          NAME: displayName,
          MOBILE: phoneNumber,
          GOOGLE_ID: uid
        }
      })
      return res.json({
        status: true,
        token: JwtUtil.generateToken({ id: newUser.ID }),
      });
    }

    if (!user.GOOGLE_ID) {
      await prisma.user.update({
        where: {
          ID: user.ID
        },
        data: {
          GOOGLE_ID: uid
        }
      })
    }

    return res.json({
      status: true,
      token: JwtUtil.generateToken({ id: user.ID }),
    });
  } catch (error) {
    console.log(error)
    res.json({
      status: false,
      message: "Failed to link Google Account"
    });
  }
}


export const adminLOgin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const data = body as LoginRequest;
  const { userName, password } = data || {};

  try {
    //Validations

    const userValidationStatus = validateUserName(userName);
    const passwordValidationStatus = validatePassword(password);

    if (!userValidationStatus.valid || !passwordValidationStatus.valid) {
      return res.json({
        status: false,
        message:
          userValidationStatus.message || passwordValidationStatus.message,
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        NAME: userName,
      },
    });
    if (!existingUser?.ID) {
      return res.json({
        status: false,
        message: "Username doesn't  exist in the system.",
      });
    }

    if (existingUser.ROLE?.toLocaleLowerCase() !== 'admin') {
      return res.json({
        status: false,
        message: "User cannot login as he is not admin",
      });
    }

    //Password matching...
    const isMAtching = await comparePasswords(
      password,
      existingUser.PASSWORD || ""
    );
    if (!isMAtching) {
      return res.json({
        status: false,
        message: "Invalid Password",
      });
    }

    return res.json({
      status: true,
      token: JwtUtil.generateToken({ id: existingUser.ID }),
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const signup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const data = body as SignupRequest;
  const { userName, password, email } = data || {};

  try {
    //Validations

    const userValidationStatus = validateUserName(userName);
    const passwordValidationStatus = validatePassword(password);
    const emailValidationStatus = validateEmail(email);

    if (
      !userValidationStatus.valid ||
      !passwordValidationStatus.valid ||
      !emailValidationStatus.valid
    ) {
      return res.json({
        status: false,
        message:
          userValidationStatus.message ||
          passwordValidationStatus.message ||
          emailValidationStatus.message,
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            NAME: userName,
          },
          {
            EMAIL: email,
          },
        ],
      },
    });
    if (existingUser?.ID) {
      return res.json({
        status: false,
        message: "Username or Email already exists in the System!!!",
      });
    }

    const hashedPassword = await hashPassword(password);
    const response = await prisma.user.create({
      data: {
        EMAIL: email,
        NAME: userName,
        PASSWORD: hashedPassword,
        ROLE: 'regular'
      },
    });
    return res.json({
      token: JwtUtil.generateToken({ id: response.ID }),
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Internal Server Error",
    });
  }
};



export const adminsignup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const data = body as SignupRequest;
  const { userName, password, email } = data || {};

  try {
    //Validations

    const userValidationStatus = validateUserName(userName);
    const passwordValidationStatus = validatePassword(password);
    const emailValidationStatus = validateEmail(email);

    if (
      !userValidationStatus.valid ||
      !passwordValidationStatus.valid ||
      !emailValidationStatus.valid
    ) {
      return res.json({
        status: false,
        message:
          userValidationStatus.message ||
          passwordValidationStatus.message ||
          emailValidationStatus.message,
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            NAME: userName,
          },
          {
            EMAIL: email,
          },
        ],
      },
    });
    if (existingUser?.ID) {
      return res.json({
        status: false,
        message: "Username or Email already exists in the System!!!",
      });
    }

    const hashedPassword = await hashPassword(password);
    const response = await prisma.user.create({
      data: {
        EMAIL: email,
        NAME: userName,
        PASSWORD: hashedPassword,
        ROLE: 'admin'
      },
    });
    return res.json({
      token: JwtUtil.generateToken({ id: response.ID }),
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const data = body as ForgotPasswordRequest;
  const { email } = data || {};

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        EMAIL: email,
      },
    });

    if (!existingUser) {
      return res.json({
        status: false,
        message: "Email Not exists in the System.",
      });
    }

    const otp = generate4DigitPassword();
    await sendForgotPasswordEmail(otp, email);

    await prisma.user.update({
      where: {
        ID: existingUser?.ID,
      },
      data: {
        OTP: otp,
      },
    });

    return res.json({
      status: true,
      message: "OTP has been sent to " + email,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const data = body as ResetPasswordRequest;
  const { otp, newPassword, email } = data || {};

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        EMAIL: email,
      },
    });

    const savedOTP = existingUser?.OTP;
    if (otp != savedOTP) {
      return res.json({
        status: false,
        message: "Invalid OTP",
      });
    }

    const hashedPasssword = await hashPassword(newPassword);
    await prisma.user.update({
      where: {
        ID: existingUser?.ID,
      },
      data: {
        PASSWORD: hashedPasssword,
      },
    });

    return res.json({
      status: true,
      message: "Password has been reset Successfully!!!",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
