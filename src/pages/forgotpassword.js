import React, { useState } from "react";
import "../assets/styles/forgotpassword.css";
import { Input, Button, message } from "antd";
import Car_icon from "../assets/images/Car_icon.png";
import bluelogo_icon from "../assets/images/div.svg";
import { useNavigate } from "react-router-dom";
import arrow_icon from "../assets/images/tick.svg";
import arrow_icon1 from "../assets/images/arrow.svg";
import bluelogo_icon1 from "../assets/images/message.svg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [emailerrormsg, setEmailErrorMsg] = useState("");
  const [otperrormsg, setOtpErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginClick = () => {
    navigate("/");
  };

  const emailHasAllowedDomain = (value) => {
    if (!value) return false;
    const lower = value.toLowerCase().trim();
    const allowed = [
      "@souqsayarat.com",
      "@souqsayarat.net",
      "@souqsayarat.iq",
    ];
    return allowed.some((d) => lower.endsWith(d));
  };

  const handleButtonClick = () => {

    // setEmailErrorMsg("");
    // setOtpErrorMsg("");
    //   if (!email) {
    //     setEmailErrorMsg("Please enter your email.");
    //     return;
    //   }

    //   const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (!basicEmailRegex.test(email)) {
    //     setEmailErrorMsg("Please enter a valid email address.");
    //     return;
    //   }

    //   if (!emailHasAllowedDomain(email)) {
    //     setEmailErrorMsg("Use your company email (…@souqsayarat.com / …@souqsayarat.net / …@souqsayarat.iq).");
    //     return;
    //   }

    //   setLoading(true);
    //   setTimeout(() => {
    //     setLoading(false);
    //     setIsOtpSent(true);
    //     message.success("OTP sent to your email.");
    //   }, 900);
     navigate("/OtpScreen");
  };

  return (
    <div className="forgot-page-wrapper">
      <div className="forgot-page">
        <div className="login-form">
          <img
            src={bluelogo_icon}
            alt="Souq Sayarat logo"
            className="ssblue-logo1"
          />
          <h2 className="forgot-site-title">Souq Sayarat</h2>
          <h6 className="forgot-site-subtitle">Admin Portal</h6>

<img
            src={bluelogo_icon1}
            alt="Souq Sayarat logo"
            className="ssblue-forgot"
          />
          <h2 className="forgot-title">Forgot Password?</h2>
<h6 className="forgot-subtitle">
  Enter your email address and we'll send you a verification code to
  reset your password.
</h6>

          <Input
            id="fp-email"
            placeholder="Enter your email address"
            className="input-field-forgot"
            type="email"
            size="large"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailErrorMsg("");
            }}
            disabled={isOtpSent}
            aria-invalid={!!emailerrormsg}
            aria-describedby={emailerrormsg ? "email-error" : undefined}
          />
          {emailerrormsg && (
            <div id="email-error" className="emailerror-msg">
              {emailerrormsg}
            </div>
          )}

          <Button
            type="primary"
            className="forgot-button"
            size="large"
            block
            onClick={handleButtonClick}
            loading={loading}
            disabled={loading}
            aria-label={isOtpSent ? "" : "Send Verification Code"}
          >
            <span className="button-text-forgot">
              {isOtpSent ? "" : "Send Verification Code"}
            </span>
            <img src={arrow_icon1} alt="arrow"  style={{ width: "12px", height: "12px",marginTop:"2px"}} />
          </Button>

          <div
  style={{
    textAlign: "center",
    fontSize: "16px",
    marginTop: "12px",
  }}
>
  <button
    onClick={handleLoginClick}
    style={{
      fontWeight: "bold",
      color: "#008AD5", 
      cursor: "pointer",
      background: "none",
      border: "none",
      padding: 0,
      font: "inherit",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px", 
    }}
    onMouseOver={(e) => (e.currentTarget.style.color = "#008AD5")}
    onMouseOut={(e) => (e.currentTarget.style.color = "#008AD5")}
  >
    <img
      src={arrow_icon}
      alt="arrow"
      style={{ width: "12px", height: "12px" ,justifyItems:"center",marginRight:"2px",marginTop:"1px"}}
    />
    Back to Login
  </button>
</div>


        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
