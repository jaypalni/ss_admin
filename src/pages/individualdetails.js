import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { message, Table, Select, Row, Col, Button, Avatar, Tag, Breadcrumb } from "antd";
import { ArrowLeftOutlined, EyeOutlined } from "@ant-design/icons";
import { FlagOutlined, StopOutlined } from "@ant-design/icons";

import activeIcon from "../assets/images/total.svg";
import pendingIcon from "../assets/images/active-icon.png";
import soldIcon from "../assets/images/sold-icon.png";
import modelIcon from "../assets/images/reject.svg";

import "../assets/styles/allcarsdashboard.css";
import "../assets/styles/individualdetails.css";
import avatarFallback from "../assets/images/icon_img.svg";
import { loginApi } from "../services/api";
import premimum_d from "../assets/images/premimum_d.svg";
import {handleApiResponse,handleApiError} from "../utils/apiUtils"

const { Option } = Select;

const Individualdetails = () => {
  const navigate = useNavigate();
  const { individualId } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = token && user;

  const [dealerData, setDealerData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFlagged, setLoadingFlagged] = useState(false);
  const [loadingBanned, setLoadingBanned] = useState(false);

  const [listingFilter, setListingFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest"); 
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalListings, setTotalListings] = useState(0);

  const [totalActive, setTotalActive] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);

  const [messageApi, contextHolder] = message.useMessage();
  const [avatarSrc, setAvatarSrc] = useState(avatarFallback);


  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const apiFilterValue = (uiFilter) => {
    if (!uiFilter || uiFilter.toLowerCase() === "all") return "all";
    return uiFilter.toLowerCase();
  };
  const apiSortValue = (uiSort) => {
    return uiSort && uiSort.toLowerCase() === "oldest" ? "oldest" : "newest";
  };

  const fetchDealerDetails = async () => {
    if (!individualId) return;
    try {
      setLoading(true);
      const body = {
        filter: apiFilterValue(listingFilter),
        sort: apiSortValue(sortOrder),
        page: page,
        limit: limit,
      };

      const res = await loginApi.getallusersid(individualId, body);
      const payload = handleApiResponse(res.data);

      if (!payload) {
        messageApi.error(res?.data?.message || "Failed to fetch user details");
        setDealerData(null);
        setTableData([]);
        setTotalListings(0);
        return;
      }

      setDealerData(payload);
      setAvatarSrc(payload.profile_pic || avatarFallback);

      const listingsRaw = Array.isArray(payload.listings) ? payload.listings : [];
      const normalized = listingsRaw.map((item, idx) => ({
        listingId: item.car_id ?? item.id ?? `generated-${idx}`,
        title: item.ad_title ?? item.title ?? "-",
        location: item.location ?? "-",
        status:
          (item.approval && String(item.approval).charAt(0).toUpperCase() + String(item.approval).slice(1)) ||
          "-",
        date: item.created_at ? item.created_at.split(" ").slice(1, 4).join(" ") : "-",
        price: item.price ? Number(item.price).toLocaleString() : "-",
        _raw: item,
      }));
      setTableData(normalized);

      const pagination = payload.listings_pagination;
      if (pagination) {
        setTotalListings(pagination.total ?? normalized.length);
        setPage(pagination.page ?? page);
        setLimit(pagination.limit ?? limit);
      } else {
        setTotalListings(normalized.length);
      }

      setTotalActive(payload.active_cars ?? 0);
      setTotalSold(payload.sold_cars ?? 0);
      setTotalRejected(payload.rejected_cars ?? 0);
    } catch (err) {
      console.error("fetchDealerDetails error:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "Something went wrong while fetching user details";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealerDetails();
  }, [individualId, listingFilter, sortOrder, page, limit]);

  const reportedUser = async () => {
    if (!dealerData) return;
    try {
      setLoadingFlagged(true);
      const body = {
        report_id: dealerData.user_id,
      };
      const res = await loginApi.reporteduser(body);
      const data = res?.data;
      if (data?.status_code === 200) {
        messageApi.success(data?.message || "User reported successfully");
        navigate("/user-management/individual")
      } else {
        messageApi.error(data?.message || data?.error || "Failed to report user");
      }
    } catch (err) {
      console.error("reportedUser error:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "Something went wrong while reporting user";
      messageApi.error(errorMessage);
    } finally {
      setLoadingFlagged(false);
    }
  };

  const bannedDealer = async () => {
    if (!dealerData) return;
    try {
      setLoadingBanned(true);
      const body = {
        user_id: dealerData.user_id,
      };
      const res = await loginApi.banneduser(body);
      const data = res?.data;
      if (data?.status_code === 200) {
        messageApi.success(data?.message || "User banned successfully");
        navigate("/user-management/individual")
      } else {
        messageApi.error(data?.message || data?.error || "Failed to ban user");
      }
    } catch (err) {
      console.error("bannedDealer error:", err);
      const errorMessage =
        err?.response?.data?.message || err?.response?.data?.error || err?.message || "Something went wrong while banning user";
      messageApi.error(errorMessage);
    } finally {
      setLoadingBanned(false);
    }
  };

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

  const getCardColors = (title) => {
    switch (title) {
      case "Total Listings":
        return { bgColor: "#EFF6FF", titleColor: "#6B7280", titleNumber: "#111827" };
      case "Active Listings":
        return { bgColor: "#F0FDF4", titleColor: "#6B7280", titleNumber: "#16A34A" };
      case "Sold Listings":
        return { bgColor: "#FAF5FF", titleColor: "#6B7280", titleNumber: "#2563EB" };
      case "Rejected Listings":
        return { bgColor: "#FEF2F2", titleColor: "#6B7280", titleNumber: "#DC2626" };
      default:
        return { bgColor: "#F3F4F6", titleColor: "#6B7280", titleNumber: "#111827" };
    }
  };

  const cards = [
    {
      title: "Total Listings",
      number: dealerData?.total_cars ?? totalListings ?? tableData.length,
      icon: activeIcon,
      ...getCardColors("Total Listings"),
    },
    {
      title: "Active Listings",
      number: dealerData?.active_cars ?? totalActive ?? 0,
      icon: pendingIcon,
      ...getCardColors("Active Listings"),
    },
    {
      title: "Sold Listings",
      number: dealerData?.sold_cars ?? totalSold ?? 0,
      icon: soldIcon,
      ...getCardColors("Sold Listings"),
    },
    {
      title: "Rejected Listings",
      number: dealerData?.rejected_cars ?? totalRejected ?? 0,
      icon: modelIcon,
      ...getCardColors("Rejected Listings"),
    },
  ];

  const containerStyle = {
    background: "#ffffff",
    borderRadius: 8,
    padding: "22px 24px",
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
    display: "flex",
    alignItems: "center",
    gap: 24,
    maxWidth: 1200,
    margin: "0 auto 24px",
  };

  const leftStyle = { display: "flex", alignItems: "center", gap: 16, flex: "0 0 auto" };
  const nameStyle = { margin: 0, fontSize: 20, fontWeight: 700, color: "#0F172A", lineHeight: 1 };
  const metaKeyStyle = { color: "#6B7280", fontSize: 13, marginRight: 8 };
  const metaValueStyle = { color: "#111827", fontSize: 13, fontWeight: 500 };
  const pillStyle = { borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 };
  const rightActionsStyle = { marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" };
  

  if (!dealerData) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div className="content-wrapper-allcardashboard">
      {contextHolder}

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

      <div style={containerStyle}>
        <div style={leftStyle}>
        

<Avatar
  size={64}
  src={avatarSrc}
  style={{ borderRadius: 12 }}
  onError={() => {
    setAvatarSrc(avatarFallback); // fallback image
    return true; // tell AntD the error is handled
  }}
/>

        </div>

        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div style={{ minWidth: 0 }}>
              <h2 style={nameStyle}>{dealerData.full_name || "N/A"}</h2>

              <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 8 }}>
                <div style={{width:140}}>
                  <div style={metaKeyStyle}>Email:</div>
                  <div style={metaValueStyle}>{dealerData.email || "-"}</div>
                </div>

                <div>
                  <div style={metaKeyStyle}>
                    <span style={{ color: "#64748B" }}>Phone:</span>{" "}
                    <span style={{ color: "#0F172A", fontWeight: 600 }}>{dealerData.phone_number || "-"}</span>
                  </div>
                </div>

                <div style={{marginLeft:18}}>
                  <div style={metaKeyStyle}>
                    <span style={{ color: "#64748B" }}>User ID:</span>{" "}
                    <span style={{ color: "#0F172A", fontWeight: 600 }}>#{dealerData.user_id ?? "-"}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 24, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ color: "#6B7280", fontSize: 13 }}>Registered:</div>
                  <div style={{ ...metaValueStyle, fontWeight: 600 }}>
                    {dealerData.registered_at ? dealerData.registered_at.split(" ").slice(1, 4).join(" ") : (dealerData.created_at ? dealerData.created_at.split(" ").slice(1,4).join(" ") : "-")}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ color: "#6B7280", fontSize: 13 }}>Subscription:</div>
                  <div style={{ ...metaValueStyle, fontWeight: 600 }}>{dealerData.subscription_details?.plan_name ?? dealerData.subscription_plan_name ?? "-"}</div>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ color: "#6B7280", fontSize: 13 }}>Expires:</div>
                  <div style={{ ...metaValueStyle, fontWeight: 600 }}>
                    {dealerData.subscription_details?.end_date ? dealerData.subscription_details.end_date.split(" ").slice(1, 4).join(" ") : (dealerData.subscription_expires_at ? dealerData.subscription_expires_at.split(" ").slice(1,4).join(" ") : "-")}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                <Tag
  style={{
    ...pillStyle,
    background:
      dealerData.status === "banned"
        ? "#FECACA" // light red for banned
        : dealerData.status === "active"
        ? "#DCFCE7" // light green for active
        : "#FEF9C3", // light yellow for others
    color:
      dealerData.status === "banned"
        ? "#B91C1C" // red text for banned
        : dealerData.status === "active"
        ? "#166534" // green text for active
        : "#854D0E", // yellow/brown for others
    paddingLeft: 10,
  }}
