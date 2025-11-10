import React, { useState } from "react";
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
  Select,Modal
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
import { useDealerDetails } from "../hooks/useDealerDetails";
import { useDealerActions } from "../hooks/useDealerActions";
import { DealerActionButtons } from "../components/DealerActionButtons";
import { DealerSummaryCards } from "../components/DealerSummaryCards";
import { DealerProfileInfo } from "../components/DealerProfileInfo";
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
      tagColor = "#FEE2E2";
      textColor = "#991B1B";
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
  const isApproved = doc.status === "";

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
        {/* <div style={{ marginLeft: 12 }}>
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
        </div> */}
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
  const [listingFilter, setListingFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const columns_boost = [
  {
    title:<span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>Listing ID</span>,
    dataIndex: "listingId",
    key: "listingId",
    width: 150,
   render: (text, record) => {
    return (
      <span
        style={{ color: "#1890ff", cursor: "pointer" }}
        onClick={() =>
          navigate(`/listingdetails/${record.listingId}`, {
            state: { from: "dealerDetails", dealerId: dealerData?.user_id, },
          })
        }
      >
        {text}
      </span>
    );
  },
     onCell: (record) => ({
        style: { cursor: "pointer" },
  }),
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
  render: (val, record) => {
    // record contains the full row data
    let displayText = "";
    let bgColor = "";
    let textColor = "";

    if (record.status?.toLowerCase() === "sold") {
      displayText = "Sold";
      bgColor = "#DBEAFE";
      textColor = "#1E40AF";
    } else if (val === "Approved") {
      displayText = "Active";
      bgColor = "#DCFCE7";
      textColor = "#166534";
    } else if (val === "Pending") {
      displayText = "Pending";
      bgColor = "#FEF9C3";
      textColor = "#854D0E";
    } else if (val === "Rejected") {
      displayText = "Rejected";
      bgColor = "#FEE2E2";
      textColor = "#991B1B";
    } else {
      displayText = val; 
      bgColor = "#F3F4F6";
      textColor = "#374151";
    }

    return (
      <div
        style={{
          fontWeight: 500,
          fontSize: 12,
          backgroundColor: bgColor,
          color: textColor,
          padding: "4px 8px",
          borderRadius: 12,
          display: "inline-block",
          textAlign: "center",
        }}
      >
        {displayText}
      </div>
    );
  },
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

  const {
    dealerData,
    tableData,
    loading,
    totalListings,
    totalActive,
    totalSold,
    totalRejected,
  } = useDealerDetails(dealerId, listingFilter, sortOrder, page, limit);

  const {
    loadingApprove,
    loadingReject,
    loadingFlagged,
    loadingBanned,
    approveDealer,
    reporteduser,
    bannedDealer,
    contextHolder
  } = useDealerActions(dealerData, navigate);

  const handleFilterChange = (status) => {
    setListingFilter(status);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

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

      <DealerProfileInfo dealerData={dealerData} />

      <SubmittedDocumentsCard documents={documents} />
      <DealerActionButtons
        dealerData={dealerData}
        loadingApprove={loadingApprove}
        loadingReject={loadingReject}
        loadingFlagged={loadingFlagged}
        loadingBanned={loadingBanned}
        onApprove={approveDealer}
        onReject={approveDealer}
        onFlag={reporteduser}
        onBan={bannedDealer}
      />

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

        <DealerSummaryCards
          dealerData={dealerData}
          totalListings={totalListings}
          totalActive={totalActive}
          totalSold={totalSold}
          totalRejected={totalRejected}
        />

        <div>
          <Table
            columns={columns_boost}
            dataSource={tableData}
            loading={loading}
            rowKey="listingId"
            locale={{ emptyText: <Empty description="No packages found" /> }}
            pagination={{
              current: page,
              pageSize: limit,
              total: totalListings,
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