import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Breadcrumb,
  Tag,
  Empty,
  message,
  Table,
  Select,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  CheckOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import Right from "../assets/images/Right.svg";
import Dealer from "../assets/images/img.svg";
import National from "../assets/images/national.svg";
import pdf from "../assets/images/pdf.svg";
import warning from "../assets/images/warning.svg";
import activeIcon from "../assets/images/total_icon_1.svg";
import pendingIcon from "../assets/images/sold-icon.svg";
import soldIcon from "../assets/images/pending_icon.svg";
import modelIcon from "../assets/images/reject_icon_1.svg";
import "../assets/styles/allcarsdashboard.css";
import { loginApi } from "../services/api";
import editIcon from "../assets/images/edit.svg";
import reject from "../assets/images/delete_icon.svg";
import info_d from "../assets/images/info_d.svg";
import ban_d from "../assets/images/ban_d.svg";
import reject_d from "../assets/images/reject_d.svg";
import flag_d from "../assets/images/flag_d.svg";
import {handleApiResponse,handleApiError} from "../utils/apiUtils"
import PropTypes from "prop-types";
const { Option } = Select;

const BoostStatus = ({ status }) => {
  let tagColor = "#F3F4F6";
  let textColor = "#374151";
  let text = "Pending Verification";

  switch ((status || "").toLowerCase()) {
    case "pending":
      tagColor = "#FEF9C3";
      textColor = "#854D0E";
      text = "Pending Verification";
      break;

    case "verified":
      tagColor = "#DCFCE7";
      textColor = "#166534";
      text = "Verified";
      break;

    case "rejected":
      tagColor = "#FEE2E2";
      textColor = "#991B1B";
      text = "Rejected";
      break;

    case "banned":
      tagColor = "#FEEBCB";
      textColor = "#B45309";
      text = "Banned";
      break;

    case "flagged":
      tagColor = "#FEF9C3";
      textColor = "#854D0E";
      text = "Flagged";
      break;

    default:
      text = "Pending Verification";
      break;
  }

  return (
    <Tag
      style={{
        background: tagColor,
        color: textColor,
        borderRadius: 8,
        padding: "4px 12px",
        fontWeight: 500,
      }}
    >
      {text}
    </Tag>
  );
};


const DocumentCard = ({ doc, onDownload, onCancel }) => {
  const isApproved = doc.status === "Validated";

  return (
    <Card size="large" style={{ borderRadius: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {doc.title}
        </div>
        <div style={{ marginLeft: 12 }}>
          <Tag
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: isApproved ? "#DCFCE7" : "#FEE2E2",
              color: isApproved ? "#166534" : "#991B1B",
              borderRadius: 8,
              padding: "2px 5px",
              fontWeight: 500,
              fontSize: "10px",
            }}
          >
            {isApproved ? <CheckOutlined style={{ color: "#16A34A" }} /> : <img src={warning} alt="Not Approved" style={{ width: 12, height: 12 }} />}
            {doc.status}
          </Tag>
        </div>
      </div>

      <img
        src={pdf}
        alt={doc.title}
        style={{
          width: "40px",
          height: 40,
          objectFit: "cover",
          borderRadius: 8,
          marginBottom: 6,
        }}
      />

      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>
        {doc.submittedOn ? doc.submittedOn.split("/").slice(3).join("/") : ""}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => onCancel && onCancel(doc)}
          style={{ borderRadius: 8, flex: 1, background: "#008AD5", fontWeight: 400, fontSize: "12px" }}
        >
          View
        </Button>

        <Button
          icon={<DownloadOutlined />}
          onClick={() => onDownload && onDownload(doc)}
          style={{
            borderRadius: 8,
            flex: 1,
            border: "1px solid #D1D5DB",
            color: "#374151",
            fontWeight: 400,
            fontSize: "12px",
          }}
        >
          Download
        </Button>
      </div>
    </Card>
  );
};

