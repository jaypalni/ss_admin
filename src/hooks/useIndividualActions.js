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
      const body = {
        report_id: dealerData.user_id,
      };
      const res = await loginApi.reporteduser(body);
      const data = res?.data;
      if (data?.status_code === 200) {
        messageApi.success(data?.message || "User reported successfully");
        navigate("/user-management/individual")
      } else {
        messageApi.error(data?.message || data?.error || "Failed to report user");
      }
    } catch (err) {
      console.error("reportedUser error:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "Something went wrong while reporting user";
      messageApi.error(errorMessage);
    } finally {
      setLoadingFlagged(false);
    }
  };

  const bannedDealer = async () => {
    if (!dealerData) return;
    try {
      setLoadingBanned(true);
      const body = {
        user_id: dealerData.user_id,
      };
      const res = await loginApi.banneduser(body);
      const data = res?.data;
      if (data?.status_code === 200) {
        messageApi.success(data?.message || "User banned successfully");
        navigate("/user-management/individual")
      } else {
        messageApi.error(data?.message || data?.error || "Failed to ban user");
      }
    } catch (err) {
      console.error("bannedDealer error:", err);
      const errorMessage =
        err?.response?.data?.message || err?.response?.data?.error || err?.message || "Something went wrong while banning user";
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
    bannedDealer
  };
};
