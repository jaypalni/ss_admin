import React, { useState, useEffect } from "react";
import { Input, Select, DatePicker, Table, Card, Row, Col, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
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
  const [messageApi, contextHolder] = message.useMessage();
  const [carLocation, setCarLocation] = useState([]);
  const headerStyle = { fontSize: "12px", fontWeight: 500, color: "#6B7280" };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const handleTableChange = (paginationInfo) => {
    fetchPendingListings(paginationInfo.current, paginationInfo.pageSize);
  };

  // Fetch locations dynamically
  const fetchRegion = async () => {
    try {
      setLoading(true);
      const response = await userAPI.regionslist({});
      const data1 = handleApiResponse(response);

      if (!data1 || !data1.data) {
        message.error("No location data received");
        setCarLocation([]);
        return;
      }

      setCarLocation(data1.data);
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to fetch location data");
      setCarLocation([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending listings
  const fetchPendingListings = async (page = 1, limit = 10) => {
    try {
      setLoading(true);

      // prefer optional chaining + nullish coalescing
      const normalizedFilter = statusFilter?.toString().toLowerCase() ?? "";

      const body = {
        search: searchValue ?? "",
        city_filter: cityFilter ?? "",
        date_range:
          dateRange && dateRange.length === 2
            ? `${dayjs(dateRange[0]).format("DD/MM/YYYY")}-${dayjs(dateRange[1]).format("DD/MM/YYYY")}`
            : "",
        status: statusFilter ?? "",
        seller_type: sellerType ?? "",
      };

      const response = await userAPI.pendingcars(body, page, limit);
      const data = handleApiResponse(response);

      if (data?.data?.cars) {
        const formattedData = data.data.cars
          .filter((item) => {
            if (!normalizedFilter) return true;

            const approval = item.approval?.toString().toLowerCase() ?? "";
            const status = item.status?.toString().toLowerCase() ?? "";

            if (normalizedFilter === "sold") {
              return status === "sold";
            }

            if (["pending", "approved", "rejected"].includes(normalizedFilter)) {
              return approval === normalizedFilter || (!approval && status === normalizedFilter);
            }

            return status === normalizedFilter || approval === normalizedFilter;
          })
          .map((item) => {
            const approval = item.approval?.toString().toLowerCase() ?? "";
            const status = item.status?.toString().toLowerCase() ?? "";

            const displayedStatus =
              normalizedFilter === "sold" ? status || approval : approval || status;

            return {
              key: item.car_id,
              car_id: item.car_id,
              referenceId: item.car_id,
              dateSubmitted: item.date_submitted ? dayjs(item.date_submitted).format("MMM DD, YYYY") : "",
              listingTitle: item.ad_title ?? "",
              sellerName: `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim(),
              location: item.location ?? "",
              type: item.user_type === "dealer" ? "Dealer" : "Individual",
              status: displayedStatus,
            };
          });

        setTableData(formattedData);

        // Update pagination using API pagination values if present
        const p = data.data.pagination ?? {};
        setPagination({
          current: p.current_page ?? p.page ?? page,
          pageSize: p.limit ?? limit,
          total: p.total_cars ?? p.total ?? 0,
        });
      } else {
        setTableData([]);
        setPagination((prev) => ({ ...prev, total: 0 }));
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: "error",
        content: errorData?.message || "Failed to fetch pending cars",
      });
    } finally {
      setLoading(false);
    }
  };

  // Call APIs on mount & when filters change
  useEffect(() => {
    fetchPendingListings(1, pagination.pageSize);
    fetchRegion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, cityFilter, sellerType, statusFilter, dateRange]);

  const columns = [
    {
      title: <span style={headerStyle}>Reference ID</span>,
      dataIndex: "referenceId",
      key: "referenceId",
      render: (text) => <span style={{ color: "#1890ff", cursor: "pointer" }}>{text}</span>,
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
      render: (status) => {
        // Normalize text safely with optional chaining
        const normalizedStatus = (status ?? "").toString().toLowerCase();

        // single source of truth mapping to avoid redundant assignments
        const statusMap = {
          approved: { display: "Active", bg: "#DCFCE7", color: "#166534" },
          rejected: { display: "Rejected", bg: "#FFE4E6", color: "#B91C1C" },
          sold: { display: "Sold", bg: "#DBEAFE", color: "#1E40AF" },
          pending: { display: "Pending", bg: "#FFF7E6", color: "#FAAD14" },
        };

        const { display, bg, color } = statusMap[normalizedStatus] ?? {
          display: status || "Pending",
          bg: "#FFF7E6",
          color: "#FAAD14",
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
          onClick={() => navigate(`/listingdetails/${record.car_id}`)}
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
        {/* Filters Section */}
        <Row gutter={16} style={{ marginBottom: 20, display: "flex", flexWrap: "wrap" }}>
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
                <Select value={sellerType} onChange={setSellerType} style={{ width: "100%" }}>
                  <Option value="">All Types</Option>
                  <Option value="Individual">Individual</Option>
                  <Option value="Dealer">Dealer</Option>
                </Select>
              ),
            },
            {
              label: "Status",
              component: (
                <Select value={statusFilter} onChange={setStatusFilter} style={{ width: "100%" }}>
                  <Option value="">All</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Approved">Approved</Option>
                  <Option value="Sold">Sold</Option>
                  <Option value="Rejected">Rejected</Option>
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
                  onChange={setDateRange}
                />
              ),
            },
          ].map((item, index) => (
            <Col key={index} flex="1" style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 12 }}>
              <div style={{ marginBottom: 6 }}>
                <strong>{item.label}</strong>
              </div>
              {item.component}
            </Col>
          ))}
        </Row>

        {/* Table Section */}
        <h3 style={{ marginBottom: 15, fontSize: "18px", fontWeight: "600" }}>
          {statusFilter ? `${statusFilter} Listings (${pagination.total})` : `All Listings (${pagination.total})`}
        </h3>

        <Table
          dataSource={tableData}
          columns={columns}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: false,
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
