import bcrypt from "bcrypt";
import { User, IUser } from "../models/User.js";

export class AuthService {
  static async validateCredentials(email: string, password: string): Promise<IUser | null> {
    const user = await User.findOne({ email, active: true });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    return user;
  }
}
