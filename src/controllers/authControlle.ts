import { NextFunction } from "connect";
import { Request, Response } from "express";
import { PrismaClient, user } from '@prisma/client'
import { validateEmail, validatePassword, validateUserName } from "../utils/validations";
import { comparePasswords, hashPassword } from "../utils/passwordencryption";

const prisma = new PrismaClient()


export type LoginRequest = {
    userName: string,
    password: string
}

export type SignupRequest = {
    userName: string,
    password: string,
    email: string
}

export type SingUPResponse = {
    user?: user
    status: boolean
    message?: string | null;
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
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
                message: userValidationStatus.message || passwordValidationStatus.message
            })
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                NAME: userName
            }
        });
        if (!existingUser?.ID) {
            return res.json({
                status: false,
                message: 'Username doesn\'t  exist in the system.'
            })
        }

        //Password matching...
        const isMAtching = await comparePasswords(password, existingUser.PASSWORD || '');
        if (!isMAtching) {
            return res.json({
                status: false,
                message: 'Invalid Password'
            })
        }

        return res.json({
            user: existingUser,
            status: true
        })

    } catch (error) {
        return res.json({
            status: false,
            message: 'Internal Server Error'
        })
    }
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const data = body as SignupRequest;
    const { userName, password, email } = data || {};

    try {
        //Validations

        const userValidationStatus = validateUserName(userName);
        const passwordValidationStatus = validatePassword(password);
        const emailValidationStatus = validateEmail(email);

        if (!userValidationStatus.valid || !passwordValidationStatus.valid || !emailValidationStatus.valid) {
            return res.json({
                status: false,
                message: userValidationStatus.message || passwordValidationStatus.message || emailValidationStatus.message
            })
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        NAME: userName
                    },
                    {
                        EMAIL: email
                    }
                ]
            }
        });
        if (existingUser?.ID) {
            return res.json({
                status: false,
                message: 'Username or Email already exists in the System!!!'
            })
        }

        const hashedPassword = await hashPassword(password)
        const response = await prisma.user.create({
            data: {
                EMAIL: email,
                NAME: userName,
                PASSWORD: hashedPassword
            }
        })
        return res.json({
            user: response,
            status: true
        })

    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: 'Internal Server Error'
        })
    }
}