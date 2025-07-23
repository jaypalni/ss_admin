import React, { useState } from "react";
import "../assets/styles/forgotpassword.css";
import { Input, Button, message } from "antd";
import Car_icon from "../assets/images/Car_icon.png";
import bluelogo_icon from "../assets/images/souqLogo_blue.svg";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [emailerrormsg, setEmailErrorMsg] = useState("");
  const [otperrormsg, setOtpErrorMsg] = useState("");

  const handleLoginClick = () => {
    navigate("/");
  };

  const handleButtonClick = () => {
    setEmailErrorMsg("");
    setOtpErrorMsg("");

    if (!isOtpSent) {
      if (!email) {
        setEmailErrorMsg("Please enter your email.");
        return;
      }
      if (!email.endsWith("@SouqSayarat.com")) {
        setEmailErrorMsg("Email must end with '@SouqSayarat.com'.");
        return;
      }

      setIsOtpSent(true);
      message.success("OTP sent to your email.");
    } else {
      if (!otp) {
        setOtpErrorMsg("Please enter the OTP.");
        return;
      }

      const otpRegex = /^[0-9]+$/;
      if (!otpRegex.test(otp)) {
        setOtpErrorMsg("OTP should contain numbers only.");
        return;
      }

      message.success("OTP verified successfully.");
      navigate("/CreatePassword");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-page">
        <div className="login-form">
          <img src={bluelogo_icon} alt="left side" className="ssblue-logo" />
          <h2>Forgot Password</h2>

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
            disabled={isOtpSent}
          />
          {emailerrormsg && (
            <div className="emailerror-msg">{emailerrormsg}</div>
          )}

          {isOtpSent && (
            <>
              <Input
                placeholder="OTP"
                className="input-field"
                size="large"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setOtpErrorMsg("");
                }}
              />
              {otperrormsg && (
                <div className="emailerror-msg">{otperrormsg}</div>
              )}
            </>
          )}

          <Button
            type="primary"
            className="login-button"
            size="large"
            block
            onClick={handleButtonClick}
          >
            {isOtpSent ? "Verify OTP" : "Get OTP"}
          </Button>

          <div
            style={{ textAlign: "center", fontSize: "16px", marginTop: "12px" }}
          >
            Remember your password?{" "}
            <span
              style={{
                fontWeight: "bold",
                color: "black",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.target.style.color = "#6c63ff")}
              onMouseOut={(e) => (e.target.style.color = "black")}
              onClick={handleLoginClick}
            >
              Login
            </span>
          </div>
        </div>

        <div className="image-section">
          <img src={Car_icon} alt="Right side" className="side-image" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
