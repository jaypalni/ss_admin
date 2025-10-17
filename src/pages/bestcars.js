import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, userAPI } from "../services/api";
import { Row, Col } from "react-bootstrap";
import {
  Card,
  Tag,
  Input,
  Select,
  Divider,
  Pagination,
  Switch,
  message,
  Tooltip,
  Checkbox,
  Modal,
  Spin
} from "antd";
import "../assets/styles/bestcars.css";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import { useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const getStatusLabel = (approval, status) => {
  const approvalVal = (approval ?? "").toString().toLowerCase();
  if (approvalVal === "approved") return "Active";
  if (approvalVal === "pending") return "Pending";
  return status ?? "N/A";
};

const getStatusColors = (statusLabel) => {
  const statusLower = statusLabel.toString().toLowerCase();
  
  if (statusLower === "active") {
    return { statusColor: "#DCFCE7", statusTextColor: "#166534" };
  }
  if (statusLower === "pending" || statusLower === "unsold") {
    return { statusColor: "#FEF3C7", statusTextColor: "#92400E" };
  }
  return { statusColor: "#DCFCE7", statusTextColor: "#166534" };
};

const getPremiumBadge = (item) => {
  if (item.is_featured) {
    return {
      premium: "Featured",
      premiumColor: "#E0F2FE",
      premiumTextColor: "#1E40AF",
    };
  }
  if (item.is_best_pick) {
    return {
      premium: "Best Pick",
      premiumColor: "#FEF3C7",
      premiumTextColor: "#EA580C",
    };
  }
  return {
    premium: item.badges ?? "",
    premiumColor: "#F3F4F6",
    premiumTextColor: "#374151",
  };
};

const formatSellerInfo = (userDetails) => {
  const sellerFirst = userDetails?.first_name ?? "";
  const sellerLast = userDetails?.last_name ?? "";
  const sellerName = `${sellerFirst} ${sellerLast}`.trim();
  const sellerCity = userDetails?.location && userDetails.location !== "" ? userDetails.location : "NA";
  
  return { sellerName, sellerCity };
};

const safeParseNumber = (value, fallback = 0) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return fallback;
};

const extractBestPicksTotal = (data) => {
  if (typeof data.best_pick === "number") {
    return { total: data.best_pick, isGlobal: true };
  }
  if (typeof data.total_best_picks === "number") {
    return { total: data.total_best_picks, isGlobal: true };
  }
  if (typeof data.total_best === "number") {
    return { total: data.total_best, isGlobal: true };
  }
  
  const pageBestCount = (data.data || []).reduce(
    (acc, it) => acc + (Number(it.is_best_pick ?? 0) ? 1 : 0),
    0
  );
  return { total: pageBestCount, isGlobal: false };
};

const extractPaginationTotal = (data) => {
  const apiTotalCars = safeParseNumber(data.total_cars, undefined);
  
  const paginationTotal =
    safeParseNumber(data.pagination?.total, undefined) ??
    safeParseNumber(data.pagination?.total_cars, undefined) ??
    apiTotalCars ??
    0;
  
  return { apiTotalCars, paginationTotal };
};

const updateCarBestPick = (cars, carId, bestPickValue) => {
  return cars.map((c) => (c.id === carId ? { ...c, bestPick: bestPickValue } : c));
};

const updateBestPicksCount = (currentTotal, newValue, isGlobal) => {
  if (isGlobal) return currentTotal;
  return newValue ? currentTotal + 1 : Math.max(0, currentTotal - 1);
};

const rollbackBestPicksCount = (currentTotal, newValue, isGlobal) => {
  if (isGlobal) return currentTotal;
  return newValue ? Math.max(0, currentTotal - 1) : currentTotal + 1;
};

const isApiResponseSuccessful = (data) => {
  return data && (data.status_code === 200 || data.success === true);
};

