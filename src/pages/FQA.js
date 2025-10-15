import React, { useState, useEffect } from "react";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Row, Col, Input, Modal, Popconfirm, message } from "antd";
import editIcon from "../assets/images/edit.svg";
import { FaTrash } from "react-icons/fa";
import { loginApi } from "../services/api";

export default function FQA({ dealerData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchFAQ();
  }, []);

  const fetchFAQ = async () => {
    try {
      setLoading(true);
      const res = await loginApi.getfaq();
      const data = res?.data;
      if (data?.status_code === 200) {
        setItems(data.data.faqs || []);
      } else {
        messageApi.error(data?.message || "Failed to fetch Q&A");
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while fetching Q&A";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const trimmedQ = question.trim();
    const trimmedA = answer.trim();
    if (!trimmedQ || !trimmedA) {
      Modal.warning({
        title: "Missing fields",
        content: "Please enter both question and answer.",
      });
      return;
    }

    try {
      setLoading(true);
      const body = {
        question: trimmedQ,
        answer: trimmedA,
        ...(editingId && { id: editingId }),
      };

    let res;
    if (editingId) {
      res = await loginApi.editfaq(editingId, body); 
    } else {
      res = await loginApi.savefaq(body);
    }

      const data = res?.data;
      if (data?.status_code === 200 || data?.status_code === 201) {
        messageApi.success(data?.message || "Q&A saved successfully");
        fetchFAQ();
        setIsOpen(false);
        setQuestion("");
        setAnswer("");
        setEditingId(null);
      } else {
        messageApi.error(data?.message || "Failed to save Q&A");
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while saving Q&A";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setQuestion("");
    setAnswer("");
    setEditingId(null);
    setIsOpen(true);
  };

  const openEdit = (item) => {
    setQuestion(item.question);
    setAnswer(item.answer);
    setEditingId(item.id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
  try {
    setLoading(true);
    const res = await loginApi.deletefaq(id); 
    const data = res?.data;

    if (data?.status_code === 200) {
      messageApi.success(data?.message || "Deleted successfully");
      fetchFAQ();
    } else {
      messageApi.error(data?.message || "Failed to delete");
    }
  } catch (err) {
    const errorMessage =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong while deleting";
    messageApi.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-3xl mx-auto p-4">
      {contextHolder}

      <div
        style={{
          marginBottom: "16px",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
          padding: "12px",
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <h2 className="text-lg font-semibold">FAQ (Questions & Answers)</h2>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={openNew}
              icon={<PlusOutlined />}
              style={{
                padding: "0 25px",
                height: 36,
                background: "#008AD5",
                color: "white",
                fontWeight: 500,
              }}
            >
              Add New Q&A
            </Button>
          </Col>
        </Row>

        <div className="mt-5 space-y-4">
          {items.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No Q&A yet — click Add to create one.
            </div>
          )}

          {items.map((it) => (
            <div
              key={it.id}
              style={{
                marginBottom: "16px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                padding: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <div>
                  <h1
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#1F2937",
                      marginBottom: 2,
                    }}
                  >
                    Question: {it.question}
                  </h1>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#4B5563",
                      margin: 0,
                      fontWeight: "400",
                    }}
                  >
                    Answer: {it.answer}
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                  <button
                    style={{
                      backgroundColor: "#E5E7EB",
                      color: "#374151",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "400",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                    onClick={() => openEdit(it)}
                  >
                    <img src={editIcon} alt="edit" style={{ width: "12px", height: "12px" }} />
                    <span>Edit</span>
                  </button>

                  <Popconfirm
                    title="Delete Q&A"
                    description="Are you sure you want to delete this item?"
                    onConfirm={() => handleDelete(it.id)}
                    okText="Yes"
                    cancelText="No"
                    okType="danger"
                  >
                    <Button type="text" icon={<FaTrash />} size="small" danger title="Delete Q&A" />
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        title={editingId ? "Edit Q&A" : "Add Q&A"}
        visible={isOpen}
        onCancel={() => setIsOpen(false)}
        centered
        width={680}
        footer={[
          <Button key="cancel" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={loading}>
            {editingId ? "Save" : "Add"}
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 12 }}>
          <Input.TextArea
            placeholder="Add Question"
            rows={1}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            autoFocus
          />
        </div>

        <div>
          <Input.TextArea
            placeholder="Add Answer..."
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}