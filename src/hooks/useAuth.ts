import {useState} from "react";
import {AuthController} from "../controllers/AuthController";

export const useAuth = (onSignUpSuccess?: () => void) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const signIn = async (): Promise<void> => {
        const {success, error} = await AuthController.signIn(email, password);
        if (success) {
            window.location.href = "/"; // 로그인 성공 시 메인 화면으로 이동
        } else {
            setError(error || "Unknown error occurred.");
        }
    };

    const signUp = async (): Promise<void> => {
        const {success, error} = await AuthController.signUp(email, password, confirmPassword);
        if (success) {
            setError("");
            if (onSignUpSuccess) onSignUpSuccess(); // 회원가입 성공 시 콜백 호출
        } else {
            setError(error || "Unknown error occurred.");
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        setError,
        signIn,
        signUp,
    };
};