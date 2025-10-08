import React, { useEffect, useState } from "react";
import {
  Empty,
  message,
  Table,
  Tooltip,
  Divider,
  Switch,
  Popconfirm,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import {  useSelector } from "react-redux";
import activeIcon from "../assets/images/star.svg";
import pendingIcon from "../assets/images/premium.svg";
import soldIcon from "../assets/images/enterprice.svg";
import modelIcon from "../assets/images/total_price.svg";
import "../assets/styles/allcarsdashboard.css";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import "../assets/styles/pricing.css";
import { loginApi } from "../services/api";
import editIcon from "../assets/images/edit.svg";
import reject from "../assets/images/delete_icon.svg";
import plusIcon from "../assets/images/plus_icon.svg";
import PropTypes from "prop-types";

// Helper function to get icon based on package name
const getPackageIcon = (packageName, isSummary) => {
  if (isSummary) return modelIcon;
  
  const nameLower = (packageName || "").toLowerCase();
  if (nameLower.includes("basic")) return activeIcon;
  if (nameLower.includes("premium")) return pendingIcon;
  if (nameLower.includes("enterprise")) return soldIcon;
  return modelIcon;
};

// Helper function to get icon background color
const getIconBackgroundColor = (icon) => {
  if (icon === activeIcon) return "#DBEAFE";
  if (icon === pendingIcon) return "#DCFCE7";
  if (icon === soldIcon) return "#F3E8FF";
  return "#FFEDD5";
};

// Helper function to format percentage display
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

// Helper function to get display value for card
const getCardDisplayValue = (item) => {
  if (item.isSummary) return item.total;
  if (item.total !== undefined && item.total !== null) return item.total;
  return item.listings;
};

// Helper function to format API data into table format
const formatSubscriptionData = (item) => {
  return {
    key: item.id,
    id: item.id,
    name: item.name,
    price: item.price,
    listings: item.listing_limit,
    duration: item.duration_days,
    autoRenew: Number(item.Auto_renewed) === 1,
    active: Number(item.is_active) === 1,
    description: item.description,
    raw: item,
    total: item.active,
    percentage: Number(item.percentage) || 0,
    currency: item.currency || "IQD",
    target_user_type: item.target_user_type || "",
  };
};

// Helper function to safely parse numeric values
const parseNumericValue = (value) => {
  return value !== undefined && value !== null ? Number(value) : 0;
};

// Helper function to handle API error messages
const getErrorMessage = (err) => {
  return err?.response?.data?.message || 
         err?.response?.data?.error || 
         err?.message || 
         "Something went wrong";
};

// Package Card Component
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

const Pricing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [tableData, setTableData] = useState([]);
  const [totalActive, setTotalActive] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);

  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = token && user;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const response = await loginApi.getsubscriptionpackage();
      const data = handleApiResponse(response);

      if (data?.data && Array.isArray(data.data)) {
        const formattedData = data.data.map(formatSubscriptionData);

        setTableData(formattedData);
        setTotalActive(parseNumericValue(data.total_active));
        setTotalPercentage(parseNumericValue(data.total_percentage));
      } else {
        setTableData([]);
        setTotalActive(0);
        setTotalPercentage(0);
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: "error",
        content: errorData?.message || "Failed to fetch subscription packages",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleToggleActive = async (id, checked) => {
    const body = { 
      id:id,
      is_active: checked ? 1 : 0
     };
    try {
      setLoading(true);
      const res = await loginApi.editsubscriptionpackage( body);
      const resData = res?.data;
      if (resData?.status_code === 200) {
        messageApi.success(resData.message || "Subscription updated successfully");
        setTableData((prev) => prev.map((p) => (p.id === id ? { ...p, active: checked } : p)));
      } else {
        messageApi.error(resData?.message || "Failed to update subscription");
      }
    } catch (err) {
      console.error("Submit error:", err);
      messageApi.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    if (String(record.id) === "__total_summary__") return;
    navigate(`/financials/pricing/createNewPackage/${record.id}`);
  };

  const handleDelete = async (record) => {
    if (String(record.id) === "__total_summary__") return;
    const id = record.id;
    try {
      setLoading(true);
      const response = await loginApi.deletesubscriptionpackage(id);
      const data = handleApiResponse(response);
      if (data?.status_code === 200) {
        messageApi.success(data?.message || "Package deleted successfully");
        fetchAdminData();
      } else {
        messageApi.error(data?.message || "Failed to delete package");
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: "error",
        content: errorData?.message || "Failed to delete package",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Package Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <div style={{ fontWeight: 500 }}>{text}</div>,
    },
    {
      title: "Price (IQD)",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (val) => <div style={{ fontWeight: 400 }}>{val}</div>,
    },
    {
      title: "Listings",
      dataIndex: "listings",
      key: "listings",
      width: 120,
      render: (val) => <div>{val}</div>,
    },
    {
      title: "Duration (days)",
      dataIndex: "duration",
      key: "duration",
      width: 150,
    },
    {
      title: "Auto Renewal",
      dataIndex: "autoRenew",
      key: "autoRenew",
      width: 140,
      render: (val, record) => {
        if (String(record.id) === "__total_summary__") {
          return <span style={{ fontWeight: 500, color: val ? "#16A34A" : "#DC2626" }}>{val ? "Yes" : "No"}</span>;
        }
        const isYes = !!val;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 500, color: isYes ? "#16A34A" : "#DC2626" }}>{isYes ? "Yes" : "No"}</span>
          </div>
        );
      },
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      width: 100,
      render: (val, record) => {
        return (
          <Switch
            checked={!!val}
            onChange={(checked) => handleToggleActive(record.id, checked)}
            style={{ backgroundColor: !!val ? "#008AD5" : "#d9d9d9", borderColor: !!val ? "#008AD5" : "#d9d9d9" }}
          />
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (text, record) => {
        if (String(record.id) === "__total_summary__") return <span style={{ color: "#6B7280" }}>—</span>;
        return (
          <Space>
            <Tooltip title="Edit">
              <img src={editIcon} alt="edit" onClick={() => handleEdit(record)} style={{ width: 14, cursor: "pointer" }} />
            </Tooltip>
            <Popconfirm title={`Delete "${record.name}"?`} onConfirm={() => handleDelete(record)} okText="Yes" cancelText="No">
              <img src={reject} alt="delete" style={{ width: 14, cursor: "pointer" }} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}

      <div
        className="tile-card"
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#1F2937", marginBottom: 2 }}>Subscription Packages</h1>
            <p style={{ fontSize: "15px", color: "#4B5563", margin: 0, fontWeight: "400" }}>Manage all subscription-based plans</p>
          </div>

          <button
            style={{
              backgroundColor: "#008AD5",
              color: "white",
              border: "none",
              gap: 8,
              padding: "8px 18px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => navigate("/financials/pricing/createNewPackage")}
          >
            <img src={plusIcon} alt="add" style={{ width: "12px", height: "12px", marginRight: "8px", fontWeight: 400 }} />
            Create New Package
          </button>
        </div>

        <Divider style={{ margin: "0px 0 16px 0" }} />

        <h6 style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: 10 }}>Monthly Analytics</h6>

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
            columns={columns}
            dataSource={tableData}
            loading={loading}
            locale={{ emptyText: <Empty description="No packages found" /> }}
          />
        </div>
      </div>
    </div>
  );
};

PackageCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string.isRequired,
    isSummary: PropTypes.bool,
    percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    listing_limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    all_time_total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    target_user_type: PropTypes.string,
    raw: PropTypes.object,
  }).isRequired,
};

export default Pricing;
