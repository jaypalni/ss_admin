import React, { useState } from "react";
import "../assets/styles/loginscreen.css";
import { Input, Button, message } from "antd";
import bluelogo_icon from "../assets/images/div.svg";
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

  const allowedDomains = [
  "@souqsayarat.com",
  "@souqsayarat.net",
  "@souqsayarat.iq"
];

  const handleLogin = () => {
    console.log("handleLogin called");
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
    const domainValid = allowedDomains.some((d) => email.toLowerCase().endsWith(d));
  if (!domainValid) {
    setEmailErrorMsg(
      "Use your company email (…@souqsayarat.com / …@souqsayarat.net / …@souqsayarat.iq)."
    );
    return;
  }
    const body = {
      email: email,
      password: password,
    };
    setLoading(true);
     userloginAPI(body); 
  };

  const userloginAPI = async (body) => {
    
    console.log("body12345",body)
    try {
      const response = await loginApi.login(body);
      const userData = response;
      console.log("userData123456",userData)
      alert('1')
      if (userData.status_code === 200) {
        messageApi.open({ type: 'success', content: response.message  });
        //dispatch(loginSuccess(userData.firstname,userData.access_token,userData.email))
        setLoading(false);
        if (userData?.needs_password_update === 1) {
          //navigate("/createpassword");
        } else {
          //navigate("/dashboard");
        }
      } else {
         messageApi.open({ type: 'error', content: userData.error  });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during login", error);
      message.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper1">
      {contextHolder}
      <div className="login-page1">
        <div className="left-side">
          <div className="brand-top">
            <img src={bluelogo_icon} alt="Souq Sayarat logo" className="ssblue-logo1" />
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

         <div className="login-card" role="region" aria-label="Login form card">

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
      onClick={handleLogin}
      loading={loading}
      aria-label="Sign in"
    >
      <span className="button-text">{loading ? "Signing in..." : "Sign In"}</span>
      <img 
      src={arrow_icon} 
      alt="internal icon" 
      className="btn-icon" 
    />
    </Button>
  </div>

  <div className="forgot-password1">
    <a href="/ForgotPassword">Forgot password?</a>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
