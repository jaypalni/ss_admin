import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  DatePicker,
  Table,
  Card,
  Row,
  Col,
  message,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { userAPI } from "../services/api";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";

const { Option } = Select;

const PendingListings = () => {
  const [searchValue, setSearchValue] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();
  const [carLocation, setCarLocation] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const headerStyle = { fontSize: "12px", fontWeight: 500, color: "#6B7280" };
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleTableChange = (paginationInfo) => {
    fetchListings(paginationInfo.current, paginationInfo.pageSize);
  };

  console.log(location.state);

  useEffect(() => {
    if (location.state?.fromDetails) {
      const savedTab = localStorage.getItem("activeTab");
      const savedStatus = localStorage.getItem("statusFilter");
      if (savedTab) setActiveTab(savedTab);
      if (savedStatus) setStatusFilter(savedStatus);
    } else {
      localStorage.removeItem("activeTab");
      localStorage.removeItem("statusFilter");
      setActiveTab("");
      setStatusFilter("");
    }
    setIsInitialized(true);
  }, [location.state]);

  useEffect(() => {
    if (!isInitialized) return;
    fetchListings(1, pagination.pageSize);
    fetchRegion();
  }, [
    searchValue,
    cityFilter,
    sellerType,
    statusFilter,
    dateRange,
    activeTab,
    isInitialized,
  ]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
    localStorage.setItem("statusFilter", statusFilter);
  }, [activeTab, statusFilter]);

  const fetchRegion = async () => {
    try {
      setLoading(true);
      const response = await userAPI.regionslist({});
      const data1 = handleApiResponse(response);
      if (!data1?.data) {
        message.error("No location data received");
        setCarLocation([]);
        return;
      }
      setCarLocation(data1.data);
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: "error",
        content: errorData?.message || "Error fetching regions",
      });
      setCarLocation([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      const body = {
        search: searchValue ?? "",
        city_filter: cityFilter ?? "",
        date_range:
          dateRange && dateRange.length > 0
            ? dateRange.length === 2
              ? `${dayjs(dateRange[0]).format("DD/MM/YYYY")}-${dayjs(
                  dateRange[1]
                ).format("DD/MM/YYYY")}`
              : `${dayjs(dateRange[0]).format("DD/MM/YYYY")}`
            : "",
        status: statusFilter
          ? statusFilter
          : activeTab === "pending"
          ? "Pending"
          : "Approved",
        seller_type: sellerType ?? "",
      };

      const response = await userAPI.pendingcars(body, page, limit);
      const data = handleApiResponse(response);

      if (data?.data?.cars) {
        const formattedData = data.data.cars.map((item) => ({
          key: item.car_id,
          car_id: item.car_id,
          referenceId: item.car_id,
          dateSubmitted: item.date_submitted
            ? dayjs(item.date_submitted).format("MMM DD, YYYY")
            : "",
          listingTitle: item.ad_title ?? "",
          sellerName: `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim(),
          location: item.location ?? "",
          type: item.user_type === "dealer" ? "Dealer" : "Individual",
          approval: (item.approval ?? "").toString().toLowerCase(),
          status: (item.status ?? "").toString().toLowerCase(),
        }));

        setTableData(formattedData);

        const p = data.data.pagination ?? {};
        setPagination({
          current: p.current_page ?? page,
          pageSize: p.limit ?? limit,
          total: p.total_cars ?? 0,
        });

        if (activeTab === "pending") {
          setPendingCount(p.total_cars ?? 0);
          setApprovedCount(p.total_approved ?? 0);
        } else {
          setApprovedCount(p.total_cars ?? 0);
        }
      } else {
        setTableData([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: "error",
        content: errorData?.message || "Failed to fetch listings",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: <span style={headerStyle}>Reference ID</span>,
      dataIndex: "referenceId",
      key: "referenceId",
      render: (text) => (
        <span style={{ color: "#1890ff", cursor: "pointer" }}>{text}</span>
      ),
    },
    {
      title: <span style={headerStyle}>Date Submitted</span>,
      dataIndex: "dateSubmitted",
      key: "dateSubmitted",
      render: (text) => <span style={{ color: "#6B7280" }}>{text}</span>,
    },
    {
      title: <span style={headerStyle}>Seller Name</span>,
      dataIndex: "sellerName",
      key: "sellerName",
    },
    {
      title: <span style={headerStyle}>Listing Title</span>,
      dataIndex: "listingTitle",
      key: "listingTitle",
    },
    {
      title: <span style={headerStyle}>Location</span>,
      dataIndex: "location",
      key: "location",
    },
    {
      title: <span style={headerStyle}>Type</span>,
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
      title: <span style={headerStyle}>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (_, record) => {
        const approval = (record.approval ?? "").toString().toLowerCase();
        const soldFlag = (record.status ?? "").toString().toLowerCase();

        let finalStatus = "";
        if (approval === "approved" && soldFlag === "sold") {
          finalStatus = "sold";
        } else {
          finalStatus = approval || "pending";
        }

        const statusMap = {
          approved: { display: "Active", bg: "#DCFCE7", color: "#166534" },
          rejected: { display: "Rejected", bg: "#FFE4E6", color: "#B91C1C" },
          sold: { display: "Sold", bg: "#DBEAFE", color: "#1E40AF" },
          pending: { display: "Pending", bg: "#FEF9C3", color: "#854D0E" },
        };

        const { display, bg, color } = statusMap[finalStatus] ?? {
          display: finalStatus || "Pending",
          bg: "#FEF9C3",
          color: "#854D0E",
        };

        return (
          <span
            style={{
              backgroundColor: bg,
              color,
              padding: "2px 8px",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          >
            {display}
          </span>
        );
      },
    },
    {
      title: <span style={headerStyle}>Actions</span>,
      key: "actions",
      align: "center",
      render: (_, record) => (
        <EyeOutlined
          style={{ fontSize: "18px", color: "#1890ff", cursor: "pointer" }}
          onClick={() =>
            navigate(`/listingdetails/${record.car_id}`, {
              state: { fromPage: "listingManagement", fromDetails: true },
            })
          }
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "5px", background: "#f0f2f5" }}>
      {contextHolder}
      <Card
        style={{
          margin: "0 auto",
          maxWidth: 1200,
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Row
          gutter={16}
          style={{ marginBottom: 20, display: "flex", flexWrap: "wrap" }}
        >
          {[
            {
              label: "Search",
              component: (
                <Input
                  placeholder="Listing title or ID..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              ),
            },
            {
              label: "City",
              component: (
                <Select
                  value={cityFilter}
                  onChange={setCityFilter}
                  style={{ width: "100%" }}
                  placeholder="Select City"
                  allowClear
                >
                  <Option value="">All Cities</Option>
                  {carLocation.map((loc) => (
                    <Option key={loc.id} value={loc.location}>
                      {loc.location}
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              label: "Seller Type",
              component: (
                <Select
                  value={sellerType}
                  onChange={setSellerType}
                  style={{ width: "100%" }}
                >
                  <Option value="">All Types</Option>
                  <Option value="Individual">Individual</Option>
                  <Option value="Dealer">Dealer</Option>
                </Select>
              ),
            },
            {
              label: "Status",
              component: (
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: "100%" }}
                  placeholder="Select Status"
                  allowClear
                >
                  <Option value="pending">Pending</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="rejected">Rejected</Option>
                  <Option value="sold">Sold</Option>
                </Select>
              ),
            },
            {
              label: "Date Range",
              component: (
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  value={dateRange}
                  onCalendarChange={(dates) => {
                    // ✅ Update state immediately even for single-date selection
                    setDateRange(dates?.filter(Boolean) || []);
                  }}
                />
              ),
            },
          ].map((item) => (
            <Col
              key={item.label}
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

        <div
          style={{
            display: "flex",
            justifyContent: "start",
            borderBottom: "1px solid #e0e0e0",
            marginBottom: 20,
            gap: 20,
          }}
        >
          {["pending", "approved"].map((tab) => (
            <div
              key={tab}
              onClick={() => {
                setStatusFilter("");
                setActiveTab(tab);
              }}
              style={{
                width: 180,
                textAlign: "center",
                padding: "12px 0",
                cursor: "pointer",
                fontWeight: 500,
                color: activeTab === tab ? "#008AD5" : "#6B7280",
                borderBottom:
                  activeTab === tab
                    ? "3px solid #008AD5"
                    : "3px solid transparent",
                background: activeTab === tab ? "#EFF6FF" : "white",
                borderRadius: "8px 8px 0 0",
                transition: "all 0.3s ease",
              }}
            >
              {tab === "pending"
                ? `Pending Listings (${pendingCount})`
                : `Approved Listings (${approvedCount})`}
            </div>
          ))}
        </div>

        <Table
          dataSource={tableData}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            onChange: (p) => setPage(p),
            showTotal: (total, range) =>
              `Showing ${range[0]} to ${range[1]} of ${total} results`,
          }}
          loading={loading}
          bordered={false}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default PendingListings;
