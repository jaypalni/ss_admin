import React, { useState } from "react";
import "../assets/styles/loginscreen.css";
import { Input, Button, message } from "antd";
import Car_icon from "../assets/images/Car_icon.png";
import bluelogo_icon from "../assets/images/souqLogo_blue.svg";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/api";
const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailerrormsg, setEmailErrorMsg] = useState("");
  const [passworderrormsg, setPasswordErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    let hasError = false;
    setEmailErrorMsg("");
    setPasswordErrorMsg("");
    if (email.trim() === "") {
      setEmailErrorMsg("Please Enter Email ID");
      hasError = true;
    }
    if (password.trim() === "") {
      setPasswordErrorMsg("Please Enter Password");
      hasError = true;
    }
    if (hasError) return;
    if (!email.endsWith("@souqsayarat.com")) {
      setEmailErrorMsg("Email must end with '@souqsayarat.com'.");
      return;
    }
    // const passwordRegex =
    //   /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*\d).+$/;
    // if (!passwordRegex.test(password)) {
    //   setPasswordErrorMsg(
    //     "Password must contain at least one capital letter, one special character, and one number."
    //   );
    //   return;
    // }
    const body = {
      email: email,
      password: password,
    };
    console.log("Body", body);
    setLoading(true);
    userloginAPI(body);
  };
  const userloginAPI = async (body) => {
    try {
      const response = await loginApi.login(body);
      const userData = response?.data || response;
      if (response.status === 200 || userData.statusCode === 200) {
        message.success("Successfully Logged In");
        localStorage.setItem("token", userData?.access_token);
        localStorage.setItem("isSuperAdmin", userData?.is_super_admin);
        setLoading(false);
        if (userData?.needs_password_update === 1) {
          navigate("/createpassword");
        } else {
          navigate("/dashboard");
        }
      } else {
        message.error(userData?.error || "Login failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during login", error);
      message.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };
  return (
    <div className="login-page-wrapper">
      <div className="login-page">
        <div className="login-form">
          <img src={bluelogo_icon} alt="left side" className="ssblue-logo" />
          <h2>Login</h2>
          <Input
            placeholder="Email"
            className="input-field"
            type="email"
            size="large"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailErrorMsg("");
            }}
          />
          {emailerrormsg && (
            <div className="emailerror-msg">{emailerrormsg}</div>
          )}
          <Input.Password
            placeholder="Password"
            className="input-field"
            size="large"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordErrorMsg("");
            }}
          />
          {passworderrormsg && (
            <div className="passworderror-msg">{passworderrormsg}</div>
          )}
          <div
            className="forgot-password"
            onClick={() => navigate("/ForgotPassword")}
          >
            <a style={{ cursor: "pointer" }}>Forgot password?</a>
          </div>
          <Button
            type="primary"
            className="login-button"
            size="large"
            block
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
        <div className="image-section">
          <img src={Car_icon} alt="Right side" className="side-image" />
        </div>
      </div>
    </div>
  );
};
export default LoginScreen;
