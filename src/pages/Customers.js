import React, { useState } from "react";
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
  Popconfirm,
  Descriptions,
  Divider,
  Typography,
  Select,
  Tabs
} from "antd";
import { FaEdit, FaTrash, FaEye, FaUser, FaEnvelope, FaPhone, FaCheckCircle, FaTimesCircle, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";

const { Text } = Typography;
const { Option } = Select;

export const customerMockData = [
  {
    key: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+1-555-0101",
    verified: true,
    customerType: "User",
    avatar: "https://via.placeholder.com/40",
    address: "123 Main St, New York, NY 10001",
    joinDate: "2023-01-15",
    buyCount: 15,
    sellCount: 2,
    carsBought: ["Toyota Camry", "Honda Accord", "Ford Focus"],
    carsSold: ["Mazda 3", "Hyundai Elantra"],
    preferences: ["Electronics", "Books", "Fashion"],
    banned: false,
    reported: false,
  },
  {
    key: "2",
    name: "Bob Wilson",
    email: "bob.wilson@example.com",
    phone: "+1-555-0102",
    verified: false,
    customerType: "User",
    avatar: "https://via.placeholder.com/40",
    address: "456 Oak Ave, Los Angeles, CA 90210",
    joinDate: "2023-03-20",
    buyCount: 8,
    sellCount: 0,
    carsBought: ["Chevrolet Malibu", "Nissan Altima"],
    carsSold: [],
    preferences: ["Sports", "Outdoor"],
    banned: true,
    reported: false,
  },
  {
    key: "3",
    name: "Carol Davis",
    email: "carol.davis@example.com",
    phone: "+1-555-0103",
    verified: true,
    customerType: "Dealer",
    avatar: "https://via.placeholder.com/40",
    address: "789 Pine St, Chicago, IL 60601",
    joinDate: "2023-06-10",
    buyCount: 5,
    sellCount: 23,
    carsBought: ["BMW 3 Series", "Audi A4"],
    carsSold: ["Mercedes C-Class", "Lexus IS", "Tesla Model 3"],
    preferences: ["Home & Garden", "Kitchen", "Beauty"],
    banned: false,
    reported: true,
  },
  {
    key: "4",
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "+1-555-0104",
    verified: false,
    customerType: "User",
    avatar: "https://via.placeholder.com/40",
    address: "321 Elm St, Miami, FL 33101",
    joinDate: "2023-08-15",
    buyCount: 5,
    sellCount: 0,
    carsBought: ["Kia Optima"],
    carsSold: [],
    preferences: ["Technology", "Gaming"],
    banned: false,
    reported: false,
  },
  {
    key: "5",
    name: "Emma Garcia",
    email: "emma.garcia@example.com",
    phone: "+1-555-0105",
    verified: true,
    customerType: "Dealer",
    avatar: "https://via.placeholder.com/40",
    address: "654 Maple Dr, Seattle, WA 98101",
    joinDate: "2023-02-28",
    buyCount: 10,
    sellCount: 31,
    carsBought: ["Volkswagen Passat", "Subaru Impreza"],
    carsSold: ["Toyota Corolla", "Honda Civic", "Ford Fiesta"],
    preferences: ["Fashion", "Beauty", "Jewelry"],
    banned: false,
    reported: true,
  }
];

function Customers() {
  const [customers, setCustomers] = useState(customerMockData);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("all");

  // Filter customers based on tab
  let filteredCustomers = customers;
  if (activeTab === "banned") {
    filteredCustomers = customers.filter((c) => c.banned);
  } else if (activeTab === "reported") {
    filteredCustomers = customers.filter((c) => c.reported);
  }

  // Handle edit customer verification
  const handleEdit = (record) => {
    setSelectedCustomer(record);
    editForm.setFieldsValue({
      verified: record.verified,
      banned: record.banned,
    });
    setEditModalVisible(true);
  };

  // Handle view customer details
  const handleView = (record) => {
    setSelectedCustomer(record);
    setViewModalVisible(true);
  };

  // Handle delete customer
  const handleDelete = (record) => {
    setCustomers(customers.filter(customer => customer.key !== record.key));
    message.success('Customer deleted successfully');
  };

  // Handle edit form submission
  const handleEditSubmit = (values) => {
    const updatedCustomers = customers.map(customer => 
      customer.key === selectedCustomer.key 
        ? { ...customer, verified: values.verified, banned: values.banned }
        : customer
    );
    setCustomers(updatedCustomers);
    setEditModalVisible(false);
    setSelectedCustomer(null);
    editForm.resetFields();
    message.success('Customer information updated successfully');
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
            {/* <div style={{ fontSize: "12px", color: "#666" }}>
              {record.email}
            </div> */}
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{email}</div>
          {/* <div style={{ fontSize: "12px", color: "#666" }}>{record.email}</div> */}
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
            case "Dealer":
              return "purple";
            default:
              return "default";
          }
        };
        return <Tag color={getTypeColor(type)}>{type}</Tag>;
      },
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (verified) => (
        <Tag color={verified ? "green" : "orange"}>
          {verified ? (
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
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<FaEye />}
            size="small"
            onClick={() => handleView(record)}
            title="View Details"
          />
          <Button
            type="text"
            icon={<FaEdit />}
            size="small"
            onClick={() => handleEdit(record)}
            title="Edit Verification"
          />
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
        </Space>
      ),
    },
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
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              style={{ marginBottom: 16 }}
              items={[
                { key: "all", label: "All" },
                { key: "banned", label: "Banned" },
                { key: "reported", label: "Reported" },
              ]}
            />
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
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <Avatar 
                src={selectedCustomer.avatar} 
                size={48}
                style={{ marginRight: '16px' }}
              >
                {selectedCustomer.name.charAt(0)}
              </Avatar>
              <div>
                <h4 style={{ margin: 0 }}>{selectedCustomer.name}</h4>
                <p style={{ margin: 0, color: '#666' }}>{selectedCustomer.email}</p>
              </div>
            </div>

            <Form
              form={editForm}
              layout="vertical"
              onFinish={handleEditSubmit}
            >
              <Form.Item
                name="verified"
                label="Verification Status"
                rules={[{ required: true, message: 'Please set verification status' }]}
                style={{ width: '100%' }}
              >
                <Switch 
                  checkedChildren="Verified" 
                  unCheckedChildren="Not Verified"
                  style={{ width: '120px' }}
                />
              </Form.Item>
              <Form.Item
                name="banned"
                label="Ban User"
                valuePropName="checked"
                style={{ width: '100%' }}
              >
                <Switch 
                  checkedChildren="Banned" 
                  unCheckedChildren="Not Banned"
                  style={{ width: '120px' }}
                />
              </Form.Item>

              <div style={{ textAlign: 'right', marginTop: '24px' }}>
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
          </Button>
        ]}
        width={800}
      >
        {selectedCustomer && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <Avatar 
                src={selectedCustomer.avatar} 
                size={64}
                style={{ marginRight: '16px' }}
              >
                {selectedCustomer.name.charAt(0)}
              </Avatar>
              <div>
                <h3 style={{ margin: 0 }}>{selectedCustomer.name}</h3>
                <p style={{ margin: 0, color: '#666' }}>{selectedCustomer.email}</p>
              </div>
            </div>

            <Descriptions bordered column={2}>
              <Descriptions.Item label="Phone" span={1}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaPhone style={{ marginRight: '8px', color: '#666' }} />
                  {selectedCustomer.phone}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Customer Type" span={1}>
                <Tag color={
                  selectedCustomer.customerType === "User" ? "blue" : "purple"
                }>
                  {selectedCustomer.customerType}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Verification Status" span={1}>
                <Tag color={selectedCustomer.verified ? "green" : "orange"}>
                  {selectedCustomer.verified ? (
                    <span><FaCheckCircle style={{ marginRight: '4px' }} />Verified</span>
                  ) : (
                    <span><FaTimesCircle style={{ marginRight: '4px' }} />Not Verified</span>
                  )}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaMapMarkerAlt style={{ marginRight: '8px', color: '#666' }} />
                  {selectedCustomer.address}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Join Date" span={1}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FaCalendar style={{ marginRight: '8px', color: '#666' }} />
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
                {selectedCustomer.carsBought && selectedCustomer.carsBought.length > 0
                  ? selectedCustomer.carsBought.join(", ")
                  : "No cars bought"}
              </Descriptions.Item>
              <Descriptions.Item label="Cars Sold" span={2}>
                {selectedCustomer.carsSold && selectedCustomer.carsSold.length > 0
                  ? selectedCustomer.carsSold.join(", ")
                  : "No cars sold"}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div>
              <h4>Preferences</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedCustomer.preferences.map((preference, index) => (
                  <Tag key={index} color="blue">{preference}</Tag>
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