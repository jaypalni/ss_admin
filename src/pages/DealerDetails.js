import React,{useState} from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Breadcrumb,
  Tag,
  Avatar,
  Divider,
  Space,
   Empty,
  message,
  Table,
  Tooltip,
  Switch,
  Popconfirm,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftOutlined,
  UserOutlined,
  DownloadOutlined,
  EyeOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import Right from "../assets/images/Right.svg";
import Dealer from "../assets/images/img.svg";
import National from "../assets/images/national.svg";
import pdf from "../assets/images/pdf.svg";
import warning from "../assets/images/warning.svg";
import {  useSelector } from "react-redux";
import activeIcon from "../assets/images/star.svg";
import editIcon from "../assets/images/edit.svg";
import reject from "../assets/images/delete_icon.svg";
import pendingIcon from "../assets/images/premium.svg";
import soldIcon from "../assets/images/enterprice.svg";
import modelIcon from "../assets/images/total_price.svg";
import "../assets/styles/allcarsdashboard.css";

const BoostStatus = ({ isFeatured }) => {
  return isFeatured ? <Tag style={{background:"#FEF9C3",color:"#854D0E",border:"8px"}}>Pending Verification</Tag> : <Tag color="default">Not Featured</Tag>;
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
              fontSize:"10px"
            }}
          >
            {isApproved ? <CheckOutlined style={{ color: "#16A34A" }} /> :  <img
    src={warning}       
    alt="Not Approved"
    style={{ width: 12, height: 12 }}
  />}
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
        {doc.submittedOn}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => onCancel(doc)}
          style={{ borderRadius: 8,flex: 1,background:"#008AD5",fontWeight:400,fontSize:"12px"   }}
        >
          View
        </Button>

        <Button
          icon={<DownloadOutlined />}
          onClick={() => onDownload(doc)}
          style={{ borderRadius: 8,flex: 1,border: "1px solid #D1D5DB"
,color:"#374151",fontWeight:400,fontSize:"12px"  }}
        >
          Download
        </Button>
      </div>
    </Card>
  );
};

const columns_boost = [
  {
      title: "Listing ID",
      dataIndex: "listingId",
      key: "listingId",
      width: 150,
      render: (val) => <div style={{ fontWeight: 500,color:"#374151",fontSize:14 }}>{val}</div>
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (val) => <div style={{ fontWeight: 500,color:"#374151",fontSize:14 }}>{val}</div>
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 120,
      render: (val) => <div style={{ fontWeight: 500,color:"#374151",fontSize:14 }}>{val}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (val) => <div style={{ fontWeight: 500,color:"#374151",fontSize:14 }}>{val}</div>
    },
    {
      title: "Date Created",
      dataIndex: "date",
      key: "date",
      width: 150,
      render: (val) => <div style={{ fontWeight: 500,color:"#374151",fontSize:14 }}>{val}</div>
    },
    {
      title: "Price (IQD)",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (val) => <div style={{ fontWeight: 500,color:"#374151",fontSize:14 }}>{val}</div>
    },
  ];


