import React, { useState } from "react";
import { Tabs, Button, Card, Modal, Form, Input, message } from "antd";

function WebsiteContent() {
  const [activeTab, setActiveTab] = useState("faqs");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faqs, setFaqs] = useState([
    {
      question: "What is your return policy?",
      answer: "You can return the product within 30 days of purchase.",
    },
    {
      question: "Do you offer technical support?",
      answer: "Yes, we offer 24/7 technical support via chat and email.",
    },
  ]);

  const [form] = Form.useForm();

  const handleAddClick = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        setFaqs([...faqs, values]);
        setIsModalOpen(false);
        message.success("FAQ added successfully!");
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  return (
    <div className="content-wrapper" style={{ padding: "20px" }}>
      <div className="content-body">
        <div className="card">
          <div className="card-body">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              style={{ marginBottom: 16 }}
              items={[
                { key: "faqs", label: "FAQs" },
                { key: "privacy", label: "Privacy" },
                { key: "terms", label: "Terms" },
                { key: "blogs", label: "Blogs" },
              ]}
            />

            {activeTab === "faqs" && (
              <Card
                bordered
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Frequently Asked Questions</span>
                    <Button type="primary" onClick={handleAddClick}>
                      + Add
                    </Button>
                  </div>
                }
                style={{ marginBottom: "16px" }}
              >
                <ul style={{ paddingLeft: "20px" }}>
                  {faqs.map((faq, index) => (
                    <li key={index} style={{ marginBottom: "16px" }}>
                      <strong>{faq.question}</strong>
                      <p style={{ margin: "4px 0 0 0" }}>{faq.answer}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {activeTab === "privacy" && (
              <Card
                bordered
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Privacy Policy</span>
                    <Button type="primary" onClick={handleAddClick}>
                      + Add
                    </Button>
                  </div>
                }
                style={{ marginBottom: "16px" }}
              >
                <ul style={{ paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "12px" }}>
                    We collect personal data to improve user experience.
                  </li>
                  <li style={{ marginBottom: "12px" }}>
                    Your data will not be shared with third parties without
                    consent.
                  </li>
                  <li style={{ marginBottom: "12px" }}>
                    You can request data deletion at any time.
                  </li>
                </ul>
              </Card>
            )}

            {activeTab === "terms" && (
              <Card
                bordered
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Terms & Conditions</span>
                    <Button type="primary" onClick={handleAddClick}>
                      + Add
                    </Button>
                  </div>
                }
                style={{ marginBottom: "16px" }}
              >
                <ul style={{ paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "12px" }}>
                    We collect personal data to improve user experience.
                  </li>
                  <li style={{ marginBottom: "12px" }}>
                    Your data will not be shared with third parties without
                    consent.
                  </li>
                  <li style={{ marginBottom: "12px" }}>
                    You can request data deletion at any time.
                  </li>
                </ul>
              </Card>
            )}

            <Modal
              title={
                activeTab === "faqs"
                  ? "Add FAQ"
                  : activeTab === "privacy"
                  ? "Add Privacy Policy"
                  : activeTab === "terms"
                  ? "Add Terms & Conditions"
                  : activeTab === "blogs"
                  ? "Add Blog" 
                  : "Add Content"
              }
              visible={isModalOpen}
              onCancel={handleCancel}
              onOk={handleSubmit}
              okText="Submit"
              cancelText="Cancel"
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  label=""
                  name="question"
                  rules={[
                    { required: true, message: "Please enter a question" },
                  ]}
                >
                  <Input placeholder="Enter the question" />
                </Form.Item>

                {activeTab === "faqs" && (
                  <Form.Item
                    label=""
                    name="answer"
                    rules={[
                      { required: true, message: "Please enter an answer" },
                    ]}
                  >
                    <Input.TextArea placeholder="Enter the answer" rows={4} />
                  </Form.Item>
                )}
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebsiteContent;
