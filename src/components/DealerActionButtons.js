import React from "react";
import { Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import reject_d from "../assets/images/reject_d.svg";
import info_d from "../assets/images/info_d.svg";
import ban_d from "../assets/images/ban_d.svg";
import flag_d from "../assets/images/flag_d.svg";

export const DealerActionButtons = ({
  dealerData,
  loadingApprove,
  loadingReject,
  loadingFlagged,
  loadingBanned,
  onApprove,
  onReject,
  onFlag,
  onBan,
}) => {
  const isBanned = dealerData?.status === "banned";
  const isVerified = dealerData?.is_verified === "verified";
  const isRejected = dealerData?.is_verified === "rejected";
  const isDisabled = isBanned || isVerified || isRejected;

  const getCommonButtonStyle = (color, isDisabledOverride = isDisabled) => ({
    borderRadius: 8,
    flex: 1,
    background: isDisabledOverride ? "#D1D5DB" : color,
    color: "#FFFFFF",
    fontWeight: 500,
    fontSize: "12px",
    cursor: isDisabledOverride ? "not-allowed" : "pointer",
  });

  const getIcon = (src, width = 12, height = 12, invert = false) => (
    <img
      src={src}
      alt="icon"
      style={{
        width,
        height,
        filter: invert ? "brightness(0) invert(1)" : "none",
      }}
    />
  );

  const buttons = [
    {
      key: "approve",
      text: "Approve Dealer",
      icon: <CheckOutlined style={{ color: "#FFFFFF" }} />,
      style: getCommonButtonStyle("#16A34A"),
      onClick: () => onApprove("verified"),
      loading: loadingApprove,
      disabled: isDisabled,
    },
    {
      key: "reject",
      text: "Reject Application",
      icon: getIcon(reject_d, 10, 10, true),
      style: getCommonButtonStyle("#DC2626"),
      onClick: () => onReject("rejected"),
      loading: loadingReject,
      disabled: isDisabled,
    },
    {
      key: "info",
      text: "Info Requested",
      icon: getIcon(info_d),
      style: getCommonButtonStyle("#EA580C", false),
      onClick: undefined,
      loading: false,
      disabled: false,
    },
    {
      key: "flag",
      text: "Flag Account",
      icon: getIcon(flag_d, 12, 12, true),
      style: getCommonButtonStyle("#CA8A04", isBanned),
      onClick: () => onFlag(""),
      loading: loadingFlagged,
      disabled: isBanned,
    },
    {
      key: "ban",
      text: "Ban Dealer",
      icon: getIcon(ban_d, 12, 12, isBanned),
      style: getCommonButtonStyle("#1F2937", isBanned),
      onClick: () => onBan(),
      loading: loadingBanned,
      disabled: isBanned,
    },
  ];

  return (
    <div style={{ display: "flex", gap: 8, marginTop: "5px" }}>
      {buttons.map(
        ({ key, text, icon, style, onClick, loading, disabled }) => (
          <Button
            key={key}
            icon={icon}
            style={style}
            disabled={disabled}
            onClick={disabled || !onClick ? undefined : onClick}
            loading={loading}
          >
            {text}
          </Button>
        )
      )}
    </div>
  );
};
