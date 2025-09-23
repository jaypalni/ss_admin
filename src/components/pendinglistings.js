import React, { useState, useMemo } from "react";
import { Input, Select, DatePicker, Table, Card, Row, Col } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs"; // For date comparison

const { Option } = Select;

const PendingListings = () => {
  const [searchValue, setSearchValue] = useState("");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [sellerType, setSellerType] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateRange, setDateRange] = useState(null);
  const navigate = useNavigate();

  // Sample table data
  const dataSource = [
    {
      key: "1",
      referenceId: "LST-001",
      dateSubmitted: "2025-01-23",
      sellerName: "Ahmed Hassan",
      listingTitle: "2018 Toyota Camry LE",
      location: "Baghdad",
      type: "Individual",
      status: "Pending",
    },
    {
      key: "2",
      referenceId: "LST-002",
      dateSubmitted: "2025-01-22",
      sellerName: "Baghdad Motors",
      listingTitle: "2020 Honda Civic Sport",
      location: "Basra",
      type: "Dealer",
      status: "Pending",
    },
    {
      key: "3",
      referenceId: "LST-003",
      dateSubmitted: "2025-01-20",
      sellerName: "Ali Kareem",
      listingTitle: "2019 Nissan Altima",
      location: "Baghdad",
      type: "Individual",
      status: "Approved",
    },
  ];

  // Filtered data based on search and filters
  const filteredData = useMemo(() => {
    return dataSource.filter((item) => {
      // Search filter (listingTitle or referenceId)
      const searchMatch =
        item.listingTitle.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.referenceId.toLowerCase().includes(searchValue.toLowerCase());

      // City filter
      const cityMatch =
        cityFilter === "All Cities" || item.location === cityFilter;

      // Seller type filter
      const typeMatch =
        sellerType === "All Types" || item.type === sellerType;

      // Status filter
      const statusMatch =
        statusFilter === "All Status" || item.status === statusFilter;

      // Date range filter
      let dateMatch = true;
      if (dateRange && dateRange.length === 2) {
        const start = dayjs(dateRange[0]);
        const end = dayjs(dateRange[1]);
        const itemDate = dayjs(item.dateSubmitted);
        dateMatch = itemDate.isSameOrAfter(start, "day") && itemDate.isSameOrBefore(end, "day");
      }

      return searchMatch && cityMatch && typeMatch && statusMatch && dateMatch;
    });
  }, [searchValue, cityFilter, sellerType, statusFilter, dateRange, dataSource]);

  const columns = [
    {
      title: () => <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>Reference ID</span>,
      dataIndex: "referenceId",
      key: "referenceId",
      render: (text) => (
        <span style={{ color: "#1890ff", cursor: "pointer" }}>{text}</span>
      ),
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>Date Submitted</span>,
      dataIndex: "dateSubmitted",
      key: "dateSubmitted",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>Seller Name</span>,
      dataIndex: "sellerName",
      key: "sellerName",
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>Listing Title</span>,
      dataIndex: "listingTitle",
      key: "listingTitle",
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>Location</span>,
      dataIndex: "location",
      key: "location",
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>Type</span>,
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span
          style={{
            backgroundColor: type === "Individual" ? "#E6F4FF" : "#F3E8FF",
            color: type === "Individual" ? "#1677FF" : "#722ED1",
            padding: "2px 8px",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        >
          {type}
        </span>
      ),
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>Status</span>,
      dataIndex: "status",
      key: "status",
     render: (status) => {
  let bgColor = "#FFF7E6";
  let textColor = "#FAAD14";

  if (status === "Approved") {
    bgColor = "#DCFCE7"; 
    textColor = "#166534"; 
  } else if (status === "Rejected") {
    bgColor = "#FFE4E6"; 
    textColor = "#B91C1C";
  }

  return (
    <span
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: "2px 8px",
        borderRadius: "8px",
        fontSize: "12px",
      }}
    >
      {status}
    </span>
  );
}
    },
    {
      title: () => (
        <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>
          Actions
        </span>
      ),
      key: "actions",
      align: "center",
      render: (_, record) => (
        <EyeOutlined
          style={{ fontSize: "18px", color: "#1890ff", cursor: "pointer" }}
          onClick={() => navigate(`/listingdetails/${record.key}`)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", background: "#f0f2f5" }}>
      <Card
        style={{
          margin: "0 auto",
          maxWidth: 1200,
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Filters Section */}
        <Row gutter={16} style={{ marginBottom: 20, display: "flex", flexWrap: "wrap" }}>
          {[
            { label: "Search", component: <Input placeholder="Listing title or ID..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} /> },
            { label: "City", component: (
                <Select value={cityFilter} onChange={setCityFilter} style={{ width: "100%" }}>
                  <Option value="All Cities">All Cities</Option>
                  <Option value="Baghdad">Baghdad</Option>
                  <Option value="Basra">Basra</Option>
                </Select>
              )
            },
            { label: "Seller Type", component: (
                <Select value={sellerType} onChange={setSellerType} style={{ width: "100%" }}>
                  <Option value="All Types">All Types</Option>
                  <Option value="Individual">Individual</Option>
                  <Option value="Dealer">Dealer</Option>
                </Select>
              )
            },
            { label: "Status", component: (
                <Select value={statusFilter} onChange={setStatusFilter} style={{ width: "100%" }}>
                  <Option value="All Status">All Status</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Approved">Approved</Option>
                  <Option value="Rejected">Rejected</Option>
                </Select>
              )
            },
            { label: "Date Range", component: (
                <DatePicker.RangePicker style={{ width: "100%" }} format="DD/MM/YYYY" value={dateRange} onChange={setDateRange} />
              )
            }
          ].map((item, index) => (
            <Col
              key={index}
              flex="1"
              style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 12 }}
            >
              <div style={{ marginBottom: 6 }}>
                <strong>{item.label}</strong>
              </div>
              {item.component}
            </Col>
          ))}
        </Row>

        {/* Table Section */}
        <h3 style={{ marginBottom: 15, fontSize: '18px', fontWeight: '600' }}>Pending Listings ({filteredData.length})</h3>

        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          bordered={false}
        />
      </Card>
    </div>
  );
};

export default PendingListings;
