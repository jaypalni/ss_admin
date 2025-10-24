import React from "react";
import { Button, Avatar, Tag } from "antd";
import { FlagOutlined, StopOutlined } from "@ant-design/icons";
import avatarFallback from "../assets/images/icon_img.svg";
import premimum_d from "../assets/images/premimum_d.svg";

export const IndividualProfileHeader = ({ dealerData, avatarSrc, setAvatarSrc, onReportUser, onBanUser, loadingFlagged, loadingBanned }) => {
  const containerStyle = {
    background: "#ffffff",
    borderRadius: 8,
    padding: "22px 24px",
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
    display: "flex",
    alignItems: "center",
    gap: 24,
    maxWidth: 1200,
    margin: "0 auto 24px",
  };

  const leftStyle = { display: "flex", alignItems: "center", gap: 16, flex: "0 0 auto" };
  const nameStyle = { margin: 0, fontSize: 20, fontWeight: 700, color: "#0F172A", lineHeight: 1 };
  const metaKeyStyle = { color: "#6B7280", fontSize: 13, marginRight: 8 };
  const metaValueStyle = { color: "#111827", fontSize: 13, fontWeight: 500 };
  const pillStyle = { borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 8 };
  const rightActionsStyle = { marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" };

  return (
    <div style={containerStyle}>
      <div style={leftStyle}>
        <Avatar
          size={64}
          src={avatarSrc}
          style={{ borderRadius: 12 }}
          onError={() => {
            setAvatarSrc(avatarFallback);
            return true;
          }}
        />
      </div>

      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div style={{ minWidth: 0 }}>
            <h2 style={nameStyle}>{dealerData.full_name || "N/A"}</h2>

            <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 8 }}>
              <div style={{width:140}}>
                <div style={metaKeyStyle}>Email:</div>
                <div style={metaValueStyle}>{dealerData.email || "-"}</div>
              </div>

              <div>
                <div style={metaKeyStyle}>
                  <span style={{ color: "#64748B" }}>Phone:</span>{" "}
                  <span style={{ color: "#0F172A", fontWeight: 600 }}>{dealerData.phone_number || "-"}</span>
                </div>
              </div>

              <div style={{marginLeft:18}}>
                <div style={metaKeyStyle}>
                  <span style={{ color: "#64748B" }}>User ID:</span>{" "}
                  <span style={{ color: "#0F172A", fontWeight: 600 }}>#{dealerData.user_id ?? "-"}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 24, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ color: "#6B7280", fontSize: 13 }}>Registered:</div>
                <div style={{ ...metaValueStyle, fontWeight: 600 }}>
                  {dealerData.registered_at ? dealerData.registered_at.split(" ").slice(1, 4).join(" ") : (dealerData.created_at ? dealerData.created_at.split(" ").slice(1,4).join(" ") : "-")}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ color: "#6B7280", fontSize: 13 }}>Subscription:</div>
                <div style={{ ...metaValueStyle, fontWeight: 600 }}>{dealerData.subscription_details?.plan_name ?? dealerData.subscription_plan_name ?? "-"}</div>
              </div>

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ color: "#6B7280", fontSize: 13 }}>Expires:</div>
                <div style={{ ...metaValueStyle, fontWeight: 600 }}>
                  {dealerData.subscription_details?.end_date ? dealerData.subscription_details.end_date.split(" ").slice(1, 4).join(" ") : (dealerData.subscription_expires_at ? dealerData.subscription_expires_at.split(" ").slice(1,4).join(" ") : "-")}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
              <Tag
                style={{
                  ...pillStyle,
                  background:
                    dealerData.status === "banned"
                      ? "#FECACA"
                      : dealerData.status === "active"
                      ? "#DCFCE7"
                      : "#FEF9C3",
                  color:
                    dealerData.status === "banned"
                      ? "#B91C1C"
                      : dealerData.status === "active"
                      ? "#166534"
                      : "#854D0E",
                  paddingLeft: 10,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background:
                      dealerData.status === "banned"
                        ? "#B91C1C"
                        : dealerData.status === "active"
                        ? "#166534"
                        : "#854D0E",
                    display: "inline-block",
                    marginRight: 4,
                  }}
                />
                {dealerData.status === "banned" ? "Banned" : dealerData.status === "active" ? "Active" : dealerData.status ?? "Pending"}
              </Tag>
               
              {dealerData.subscription_details?.plan_name && (
                <Tag style={{ ...pillStyle, background: "#DBEAFE", color: "#1E40AF" }}>
                  <img
                    src={premimum_d}
                    alt="plan icon"
                    style={{
                      width: 14,
                      height: 14,
                      display: "inline-block",
                      objectFit: "contain",
                    }}
                  />
                  {dealerData.subscription_details?.plan_name ?? ""}
                </Tag>
              )}
            </div>
          </div>
        </div>
      </div>

      {dealerData.status !== "banned" && (
        <div style={rightActionsStyle}>
          <Button
            onClick={onReportUser}
            loading={loadingFlagged}
            style={{
              background: "#FEF9C3",
              borderColor: "#FEF9C3",
              color: "#854D0E",
              fontWeight: 400,
              width: 100,
              height: 60,
              borderRadius: 8,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <FlagOutlined style={{ fontSize: 18 }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontSize: 12 }}>Flag</span>
              <span style={{ fontSize: 12 }}>User</span>
            </div>
          </Button>

          <Button
            onClick={onBanUser}
            loading={loadingBanned}
            style={{
              background: "#FEE2E2",
              borderColor: "#FEE2E2",
              color: "#991B1B",
              fontWeight: 400,
              width: 100,
              height: 60,
              borderRadius: 8,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <StopOutlined style={{ fontSize: 14 }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontSize: 12 }}>Ban</span>
              <span style={{ fontSize: 12 }}>User</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
};