function BestCars() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [headerChecked, setHeaderChecked] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [totalCars, setTotalCars] = useState(0);
  const [cars, setCars] = useState([]);
  const [makes, setMakes] = useState([]);

  const [bestPicksTotal, setBestPicksTotal] = useState(0);
  const [bestPicksIsGlobal, setBestPicksIsGlobal] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);

  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = token && user;
  useEffect(() => {
    if (!isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const buildImageUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    const base = process.env.REACT_APP_API_URL || window.location.origin;
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  };

const handleHeaderCheckboxChange = (e) => {
    const checked = e.target.checked;

    if (cars.length === 0) return;

    Modal.confirm({
      title: "Confirm",
      content: checked
        ? "Do you want to select all cars?"
        : "Do you want to deselect all cars?",
      okText: "Yes",
      cancelText: "No",
      onOk() {
        if (checked) {
          setSelectedIds(cars.map((c) => c.id));
        } else {
          setSelectedIds([]);
        }
        setHeaderChecked(checked);
      },
      onCancel() {
        setHeaderChecked((prev) => !prev);
      },
    });
  };

useEffect(() => {
  if (selectedIds.length === cars.length && cars.length > 0) {
    setHeaderChecked(true);
  } else {
    setHeaderChecked(false);
  }
}, [selectedIds, cars]);


  const mapApiItemToCar = (item) => {
    const { sellerName, sellerCity } = formatSellerInfo(item.user_details);
    const statusLabel = getStatusLabel(item.approval, item.status);
    const { statusColor, statusTextColor } = getStatusColors(statusLabel);
    const premiumBadge = getPremiumBadge(item);

    const details = [
      `${item.make ?? ""} ${item.model ?? ""}`.trim(),
      item.transmission_type,
      item.kilometers ? `${Number(item.kilometers).toLocaleString()} km` : null,
      item.location,
    ]
      .filter(Boolean)
      .join(" • ");

    const price = item.price
      ? `IQD ${Number(item.price).toLocaleString()}`
      : "N/A";

    return {
      id: item.id,
      image: buildImageUrl(item.car_image || item.image),
      makeModel: `${item.ad_title ?? ""}`.trim(),
      details,
      price,
      status: statusLabel,
      statusColor,
      statusTextColor,
      ...premiumBadge,
      qualityScore: item.quality_score ?? (item.views ? Math.min(10, Math.round(item.views / 200)) : 7),
      views: item.views ?? 0,
      bestPick: Boolean(Number(item.is_best_pick ?? 0)),
      sellerName,
      sellerCity,
      raw: item,
    };
  };

  const fetchMakeData = async () => {
    try {
      const res = await loginApi.makedata();
      const data = handleApiResponse(res);
      if (data?.data && Array.isArray(data.data)) {
        const normalized = data.data.map((m) => ({ id: m.id, name: m.name ?? String(m.id) }));
        setMakes(normalized);
      } else {
        setMakes([]);
      }
    } catch (err) {
      const errData = handleApiError(err);
      console.error("fetchMakeData error", errData);
    }
  };

  const fetchBestCarsData = async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);

      const payload = {
        make: filters.make ?? "",
        search_query: filters.search ?? "",
        page,
        limit,
      };

      const response = await loginApi.bestcarpick(payload);
      const data = handleApiResponse(response);

      if (data?.data && Array.isArray(data.data)) {
        const mapped = data.data.map(mapApiItemToCar);
        setCars(mapped);

        const { apiTotalCars, paginationTotal } = extractPaginationTotal(data);
        setTotalCars(apiTotalCars ?? paginationTotal);

        const p = data.pagination || {};
        setPagination({
          current: p.page ?? p.current ?? page,
          pageSize: p.limit ?? limit,
          total: paginationTotal,
        });

        const bestPicksData = extractBestPicksTotal(data);
        setBestPicksTotal(bestPicksData.total);
        setBestPicksIsGlobal(bestPicksData.isGlobal);
      } else {
        setCars([]);
        const p = data.pagination || {};
        const pageTotal = safeParseNumber(p.total, 0);
        setPagination((prev) => ({ ...prev, total: pageTotal }));
        setTotalCars(safeParseNumber(data.total_cars, pageTotal));
        setBestPicksTotal(safeParseNumber(data.best_pick, 0));
        setBestPicksIsGlobal(typeof data.best_pick === "number");
      }
    } catch (err) {
      const errorData = handleApiError(err);
      messageApi.open({
        type: "error",
        content: errorData?.message || "Failed to fetch best pick cars",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMakeData();
    fetchBestCarsData(pagination.current, pagination.pageSize, { make: makeFilter, search: searchValue });
  }, []);

  useEffect(() => {
    setPagination((p) => ({ ...p, current: 1 }));
    fetchBestCarsData(1, pagination.pageSize, { make: makeFilter, search: searchValue });
  }, [makeFilter, searchValue]);

  const onChangePage = (page, newPageSize) => {
    const effectivePageSize = newPageSize || pagination.pageSize;
    const effectivePage = page || 1;
    setPagination((prev) => ({ ...prev, current: effectivePage, pageSize: effectivePageSize }));
    fetchBestCarsData(effectivePage, effectivePageSize, { make: makeFilter, search: searchValue });
  };

  const handleToggle = async (id) => {
    const car = cars.find((c) => c.id === id);
    if (!car) return;
    
    const newValue = !car.bestPick;

    setCars((prev) => updateCarBestPick(prev, id, newValue));
    setBestPicksTotal((prev) => updateBestPicksCount(prev, newValue, bestPicksIsGlobal));

    try {
      setLoading(true);
      const body = { car_id: id, is_best_pick: newValue ? 1 : 0 };

      const response = await userAPI.markasbestcar(body);
      const data = handleApiResponse(response);

      if (isApiResponseSuccessful(data)) {
        const bestPicksData = extractBestPicksTotal(data);
        if (bestPicksData.isGlobal) {
          setBestPicksTotal(bestPicksData.total);
          setBestPicksIsGlobal(true);
        }

        await fetchBestCarsData(pagination.current, pagination.pageSize, { make: makeFilter, search: searchValue });

        if (data.message) {
          messageApi.open({ type: "success", content: data.message });
        }
      } else {
        setCars((prev) => updateCarBestPick(prev, id, !newValue));
        setBestPicksTotal((prev) => rollbackBestPicksCount(prev, newValue, bestPicksIsGlobal));
        messageApi.open({ type: "error", content: data?.message || "Failed to update Best Pick" });
      }
    } catch (err) {
      setCars((prev) => updateCarBestPick(prev, id, !newValue));
      setBestPicksTotal((prev) => rollbackBestPicksCount(prev, newValue, bestPicksIsGlobal));
      const errorData = handleApiError(err);
      messageApi.open({ type: "error", content: errorData?.message || "Failed to update Best Pick" });
    } finally {
      setLoading(false);
    }
  };

  const handleCardCheckboxChange = (carId, checked) => {
    setSelectedIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, carId]));
      } else {
        return prev.filter((id) => id !== carId);
      }
    });
  };

   useEffect(() => {
    if (selectedIds.length === cars.length && cars.length > 0) {
      setHeaderChecked(true);
    } else {
      setHeaderChecked(false);
    }
  }, [selectedIds, cars]);

  const displayedCars = cars;

  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  const startIndex = totalCars === 0 ? 0 : (current - 1) * pageSize;
  const endIndex = Math.min(startIndex + (displayedCars.length || pageSize), totalCars);

  return (
    <div
      className="bestcars-root"
      style={{
        height: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        padding: 4,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {contextHolder}

      <div
        className="bestcars-header"
        style={{
          flex: "0 0 100px",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <div style={{ width: "90%" }}>
          <Row className="w-100 align-items-center" style={{ width: "100%", margin: 0 }}>
            <Col xs={12} md={7} className="d-flex align-items-center gap-2" style={{ paddingLeft: 0 }}>
              <Col xs={12} md={6} className="px-0">
                <Input
                  placeholder="Search Vehicles..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  style={{ marginTop: 6 }}
                  prefix={<SearchOutlined style={{ color: "#9CA3AF" }} />}
                />
              </Col>

              <Col xs={6} md={3} className="px-0">
                <Select
                  value={makeFilter}
                  onChange={(v) => setMakeFilter(v)}
                  style={{ width: "100%", marginTop: 6 }}
                  placeholder="Select Make"
                  allowClear
                >
                  <Option value="">All Makes</Option>
                  {makes.map((m) => (
                    <Option key={m.id} value={m.name}>
                      {m.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Col>

            <Col xs="auto" className="ms-auto text-end" style={{ paddingLeft: 0 }}>
              <div style={{ fontSize: 14, display: "flex", gap: 20, alignItems: "center" }}>
                <div>
                  Total: <strong>{totalCars} Vehicles</strong>
                </div>
                <div>
                  <Tooltip title={bestPicksIsGlobal ? "Total best picks" : "Best picks on this page (API did not provide a global total)"}>
                    <span>
                      Best Picks: <strong style={{ color: "#008AD5" }}>{bestPicksTotal} Vehicles</strong>
                    </span>
                  </Tooltip>
                </div>
              </div>
             
                  <Checkbox
  style={{ marginTop: "10px" }}
  checked={headerChecked} 
  onChange={handleHeaderCheckboxChange}
/>

            </Col>
          </Row>
        </div>
      </div>

      <div
        className="list-area"
        style={{
          flex: "1 1 auto",
          overflowY: "auto",
          padding: "12px 8px",
          background: "#F8FAFC",
        }}
      >
        <div style={{ width: "90%", margin: "0 auto", padding: 0 }}>
          <Spin spinning={loading} tip="">
            <div style={{ marginTop: 8 }}>
            {displayedCars.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#6B7280" }}>{loading ? "Loading vehicles..." : "No data found"}</div>
            ) : (
              displayedCars.map((car) => (
                <Card
                  key={car.id}
                  className="mb-3 shadow-sm"
                  style={{
                    borderRadius: "12px",
                    padding: "0px",
                    position: "relative",
                    overflow: "visible",
                  }}
                >
                  <div style={{ position: "absolute", top: 8, left: 8, zIndex: 5 }}>
                    <Checkbox
                      checked={selectedIds.includes(car.id)}
                      onChange={(e) => handleCardCheckboxChange(car.id, e.target.checked)}
                      aria-label={`Select car ${car.id}`}
                    />
                  </div>

                  <Row className="align-items-center" style={{ margin: 0 }}>
                    <Col xs={12} md={2} className="text-center" style={{ padding: "6px" }}>
                      <img
                        src={car.image}
                        alt={car.makeModel}
                        className="img-fluid rounded"
                        style={{ borderRadius: "8px", objectFit: "cover", maxHeight: 92 }}
                      />
                    </Col>

                    <Col xs={12} md={5} style={{ padding: "6px" }}>
                      <h6 style={{ fontWeight: 600, fontSize: "16px", color: "#1F2937", marginBottom: 6 }}>{car.makeModel}</h6>
                      <p style={{ fontSize: "14px", fontWeight: 400, color: "#4B5563", marginBottom: "6px" }}>{car.details}</p>

                      <p style={{ fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
                        {car.sellerName ? (<>Seller: <span style={{ fontWeight: 400 }}>{car.sellerName}</span></>) : null}
                        {car.sellerCity ? (
                          <>
                            {car.sellerName ? " • " : ""}
                            City: <span style={{ fontWeight: 400 }}>{car.sellerCity}</span>
                          </>
                        ) : null}
                      </p>

                      <div className="d-flex align-items-center gap-2">
                        <span style={{ color: "#008AD5", fontWeight: 700, fontSize: "22px" }}>{car.price}</span>

                        <Tag style={{ backgroundColor: car.statusColor, color: car.statusTextColor, border: "none", borderRadius: "12px", padding: "2px 8px", fontWeight: 500 }}>
                          {car.status}
                        </Tag>
                      </div>
                    </Col>

                    <Col xs={12} md={5} className="text-md-end" style={{ padding: "6px" }}>
                      <div className="d-flex justify-content-end align-items-center" style={{ gap: 16 }}>
                        <div style={{ color: "#4B5563", fontSize: "14px", fontWeight: 400 }}>
                          Views: <strong style={{ color: "#000000" }}>{car.views.toLocaleString()}</strong>
                        </div>

                        <div className="d-flex align-items-center" style={{ gap: 6 }}>
                          <Switch checked={car.bestPick} onChange={() => handleToggle(car.id)} className="custom-antd-switch" />
                          <span style={{ color: car.bestPick ? "#008AD5" : "#4B5563", fontWeight: 500, fontSize: "14px" }}>Best Pick</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              ))
            )}

            {displayedCars.length > 0 && (
              <>
                <Divider />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ color: "#6B7280" }}>
                    Showing {startIndex + 1} to {endIndex} of {totalCars} vehicles
                  </div>

                  <Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={onChangePage} className="custom-pagination" />
                </div>
              </>
            )}
          </div>
          </Spin>
        </div>
      </div>
    </div>
  );
}

export default BestCars;
