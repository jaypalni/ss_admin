import React, { useState } from "react";
import "../assets/styles/forgotpassword.css";
import { Input, Button, message } from "antd";
import { loginApi } from "../services/api";
import Car_icon from "../assets/images/Car_icon.png";
import bluelogo_icon from "../assets/images/car.svg";
import { useNavigate } from "react-router-dom";
import arrow_icon from "../assets/images/tick.svg";
import arrow_icon1 from "../assets/images/arrow.svg";
import bluelogo_icon1 from "../assets/images/message.svg";
import { useDispatch } from "react-redux";
import { setEmailLogin } from "../redux/actions/authActions";
import {handleApiResponse,handleApiError} from "../utils/apiUtils"


const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [emailerrormsg, setEmailErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleLoginClick = () => {
    navigate("/");
  };

  const handleForgot = async (e) => {
    if (e) e.preventDefault();
    console.log("handleForgot start", { email });

    setEmailErrorMsg("");
    if (email.trim() === "") {
      setEmailErrorMsg("Please Enter Email Address");
      return;
    }

    const body = { email };
    setLoading(true);
    try {
      await userForgotAPI(body,email);
    } finally {
      setLoading(false);
    }
  };

  const userForgotAPI = async (body,email) => {
    try {
      console.log("Calling forgotpassword API with", body);
      const response = await loginApi.forgotpassword(body);
      const userData = handleApiResponse(response);

      if (userData.status_code === 200) {
        localStorage.setItem("fromLogin", "true");
        localStorage.setItem('userData', JSON.stringify(userData));
        dispatch(setEmailLogin(email));
        messageApi.open({ type: "success", content: userData.message });
        setIsOtpSent(true);
        setTimeout(() => {
           navigate("/OtpScreen");
        }, 1000);
       
      } else {
        messageApi.open({
          type: "error",
          content: userData.error || userData.message || "Unknown error",
        });
      }
    } catch (error) {
     const errorData = handleApiError(error);
                 messageApi.open({
                   type: "error",
                   content: errorData?.error || "Error fetching users",
                 });
    }
  };

  return (
    <div className="forgot-page-wrapper">
      {contextHolder}
      <div className="forgot-page">
        <div className="login-form">
          <div className="logo-wrapper-forgot">
            <img src={bluelogo_icon} alt="Souq Sayarat logo" />
          </div>
          <h2 className="forgot-site-title">Souq Sayarat</h2>
          <h6 className="forgot-site-subtitle">Admin Portal</h6>

          <img src={bluelogo_icon1} alt="Souq Sayarat logo" className="ssblue-forgot" />
          <h2 className="forgot-title">Forgot Password?</h2>
          <h6 className="forgot-subtitle">
            Enter your email address and we'll send you a verification code to reset your password.
          </h6>

          <form className="forgot-card" onSubmit={handleForgot} aria-label="Forgot form">
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
            />
            {emailerrormsg && <div className="emailerror-msg">{emailerrormsg}</div>}

            <Button
              type="primary"
              className="forgot-button"
              size="large"
              block
              htmlType="submit"
              loading={loading}
              aria-label="Send Verification Code"
            >
              <span className="button-text-forgot">Send Verification Code</span>
              <img src={arrow_icon1} alt="arrow" style={{ width: "12px", height: "12px", marginTop: "2px" }} />
            </Button>

            <div style={{ textAlign: "center", fontSize: "16px", marginTop: "12px" }}>
              <button
                type="button"
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
              >
                <img
                  src={arrow_icon}
                  alt="arrow"
                  style={{
    width: "12px",
    height: "12px",
    verticalAlign: "middle",
    marginRight: 4,
  }}
                />
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;