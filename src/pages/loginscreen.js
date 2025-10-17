import React, { useState, useEffect } from "react"; 
import "../assets/styles/loginscreen.css";
import { Input, Button, message } from "antd";
import bluelogo_icon from "../assets/images/car.svg";
import frame_icon from "../assets/images/Frame.svg";
import arrow_icon from "../assets/images/arrow.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginApi } from "../services/api";
import { loginSuccess } from "../redux/actions/authActions";

const LoginScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailerrormsg, setEmailErrorMsg] = useState("");
  const [passworderrormsg, setPasswordErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

useEffect(() => {
  // Disable browser back button
  const handlePopState = () => {
    window.history.pushState(null, "", window.location.href);
  };

  // Push a new state so back button won’t go back
  window.history.pushState(null, "", window.location.href);
  window.addEventListener("popstate", handlePopState);

  return () => {
    window.removeEventListener("popstate", handlePopState);
  };
}, []);


  const handleLogin = (e) => {
    if (e) {
      e.preventDefault();
    }

    let hasError = false;
    setEmailErrorMsg("");
    setPasswordErrorMsg("");
    if (email.trim() === "") {
      setEmailErrorMsg("Please Enter Email Address");
      hasError = true;
    }
    if (password.trim() === "") {
      setPasswordErrorMsg("Please Enter Password");
      hasError = true;
    }
    if (hasError) return;

    const body = {
      email: email,
      password: password,
    };
    setLoading(true);
     userloginAPI(body); 
  };

const userloginAPI = async (body) => {
  try {
    setLoading(true);
    const response = await loginApi.login(body);
    const userData = response?.data;

    if (userData?.status_code === 200) {
      messageApi.open({ 
        type: 'success', 
        content: userData.message || 'Login successful!' 
      });

      dispatch(loginSuccess(
        userData?.data?.firstname,
        userData?.data?.access_token,
        userData?.data?.email,
        userData?.data?.role,
        userData?.data?.needs_password_update
      ));

      if (userData?.data?.needs_password_update === 1) {
        navigate("/CreatePassword");
      } else {
        navigate("/dashboard");
      }
    } else {
      // Handles 401 or other non-200 responses
      const errorMsg = userData?.message || 'Email or password is incorrect';
      messageApi.open({
        type: 'error',
        content: errorMsg,
      });
    }
  } catch (error) {
    const errorMsg = error?.response?.data?.message 
                     || error?.message 
                     || 'Network error. Please check your connection.';
    messageApi.open({
      type: 'error',
      content: errorMsg,
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login-page-wrapper1">
      {contextHolder}
      <div className="login-page1">
        <div className="left-side">
          <div className="brand-top">
           <div className="logo-wrapper">
  <img src={bluelogo_icon} alt="Souq Sayarat logo" />
</div>

            <h2 className="site-title">Souq Sayarat</h2>
            <h6 className="site-subtitle">Admin Portal</h6>
          </div>

          <div className="button-row1">
    <Button
      type="primary"
      className="login-button2"
      size="large"
      block
      onClick={""}
    >
       <img 
      src={frame_icon} 
      alt="internal icon" 
      className="btn-icon" 
    />
      <span className="button-text">For internal team use only</span>
    </Button>
          </div>

           <div className="brand-top">
            <h2 className="site-title">Sign in to your account</h2>
            <h6 className="site-subtitle">Access the admin dashboard</h6>
          </div>

         <form className="login-card" onSubmit={handleLogin} aria-label="Login form">

  <div className="form-group">
    <label htmlFor="email-input" className="input-label">Email Address</label>
    <Input
      id="email-input"
      placeholder="admin@souqsayarat.com"
      className="input-field1"
      type="email"
      size="large"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
        setEmailErrorMsg("");
      }}
    />
    {emailerrormsg && (
      <div className="emailerror-msg">{emailerrormsg}</div>
    )}
  </div>
  <div className="form-group">
    <label htmlFor="password-input" className="input-label">Password</label>
    <Input.Password
      id="password-input"
      placeholder="Enter your password"
      className="input-field1"
      size="large"
      value={password}
      aria-label="Password"
      aria-describedby={passworderrormsg ? "password-error" : undefined}
      onChange={(e) => {
        setPassword(e.target.value);
        setPasswordErrorMsg("");
      }}
    />
    {passworderrormsg && (
      <div id="password-error" className="passworderror-msg">
        {passworderrormsg}
      </div>
    )}
  </div>

  <div className="button-row">
  <Button
    type="primary"
    className="login-button1"
    size="large"
    block
    htmlType="submit"
    loading={loading}
    disabled={loading || !email.trim() || !password.trim()} 
    aria-label="Sign in"
    style={{
      backgroundColor: !email.trim() || !password.trim() ? "#D1D5DB" : "#008AD5",
      borderColor: !email.trim() || !password.trim() ? "#D1D5DB" : "#008AD5",
      color: !email.trim() || !password.trim() ? "#9CA3AF" : "#ffffff",
      cursor: !email.trim() || !password.trim() ? "not-allowed" : "pointer",
      opacity: !email.trim() || !password.trim() ? 0.5 : 1,
      borderRadius: 8,
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      transition: "all 0.2s ease",
    }}
  >
    <span className="button-text">{loading ? "Signing in..." : "Sign In"}</span>
    <img
      src={arrow_icon}
      alt="arrow"
      className="btn-icon"
      style={{
        opacity: !email.trim() || !password.trim() ? 0.4 : 1,
      }}
    />
  </Button>
</div>


  <div className="forgot-password1">
    <a href="/ForgotPassword">Forgot password?</a>
  </div>
        </form>
         <h6 className="site-title-copy">© 2025 Souq Sayarat. All rights reserved.</h6>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
