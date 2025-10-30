import { useState } from "react";
import { message } from "antd";
import { loginApi } from "../services/api";

export const useIndividualActions = (dealerData, navigate) => {
  const [loadingFlagged, setLoadingFlagged] = useState(false);
  const [loadingBanned, setLoadingBanned] = useState(false);
  const [messageApi] = message.useMessage();

const reportedUser = async () => {
  if (!dealerData) return;

  try {
    setLoadingFlagged(true);

    const isCurrentlyFlagged = dealerData.is_flagged === 1; 
    const body = { report_id: dealerData.user_id };

    const res = isCurrentlyFlagged
      ? await loginApi.unflaggeduser(dealerData.user_id) 
      : await loginApi.reporteduser(body); 
    const data = res?.data;

    if (data?.status_code === 200) {
      messageApi.success(
        data?.message ||
          (isCurrentlyFlagged
            ? "User unflagged successfully"
            : "User flagged successfully")
      );
      setTimeout(() => navigate("/user-management/individual"), 1000);
    } else {
      messageApi.error(data?.message || data?.error || "Failed to update user flag status");
    }
  } catch (err) {
    console.error("reportedUser error:", err);
    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong while updating user flag status";
    messageApi.error(errorMessage);
  } finally {
    setLoadingFlagged(false);
  }
};


  const bannedDealer = async () => {
    if (!dealerData) return;
    try {
      setLoadingBanned(true);

      const isCurrentlyBanned = dealerData.status === "banned";
      const body = { user_id: dealerData.user_id };

      const res = isCurrentlyBanned
        ? await loginApi.unbanneduser(dealerData.user_id) 
        : await loginApi.banneduser(body); 

      const data = res?.data;

      if (data?.status_code === 200) {
        messageApi.success(
          data?.message ||
            (isCurrentlyBanned
              ? "User unbanned successfully"
              : "User banned successfully")
        );
         setTimeout(() => {
        navigate("/user-management/individual");
      }, 1200);
      } else {
        messageApi.error(data?.message || data?.error || "Failed to update user status");
      }
    } catch (err) {
      console.error("bannedDealer error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong while updating user status";
      messageApi.error(errorMessage);
    } finally {
      setLoadingBanned(false);
    }
  };

  return {
    loadingFlagged,
    loadingBanned,
    messageApi,
    reportedUser,
    bannedDealer,
  };
};

