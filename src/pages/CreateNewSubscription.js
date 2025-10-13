import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import "../assets/styles/otp.css";
import { useNavigate, useParams } from "react-router-dom";
import { loginApi } from "../services/api";
import { useSelector } from "react-redux";

const { Option } = Select;

const RequiredLabel = ({ text }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
    <span>{text}</span>
    <span style={{ color: "red" }}>*</span>
  </span>
);

RequiredLabel.propTypes = {
  text: PropTypes.string.isRequired,
};

const CreateNewSubscription = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [, setFetching] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [, setStatusFlag] = useState(null);
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
          let autoRenewValue = null;
        if (user.Auto_renewed === 1) autoRenewValue = "yes";
        else if (user.Auto_renewed === 0) autoRenewValue = "no";
        let planTypeValue = "";
  if (user.subscription_type) {
    planTypeValue = user.subscription_type.toLowerCase(); 
  } else if (user.name?.toLowerCase().includes("boost")) {
    planTypeValue = "boosting";
  } else {
    planTypeValue = "listing";
  }
          form.setFieldsValue({
            namePlan: user.name ?? "",
            price: user.price ?? "",
            duration: user.duration_days ?? "",
            numList: user.listing_limit ?? "",
            userType: user.target_user_type,
            autoRenew: autoRenewValue,
            planType: planTypeValue,
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
    const body = {
      ...(isEdit ? { id: id } : {}),
      plan_name: values.namePlan,
      price: Number(values.price),
      duration_days: Number(values.duration),
      number_of_listings: Number(values.numList),
      auto_renewed_status: values.autoRenew === "yes" ? 1 : 0,
      currency: "IQD",
      targeted_user_type: values.userType,
      plan_type: values.planType,
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
        <button
          type="button"
          onClick={() => navigate("/financials/pricing")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 400,
            padding: 0,
          }}
        >
          Pricing
        </button>
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
                marginBottom: "10px",
              }}
            >
              {/* {isEdit ? "Edit Subscription Plan" : "Create New Subscription Plan"} */}
            </h2>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={<RequiredLabel text="Name of Plan" />}
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
      label={<RequiredLabel text="Plan Type" />}
      name="planType"
      rules={[{ required: true, message: "Please select Plan Type" }]}
      style={{ marginBottom: 8 }}
    >
      <Select
        placeholder="Select Plan Type"
        style={{ height: 38 }}
        disabled={isEdit} 
        onChange={(val) => {
          if (val !== "listings") {
            form.setFieldsValue({ autoRenew: undefined, userType: undefined });
          }
        }}
      >
        <Option value="listing">Listing</Option>
        <Option value="boosting">Boosting</Option>
      </Select>
    </Form.Item>
  </Col>
</Row>

            {/* Price */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={<RequiredLabel text="Price" />}
                  name="price"
                  rules={[{ required: true, message: "Price is required" }]}
                >
                  <Input
                    placeholder="0"
                    style={{ height: "38px" }}
                    suffix={<span style={{ color: "#6B7280", fontWeight: 500 }}>IQD</span>}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Number of Listings */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={<RequiredLabel text="Number of Listings" />}
                  name="numList"
                  rules={[{ required: true, message: "Number of Listings is required" }]}
                >
                  <Input placeholder="0" style={{ height: "38px" }} />
                </Form.Item>
              </Col>
            </Row>

            {/* Duration */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label={<RequiredLabel text="Duration (in Days)" />}
                  name="duration"
                  rules={[{ required: true, message: "Duration is required" }]}
                >
                  <Input placeholder="0" style={{ height: "38px" }} />
                </Form.Item>
              </Col>
            </Row>

<Row gutter={[12, 8]} align="middle" style={{ marginBottom: 8 }}>
  <Col xs={24} sm={12}>
    <Form.Item shouldUpdate={(prev, cur) => prev.planType !== cur.planType}>
      {() => {
        const isListings = form.getFieldValue("planType") === "listing";
        return (
          <Form.Item
            label={isListings ? <RequiredLabel text="Auto Renew" /> : <span>Auto Renew</span>}
            name="autoRenew"
            rules={
              isListings
                ? [{ required: true, message: "Please choose Auto Renew option" }]
                : []
            }
            style={{ marginBottom: 0 }}
          >
            <Select placeholder="Select Auto Renew" style={{ height: 38 }}>
              <Option value="yes">Yes</Option>
              <Option value="no">No</Option>
            </Select>
          </Form.Item>
        );
      }}
    </Form.Item>
  </Col>

  <Col xs={24} sm={12}>
    <Form.Item shouldUpdate={(prev, cur) => prev.planType !== cur.planType}>
      {() => {
        const isListings = form.getFieldValue("planType") === "listings";
        return (
          <Form.Item
            label={isListings ? <RequiredLabel text="User Type" /> : <span>User Type</span>}
            name="userType"
            rules={
              isListings ? [{ required: true, message: "Please select user type option" }] : []
            }
            style={{ marginBottom: 0 }}
          >
            <Select placeholder="Select User Type" style={{ height: 38 }}>
              <Option value="dealer">Dealer</Option>
              <Option value="individual">Individual</Option>
            </Select>
          </Form.Item>
        );
      }}
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
