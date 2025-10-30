import React, { useState, useEffect } from "react";
import {
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Row,
  Col,
  Input,
  Modal,
  Popconfirm,
  message,
  Spin,
  Card,
  Select,
  Divider,
  Pagination,
} from "antd";
import editIcon from "../assets/images/edit.svg";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiClock, FiUser,FiMoreVertical  } from "react-icons/fi"
import { loginApi } from "../services/api";
import { handleApiError } from "../utils/apiUtils";
import PropTypes from "prop-types";

const { Option } = Select;

const FQA = ({ dealerData }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

useEffect(() => {
  fetchFAQ();
}, [page, searchValue, statusFilter, languageFilter, sortBy]);

  const fetchFAQ = async () => {
    const bodyData = {
      page,
      limit,
      lang: languageFilter,
      search_query: searchValue,
      sort_by: sortBy,
      status: statusFilter === "all" ? "" : statusFilter,
    };

    try {
      setLoading(true);
      const res = await loginApi.getfaq(bodyData);
      const data = res?.data;

      if (data?.status_code === 200) {
        const formattedFaqs = (data?.data?.faqs || []).map((faq) => ({
          ...faq,
          status: faq.is_published === 1 ? "Published" : "Draft",
          language:
            faq.lang?.toLowerCase() === "en"
              ? "En"
              : faq.lang?.toLowerCase() === "ar"
              ? "Ar"
              : faq.lang?.toLowerCase() === "ku"
              ? "Ku"
              : "Unknown",
        }));
        setItems(formattedFaqs);
        const totalFromApi =
          data?.data?.pagination?.total || data?.data?.total || formattedFaqs.length;
        setTotal(totalFromApi);
      } else {
        messageApi.error(data?.message || "Failed to fetch Q&A");
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      messageApi.open({
        type: "error",
        content: errorMessage?.error || "Error fetching FAQs",
      });
    } finally {
      setLoading(false);
    }
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

  const filteredItems = items.filter((it) => {
    const matchSearch =
      searchValue === "" ||
      it.question.toLowerCase().includes(searchValue.toLowerCase()) ||
      it.answer.toLowerCase().includes(searchValue.toLowerCase());
    const matchLanguage =
      languageFilter === "all" ||
      it.language.toLowerCase() === languageFilter.toLowerCase();
    const matchStatus =
      statusFilter === "all" ||
      it.status.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchLanguage && matchStatus;
  });

  return (
    <div className="max-w-3xl mx-auto p-4" style={{ position: "relative" }}>
      {contextHolder}

      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <Spin size="large" tip="Loading..." />
        </div>
      )}

      <Row align="middle" justify="space-between">
        <Col>
          <div>
            <h2 style={{fontSize:23}} className="font-bold mb-1">FAQ Management</h2>
            <p
              style={{ color: "#4B5563",fontSize:13 }}
              className="text-gray-400 text-sm font-medium"
            >
              Create, edit, and organize frequently asked questions for your users
            </p>
          </div>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => navigate("/Add/FAQ'S")}
            icon={<PlusOutlined />}
            style={{
              padding: "0 10px",
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

      <Card
        style={{
          marginBottom: 12,
          backgroundColor: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Input
                placeholder="Search FAQs..."
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setPage(1); 
                }}
                style={{ width: 200 }}
                prefix={<SearchOutlined style={{ color: "#9CA3AF" }} />}
                onPressEnter={() => {
                  setPage(1);
                  fetchFAQ();
                }}
              />

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#374151", fontSize: 13, fontWeight: 500 }}>
                  Language:
                </span>
                <Select
                  value={languageFilter}
                  style={{ width: 160 }}
                  onChange={(val) => {
                    setLanguageFilter(val);
                    setPage(1);
                  }}
                >
                  <Option value="all">All</Option>
                  <Option value="en">English</Option>
                  <Option value="ar">Arabic</Option>
                  <Option value="ku">Kurdish</Option>
                </Select>
              </div>
              
            </div>
          </Col>

          <Col style={{ display: "flex", gap: 12 }}>
            <Select
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              style={{ width: 160 }}
            >
              <Option value="all">All Status</Option>
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </Col>
        </Row>
      </Card>

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#1F2937",
              margin: 0,
            }}
          >
            FAQ List
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#374151", fontSize: 13, fontWeight: 500 }}>
                  Sort by:
                </span>
                <Select
                  value={sortBy}
                  style={{ width: 140 }}
                  onChange={(val) => {
                    setSortBy(val);
                    setPage(1);
                  }}
                >
                  <Option value="latest">Newest</Option>
                  <Option value="oldest">Oldest</Option>
                </Select>
              </div>
        </div>

        <Divider style={{ margin: "0px 0" }} />

        <div className="mt-4 space-y-4">
          {filteredItems.length === 0 && (
            <div className="p-6 text-center text-gray-500">No Q&A found.</div>
          )}

          {filteredItems.map((it) => (
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
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: 4,
    }}
  >
    <h1
      style={{
        fontSize: "20px",
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 0,
      }}
    >
      {it.question}
    </h1>

    <span
      style={{
        backgroundColor: it.status === "Published" ? "#DCFCE7" : "#FEF9C3",
        color: it.status === "Published" ? "#166534" : "#854D0E",
        fontSize: "12px",
        fontWeight: "500",
        padding: "2px 8px",
        borderRadius: "12px",
      }}
    >
      {it.status}
    </span>

    <span
      style={{
        backgroundColor: "#F3F4F6",
        color: "#1F2937",
        fontSize: "12px",
        fontWeight: "500",
        padding: "2px 8px",
        borderRadius: "12px",
      }}
    >
      {it.language}
    </span>
  </div>

  <p
    style={{
      fontSize: "13px",
      color: "#4B5563",
      margin: 0,
      fontWeight: "400",
    }}
  >
    {it.answer}
  </p>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginTop: "8px",
      color: "#6B7280",
      fontSize: "12px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <FiClock size={12} />
      <span style={{fontSize:14,fontWeight:400,color:"#6B7280"}}>Last modified: {it.created_at}</span>
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <FiUser size={12} />
      <span style={{fontSize:14,fontWeight:400,color:"#6B7280"}}>Created by: {it.created_by ?? "-"}</span>
    </div>
  </div>
</div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >

                    <img
                      src={editIcon}
                      alt="edit"
                      style={{ width: "12px", height: "12px",marginTop:5 }}
                       onClick={() => navigate(`/FAQ'S/${it.id}`)}
                    />

                  <Popconfirm
                    title="Delete Q&A"
                    description="Are you sure you want to delete this item?"
                    onConfirm={() => handleDelete(it.id)}
                    okText="Yes"
                    cancelText="No"
                    okType="danger"
                  >
                    <Button
                      type="text"
                      icon={<FaTrash style={{ color: "#6B7280",width: "13px", height: "13px" }} />}
                      size="small"
                      danger
                      title="Delete Q&A"
                      
                    />
                  </Popconfirm>

                 <FiMoreVertical 
                  style={{
                    width: "14px",
                    height: "14px",
                    color: "#6B7280",
                    cursor: "pointer",
                    marginTop: 5,
                  }}
                />

                </div>
              </div>
            </div>
          ))}
        </div>

        <Row justify="end" style={{ marginTop: 16 }}>
          <Pagination
  current={page}
  total={total}
  pageSize={limit}
  showSizeChanger={false}
  showTotal={(total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`}
  onChange={(p, pSize) => {
    setPage(p);
    if (pSize && pSize !== limit) setLimit(pSize);
  }}
/>
        </Row>
      </div>
    </div>
  );
};

FQA.propTypes = {
  dealerData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
};

FQA.defaultProps = {
  dealerData: null,
};

export default FQA;
