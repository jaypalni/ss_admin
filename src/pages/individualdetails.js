import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { message, Table, Select, Row, Col, Button, Breadcrumb } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import "../assets/styles/allcarsdashboard.css";
import "../assets/styles/individualdetails.css";
import avatarFallback from "../assets/images/icon_img.svg";
import { useIndividualDetails } from "../hooks/useIndividualDetails";
import { useIndividualActions } from "../hooks/useIndividualActions";
import { IndividualProfileHeader } from "../components/IndividualProfileHeader";
import { IndividualSummaryCards } from "../components/IndividualSummaryCards";

const { Option } = Select;

const Individualdetails = () => {
  const navigate = useNavigate();
  const { individualId } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = token && user;

  const [listingFilter, setListingFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest"); 
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [avatarSrc, setAvatarSrc] = useState(avatarFallback);

  const {
    dealerData,
    tableData,
    loading,
    totalListings,
    totalActive,
    totalSold,
    totalRejected,
  } = useIndividualDetails(individualId, listingFilter, sortOrder, page, limit);

  const {
    loadingFlagged,
    loadingBanned,
    reportedUser,
    bannedDealer
  } = useIndividualActions(dealerData, navigate);


  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const columns = [
    {
      title: () => <span style={{ color: "#6B7280", fontSize: 12, fontWeight: 500 }}>Listing ID</span>,
      dataIndex: "listingId",
      key: "listingId",
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
        let bgColor = "#FEF9C3";
        let textColor = "#854D0E";
        if (String(status).toLowerCase().includes("approved")) {
          bgColor = "#DCFCE7";
          textColor = "#166534";
        } else if (String(status).toLowerCase().includes("rejected")) {
          bgColor = "#FEE2E2";
          textColor = "#991B1B";
        } else if (String(status).toLowerCase().includes("sold")) {
          bgColor = "#DBEAFE";
          textColor = "#1E40AF";
        }else if (String(status).toLowerCase().includes("pending")) {
          bgColor = "#FEF9C3";
          textColor = "#854D0E";
        }
        return (
          <span style={{ backgroundColor: bgColor, color: textColor, padding: "2px 8px", borderRadius: 8, fontSize: 12 }}>
            {status}
          </span>
        );
      },
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: 12, fontWeight: 500 }}>Date Created</span>,
      dataIndex: "date",
      key: "date",
      render: (text) => <span style={{ color: "#111827" }}>{text}</span>,
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: 12, fontWeight: 500 }}>Price (IQD)</span>,
      dataIndex: "price",
      key: "price",
      render: (text) => <span style={{ color: "#111827" }}>{text}</span>,
    },
  ];

  if (!dealerData) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div className="content-wrapper-allcardashboard">
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8,marginTop:10 }}>
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
            { title: <span style={{ color: "#000000", fontSize: 14, fontWeight: 400 }}>{dealerData.full_name || dealerData.company_name || `User ${dealerData.user_id}`}</span> },
          ]}
        />
      </div>

      <IndividualProfileHeader
        dealerData={dealerData}
        avatarSrc={avatarSrc}
        setAvatarSrc={setAvatarSrc}
        onReportUser={reportedUser}
        onBanUser={bannedDealer}
        loadingFlagged={loadingFlagged}
        loadingBanned={loadingBanned}
      />

      <IndividualSummaryCards
        dealerData={dealerData}
        totalListings={totalListings}
        totalActive={totalActive}
        totalSold={totalSold}
        totalRejected={totalRejected}
      />

      <Table
        dataSource={tableData}
        columns={columns}
        rowKey="listingId"
        bordered={false}
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: totalListings,
          onChange: (p, pSize) => {
            setPage(p);
            if (pSize && pSize !== limit) setLimit(pSize);
          },
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
        }}
        title={() => (
          <Row justify="space-between" align="middle" style={{ background: "#fff" }}>
            <Col><h3 style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>User Listings</h3></Col>
            <Col style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {["All", "Active", "Pending", "Sold", "Rejected"].map((status) => (
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
                  onClick={() => {
                    setListingFilter(status);
                    setPage(1);
                  }}
                >
                  {status}
                </Button>
              ))}

              <Select
                value={sortOrder}
                onChange={(val) => {
                  setSortOrder(val);
                  setPage(1);
                }}
                style={{ width: 160, borderRadius: 6, backgroundColor: "#D1D5DB", color: "#fff" }}
              >
                <Option value="Newest">Newest</Option>
                <Option value="Oldest">Oldest</Option>
              </Select>
            </Col>
          </Row>
        )}
      />
    </div>
  );
};

export default Individualdetails;