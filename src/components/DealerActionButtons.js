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
  onBan
}) => {
  const isDisabled = 
    dealerData?.status === "banned" ||
    dealerData?.is_verified === "verified" ||
    dealerData?.is_verified === "rejected";

  return (
    <div style={{ display: "flex", gap: 8, marginTop: "5px" }}>
      <Button
        type="primary"
        icon={<CheckOutlined style={{ color: "#FFFFFF" }} />}
        style={{
          borderRadius: 8,
          flex: 1,
          background: isDisabled ? "#D1D5DB" : "#16A34A",
          fontWeight: 500,
          fontSize: "12px",
          color: "#FFFFFF",
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
        disabled={isDisabled}
        onClick={isDisabled ? undefined : () => onApprove("verified")}
        loading={loadingApprove}
      >
        Approve Dealer
      </Button>

      <Button
        icon={
          <img
            src={reject_d}
            alt="reject"
            style={{ width: 10, height: 10, filter: "brightness(0) invert(1)" }}
          />
        }
        style={{
          borderRadius: 8,
          flex: 1,
          background: isDisabled ? "#D1D5DB" : "#DC2626",
          color: "#FFFFFF",
          fontWeight: 500,
          fontSize: "12px",
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
        disabled={isDisabled}
        onClick={isDisabled ? undefined : () => onReject("rejected")}
        loading={loadingReject}
      >
        Reject Application
      </Button>

      <Button
        type="primary"
        icon={<img src={info_d} alt="download" style={{ width: 12, height: 12 }} />}
        style={{ borderRadius: 8, flex: 1, background: "#EA580C", color: "white", fontWeight: 500, fontSize: "12px" }}
      >
        Info Requested
      </Button>

      <Button
        icon={
          <img
            src={flag_d}
            alt="flag"
            style={{
              width: 12,
              height: 12,
              filter: "brightness(0) invert(1)",
            }}
          />
        }
        style={{
          borderRadius: 8,
          flex: 1,
          background: dealerData?.status === "banned" ? "#D1D5DB" : "#CA8A04",
          color: "#FFFFFF",
          fontWeight: 500,
          fontSize: "12px",
          cursor: dealerData?.status === "banned" ? "not-allowed" : "pointer",
        }}
        disabled={dealerData?.status === "banned"}
        onClick={dealerData?.status === "banned" ? undefined : () => onFlag("")}
        loading={loadingFlagged}
      >
        Flag Account
      </Button>

      <Button
        icon={
          <img
            src={ban_d}
            alt="ban"
            style={{
              width: 12,
              height: 12,
              filter: dealerData?.status === "banned" ? "brightness(0) invert(1)" : "none",
            }}
          />
        }
        style={{
          borderRadius: 8,
          flex: 1,
          background: dealerData?.status === "banned" ? "#D1D5DB" : "#1F2937",
          color: "#FFFFFF",
          fontWeight: 500,
          fontSize: "12px",
          cursor: dealerData?.status === "banned" ? "not-allowed" : "pointer",
        }}
        disabled={dealerData?.status === "banned"}
        onClick={dealerData?.status === "banned" ? undefined : () => onBan()}
        loading={loadingBanned}
      >
        Ban Dealer
      </Button>
    </div>
  );
};
