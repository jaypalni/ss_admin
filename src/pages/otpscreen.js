import React, { useState, useRef, useEffect } from "react";
import "../assets/styles/otp.css";
import { message, Button } from "antd";
import bluelogo_icon from "../assets/images/div.svg";
import { useNavigate } from "react-router-dom";
import arrow_icon1 from "../assets/images/white_tick.svg";
import bluelogo_icon1 from "../assets/images/black_arrow.svg";
import bluelogo_icon2 from "../assets/images/Frame.svg";

const OtpScreen = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otperrormsg, setOtpErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]); // will hold HTMLInputElement refs
  const OTP_LENGTH = 4;
  const OTP_INPUT_IDS = Array.from({ length: OTP_LENGTH }, (_, i) => `otp-${i}`);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Initialize OTP timer (on mount)
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

  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
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

  const handleLoginClick = () => {
    navigate("/ForgotPassword");
  };

  const handleButtonClick = () => {
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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("OTP verified successfully.");
      navigate("/CreatePassword");
    }, 900);
  };

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];

    if (val) {
      // take only last digit entered (handles paste of multiple digits into one input)
      newOtp[idx] = val[val.length - 1];
      setOtp(newOtp);
      setError("");
      if (idx < OTP_LENGTH - 1) {
        inputRefs.current[idx + 1]?.focus();
        inputRefs.current[idx + 1]?.select?.();
      }
    } else {
      newOtp[idx] = "";
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const newOtp = [...otp];

    pasteData.split("").forEach((digit, i) => {
      newOtp[i] = digit;
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = digit;
      }
    });

    setOtp(newOtp);

    const nextIndex = pasteData.length < OTP_LENGTH ? pasteData.length : OTP_LENGTH - 1;
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[idx]) {
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
        // also clear previous if needed:
        // newOtp[idx - 1] = '';
        // setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  // Resend logic: disabled while timer is running
  const handleResend = async () => {
    if (isTimerRunning) return; // double safety
    setLoading(true);
    try {
      // TODO: call your backend resend endpoint here, await result
      // simulate network delay
      await new Promise((res) => setTimeout(res, 700));

      // Reset timer and start again
      const now = Date.now();
      const newEndTime = now + 60 * 1000;
      localStorage.setItem("otpEndTime", newEndTime);
      setTimer(60);
      setIsTimerRunning(true);
      setOtp(["", "", "", ""]); // clear inputs
      setIsOtpSent(true); // mark that OTP has been resent (optional)
      setOtpErrorMsg("");
      message.success("OTP resent.");
    } catch (err) {
      message.error("Failed to resend OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-page-wrapper">
      <div className="otp-page">
        <div className="login-form">
          <img src={bluelogo_icon} alt="Souq Sayarat logo" className="ssblue-logo1" />
          <h2 className="otp-site-title">Souq Sayarat</h2>
          <h6 className="otp-site-subtitle">Verify Your Identity</h6>

          <h6 className="otp-subtitle">Enter the 4-digit verification code sent to your email</h6>

          <div className="otp-inputs" role="group" aria-label="OTP inputs">
            {otp.map((digit, idx) => {
              let inputClass = "otp-input";
              if (digit) inputClass += " filled";
              if (error && (digit === "" || !/^\d$/.test(digit))) inputClass += " otp-input-error";

              return (
                <input
                  key={OTP_INPUT_IDS[idx]}
                  id={OTP_INPUT_IDS[idx]}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="\d{1}"
                  aria-label={`OTP digit ${idx + 1}`}
                  className={inputClass}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={handlePaste}
                />
              );
            })}
          </div>

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
    <span
      className={`otp-resend ${isTimerRunning ? "disabled" : "enabled"}`}
      onClick={!isTimerRunning ? handleResend : undefined}
      role="button"
      aria-disabled={isTimerRunning}
    >
      Resend Code
    </span>
  </div>

          <Button
            type="primary"
            className="otp-button"
            size="large"
            block
            onClick={handleButtonClick}
            loading={loading}
            disabled={loading}
            aria-label={isOtpSent ? "Verify Code" : "Verify Code"}
          >
            <img src={arrow_icon1} alt="arrow" style={{ width: "12px", height: "12px", marginTop: "2px" }} />
            <span className="button-text-otp">{isOtpSent ? "Verify Code" : "Verify Code"}</span>
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

           <Button
  type="default"
  className="otp-button-back-1"
  size="large"
  block
  onClick={""}
  aria-label="Security Notice"
>
  <div className="otp-button-content">
    <div className="otp-button-top">
      <img
        src={bluelogo_icon2}
        alt="icon"
        className="otp-button-icon"
      />
      <span className="button-text-otp">Security Notice</span>
    </div>

    <div className="otp-button-subtext">
      Never share your verification code with anyone. Our team will never ask for this code.
    </div>
  </div>
           </Button>



        </div>
      </div>
    </div>
  );
};

export default OtpScreen;
