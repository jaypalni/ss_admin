import React, { useState, useEffect, useRef } from "react";
import { Input, Select, Table, Card, Row, Col, Button, message,Popconfirm  } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaFlag, FaBan } from "react-icons/fa";
import "../assets/styles/individual.css";
import { loginApi } from "../services/api";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";

const { Option } = Select;

const Individual = () => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = token && user;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [debouncedSearch] = useState(searchValue);

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const debounceRef = useRef(null);
  const DEBOUNCE_MS = 500;

  const statusToApiFilter = (status) => {
    if (!status || status === "All Status") return undefined;
    return status.toLowerCase();
  };

  const fetchUsers = async ({ page = 1, limit = 10, filter, search = "" } = {}) => {
    setLoading(true);
    try {
      const body = {
        user_type: "individual",
        filter: filter || "",
        search: search || "",
        page,
        limit,
      };

      const response = await loginApi.getallusers(body);
      const result = handleApiResponse(response);

      if (result?.data) {
        setUsers(
          result.data.map((u) => ({
            id: String(u.id),
            fullname: (u.full_name || "").trim() || "-",
            emailaddress: u.email || "-",
            phone: u.phone_number || "-",
            registered:
              u.registered_since
                ? u.registered_since.split(" ").slice(1, 4).join(" ")
                : "-",
            listings:
              typeof u.no_of_listings !== "undefined" ? u.no_of_listings : "-",
            status: u.status ? String(u.status).toLowerCase() : "-",
            raw: u,
          }))
        );

        if (result.pagination) {
          setPage(result.pagination.page || page);
          setLimit(result.pagination.limit || limit);
          setTotal(result.pagination.total || 0);
        } else {
          setTotal(result.data.length || 0);
        }
      } else {
        setUsers([]);
        setTotal(0);
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: "error",
        content: errorData?.error || "Error fetching users",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (debounceRef.current) clearTimeout(debounceRef.current);
  
  debounceRef.current = setTimeout(() => {
    const apiFilter = statusToApiFilter(statusFilter);

    if (searchValue.length > 1) {
      fetchUsers({
        page,   
        limit,
        filter: apiFilter,
        search: searchValue,
      });
    }
    else if (searchValue.length === 0) {
      fetchUsers({
        page, 
        limit,
        filter: apiFilter,
        search: "",
      });
    }
  }, DEBOUNCE_MS);

  return () => clearTimeout(debounceRef.current);
}, [statusFilter, page, limit, searchValue]);


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
          type: "success",
          content: data?.message || "User Flagged Successfully",
        });
         fetchUsers({
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
    } finally {
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
          type: "success",
          content: data?.message || "User Banned Successfully",
        });
        fetchUsers({
        page,
        limit,
        filter: statusToApiFilter(statusFilter),
        search: searchValue,
      });
      } else {
        messageApi.error(data.error || "Failed to banned dealer");
      }
    } catch (err) {
      const errorMsg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong";

    messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
        registered: formatDate(u.registered_since),
        listings: formatListings(u.no_of_listings),
        status: formatStatus(u.status),
      }));

    const formatDate = (dateStr) =>
      dateStr ? dateStr.split(" ").slice(1, 4).join(" ") : "-";

    const formatListings = (num) => (num != null ? num : "-");

    const formatStatus = (status) =>
      status ? String(status).toLowerCase() : "-";

    const buildCsvRow = (row) => [
      row.id,
      row.fullname,
      row.emailaddress,
      row.phone,
      row.registered,
      row.listings,
      capitalize(row.status),
    ];

    const capitalize = (str) =>
      str && str !== "-" ? str.charAt(0).toUpperCase() + str.slice(1) : "-";

    const escapeCsvCell = (cell) =>
      `"${String(cell ?? "").replace(/"/g, '""')}"`;

    const buildCsv = (normalized) => {
      const headers = [
        "User ID",
        "Full Name",
        "Email Address",
        "Phone Number",
        "Registered",
        "Listings",
        "Status",
      ];

      const rows = normalized.map(buildCsvRow);
      return [headers, ...rows]
        .map((row) => row.map(escapeCsvCell).join(","))
        .join("\n");
    };

    try {
      setLoading(true);

      const apiFilter = statusToApiFilter(statusFilter);
      const allRows = [];
      const pageSize = 1000;
      let currentPage = 1;
      let totalFromApi = null;

      const addFetchedData = (data) => {
        if (Array.isArray(data) && data.length > 0) {
          allRows.push(...data);
          return true;
        }
        return false;
      };

      while (true) {
        const result = await fetchPage(currentPage, pageSize, apiFilter, searchValue);
        if (!result) break;
        const hasData = addFetchedData(result.data);
        if (!hasData) break;

        const pagination = result.pagination;
        if (pagination?.total) {
          totalFromApi = pagination.total;
          const totalPages = Math.ceil(totalFromApi / (pagination.limit || pageSize));
          if (currentPage >= totalPages) break;
        } else if (result.data.length < pageSize) {
          break;
        }
        currentPage += 1;
      }

      if (allRows.length === 0) {
        messageApi.open({ type: "info", content: "No data to export" });
        return;
      }

      const normalized = normalizeRows(allRows);
      const csvContent = buildCsv(normalized);

      downloadCsv(csvContent, `users_export_${new Date().toISOString().slice(0, 10)}.csv`);
      messageApi.open({
        type: "success",
        content: `Export started for ${normalized.length} users`,
      });
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: "error",
        content: errorData?.error || "Error exporting users",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>User ID</span>,
      dataIndex: "id",
      key: "id",
      width: 90,
      sorter: (a, b) => a.id.localeCompare(b.id),
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
      onCell: (record) => ({
        style: { cursor: "pointer" },
        onClick: () => navigate(`/user-management/individual/${record.id}`),
      }),
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Full Name</span>,
      dataIndex: "fullname",
      key: "fullname",
      width: 120,
      ellipsis: true,
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
      render: (text) => (
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
        onClick: () => navigate(`/user-management/individual/${record.id}`),
      }),
    },
    {
      title: (
        <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>
          Email Address
        </span>
      ),
      dataIndex: "emailaddress",
      key: "emailaddress",
      width: 120,
      ellipsis: true,
      render: (text) => (
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block",
            maxWidth: "120px",
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
        onClick: () => navigate(`/user-management/individual/${record.id}`),
      }),
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Phone Number</span>,
      dataIndex: "phone",
      key: "phone",
      width: 170,
      onCell: (record) => ({
        style: { cursor: "pointer" },
        onClick: () => navigate(`/user-management/individual/${record.id}`),
      }),
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Registered</span>,
      dataIndex: "registered",
      key: "registered",
      width: 120,
      sorter: (a, b) => new Date(a.registered) - new Date(b.registered),
      render: (text) => {
        if (!text) return "-";
        const formattedDate = text.split(" ").slice(0, 4).join(" ");
        return (
          <span style={{ color: "#111827", fontSize: "14px", fontWeight: 400 }}>
            {formattedDate}
          </span>
        );
      },
      onCell: (record) => ({
        style: { cursor: "pointer" },
        onClick: () => navigate(`/user-management/individual/${record.id}`),
      }),
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Listings</span>,
      dataIndex: "listings",
      key: "listings",
      align: "center",
      sorter: (a, b) => Number(a.listings) - Number(b.listings),
      onCell: (record) => ({
        style: { cursor: "pointer" },
        onClick: () => navigate(`/user-management/individual/${record.id}`),
      }),
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Status</span>,
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => {
        const s = (status || "").toLowerCase();
        let bgColor = "#FEF9C3";
        let textColor = "#854D0E";

        if (s === "active") {
          bgColor = "#DCFCE7";
          textColor = "#166534";
        } else if (s === "banned") {
          bgColor = "#FEE2E2";
          textColor = "#991B1B";
        }

        const display = s ? s.charAt(0).toUpperCase() + s.slice(1) : "-";

        return (
          <span
            style={{
              backgroundColor: bgColor,
              color: textColor,
              padding: "2px 8px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {display}
          </span>
        );
      },
      onCell: (record) => ({
        style: { cursor: "pointer" },
        onClick: () => navigate(`/user-management/individual/${record.id}`),
      }),
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
            navigate(`/user-management/individual/${record.id}`);
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
            <FaFlag size={18} color= "#CA8A04" />
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
            <FaBan size={18} color= "#DC2626" />
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
      <Card
        style={{
          marginBottom: 16,
          backgroundColor: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Row justify="space-between" align="middle">
          <Col style={{ display: "flex", gap: 12 }}>
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 400 }}
            />
            <Select value={statusFilter} onChange={(val) => {
    setStatusFilter(val);
    setPage(1); 
  }} style={{ width: 160 }}>
              <Option value="all">All</Option>
              <Option value="Active">Active</Option>
              <Option value="Flagged">Flagged</Option>
              <Option value="Banned">Banned</Option>
            </Select>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={handleExport}
              icon={<DownloadOutlined />}
              style={{ backgroundColor: "#008AD5" }}
            >
              Export
            </Button>
          </Col>
        </Row>
      </Card>

      <Card style={{ margin: "0 auto", maxWidth: 1200, backgroundColor: "#fff" }}>
        <Table
          dataSource={users}
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
            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
            onChange: (p, pSize) => {
              setPage(p);
              if (pSize && pSize !== limit) setLimit(pSize);
            },
          }}
        />
      </Card>
    </div>
  );
};

export default Individual;
