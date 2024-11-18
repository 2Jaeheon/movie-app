import React, {useState} from "react";
import InputField from "../../components/common/InputField";
import {useAuth} from "../../hooks/useAuth";
import "./AuthView.css";

const SignIn: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(false); // 모드 전환

    // 회원가입 성공 시 로그인 화면으로 전환
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
    } = useAuth(() => setIsSignUp(false));

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
                    <button className="auth-button" onClick={signUp}>
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
        </div>
    );
};

export default SignIn;