const SubmittedDocumentsCard = ({ documents }) => {
  const docs = documents ?? [
    {
      id: 1,
      title: "Trade License",
      status: "Validated",
      submittedOn: "trade_license_2024.pdf",
      image: pdf, // image import
    },
    {
      id: 2,
      title: "National ID",
      status: "Missing/Unreadable",
      submittedOn: "national_id_scan.jpg",
      image: National, // image import
    },
  ];

  const handleDownload = (doc) => {
    console.log("Download", doc);
    message.info(`Download started for ${doc.title}`);
  };

  const handleCancel = (doc) => {
    console.log("Cancel", doc);
    message.info(`Cancel requested for ${doc.title}`);
  };

  return (
    <Card
      title="Submitted Documents"
      style={{ borderRadius: 12, marginTop: 16, color: "#111827", fontWeight: 600, width: "100%" }}
    >
      <Row gutter={[24, 16]}>
        {docs.map((d) => (
          <Col xs={24} sm={12} key={d.id}>
            <DocumentCard
              doc={d}
              onDownload={handleDownload}
              onCancel={handleCancel}
            />
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

        <div style={{ fontWeight: 700, fontSize: 18 }}>
          {displayValue}
        </div>
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


const DealerDetails = () => {
  const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [totalActive, setTotalActive] = useState(0);
    const [totalPercentage, setTotalPercentage] = useState(0);

  const carDetails = {
    seller: {
      first_name: "Ahmed",
      last_name: "Al-Rashid",
      email: "ahmed@alrashid.com",
      phone_number: "+964-770-000-0000",
      member_since: "Jan 2022",
      is_dealer: "True",
    },
    listing_id: "DLR-2024-001",
    is_featured: true,
    verification_submitted_on: "Feb 5, 2024",
  };

  const crownicon = Right;
  const shareicon = Right;
  const BASE_URL = ""; 

  return (
    <div style={{ padding: 16 }}>
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
                  src={Dealer}
                  alt="Dealer Logo"
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 8,
                    objectFit: "cover",
                    flex: "0 0 35px",
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
                    Al-Rashid Motors
                  </h3>
                  <h6 style={{ margin: 0, marginTop: 4, fontSize: "14px", fontWeight: 400, color: "#4B5563" }}>
                    Dealer ID: #{carDetails.listing_id}
                  </h6>
                </div>
              </div>

              <div style={{ marginBottom: 8, marginTop: 18 }}>
                <strong style={{ display: "block", marginBottom: 4, color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                  Owner's Name
                </strong>
                <span>
                  {carDetails?.seller?.first_name ? `${carDetails.seller.first_name} ${carDetails.seller.last_name}` : "N/A"}
                </span>
              </div>

              <div style={{ marginBottom: 8 }}>
                <strong style={{ display: "block", marginBottom: 4, color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                  Email Address
                </strong>
                <span style={{ wordBreak: "break-word" }}>{carDetails?.seller?.email || "N/A"}</span>
              </div>

              <div style={{ marginBottom: 8 }}>
                <strong style={{ display: "block", marginBottom: 4, color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                  Phone Number
                </strong>
                <span>{carDetails?.seller?.phone_number || "N/A"}</span>
              </div>

              <div style={{ marginBottom: 8 }}>
                <strong style={{ display: "block", marginBottom: 4, color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                  Registered Since
                </strong>
                <span>{carDetails?.seller?.member_since || "N/A"}</span>
              </div>
            </Col>

            <Col xs={24} md={12}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: 6 }}>
                <div style={{ display: "", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 14, color: "#6B7280", fontWeight: 500 }}>Account Status</div>
                  <div>
                    <BoostStatus isFeatured={carDetails?.is_featured} />
                  </div>
                </div>

                <div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Verification Submitted On</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{carDetails?.verification_submitted_on || "N/A"}</div>
              </div>
            </Col>
          </Row>
        </Col>

        <Col xs={24} md={8} style={{ paddingLeft: 12 }}>
          <div style={{ position: "sticky", top: 24 }}>
            <Card style={{ marginBottom: 16, backgroundColor: "#E6F4FC" }}>
              <h3 style={{ marginBottom: 16, fontSize: "18px", fontWeight: "600" }}>Subscription Package</h3>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Current Plan</span>
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
                  Premium Plus
                </Tag>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Monthly Fee</span>
                <span style={{ wordBreak: "break-word", overflowWrap: "anywhere", fontWeight: 500, color: "#111827" }}>
                  50,000 IQD
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Listing Limit</span>
                <span style={{ wordBreak: "break-word", overflowWrap: "anywhere", fontWeight: 500, color: "#111827" }}>50 vehicles</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Featured Listings</span>
                <span style={{ wordBreak: "break-word", overflowWrap: "anywhere", fontWeight: 500, color: "#111827" }}>10 per month</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Next Payment</span>
                <span style={{ wordBreak: "break-word", overflowWrap: "anywhere", fontWeight: 500, color: "#111827" }}>Feb 15, 2024</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Payment Status</span>
                <Tag
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: "#DCFCE7",
                    color: "#166534",
                    borderRadius: "22px",
                    border: "none",
                    padding: "2px 10px",
                    fontWeight: 500,
                    width: "fit-content",
                  }}
                >
                  <span style={{ color: "#16A34A" }}>✔</span>
                  <span>Active</span>
                </Tag>
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      <SubmittedDocumentsCard
            documents={[
              {
      id: 1,
      title: "Trade License",
      status: "Validated",
      submittedOn: "trade_license_2024.pdf",
      image: pdf, 
    },
    {
      id: 2,
      title: "National ID",
      status: "Missing/Unreadable",
      submittedOn: "national_id_scan.jpg",
      image: National, 
    },
            ]}
          />

          <div style={{ display: "flex", gap: 8,marginTop:"5px" }}>
        <Button
          type="primary"
          icon={<CheckOutlined />}
          style={{ borderRadius: 8,flex: 1,background:"#16A34A",fontWeight:500,fontSize:"12px"   }}
        >
          Approve Dealer
        </Button>

        <Button
          icon={<DownloadOutlined />}
          style={{ borderRadius: 8,flex: 1,background: "#DC2626"
,color:"#FFFFFF",fontWeight:500,fontSize:"12px"  }}
        >
          Reject Application
        </Button>

         <Button
          type="primary"
          icon={<EyeOutlined />}
          style={{ borderRadius: 8,flex: 1,background:"#EA580C",color:"white",fontWeight:500,fontSize:"12px"   }}
        >
          Info Requested
        </Button>

        <Button
          icon={<DownloadOutlined />}
          style={{ borderRadius: 8,flex: 1,background: "#CA8A04"
,color:"white",fontWeight:500,fontSize:"12px"  }}
        >
          Flag Account
        </Button>

        <Button
          icon={<DownloadOutlined />}
          style={{ borderRadius: 8,flex: 1,background: "#1F2937"
,color:"#FFFFFF",fontWeight:500,fontSize:"12px"  }}
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
          marginTop:"20px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: "600", color: "#1F2937", marginBottom: 2 }}>Dealer Listing Summary</h1>
          </div>
        </div>

        <div style={{ overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "nowrap" }}>
            {tableData.length === 0 ? (
              <div style={{ color: "#6B7280", padding: 12 }}>No packages to show</div>
            ) : (
              [...tableData, {
                key: "__total_summary__",
                id: "__total_summary__",
                name: "Total",
                total: totalActive,
                percentage: totalPercentage,
                isSummary: true,
              }].map((item) => <PackageCard key={item.key || item.id} item={item} />)
            )}
          </div>
        </div>

        <div>
          <Table
            columns={columns_boost}
            dataSource={tableData}
            loading={loading}
            locale={{ emptyText: <Empty description="No packages found" /> }}
          />
        </div>
      </div>
    </div>
  );
};

export default DealerDetails;
