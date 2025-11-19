import React, { useState, useEffect, useRef } from "react";
import { Input, Select, Table, Card, Row, Col, Button, message,Popconfirm  } from "antd";
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

  const reporteduser = async (id,status) => {
      try {
       setLoading(true);
        const body = {
        report_id: id,       
      };
      const isCurrentlyFlagged = status === "flagged"; 
       const res = isCurrentlyFlagged
      ? await loginApi.unflaggeduser(id) 
      : await loginApi.reporteduser(body); 
         const data = res?.data;
       if (data?.status_code === 200) {
       messageApi.open({
          type: 'success',
          content: data?.message || 'User flagged successfully',
        });
        fetchDealers({
        page,
        limit,
        filter: statusToApiFilter(statusFilter),
        search: searchValue,
      });
      } else {
        messageApi.error(data.message || "Failed to approve dealer");
      }
      } catch (err) {
        const errorMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong";

    messageApi.error(errorMsg);
      }finally {
       setLoading(false);
    }
    };
  
    const bannedDealer = async (id,status) => {
      try {
       setLoading(true);
        const isCurrentlyBanned = status === "banned";
        const body = { user_id: id };

      const res = isCurrentlyBanned
        ? await loginApi.unbanneduser(id) 
        : await loginApi.banneduser(body); 
         const data = res?.data;
       if (data?.status_code === 200) {
      messageApi.open({
          type: 'success',
          content: data?.message || data.error || "Failed to UnBan"});
       fetchDealers({
        page,
        limit,
        filter: statusToApiFilter(statusFilter),
        search: searchValue,
      });
      } else {
        messageApi.error(data.message || data.error || "Failed to banned dealer");
      }
      } catch (err) {
        const errorMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong";

    messageApi.error(errorMsg);
      }finally {
       setLoading(false);
    }
    };
  

useEffect(() => {
  if (debounceRef.current) clearTimeout(debounceRef.current);

  debounceRef.current = setTimeout(() => {
    const apiFilter = statusToApiFilter(statusFilter);

    if (searchValue.length > 1) {
      fetchDealers({
        page,  
        limit,
        filter: apiFilter,
        search: searchValue,
      });
    } else if (searchValue.length === 0) {
      fetchDealers({
        page,
        limit,
        filter: apiFilter,
        search: "",
      });
    }

  }, DEBOUNCE_MS);

  return () => clearTimeout(debounceRef.current);
}, [statusFilter, searchValue, page, limit]);



