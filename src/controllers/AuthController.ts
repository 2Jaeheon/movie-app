import {authService} from "../services/authService";
import {validateEmail} from "../util/validators";

export class AuthController {
    static async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
        if (!validateEmail(email)) {
            return {success: false, error: "Invalid email format."};
        }
        if (password.length < 6) {
            return {success: false, error: "Password must be at least 6 characters."};
        }
        try {
            const isSuccess = await authService.signIn(email, password);
            if (isSuccess) {
                return {success: true};
            }
            return {success: false, error: "Invalid email or password."};
        } catch {
            return {success: false, error: "An error occurred. Please try again."};
        }
    }

    static async signUp(
        email: string,
        password: string,
        confirmPassword: string
    ): Promise<{ success: boolean; error?: string }> {
        if (!validateEmail(email)) {
            return {success: false, error: "Invalid email format."};
        }
        if (password.length < 6) {
            return {success: false, error: "Password must be at least 6 characters."};
        }
        if (password !== confirmPassword) {
            return {success: false, error: "Passwords do not match."};
        }
        try {
            const isSuccess = await authService.signUp(email, password);
            if (isSuccess) {
                return {success: true};
            }
            return {success: false, error: "Email is already registered."};
        } catch {
            return {success: false, error: "An error occurred. Please try again."};
        }
    }
}