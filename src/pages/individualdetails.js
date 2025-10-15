import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { message, Table, Select, Row, Col, Button, Breadcrumb } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import activeIcon from "../assets/images/total.svg";
import pendingIcon from "../assets/images/active-icon.png";
import soldIcon from "../assets/images/sold-icon.png";
import modelIcon from "../assets/images/reject.svg";

import "../assets/styles/allcarsdashboard.css";
import "../assets/styles/individualdetails.css";

const { Option } = Select;

const Individualdetails = () => {
  const navigate = useNavigate();
  const { individualId } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = token && user;

  const [profileData, setProfileData] = useState(null);
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listingFilter, setListingFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const dataSource = [
    { id: "#LST2024001", title: "2018 Toyota Camry LE", location: "Baghdad", status: "Active", data: "Dec 15, 2024", price: "25,000,000" },
    { id: "#LST2024002", title: "2020 Honda Civic Sport", location: "Erbil", status: "Sold", data: "Dec 10, 2024", price: "32,500,000" },
    { id: "#LST2024003", title: "2019 Nissan Altima SL", location: "Erbil", status: "Active", data: "Dec 8, 2024", price: "28,000,000" },
    { id: "#LST2024004", title: "2017 BMW 320i", location: "Erbil", status: "Rejected", data: "Dec 5, 2024", price: "45,000,000" },
    { id: "#LST2024005", title: "2021 Hyundai Elantra SEL", location: "Erbil", status: "Pending", data: "Dec 3, 2024", price: "30,000,000" },
  ];

  const columns = [
    {
      title: () => <span style={{ color: "#6B7280", fontSize: 12, fontWeight: 500 }}>Listing ID</span>,
      dataIndex: "id",
      key: "id",
      render: (text) => <span style={{ color: "#1890ff", cursor: "pointer" }}>{text}</span>,
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: 12, fontWeight: 500 }}>Title</span>,
      dataIndex: "title",
      key: "title",
      render: (text) => <span style={{ color: "#111827" }}>{text}</span>,
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: 12, fontWeight: 500 }}>Location</span>,
      dataIndex: "location",
      key: "location",
      render: (text) => <span style={{ color: "#111827" }}>{text}</span>,
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: 10, fontWeight: 600 }}>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let bgColor = "#FEF9C3", textColor = "#DBEAFE";
        if (status === "Active") { bgColor = "#DCFCE7"; textColor = "#166534"; }
        else if (status === "Rejected") { bgColor = "#FEE2E2"; textColor = "#991B1B"; }
        else if (status === "Sold") { bgColor = "#DBEAFE"; textColor = "#1E40AF"; }
        return (
          <span style={{ backgroundColor: bgColor, color: textColor, padding: "2px 8px", borderRadius: 8, fontSize: 12 }}>
            {status}
          </span>
        );
      },
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: 12, fontWeight: 500 }}>Date Created</span>,
      dataIndex: "data",
      key: "data",
      render: (text) => <span style={{ color: "#111827" }}>{text}</span>,
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: 12, fontWeight: 500 }}>Price (IQD)</span>,
      dataIndex: "price",
      key: "price",
      render: (text) => <span style={{ color: "#111827" }}>{text}</span>,
    },
  ];

  return (
    <div className="content-wrapper-allcardashboard">
      {contextHolder}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/user-management/individual")}
          style={{ marginBottom: 16, backgroundColor: "#F3F4F6", borderColor: "#E5E7EB", color: "#374151", borderRadius: 12, fontWeight: 400 }}
        >
          Back to Users
        </Button>

        <Breadcrumb
          separator="/"
          style={{ marginBottom: 16 }}
          items={[
            { title: <span style={{ color: "#6B7280", cursor: "pointer", fontSize: 14, fontWeight: 400 }}>User Management</span> },
            { title: <span style={{ color: "#6B7280", fontSize: 14, fontWeight: 400, cursor: "pointer" }} onClick={() => navigate("/user-management/individual")}>Individual Users</span> },
            { title: <span style={{ color: "#000000", fontSize: 14, fontWeight: 400 }}>Ahmed Mohammed</span> },
          ]}
        />
      </div>

      <div className="content-body">
        <div className="row">
          {[
            { title: "Total Listings", number: 24, color: "#111827", icon: activeIcon, bgColor: "#DBEAFE" },
            { title: "Active Listings", number: 8, color: "#16A34A", icon: pendingIcon, bgColor: "#DCFCE7" },
            { title: "Sold Listings", number: 14, color: "#2563EB", icon: soldIcon, bgColor: "#DBEAFE" },
            { title: "Rejected Listings", number: 2, color: "#DC2626", icon: modelIcon, bgColor: "#FEE2E2" },
          ].map((card, idx) => (
            <div key={idx} className="col-md-6 col-lg-3 mb-4">
              <div className="card dashboard-card">
                <div className="card-body dashboard-card-body">
                  <div className="card-text-container">
                    <h5 className="card-individual-title">{card.title}</h5>
                    <p className="card-individual-number" style={{ color: card.color, fontWeight: 700 }}>{card.number}</p>
                  </div>
                  <div className="card-icon-individual-wrapper" style={{ backgroundColor: card.bgColor }}>
                    <img src={card.icon} alt={card.title} className="card-individual-icon" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        bordered={false}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
        }}
        title={() => (
          <Row justify="space-between" align="middle" style={{ background: "#fff" }}>
            <Col><h3 style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>User Listings</h3></Col>
            <Col style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {["All", "Active", "Pending", "Sold"].map((status) => (
                <Button
                  key={status}
                  size="small"
                  style={{
                    minWidth: 50,
                    fontSize: 10,
                    fontWeight: 500,
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: listingFilter === status ? "#008AD5" : "#E5E7EB",
                    color: listingFilter === status ? "#FFFFFF" : "#374151",
                  }}
                  onClick={() => setListingFilter(status)}
                >
                  {status}
                </Button>
              ))}
              <Select
                value={sortOrder}
                onChange={setSortOrder}
                style={{ width: 120, borderRadius: 6, backgroundColor: "#D1D5DB", color: "#fff" }}
              >
                <Option value="Sort by Newest">Newest</Option>
                <Option value="Oldest">Oldest</Option>
                <Option value="PriceHigh">Price: High → Low</Option>
                <Option value="PriceLow">Price: Low → High</Option>
              </Select>
            </Col>
          </Row>
        )}
      />
    </div>
  );
};

export default Individualdetails;
