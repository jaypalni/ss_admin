import React, { useState, useEffect, useRef } from "react";
import { Input, Select, Table, Card, Row, Col, Button, message,DatePicker  } from "antd";
import { EyeOutlined, DownloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { handleApiError, handleApiResponse,formatDateTime } from "../utils/apiUtils";
import { loginApi } from "../services/api";
import { useSelector } from 'react-redux';
const { Option } = Select;
const { RangePicker } = DatePicker;

function Transactions() {

  const navigate = useNavigate()
  const didMountRef = useRef(false);
  const [dateRange, setDateRange] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [listingFilter, setListingFilter] = useState("");

  const { user, token } = useSelector(state => state.auth);
  const isLoggedIn = token && user;

  useEffect(() => {
     if (!isLoggedIn) {
       navigate('/');
     }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
     if (didMountRef.current) return;
     didMountRef.current = true;
     fetchTransactionsData(page, limit);
  }, []);

  const fetchTransactionsData = async (page = 1, limit = 50) => {
    try {
      setLoading(true);

     const body = {
  page: page,
  limit: limit,
  search_query: searchValue,
  transaction_type: statusFilter === "all" ? "" : statusFilter,
  date_from: dateRange && dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : "",
  date_to: dateRange && dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : ""
};

console.log("body1234",body)

      const response = await loginApi.gettranscations(body);
      const data = handleApiResponse(response);

      const formatted = Array.isArray(data?.data) ? data.data.map((item, idx) => ({
        key: idx,
        invoice: item.invoice_number,
        date: item.date,
        phone: item.phone,
        customer: item.first_name,
        customerType: item.user_type,
        customerId: item.user_id,
        type: item.subscription_type,
        itemId: item.subscription_name,
        amount: item.amount,
        payment: item.payment_method,
        bank: item.bank_reference_id,
      })) : [];

      setUsers(formatted);

      setTotal(Number(data?.pagination?.total ?? 0));
      setPage(Number(data?.pagination?.page ?? page));

    } catch (error) {
      const err = handleApiError(error);
      messageApi.error(err?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

 const onApplyFilters = () => {
  if (searchValue && searchValue.length < 2 && searchValue.length > 0) {
    messageApi.warning("Enter minimum 2 characters to search");
    return;
  }
  setPage(1);
  fetchTransactionsData(1, limit);
};

  const columns = [
    { title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Invoice #</span>, dataIndex: "invoice", key: "invoice", width: 90 },
    { title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Date</span>, dataIndex: "date", key: "date", width: 90 },
    { title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Phone</span>, dataIndex: "phone", key: "phone", width: 110 },
    { title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Customer</span>, dataIndex: "customer", key: "customer", width: 100, render: (t)=>t||"-" },
    { title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Customer Type </span>, dataIndex: "customerType", width: 90, key: "customerType" },
    { title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Customer Ref ID </span>, dataIndex: "customerId", width: 110, key: "customerId" },
    { title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Type</span>, dataIndex: "type", key: "type", align: "center" },
    { title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Item ID</span>, dataIndex: "itemId", key: "itemId", align: "center" },
    { title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Amount</span>, dataIndex: "amount", key: "amount", align: "center" },
    { title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Payment Method</span>, dataIndex: "payment", key: "payment", align: "center" },
    { title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Bank Reference</span>, dataIndex: "bank", key: "bank", align: "center" },
  ];

  return (
    <div style={{ padding: 12, background: "#f0f2f5" }}>
      {contextHolder}

      {/* top filters card */}
      <Card style={{ marginBottom: 16, backgroundColor: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <Row justify="space-between" align="middle">
          <Col style={{ display: "flex", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: 500, marginBottom: 4,fontSize:12,color:"#374151" }}>Search</label>
              <Input placeholder="Invoice # or Customer Name" value={searchValue} onChange={(e)=>setSearchValue(e.target.value)} style={{ width: 230 }}/>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: 500, marginBottom: 4,fontSize:12,color:"#374151" }}>Transaction Type</label>
              <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 250 }}>
                <Option value="all">All</Option>
                <Option value="Active">Active</Option>
                <Option value="Flagged">Flagged</Option>
                <Option value="Banned">Banned</Option>
              </Select>
            </div>

           <div style={{ display: "flex", flexDirection: "column" }}>
  <label style={{ fontWeight: 500, marginBottom: 4,fontSize:12,color:"#374151" }}>Date Range</label>
  <RangePicker
    style={{ width: 250 }}
    format="YYYY-MM-DD"
    allowClear
    onChange={(dates) => setDateRange(dates)}
  />
</div>

          </Col>

          <Col>
            <Button type="primary" onClick={onApplyFilters} icon={<DownloadOutlined />} style={{ backgroundColor: "#008AD5",width:200,fontWeight:400,fontSize:12,marginTop:20 }}>
              Apply Filters
            </Button>
          </Col>
        </Row>
      </Card>

      <Card style={{ maxWidth: 1200, backgroundColor: "#fff" }}>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="key"
          bordered={false}
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            showSizeChanger: false,
            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
            onChange: (p) => {
              setPage(p);
              fetchTransactionsData(p, limit);
            },
          }}
          title={() => (
            <Row justify="space-between" align="middle" style={{ background: "#fff" }}>
              <Col><h3 style={{ fontWeight: 600, fontSize: 16 }}>Transaction History</h3></Col>
              <Col style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {["Export"].map((status) => (
                  <Button
                    key={status}
                    size="small"
                    style={{
                      minWidth: 50,
                      fontSize: 10,
                      fontWeight: 500,
                      borderRadius: 6,
                      border: "none",
                      backgroundColor: listingFilter === status ? "#008AD5" : "#E5E7EB",
                      color: listingFilter === status ? "#FFFFFF" : "#374151",
                    }}
                    onClick={() => {
                      setListingFilter(status);
                      setPage(1);
                    }}
                  >
                    {status}
                  </Button>
                ))}
              </Col>
            </Row>
          )}
        />
      </Card>
    </div>
  );
}

export default Transactions;
