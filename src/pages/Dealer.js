import React, { useState, useMemo, useEffect } from "react";
import { Input, Select, Table, Card, Row, Col, Button } from "antd";
import { EyeOutlined, DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EditOutlined from "../assets/images/flag.svg";
import DeleteOutlined from "../assets/images/banned.svg";
import "../assets/styles/dealer.css";

const { Option } = Select;

const Dealer = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = token && user;

  useEffect(() => {
    if (!isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const dataSource = [
    { id: "#USR001", company: "Baghad Motors", owner: "Ahmed Al-Rashid", email: "ahmed@baghdadmotors.com", phone: "+964-770-000-0000", registered: "Jan 15, 2024", listings: 12, status: "Verified" },
    { id: "#USR002", company: "Basra Auto Center", owner: "Omar Hassan", email: "omar@basraauto.com", phone: "+964-770-111-1111", registered: "Feb 03, 2024", listings: 5, status: "Pending" },
    { id: "#USR003", company: "Erbil Car Gallery", owner: "Karwan Ahmed", email: "info@erbilcars.com", phone: "+964-770-222-2222", registered: "Mar 12, 2024", listings: 18, status: "Rejected" },
    { id: "#USR004", company: "Najaf Motors", owner: "Ali Al-Najafi", email: "ali@najafmotors.com", phone: "+964-770-333-3333", registered: "Apr 08, 2024", listings: 2, status: "Info Requested" },
  ];

  const filteredData = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return dataSource.filter((item) => {
      const searchMatch =
        !q ||
        (item.id && item.id.toLowerCase().includes(q)) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        (item.owner && item.owner.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q));

      const statusMatch = statusFilter === "All Status" || item.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [searchValue, statusFilter, dataSource]);

  const handleExport = () => {
    if (!filteredData || filteredData.length === 0) return;
    const headers = ["User ID", "Company", "Owner", "Email", "Phone", "Registered", "Listings", "Status"];
    const rows = filteredData.map((r) => [r.id, r.company, r.owner, r.email, r.phone, r.registered, r.listings, r.status]);
    const csvContent = [headers, ...rows]
      .map((e) => e.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dealers_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span style={{ color: "#1890ff", cursor: "pointer" }}>{text}</span>,
      width: 120,
    },
   {
  title: "Company",
  dataIndex: "company",
  key: "company",
  width: 220,
  render: (text) => <span className="dealer-company">{text}</span>,
},
{
  title: "Owner",
  dataIndex: "owner",
  key: "owner",
  width: 180,
  render: (text) => <span className="dealer-owner">{text}</span>,
},

    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      width: 220,
      render: (_, record) => (
        <div className="contact-cell">
          <div className="contact-email">{record.email}</div>
          <div className="contact-phone">{record.phone}</div>
        </div>
      ),
    },
    { title: "Registered", dataIndex: "registered", key: "registered", width: 140, render: (text) => <span className="dealer-registered">{text}</span>,},
    { title: "Listings", dataIndex: "listings", key: "listings", align: "center", width: 120 },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (status) => {
        let bgColor = "#DBEAFE";
        let textColor = "#1E40AF";
        if (status === "Verified") { bgColor = "#DCFCE7"; textColor = "#166534"; }
        else if (status === "Pending") { bgColor = "#FEF9C3"; textColor = "#854D0E"; }
        else if (status === "Rejected") { bgColor = "#FEE2E2"; textColor = "#991B1B"; }
        else if (status === "Info Requested") { bgColor = "#DBEAFE"; textColor = "#1E40AF"; }

        return (
          <div
            style={{
              display: "inline-block",
              backgroundColor: bgColor,
              color: textColor,
              padding: "6px 10px",
              borderRadius: 8,
              fontSize: 10,
              whiteSpace: "normal", 
              maxWidth: 140,
              textAlign: "center",
              wordBreak: "break-word",
            }}
          >
            {status}
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 140,
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <EyeOutlined style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }} onClick={() => navigate(`/user-management/dealer/:dealerId`)} />
          <img src={EditOutlined} alt="edit" style={{ width: 18, height: 18, cursor: "pointer" }} onClick={() => console.log(`Edit ${record.id}`)} />
          <img src={DeleteOutlined} alt="delete" style={{ width: 18, height: 18, cursor: "pointer" }} onClick={() => console.log(`Delete ${record.id}`)} />
        </div>
      ),
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage]);

  return (
    <div style={{ padding: 20, background: "#f0f2f5" }}>
      <Card style={{ marginBottom: 16, backgroundColor: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <Row justify="space-between" align="middle">
          <Col style={{ display: "flex", gap: 12 }}>
            <Input
              placeholder="Search dealers by company, owner, email, phone or ID..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 420 }}
              prefix={<SearchOutlined style={{ color: "#B0B0B0" }} />}
              allowClear
            />
          </Col>
          <Col>
            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 200, marginRight: 8 }}>
              <Option value="All Status">All Status</Option>
              <Option value="Verified">Verified</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Rejected">Rejected</Option>
              <Option value="Info Requested">Info Requested</Option>
            </Select>
            <Button type="primary" onClick={handleExport} icon={<DownloadOutlined />} style={{ backgroundColor: "#16A34A", margin: "8px" }}>
              Export
            </Button>
          </Col>
        </Row>

        <div style={{ marginTop: 0 }}>
          <span style={{ color: "#4B5563", fontSize: 14, fontWeight: 400 }}>
            Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} dealers
          </span>
        </div>
      </Card>

      <Card style={{ margin: "0 auto", maxWidth: 1200, backgroundColor: "#fff" }}>
        <Table
          className="dealer-table"
          dataSource={paginatedData}
          columns={columns}
          rowKey="id"
          bordered={false}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            showSizeChanger: false,
            total: filteredData.length,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
          }}
        />
      </Card>
    </div>
  );
};

export default Dealer;
