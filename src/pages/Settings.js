import React, { useState } from "react";
import {
  Card,
  Form,
  Switch,
  Input,
  Button,
  Select,
  Divider,
  Row,
  Col,
  Avatar,
  Upload,
} from "antd";
import {
  FaUser,
  FaLock,
  FaBell,
  FaPalette,
  FaGlobe,
  FaUpload,
} from "react-icons/fa";

const { Option } = Select;

function Settings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Settings updated:", values);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h2>Settings</h2>
        <p>Manage your account preferences</p>
      </div>

      <div className="content-body">
        <Row gutter={[24, 24]}>
          {/* Profile Settings */}
          <Col xs={24} lg={12}>
            <Card title="Profile Settings" icon={<FaUser />}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  name: "John Doe",
                  email: "john.doe@example.com",
                  phone: "+1 (555) 123-4567",
                  language: "en",
                  timezone: "UTC-5",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <Upload
                    name="avatar"
                    listType="picture-circle"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  >
                    <div>
                      <Avatar size={80} src="https://via.placeholder.com/80" />
                      <div style={{ marginTop: 8 }}>
                        <FaUpload /> Upload
                      </div>
                    </div>
                  </Upload>
                </div>

                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter your name!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label="Phone Number" name="phone">
                  <Input />
                </Form.Item>

                <Form.Item label="Language" name="language">
                  <Select>
                    <Option value="en">English</Option>
                    <Option value="es">Spanish</Option>
                    <Option value="fr">French</Option>
                    <Option value="de">German</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Timezone" name="timezone">
                  <Select>
                    <Option value="UTC-8">Pacific Time (UTC-8)</Option>
                    <Option value="UTC-7">Mountain Time (UTC-7)</Option>
                    <Option value="UTC-6">Central Time (UTC-6)</Option>
                    <Option value="UTC-5">Eastern Time (UTC-5)</Option>
                    <Option value="UTC+0">UTC</Option>
                    <Option value="UTC+1">Central European Time (UTC+1)</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Security Settings */}
          <Col xs={24} lg={12}>
            <Card title="Security Settings" icon={<FaLock />}>
              <Form layout="vertical">
                <Form.Item label="Current Password">
                  <Input.Password placeholder="Enter current password" />
                </Form.Item>

                <Form.Item label="New Password">
                  <Input.Password placeholder="Enter new password" />
                </Form.Item>

                <Form.Item label="Confirm New Password">
                  <Input.Password placeholder="Confirm new password" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" danger>
                    Change Password
                  </Button>
                </Form.Item>

                <Divider />

                <Form.Item label="Two-Factor Authentication">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Login Notifications">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Session Timeout (minutes)">
                  <Select defaultValue="30">
                    <Option value="15">15 minutes</Option>
                    <Option value="30">30 minutes</Option>
                    <Option value="60">1 hour</Option>
                    <Option value="120">2 hours</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Notification Settings */}
          <Col xs={24} lg={12}>
            <Card title="Notification Settings" icon={<FaBell />}>
              <Form layout="vertical">
                <Form.Item label="Email Notifications">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Push Notifications">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="SMS Notifications">
                  <Switch />
                </Form.Item>

                <Divider />

                <Form.Item label="New User Registration">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="System Updates">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Marketing Emails">
                  <Switch />
                </Form.Item>

                <Form.Item label="Weekly Reports">
                  <Switch defaultChecked />
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Appearance Settings */}
          <Col xs={24} lg={12}>
            <Card title="Appearance Settings" icon={<FaPalette />}>
              <Form layout="vertical">
                <Form.Item label="Theme">
                  <Select defaultValue="light">
                    <Option value="light">Light</Option>
                    <Option value="dark">Dark</Option>
                    <Option value="auto">Auto (System)</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Primary Color">
                  <Select defaultValue="blue">
                    <Option value="blue">Blue</Option>
                    <Option value="green">Green</Option>
                    <Option value="purple">Purple</Option>
                    <Option value="red">Red</Option>
                    <Option value="orange">Orange</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Font Size">
                  <Select defaultValue="medium">
                    <Option value="small">Small</Option>
                    <Option value="medium">Medium</Option>
                    <Option value="large">Large</Option>
                  </Select>
                </Form.Item>

                <Divider />

                <Form.Item label="Compact Mode">
                  <Switch />
                </Form.Item>

                <Form.Item label="Show Animations">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Auto-hide Sidebar">
                  <Switch defaultChecked />
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Privacy Settings */}
          <Col xs={24}>
            <Card title="Privacy Settings" icon={<FaGlobe />}>
              <Form layout="vertical">
                <Row gutter={[24, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Profile Visibility">
                      <Select defaultValue="public">
                        <Option value="public">Public</Option>
                        <Option value="friends">Friends Only</Option>
                        <Option value="private">Private</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Activity Status">
                      <Select defaultValue="online">
                        <Option value="online">Show as Online</Option>
                        <Option value="away">Show as Away</Option>
                        <Option value="offline">Show as Offline</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Data Collection">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Analytics Tracking">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Third-party Cookies">
                  <Switch />
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* Save Button */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button
            type="primary"
            size="large"
            onClick={() => form.submit()}
            loading={loading}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
