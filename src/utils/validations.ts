export type UserNameStatus = {
    valid: boolean,
    message: string | null
}

export const validateUserName = (userName: string): UserNameStatus => {
    // Validate the username
    // non empty
    //max length 10
    // can contain only alphanumeric no special characters 

    return {valid: true} as UserNameStatus;
}

export type PasswordStatus = {
    valid: boolean,
    message: string | null
}

export const validatePassword = (password: string): PasswordStatus => {
    // Validate the password
    // non empty
    //min length 8
    return {valid: true} as PasswordStatus;
}


export type EmailStatus = {
    valid: boolean,
    message: string | null
}

export const validateEmail = (email: string): EmailStatus => {
    // Validate email
    return {valid: true} as EmailStatus;
}