import React, { useState,useEffect } from "react";
import { CalendarOutlined, SaveOutlined, EyeFilled } from "@ant-design/icons";
import { FaUser } from "react-icons/fa";
import { Button, Card, Divider, Tabs, message, Spin } from "antd";
import bluelogo_icon1 from "../assets/images/globe.svg";
import { loginApi } from "../services/api";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill-new";
import { useNavigate } from "react-router-dom";
import "react-quill-new/dist/quill.snow.css";

const PrivacyPolicy = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("arabic");
  const [messageApi, contextHolder] = message.useMessage();
  const { user,token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = token && user;
  
    useEffect(() => {
      if (!isLoggedIn) navigate("/");
    }, [isLoggedIn, navigate]);

  const [faqData, setFaqData] = useState({
    arabic: "",
    english: "",
    kurdish: "",
  });

  const [isDraft, setIsDraft] = useState(1);

  const cardData = {
    title: "Privacy Policy Content",
    subtitle: "Edit and manage your T&C content in multiple languages",
  };

const tabItems = [ { key: "arabic", label: ( <div style={{ display: "flex", alignItems: "center", gap: 6 }}> <img src={bluelogo_icon1} alt="Arabic Icon" style={{ width: 12, height: 12, filter: activeTab === "arabic" ? "invert(36%) sepia(89%) saturate(747%) hue-rotate(188deg) brightness(95%) contrast(90%)" : "grayscale(100%)", transition: "0.3s", }} /> <span style={{ color: activeTab === "arabic" ? "#008AD5" : "#4B5563", fontWeight: activeTab === "arabic" ? 600 : 400, }} > Arabic </span> </div> ), }, { key: "english", label: ( <div style={{ display: "flex", alignItems: "center", gap: 6 }}> <img src={bluelogo_icon1} alt="English Icon" style={{ width: 12, height: 12, filter: activeTab === "english" ? "invert(36%) sepia(89%) saturate(747%) hue-rotate(188deg) brightness(95%) contrast(90%)" : "grayscale(100%)", transition: "0.3s", }} /> <span style={{ color: activeTab === "english" ? "#008AD5" : "#4B5563", fontWeight: activeTab === "english" ? 600 : 400, }} > English </span> </div> ), }, { key: "kurdish", label: ( <div style={{ display: "flex", alignItems: "center", gap: 6 }}> <img src={bluelogo_icon1} alt="Kurdish Icon" style={{ width: 12, height: 12, filter: activeTab === "kurdish" ? "invert(36%) sepia(89%) saturate(747%) hue-rotate(188deg) brightness(95%) contrast(90%)" : "grayscale(100%)", transition: "0.3s", }} /> <span style={{ color: activeTab === "kurdish" ? "#008AD5" : "#4B5563", fontWeight: activeTab === "kurdish" ? 600 : 400, }} > Kurdish </span> </div> ), }, ];

  const handleSave = async () => {
    setLoading(true);
    const langCode =
      activeTab === "arabic" ? "ar" : activeTab === "english" ? "en" : "ku";

    const body = {
      type: "privacy_policy",
      lang: langCode,
      is_draft: isDraft,
      message:
        activeTab === "arabic"
          ? faqData.arabic
          : activeTab === "english"
          ? faqData.english
          : faqData.kurdish,
      created_by: user,
    };

    try {
      const res = await loginApi.privacypolicy("PrivacyPolicy", body);
      const data = res?.data;

      if (data?.success) {
        messageApi.success(data?.message || "Privacy Policy saved successfully");
      } else {
        messageApi.error(data?.message || "Failed to save Privacy Policy");
      }
    } catch (err) {
      console.error("Save error:", err);
      messageApi.error("Something went wrong while saving Privacy Policy");
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "30px 20px",
          borderRadius: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <CalendarOutlined style={{ fontSize: "15px", color: "#6B7280" }} />
            <span style={{ fontSize: 14, color: "#6B7280", fontWeight: 400 }}>
              Last updated: October 15, 2024
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FaUser style={{ fontSize: "12px", color: "#6B7280" }} />
            <span style={{ fontSize: 14, color: "#6B7280", fontWeight: 400 }}>
              By: {user}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            key="preview"
            icon={<EyeFilled />}
            style={{
              backgroundColor: "#fff",
              borderColor: "#D1D5DB",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#4B5563",
              fontWeight: 400,
            }}
          >
            Preview
          </Button>
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            disabled={loading}
            style={{
              backgroundColor: "#008AD5",
              borderColor: "#008AD5",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#fff",
              fontWeight: 400,
            }}
          >
            {loading ? <Spin size="small" /> : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card style={{ width: "100%", borderRadius: "10px" }} bordered>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "16px", fontWeight: 600, color: "#1F2937" }}>
            {cardData.title}
          </span>
          <span style={{ fontSize: "14px", color: "#4B5563", fontWeight: 400 }}>
            {cardData.subtitle}
          </span>
        </div>

        <Divider style={{ margin: "10px 0" }} />

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarStyle={{ marginBottom: 20 }}
          items={tabItems}
        />

        {activeTab === "arabic" && (
          <ReactQuill
            theme="snow"
            value={faqData.arabic}
            onChange={(val) => setFaqData({ ...faqData, arabic: val })}
            placeholder="Enter Arabic text..."
            modules={modules}
            style={{
              height: "200px",
              marginBottom: "20px",
              direction: "rtl",
              textAlign: "right",
              fontStyle: "italic",
              fontSize: "13px",
              borderRadius: "8px",
              background: "#fff",
            }}
          />
        )}

        {activeTab === "english" && (
          <ReactQuill
            theme="snow"
            value={faqData.english}
            onChange={(val) => setFaqData({ ...faqData, english: val })}
            placeholder="Enter English text..."
            modules={modules}
            style={{
              height: "200px",
              marginBottom: "20px",
              direction: "ltr",
              textAlign: "left",
              fontStyle: "italic",
              fontSize: "13px",
              borderRadius: "8px",
              background: "#fff",
            }}
          />
        )}

        {activeTab === "kurdish" && (
          <ReactQuill
            theme="snow"
            value={faqData.kurdish}
            onChange={(val) => setFaqData({ ...faqData, kurdish: val })}
            placeholder="Enter Kurdish text..."
            modules={modules}
            style={{
              height: "200px",
              marginBottom: "20px",
              direction: "ltr",
              textAlign: "left",
              fontStyle: "italic",
              fontSize: "13px",
              borderRadius: "8px",
              background: "#fff",
            }}
          />
        )}
      </Card>
      <Card style={{ width: "60%", borderRadius: "10px", marginTop: "10px" }} bordered > <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}> <span style={{ fontSize: "16px", fontWeight: 600, color: "#1F2937" }}> Version History </span> <span style={{ fontSize: "14px", color: "#4B5563", fontWeight: 400 }}> Track changes and previous versions </span> </div> <Divider style={{ margin: "10px 0" }} /> </Card>
    </div>
  );
};

export default PrivacyPolicy;
