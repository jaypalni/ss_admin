import React, { useState, useEffect } from "react";
import {
  message,
  Card,
  Row,
  Col,
  Button,
  Breadcrumb,
  Input,
  Divider,
  Form,
} from "antd";
import { useNavigate } from "react-router-dom";
import Right from "../assets/images/Right.svg";
import change from "../assets/images/change.svg";
import lock from "../assets/images/Lock.svg";
import bluelogo_icon2 from "../assets/images/Frame.svg";
import { loginApi } from "../services/api";
import PropTypes from "prop-types";
import { handleApiError } from "../utils/apiUtils";
import { encryptData } from "../utils/CryptoJS";

const validatePasswordRequirements = (password) => {
  const allowedSpecial = "@#$%&";
  const hasAllowedSpecial = new RegExp(`[${allowedSpecial}]`).test(password);
  const hasInvalidSpecial = /[^A-Za-z0-9@#$%&]/.test(password);

  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: hasAllowedSpecial && !hasInvalidSpecial,
    invalidSpecial: hasInvalidSpecial,
  };
};

const areAllRequirementsMet = (requirements) => {
  return requirements.length && requirements.upper && requirements.lower && 
         requirements.number && requirements.special;
};

const validatePasswordForm = (currentPassword, newPassword, reenterPassword, allRequirementsMet) => {
  if (!currentPassword) {
    return { field: "current", message: "Please enter your current password." };
  }
  if (!newPassword) {
    return { field: "new", message: "Please enter a new password." };
  }
  if (!allRequirementsMet) {
    return { field: "new", message: "Password does not meet all requirements." };
  }
  if (!reenterPassword) {
    return { field: "reenter", message: "Please retype your password." };
  }
  if (newPassword !== reenterPassword) {
    return { field: "reenter", message: "Passwords do not match." };
  }
  return null;
};

const PasswordRequirements = ({ requirements }) => {
  const requirementItems = [
    { key: "length", met: requirements.length, text: "At least 8 characters long" },
    { key: "upper", met: requirements.upper, text: "One uppercase letter" },
    { key: "lower", met: requirements.lower, text: "One lowercase letter" },
    { key: "number", met: requirements.number, text: "One number" },
    { key: "special", met: requirements.special, text: "One special character" },
  ];

  return (
    <section aria-label="Password requirements" className="create-button-back-password-1">
  <div className="create-button-content-pass">
    <div className="create-button-top">
      <span style={{ fontWeight: 400, fontSize: "12px", color: "#6B7280" }}>
        Password must contain:
      </span>
    </div>
    <div className="create-button-subtext-pass-1">
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
</section>

  );
};

