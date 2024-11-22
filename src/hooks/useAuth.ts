import {useState} from "react";
import {AuthController} from "../controllers/AuthController"; // AuthController 임포트

// 로그인 및 회원가입을 위한 custom hook
export const useAuth = (onSignUpSuccess?: () => void) => {
    const [email, setEmail] = useState(""); // 이메일 상태 관리
    const [password, setPassword] = useState(""); // 비밀번호 상태 관리
    const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태 관리
    const [error, setError] = useState(""); // 에러 메시지 상태 관리

    // 로그인 함수
    const signIn = async (): Promise<void> => {
        // AuthController의 signIn 메서드를 호출하여 로그인 처리
        const {success, error} = await AuthController.signIn(email, password);
        if (success) {
            window.location.href = "/movie-app/"; // 로그인 성공 시 메인 화면으로 리디렉션
        } else {
            setError(error || "Unknown error occurred."); // 로그인 실패 시 에러 메시지 설정
        }
    };

    // 회원가입 함수
    const signUp = async (): Promise<void> => {
        // AuthController의 signUp 메서드를 호출하여 회원가입 처리
        const {success, error} = await AuthController.signUp(email, password, confirmPassword);
        if (success) {
            setError(""); // 회원가입 성공 시 에러 메시지 초기화
            if (onSignUpSuccess) onSignUpSuccess(); // 회원가입 성공 시 전달된 콜백 함수 호출
        } else {
            setError(error || "Unknown error occurred."); // 회원가입 실패 시 에러 메시지 설정
        }
    };

    return {
        email,
        setEmail, // 이메일 상태 변경 함수
        password,
        setPassword, // 비밀번호 상태 변경 함수
        confirmPassword,
        setConfirmPassword, // 비밀번호 확인 상태 변경 함수
        error,
        setError, // 에러 상태 변경 함수
        signIn, // 로그인 함수
        signUp, // 회원가입 함수
    };
};