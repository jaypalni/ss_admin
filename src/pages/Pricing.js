import React, { useEffect, useState,useRef } from "react";
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
import boostIcon3 from "../assets/images/3_boost.svg";
import boostIcon7 from "../assets/images/7_boost.svg";
import boostIcon14 from "../assets/images/14_boost.svg";
import PropTypes from "prop-types";

const getBoostIconByDuration = (duration) => {
  if (duration <= 5) return boostIcon3;
  if (duration >= 6 && duration <= 10) return boostIcon7;
  return boostIcon14;
};

const getPackageIcon = (packageName, isSummary, isBoost = false, duration = 0) => {
  if (isSummary) return modelIcon;

  if (isBoost) return getBoostIconByDuration(duration);

  const nameLower = (packageName || "").toLowerCase();
  if (nameLower.includes("basic")) return activeIcon;
  if (nameLower.includes("premium")) return pendingIcon;
  if (nameLower.includes("enterprise")) return soldIcon;
  return modelIcon;
};

const getIconBackgroundColor = (icon, duration = null, isBoost = false, isSummary = false) => {
 if (isBoost && !isSummary) {
    const d = Number(duration);
    if (!Number.isFinite(d)) {
      return "#FFEDD5";
    }
    if (d <= 5) return "#DBEAFE";
    if (d >= 6 && d <= 10) return "#DCFCE7";
    if (d > 10) return "#F3E8FF";
    return "#FFEDD5";
  }

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

const parseNumericValue = (value) => {
  return value !== undefined && value !== null ? Number(value) : 0;
};

const getErrorMessage = (err) => {
  return err?.response?.data?.message || 
         err?.response?.data?.error || 
         err?.message || 
         "Something went wrong";
};

const PackageCard = ({ item, isBoost = false }) => {
  const icon = getPackageIcon(item.name, item.isSummary, isBoost, item.duration);
  const iconBgColor = getIconBackgroundColor(icon, item.duration, isBoost,item.isSummary);
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
  title={
    isBoost
      ? item.isSummary
        ? "Total"
        : `${item.duration}-Day Boost`
      : item.name
  }
>
  {isBoost
    ? item.isSummary
      ? "Total"
      : `${item.duration}-Day Boost`
    : item.name}
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
  const didMountRef = useRef(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [tableData, setTableData] = useState([]);
  const [listingData, setListingData] = useState([]);
  const [boostingData, setBoostingData] = useState([]);
  const [totalListingActive, setTotalListingActive] = useState(0);
  const [totalListingPercentage, setTotalListingPercentage] = useState(0);
  const [totalBoostingActive, setTotalBoostingActive] = useState(0);
  const [totalBoostingPercentage, setTotalBoostingPercentage] = useState(0);


  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = token && user;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (didMountRef.current) return;
    didMountRef.current = true;
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
  try {
    setLoading(true);
    const response = await loginApi.getsubscriptionpackage();
    const data = handleApiResponse(response);

    if (data?.data) {
      const listings = (data.data.listings || []).map(formatSubscriptionData);
      const boostings = (data.data.boostings || []).map(formatSubscriptionData);

      setListingData(listings);
      setBoostingData(boostings);

      setTotalListingActive(parseNumericValue(data.total_listing_active));
      setTotalListingPercentage(parseNumericValue(data.total_listing_percentage));

      setTotalBoostingActive(parseNumericValue(data.total_boosting_active));
      setTotalBoostingPercentage(parseNumericValue(data.total_boosting_percentage));
    } else {
      setListingData([]);
      setBoostingData([]);
      setTotalListingActive(0);
      setTotalListingPercentage(0);
      setTotalBoostingActive(0);
      setTotalBoostingPercentage(0);
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
  const isInListing = listingData.some((p) => p.id === id);
  const isInBoosting = boostingData.some((p) => p.id === id);

  const prevListingData = listingData;
  const prevBoostingData = boostingData;
  const prevTotalListing = totalListingActive;
  const prevTotalBoosting = totalBoostingActive;

  if (isInListing) {
    setListingData((prev) => prev.map((p) => (p.id === id ? { ...p, active: checked } : p)));
    setTotalListingActive((prev) => Math.max(0, prev + (checked ? 1 : -1)));
  }

  if (isInBoosting) {
    setBoostingData((prev) => prev.map((p) => (p.id === id ? { ...p, active: checked } : p)));
    setTotalBoostingActive((prev) => Math.max(0, prev + (checked ? 1 : -1)));
  }

  if (!isInListing && !isInBoosting && typeof setTableData === "function") {
    setTableData((prev) => prev.map((p) => (p.id === id ? { ...p, active: checked } : p)));
  }

  const body = { id, is_active: checked ? 1 : 0 };
  try {
    setLoading(true);
    const res = await loginApi.editsubscriptionpackage(body);
    const resData = res?.data;

    if (resData?.status_code === 200) {
      messageApi.success(resData.message || "Subscription updated successfully");
    } else {
      setListingData(prevListingData);
      setBoostingData(prevBoostingData);
      setTotalListingActive(prevTotalListing);
      setTotalBoostingActive(prevTotalBoosting);
      messageApi.error(resData?.message || "Failed to update subscription");
    }
  } catch (err) {
    setListingData(prevListingData);
    setBoostingData(prevBoostingData);
    setTotalListingActive(prevTotalListing);
    setTotalBoostingActive(prevTotalBoosting);

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

  const columns_boost = [
     {
      title: "Duration (days)",
      dataIndex: "duration",
      key: "duration",
      width: 150,
    },
    {
      title: "Boost Price (IQD)",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (val) => <div style={{ fontWeight: 400 }}>{val}</div>,
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
            <p style={{ fontSize: "13px", color: "#4B5563", margin: 0, fontWeight: "400" }}>Manage all subscription-based plans</p>
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

        <div style={{ overflowX: "auto", paddingBottom: 8, marginBottom: 16, scrollbarWidth: "none",msOverflowStyle: "none", }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "nowrap" }}>
            {listingData.length === 0 ? (
              <div style={{ color: "#6B7280", padding: 12 }}>No packages to show</div>
            ) : (
              [...listingData, {
                key: "__total_summary__",
                id: "__total_summary__",
                name: "Total",
                total: totalListingActive,
                percentage: totalListingPercentage,
                isSummary: true,
              }].map((item) => <PackageCard key={item.key || item.id} item={item} />)
            )}
          </div>
        </div>

        <div>
          <Table
            columns={columns}
            dataSource={listingData}
            loading={loading}
            locale={{ emptyText: <Empty description="No packages found" /> }}
          />
        </div>
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
            <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#1F2937", marginBottom: 2 }}>Featured Listing Pricing Rules</h1>
            <p style={{ fontSize: "13px", color: "#4B5563", margin: 0, fontWeight: "400" }}>Define pricing logic for boosted listings</p>
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
            Add New Boost Rule
          </button>
        </div>

        <Divider style={{ margin: "0px 0 16px 0" }} />

        <h6 style={{ fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: 10 }}>Monthly Featured Purchases</h6>

        <div style={{ overflowX: "auto", paddingBottom: 8, marginBottom: 16,scrollbarWidth: "none",msOverflowStyle: "none", }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "nowrap" }}>
            {boostingData.length === 0 ? (
              <div style={{ color: "#6B7280", padding: 12 }}>No packages to show</div>
            ) : (
              [...boostingData, {
                key: "__total_summary__",
                id: "__total_summary__",
                name: "Total",
                total: totalBoostingActive,
                percentage: totalBoostingPercentage,
                isSummary: true,
                
              }].map((item) => <PackageCard key={item.key || item.id} item={item} isBoost={true} />)
            )}
          </div>
        </div>

        <div>
          <Table
            columns={columns_boost}
            dataSource={boostingData}
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
