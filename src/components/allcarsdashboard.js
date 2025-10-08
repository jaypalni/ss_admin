import React, { useEffect, useState } from "react";
import activeIcon from "../assets/images/active-icon.png"; 
import pendingIcon from "../assets/images/pending-icon.png";
import soldIcon from "../assets/images/sold-icon.png";
import modelIcon from "../assets/images/model-icon.png";
import "../assets/styles/allcarsdashboard.css";
import { userAPI } from "../services/api";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import { message, Spin, Tooltip } from "antd";

function AllCarsDashboard() {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
  
  dashboardcounts();

  // Set interval to call every 15 minutes (15 * 60 * 1000 ms)
  const interval = setInterval(() => {
    dashboardcounts();
  }, 15 * 60 * 1000);

  // Cleanup interval on unmount
  return () => clearInterval(interval);
}, []);

  // Dashboard Counts API

  const dashboardcounts = async () => {
    try {
      setLoading(true);
      const response = await userAPI.dashboardstats();
      const result = handleApiResponse(response);

      if (result?.data) {
        setDashboardData(result.data);
      }

    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({ type: "error", content: errorData });
    } finally {
      setLoading(false);
    }
  };

  // Show loader while fetching data
  if (loading || !dashboardData) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        {contextHolder}
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="content-wrapper-allcardashboard">
      <div className="content-body">
        <div className="row">
          {/* Active Listings */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card dashboard-card">
              <div className="card-body dashboard-card-body">
                <div className="card-text-container">
                  <h5 className="card-title-1">Active Listings</h5>
                  <p className="card-number" style={{ color: '#16A34A' }}>
                    {dashboardData.active_listings}
                  </p>
                </div>
                <div className="card-icon-wrapper" style={{ backgroundColor: "#DCFCE7" }}>
                  <img src={activeIcon} alt="Active Listings" className="card-icon" />
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approval */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card dashboard-card">
              <div className="card-body dashboard-card-body">
                <div className="card-text-container">
                  <h5 className="card-title-1">Pending Approval</h5>
                  <p className="card-number" style={{ color: '#CA8A04' }}>
                    {dashboardData.listings_pending_approval}
                  </p>
                </div>
                <div className="card-icon-wrapper" style={{ backgroundColor: "#FEF9C3" }}>
                  <img src={pendingIcon} alt="Pending Approval" className="card-icon" />
                </div>
              </div>
            </div>
          </div>

          {/* Sold This Month */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card dashboard-card">
              <div className="card-body dashboard-card-body">
                <div className="card-text-container">
                  <h5 className="card-title-1">Sold This Month</h5>
                  <p className="card-number" style={{ color: '#2563EB' }}>
                    {dashboardData.cars_sold_this_month}
                  </p>
                </div>
                <div className="card-icon-wrapper" style={{ backgroundColor: "#DBEAFE" }}>
                  <img src={soldIcon} alt="Sold This Month" className="card-icon" />
                </div>
              </div>
            </div>
          </div>

          {/* Total Model */}
          <div className="col-md-6 col-lg-3 mb-4">
  <div className="card dashboard-card">
    <div className="card-body dashboard-card-body">
      <div className="card-text-container">
        <h5 className="card-title-1">Total Model</h5>

        {/* Tooltip with ellipsis for long text */}
        <Tooltip title={dashboardData.model_name}>
          <p
            className="card-number-total"
            style={{
              color: '#2563EB',
              fontSize: '18px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '150px', // adjust width based on your card
              cursor: 'pointer',
              margin: 0,
            //   marginTop: "-12px",
            }}
          >
            {dashboardData.model_name}
          </p>
        </Tooltip>

        <p
          className="card-number-name"
          style={{
            color: '#6B7280',
            fontSize: '14px',
            fontWeight: '400',
            marginTop: '-1px',
            marginBottom: '-10px',
          }}
        >
          {dashboardData.top_selling_models_this_month} sales
        </p>
      </div>
      <div className="card-icon-wrapper" style={{ backgroundColor: "#DBEAFE" }}>
        <img src={modelIcon} alt="Total Model" className="card-icon" />
      </div>
    </div>
  </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AllCarsDashboard;
