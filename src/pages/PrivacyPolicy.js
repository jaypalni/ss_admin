import React from "react";
import { CalendarOutlined, SaveOutlined, EyeFilled } from "@ant-design/icons";
import { FaUser } from "react-icons/fa";
import { Button, Card, Divider, Input } from "antd";

const { TextArea } = Input;

const PrivacyPolicy = () => {
  const cardData = {
    title: "Privacy Policy Content",
    subtitle: "Edit and manage your privacy policy content below",
    placeholder:
      "Privacy Policy Last updated: October 15, 2024 1. Information We Collect At Souq Sayarat, we collect information you provide directly to us, such as when you create an account, list a vehicle, or contact us for support. 2. How We Use Your Information We use the information we collect to: - Provide, maintain, and improve our services - Process transactions and send related information - Send technical notices, updates, security alerts, and support messages - Respond to your comments, questions, and customer service requests 3. Information Sharing and Disclosure We may share personal information in the following circumstances: - With your consent - To comply with legal obligations - To protect our rights and safety 4. Data Security We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. 5. Your Rights You have the right to: - Access your personal information - Correct inaccurate information - Delete your personal information - Object to processing of your personal information 6. Contact Us If you have any questions about this Privacy Policy, please contact us at: Email: privacy@souqsayarat.com Phone: +964 XXX XXXX XXX",
  };

  return (
    <div style={{ padding: "20px" }}>
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
              By: Sarah Ahmed
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
            style={{
              backgroundColor: "#008AD5",
              borderColor: "#008AD5",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#fff",
              fontWeight: 400,
            }}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <Card
        style={{ width: "100%", borderRadius: "10px" }}
        bordered
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "16px", fontWeight: 600,color:"#1F2937" }}>{cardData.title}</span>
          <span style={{ fontSize: "14px", color: "#4B5563" ,fontWeight: 400 }}>{cardData.subtitle}</span>
        </div>

        <Divider style={{ margin: "10px 0" }} />

        <TextArea
          rows={8}
          placeholder={cardData.placeholder}
          style={{
            fontStyle: "italic",
            fontWeight: 400,
            padding: "10px",
            borderRadius: "6px",
            fontSize:"12px"
          }}
        />
      </Card>

      <Card
        style={{ width: "60%", borderRadius: "10px",marginTop:"10px" }}
        bordered
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "16px", fontWeight: 600,color:"#1F2937" }}>Version History</span>
          <span style={{ fontSize: "14px", color: "#4B5563" ,fontWeight: 400 }}>Track changes and previous versions</span>
        </div>

        <Divider style={{ margin: "10px 0" }} />
      </Card>
    </div>
  );
};

export default PrivacyPolicy;
