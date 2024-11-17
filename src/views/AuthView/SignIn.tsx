import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import InputField from "../../components/common/InputField";
import {authService} from "../../services/authService";
import {validateEmail} from "../../util/validators";
import "./AuthView.css";

const SignIn: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
                navigate("/"); // 메인 페이지로 이동
            } else {
                setError("Invalid email or password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="auth-background">
            <div className="auth-card">
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
                <button className="auth-button" onClick={handleSignIn}>
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default SignIn;