import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import {
  Table,
  Avatar,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Switch,
  message,
  Descriptions,
  Divider,
  Typography,
  Tabs,
  Input,
  Select,
  Row,Col
} from "antd";
import {
  FaEye,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendar,
  FaMapMarkerAlt,
  FaClock,
  FaWalking,
} from "react-icons/fa";
import { userAPI } from "../services/api";
const { Option } = Select;

const { Text } = Typography;

function Customers() {
  const navigate = useNavigate();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customersData, setCustomersData] = useState([]);
  const [customersReportedData, setCustomersReportedData] = useState([]);
  const [customersBannedData, setCustomersBannedData] = useState([]);
  const [customersWatchListData, setCustomersWatchListData] = useState([]);
  const [, setReportedFlag] = useState([]);
  const [editForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("all");
  const [, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedWatchlistCustomer, setSelectedWatchlistCustomer] = useState(null);
  const [radioValue, setRadioValue] = useState("All");


  useEffect(() => {
    fetchCustomersData();
  }, []);

  useEffect(() => {
    if (activeTab === "reported") {
      fetchCustomersReportedData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "banned") {
      fetchCustomersBannedData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "watchlist") {
      fetchCustomersWatchListData();
    }
  }, [activeTab]);

  let filteredCustomers;
  if (activeTab === "banned") {
    filteredCustomers = customersBannedData;
  } else if (activeTab === "reported") {
    filteredCustomers = customersReportedData;
  } else if (activeTab === "watchlist") {
    filteredCustomers = customersWatchListData;
  } else {
    filteredCustomers = customersData;
  }


  const handleEditSubmit = (values) => {
    const updatedCustomers = customersData.map((customer) =>
      customer.key === selectedCustomer.key
        ? { ...customer, verified: values.verified, banned: values.banned }
        : customer
    );
    setCustomersData(updatedCustomers);
    setEditModalVisible(false);
    setSelectedCustomer(null);
    editForm.resetFields();
    message.success("Customer information updated successfully");
  };

  const fetchCustomersData = async () => {
    try {
      setLoading(true);
      const response = await userAPI.adminCustomers();
      const data1 = handleApiResponse(response);
      console.log("API Response123:", data1?.data?.users);

      if (data1?.data?.users) {
        const formattedUsers = data1?.data?.users.map((user) => ({
          key: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email || "-",
          phone: user.phone_number || "-",
          customerType: user.user_type?.toLowerCase() || "individual",
          verified: user.is_verified?.toLowerCase() || "pending",
          buyCount: user.buy_count || 0,
          sellCount: user.sold_count || 0,
          avatar: user.avatar || null,
          banned: user.banned || false,
          reported: user.reported || false,
          raw: user,
        }));

        setCustomersData(formattedUsers);
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to load customers data");
      setCustomersData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersReportedData = async () => {
    try {
      setLoading(true);
      const response = await userAPI.adminCustomersReported();
      const data1 = handleApiResponse(response);
      console.log("API Response123:", data1?.data);

      if (data1?.data) {
        const formattedUsers = data1?.data.map((user) => ({
          key: user.reported_user_id,
          name: `${user.reporter_first_name} ${user.reporter_last_name}`,
          email: user.reported_email || "-",
          phone: user.reported_phone_number || "-",
          customerType: user.reported_user_type?.toLowerCase() || "individual",
          verified: user.reported_is_verified?.toLowerCase() || "pending",
          buyCount: user.buy_count || 0,
          sellCount: user.sold_count || 0,
          avatar: user.avatar || null,
          banned: user.banned || false,
          reported: user.reported || false,
          raw: user,
        }));

        setCustomersReportedData(formattedUsers);
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to load customers data");
      setCustomersReportedData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersBannedData = async () => {
    try {
      setLoading(true);
      const response = await userAPI.adminCustomersBanned();
      const data1 = handleApiResponse(response);
      console.log("API Response123:", data1?.data?.users);

      if (data1?.data?.users) {
        const formattedUsers = data1?.data?.users.map((user) => ({
          key: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email || "-",
          phone: user.phone_number || "-",
          customerType: user.user_type?.toLowerCase() || "individual",
          verified: user.is_verified?.toLowerCase() || "pending",
          buyCount: user.buy_count || 0,
          sellCount: user.sold_count || 0,
          avatar: user.avatar || null,
          banned: user.banned || false,
          reported: user.reported || false,
          raw: user,
        }));

        setCustomersBannedData(formattedUsers);
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to load customers data");
      setCustomersBannedData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersReportedFlag = async (id) => {
    try {
      setLoading(true);
      console.log("API ID:", id);
      const response = await userAPI.adminCustomersReportedFlag(Number(id));
      const cardetail = handleApiResponse(response);
      console.log("API Response143:", cardetail);
      if (cardetail) {
        setReportedFlag(cardetail);
      }
      fetchCustomersReportedData()
      message.success(cardetail.message || "Saved successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to add customers data");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersWatchListData = async () => {
    try {
      setLoading(true);
      const response = await userAPI.adminCustomersWatchlist();
      const data1 = handleApiResponse(response);
      console.log("API Response143:", data1?.data);

      if (data1?.data) {
        const formattedUsers = data1?.data.map((user) => ({
          key: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email || "-",
          phone: user.phone_number || "-",
          customerType: user.user_type?.toLowerCase() || "individual",
          verified: user.is_verified?.toLowerCase() || "pending",
        }));

        setCustomersWatchListData(formattedUsers);
      }

      message.success(data1.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to load watchlist data");
      setCustomersWatchListData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomersBannedFlag = async (id,reason) => {
    try {
      setLoading(true);
      console.log("API ID:", id);
      const body =  {
        reason : reason
      }
      const response = await userAPI.adminWatchListBanFlag(Number(id),body);
      const cardetail = handleApiResponse(response);
      console.log("API Response143:", cardetail);
      if (cardetail) {
        setReportedFlag(cardetail);
      }
      fetchCustomersWatchListData()
      message.success(cardetail.message || "Saved successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to add customers data");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={record.avatar} style={{ marginRight: 8 }}>
            {text.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <FaPhone style={{ marginRight: 8, color: "#666" }} />
          {phone}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "customerType",
      key: "customerType",
      render: (type) => {
        const getTypeColor = (type) => {
          switch (type) {
            case "User":
              return "blue";
            case "dealer":
              return "purple";
            default:
              return "blue";
          }
        };
        return <Tag color={getTypeColor(type)}>{type}</Tag>;
      },
    },
    
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (status) => {
        const colorMap = {
          verified: "green",
          pending: "orange",
          resubmission: "red",
        };

        const iconMap = {
          verified: <FaCheckCircle style={{ marginRight: "4px" }} />,
          pending: <FaClock style={{ marginRight: "4px" }} />,
          resubmission: <FaTimesCircle style={{ marginRight: "4px" }} />,
        };

        const label = status?.toLowerCase?.();

        return (
          <Tag color={colorMap[label] || "default"}>
            {iconMap[label] || null}
            {label?.charAt(0).toUpperCase() + label?.slice(1) || "Unknown"}
          </Tag>
        );
      },
    },
    
    {
      title: "Buy Count",
      dataIndex: "buyCount",
      key: "buyCount",
      render: (count) => <Text strong>{count}</Text>,
    },
    {
      title: "Sell Count",
      dataIndex: "sellCount",
      key: "sellCount",
      render: (count) => <Text strong>{count}</Text>,
    },
   {
  title: "Actions",
  key: "actions",
  render: (_, record) => {
    let actionButton;

    if (activeTab === "reported") {
      actionButton = (
        <Button
          type="text"
          icon={<FaWalking />}
          size="small"
          onClick={() => fetchCustomersReportedFlag(record.key)}
          title="Reported Action"
        />
      );
    } else if (activeTab === "watchlist") {
      actionButton = (
        <Button
          type="text"
          icon={<FaWalking />}
          size="small"
          onClick={() => {
            setSelectedWatchlistCustomer(record);
            setIsModalOpen(true);
          }}
          title="WatchList Action"
        />
      );
    } else {
      actionButton = (
        <Button
          type="text"
          size="small"
          title="Edit Verification"
        />
      );
    }

    return (
      <Space>
        {/* View Details button */}
        <Button
          type="text"
          icon={<FaEye />}
          size="small"
          onClick={() => navigate(`/customerdetails/${record.key}`)}
          title="View Details"
        />

        {/* Render the conditional action button */}
        {actionButton}

        {/* Reported Comments Modal */}
        <Modal
          title="Reported Comments"
          open={isModalOpen}
          onOk={() => {
            if (selectedWatchlistCustomer) {
              fetchCustomersBannedFlag(selectedWatchlistCustomer.key, reason);
            }
            setIsModalOpen(false);
            setReason("");
            setSelectedWatchlistCustomer(null);
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setReason("");
            setSelectedWatchlistCustomer(null);
          }}
          okText="Submit"
          cancelText="Cancel"
        >
          <Input.TextArea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason"
            rows={4}
          />
        </Modal>

        {/* Optional Delete button */}
        {/* 
        <Popconfirm
          title="Delete Customer"
          description="Are you sure you want to delete this customer? This action cannot be undone."
          onConfirm={() => handleDelete(record)}
          okText="Yes"
          cancelText="No"
          okType="danger"
        >
          <Button
            type="text"
            icon={<FaTrash />}
            size="small"
            danger
            title="Delete Customer"
          />
        </Popconfirm> 
        */}
      </Space>
    );
  },
}

  ];

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h2>Customers</h2>
        <p>Manage your customer database</p>
      </div>

      <div className="content-body">
        <div className="card">
          <div className="card-body">
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
      <Col flex="auto">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: "all", label: "All" },
            { key: "banned", label: "Banned" },
            { key: "reported", label: "Reported" },
            { key: "watchlist", label: "Watchlist" },
          ]}
        />
      </Col>

<Col style={{ marginBottom: "10px", marginRight: "10px" }}>
  <Select
    value={radioValue}
    onChange={(value) => setRadioValue(value)}
    style={{ width: 200 }}
    placeholder="Select Status"
  >
    <Option value="all">All</Option>
    <Option value="verified">Verified</Option>
    <Option value="non_verified">Non Verified</Option>
  </Select>
</Col>

    </Row>
            <Table
              columns={columns}
              dataSource={filteredCustomers}
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </div>
        </div>
      </div>

      {/* Edit Customer Verification Modal */}
      <Modal
        title="Edit Customer Verification"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedCustomer(null);
          editForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        {selectedCustomer && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <Avatar
                src={selectedCustomer.avatar}
                size={48}
                style={{ marginRight: "16px" }}
              >
                {selectedCustomer.name.charAt(0)}
              </Avatar>
              <div>
                <h4 style={{ margin: 0 }}>{selectedCustomer.name}</h4>
                <p style={{ margin: 0, color: "#666" }}>
                  {selectedCustomer.email}
                </p>
              </div>
            </div>

            <Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
              <Form.Item
                name="verified"
                label="Verification Status"
                rules={[
                  { required: true, message: "Please set verification status" },
                ]}
                style={{ width: "100%" }}
              >
                <Switch
                  checkedChildren="Verified"
                  unCheckedChildren="Not Verified"
                  style={{ width: "120px" }}
                />
              </Form.Item>
              <Form.Item
                name="banned"
                label="Ban User"
                valuePropName="checked"
                style={{ width: "100%" }}
              >
                <Switch
                  checkedChildren="Banned"
                  unCheckedChildren="Not Banned"
                  style={{ width: "120px" }}
                />
              </Form.Item>

              <div style={{ textAlign: "right", marginTop: "24px" }}>
                <Space>
                  <Button
                    onClick={() => {
                      setEditModalVisible(false);
                      setSelectedCustomer(null);
                      editForm.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Update Customer
                  </Button>
                </Space>
              </div>
            </Form>
          </div>
        )}
      </Modal>

      {/* View Customer Details Modal */}
      <Modal
        title="Customer Details"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedCustomer(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setViewModalVisible(false);
              setSelectedCustomer(null);
            }}
          >
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedCustomer && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <Avatar
                src={selectedCustomer.avatar}
                size={64}
                style={{ marginRight: "16px" }}
              >
                {selectedCustomer.name.charAt(0)}
              </Avatar>
              <div>
                <h3 style={{ margin: 0 }}>{selectedCustomer.name}</h3>
                <p style={{ margin: 0, color: "#666" }}>
                  {selectedCustomer.email}
                </p>
              </div>
            </div>

            <Descriptions bordered column={2}>
              <Descriptions.Item label="Phone" span={1}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaPhone style={{ marginRight: "8px", color: "#666" }} />
                  {selectedCustomer.phone}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Customer Type" span={1}>
                <Tag
                  color={
                    selectedCustomer.customerType === "User" ? "blue" : "purple"
                  }
                >
                  {selectedCustomer.customerType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Verification Status" span={1}>
                <Tag color={selectedCustomer.verified ? "green" : "orange"}>
                  {selectedCustomer.verified ? (
                    <span>
                      <FaCheckCircle style={{ marginRight: "4px" }} />
                      Verified
                    </span>
                  ) : (
                    <span>
                      <FaTimesCircle style={{ marginRight: "4px" }} />
                      Not Verified
                    </span>
                  )}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaMapMarkerAlt
                    style={{ marginRight: "8px", color: "#666" }}
                  />
                  {selectedCustomer.address}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Join Date" span={1}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaCalendar style={{ marginRight: "8px", color: "#666" }} />
                  {selectedCustomer.joinDate}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Buy Count" span={1}>
                <Text strong>{selectedCustomer.buyCount}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Sell Count" span={1}>
                <Text strong>{selectedCustomer.sellCount}</Text>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions bordered column={2} style={{ marginTop: 24 }}>
             <Descriptions.Item label="Cars Bought" span={2}>
  {selectedCustomer.carsBought && selectedCustomer.carsBought.length > 0 ? (
    selectedCustomer.carsBought.map((car) => (
      <span key={car} style={{ marginRight: 4 }}>
        {car}
      </span>
    ))
  ) : (
    "No cars bought"
  )}
</Descriptions.Item>

              <Descriptions.Item label="Cars Sold" span={2}>
                {selectedCustomer.carsSold &&
                selectedCustomer.carsSold.length > 0
                  ? selectedCustomer.carsSold.join(", ")
                  : "No cars sold"}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div>
              <h4>Preferences</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
  {selectedCustomer.preferences.map((preference) => (
    <Tag key={preference} color="blue">
      {preference}
    </Tag>
  ))}
</div>

            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}

export default Customers;
