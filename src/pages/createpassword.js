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

const CreatePassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [passworderrormsg, setPasswordErrorMsg] = useState("");
  const [reenterpassworderrormsg, setReenterPasswordErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const {email,token,need_password} = useSelector((state) => state.auth);

  const [reqLength, setReqLength] = useState(false);
  const [reqUpper, setReqUpper] = useState(false);
  const [reqLower, setReqLower] = useState(false);
  const [reqNumber, setReqNumber] = useState(false);
  const [reqSpecial, setReqSpecial] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const allRequirementsMet = reqLength && reqUpper && reqLower && reqNumber && reqSpecial;

   const isLoggedIn = email
        useEffect(() => {
         console.log('OTP Screen useEffect - isLoggedIn:', isLoggedIn);
         
         if (!isLoggedIn) {
           navigate('/');
         } else {
           console.log('User not logged in or coming from login flow, staying on OTP screen');
         }
       }, [isLoggedIn, navigate]);

  useEffect(() => {
    setReqLength(newPassword.length >= 8);
    setReqUpper(/[A-Z]/.test(newPassword));
    setReqLower(/[a-z]/.test(newPassword));
    setReqNumber(/\d/.test(newPassword));
    setReqSpecial(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword));

    setPasswordsMatch(newPassword !== "" && newPassword === reenterPassword);

    if (passworderrormsg) setPasswordErrorMsg("");
    if (reenterpassworderrormsg) setReenterPasswordErrorMsg("");
  }, [newPassword, reenterPassword]);

  const handleLoginClick = () => {
    navigate("/ForgotPassword");
  };

  const handleResetPassword = (e) => {
     if (e) {
      e.preventDefault();
    }
    setPasswordErrorMsg("");
    setReenterPasswordErrorMsg("");

    if (!newPassword) {
      setPasswordErrorMsg("Please enter a new password.");
      return;
    }

    if (!allRequirementsMet) {
      setPasswordErrorMsg("Password does not meet all requirements.");
      return;
    }

    if (!reenterPassword) {
      setReenterPasswordErrorMsg("Please retype your password.");
      return;
    }

    if (newPassword !== reenterPassword) {
      setReenterPasswordErrorMsg("Passwords do not match.");
      return;
    }
    const body1 = {
      email:email,
      new_password: newPassword,
    };
    const body = {
      new_password: newPassword,
    };
    setLoading(true);
    if(need_password === 1){
      updatePassword1(body1);
    }else {
      updatePassword(body);
    }
   
  };

  const updatePassword = async (body) => {

      try {
        const response = await loginApi.resetpassword(body);
        const userData = response.data;
        if (userData.status_code === 200) {
          messageApi.open({ type: 'success', content: userData.message  });
          setLoading(false);
          navigate("/");
        } else {
           messageApi.open({ type: 'error', content: userData.error  });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during login", error);
        messageApi.open({ type: 'error', content: error.message  });
        setLoading(false);
      }
    };

     const updatePassword1 = async (body) => {

      try {
        const response = await loginApi.createnewpassword(body);
        const userData = response.data;
        if (userData.status_code === 200) {
          messageApi.open({ type: 'success', content: userData.message  });
          setLoading(false);
          navigate("/");
        } else {
           messageApi.open({ type: 'error', content: userData.error  });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during login", error);
        messageApi.open({ type: 'error', content: error.message  });
        setLoading(false);
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

          <div className="create-button-back-password" role="region" aria-label="Password requirements">
            <div className="create-button-content-pass">
              <div className="create-button-top">
                <span className="create-text-otp-pass">Password Requirements:</span>
              </div>
              <div className="create-button-subtext-pass">
                <div className="requirement-item">
                  <span className={`requirement-check ${reqLength ? "met" : ""}`} aria-hidden>{reqLength ? "✓" : ""}</span>
                  <span>At least 8 characters long</span>
                </div>
                <div className="requirement-item">
                  <span className={`requirement-check ${reqUpper ? "met" : ""}`} aria-hidden>{reqUpper ? "✓" : ""}</span>
                  <span>One uppercase letter</span>
                </div>
                <div className="requirement-item">
                  <span className={`requirement-check ${reqLower ? "met" : ""}`} aria-hidden>{reqLower ? "✓" : ""}</span>
                  <span>One lowercase letter</span>
                </div>
                <div className="requirement-item">
                  <span className={`requirement-check ${reqNumber ? "met" : ""}`} aria-hidden>{reqNumber ? "✓" : ""}</span>
                  <span>One number</span>
                </div>
                <div className="requirement-item">
                  <span className={`requirement-check ${reqSpecial ? "met" : ""}`} aria-hidden>{reqSpecial ? "✓" : ""}</span>
                  <span>One special character</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="create-button"
            size="large"
            block
             htmlType="submit"
            loading={loading}
            disabled={loading || !allRequirementsMet || !passwordsMatch}
             style={{
    backgroundColor: newPassword && reenterPassword && allRequirementsMet && passwordsMatch ? "#008AD5" : "#E5E7EB", 
    borderColor: newPassword && reenterPassword && allRequirementsMet && passwordsMatch ? "#008AD5" : "#E5E7EB",
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

export default CreatePassword;
