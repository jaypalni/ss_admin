import React from "react";
import { Button, Avatar, Tag, Popconfirm } from "antd";
import { FlagOutlined, StopOutlined } from "@ant-design/icons";
import avatarFallback from "../assets/images/icon_img.svg";
import premimum_d from "../assets/images/premimum_d.svg";

const StatusTag = ({ status }) => {
  const statusColors = {
    banned: { bg: "#FECACA", color: "#B91C1C" },
    active: { bg: "#DCFCE7", color: "#166534" },
    pending: { bg: "#FEF9C3", color: "#854D0E" },
  };
  const current = statusColors[status] || statusColors.pending;

  return (
    <Tag
      style={{
        borderRadius: 999,
        padding: "6px 10px",
        fontSize: 12,
        fontWeight: 600,
        background: current.bg,
        color: current.color,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: current.color,
          display: "inline-block",
          marginRight: 4,
        }}
      />
      {status === "banned" ? "Banned" : status === "active" ? "Active" : "Pending"}
    </Tag>
  );
};

const ActionButtons = ({ onReportUser, onBanUser, loadingFlagged, loadingBanned, isFlagged }) => (
  <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
    
    <Popconfirm
      title={isFlagged ? "Unflag this user?" : "Flag this user?"}
      okText="Yes"
      cancelText="No"
      onConfirm={onReportUser}
    >
      <Button
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
          <span style={{ fontSize: 12 }}>{isFlagged ? "Unflag" : "Flag"}</span>
          <span style={{ fontSize: 12 }}>User</span>
        </div>
      </Button>
    </Popconfirm>

    <Popconfirm
      title="Ban this user?"
      okText="Yes"
      cancelText="No"
      onConfirm={onBanUser}
    >
      <Button
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
    </Popconfirm>

  </div>
);

export const IndividualProfileHeader = ({
  dealerData,
  avatarSrc,
  setAvatarSrc,
  onReportUser,
  onBanUser,
  loadingFlagged,
  loadingBanned,
}) => {
  const nameStyle = { margin: 0, fontSize: 20, fontWeight: 700, color: "#0F172A", lineHeight: 1 };
  const metaKeyStyle = { color: "#6B7280", fontSize: 13, marginRight: 8 };
  const metaValueStyle = { color: "#111827", fontSize: 13, fontWeight: 500 };

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 8,
        padding: "22px 24px",
        boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
        display: "flex",
        alignItems: "center",
        maxWidth: 1200,
        margin: "0 auto 24px",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 12,
          overflow: "hidden",
          marginRight:10,
          background: "white" 
        }}
      >
        {avatarSrc && (
          <Avatar
            size={64}
            src={avatarSrc}
            shape="square"
            onError={() => {
              setAvatarSrc(""); 
              return false;
            }}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>

      <div style={{flex:"1 1 auto", minWidth: 0 }}>
        <h2 style={nameStyle}>{dealerData.full_name || "N/A"}</h2>

        {/* ROW 1 */}
        <div style={{ display: "flex", gap: 32, marginTop: 8 }}>
          <div style={{ width: 200 }}>
            <div style={metaKeyStyle}>Email:</div>
            <div style={metaValueStyle}>{dealerData.email || "-"}</div>
          </div>

          <div style={{ width: 150 }}>
            <div style={metaKeyStyle}>Phone:</div>
            <div style={metaValueStyle}>{dealerData.phone_number || "-"}</div>
          </div>

          <div style={{ width: 100 }}>
            <div style={metaKeyStyle}>User Id:</div>
            <div style={metaValueStyle}>#{dealerData.user_id ?? "-"}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, marginTop: 8 }}>
          <div style={{ width: 200 }}>
            <span style={metaKeyStyle}>Registered At: </span>
            <span style={metaValueStyle}>
              {dealerData.registered_at
                ? new Date(dealerData.registered_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "-"
              }
            </span>
          </div>

          <div style={{ width: 150 }}>
            <span style={metaKeyStyle}>Subscription Plan: </span>
            <span style={metaValueStyle}>{dealerData.subscription_plan_name || "-"}</span>
          </div>

          <div style={{ width: 100 }}>
            <span style={metaKeyStyle}>Expires At: </span>
            <span style={metaValueStyle}>{dealerData.subscription_expires_at || "-"}</span>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
          <StatusTag status={dealerData.status} />

          {dealerData.subscription_details?.plan_name && (
            <Tag
              style={{
                borderRadius: 999,
                padding: "6px 10px",
                fontSize: 12,
                fontWeight: 600,
                background: "#DBEAFE",
                color: "#1E40AF",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <img src={premimum_d} alt="plan icon" style={{ width: 14, height: 14, objectFit: "contain" }} />
              {dealerData.subscription_details?.plan_name}
            </Tag>
          )}
        </div>
      </div>

      {dealerData.status === "banned" ? (
        <Popconfirm
          title="Unban this user?"
          okText="Yes"
          cancelText="No"
          onConfirm={onBanUser}
        >
          <Button
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
              <span style={{ fontSize: 12 }}>Unban</span>
              <span style={{ fontSize: 12 }}>User</span>
            </div>
          </Button>
        </Popconfirm>
      ) : (
        <ActionButtons
          onReportUser={onReportUser}
          onBanUser={onBanUser}
          loadingFlagged={loadingFlagged}
          loadingBanned={loadingBanned}
          isFlagged={dealerData.is_flagged === 1}
        />
      )}
    </div>
  );
};
