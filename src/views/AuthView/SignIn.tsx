import React, {useState} from "react";
import InputField from "../../components/common/InputField";
import {authService} from "../../services/authService";
import {validateEmail} from "../../util/validators";
import "./AuthView.css";

const SignIn: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(false); // 회원가입/로그인 모드 전환
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // 회원가입용 확인 비밀번호
    const [error, setError] = useState("");

    const handleSignIn = async () => {
        if (!validateEmail(email)) {
            setError("Invalid email format.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        try {
            const isSuccess = await authService.signIn(email, password);
            if (isSuccess) {
                window.location.href = "/"; // 메인 페이지로 이동
            } else {
                setError("Invalid email or password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    const handleSignUp = async () => {
        if (!validateEmail(email)) {
            setError("Invalid email format.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const isSuccess = await authService.signUp(email, password);
            if (isSuccess) {
                setIsSignUp(false); // 회원가입 성공 시 로그인 모드로 전환
                setError("");
            } else {
                setError("Email is already registered.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="auth-background">
            <div className={`auth-card-container ${isSignUp ? "flip" : ""}`}>
                <div className="auth-card front">
                    <br/>
                    <br/>
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

                    <br/>
                    <br/>
                    <button className="auth-button" onClick={handleSignIn}>
                        Sign In
                    </button>
                    <p className="auth-link">
                        Don't have an account?{" "}
                        <span className="link" onClick={() => setIsSignUp(true)}>
              Sign Up
            </span>
                    </p>
                </div>

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
                    <button className="auth-button" onClick={handleSignUp}>
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