import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Row,
  Col,
  Divider,
  Button,
  Form,
  message,
  Radio,
} from "antd";
import { UserOutlined, MailOutlined, PlusOutlined } from "@ant-design/icons";
import bluelogo_icon2 from "../assets/images/info.svg";
import "../assets/styles/otp.css";
import { useNavigate, useParams } from "react-router-dom";
import { loginApi } from "../services/api";

const CreateNewUserAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [statusFlag, setStatusFlag] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isEdit) return;

    const fetchDetails = async () => {
      try {
        setFetching(true);
        const res = await loginApi.editadmindata(id);
        const data = res?.data;

        if (data && (data.status_code === 200 || data.status === "success")) {
          const user = data.data;
          form.setFieldsValue({
            firstName: user.first_name ?? "",
            lastName: user.last_name ?? "",
            email: user.email ?? "",
            role: user.role ?? "",
          });

          const statusValue =
            user.is_locked !== undefined && user.is_locked !== null
              ? Number(user.is_locked)
              : null;
          setStatusFlag(statusValue);
        } else {
          messageApi.error(data?.message || "Failed to load admin details");
        }
      } catch (err) {
        console.error("Fetch admin details error:", err);
        messageApi.error(err?.message || "Something went wrong while fetching details");
      } finally {
        setFetching(false);
      }
    };

    fetchDetails();
  }, [id, isEdit, form, messageApi]);

  const handleSubmit = async (values) => {

    const body = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      role: values.role,
    };

    const body1 = {
      email: values.email,
      role: values.role,
      is_locked: statusFlag,
    };


    try {
      setLoading(true);

      if (isEdit) {
        const res = await loginApi.admindata(id, body1);
        const resData = res?.data;
        if (resData?.status_code === 200) {
          messageApi.success(resData.message || "Admin updated successfully");
          navigate("/Admins");
        } else {
          messageApi.error(resData?.message || "Failed to update admin");
        }
      } else {
        const res = await loginApi.admincreate(body);
        const resData = res?.data;
        if (resData?.status_code === 201 || resData?.status_code === 200) {
          messageApi.success(resData.message || "Admin created successfully");
          form.resetFields();
          setStatusFlag(null);
          navigate("/Admins");
        } else {
          messageApi.error(resData?.message || "Failed to create admin");
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      messageApi.error(err?.message || "Something went wrong");
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
        {isEdit ? "Edit Admin User" : "Create New Admin User"}
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "#4B5563",
          marginBottom: "20px",
          fontWeight: "400",
        }}
      >
        {isEdit
          ? "Update administrator details and permissions."
          : "Add a new administrator to the Souq Sayarat admin portal with appropriate access permissions."}
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
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
                    First Name
                    <span style={{ color: "red", marginLeft: 2 }}>*</span>
                  </span>
                }
                name="firstName"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input
                  placeholder="Enter first name"
                  prefix={<UserOutlined style={{ color: "#E5E7EB" }} />}
                  style={{ height: "38px", backgroundColor: "transparent" }}
                  disabled={isEdit}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Last Name
                    <span style={{ color: "red", marginLeft: 2 }}>*</span>
                  </span>
                }
                name="lastName"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input
                  placeholder="Enter last name"
                  prefix={<UserOutlined style={{ color: "#E5E7EB" }} />}
                  style={{ height: "38px", backgroundColor: "transparent" }}
                  disabled={isEdit}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Email Address
                    <span style={{ color: "red", marginLeft: 2 }}>*</span>
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
                  prefix={<MailOutlined style={{ color: "#E5E7EB",marginRight:"2px" }} />}
                  style={{ height: "38px", backgroundColor: "white" }}
                  disabled={false}
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
                    Role
                    <span style={{ color: "red", marginLeft: 2 }}>*</span>
                  </span>
                }
                name="role"
                rules={[{ required: true, message: "Role is required" }]}
              >
                <Input
                  placeholder="Enter Role"
                  prefix={<MailOutlined style={{ color: "#E5E7EB",marginRight:"2px",marginTop:"2px" }} />}
                  style={{ height: "38px", backgroundColor: "transparent" }}
                  disabled={false}
                />
              </Form.Item>
            </Col>
          </Row>
{isEdit ? (
  <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
    <div style={{ marginLeft: 0 }}>
      <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
        Is Locked In?
      </label>
      <Radio.Group
        onChange={(e) => setStatusFlag(Number(e.target.value))}
        value={statusFlag}
      >
        <Radio value={1} style={{ marginRight: 20 }}>Yes</Radio>
        <Radio value={0}>No</Radio>
      </Radio.Group>
    </div>
  </div>
) : null}

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
                onClick={() => {
                  form.resetFields();
                  if (isEdit) {
                    navigate("/Admins");
                  }
                }}
                disabled={fetching || loading}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={!isEdit ? <PlusOutlined /> : null}
                style={{
                  height: "38px",
                  backgroundColor: "#008AD5",
                  borderRadius: "8px",
                  fontWeight: "600",
                  color: "#FFFFFF",
                  fontSize: "14px",
                }}
              >
                {isEdit ? "Update User" : "Create New User"}
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
