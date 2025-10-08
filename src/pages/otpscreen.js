import React, { useState, useRef, useEffect } from "react";
import "../assets/styles/otp.css";
import { message, Button } from "antd";
import bluelogo_icon from "../assets/images/car.svg";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import arrow_icon1 from "../assets/images/white_tick.svg";
import bluelogo_icon1 from "../assets/images/black_arrow.svg";
import bluelogo_icon2 from "../assets/images/Frame.svg";
import { loginApi } from "../services/api";
import { setResetLogin } from "../redux/actions/authActions";

const OtpScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [otperrormsg, setOtpErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const OTP_LENGTH = 4;
  const OTP_INPUT_IDS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-${i}`);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const { email } = useSelector(state => state.auth);  
  const isLoggedIn = !!email;

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) navigate('/');
  }, [isLoggedIn, navigate]);

  // OTP timer initialization
  useEffect(() => {
    const now = Date.now();
    const fromLogin = localStorage.getItem("fromLogin");
    const savedEndTime = Number(localStorage.getItem("otpEndTime"));

    if (fromLogin === "true" || !savedEndTime || savedEndTime <= now) {
      const newEndTime = now + 60 * 1000;
      localStorage.setItem("otpEndTime", newEndTime);
      localStorage.removeItem("fromLogin");
      setTimer(60);
      setIsTimerRunning(true);
    } else {
      const remaining = Math.ceil((savedEndTime - now) / 1000);
      setTimer(remaining > 0 ? remaining : 0);
      setIsTimerRunning(remaining > 0);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLoginClick = () => navigate("/ForgotPassword");

  const handleButtonClick = async () => {
    setOtpErrorMsg("");
    const joined = otp.join("");
    if (joined.length !== OTP_LENGTH) {
      setOtpErrorMsg("Please enter the full OTP.");
      return;
    }

    const otpRegex = new RegExp(`^\\d{${OTP_LENGTH}}$`);
    if (!otpRegex.test(joined)) {
      setOtpErrorMsg("OTP should contain numbers only.");
      return;
    }

    const body = { otp: joined, request_id: userData.request_id };
    setLoading(true);
    try {
      const response = await loginApi.verifyotp(body);
      const userData = response.data;

      if (userData.status_code === 200) {
        dispatch(setResetLogin(userData.reset_token));
        messageApi.open({ type: "success", content: userData.message });
        navigate("/CreatePassword");
      } else {
        setLoading(false);
        messageApi.open({
          type: "error",
          content: userData.error || userData.message || "Unknown error",
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during OTP verification:", error);
      messageApi.open({
        type: "error",
        content: (error?.response?.data?.message) || error.message || "Network error",
      });
    }
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];

    if (val) {
      newOtp[idx] = val[val.length - 1];
      setOtp(newOtp);
      setError("");
      if (idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
    } else {
      newOtp[idx] = "";
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasteData) return;
    const newOtp = Array.from({ length: OTP_LENGTH }, (_, i) => pasteData[i] || "");
    setOtp(newOtp);
    const nextIndex = Math.min(pasteData.length, OTP_LENGTH - 1);
    setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[idx]) newOtp[idx] = "";
      else if (idx > 0) inputRefs.current[idx - 1]?.focus();
      setOtp(newOtp);
    } else if (e.key === "ArrowLeft" && idx > 0) inputRefs.current[idx - 1]?.focus();
    else if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      if (!email) {
        messageApi.error('Email not found. Please start over.');
        return;
      }
      const response = await loginApi.resendotp({ email });
      const data = response.data;

      if (data) {
        const newEndTime = Date.now() + 60 * 1000;
        localStorage.setItem('otpEndTime', newEndTime);
        localStorage.setItem('userData', JSON.stringify(data));
        setOtp(["", "", "", ""]);
        inputRefs.current.forEach(input => input && (input.value = ""));
        setTimer(60);
        setIsTimerRunning(true);
        messageApi.success(data.message);
      }
    } catch (err) {
      console.error("Error during OTP resend:", err);
      messageApi.open({
        type: "error",
        content: (err?.response?.data?.message) || err.message || "Network error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page-wrapper">
      {contextHolder}
      <div className="otp-page">
        <div className="login-form">
          <div className="logo-wrapper">
            <img src={bluelogo_icon} alt="Souq Sayarat logo" />
          </div>
          <h2 className="otp-site-title">Souq Sayarat</h2>
          <h6 className="otp-site-subtitle">Verify Your Identity</h6>
          <h6 className="otp-subtitle">Enter the 4-digit verification code sent to your email</h6>

          {/* OTP Inputs */}
          <fieldset className="otp-inputs">
            <legend className="sr-only">OTP inputs</legend>
            {otp.map((digit, idx) => {
              let inputClass = "otp-input";
              if (digit) inputClass += " filled";
              if (error && (digit === "" || !/^\d$/.test(digit))) inputClass += " otp-input-error";
              return (
                <input
                  key={OTP_INPUT_IDS[idx]}
                  id={OTP_INPUT_IDS[idx]}
                  ref={el => (inputRefs.current[idx] = el)}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d{1}"
                  aria-label={`OTP digit ${idx + 1}`}
                  className={inputClass}
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(e, idx)}
                  onKeyDown={e => handleKeyDown(e, idx)}
                  onPaste={handlePaste}
                />
              );
            })}
          </fieldset>

          {otperrormsg && (
            <div className="otp-error" style={{ color: "#ff4d4f", textAlign: "center", margin: "8px 0" }}>
              {otperrormsg}
            </div>
          )}

          <div className="otp-timer-line">
            <span className="otp-timer-text">
              <span className="otp-text">Resend available in </span>
              <span className="otp-timer-count">{formatTime(timer)}</span>
            </span>
          </div>

          <div className="otp-resend-line">
            <button
              className={`otp-resend ${isTimerRunning ? "disabled" : "enabled"}`}
              onClick={!isTimerRunning ? handleResend : undefined}
              disabled={isTimerRunning}
              type="button"
            >
              Resend Code
            </button>
          </div>

          <Button
            className="otp-button"
            size="large"
            block
            onClick={handleButtonClick}
            loading={loading}
            disabled={loading || otp.join("").length !== OTP_LENGTH}
            aria-label="Verify Code"
            style={{
              backgroundColor: otp.join("").length === OTP_LENGTH ? "#008AD5" : "#E5E7EB",
              borderColor: otp.join("").length === OTP_LENGTH ? "#008AD5" : "#E5E7EB",
              color: "#fff",
            }}
          >
            <img src={arrow_icon1} alt="arrow" style={{ width: "12px", height: "12px", marginTop: "2px" }} />
            <span className="button-text-otp">Verify Code</span>
          </Button>

          <Button
            type="default"
            className="otp-button-back"
            size="large"
            block
            onClick={handleLoginClick}
            aria-label="Go Back"
          >
            <img src={bluelogo_icon1} alt="arrow" style={{ width: "12px", height: "12px", marginTop: "2px" }} />
            <span className="button-text-otp">Go Back</span>
          </Button>

          <div className="otp-button-back-1" role="region" aria-label="Security Notice">
            <div className="otp-button-content">
              <div className="otp-button-top">
                <img src={bluelogo_icon2} alt="icon" className="otp-button-icon" />
                <span className="button-text-otp">Security Notice</span>
              </div>
              <div className="otp-button-subtext">
                Never share your verification code with anyone. Our team will never ask for this code.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OtpScreen;
