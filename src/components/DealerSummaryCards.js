import React from "react";
import { Card, Row, Col } from "antd";
import activeIcon from "../assets/images/total_icon_1.svg";
import pendingIcon from "../assets/images/sold-icon.svg";
import soldIcon from "../assets/images/pending_icon.svg";
import modelIcon from "../assets/images/reject_icon_1.svg";

const getCardColors = (title) => {
  switch (title) {
    case "Total Listings":
      return { bgColor: "#EFF6FF", titleColor: "#2563EB", titleNumber: "#1E3A8A" }; 
    case "Active Listings":
      return { bgColor: "#F0FDF4", titleColor: "#16A34A", titleNumber: "#14532D" }; 
    case "Sold Listings":
      return { bgColor: "#FAF5FF", titleColor: "#581C87", titleNumber: "#581C87" }; 
    case "Rejected Listings":
      return { bgColor: "#FEF2F2", titleColor: "#DC2626", titleNumber: "#7F1D1D" }; 
    default:
      return { bgColor: "#F3F4F6", titleColor: "#111827", titleNumber: "#1E3A8A" }; 
  }
};

export const DealerSummaryCards = ({ dealerData, totalListings, totalActive, totalSold, totalRejected }) => {
  const cards = [
    {
      title: "Total Listings",
      number: dealerData.total_cars ?? totalListings ?? 0,
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
    <div style={{ overflowX: "auto", scrollbarWidth: "none", paddingBottom: 8, marginBottom: 2 }}>
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
  );
};
