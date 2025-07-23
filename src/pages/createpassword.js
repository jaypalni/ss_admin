import React, { useState } from "react";
import "../assets/styles/loginscreen.css";
import { Input, Button, message } from "antd";
import Car_icon from "../assets/images/Car_icon.png";
import bluelogo_icon from "../assets/images/souqLogo_blue.svg";
import { useNavigate } from "react-router-dom";

const CreatePassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [passworderrormsg, setPasswordErrorMsg] = useState("");
  const [reenterpassworderrormsg, setReenterPasswordErrorMsg] = useState("");

  const handleLoginClick = () => {
    navigate("/");
  };

  const handleResetPassword = () => {
    setPasswordErrorMsg("");
    setReenterPasswordErrorMsg("");

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*\d).+$/;

    if (!newPassword) {
      setPasswordErrorMsg("Please enter a new password.");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setPasswordErrorMsg(
        "Password must have at least one capital letter, one special character, and one number."
      );
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

    message.success("Password reset successfully!");
    navigate("/"); 
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-page">
        <div className="login-form">
          <img src={bluelogo_icon} alt="left side" className="ssblue-logo" />
          <h2>Create New Password</h2>

          <Input.Password
            placeholder="Enter Password"
            className="input-field"
            size="large"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordErrorMsg("");
            }}
          />
          {passworderrormsg && (
            <div className="passworderror-msg">{passworderrormsg}</div>
          )}

          <Input.Password
            placeholder="Retype your Password"
            className="input-field"
            size="large"
            value={reenterPassword}
            onChange={(e) => {
              setReenterPassword(e.target.value);
              setReenterPasswordErrorMsg("");
            }}
          />
          {reenterpassworderrormsg && (
            <div className="passworderror-msg">{reenterpassworderrormsg}</div>
          )}

          <Button
            type="primary"
            className="login-button"
            size="large"
            block
            onClick={handleResetPassword}
          >
            Reset Password
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

export default CreatePassword;
