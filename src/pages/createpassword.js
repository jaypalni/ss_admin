import React, { useState,useEffect } from "react";
import "../assets/styles/createpassword.css";
import { Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import bluelogo_icon1 from "../assets/images/black_arrow.svg";
import bluelogo_icon2 from "../assets/images/Frame.svg";
import arrow_icon1 from "../assets/images/svg.svg";
import bluelogo_icon from "../assets/images/car.svg";
import { loginApi } from "../services/api";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

// Helper function to validate password requirements
const validatePasswordRequirements = (password) => {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-={}[\]:;"\\|,.<>/?]/.test(password),
  };
};

// Helper function to check if all requirements are met
const areAllRequirementsMet = (requirements) => {
  return requirements.length && requirements.upper && requirements.lower && 
         requirements.number && requirements.special;
};

// Helper function to validate password form
const validatePasswordForm = (newPassword, reenterPassword, allRequirementsMet) => {
  if (!newPassword) {
    return { field: "password", message: "Please enter a new password." };
  }
  if (!allRequirementsMet) {
    return { field: "password", message: "Password does not meet all requirements." };
  }
  if (!reenterPassword) {
    return { field: "reenter", message: "Please retype your password." };
  }
  if (newPassword !== reenterPassword) {
    return { field: "reenter", message: "Passwords do not match." };
  }
  return null;
};

// Helper function to handle API response
const handleApiResponse = async (apiCall, body, messageApi, setLoading, navigate) => {
  try {
    const response = await apiCall(body);
    const userData = response.data;
    
    if (userData.status_code === 200) {
      messageApi.open({ type: 'success', content: userData.message });
      setLoading(false);
      navigate("/");
    } else {
      messageApi.open({ type: 'error', content: userData.error });
      setLoading(false);
    }
  } catch (error) {
    console.error("Error during password update", error);
    messageApi.open({ type: 'error', content: error.message });
    setLoading(false);
  }
};

// Helper function to check if submit button should be enabled
const isSubmitEnabled = (newPassword, reenterPassword, allRequirementsMet, passwordsMatch) => {
  return newPassword && reenterPassword && allRequirementsMet && passwordsMatch;
};

