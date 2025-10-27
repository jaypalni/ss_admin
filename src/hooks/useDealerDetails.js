import { useState, useEffect } from "react";
import { message } from "antd";
import { loginApi } from "../services/api";
import { handleApiResponse } from "../utils/apiUtils";

export const useDealerDetails = (dealerId, listingFilter, sortOrder, page, limit) => {
  const [dealerData, setDealerData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalListings, setTotalListings] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [messageApi] = message.useMessage();

  const fetchDealerDetails = async () => {
    try {
      setLoading(true);

      const body = {
        filter: listingFilter.toLowerCase(),
        sort: sortOrder,
        page: page,
        limit: limit,
      };

      const res = await loginApi.getallusersid(dealerId, body);
      const payload = handleApiResponse(res.data);

      if (!payload) {
        messageApi.error(res?.data?.message || "Failed to fetch dealer details");
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
        status: item.approval ?? item.status ?? "-",
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
      messageApi.error(err?.message || "Something went wrong while fetching dealer details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!dealerId) return;
    fetchDealerDetails();
  }, [dealerId, listingFilter, sortOrder, page, limit]);

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
