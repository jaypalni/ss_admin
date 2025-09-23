import React from "react";
import activeIcon from "../assets/images/active-icon.png"; 
import pendingIcon from "../assets/images/pending-icon.png";
import soldIcon from "../assets/images/sold-icon.png";
import modelIcon from "../assets/images/model-icon.png";
import "../assets/styles/allcarsdashboard.css";

function AllCarsDashboard() {
  return (
    <div className="content-wrapper-allcardashboard">
      <div className="content-body">
        <div className="row">
          {/* Active Listings */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card dashboard-card">
              <div className="card-body dashboard-card-body">
                <div className="card-text-container">
                  <h5 className="card-title">Active Listings</h5>
                  <p className="card-number" style={{ color: '#16A34A'}}>142</p>
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
                  <h5 className="card-title">Pending Approval</h5>
                  <p className="card-number" style={{ color: '#CA8A04'}}>23</p>
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
                  <h5 className="card-title">Sold This Month</h5>
                  <p className="card-number" style={{ color: '#2563EB'}}>67</p>
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
                  <h5 className="card-title">Total Model</h5>
                  <p className="card-number-total" style={{ color: '#2563EB', font: '18px', fontWeight: '700'}}>Toyota Camry</p>
                   <p className="card-number-name" style={{ color: '#6B7280', font: '14px', fontWeight: '400', marginTop: '-10px', marginBottom: '-10px'}}>18 sales</p>
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
