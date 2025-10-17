import React, { useState, useEffect, useRef } from "react";
import { Input, Select, Table, Card, Row, Col, Button, message } from "antd";
import { EyeOutlined, DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EditOutlined from "../assets/images/flag.svg";
import DeleteOutlined from "../assets/images/banned.svg";
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
  const [limit, setLimit] = useState(10);
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
        filter: filter || "",
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
            registered: d.registered_since ? d.registered_since.split(" ").slice(0, 4).join(" ") : "-",
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
       messageApi.error(res?.data?.message || "Failed to fetch dealer details");
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
    const apiFilter = statusToApiFilter(statusFilter);
    fetchDealers({ page, limit, filter: apiFilter, search: searchValue });
  }, [statusFilter, page, limit]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const apiFilter = statusToApiFilter(statusFilter);
      setPage(1);
      fetchDealers({ page: 1, limit, filter: apiFilter, search: searchValue });
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [searchValue]);

  const handleExport = () => {
    if (!dealers || dealers.length === 0) return;
    const headers = ["ID", "Company", "Owner", "Email", "Phone", "Registered", "Listings", "Status"];
    const rows = dealers.map((d) => [d.id, d.company, d.owner, d.email, d.phone, d.registered, d.listings, d.status]);
    const csvContent = [headers, ...rows]
      .map((e) => e.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dealers_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
        let bgColor = "#DBEAFE";
        let textColor = "#1E40AF";
        if (status === "verified") { bgColor = "#DCFCE7"; textColor = "#166534"; }
        else if (status === "pending") { bgColor = "#FEF9C3"; textColor = "#854D0E"; }
        else if (status === "rejected") { bgColor = "#FEE2E2"; textColor = "#991B1B"; }
        else if (status === "Info Requested") { bgColor = "#DBEAFE"; textColor = "#1E40AF"; }

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
            {status}
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
          <img src={EditOutlined} alt="edit" style={{ width: 18, height: 18, cursor: "pointer" }} onClick={() => reporteduser(record.id)} />
          <img src={DeleteOutlined} alt="delete" style={{ width: 18, height: 18, cursor: "pointer" }} onClick={() => bannedDealer(record.id)} />
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
