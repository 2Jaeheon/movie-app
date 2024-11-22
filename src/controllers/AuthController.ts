import {authService} from "../services/authService"; // authService 모듈을 가져옵니다.
import {validateEmail} from "../util/validators"; // 이메일 유효성 검사를 위한 validateEmail 함수

export class AuthController {
    // 로그인 처리 메서드
    static async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
        // 이메일 형식이 유효한지 확인
        if (!validateEmail(email)) {
            return {success: false, error: "Invalid email format."}; // 이메일 형식 오류
        }
        // 비밀번호가 6자 이상인지 확인
        if (password.length < 6) {
            return {success: false, error: "Password must be at least 6 characters."}; // 비밀번호 길이 오류
        }
        try {
            // authService의 signIn 메서드를 호출하여 로그인 처리
            const isSuccess = await authService.signIn(email, password);
            if (isSuccess) {
                return {success: true}; // 로그인 성공
            }
            return {success: false, error: "Invalid email or password."}; // 이메일 또는 비밀번호 오류
        } catch {
            return {success: false, error: "An error occurred. Please try again."}; // 예기치 못한 오류 처리
        }
    }

    // 회원가입 처리 메서드
    static async signUp(
        email: string,
        password: string,
        confirmPassword: string
    ): Promise<{ success: boolean; error?: string }> {
        // 이메일 형식이 유효한지 확인
        if (!validateEmail(email)) {
            return {success: false, error: "Invalid email format."}; // 이메일 형식 오류
        }
        // 비밀번호가 6자 이상인지 확인
        if (password.length < 6) {
            return {success: false, error: "Password must be at least 6 characters."}; // 비밀번호 길이 오류
        }
        // 비밀번호와 확인 비밀번호가 일치하는지 확인
        if (password !== confirmPassword) {
            return {success: false, error: "Passwords do not match."}; // 비밀번호 불일치 오류
        }
        try {
            // authService의 signUp 메서드를 호출하여 회원가입 처리
            const isSuccess = await authService.signUp(email, password);
            if (isSuccess) {
                return {success: true}; // 회원가입 성공
            }
            return {success: false, error: "Email is already registered."}; // 이미 등록된 이메일 오류
        } catch {
            return {success: false, error: "An error occurred. Please try again."}; // 예기치 못한 오류 처리
        }
    }
}