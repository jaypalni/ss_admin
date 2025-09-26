import React, { useState } from "react";
import { Card, Input, Row, Col, Divider, Button, Form, message, Select } from "antd";
import { UserOutlined, MailOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import bluelogo_icon2 from "../assets/images/info.svg";
import "../assets/styles/otp.css";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/api";


const { Option } = Select;

const CreateNewUserAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    console.log("Form Submitted:", values);

    const body = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      role: values.role,
    };

    try {
      setLoading(true);
      const response = await loginApi.admincreate(body);
      const userData = response?.data

      if (userData.status_code === 201 || userData.status_code === 200) {
        messageApi.success(userData.message || "Admin created successfully");
        form.resetFields();
      } else {
        messageApi.error(userData.error || userData.message || "Failed to create admin");
      }
    } catch (error) {
      console.error("Error:", error);
      messageApi.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "4px",
          color: "#111827",
        }}
      >
        Create New Admin User
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "#4B5563",
          marginBottom: "20px",
          fontWeight: "400",
        }}
      >
        Add a new administrator to the Souq Sayarat admin portal with appropriate access permissions.
      </p>

      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false} >
        <Card
          style={{
            width: "100%",
            maxWidth: 600,
            marginTop: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                 label={
    <span>
      First Name<span style={{ color: "red", marginLeft: 2 }}>*</span>
    </span>
  }
                name="firstName"
                required='false'
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input
                  placeholder="Enter first name"
                  prefix={<UserOutlined style={{ color: "#E5E7EB" }} />}
                  style={{ height: "38px", backgroundColor: "transparent" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
    <span>
      Last Name<span style={{ color: "red", marginLeft: 2 }}>*</span>
    </span>
  }
                name="lastName"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input
                  placeholder="Enter last name"
                  prefix={<UserOutlined style={{ color: "#E5E7EB" }} />}
                  style={{ height: "38px", backgroundColor: "transparent" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
    <span>
      Email Address<span style={{ color: "red", marginLeft: 2 }}>*</span>
    </span>
  }
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input
                  placeholder="Enter email address"
                  prefix={<MailOutlined style={{ color: "#E5E7EB" }} />}
                  style={{ height: "38px", backgroundColor: "transparent" }}
                />
              </Form.Item>
              <p style={{ fontSize: "10px", color: "#6B7280", marginTop: "-6px" }}>
                This email will be used for login and system notifications.
              </p>
            </Col>

             <Col span={12}>
              <Form.Item
               label={
    <span>
      Role<span style={{ color: "red", marginLeft: 2 }}>*</span>
    </span>
  }
                name="role"
                rules={[
                  { required: true, message: "Role is required" },
                ]}
              >
                <Input
                  placeholder="Enter Role"
                  prefix={<MailOutlined style={{ color: "#E5E7EB" }} />}
                 style={{ height: "38px", backgroundColor: "transparent" }}
                />
              </Form.Item>
            </Col>

            {/* <Col span={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Role is required" }]}
              >
                <Select
                  placeholder="Select role"
                  style={{ height: "38px", width: "100%" }}
                  suffixIcon={<TeamOutlined style={{ color: "#E5E7EB" }} />}
                >
                  <Option value="superadmin">Super Admin</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="moderator">Moderator</Option>
                </Select>
              </Form.Item>
            </Col> */}
          </Row>

          <Divider style={{ margin: "16px 0", borderWidth: "1.3px" }} />

          <Row justify="space-between">
            <Col>
              <Button
                style={{
                  height: "38px",
                  backgroundColor: "#fff",
                  border: "1px solid #D1D5DB",
                  borderRadius: "6px",
                  color: "#374151",
                  fontWeight: "500",
                }}
                onClick={() => form.resetFields()}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<PlusOutlined />}
                style={{
                  height: "38px",
                  backgroundColor: "#008AD5",
                  borderRadius: "8px",
                  fontWeight: "600",
                  color: "#FFFFFF",
                  fontSize: "14px",
                }}
              >
                Create New User
              </Button>
            </Col>
          </Row>
        </Card>
      </Form>

      {/* Info Box */}
      <Button
        type="default"
        className="otp-button-back-2"
        size="large"
        block
        aria-label="Security Notice"
        style={{ marginTop: "20px" }}
      >
        <div className="otp-button-content">
          <div className="otp-button-top">
            <img src={bluelogo_icon2} alt="icon" className="otp-button-icon" />
            <span className="button-text-otp">Important Information</span>
          </div>
          <div className="otp-button-subtext">
            • The new admin user will receive an email invitation to set up their password
          </div>
          <div className="otp-button-subtext">
            • Default permissions will be applied, which can be modified later
          </div>
          <div className="otp-button-subtext">
            • The email address must be unique and not already registered in the system
          </div>
        </div>
      </Button>
    </div>
  );
};

export default CreateNewUserAdmin;