const SubmittedDocumentsCard = ({ documents }) => {
  if (!documents || documents.length === 0) return null;
  const BASE_URL = process.env.REACT_APP_API_URL


const handleDownload = (doc) => {
  if (doc.submittedOn) {
    let url = doc.submittedOn;

    if (!/^https?:\/\//i.test(url)) {
      url = `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success(`Download started for ${doc.title ?? "document"}`);
  } else {
    message.warning("No document available to download");
  }
};

 const handleView = (doc) => {
  if (doc.submittedOn) {
    let url = doc.submittedOn;
    if (!/^https?:\/\//i.test(url)) {
      url = `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
    }

    window.open(url, "_blank");
  } else {
    message.warning("No document available to view");
  }
};

  return (
    <Card
      title="Submitted Documents"
      style={{ borderRadius: 12, marginTop: 16, color: "#111827", fontWeight: 600, width: "100%" }}
    >
      <Row gutter={[24, 16]}>
        {documents.map((d) => (
          <Col xs={24} sm={12} key={d.id}>
            <DocumentCard doc={d} onDownload={handleDownload} onCancel={handleView} />
          </Col>
        ))}
      </Row>
    </Card>
  );
};

const getPackageIcon = (packageName, isSummary) => {
  if (isSummary) return modelIcon;

  const nameLower = (packageName || "").toLowerCase();
  if (nameLower.includes("basic")) return activeIcon;
  if (nameLower.includes("premium")) return pendingIcon;
  if (nameLower.includes("enterprise")) return soldIcon;
  return modelIcon;
};

const getIconBackgroundColor = (icon) => {
  if (icon === activeIcon) return "#DBEAFE";
  if (icon === pendingIcon) return "#DCFCE7";
  if (icon === soldIcon) return "#F3E8FF";
  return "#FFEDD5";
};

const formatPercentage = (percentage) => {
  const pct = Number(percentage) || 0;
  const isPositive = pct >= 0;
  return {
    label: `${isPositive ? "+" : ""}${Number(pct).toFixed(2)}%`,
    color: isPositive ? "#10B981" : "#DC2626",
    backgroundColor: isPositive ? "#DCFCE7" : "#FEE2E2",
    isPositive,
  };
};

const getCardDisplayValue = (item) => {
  if (item.isSummary) return item.total;
  if (item.total !== undefined && item.total !== null) return item.total;
  return item.listings;
};

const PackageCard = ({ item }) => {
  const icon = getPackageIcon(item.name, item.isSummary);
  const iconBgColor = getIconBackgroundColor(icon);
  const percentageData = formatPercentage(item.percentage);
  const displayValue = getCardDisplayValue(item);

  return (
    <div
      key={item.key || item.id}
      className="dashboard-summary-mini"
      style={{
        minWidth: 220,
        padding: 12,
        borderRadius: 8,
        background: "#F8FAFC",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flex: "0 0 auto",
      }}
    >
      <div
        style={{
          backgroundColor: iconBgColor,
          borderRadius: 8,
          padding: 8,
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={icon} alt={item.name} style={{ width: 20, height: 20 }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            color: "#6B7280",
            marginBottom: 4,
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
          title={item.name}
        >
          {item.name}
        </div>

        <div style={{ fontWeight: 700, fontSize: 18 }}>{displayValue}</div>
      </div>

      <div
        style={{
          fontSize: 12,
          color: percentageData.color,
          backgroundColor: percentageData.backgroundColor,
          borderRadius: 12,
          padding: "2px 6px",
          alignSelf: "center",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        {percentageData.label}
      </div>
    </div>
  );
};

const columns_boost = [
  {
    title:<span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Listing ID</span>,
    dataIndex: "listingId",
    key: "listingId",
    width: 150,
    render: (val) => (
      <div style={{ fontWeight: 400, color: "#000000", fontSize: 14 }}>{val}</div>
    ),
  },
  {
    title: <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Title</span>,
    dataIndex: "title",
    key: "title",
    width: 200,
    render: (val) => (
      <div style={{ fontWeight: 400, color: "#000000", fontSize: 14 }}>{val}</div>
    ),
  },
  {
    title: <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Location</span>,
    dataIndex: "location",
    key: "location",
    width: 120,
    render: (val) => (
      <div style={{ fontWeight: 400, color: "#000000", fontSize: 14 }}>{val}</div>
    ),
  },
  {
    title: <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Status</span>,
    dataIndex: "status",
    key: "status",
    width: 150,
    render: (val) => (
      <div style={{ fontWeight: 400, color: "#000000", fontSize: 14 }}>{val}</div>
    ),
  },
  {
    title: <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Date Created</span>,
    dataIndex: "date",
    key: "date",
    width: 150,
    render: (val) => (
      <div style={{ fontWeight: 400, color: "#000000", fontSize: 14 }}>{val}</div>
    ),
  },
  {
    title:<span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Price (IQD)</span>,
    dataIndex: "price",
    key: "price",
    width: 150,
    render: (val) => (
      <div style={{ fontWeight: 400, color: "#000000", fontSize: 14 }}>{val}</div>
    ),
  },
];

BoostStatus.propTypes = {
  status: PropTypes.string,
};

DocumentCard.propTypes = {
  doc: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    status: PropTypes.string,
    submittedOn: PropTypes.string,
  }).isRequired,
  onDownload: PropTypes.func,
  onCancel: PropTypes.func,
};

SubmittedDocumentsCard.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      status: PropTypes.string,
      submittedOn: PropTypes.string,
    })
  ),
};

