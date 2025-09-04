import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  message,
  Space,
  Typography,
  Card,
} from "antd";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/api";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import PropTypes from 'prop-types';
const { Option } = Select;
const { Text, Title } = Typography;

function CreateSubadmin({ reloadList }) {
  const [createForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateUser = async (values) => {
    try {
      setLoading(true);

      console.log("API Hitterd");

      const body = {
        email: values.email,
        first_name: values.firstName,
        last_name: values.lastName,
        designation: values.designation,
        phone_number: values.phone,
        is_listing_manager: values.isManager,
      };

      console.log("API Hitterd", body);

      const filteredBody = Object.fromEntries(
        Object.entries(body).filter(
          ([_, value]) =>
            value !== null &&
            value !== undefined &&
            !(typeof value === "string" && value.trim() === "")
        )
      );

      const response = await loginApi.createsubadmin(filteredBody);
      const data = handleApiResponse(response);

      console.log("Response", data);

      if (data?.status_code === 200) {
        message.success({
          content: (
            <div>
              <Text strong>User created successfully!</Text>
              <br />
              <Text>
                Generated Password:{" "}
                <Text code copyable>
                  {data.generated_password}
                </Text>
              </Text>
            </div>
          ),
          duration: 6,
        });
        console.log("API Hitterd2");

        createForm.resetFields();
        if (reloadList) reloadList();

        setTimeout(() => {
          navigate("/dashboard"); // 🔁 Replace with your admin list route
        }, 1000);
      } else {
        message.error(data.message || "Something went wrong");
      }
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 700, margin: "32px auto" }}>
      <Title level={3}>Create New Admin User</Title>
      <Form form={createForm} layout="vertical" onFinish={handleCreateUser}>
        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input placeholder="Enter phone number" />
        </Form.Item>

        <Form.Item
          name="designation"
          label="Designation"
          rules={[{ required: true, message: "Please enter designation" }]}
        >
          <Input placeholder="Enter designation" />
        </Form.Item>

        <Form.Item
          name="isManager"
          label="Is Listing Manager?"
          rules={[{ required: true, message: "Please select manager status" }]}
        >
          <Select placeholder="Select listing manager status">
            <Option value={true}>Yes</Option>
            <Option value={false}>No</Option>
          </Select>
        </Form.Item>

        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={() => createForm.resetFields()}>Reset</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create User
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
}

CreateSubadmin.propTypes = {
  reloadList: PropTypes.node.isRequired,
};

export default CreateSubadmin;
