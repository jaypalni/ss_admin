import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Tag,
  Radio,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import "../assets/styles/subcriptions.css";

const { Title, Text } = Typography;
const { Option } = Select;

const initialPlansData = {
  Individual: [
    {
      id: 1,
      title: "Freemium +",
      price: 5,
      duration: "15 Days",
      features: ["Price Model Per Car", "1 Posts Allowed", "10 Photos Allowed"],
      highlight: false,
      current: false,
    },
    {
      id: 2,
      title: "Freemium",
      price: 5,
      duration: "15 Days",
      features: ["Price Model Per Car", "1 Posts Allowed", "10 Photos Allowed"],
      highlight: false,
      current: false,
    },
  ],
  Dealer: [],
};

const Subscriptions = () => {
  const [activeTab, setActiveTab] = useState("Individual");
  const [plansData, setPlansData] = useState(initialPlansData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form] = Form.useForm();

  const openModal = (plan = null) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
    if (plan) {
      form.setFieldsValue({
        ...plan,
        type: ["Individual"], // default selection if editing
      });
    } else {
      form.resetFields();
    }
  };

  const handleFormSubmit = (values) => {
    const newPlan = {
      id: Date.now(),
      title: values.title,
      price: Number(values.price),
      duration: values.duration,
      features: values.features?.split(",").map((f) => f.trim()),
      highlight: false,
      current: false,
    };

    const updatedData = { ...plansData };

    values.type.forEach((type) => {
      if (editingPlan) {
        // Editing
        updatedData[type] = updatedData[type].map((plan) =>
          plan.id === editingPlan.id ? { ...plan, ...newPlan } : plan
        );
      } else {
        // Creating
        updatedData[type] = [...updatedData[type], newPlan];
      }
    });

    setPlansData(updatedData);
    setIsModalOpen(false);
  };

  return (
    <div className="subscriptions-container">
      <div style={{ display: "flex" }}>
        <h1 className="subscriptions-title">Subscriptions</h1>
        <Button
          style={{ marginLeft: "auto", fontWeight: "700" }}
          onClick={() => openModal()}
        >
          Create New Plan
        </Button>
      </div>

      <p className="subscriptions-description">
        Lorem ipsum dolor sit amet consectetur. Leo vitae tellus turpis
        adipiscing in. Eget in vehicula ut egestas risus sit lacus. Sit et ut ac
        vulputate. Scelerisque euismod phasellus dignissim ut.
      </p>

      <div className="subscriptions-tabs">
        <Radio.Group
          onChange={(e) => setActiveTab(e.target.value)}
          value={activeTab}
        >
          <Radio.Button value="Individual">Individual</Radio.Button>
          <Radio.Button value="Dealer">Dealer</Radio.Button>
        </Radio.Group>
      </div>

      <div className="subscriptions-cards">
        {plansData[activeTab]?.length > 0 ? (
          plansData[activeTab].map((plan) => (
            <Card
              key={plan.id}
              title={plan.title}
              className={`subscriptions-card ${
                plan.highlight ? "highlight-card" : ""
              }`}
            >
              {plan.highlight && (
                <Tag color="blue" className="highlight-tag">
                  Highlight
                </Tag>
              )}
              <Title level={3}>${plan.price}</Title>
              <Text type="secondary">{plan.duration}</Text>
              <div className="features-list">
                {plan.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <CheckCircleTwoTone twoToneColor="#52c41a" />{" "}
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  type="primary"
                  block
                  style={{ marginTop: "16px" }}
                  onClick={() => openModal(plan)}
                >
                  Edit Plan
                </Button>
                <Button
                  type="primary"
                  block
                  style={{ marginTop: "16px", backgroundColor: "red" }}
                  //   onClick={() => openModal(plan)}
                >
                  Delete Plan
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="no-plans">No plans available for {activeTab}.</p>
        )}
      </div>

      {/* Modal with Form */}
      <Modal
        title={editingPlan ? "Edit Plan" : "Create New Plan"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingPlan ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter plan title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration"
            rules={[{ required: true, message: "Please enter duration" }]}
          >
            <Input placeholder="e.g., 15 Days" />
          </Form.Item>

          <Form.Item
            name="features"
            label="Features (comma-separated)"
            rules={[{ required: true, message: "Enter at least one feature" }]}
          >
            <Input placeholder="e.g., 1 Post Allowed, 10 Photos Allowed" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Plan For"
            rules={[{ required: true, message: "Please select type" }]}
          >
            <Select mode="multiple" placeholder="Select one or both">
              <Option value="Individual">Individual</Option>
              <Option value="Dealer">Dealer</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Subscriptions;
