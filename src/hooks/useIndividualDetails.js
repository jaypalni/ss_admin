import { useState, useEffect } from "react";
import { message } from "antd";
import { loginApi } from "../services/api";
import { handleApiResponse } from "../utils/apiUtils";

export const useIndividualDetails = (individualId, listingFilter, sortOrder, page, limit) => {
  const [dealerData, setDealerData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalListings, setTotalListings] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [messageApi] = message.useMessage();

  const apiFilterValue = (uiFilter) => {
    if (!uiFilter || uiFilter.toLowerCase() === "all") return "all";
    return uiFilter.toLowerCase();
  };

  const apiSortValue = (uiSort) => {
    return uiSort && uiSort.toLowerCase() === "oldest" ? "oldest" : "newest";
  };

  const fetchDealerDetails = async () => {
    if (!individualId) return;
    try {
      setLoading(true);
      const body = {
        filter: apiFilterValue(listingFilter),
        sort: apiSortValue(sortOrder),
        page: page,
        limit: limit,
      };

      const res = await loginApi.getallusersid(individualId, body);
      const payload = handleApiResponse(res.data);

      if (!payload) {
        messageApi.error(res?.data?.message || "Failed to fetch user details");
        setDealerData(null);
        setTableData([]);
        setTotalListings(0);
        return;
      }

      setDealerData(payload);

      const listingsRaw = Array.isArray(payload.listings) ? payload.listings : [];
      const normalized = listingsRaw.map((item, idx) => ({
        listingId: item.car_id ?? item.id ?? `generated-${idx}`,
        title: item.ad_title ?? item.title ?? "-",
        location: item.location ?? "-",
        status:
          (item.approval && String(item.approval).charAt(0).toUpperCase() + String(item.approval).slice(1)) ||
          "-",
        date: item.created_at ? item.created_at.split(" ").slice(1, 4).join(" ") : "-",
        price: item.price ? Number(item.price).toLocaleString() : "-",
        _raw: item,
      }));
      setTableData(normalized);

      const pagination = payload.listings_pagination;
      if (pagination) {
        setTotalListings(pagination.total ?? normalized.length);
      } else {
        setTotalListings(normalized.length);
      }

      setTotalActive(payload.active_cars ?? 0);
      setTotalSold(payload.sold_cars ?? 0);
      setTotalRejected(payload.rejected_cars ?? 0);
    } catch (err) {
      console.error("fetchDealerDetails error:", err);
      const errorMessage =
        err?.response?.data?.message || err?.message || "Something went wrong while fetching user details";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealerDetails();
  }, [individualId, listingFilter, sortOrder, page, limit]);

  return {
    dealerData,
    tableData,
    loading,
    totalListings,
    totalActive,
    totalSold,
    totalRejected,
    messageApi,
    refetch: fetchDealerDetails
  };
};
