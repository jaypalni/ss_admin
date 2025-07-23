import React, { useState } from "react";
import { Table, Button, Modal, Tag, Space } from "antd";
import { FaEye, FaCar, FaUser } from "react-icons/fa";
import Customers from "./Customers";

// Mock data for transactions
const transactions = [
  {
    key: "1",
    user: {
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
      preferences: ["Electronics", "Books", "Fashion"]
    },
    action: "Buy",
    car: {
      name: "Toyota Camry",
      details: "2022, White, Automatic, 20,000km"
    },
    price: 22000,
    transactionDate: "2024-06-01",
    transactionType: "Online"
  },
  {
    key: "2",
    user: {
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
      preferences: ["Home & Garden", "Kitchen", "Beauty"]
    },
    action: "Sell",
    car: {
      name: "Mercedes C-Class",
      details: "2021, Black, Automatic, 15,000km"
    },
    price: 35000,
    transactionDate: "2024-06-02",
    transactionType: "Offline"
  },
  {
    key: "3",
    user: {
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
      preferences: ["Sports", "Outdoor"]
    },
    action: "Buy",
    car: {
      name: "Nissan Altima",
      details: "2020, Blue, Manual, 30,000km"
    },
    price: 18000,
    transactionDate: "2024-06-03",
    transactionType: "Online"
  }
];

function Transactions() {
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [carModalVisible, setCarModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  const columns = [
    {
      title: "User",
      dataIndex: ["user", "name"],
      key: "user",
      render: (text, record) => (
        <Button type="link" onClick={() => {
          setSelectedUser(record.user);
          setUserModalVisible(true);
        }}>
          <FaUser style={{ marginRight: 6 }} />{record.user.name}
        </Button>
      )
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action) => (
        <Tag color={action === "Buy" ? "blue" : "purple"}>{action}</Tag>
      )
    },
    {
      title: "Car Name",
      dataIndex: ["car", "name"],
      key: "car",
      render: (text, record) => (
        <Button type="link" onClick={() => {
          setSelectedCar(record.car);
          setCarModalVisible(true);
        }}>
          <FaCar style={{ marginRight: 6 }} />{record.car.name}
        </Button>
      )
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => price ? `$${price.toLocaleString()}` : "-",
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      key: "transactionDate"
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType"
    }
  ];

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h2>Transactions</h2>
        <p>View all user transactions</p>
      </div>
      <div className="content-body">
        <div className="card">
          <div className="card-body">
            <Table
              columns={columns}
              dataSource={transactions}
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </div>
        </div>
      </div>
      {/* User Details Modal (reuse Customers modal style) */}
      <Modal
        title="User Details"
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setUserModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedUser && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <img src={selectedUser.avatar} alt={selectedUser.name} style={{ width: 64, height: 64, borderRadius: '50%', marginRight: 16 }} />
              <div>
                <h3 style={{ margin: 0 }}>{selectedUser.name}</h3>
                <p style={{ margin: 0, color: '#666' }}>{selectedUser.email}</p>
              </div>
            </div>
            <Table
              showHeader={false}
              pagination={false}
              dataSource={[
                { label: 'Phone', value: selectedUser.phone },
                { label: 'Customer Type', value: selectedUser.customerType },
                { label: 'Verified', value: selectedUser.verified ? 'Yes' : 'No' },
                { label: 'Address', value: selectedUser.address },
                { label: 'Join Date', value: selectedUser.joinDate },
                { label: 'Buy Count', value: selectedUser.buyCount },
                { label: 'Sell Count', value: selectedUser.sellCount },
                { label: 'Preferences', value: selectedUser.preferences.join(', ') }
              ]}
              columns={[
                { title: '', dataIndex: 'label', key: 'label', width: 150 },
                { title: '', dataIndex: 'value', key: 'value' }
              ]}
              style={{ marginBottom: 24 }}
            />
          </div>
        )}
      </Modal>
      {/* Car Details Modal */}
      <Modal
        title="Car Details"
        open={carModalVisible}
        onCancel={() => setCarModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCarModalVisible(false)}>
            Close
          </Button>
        ]}
        width={500}
      >
        {selectedCar && (
          <div>
            <h3 style={{ marginBottom: 16 }}>{selectedCar.name}</h3>
            <p>{selectedCar.details}</p>
            <p style={{ color: '#888' }}><i>More car details can be shown here...</i></p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Transactions; 