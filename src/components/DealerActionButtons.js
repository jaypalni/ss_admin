import { useState } from "react";
import { Button, Modal } from "antd";
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
  const [modalType, setModalType] = useState(null);

  const isBanned = dealerData?.status === "banned";
  const isFlagged = dealerData?.is_flagged === 1;
  const isVerified = dealerData?.is_verified === "verified";
  const isPending = dealerData?.is_verified === "pending";
  const isRejected = dealerData?.is_verified === "rejected";

  const isApproveRejectDisabled = isVerified  || isRejected;

  const getCommonButtonStyle = (color, isDisabledOverride = false) => ({
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

  const handleOk = () => {
    if (modalType === "approve") onApprove("verified");
    if (modalType === "reject") onReject("rejected");
    if (modalType === "flag") onFlag();
    if (modalType === "ban") onBan();
    setModalType(null);
  };

  const getModalMessage = () => {
    if (modalType === "approve") return "Do you want to approve this dealer?";
    if (modalType === "reject") return "Do you want to reject this application?";
    if (modalType === "flag")
      return isFlagged
        ? "Do you want to unflag this account?"
        : "Do you want to flag this account?";
    if (modalType === "ban")
      return isBanned
        ? "Do you want to unban this dealer?"
        : "Do you want to ban this dealer?";
    return "";
  };

  const buttons = [
    {
      key: "approve",
      text: "Approve Dealer",
      icon: <CheckOutlined style={{ color: "#FFFFFF" }} />,
      style: getCommonButtonStyle("#16A34A", isApproveRejectDisabled),
      onClick: () => setModalType("approve"),
      loading: loadingApprove,
      disabled: isApproveRejectDisabled,
    },
    {
      key: "reject",
      text: "Reject Application",
      icon: getIcon(reject_d, 10, 10, true),
      style: getCommonButtonStyle("#DC2626", isApproveRejectDisabled),
      onClick: () => setModalType("reject"),
      loading: loadingReject,
      disabled: isApproveRejectDisabled,
    },
    {
      key: "info",
      text: "Info Requested",
      icon: getIcon(info_d),
      style: getCommonButtonStyle("#EA580C"),
      onClick: undefined,
      loading: false,
      disabled: false,
    },
    {
      key: "flag",
      text: isFlagged ? "Unflag Account" : "Flag Account",
      icon: getIcon(flag_d, 12, 12, true),
      style: getCommonButtonStyle("#CA8A04"),
      onClick: () => setModalType("flag"),
      loading: loadingFlagged,
      disabled: false,
    },
    {
      key: "ban",
      text: isBanned ? "Unban Dealer" : "Ban Dealer",
      icon: getIcon(ban_d, 12, 12, true),
      style: getCommonButtonStyle("#1F2937"),
      onClick: () => setModalType("ban"),
      loading: loadingBanned,
      disabled: false,
    },
  ];

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginTop: "5px" }}>
        {buttons.map(({ key, text, icon, style, onClick, loading, disabled }) => (
          <Button
            key={key}
            icon={icon}
            style={style}
            disabled={disabled}
            onClick={onClick}
            loading={loading}
          >
            {text}
          </Button>
        ))}
      </div>

      <Modal
        title="Are you sure?"
        open={!!modalType}
        onOk={handleOk}
        onCancel={() => setModalType(null)}
        okText="Yes"
        cancelText="No"
      >
        {getModalMessage()}
      </Modal>
    </>
  );
};
