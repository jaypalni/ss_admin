import React, { useState, useEffect, useMemo } from "react";
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
} from "antd";
import "../assets/styles/bestcars.css";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import { useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

function BestCars() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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

  const mapApiItemToCar = (item) => {
    const sellerFirst = item.user_details?.first_name ?? "";
    const sellerLast = item.user_details?.last_name ?? "";
    const sellerName = `${sellerFirst} ${sellerLast}`.trim();
    let sellerCity = item.user_details?.location ?? "";
    sellerCity = sellerCity !== "" ? sellerCity : "NA";

    const approvalVal = (item.approval ?? "").toString().toLowerCase();
    const statusLabel =
      approvalVal === "approved"
        ? "Active"
        : approvalVal === "pending"
        ? "Pending"
        : item.status ?? "N/A";

    let statusColor;
    let statusTextColor;
    if (statusLabel.toString().toLowerCase() === "active") {
      statusColor = "#DCFCE7";
      statusTextColor = "#166534";
    } else if (statusLabel.toString().toLowerCase() === "pending") {
      statusColor = "#FEF3C7";
      statusTextColor = "#92400E";
    } else if (statusLabel.toString().toLowerCase() === "unsold") {
      statusColor = "#FEF3C7";
      statusTextColor = "#92400E";
    } else {
      statusColor = "#DCFCE7";
      statusTextColor = "#166534";
    }

    return {
      id: item.id,
      image: buildImageUrl(item.car_image || item.image),
      makeModel: `${item.ad_title ?? ""}`.trim(),
      details: [
        `${item.make ?? ""} ${item.model ?? ""}`.trim(),
        item.transmission_type,
        item.kilometers ? `${item.kilometers.toLocaleString()} km` : null,
        item.location,
      ]
        .filter(Boolean)
        .join(" • "),
      price: item.price
        ? typeof item.price === "string"
          ? `IQD ${Number(item.price).toLocaleString()}`
          : `IQD ${item.price}`
        : "N/A",
      status: statusLabel,
      statusColor,
      statusTextColor,
      premium: item.is_featured ? "Featured" : item.is_best_pick ? "Best Pick" : item.badges ?? "",
      premiumColor: item.is_featured ? "#E0F2FE" : item.is_best_pick ? "#FEF3C7" : "#F3F4F6",
      premiumTextColor: item.is_featured ? "#1E40AF" : item.is_best_pick ? "#EA580C" : "#374151",
      qualityScore: item.quality_score ?? (item.views ? Math.min(10, Math.round(item.views / 200)) : 7),
      views: item.views ?? 0,
      bestPick: Boolean(Number(item.is_best_pick ?? (item.is_best_pick === true ? 1 : 0))),
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
        setMakes(data.data);
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
      const response = await loginApi.bestcarpick(page, limit, {
        make: filters.make || "",
        search: filters.search || "",
      });

      const data = handleApiResponse(response);

      if (data?.data && Array.isArray(data.data)) {
        const mapped = data.data.map(mapApiItemToCar);
        setCars(mapped);

        const apiTotalCars =
          typeof data.total_cars === "number"
            ? data.total_cars
            : typeof data.total_cars === "string"
            ? Number(data.total_cars)
            : undefined;
        setTotalCars(apiTotalCars ?? (data.pagination?.total ?? data.pagination?.total_cars ?? 0));

        const paginationTotal =
          typeof data.pagination?.total === "number"
            ? data.pagination.total
            : typeof data.pagination?.total_cars === "number"
            ? data.pagination.total_cars
            : apiTotalCars ?? 0;

        const p = data.pagination || {};
        setPagination({
          current: p.page ?? p.current ?? page,
          pageSize: p.limit ?? limit,
          total: paginationTotal,
        });

        if (typeof data.total_best_picks === "number") {
          setBestPicksTotal(data.total_best_picks);
          setBestPicksIsGlobal(true);
        } else if (typeof data.total_best === "number") {
          setBestPicksTotal(data.total_best);
          setBestPicksIsGlobal(true);
        } else {
          const pageBestCount = (data.data || []).reduce((acc, it) => acc + (Number(it.is_best_pick ?? 0) ? 1 : 0), 0);
          setBestPicksTotal(pageBestCount);
          setBestPicksIsGlobal(false);
        }
      } else {
        setCars([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
        setTotalCars(0);
        setBestPicksTotal(0);
        setBestPicksIsGlobal(false);
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

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (!searchValue) return true;
      return (car.makeModel + " " + car.details).toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [cars, searchValue]);

  const paginationTotal = pagination.total ?? 0;
  const current = pagination.current ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  const startIndex = paginationTotal === 0 ? 0 : (current - 1) * pageSize;
  const endIndex = Math.min(startIndex + (filteredCars.length || pageSize), paginationTotal);

  const handleToggle = async (id) => {
    const car = cars.find((c) => c.id === id);
    if (!car) return;
    const newValue = !car.bestPick;

    setCars((prev) => prev.map((c) => (c.id === id ? { ...c, bestPick: newValue } : c)));

    if (!bestPicksIsGlobal) {
      setBestPicksTotal((prev) => (newValue ? prev + 1 : Math.max(0, prev - 1)));
    }

    try {
      setLoading(true);
      const body = {
        car_id: id,
        is_best_pick: newValue ? 1 : 0,
      };

      const response = await userAPI.markasbestcar(body);
      const data = handleApiResponse(response);

      if (data && (data.status_code === 200 || data.success === true)) {
        if (typeof data.total_best_picks === "number") {
          setBestPicksTotal(data.total_best_picks);
          setBestPicksIsGlobal(true);
        } else if (typeof data.total_best === "number") {
          setBestPicksTotal(data.total_best);
          setBestPicksIsGlobal(true);
        }

        await fetchBestCarsData(pagination.current, pagination.pageSize, { make: makeFilter, search: searchValue });

        if (data.message) {
          messageApi.open({ type: "success", content: data.message });
        }
      } else {
        setCars((prev) => prev.map((c) => (c.id === id ? { ...c, bestPick: !newValue } : c)));
        if (!bestPicksIsGlobal) {
          setBestPicksTotal((prev) => (newValue ? Math.max(0, prev - 1) : prev + 1));
        }
        messageApi.open({ type: "error", content: data?.message || "Failed to update Best Pick" });
      }
    } catch (err) {
      setCars((prev) => prev.map((c) => (c.id === id ? { ...c, bestPick: !newValue } : c)));
      if (!bestPicksIsGlobal) {
        setBestPicksTotal((prev) => (newValue ? Math.max(0, prev - 1) : prev + 1));
      }
      const errorData = handleApiError(err);
      messageApi.open({ type: "error", content: errorData?.message || "Failed to update Best Pick" });
    } finally {
      setLoading(false);
    }
  };

  // checkbox handlers (top-left)
  const handleCardCheckboxChange = (carId, checked) => {
    setSelectedIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, carId]));
      } else {
        return prev.filter((id) => id !== carId);
      }
    });
  };

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
                    <Option key={m.id} value={m.name || m.id}>
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
          <div style={{ marginTop: 8 }}>
            {filteredCars.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#6B7280" }}>No data found</div>
            ) : (
              filteredCars.map((car) => (
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
                        {car.sellerName ? <>Seller: <span style={{ fontWeight: 400 }}>{car.sellerName}</span></> : null}
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

            <Divider />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ color: "#6B7280" }}>
                {paginationTotal === 0 ? <>Showing 0 results</> : <>Showing {startIndex + 1} to {endIndex} of {paginationTotal} vehicles</>}
              </div>

              <Pagination current={pagination.current} pageSize={pagination.pageSize} total={pagination.total} onChange={onChangePage} className="custom-pagination" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestCars;
