import React from "react";
import { Table, Button, Space, Tag, Input } from "antd";
import { FaDownload, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";

const { Search } = Input;

function Documents() {
  const columns = [
    {
      title: "Document Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Created: {record.createdDate}
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={
            type === "PDF"
              ? "red"
              : type === "DOC"
              ? "blue"
              : type === "XLS"
              ? "green"
              : "orange"
          }
        >
          {type}
        </Tag>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "Published"
              ? "green"
              : status === "Draft"
              ? "orange"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button type="text" icon={<FaEye />} size="small" />
          <Button type="text" icon={<FaDownload />} size="small" />
          <Button type="text" icon={<FaEdit />} size="small" />
          <Button type="text" icon={<FaTrash />} size="small" danger />
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      name: "Project Proposal 2024",
      type: "PDF",
      size: "2.5 MB",
      status: "Published",
      createdDate: "2024-01-15",
    },
    {
      key: "2",
      name: "Financial Report Q4",
      type: "XLS",
      size: "1.8 MB",
      status: "Draft",
      createdDate: "2024-01-14",
    },
    {
      key: "3",
      name: "User Manual v2.1",
      type: "DOC",
      size: "3.2 MB",
      status: "Published",
      createdDate: "2024-01-13",
    },
    {
      key: "4",
      name: "Marketing Strategy",
      type: "PDF",
      size: "4.1 MB",
      status: "Review",
      createdDate: "2024-01-12",
    },
  ];

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h2>Documents</h2>
        <p>Manage your documents and files</p>
      </div>

      <div className="content-body">
        <div className="card">
          <div className="card-body">
            <div style={{ marginBottom: 16 }}>
              <Search
                placeholder="Search documents..."
                allowClear
                enterButton={<FaSearch />}
                size="middle"
                style={{ maxWidth: 300 }}
              />
            </div>
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documents;
