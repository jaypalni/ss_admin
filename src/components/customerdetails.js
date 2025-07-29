import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Descriptions, Divider, Tag, Avatar, Button, Typography } from "antd";
import {
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendar,
  FaMapMarkerAlt,
} from "react-icons/fa";

const { Text } = Typography;

// 🔹 Static mock customer data
const customerMockData = [
  {
    key: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    customerType: "User",
    verified: true,
    joinDate: "2022-01-15",
    address: "123 Main Street, New York, NY",
    buyCount: 5,
    sellCount: 2,
    carsBought: ["BMW X5", "Audi A4"],
    carsSold: ["Hyundai i20"],
    preferences: ["SUV", "Petrol", "Black"],
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    key: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    customerType: "Dealer",
    verified: false,
    joinDate: "2021-08-20",
    address: "456 Elm Street, Los Angeles, CA",
    buyCount: 3,
    sellCount: 10,
    carsBought: ["Mercedes C-Class"],
    carsSold: ["Toyota Corolla", "Ford Focus", "Honda City"],
    preferences: ["Sedan", "Diesel", "White"],
    avatar: "",
  },
  {
    key: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    customerType: "Dealer",
    verified: false,
    joinDate: "2021-08-20",
    address: "456 Elm Street, Los Angeles, CA",
    buyCount: 3,
    sellCount: 10,
    carsBought: ["Mercedes C-Class"],
    carsSold: ["Toyota Corolla", "Ford Focus", "Honda City"],
    preferences: ["Sedan", "Diesel", "White"],
    avatar: "",
  },
  {
    key: "4",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    customerType: "Dealer",
    verified: false,
    joinDate: "2021-08-20",
    address: "456 Elm Street, Los Angeles, CA",
    buyCount: 3,
    sellCount: 10,
    carsBought: ["Mercedes C-Class"],
    carsSold: ["Toyota Corolla", "Ford Focus", "Honda City"],
    preferences: ["Sedan", "Diesel", "White"],
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    key: "5",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    customerType: "Dealer",
    verified: false,
    joinDate: "2021-08-20",
    address: "456 Elm Street, Los Angeles, CA",
    buyCount: 3,
    sellCount: 10,
    carsBought: ["Mercedes C-Class"],
    carsSold: ["Toyota Corolla", "Ford Focus", "Honda City"],
    preferences: ["Sedan", "Diesel", "White"],
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  // Add more mock customers if needed
];

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = customerMockData.find((c) => c.key === id);

  if (!customer) return <p>Customer not found</p>;

  return (
    <div className="content-wrapper" style={{ padding: "24px" }}>
      <Button onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
        ← Back
      </Button>

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}
      >
        <Avatar src={customer.avatar} size={64} style={{ marginRight: "16px" }}>
          {customer.name.charAt(0)}
        </Avatar>
        <div>
          <h2 style={{ margin: 0 }}>{customer.name}</h2>
          <p style={{ margin: 0, color: "#666" }}>{customer.email}</p>
        </div>
      </div>

      <Descriptions bordered column={2}>
        <Descriptions.Item label="Phone">
          <FaPhone style={{ marginRight: 8 }} />
          {customer.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag color={customer.customerType === "User" ? "blue" : "purple"}>
            {customer.customerType}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Verified">
          <Tag color={customer.verified ? "green" : "orange"}>
            {customer.verified ? <FaCheckCircle /> : <FaTimesCircle />}{" "}
            {customer.verified ? "Verified" : "Not Verified"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Join Date">
          <FaCalendar style={{ marginRight: 8 }} />
          {customer.joinDate}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          <FaMapMarkerAlt style={{ marginRight: 8 }} />
          {customer.address}
        </Descriptions.Item>
        <Descriptions.Item label="Buy Count">
          <Text strong>{customer.buyCount}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Sell Count">
          <Text strong>{customer.sellCount}</Text>
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions bordered column={2}>
        <Descriptions.Item label="Cars Bought" span={2}>
          {customer.carsBought.length > 0
            ? customer.carsBought.join(", ")
            : "No cars bought"}
        </Descriptions.Item>
        <Descriptions.Item label="Cars Sold" span={2}>
          {customer.carsSold.length > 0
            ? customer.carsSold.join(", ")
            : "No cars sold"}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <div>
        <h4>Preferences</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {customer.preferences.map((pref, idx) => (
            <Tag key={idx} color="blue">
              {pref}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;
