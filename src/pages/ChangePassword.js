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
import { useParams, useNavigate } from "react-router-dom";
import Right from "../assets/images/Right.svg";
import change from "../assets/images/change.svg";
import lock from "../assets/images/Lock.svg";
import bluelogo_icon2 from "../assets/images/Frame.svg";
import { loginApi } from "../services/api";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");

  const [currenterrormsg, setCurrenterrormsg] = useState("");
  const [passworderrormsg, setPasswordErrorMsg] = useState("");
  const [reenterpassworderrormsg, setReenterPasswordErrorMsg] = useState("");

  const [messageApi, contextHolder] = message.useMessage();

  const [reqLength, setReqLength] = useState(false);
  const [reqUpper, setReqUpper] = useState(false);
  const [reqLower, setReqLower] = useState(false);
  const [reqNumber, setReqNumber] = useState(false);
  const [reqSpecial, setReqSpecial] = useState(false);

  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const allRequirementsMet =
    reqLength && reqUpper && reqLower && reqNumber && reqSpecial;

  const [form] = Form.useForm();

  // Keep requirement states updated when newPassword or reenterPassword changes
  useEffect(() => {
    setReqLength(newPassword.length >= 8);
    setReqUpper(/[A-Z]/.test(newPassword));
    setReqLower(/[a-z]/.test(newPassword));
    setReqNumber(/\d/.test(newPassword));
    setReqSpecial(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword));

    setPasswordsMatch(newPassword !== "" && newPassword === reenterPassword);

    // Clear inline error messages when user types
    if (passworderrormsg && newPassword) setPasswordErrorMsg("");
    if (reenterpassworderrormsg && reenterPassword) setReenterPasswordErrorMsg("");
    if (currenterrormsg && currentPassword) setCurrenterrormsg("");
  }, [newPassword, reenterPassword]); // eslint-disable-line

  // Handler called by Form.onFinish (it receives values, but we use component state)
  const handleResetPassword = async (values) => {
    // Clear previous error messages
    setCurrenterrormsg("");
    setPasswordErrorMsg("");
    setReenterPasswordErrorMsg("");

    // Client-side validation
    if (!currentPassword) {
      setCurrenterrormsg("Please enter your current password.");
      return;
    }
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

    const body = {
      current_password: currentPassword,
      new_password: newPassword,
    };

    setLoading(true);
    try {
      const response = await loginApi.updatepassword(body);
      const userData = response?.data;

      if (userData?.status_code === 200) {
        messageApi.open({ type: "success", content: userData.message || "Password updated" });
        // reset form/state if desired
        form.resetFields();
        setCurrentPassword("");
        setNewPassword("");
        setReenterPassword("");
        // navigate away
        navigate("/dashboard");
      } else {
        messageApi.open({
          type: "error",
          content: userData?.error || userData?.message || "Failed to update password",
        });
      }
    } catch (err) {
      console.error("updatePassword error", err);
      messageApi.open({ type: "error", content: err?.message || "Network error" });
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
              <span
                style={{
                  color: "#6B7280",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "400",
                }}
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </span>
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
            <div className="logo-wrapper-1">
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
              aria-describedby={passworderrormsg ? "new-password-error" : undefined}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {passworderrormsg && (
              <div id="new-password-error" className="passworderror-msg">
                {passworderrormsg}
              </div>
            )}
          </div>

          <div className="create-button-back-password-1" role="region" aria-label="Password must contain">
            <div className="create-button-content-pass">
              <div className="create-button-top">
                <span style={{ fontWeight: 400, fontSize: "12px", color: "#6B7280" }}>
                  Password must contain:
                </span>
              </div>

              <div className="create-button-subtext-pass-1">
                <div className="requirement-item">
                  <span className={`requirement-check ${reqLength ? "met" : ""}`} aria-hidden>
                    {reqLength ? "✓" : ""}
                  </span>
                  <span>At least 8 characters long</span>
                </div>

                <div className="requirement-item">
                  <span className={`requirement-check ${reqUpper ? "met" : ""}`} aria-hidden>
                    {reqUpper ? "✓" : ""}
                  </span>
                  <span>One uppercase letter</span>
                </div>

                <div className="requirement-item">
                  <span className={`requirement-check ${reqLower ? "met" : ""}`} aria-hidden>
                    {reqLower ? "✓" : ""}
                  </span>
                  <span>One lowercase letter</span>
                </div>

                <div className="requirement-item">
                  <span className={`requirement-check ${reqNumber ? "met" : ""}`} aria-hidden>
                    {reqNumber ? "✓" : ""}
                  </span>
                  <span>One number</span>
                </div>

                <div className="requirement-item">
                  <span className={`requirement-check ${reqSpecial ? "met" : ""}`} aria-hidden>
                    {reqSpecial ? "✓" : ""}
                  </span>
                  <span>One special character</span>
                </div>
              </div>
            </div>
          </div>

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

export default ChangePassword;
