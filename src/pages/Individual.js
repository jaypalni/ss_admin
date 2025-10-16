import React, { useState, useEffect, useRef } from "react";
import { Input, Select, Table, Card, Row, Col, Button, message } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EditOutlined from "../assets/images/flag.svg";
import DeleteOutlined from "../assets/images/banned.svg";
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
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
        ...(filter ? { filter } : {}),
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
            registered: u.registered_since || "-",
            listings: typeof u.no_of_listings !== "undefined" ? u.no_of_listings : "-",
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
    const apiFilter = statusToApiFilter(statusFilter);
    fetchUsers({ page, limit, filter: apiFilter, search: searchValue });
  }, [statusFilter, page, limit]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const apiFilter = statusToApiFilter(statusFilter);
      setPage(1); 
      fetchUsers({ page: 1, limit, filter: apiFilter, search: searchValue });
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [searchValue]);

    const reporteduser = async (id) => {
        try {
         setLoading(true);
          const body = {
          report_id: id,       
        };
          const res = await loginApi.reporteduser(body);
           const data = res?.data;
         if (data?.status_code === 200) {
         messageApi.error(res?.data?.message || "Failed to fetch dealer details");
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

  const handleExport = () => {
    if (!users || users.length === 0) {
      messageApi.open({ type: "info", content: "No data to export" });
      return;
    }

    const headers = ["User ID", "Full Name", "Email Address", "Phone Number", "Registered", "Listings", "Status"];
    const rows = users.map((r) => [
      r.id,
      r.fullname,
      r.emailaddress,
      r.phone,
      r.registered.split(" ").slice(0, 4).join(" "), 
      r.listings,
      r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "-",
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().slice(0, 10)}.csv`;
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
      width: 80,
      render: (text) => <span style={{ color: "#111827", cursor: "pointer", fontWeight: 400, fontSize: "14px" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Full Name</span>,
      dataIndex: "fullname",
      key: "fullname",
      width: 120,
      render: (text) => text || "-",
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Email Address</span>,
      dataIndex: "emailaddress",
      width: 120,
      key: "emailaddress",
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Phone Number</span>,
      dataIndex: "phone",
      key: "phone",
      width: 170,
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Registered</span>,
      dataIndex: "registered",
      key: "registered",
      width: 120,
      render: (text) => {
        if (!text) return "-";
        const formattedDate = text.split(" ").slice(0, 4).join(" ");
        return <span style={{ color: "#111827", fontSize: "14px", fontWeight: 400 }}>{formattedDate}</span>;
      },
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Listings</span>,
      dataIndex: "listings",
      key: "listings",
      align: "center",
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Status</span>,
      dataIndex: "status",
      key: "status",
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
        } else if (s === "flagged") {
          bgColor = "#FEF9C3";
          textColor = "#854D0E";
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
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Actions</span>,
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <EyeOutlined
            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
            onClick={() => navigate(`/user-management/individual/${record.id}`)}
          />
          <img
            src={EditOutlined}
            onClick={() =>  reporteduser(record.id)}
            alt="edit"
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <img
            src={DeleteOutlined}
            onClick={() =>  bannedDealer(record.id)}
            alt="delete"
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
        </div>
      ),
    },
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
              placeholder="Search by name, email, phone or ID..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 400 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 160 }}
            >
              <Option value="All Status">All Status</Option>
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
