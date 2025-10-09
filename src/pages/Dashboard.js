import React, { useEffect, useState } from "react";
import { Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import carImg from "../assets/images/car_dash.svg";
import pendingIcon from "../assets/images/pending-icon.png";
import reportsIcon from "../assets/images/reports.svg";
import verificationIcon from "../assets/images/verification_dash.svg";
import openIcon from "../assets/images/support_dash.svg";
import soldIcon from "../assets/images/sold_dash.svg";
import "../assets/styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const { user, token } = useSelector((state) => state.auth);

  const isLoggedIn = token && user;

  useEffect(() => {
    if (!isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProfileData([
        {
          id: 1,
          subtitle: "Cars Listed",
          priceLabel: "247",
          priceValue: "+12%",
          detail: "Individual Sellers",
          midRight: "189",
          footerLeft: "Dealers",
          footerRight: "58",
          statusText: "This Week",
          statusBg: "#F3F4F6",
          statusColor: "#6B7280",
        },
        {
          id: 2,
          subtitle: "Cars Sold",
          priceLabel: "89",
          priceValue: "+8%",
          detail: "Manual Updates",
          midRight: "67",
          footerLeft: "System Updates",
          footerRight: "22",
          statusText: "This Week",
          statusBg: "#F3F4F6",
          statusColor: "#6B7280",
        },
        {
          id: 3,
          subtitle: "Pending Approval",
          priceLabel: "23",
          priceValue: "+3%",
          detail: "New Listings",
          midRight: "18",
          footerLeft: "Modified Listings",
          footerRight: "5",
          statusText: "Pending",
          statusBg: "#FEF9C3",
          statusColor: "#CA8A04",
        },
        {
          id: 4,
          subtitle: "Incident Reports",
          priceLabel: "7",
          priceValue: "-No change",
          detail: "Listing Issues",
          midRight: "4",
          footerLeft: "User Issues",
          footerRight: "3",
          statusText: "Reports",
          statusBg: "#FEE2E2",
          statusColor: "#DC2626",
        },
        {
          id: 5,
          subtitle: "Dealer Verification",
          priceLabel: "12",
          priceValue: "+2%",
          detail: "New Applications",
          midRight: "8",
          footerLeft: "Re-submissions",
          footerRight: "4",
          statusText: "Verification",
          statusBg: "#F3E8FF",
          statusColor: "#9333EA",
        },
        {
          id: 6,
          subtitle: "Support Requests",
          priceLabel: "34",
          priceValue: "+5%",
          detail: "High Priority",
          midRight: "6",
          footerLeft: "Priority",
          footerRight: "28",
          statusText: "Open",
          statusBg: "#E0E7FF",
          statusColor: "#4F46E5",
        },
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Spin
        tip="Loading Dashboard..."
        style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
      />
    );
  }

  if (!profileData) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="No dashboard data available" />
      </div>
    );
  }

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
        return ""; 
    }
  };

  const getPriceStyle = (priceValue) => {
  const num = parseFloat(priceValue.replace("%", "").replace("+", "").replace("-", ""));

  if (priceValue.includes("+") && num > 5) {
    return { color: "#16A34A", icon: "↑" }; 
  } else if ((priceValue.includes("+") && num <= 5)) {
    return { color: "#DC2626", icon: "↓" }; 
  } else {
    return { color: "#6B7280", icon: "" };
  }
  };


  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {profileData.map((item) => (
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
                <img
                 className="card-icon-dashboard"
                  src={getCardIcon(item.subtitle)}
                  alt={item.subtitle}
                />
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
              {item.priceLabel} {" "}
           <strong style={{ color: getPriceStyle(item.priceValue).color,fontSize:"12px",fontWeight:400 }}>
              {getPriceStyle(item.priceValue).icon} {item.priceValue}
          </strong>
          </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "4px 0",
              }}
            >
              <span style={{ fontSize: "13px", color: "High Priority",fontWeight:400 }}>{item.detail}</span>
              <span
                style={{
                  fontSize: "13px",
                  color: "#000000",
                  fontWeight:500,
                  whiteSpace: "nowrap",
                }}
              >
                {item.midRight}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
                color: "#4B5563",
                marginTop: "2px",
                fontWeight:400
              }}
            >
              <span>{item.footerLeft}</span>
              <span style={{ fontSize: "13px",fontWeight:500,
                color: "#000000",}}>{item.footerRight}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