// Password Requirements Component
const PasswordRequirements = ({ requirements }) => {
  const requirementItems = [
    { key: "length", met: requirements.length, text: "At least 8 characters long" },
    { key: "upper", met: requirements.upper, text: "One uppercase letter" },
    { key: "lower", met: requirements.lower, text: "One lowercase letter" },
    { key: "number", met: requirements.number, text: "One number" },
    { key: "special", met: requirements.special, text: "One special character" },
  ];

  return (
    <div className="create-button-back-password" role="region" aria-label="Password requirements">
      <div className="create-button-content-pass">
        <div className="create-button-top">
          <span className="create-text-otp-pass">Password Requirements:</span>
        </div>
        <div className="create-button-subtext-pass">
          {requirementItems.map((item) => (
            <div key={item.key} className="requirement-item">
              <span className={`requirement-check ${item.met ? "met" : ""}`} aria-hidden>
                {item.met ? "✓" : ""}
              </span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CreatePassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [passworderrormsg, setPasswordErrorMsg] = useState("");
  const [reenterpassworderrormsg, setReenterPasswordErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const {email,need_password} = useSelector((state) => state.auth);

  const passwordRequirements = validatePasswordRequirements(newPassword);
  const allRequirementsMet = areAllRequirementsMet(passwordRequirements);
  const passwordsMatch = newPassword !== "" && newPassword === reenterPassword;

  const isLoggedIn = email;
  
  useEffect(() => {
    console.log('OTP Screen useEffect - isLoggedIn:', isLoggedIn);
    
    if (!isLoggedIn) {
      navigate('/');
    } else {
      console.log('User not logged in or coming from login flow, staying on OTP screen');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (passworderrormsg) setPasswordErrorMsg("");
    if (reenterpassworderrormsg) setReenterPasswordErrorMsg("");
  }, [newPassword, reenterPassword, passworderrormsg, reenterpassworderrormsg]);

  const handleLoginClick = () => {
    navigate("/ForgotPassword");
  };

  const handleResetPassword = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    setPasswordErrorMsg("");
    setReenterPasswordErrorMsg("");

    // Validate form using helper function
    const validationError = validatePasswordForm(newPassword, reenterPassword, allRequirementsMet);
    if (validationError) {
      if (validationError.field === "password") {
        setPasswordErrorMsg(validationError.message);
      } else if (validationError.field === "reenter") {
        setReenterPasswordErrorMsg(validationError.message);
      }
      return;
    }

    setLoading(true);
    
    // Determine which API to call and prepare body
    if (need_password === 1) {
      const body = { email: email, new_password: newPassword };
      handleApiResponse(loginApi.createnewpassword, body, messageApi, setLoading, navigate);
    } else {
      const body = { new_password: newPassword };
      handleApiResponse(loginApi.resetpassword, body, messageApi, setLoading, navigate);
    }
  };

  return (
    <div className="create-page-wrapper">
      {contextHolder}
      <div className="create-page">
        <div className="create-form">
          <div className="logo-wrapper">
  <img src={bluelogo_icon} alt="Souq Sayarat logo" />
</div>
          <h2 className="create-site-title">Souq Sayarat</h2>
          <h2 className="create-title">Create New Password</h2>
          <h6 className="create-subtitle">Enter your new password to complete the reset process</h6>
 <form className="login-card" onSubmit={handleResetPassword} aria-label="Login form">
          <div className="form-group-create">
            <label htmlFor="password-input" className="create-label">New Password</label>
            <Input.Password
              id="password-input"
              placeholder="Enter your new password"
              className="create-field1"
              size="large"
              value={newPassword}
              aria-label="New Password"
              aria-describedby={passworderrormsg ? "password-error" : undefined}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {passworderrormsg && (
              <div id="password-error" className="passworderror-msg">
                {passworderrormsg}
              </div>
            )}
          </div>

          <div className="form-group-create">
            <label htmlFor="confirm-password-input" className="create-label">Confirm Password</label>
            <Input.Password
              id="confirm-password-input"
              placeholder="Confirm your new password"
              className="create-field1"
              size="large"
              value={reenterPassword}
              aria-label="Confirm Password"
              aria-describedby={reenterpassworderrormsg ? "reenter-password-error" : undefined}
              onChange={(e) => setReenterPassword(e.target.value)}
            />
            {reenterpassworderrormsg && (
              <div id="reenter-password-error" className="passworderror-msg">
                {reenterpassworderrormsg}
              </div>
            )}
            {reenterPassword.length > 0 && (
              <div style={{ marginTop: 6, color: passwordsMatch ? "#10B981" : "#EF4444", fontSize: 13 }}>
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </div>
            )}
          </div>

          <PasswordRequirements requirements={passwordRequirements} />

          <Button
            className="create-button"
            size="large"
            block
            htmlType="submit"
            loading={loading}
            disabled={loading || !allRequirementsMet || !passwordsMatch}
            style={{
              backgroundColor: isSubmitEnabled(newPassword, reenterPassword, allRequirementsMet, passwordsMatch) ? "#008AD5" : "#E5E7EB", 
              borderColor: isSubmitEnabled(newPassword, reenterPassword, allRequirementsMet, passwordsMatch) ? "#008AD5" : "#E5E7EB",
              color: "#fff",
            }}
          >
            <img src={arrow_icon1} alt="arrow" style={{ width: "12px", height: "12px", marginTop: "2px" }} />
            <span className="create-text-otp">Reset Password</span>
          </Button>

          <Button
            type="default"
            className="create-button-back"
            size="large"
            block
            onClick={handleLoginClick}
            aria-label="Back to Verification"
          >
            <img src={bluelogo_icon1} alt="arrow" style={{ width: "12px", height: "12px", marginTop: "2px" }} />
            <span className="create-text-otp-1">Back to Verification</span>
          </Button>

          <Button
            type="default"
            className="create-button-back-1"
            size="large"
            block
            onClick={() => {}}
            aria-label="Security Notice"
          >
            <div className="create-button-content">
              <div className="create-button-top">
                <img src={bluelogo_icon2} alt="icon" className="create-button-icon" />
                <span className="create-text-otp">Security Notice</span>
              </div>

              <div className="create-button-subtext">
                Never share your verification code with anyone. Our team will never ask for this code.
              </div>
            </div>
          </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

PasswordRequirements.propTypes = {
  requirements: PropTypes.shape({
    length: PropTypes.bool.isRequired,
    upper: PropTypes.bool.isRequired,
    lower: PropTypes.bool.isRequired,
    number: PropTypes.bool.isRequired,
    special: PropTypes.bool.isRequired,
  }).isRequired,
};

export default CreatePassword;
