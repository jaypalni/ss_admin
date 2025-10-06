import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Row,
  Col,
  Button,
  Form,
  message,
  Select,
  Divider,
  Space,
  Breadcrumb,
} from "antd";
import {
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import "../assets/styles/otp.css";
import { useNavigate, useParams } from "react-router-dom";
import { loginApi } from "../services/api";
import { useSelector } from "react-redux";
const { Option } = Select;

const CreateNewSubscription = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [statusFlag, setStatusFlag] = useState(null);
  const [form] = Form.useForm();

  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = token && user;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!isEdit) return;

    const fetchDetails = async () => {
      try {
        setFetching(true);
        const res = await loginApi.editsubscriptionpackagedata(id);
        const data = res?.data;

        if (data && (data.status_code === 200 || data.status === "success")) {
          const user = data.data;
          form.setFieldsValue({
            namePlan: user.name ?? "",
            price: user.price ?? "",
            duration: user.duration_days ?? "",
            numList: user.listing_limit ?? "",
            userType: user.target_user_type,
            autoRenew:
            user.Auto_renewed === 1
              ? "yes"
              : user.Auto_renewed === 0
              ? "no"
              : null,
          });
           const statusValue =
          user.Auto_renewed !== undefined && user.Auto_renewed !== null
            ? Number(user.Auto_renewed)
            : null;
        setStatusFlag(statusValue);
        } else {
          messageApi.error(data?.message || "Failed to load admin details");
        }
      } catch (err) {
        console.error("Fetch admin details error:", err);
        messageApi.error(
          err?.message || "Something went wrong while fetching details"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchDetails();
  }, [id, isEdit, form, messageApi]);

  const handleSubmit = async (values) => {
    console.log("Form values on submit:", values);
    const body = {
   ...(isEdit ? { id: id } : {}),
    plan_name: values.namePlan,
    price: Number(values.price),
    duration_days: Number(values.duration),
    number_of_listings: Number(values.numList),
    auto_renewed_status: values.autoRenew === "yes" ? 1 : 0,
    currency:"IQD",
    targeted_user_type:values.userType
  };

    try {
      setLoading(true);

      if (isEdit) {
        const res = await loginApi.editsubscriptionpackage(body);
        const resData = res?.data;
        if (resData?.status_code === 200) {
          messageApi.success(resData.message || "Subscription updated successfully");
          navigate("/financials/pricing");
        } else {
          messageApi.error(resData?.message || "Failed to update subscription");
        }
      } else {
        const res = await loginApi.createsubscriptionpackage(body);
        const resData = res?.data;
        if (resData?.status_code === 201 || resData?.status_code === 200) {
          messageApi.success(resData.message || "Subscription created successfully");
          form.resetFields();
          setStatusFlag(null);
          navigate("/financials/pricing");
        } else {
          messageApi.error(resData?.message || "Failed to create subscription");
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      messageApi.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/financials/pricing");
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "90vh",
        background: "#F9FAFB",
      }}
    >
      {contextHolder}

      <div style={{ width: "100%", maxWidth: 600 }}>
        <Breadcrumb
        separator=">"
          items={[
            { title: "Financials" },
            {
      title: (
        <span
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/financials/pricing")}
        >
          Pricing
        </span>
      ),
    },
            { title: isEdit ? "Edit Package" : "Create New Package" },
          ]}
          style={{
            marginBottom: 20,
            fontWeight: 400,
            fontSize: 14,
          }}
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Card
            style={{
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                fontWeight: "600",
                fontSize: "20px",
                marginBottom: "20px",
              }}
            >
              {isEdit ? "Edit Subscription Plan" : "Create New Subscription Plan"}
            </h2>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={
                    <span>
                      Name of Plan
                      <span style={{ color: "red", marginLeft: 2 }}>*</span>
                    </span>
                  }
                  name="namePlan"
                  rules={[{ required: true, message: "Name of Plan is required" }]}
                >
                  <Input
                    placeholder="e.g., Premium Plan"
                    style={{ height: "38px" }}
                    disabled={isEdit}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={
                    <span>
                      Price
                      <span style={{ color: "red", marginLeft: 2 }}>*</span>
                    </span>
                  }
                  name="price"
                  rules={[{ required: true, message: "Price is required" }]}
                >
                  <Input placeholder="0" style={{ height: "38px" }}
                        suffix={<span style={{ color: "#6B7280", fontWeight: 500 }}>IQD</span>}
                   />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={
                    <span>
                      Number of Listings
                      <span style={{ color: "red", marginLeft: 2 }}>*</span>
                    </span>
                  }
                  name="numList"
                  rules={[{ required: true, message: "Number of Listings is required" }]}
                >
                  <Input placeholder="0" style={{ height: "38px" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={
                    <span>
                      Duration (in Days)
                      <span style={{ color: "red", marginLeft: 2 }}>*</span>
                    </span>
                  }
                  name="duration"
                  rules={[{ required: true, message: "Duration is required" }]}
                >
                  <Input placeholder="0" style={{ height: "38px" }} />
                </Form.Item>
              </Col>
            </Row>

          <Row gutter={16}>
  <Col span={24}>
    <Form.Item
      label={
        <span>
          Auto Renew
          <span style={{ color: "red", marginLeft: 2 }}>*</span>
        </span>
      }
      name="autoRenew"
      rules={[{ required: true, message: "Please choose Auto Renew option" }]}
    >
      <Select placeholder="Select Auto Renew" style={{ height: 38 }}>
        <Option value="yes">Yes</Option>
        <Option value="no">No</Option>
      </Select>
    </Form.Item>
  </Col>
          </Row>

          <Row gutter={16}>
  <Col span={24}>
    <Form.Item
      label={
        <span>
          User Type
          <span style={{ color: "red", marginLeft: 2 }}>*</span>
        </span>
      }
      name="userType"
      rules={[{ required: true, message: "Please select user type option" }]}
    >
      <Select placeholder="Select User Type" style={{ height: 38 }}>
        <Option value="dealer">Dealer</Option>
        <Option value="individual">Individual</Option>
      </Select>
    </Form.Item>
  </Col>
          </Row>


            <Divider style={{ margin: "16px 0" }} />

            <Row>
              <Col span={24} style={{ textAlign: "right" }}>
                <Space>
                  <Button
                    onClick={handleCancel}
                    style={{
                      background: "#D1D5DB",
                      color: "#374151",
                      border: "none",
                      padding: "0 25px",
                      height: 38,
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={isEdit ? <SaveOutlined /> : <PlusOutlined />}
                    loading={loading}
                    style={{
                      padding: "0 25px",
                      height: 38,
                      background: "#008AD5",
                      color: "white",
                      fontWeight: 500,
                    }}
                  >
                    {isEdit ? "Edit Changes" : "Save Changes"}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default CreateNewSubscription;