const ChangePassword = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, ] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");

  const [currenterrormsg, setCurrenterrormsg] = useState("");
  const [passworderrormsg, setPasswordErrorMsg] = useState("");
  const [reenterpassworderrormsg, setReenterPasswordErrorMsg] = useState("");

  const [invalidSpecialError, setInvalidSpecialError] = useState("");
  const [invalidSpecialConfirmError, setInvalidSpecialConfirmError] = useState("");


  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const passwordRequirements = validatePasswordRequirements(newPassword);
  const allRequirementsMet = areAllRequirementsMet(passwordRequirements);
  const passwordsMatch = newPassword !== "" && newPassword === reenterPassword;

  useEffect(() => {
    if (passworderrormsg && newPassword) setPasswordErrorMsg("");
    if (reenterpassworderrormsg && reenterPassword) setReenterPasswordErrorMsg("");
    if (currenterrormsg && currentPassword) setCurrenterrormsg("");
  }, [newPassword, reenterPassword, currentPassword, passworderrormsg, reenterpassworderrormsg, currenterrormsg]);

  const handleResetPassword = async (values) => {
    setCurrenterrormsg("");
    setPasswordErrorMsg("");
    setReenterPasswordErrorMsg("");

    const validationError = validatePasswordForm(currentPassword, newPassword, reenterPassword, allRequirementsMet);
    if (validationError) {
      if (validationError.field === "current") setCurrenterrormsg(validationError.message);
      else if (validationError.field === "new") setPasswordErrorMsg(validationError.message);
      else if (validationError.field === "reenter") setReenterPasswordErrorMsg(validationError.message);
      return;
    }

    const encryptedPassword = encryptData(currentPassword);
    const encryptedPassword1 = encryptData(newPassword);
    const body = {
      current_password: encryptedPassword,
      new_password: encryptedPassword1,
    };

    setLoading(true);
    try {
      const response = await loginApi.updatepassword(body);
      const userData = response?.data;

      if (userData?.status_code === 200) {
        messageApi.open({ type: "success", content: userData.message || "Password updated" });
        form.resetFields();
        setCurrentPassword("");
        setNewPassword("");
        setReenterPassword("");
        setTimeout(() => {
          navigate("/");
        }, 1000);
        
      } else {
        messageApi.open({
          type: "error",
          content: userData?.error || userData?.message || "Failed to update password",
        });
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
            messageApi.open({
            type: "error",
            content: errorMessage?.message || "Error exporting dealers",
          });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      {contextHolder}

      <Breadcrumb
  separator={<img src={Right} alt="" />}
  style={{ marginBottom: 16 }}
  items={[
    {
      title: (
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            background: "none",
            border: "none",
            color: "#6B7280",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "400",
            padding: 0,
          }}
        >
          Dashboard
        </button>
      ),
    },
    {
      title: (
        <span
          style={{
            color: "#6B7280",
            fontSize: "13px",
            fontWeight: "400",
          }}
        >
          Account Settings
        </span>
      ),
    },
    {
      title: (
        <span
          style={{
            color: "#000000",
            fontSize: "13px",
            fontWeight: "400",
          }}
        >
          Change Password
        </span>
      ),
    },
  ]}
/>


  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px"  }}>

      <Form form={form} layout="vertical" onFinish={handleResetPassword} requiredMark={false}>
        <Card
          style={{
            width: 600,
            maxWidth: "100%",
            marginTop: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="logo-wrapper-5">
              <img src={lock} alt="logo" />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: "600", fontSize: "14px", color: "#333" }}>
                Change Password
              </span>
              <span style={{ fontSize: "12px", color: "#666" }}>
                Update your password to keep your account secure
              </span>
            </div>
          </div>

          <Divider style={{ margin: "16px 0", borderWidth: "1.3px" }} />

          <div className="form-group-create-1">
            <label htmlFor="current-password-input" className="create-label">
              Current Password
            </label>
            <Input.Password
              id="current-password-input"
              placeholder="Enter your current password"
              className="create-field1"
              size="large"
              value={currentPassword}
              aria-label="Current Password"
              aria-describedby={currenterrormsg ? "current-password-error" : undefined}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {currenterrormsg && (
              <div id="current-password-error" className="passworderror-msg">
                {currenterrormsg}
              </div>
            )}
          </div>

          <div className="form-group-create-1">
  <label htmlFor="password-input" className="create-label">
    New Password
  </label>
  <Input.Password
  id="password-input"
  placeholder="Enter your new password"
  className="create-field1"
  size="large"
  value={newPassword}
  aria-label="New Password"
  aria-describedby={passworderrormsg || invalidSpecialError ? "new-password-error" : undefined}
  onChange={(e) => {
    const value = e.target.value;
    const allowedSpecial = "@#$%&";
    const hasInvalidSpecial = /[^A-Za-z0-9@#$%&]/.test(value);

    setNewPassword(value);

    if (hasInvalidSpecial) {
      setInvalidSpecialError(`Only ${allowedSpecial.split("").join(", ")} are allowed as special characters.`);
    } else {
      setInvalidSpecialError("");
    }
  }}
/>
{passworderrormsg && (
  <div id="new-password-error" className="passworderror-msg">
    {passworderrormsg}
  </div>
)}
{invalidSpecialError && (
  <div id="new-password-error" className="passworderror-msg">
    {invalidSpecialError}
  </div>
)}
          </div>


          <PasswordRequirements requirements={passwordRequirements} />

          <div className="form-group-create-1">
            <label htmlFor="confirm-password-input" className="create-label">
              Repeat Password
            </label>
           <Input.Password
  id="confirm-password-input"
  placeholder="Confirm your new password"
  className="create-field1"
  size="large"
  value={reenterPassword}
  aria-label="Confirm Password"
  aria-describedby={
    reenterpassworderrormsg || invalidSpecialConfirmError ? "reenter-password-error" : undefined
  }
  onChange={(e) => {
    const value = e.target.value;
    const allowedSpecial = "@#$%&";
    const hasInvalidSpecial = /[^A-Za-z0-9@#$%&]/.test(value);

    setReenterPassword(value);

    if (hasInvalidSpecial) {
      setInvalidSpecialConfirmError(
        `Only ${allowedSpecial.split("").join(", ")} are allowed as special characters.`
      );
    } else {
      setInvalidSpecialConfirmError("");
    }
  }}
/>
{reenterpassworderrormsg && (
  <div id="reenter-password-error" className="passworderror-msg">
    {reenterpassworderrormsg}
  </div>
)}
{invalidSpecialConfirmError && (
  <div id="reenter-password-error" className="passworderror-msg">
    {invalidSpecialConfirmError}
  </div>
)}
{reenterPassword.length > 0 && !invalidSpecialConfirmError && (
  <div style={{ marginTop: 6, color: passwordsMatch ? "#10B981" : "#EF4444", fontSize: 13 }}>
    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
  </div>
)}
          </div>

          <Divider style={{ margin: "16px 0", borderWidth: "1.3px" }} />

          <Row justify="space-between">
            <Col>
              <Button
                style={{
                  height: "38px",
                  backgroundColor: "#F3F4F6",
                  border: "1px solid #E5E7EB",
                  borderRadius: "6px",
                  color: "#4B5563",
                  fontWeight: "500",
                }}
                onClick={() => {
                  form.resetFields();
                  setCurrentPassword("");
                  setNewPassword("");
                  setReenterPassword("");
                  navigate("/dashboard");             
                }}
                disabled={fetching || loading}
              >
                Cancel
              </Button>
            </Col>

            <Col>
              <Button
                // className="create-button"
                size="large"
                block
                htmlType="submit"
                loading={loading}
                // disabled={loading || !allRequirementsMet || !passwordsMatch}
                icon={<img src={change} alt="" />}
                style={{
                  height: "38px",
                  backgroundColor: "#008AD5",
                  borderRadius: "8px",
                  fontWeight: "500",
                  color: "#FFFFFF",
                  fontSize: "14px",
                }}
              >
                Change Password
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>

      <Button
        type="default"
        className="create-button-back-change"
        size="large"
        block
        onClick={() => {}}
        aria-label="Security Notice"
      >
        <div className="create-button-content">
          <div className="create-button-top">
            <img src={bluelogo_icon2} alt="icon" className="create-button-icon" />
            <span className="create-text-otp">Security Tips</span>
          </div>

          <div className="create-button-subtext">• Use a unique password that you don't use anywhere else</div>
          <div className="create-button-subtext">
            • Consider using a password manager to generate and store secure passwords
          </div>
          <div className="create-button-subtext">
            • Consider using a password manager to generate and store secure passwords
          </div>
          <div className="create-button-subtext">• Never share your password with anyone</div>
        </div>
      </Button>
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
export default ChangePassword;
