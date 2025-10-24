import React from "react";
import { Card, Row, Col, Tag } from "antd";
import Dealer from "../assets/images/img.svg";

export const DealerProfileInfo = ({ dealerData }) => {
  const BASE_URL = process.env.REACT_APP_API_URL;

  return (
    <Row gutter={24}>
      <Col xs={24} md={16}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <img
                src={`${BASE_URL}${dealerData.profile_pic}`}
                alt="Dealer Logo"
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 8,
                  objectFit: "cover",
                  flex: "0 0 35px",
                }}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = Dealer;  
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
                  {dealerData.company_name || "N/A"}
                </h3>
                <h6 style={{ margin: 0, marginTop: 4, fontSize: "14px", fontWeight: 400, color: "#4B5563" }}>
                  Dealer ID: #{dealerData.user_id ?? "N/A"}
                </h6>
              </div>
            </div>

            <div style={{ marginBottom: 8, marginTop: 18 }}>
              <strong style={{ display: "block", marginBottom: 4, color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                Owner's Name
              </strong>
              <span>{dealerData.owner_name || "N/A"}</span>
            </div>

            <div style={{ marginBottom: 8 }}>
              <strong style={{ display: "block", marginBottom: 4, color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                Email Address
              </strong>
              <span style={{ wordBreak: "break-word" }}>{dealerData.email || "N/A"}</span>
            </div>

            <div style={{ marginBottom: 8 }}>
              <strong style={{ display: "block", marginBottom: 4, color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                Phone Number
              </strong>
              <span>{dealerData.phone_number || "N/A"}</span>
            </div>

            <div style={{ marginBottom: 8 }}>
              <strong style={{ display: "block", marginBottom: 4, color: "#374151", fontSize: "14px", fontWeight: 500 }}>
                Registered Since
              </strong>
              <span>{dealerData.created_at ? dealerData.created_at.split(" ").slice(1, 4).join(" ") : "N/A"}</span>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: 6 }}>
              <div style={{ display: "", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 500 }}>Account Status</div>
                <div>
                  <Tag
                    style={{
                      background: dealerData?.status === "banned" ? "#FEE2E2" : "#DCFCE7",
                      color: dealerData?.status === "banned" ? "#991B1B" : "#166534",
                      borderRadius: 8,
                      padding: "4px 12px",
                      fontWeight: 500,
                    }}
                  >
                    {dealerData?.status === "banned" ? "Banned" : dealerData?.is_verified === "verified" ? "Verified" : "Pending Verification"}
                  </Tag>
                </div>
              </div>

              <div style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Verification Submitted On</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{dealerData.created_at ? dealerData.created_at.split(" ").slice(1, 4).join(" ") : "N/A"}</div>
            </div>
          </Col>
        </Row>
      </Col>

      <Col xs={24} md={8} style={{ paddingLeft: 12 }}>
        <div style={{ position: "sticky", top: 24 }}>
          <Card style={{ marginBottom: 16, backgroundColor: "#E6F4FC" }}>
            <h3 style={{ marginBottom: 16, fontSize: "16px", fontWeight: "600" }}>Subscription Package</h3>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ marginRight: 6, fontWeight: 500, color: "#4B5563" }}>Current Plan</span>
              <span style={{ 
                backgroundColor: "#008AD5",
                color: "#FFFFFF",
                borderRadius: "22px",
                padding: "2px 8px",
                fontWeight: 500,
                fontSize: "12px"
              }}>
                {dealerData.subscription_details?.plan_name ?? "N/A"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Monthly Fee</span>
              <span style={{ wordBreak: "break-word", overflowWrap: "anywhere", fontWeight: 500, color: "#111827" }}>
                {dealerData.subscription_details?.price ? `${dealerData.subscription_details.price} ${dealerData.subscription_details.currency ?? ""}` : "N/A"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Listing Limit</span>
              <span style={{ wordBreak: "break-word", overflowWrap: "anywhere", fontWeight: 500, color: "#111827" }}>
                {dealerData.subscription_details?.listing_limit ?? "N/A"}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Featured Listings</span>
              <span style={{ wordBreak: "break-word", overflowWrap: "anywhere", fontWeight: 500, color: "#111827" }}>
                10 per month
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ marginRight: 6, fontWeight: 400, color: "#4B5563" }}>Next Payment</span>
              <span style={{ wordBreak: "break-word", overflowWrap: "anywhere", fontWeight: 500, color: "#111827" }}>
                {dealerData.subscription_details?.end_date ? dealerData.subscription_details.end_date.split(" ").slice(0, 4).join(" ") : "N/A"}
              </span>
            </div>
          </Card>
        </div>
      </Col>
    </Row>
  );
};
