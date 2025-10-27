import React from "react";
import activeIcon from "../assets/images/total.svg";
import pendingIcon from "../assets/images/active-icon.png";
import soldIcon from "../assets/images/sold-icon.png";
import modelIcon from "../assets/images/reject.svg";

const getCardColors = (title) => {
  switch (title) {
    case "Total Listings":
      return { bgColor: "#EFF6FF", titleColor: "#6B7280", titleNumber: "#111827" };
    case "Active Listings":
      return { bgColor: "#F0FDF4", titleColor: "#6B7280", titleNumber: "#16A34A" };
    case "Sold Listings":
      return { bgColor: "#FAF5FF", titleColor: "#6B7280", titleNumber: "#2563EB" };
    case "Rejected Listings":
      return { bgColor: "#FEF2F2", titleColor: "#6B7280", titleNumber: "#DC2626" };
    default:
      return { bgColor: "#F3F4F6", titleColor: "#6B7280", titleNumber: "#111827" };
  }
};

export const IndividualSummaryCards = ({ dealerData, totalListings, totalActive, totalSold, totalRejected }) => {
  const cards = [
    {
      title: "Total Listings",
      number: dealerData?.total_cars ?? totalListings ?? 0,
      icon: activeIcon,
      ...getCardColors("Total Listings"),
    },
    {
      title: "Active Listings",
      number: dealerData?.active_cars ?? totalActive ?? 0,
      icon: pendingIcon,
      ...getCardColors("Active Listings"),
    },
    {
      title: "Sold Listings",
      number: dealerData?.sold_cars ?? totalSold ?? 0,
      icon: soldIcon,
      ...getCardColors("Sold Listings"),
    },
    {
      title: "Rejected Listings",
      number: dealerData?.rejected_cars ?? totalRejected ?? 0,
      icon: modelIcon,
      ...getCardColors("Rejected Listings"),
    },
  ];

  return (
    <div className="content-body">
      <div className="row">
        {cards.map((card, idx) => (
          <div key={idx} className="col-md-6 col-lg-3 mb-4">
            <div className="card dashboard-card">
              <div className="card-body dashboard-card-body">
                <div className="card-text-container">
                  <h5 className="card-individual-title" style={{ color: card.titleColor }}>{card.title}</h5>
                  <p className="card-individual-number" style={{ color: card.titleNumber, fontWeight: 700 }}>{card.number}</p>
                </div>
                <div className="card-icon-individual-wrapper" >
                  <img src={card.icon} alt={card.title} className="card-individual-icon" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
