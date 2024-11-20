import React, {useState} from "react";
import InputField from "../../components/common/InputField";
import {useAuth} from "../../hooks/useAuth";
import Toast from "../../components/common/Toast"; // Toast 컴포넌트 임포트
import "./AuthView.css";

const SignIn: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(false); // 모드 전환
    const [toastMessage, setToastMessage] = useState<string>(""); // Toast 메시지
    const [toastVisible, setToastVisible] = useState<boolean>(false); // Toast 표시 여부
    const [toastType, setToastType] = useState<"success" | "error">("success"); // Toast 타입
    const [isAgree, setIsAgree] = useState(false); // 약관 동의 여부
    const [isModalVisible, setIsModalVisible] = useState(false); // Modal 표시 여부

    const {
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        error,
        signIn,
        signUp,
    } = useAuth(() => {
        setToastType("success");
        setToastMessage(isSignUp ? "Account created successfully!" : "Logged in successfully!");
        setToastVisible(true);
        if (isSignUp) setIsSignUp(false); // 회원가입 성공 시 로그인 화면으로 전환
    });

    const handleToastClose = () => {
        setToastVisible(false);
    };

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    return (
        <div className="auth-background">
            <div className={`auth-card-container ${isSignUp ? "flip" : ""}`}>
                {/* 로그인 카드 */}
                <div className="auth-card front">
                    <h1 className="auth-title">Welcome Back!</h1>
                    <p className="auth-subtitle">Sign in to continue</p>
                    <div className="input-wrapper">
                        <InputField
                            label="Email"
                            type="text"
                            placeholder="Enter your email"
                            value={email}
                            onChange={setEmail}
                        />
                    </div>
                    <div className="input-wrapper">
                        <InputField
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={setPassword}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button className="auth-button" onClick={signIn}>
                        Sign In
                    </button>
                    <p className="auth-link">
                        Don't have an account?{" "}
                        <span className="link" onClick={() => setIsSignUp(true)}>
                            Sign Up
                        </span>
                    </p>
                </div>

                {/* 회원가입 카드 */}
                <div className="auth-card back">
                    <h1 className="auth-title">Create an Account</h1>
                    <p className="auth-subtitle">Join us and explore great movies!</p>
                    <div className="input-wrapper">
                        <InputField
                            label="Email"
                            type="text"
                            placeholder="Enter your email"
                            value={email}
                            onChange={setEmail}
                        />
                    </div>
                    <div className="input-wrapper">
                        <InputField
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={setPassword}
                        />
                    </div>
                    <div className="input-wrapper">
                        <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="terms-checkbox">
                        <input
                            type="checkbox"
                            id="termsAgree"
                            checked={isAgree}
                            onChange={() => setIsAgree(!isAgree)}
                        />
                        <label htmlFor="termsAgree">
                            <span className="link" onClick={toggleModal}>
                                I agree to the Terms and Conditions
                            </span>
                        </label>
                    </div>

                    <button
                        className="auth-button"
                        onClick={signUp}
                        disabled={!isAgree} // 버튼을 약관에 동의하지 않으면 비활성화
                    >
                        Sign Up
                    </button>
                    <p className="auth-link">
                        Already have an account?{" "}
                        <span className="link" onClick={() => setIsSignUp(false)}>
                            Sign In
                        </span>
                    </p>
                </div>
            </div>

            {/* Terms Modal */}
            {isModalVisible && (
                <div className="terms-modal">
                    <div className="modal-service">
                        <h2>Terms and Conditions</h2>
                        <p>
                            {/* Place your actual terms and conditions text here */}
                            1. 서비스 이용 약관 동의
                            본 서비스 이용약관(이하 "약관")에 동의함에 있어 다음 사항을 확인하고 동의합니다.<br/><br/>

                            1.1 개인정보 수집 및 이용 동의

                            서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다.수집된 개인정보는 서비스 목적 외 다른 용도로 사용하지 않습니다.<br/><br/>

                            1.2 서비스 이용 조건<br/>

                            서비스 이용 시 관련 법규 및 약관을 준수해야 합니다.
                            부적절한 이용 행위 발견 시 서비스 이용을 제한할 수 있습니다.<br/><br/>

                            2. 개인정보 처리방침<br/>
                            2.1 개인정보의 수집 및 이용 목적<br/><br/>
                            2.2 수집하는 개인정보 항목<br/>

                            필수 정보: 이메일 주소
                        </p>
                        <button onClick={toggleModal} className="close-modal-button">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Toast 컴포넌트 */}
            <Toast
                message={toastMessage}
                type={toastType}
                isVisible={toastVisible}
                onClose={handleToastClose}
            />
        </div>
    );
};

export default SignIn;