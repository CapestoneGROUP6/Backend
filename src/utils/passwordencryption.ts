import bcrypt from 'bcrypt';
const saltRounds = 10;


export const hashPassword = async (plainTextPassword: string) => {
    console.log(plainTextPassword);
    try {
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

export const comparePasswords = async (plainTextPassword: string, hashedPassword: string) => {
    try {
        const match = await bcrypt.compare(plainTextPassword, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};
