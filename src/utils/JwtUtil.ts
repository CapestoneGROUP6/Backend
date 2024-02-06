import jwt, { Secret } from "jsonwebtoken";

export class JwtUtil {
  static getSecretKey(): Secret {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new Error("JWT_SECRET environment variable not set.");
    }

    return secretKey;
  }

  static generateToken(payload: Record<string, any>): string {
    const secretKey = this.getSecretKey();

    const expiresInMinutes = 15;
    const expirationTime =
      Math.floor(Date.now() / 1000) + 60 * expiresInMinutes;

    const token = jwt.sign({ ...payload, exp: expirationTime }, secretKey);
    return token;
  }

  static verifyToken(token: string): Record<string, any> | null {
    const secretKey = this.getSecretKey();

    try {
      jwt.verify(token, secretKey);
      return JwtUtil.extractPayload(token);
    } catch (error) {
      return null;
    }
  }

  static extractPayload(token: string): Record<string, any> | null {
    const secretKey = this.getSecretKey();

    try {
      const decoded = jwt.verify(token, secretKey) as Record<string, any>;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
