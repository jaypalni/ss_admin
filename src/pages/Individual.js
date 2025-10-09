import React, { useState, useMemo, useEffect } from "react";
import { Input, Select, Table, Card, Row, Col, Button } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EditOutlined from "../assets/images/flag.svg";
import DeleteOutlined from "../assets/images/banned.svg";
import "../assets/styles/individual.css";

const { Option } = Select;

const Individual = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = token && user;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const dataSource = [
    { id: "#USR001", fullname: "Ahmed Al-Rashid", emailaddress: "ahmed.rashid@email.com", phone: "+964 770 123 4567", registered: "Jan 15, 2024", listings: 12, status: "Active" },
    { id: "#USR002", fullname: "Fatima Hassan", emailaddress: "fatima.hassan@email.com", phone: "+964 750 987 6543", registered: "Feb 03, 2024", listings: 5, status: "Flagged" },
    { id: "#USR003", fullname: "Omar Khalil", emailaddress: "omar.khalil@email.com", phone: "+964 790 456 1234", registered: "Mar 12, 2024", listings: 18, status: "Active" },
    { id: "#USR004", fullname: "Zahra Mahmoud", emailaddress: "zahra.mahmoud@email.com", phone: "+964 780 321 9876", registered: "Apr 08, 2024", listings: 2, status: "Banned" },
  ];

  const filteredData = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return dataSource.filter((item) => {
      const searchMatch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.fullname.toLowerCase().includes(q) ||
        item.emailaddress.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q);

      const statusMatch = statusFilter === "All Status" || item.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [searchValue, statusFilter, dataSource]);

  const handleExport = () => {
    if (!filteredData || filteredData.length === 0) return;

    const headers = ["User ID", "Full Name", "Email Address", "Phone Number", "Registered", "Listings", "Status"];
    const rows = filteredData.map((r) => [
      r.id,
      r.fullname,
      r.emailaddress,
      r.phone,
      r.registered,
      r.listings,
      r.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <span style={{ color: "#1890ff", cursor: "pointer" }}>{text}</span>,
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email Address",
      dataIndex: "emailaddress",
      key: "emailaddress",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Registered",
      dataIndex: "registered",
      key: "registered",
    },
    {
      title: "Listings",
      dataIndex: "listings",
      key: "listings",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let bgColor = "#FEF9C3";
        let textColor = "#854D0E";

        if (status === "Active") {
          bgColor = "#DCFCE7";
          textColor = "#166534";
        } else if (status === "Banned") {
          bgColor = "#FFE4E6";
          textColor = "#B91C1C";
        }

        return (
          <span
            style={{
              backgroundColor: bgColor,
              color: textColor,
              padding: "2px 8px",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <EyeOutlined
            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
            onClick={() => navigate(`/user-management/individual/:individualId`)}
          />
          <img
            src={EditOutlined}
            onClick={() => console.log(`Edit ${record.id}`)}
            alt="edit"
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <img
            src={DeleteOutlined}
            onClick={() => console.log(`Delete ${record.id}`)}
            alt="delete"
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, background: "#f0f2f5" }}>
      <Card
        style={{
          marginBottom: 16,
          backgroundColor: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col style={{ display: "flex", gap: 12 }}>
            <Input
              placeholder="Search by name, email, phone or ID..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 400 }}
            />
            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 160 }}>
              <Option value="All Status">All Status</Option>
              <Option value="Active">Active</Option>
              <Option value="Flagged">Flagged</Option>
              <Option value="Banned">Banned</Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={""} icon={<DownloadOutlined />} style={{ backgroundColor: "#008AD5" }}>
              Export
            </Button>
          </Col>
        </Row>
      </Card>

      <Card style={{ margin: "0 auto", maxWidth: 1200, backgroundColor: "#fff" }}>
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          bordered={false}
          pagination={{
            pageSize: 2,
            showSizeChanger: false,
            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
          }}
        />
      </Card>
    </div>
  );
};

export default Individual;