>
  <span
    style={{
      width: 8,
      height: 8,
      height: 8,
      borderRadius: 999,
      background:
        dealerData.status === "banned"
          ? "#B91C1C"
          : dealerData.status === "active"
          ? "#166534"
          : "#854D0E",
      display: "inline-block",
      marginRight: 4,
    }}
  />
  {dealerData.status === "banned" ? "Banned" : dealerData.status === "active" ? "Active" : dealerData.status ?? "Pending"}
</Tag>
               
                 {dealerData.subscription_details?.plan_name && (
 <Tag style={{ ...pillStyle, background: "#DBEAFE", color: "#1E40AF" }}>
  <img
    src={premimum_d}
    alt="plan icon"
    style={{
      width: 14,
      height: 14,
      display: "inline-block",
      objectFit: "contain",
    }}
  />
  {dealerData.subscription_details?.plan_name ?? ""}
</Tag>
)}

              
              </div>
            </div>
          </div>
        </div>
{dealerData.status !== "banned" && (
        <div style={rightActionsStyle}>
          <Button
            onClick={reportedUser}
            loading={loadingFlagged}
            style={{
              background: "#FEF9C3",
              borderColor: "#FEF9C3",
              color: "#854D0E",
              fontWeight: 400,
              width: 100,
              height: 60,
              borderRadius: 8,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <FlagOutlined style={{ fontSize: 18 }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontSize: 12 }}>Flag</span>
              <span style={{ fontSize: 12 }}>User</span>
            </div>
          </Button>

          <Button
            onClick={bannedDealer}
            loading={loadingBanned}
            style={{
              background: "#FEE2E2",
              borderColor: "#FEE2E2",
              color: "#991B1B",
              fontWeight: 400,
              width: 100,
              height: 60,
              borderRadius: 8,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <StopOutlined style={{ fontSize: 14 }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontSize: 12 }}>Ban</span>
              <span style={{ fontSize: 12 }}>User</span>
            </div>
          </Button>
        </div>
               )}
      </div>
   
      <div className="content-body">
        <div className="row">
          {cards.map((card, idx) => (
            <div key={idx} className="col-md-6 col-lg-3 mb-4">
              <div className="card dashboard-card">
                <div className="card-body dashboard-card-body">
                  <div className="card-text-container">
                    <h5 className="card-individual-title" style={{ color: card.titleColor }}>{card.title}</h5>
                    <p className="card-individual-number" style={{ color: card.titleNumber, fontWeight: 700 }}>{card.number}</p>
                  </div>
                  <div className="card-icon-individual-wrapper" >
                    <img src={card.icon} alt={card.title} className="card-individual-icon" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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