PackageCard.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    isSummary: PropTypes.bool,
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    listings: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
};

const DealerDetails = () => {
  const navigate = useNavigate();
  const { dealerId } = useParams();
  const [dealerData, setDealerData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingFlagged, setLoadingFlagged] = useState(false);
  const [loadingBanned, setLoadingBanned] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [listingFilter, setListingFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalListings, setTotalListings] = useState(0);

  const [totalActive, setTotalActive] = useState(0);
  const [, setTotalPercentage] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [, setTotalPending] = useState(0);

  const fetchDealerDetails = async () => {
    try {
      setLoading(true);

      const body = {
        filter: listingFilter.toLowerCase(),
          sort: sortOrder,
        page: page,
        limit: limit,
      };

      const res = await loginApi.getallusersid(dealerId, body);
      console.log("12345",res)
      const payload = handleApiResponse(res.data);

      if (!payload) {
        messageApi.error(res?.data?.message || "Failed to fetch dealer details");
        setDealerData(null);
        setTableData([]);
        setTotalListings(0);
        return;
      }

      setDealerData(payload);

      const listingsRaw = Array.isArray(payload.listings) ? payload.listings : [];
      const normalized = listingsRaw.map((item, idx) => ({
        listingId: item.car_id ?? item.id ?? `generated-${idx}`,
        title: item.ad_title ?? item.title ?? "-",
        location: item.location ?? "-",
        status: item.status ?? item.approval ?? "-",
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
      setTotalPending(payload.pending_cars ?? 0);
      setTotalPercentage(0);
    } catch (err) {
      console.error("fetchDealerDetails error:", err);
      messageApi.error(err?.message || "Something went wrong while fetching dealer details");
    } finally {
      setLoading(false);
    }
  };

   const approveDealer = async (status) => {
    try {
      if (status === "verified") setLoadingApprove(true);
      if (status === "rejected") setLoadingReject(true);
      const body = {
      user_id: dealerData.user_id,       
      verification_status: status,
    };
      const res = await loginApi.verificationstatus(body);
       const data = res?.data;
     if (data?.status_code === 200) {
     messageApi.error(res?.data?.message || "Failed to fetch dealer details");
     setTimeout(() => {
          navigate("/user-management/dealer"); 
        }, 1000);
    } else {
      messageApi.error(data.message || data?.error || "Failed to approve dealer");
    }
    } catch (err) {
      const errorMessage =
    err?.response?.data?.message ||
    err?.message ||                  
    err?.response?.data?.error ||          
    "Something went wrong while fetching dealer details";

  messageApi.error(errorMessage);
    }finally {
    if (status === "verified") setLoadingApprove(false);
    if (status === "rejected") setLoadingReject(false);
  }
  };

  const reporteduser = async (status) => {
    try {
     setLoadingFlagged(true);
      const body = {
      report_id: dealerData.user_id,       
    };
      const res = await loginApi.reporteduser(body);
       const data = res?.data;
     if (data?.status_code === 200) {
     messageApi.error(res?.data?.message || "Failed to fetch dealer details");
     setTimeout(() => {
          navigate("/user-management/dealer"); 
        }, 1000);
    } else {
      messageApi.error(data.message || data?.error || "Failed to approve dealer");
    }
    } catch (err) {
      const errorMessage =
    err?.response?.data?.message ||
    err?.message ||                  
    err?.response?.data?.error ||          
    "Something went wrong while fetching dealer details";

  messageApi.error(errorMessage);
    }finally {
     setLoadingFlagged(false);
  }
  };

 const bannedDealer = async () => {
  try {
    setLoadingBanned(true);

    const body = {
      user_id: dealerData.user_id,
    };

    const res = await loginApi.banneduser(body);
    const data = res?.data;

    if (data?.status_code === 200) {
      messageApi.success(data?.message || "Dealer banned successfully");
      setTimeout(() => {
        navigate("/user-management/dealer");
      }, 1000);
    } else {
      messageApi.error(data?.message || data?.error || "Failed to ban dealer");
    }
  } catch (err) {
    const errorMessage =
      err?.response?.data?.message || 
      err?.response?.data?.error ||   
      err?.message ||                 
      "Something went wrong while banning dealer";

    messageApi.error(errorMessage);
  } finally {
    setLoadingBanned(false);
  }
};


  useEffect(() => {
    if (!dealerId) return;
    fetchDealerDetails();
  }, [dealerId, listingFilter, sortOrder, page, limit]);

  if (!dealerData) return <div style={{ padding: 16 }}>Loading...</div>;

  const documents = [];
  if (dealerData.document) {
    documents.push({
      id: "doc-1",
      title: "Trade License",
      status: "Validated",
      submittedOn: dealerData.document,
    });
  }

  const handleFilterChange = (status) => {
  setListingFilter(status);
};

const handleSortChange = (value) => {
  setSortOrder(value);
};


const getCardColors = (title) => {
  switch (title) {
    case "Total Listings":
      return { bgColor: "#EFF6FF", titleColor: "#2563EB",titleNumber:"#1E3A8A" }; 
    case "Active Listings":
      return { bgColor: "#F0FDF4", titleColor: "#16A34A",titleNumber:"#14532D" }; 
    case "Sold Listings":
      return { bgColor: "#FAF5FF", titleColor: "#581C87",titleNumber:"#581C87" }; 
    case "Rejected Listings":
      return { bgColor: "#FEF2F2", titleColor: "#DC2626",titleNumber:"#7F1D1D" }; 
    default:
      return { bgColor: "#F3F4F6", titleColor: "#111827",titleNumber:"#1E3A8A" }; 
  }
};


const cards = [
  {
    title: "Total Listings",
    number: dealerData.total_cars ?? totalListings ?? tableData.length,
    icon: activeIcon,
    ...getCardColors("Total Listings"),
  },
  {
    title: "Active Listings",
    number: dealerData.active_cars ?? totalActive ?? 0,
    icon: pendingIcon,
    ...getCardColors("Active Listings"),
  },
  {
    title: "Sold Listings",
    number: dealerData.sold_cars ?? totalSold ?? 0,
    icon: soldIcon,
    ...getCardColors("Sold Listings"),
  },
  {
    title: "Rejected Listings",
    number: dealerData.rejected_cars ?? totalRejected ?? 0,
    icon: modelIcon,
    ...getCardColors("Rejected Listings"),
  },
];


  return (
    <div style={{ padding: 16 }}>
      {contextHolder}

      <Breadcrumb
        separator={<img src={Right} alt="" style={{ height: 12 }} />}
        style={{ marginBottom: 16 }}
        items={[
          {
            title: (
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "#6B7280",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "400",
                  padding: 0,
                }}
              >
                User Management
              </button>
            ),
          },
          {
            title: (
              <button
                type="button"
                onClick={() => navigate("/user-management/dealer")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6B7280",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "400",
                  padding: 0,
                }}
              >
                Dealer
              </button>
            ),
          },
          {
            title: (
              <span
                style={{
                  color: "#000000",
                  fontSize: "13px",
                  fontWeight: "400",
                }}
              >
                Dealer Profile
              </span>
            ),
          },
        ]}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: "700", color: "#111827", fontSize: "25px" }}>Dealer Profile</span>
          <span style={{ color: "#4B5563", fontWeight: 400, fontSize: "13px" }}>
            Review dealer information and manage verification status
          </span>
        </div>

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/user-management/dealer")}
          style={{
            marginBottom: 16,
            backgroundColor: "#F3F4F6",
            borderColor: "#D1D5DB",
            color: "#4B5563",
            borderRadius: 8,
            fontWeight: 400,
          }}
        >
          Back to Dealers
        </Button>
      </div>

      <Row gutter={24}>
        <Col xs={24} md={16}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <img
                  src={dealerData.profile_pic || Dealer}
                  alt="Dealer Logo"
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 8,
                    objectFit: "cover",
                    flex: "0 0 35px",
                  }}
                  onError={(e) => {
    e.target.onerror = null; 
    e.target.src = Dealer;  
  }}
                />
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#111827",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {dealerData.company_name || "N/A"}
                  </h3>
                  <h6 style={{ margin: 0, marginTop: 4, fontSize: "14px", fontWeight: 400, color: "#4B5563" }}>
                    Dealer ID: #{dealerData.user_id ?? "N/A"}
                  </h6>
                </div>
              </div>

              <div style={{ marginBottom: 8, marginTop: 18 }}>
                <strong style={{ display: "block", marginBottom: 4, color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                  Owner's Name
                </strong>
                <span>{dealerData.owner_name || "N/A"}</span>
              </div>

              <div style={{ marginBottom: 8 }}>
                <strong style={{ display: "block", marginBottom: 4, color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                  Email Address
                </strong>
                <span style={{ wordBreak: "break-word" }}>{dealerData.email || "N/A"}</span>
              </div>

              <div style={{ marginBottom: 8 }}>
                <strong style={{ display: "block", marginBottom: 4, color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                  Phone Number
                </strong>
                <span>{dealerData.phone_number || "N/A"}</span>
              </div>

              <div style={{ marginBottom: 8 }}>
                <strong style={{ display: "block", marginBottom: 4, color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                  Registered Since
                </strong>
                <span>{dealerData.created_at ? dealerData.created_at.split(" ").slice(1, 4).join(" ") : "N/A"}</span>
              </div>
            </Col>

            <Col xs={24} md={12}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: 6 }}>
                <div style={{ display: "", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>Account Status</div>
                  <div>
                    <BoostStatus status={dealerData.is_verified} />
                  </div>
                </div>

                <div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Verification Submitted On</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{dealerData.created_at ? dealerData.created_at.split(" ").slice(1, 4).join(" ") : "N/A"}</div>
              </div>
            </Col>
          </Row>
        </Col>

        <Col xs={24} md={8} style={{ paddingLeft: 12 }}>
          <div style={{ position: "sticky", top: 24 }}>
            <Card style={{ marginBottom: 16, backgroundColor: "#E6F4FC" }}>
              <h3 style={{ marginBottom: 16, fontSize: "16px", fontWeight: "600" }}>Subscription Package</h3>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ marginRight: 6, fontWeight: 500, color: "#4B5563" }}>Current Plan</span>
                <Tag
                  style={{
                    backgroundColor: "#008AD5",
                    color: "#FFFFFF",
                    borderRadius: "22px",
                    border: "none",
                    padding: "2px 8px",
                    fontWeight: 500,
                  }}
                >
                  {dealerData.subscription_details?.plan_name ?? "N/A"}
                </Tag>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Monthly Fee</span>
                <span style={{ wordBreak: "break-word", overflowWrap: "anywhere", fontWeight: 500, color: "#111827" }}>
                  {dealerData.subscription_details?.price ? `${dealerData.subscription_details.price} ${dealerData.subscription_details.currency ?? ""}` : "N/A"}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Listing Limit</span>
                <span style={{ wordBreak: "break-word", overflowWrap: "anywhere", fontWeight: 500, color: "#111827" }}>
                  {dealerData.subscription_details?.listing_limit ?? "N/A"}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Featured Listings</span>
                <span style={{ wordBreak: "break-word", overflowWrap: "anywhere", fontWeight: 500, color: "#111827" }}>
                  10 per month
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Next Payment</span>
                <span style={{ wordBreak: "break-word", overflowWrap: "anywhere", fontWeight: 500, color: "#111827" }}>
                  {dealerData.subscription_details?.end_date ? dealerData.subscription_details.end_date.split(" ").slice(0, 4).join(" ") : "N/A"}
                </span>
              </div>

              {/* <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Payment Status</span>
                <Tag
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: dealerData.subscription_details?.subscription_status ? "#DCFCE7" : "#FEE2E2",
                    color: dealerData.subscription_details?.subscription_status ? "#166534" : "#991B1B",
                    borderRadius: "22px",
                    border: "none",
                    padding: "2px 10px",
                    fontWeight: 500,
                    width: "fit-content",
                  }}
                >
                  {dealerData.subscription_details?.subscription_status ? "Active" : "Inactive"}
                </Tag>
              </div> */}
            </Card>
          </div>
        </Col>
      </Row>

      <SubmittedDocumentsCard documents={documents} />

      <div style={{ display: "flex", gap: 8, marginTop: "5px" }}>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          style={{ borderRadius: 8, flex: 1, background: "#16A34A", fontWeight: 500, fontSize: "12px" }}  onClick={() => approveDealer("verified")} loading={loadingApprove}
        >
          Approve Dealer
        </Button>

        <Button
           icon={<img src={reject_d} alt="download" style={{ width: 10, height: 10 }} />}
          style={{ borderRadius: 8, flex: 1, background: "#DC2626", color: "#FFFFFF", fontWeight: 500, fontSize: "12px" }} onClick={() => approveDealer("rejected")} loading={loadingReject}
        >
          Reject Application
        </Button>

        <Button
          type="primary"
          icon={<img src={info_d} alt="download" style={{ width: 12, height: 12 }} />}
          style={{ borderRadius: 8, flex: 1, background: "#EA580C", color: "white", fontWeight: 500, fontSize: "12px" }}
        >
          Info Requested
        </Button>

        <Button
          icon={<img src={flag_d} alt="download" style={{ width: 12, height: 12 }} />}
          style={{ borderRadius: 8, flex: 1, background: "#CA8A04", color: "white", fontWeight: 500, fontSize: "12px" }} onClick={() => reporteduser("")} loading={loadingFlagged}
        >
          Flag Account
        </Button>

        <Button
          icon={<img src={ban_d} alt="download" style={{ width: 12, height: 12 }} />}
          style={{ borderRadius: 8, flex: 1, background: "#1F2937", color: "#FFFFFF", fontWeight: 500, fontSize: "12px" }} onClick={() => bannedDealer} loading={loadingBanned}
        >
          Ban Dealer
        </Button>
      </div>

      <div
        className="tile-card"
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "600", color: "#1F2937", marginBottom: 2 }}>Dealer Listing Summary</h1>
          </div>
        </div>

        <div style={{ overflowX: "auto",scrollbarWidth: "none", paddingBottom: 8, marginBottom: 2 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "nowrap" }}>
            {cards.length === 0 ? (
              <div style={{ color: "#6B7280", padding: 12 }}>No packages to show</div>
            ) : (
              cards.map((card, idx) => (
                <div key={idx} className="col-md-6 col-lg-3 mb-4" style={{ flex: "0 0 auto" }}>
                 <div>
  <div
    className="card-body dashboard-card-body"
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      background: card.bgColor, 
      borderRadius: 8,
    }}
  >
    <div className="card-text-container">
      <h5
        className="card-individual-title"
        style={{ margin: 0, color: card.titleColor, fontWeight: 500 }}
      >
        {card.title}
      </h5>
      <p className="card-individual-number" style={{ color: card.titleNumber, fontWeight: 700, margin: 0 }}>
        {card.number}
      </p>
    </div>
    <div
      className="card-icon-individual-wrapper"
      style={{ backgroundColor: card.bgColor, borderRadius: 8, padding: 8 }}
    >
      <img src={card.icon} alt={card.title} style={{ width: 20, height: 20 }} />
    </div>
  </div>
              </div>

                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <Table
            columns={[
              ...columns_boost,
            ]}
            dataSource={tableData}
            loading={loading}
            rowKey="listingId"
            locale={{ emptyText: <Empty description="No packages found" /> }}
            pagination={{
              current: page,
              pageSize: limit,
              total: totalListings,
              //showSizeChanger: true,
              //pageSizeOptions: ["10", "20", "50", "100", "200"],
              onChange: (p, pSize) => {
                setPage(p);
                if (pSize && pSize !== limit) setLimit(pSize);
              },
            }}
            title={() => (
              <Row justify="space-between" align="middle" style={{ background: "#fff" }}>
                <Col style={{ display: "flex", alignItems: "center", gap: 12 }}>
  {["All", "Active", "Pending", "Sold","Rejected"].map((status) => (
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
      onClick={() => handleFilterChange(status)}
    >
      {status}
    </Button>
  ))}
</Col>

<Col style={{ display: "flex", alignItems: "center", gap: 12 }}>
  <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Sort by:</span>
  <Select
    value={sortOrder}
    onChange={handleSortChange}
    style={{ width: 180, borderRadius: 6, backgroundColor: "#D1D5DB", fontWeight:400,fontSize:"12px",color: "#fff" }}
  >
    <Option value="newest">Date Created(Newest)</Option>
    <Option value="oldest">Oldest</Option>
    {/* <Option value="PriceHigh">Price: High → Low</Option>
    <Option value="PriceLow">Price: Low → High</Option> */}
  </Select>
</Col>

              </Row>
            )}
          />
        </div>
      </div>
    </div>
  );
};

DealerDetails.propTypes = {};


export default DealerDetails;