const handleExport = async () => {
  const fetchPage = async (page, pageSize, apiFilter, searchValue) => {
    const body = {
      user_type: "dealer",
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
       sorter: (a,b) => a.id?.localeCompare(b.id),
      render: (text) => (
  <span style={{
      display: "inline-block",
      maxWidth: 70,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      color: "#111827",
      cursor: "pointer",
      fontWeight: 400,
      fontSize: "14px",
  }}>
    {text}
  </span>
),
      width: 80,
      onCell: (record) => ({
        style: { cursor: "pointer" },
    onClick: () => navigate(`/user-management/dealer/${record.id}`),
  }),
      
    },
    {
  title: (
    <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>
      Company
    </span>
  ),
  dataIndex: "company",
  key: "company",
  sorter: (a,b) => a.company?.localeCompare(b.company),
  width: 100,
  ellipsis: true,
  render: (text) => (
    <span
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "block",
        maxWidth: "180px",
      }}
    >
      {text || "-"}
    </span>
  ),
  onCell: (record) => ({
    style: {
      cursor: "pointer",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    onClick: () => navigate(`/user-management/dealer/${record.id}`),
  }),
},

   {
  title: (
    <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>
      Owner
    </span>
  ),
  dataIndex: "owner",
  key: "owner",
  width: 120,

  onCell: (record) => ({
    style: {
      cursor: "pointer",
     
    },
    onClick: () => navigate(`/user-management/dealer/${record.id}`),
  }),

  render: (text) => (
    <span
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "inline-block",
         maxWidth: "100px",
      }}
    >
      {text}
    </span>
  ),
},
   {
  title: (
    <span
      style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}
    >
      Contact
    </span>
  ),
  dataIndex: "contact",
  key: "contact",
  width: 170,
  onCell: (record) => ({
    style: {
      cursor: "pointer",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    onClick: () => navigate(`/user-management/dealer/${record.id}`),
  }),
  render: (_, record) => (
    <div style={{ display: "flex", flexDirection: "column", maxWidth: "300px" }}>
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={record.email}
      >
        {record.email || "-"}
      </div>
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={record.phone}
      >
        {record.phone || "-"}
      </div>
    </div>
  ),
},

    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Registered</span>,
      dataIndex: "registered",
      key: "registered",
       sorter: (a,b) => {
    const da = new Date(a.registered)
    const db = new Date(b.registered)
    return da - db
  },
      width: 110,
      onCell: (record) => ({
        style: { cursor: "pointer" },
    onClick: () => navigate(`/user-management/dealer/${record.id}`),
  }),
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Listings</span>,
      dataIndex: "listings",
      key: "listings",
      align: "center",
      width: 120,
       sorter: (a,b) => Number(a.listings) - Number(b.listings),
      onCell: (record) => ({
        style: { cursor: "pointer" },
    onClick: () => navigate(`/user-management/dealer/${record.id}`),
  }),
    },
{
  title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Status</span>,
  dataIndex: "status",
  key: "status",
  width: 160,
  sorter: (a,b) => a.status?.localeCompare(b.status),
  onCell: (record) => ({
    style: { cursor: "pointer" },
    onClick: () => navigate(`/user-management/dealer/${record.id}`),
  }),
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
      case "flagged":
        bgColor = "#FEF9C3";
        textColor = "#854D0E";
        break;
      case "rejected":
        bgColor = "#FEE2E2";
        textColor = "#991B1B";
        break;
      case "banned":
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
  render: (_, record) => {
    const isFlagged = record.status === "flagged";
    const isBanned = record.status === "banned";

    return (
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <EyeOutlined
          style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user-management/dealer/${record.id}`);
          }}
        />

        <Popconfirm
          title={
            isFlagged
              ? "Are you sure you want to unflag this user?"
              : "Are you sure you want to flag this user?"
          }
          okText="Yes"
          cancelText="No"
          onConfirm={() => reporteduser(record.id,record.status)} // ONE API
        >
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <FaFlag size={18} color= "#CA8A04"/>
          </button>
        </Popconfirm>

        <Popconfirm
          title={
            isBanned
              ? "Are you sure you want to unban this user?"
              : "Are you sure you want to ban this user?"
          }
          okText="Yes"
          cancelText="No"
          onConfirm={() => bannedDealer(record.id,record.status)} // ONE API
        >
          <button
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <FaBan size={18} color="#DC2626" />
          </button>
        </Popconfirm>
      </div>
    );
  },
}

  ];

  return (
    <div style={{ padding: 20, background: "#f0f2f5" }}>
      {contextHolder}
      <Card style={{ marginBottom: 16, backgroundColor: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <Row justify="space-between" align="middle">
          <Col style={{ display: "flex", gap: 12 }}>
            <Input
              placeholder="Search dealers by company, owner, email, or phone..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 420 }}
              prefix={<SearchOutlined style={{ color: "#B0B0B0" }} />}
              allowClear
            />
          </Col>
          <Col>
            <Select value={statusFilter} onChange={(val) => {
    setStatusFilter(val);
    setPage(1); 
  }} style={{ width: 200, marginRight: 8 }}>
              <Option value="all">All</Option>
              <Option value="active">Active</Option>
              <Option value="pending verification">Pending</Option>
              <Option value="banned">Banned</Option>
              <Option value="flagged">Flagged</Option>
              <Option value="rejected">Rejected</Option>
              <Option value="info requested">Info Requested</Option>
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
          locale={{
    emptyText: <span>No users found. Try adjusting your search or filters.</span>
  }}
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
