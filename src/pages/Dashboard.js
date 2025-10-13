import React, { useEffect, useState } from "react";
import { Spin, Empty, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import carImg from "../assets/images/car_dash.svg";
import pendingIcon from "../assets/images/pending-icon.png";
import reportsIcon from "../assets/images/reports.svg";
import verificationIcon from "../assets/images/verification_dash.svg";
import openIcon from "../assets/images/support_dash.svg";
import soldIcon from "../assets/images/sold_dash.svg";
import "../assets/styles/dashboard.css";
import { userAPI } from "../services/api"; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const { user, token } = useSelector((state) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();

  const isLoggedIn = token && user;

  useEffect(() => {
    if (!isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  useEffect(() => {
    dashboardcounts();
  }, []);

  const handleApiResponse = (res) => {
    return res?.data ? res : null;
  };

  const handleApiError = (err) => {
    return (
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong while fetching dashboard"
    );
  };

  const dashboardcounts = async () => {
    try {
      setLoading(true);
      const response = await userAPI.dashboardstats(); 
      const resData = response?.data ?? response; 
      if (!resData || resData.status_code !== 200) {
        const msg = resData?.message || "Failed to fetch dashboard stats";
        messageApi.open({ type: "error", content: msg });
        setDashboardData(null);
        return;
      }

      const d = resData.data || {};

      const mapped = [
        {
          id: "cars_listed",
          subtitle: "Cars Listed",
          priceLabel: d.cars_listed_this_week?.total,
          priceValue: d.cars_listed_this_week?.percentage_change ?? "+0%",
          detail: "Individual Sellers",
          midRight: d.cars_listed_this_week?.individual_sellers ?? 0,
          footerLeft: "Dealers",
          footerRight: d.cars_listed_this_week?.dealers ?? 0,
          statusText: "This Week",
          statusBg: "#E0F2FE",
          statusColor: "#0369A1",
        },
        {
          id: "cars_sold",
          subtitle: "Cars Sold",
          priceLabel:
            d.car_sold_this_week?.total,
          priceValue: d.car_sold_this_week?.percentage_change ?? "+0%",
          detail: "Manual Updates",
          midRight: d.car_sold_this_week?.system_updates ?? 0,
          footerLeft: "System Updates",
          footerRight: d.car_sold_this_week?.manual_updates ?? 0,
          statusText: "This Week",
          statusBg: "#DCFCE7",
          statusColor: "#065F46",
        },
        {
          id: "pending_approval",
          subtitle: "Pending Approval",
          priceLabel: d.listings_pending_approval ?? 0,
          priceValue:
            d.listings_pending_approval_breakdown?.percentage_change ??
            d.listings_pending_approval_breakdown?.percentage_change ??
            "+0%",
          detail: "New Listings",
          midRight:
            d.listings_pending_approval_breakdown?.new_listings ?? 0,
          footerLeft: "Modified Listings",
          footerRight:
            d.listings_pending_approval_breakdown?.modified_listings ?? 0,
          statusText: "Pending",
          statusBg: "#FEF9C3",
          statusColor: "#CA8A04",
        },
        {
          id: "incident_reports",
          subtitle: "Incident Reports",
          priceLabel: d.user_incident_reports?.total ?? 0,
          priceValue: d.user_incident_reports?.status ?? "No change",
          detail: "Listing Issues",
          midRight: d.user_incident_reports?.listing_issues ?? 0,
          footerLeft: "User Issues",
          footerRight: d.user_incident_reports?.user_issues ?? 0,
          statusText: "Reports",
          statusBg: "#FEE2E2",
          statusColor: "#DC2626",
        },
        {
          id: "dealer_verification",
          subtitle: "Dealer Verification",
          priceLabel: d.dealer_verification_tasks?.total ?? 0,
          priceValue: d.dealer_verification_tasks?.percentage_change ?? "+0%",
          detail: "New Applications",
          midRight: d.dealer_verification_tasks?.new_applications ?? 0,
          footerLeft: "Re-submissions",
          footerRight: d.dealer_verification_tasks?.resubmissions ?? 0,
          statusText: "Verification",
          statusBg: "#F3E8FF",
          statusColor: "#6D28D9",
        },
        {
          id: "support_requests",
          subtitle: "Support Requests",
          priceLabel: d.support_requests?.total ?? 0,
          priceValue: d.support_requests?.percentage_change ?? "+0%",
          detail: "High Priority",
          midRight: d.support_requests?.high_priority ?? 0,
          footerLeft: "Priority",
          footerRight: d.support_requests?.normal_priority ?? 0,
          statusText: "Open",
          statusBg: "#E0E7FF",
          statusColor: "#4F46E5",
        },
      ];

      setDashboardData(mapped);
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({ type: "error", content: errorData });
      setDashboardData(null);
    } finally {
      setLoading(false);
    }
  };

  const getCardIcon = (subtitle) => {
    switch (subtitle) {
      case "Cars Listed":
        return carImg;
      case "Cars Sold":
        return soldIcon;
      case "Pending Approval":
        return pendingIcon;
      case "Incident Reports":
        return reportsIcon;
      case "Dealer Verification":
        return verificationIcon;
      case "Support Requests":
        return openIcon;
      default:
        return carImg;
    }
  };

  const getIconBgColor = (subtitle) => {
    switch (subtitle) {
      case "Cars Listed":
        return "#E0F2FE";
      case "Cars Sold":
        return "#DCFCE7";
      case "Pending Approval":
        return "#FEF9C3";
      case "Incident Reports":
        return "#FEE2E2";
      case "Dealer Verification":
        return "#F3E8FF";
      case "Support Requests":
        return "#E0E7FF";
      default:
        return "#F3F4F6";
    }
  };

  const getPriceStyle = (priceValue) => {
    if (!priceValue && priceValue !== 0) {
      return { color: "#6B7280", icon: "" };
    }
    const asString = String(priceValue);
    const num = parseFloat(asString.replace("%", "").replace("+", "").replace("-", ""));
    if (asString.includes("+") && !isNaN(num) && num > 5) {
      return { color: "#16A34A", icon: "↑" };
    } else if (asString.includes("+") && !isNaN(num) && num <= 5) {
      return { color: "#DC2626", icon: "↓" };
    } else {
      return { color: "#6B7280", icon: "" };
    }
  };

  if (loading) {
    return (
      <Spin
        tip="Loading Dashboard..."
        style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
      />
    );
  }

  if (!dashboardData || dashboardData.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="No dashboard data available" />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {dashboardData.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "16px",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <div
                className="card-icon-wrapper-dashboard"
                style={{
                  backgroundColor: getIconBgColor(item.subtitle),
                }}
              >
                <img className="card-icon-dashboard" src={getCardIcon(item.subtitle)} alt={item.subtitle} />
              </div>

              <span
                style={{
                  backgroundColor: item.statusBg,
                  color: item.statusColor,
                  padding: "2px 6px",
                  borderRadius: "6px",
                  fontSize: "10px",
                  fontWeight: 400,
                  whiteSpace: "nowrap",
                }}
              >
                {item.statusText}
              </span>
            </div>

            <p style={{ margin: "4px 0", fontSize: "18px", color: "#111827", fontWeight: 600 }}>
              {item.subtitle}
            </p>

            <div style={{ fontSize: "25px", margin: "4px 0", fontWeight: 700, color: "#111827" }}>
              {item.priceLabel}{" "}
              <strong style={{ color: getPriceStyle(item.priceValue).color, fontSize: "12px", fontWeight: 400 }}>
                {getPriceStyle(item.priceValue).icon} {item.priceValue}
              </strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0" }}>
              <span style={{ fontSize: "13px", color: "#6B7280", fontWeight: 400 }}>{item.detail}</span>
              <span style={{ fontSize: "13px", color: "#000000", fontWeight: 500, whiteSpace: "nowrap" }}>
                {item.midRight}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#4B5563", marginTop: "2px", fontWeight: 400 }}>
              <span>{item.footerLeft}</span>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "#000000" }}>{item.footerRight}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
