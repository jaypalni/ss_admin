import React, { useState, useEffect, useRef } from "react";
import { Input, Select, Table, Card, Row, Col, Button, message } from "antd";
import { EyeOutlined, DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EditOutlined from "../assets/images/flag.svg";
import DeleteOutlined from "../assets/images/banned.svg";
import { FaFlag, FaBan } from "react-icons/fa";
import National from "../assets/images/warning.svg";
import Info from "../assets/images/info_1.svg";
import Clock from "../assets/images/clock_1.svg";
import "../assets/styles/dealer.css";
import { loginApi } from "../services/api";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";

const { Option } = Select;

const Dealer = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = token && user;

  useEffect(() => {
    if (!isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [dealers, setDealers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, ] = useState(10);
  const [total, setTotal] = useState(0);

  const debounceRef = useRef(null);
  const DEBOUNCE_MS = 500;

  const statusToApiFilter = (status) => {
    if (!status || status === "All Status") return undefined;
    return status.toLowerCase();
  };

  const fetchDealers = async ({ page = 1, limit = 10, filter, search = "" } = {}) => {
    setLoading(true);
    try {
      const body = {
        user_type: "dealer",
        filter: filter || "All",
        search: search || "",
        page,
        limit,
      };

      const response = await loginApi.getallusers(body);
      const result = handleApiResponse(response);

      if (result?.data) {
        setDealers(
          result.data.map((d) => ({
            id: String(d.id),
            company: d.company_name || "-",
            owner: d.owner_name || "-",
            email: d.email || "-",
            phone: d.phone_number || "-",
            registered: d.registered_since ? d.registered_since.split(" ").slice(1, 4).join(" ") : "-",
            listings: d.no_of_listings || 0,
            status: d.status || "-",
          }))
        );
        setTotal(result.pagination?.total || result.data.length || 0);
      } else {
        setDealers([]);
        setTotal(0);
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: "error",
        content: errorData?.error || "Error fetching dealers",
      });
    } finally {
      setLoading(false);
    }
  };

  const reporteduser = async (id) => {
      try {
       setLoading(true);
        const body = {
        report_id: id,       
      };
        const res = await loginApi.reporteduser(body);
         const data = res?.data;
       if (data?.status_code === 200) {
       messageApi.open({
          type: 'success',
          content: data?.message || 'User flagged successfully',
        });
       fetchDealers()
      } else {
        messageApi.error(data.message || "Failed to approve dealer");
      }
      } catch (err) {
         console.error("fetchDealerDetails error:", err);
        messageApi.error(err?.message || "Something went wrong while fetching dealer details");
      }finally {
       setLoading(false);
    }
    };
  
    const bannedDealer = async (id) => {
      try {
       setLoading(true);
        const body = {
        user_id: id,       
      };
        const res = await loginApi.banneduser(body);
         const data = res?.data;
       if (data?.status_code === 200) {
       messageApi.error(res?.data?.message || "Failed to fetch dealer details");
       fetchDealers()
      } else {
        messageApi.error(data.message || "Failed to banned dealer");
      }
      } catch (err) {
         console.error("fetchDealerDetails error:", err);
        messageApi.error(err?.message || "Something went wrong while fetching dealer details");
      }finally {
       setLoading(false);
    }
    };
  

  useEffect(() => {
  if (debounceRef.current) clearTimeout(debounceRef.current);

  debounceRef.current = setTimeout(() => {
    const apiFilter = statusToApiFilter(statusFilter);

    const fetchPage = searchValue ? 1 : page;

    setPage(fetchPage);

    fetchDealers({
      page: fetchPage,
      limit,
      filter: apiFilter,
      search: searchValue,
    });
  }, DEBOUNCE_MS);

  return () => clearTimeout(debounceRef.current);
}, [statusFilter, searchValue, page, limit]);


const handleExport = async () => {
  const fetchPage = async (page, pageSize, apiFilter, searchValue) => {
    const body = {
      user_type: "individual",
      filter: apiFilter ?? "",
      search: searchValue ?? "",
      page,
      limit: pageSize,
    };
    const response = await loginApi.getallusers(body);
    return handleApiResponse(response);
  };

  const normalizeRows = (rows = []) =>
    rows.map((u) => ({
      id: String(u.id),
      fullname: (u.full_name || "").trim() || "-",
      emailaddress: u.email || "-",
      phone: u.phone_number || "-",
      registered: u.registered_since
        ? u.registered_since.split(" ").slice(1, 4).join(" ")
        : "-",
      listings: u.no_of_listings != null ? u.no_of_listings : "-",
      status: u.status ? String(u.status).toLowerCase() : "-",
    }));

  const buildCsv = (normalized) => {
    const headers = ["ID", "Company", "Owner", "Email", "Phone", "Registered", "Listings", "Status"];
    const rows = normalized.map((r) => [
      r.id,
      r.company,
      r.owner,
      r.email,
      r.phone,
      r.registered,
      r.listings,
      r.status,
    ]);
    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
  };

  try {
    setLoading(true);

    const apiFilter = statusToApiFilter(statusFilter);
    const allRows = [];
    let currentPage = 1;
    const pageSize = 1000;
    let totalFromApi = null;

    while (true) {
      const result = await fetchPage(currentPage, pageSize, apiFilter, searchValue);

      if (!result || !Array.isArray(result.data) || result.data.length === 0) {
        if (currentPage === 1) {
          messageApi.open({ type: "info", content: "No data to export" });
          return;
        }
        break;
      }

      allRows.push(...result.data);

      const pagination = result.pagination ?? null;

      if (pagination && typeof pagination.total === "number") {
        totalFromApi = pagination.total;
        const pages = Math.ceil(totalFromApi / (pagination.limit || pageSize));
        if (currentPage >= pages) break;
        currentPage += 1;
        continue;
      }

      if (result.data.length < pageSize) break;
      currentPage += 1;
    }

    if (allRows.length === 0) {
      messageApi.open({ type: "info", content: "No data to export" });
      return;
    }

    const normalized = normalizeRows(allRows);
    const csvContent = buildCsv(normalized);

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    messageApi.open({ type: "success", content: `Export started for ${normalized.length} users` });
  } catch (error) {
    const errorData = handleApiError(error);
    messageApi.open({ type: "error", content: errorData?.error || "Error exporting users" });
  } finally {
    setLoading(false);
  }
      };

  const columns = [
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>ID</span>,
      dataIndex: "id",
      key: "id",
      render: (text) => <span style={{ color: "black", cursor: "pointer" }}>{text}</span>,
      width: 80,
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Company</span>,
      dataIndex: "company",
      key: "company",
      width: 180,
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Owner</span>,
      dataIndex: "owner",
      key: "owner",
      width: 180,
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Contact</span>,
      dataIndex: "contact",
      key: "contact",
      width: 300,
      render: (_, record) => (
        <div>
          <div>{record.email}</div>
          <div>{record.phone}</div>
        </div>
      ),
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Registered</span>,
      dataIndex: "registered",
      key: "registered",
      width: 140,
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Listings</span>,
      dataIndex: "listings",
      key: "listings",
      align: "center",
      width: 120,
    },
{
  title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Status</span>,
  dataIndex: "status",
  key: "status",
  width: 160,
  render: (status) => {
    if (!status) return null;

    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

    let bgColor = "#DBEAFE";
    let textColor = "#1E40AF";

    switch (status.toLowerCase()) {
      case "verified":
        bgColor = "#DCFCE7";
        textColor = "#166534";
        break;
      case "pending":
        bgColor = "#FEF9C3";
        textColor = "#854D0E";
        break;
      case "rejected":
        bgColor = "#FEE2E2";
        textColor = "#991B1B";
        break;
      case "info requested":
        bgColor = bgColor;
        textColor = textColor;
        break;
      default:
        break;
    }

    return (
      <div
        style={{
          display: "inline-block",
          backgroundColor: bgColor,
          color: textColor,
          padding: "4px 10px",
          borderRadius: 24,
          fontSize: 12,
          maxWidth: 140,
          textAlign: "center",
          wordBreak: "break-word",
        }}
      >
        {displayStatus}
      </div>
    );
  },
},
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Actions</span>,
      key: "actions",
      align: "center",
      width: 140,
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <EyeOutlined
            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
            onClick={() => navigate(`/user-management/dealer/${record.id}`)}
          />
          <button
  onClick={() => reporteduser(record.id)}
  style={{
    background: "none",
    border: "none",
    padding: 0,
    cursor: record.status === "banned" ? "not-allowed" : "pointer",
  }}
  disabled={record.status === "banned"}
  aria-label="Flag"
>
  <FaFlag
    size={18}
    color={record.status === "banned" ? "#D1D5DB" : "#CA8A04"} // light gray if banned, yellow otherwise
  />
</button>
<button
  onClick={() => bannedDealer(record.id)}
  style={{
    background: "none",
    border: "none",
    padding: 0,
    cursor: record.status === "banned" ? "not-allowed" : "pointer",
  }}
  disabled={record.status === "banned"}
  aria-label="Ban"
>
  <FaBan
    size={18}
    color={record.status === "banned" ? "#D1D5DB" : "#DC2626"} // light gray if banned, red otherwise
  />
</button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, background: "#f0f2f5" }}>
      {contextHolder}
      <Card style={{ marginBottom: 16, backgroundColor: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <Row justify="space-between" align="middle">
          <Col style={{ display: "flex", gap: 12 }}>
            <Input
              placeholder="Search dealers by company, owner, email, phone or ID..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 420 }}
              prefix={<SearchOutlined style={{ color: "#B0B0B0" }} />}
              allowClear
            />
          </Col>
          <Col>
            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 200, marginRight: 8 }}>
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="pending verification">Pending</Option>
              <Option value="banned">Banned</Option>
              <Option value="flagged">Flagged</Option>
              {/* <Option value="Info Requested">Info Requested</Option> */}
            </Select>
            <Button type="primary" onClick={handleExport} icon={<DownloadOutlined />} style={{ backgroundColor: "#16A34A" }}>
              Export
            </Button>
          </Col>
        </Row>
      </Card>

      <Card style={{ margin: "0 auto", maxWidth: 1200, backgroundColor: "#fff" }}>
        <Table
          className="dealer-table"
          dataSource={dealers}
          columns={columns}
          rowKey="id"
          bordered={false}
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: false,
            onChange: (p) => setPage(p),
            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} dealers`,
          }}
        />
      </Card>
    </div>
  );
};

export default Dealer;
