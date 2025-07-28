import React, { useState } from "react";
import { Table, Avatar, Button, Modal, Switch, Carousel } from "antd";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import moment from "moment";
import CarDetails from "../components/cardetails";
import { useNavigate } from "react-router-dom";

const getInitials = (firstName = "", lastName = "") => {
  return `${firstName.charAt(0) || ""}${
    lastName.charAt(0) || ""
  }`.toUpperCase();
};

function BestCars() {
  const navigate = useNavigate();

  const [userDetailsModalVisible, setUserDetailsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [carDetailsModalVisible, setCarDetailsModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isBestCar, setIsBestCar] = useState(false);

  const handleNameClick = (record) => {
    setSelectedUser(record);
    setUserDetailsModalVisible(true);
  };

  const closeUserDetailsModal = () => {
    setSelectedUser(null);
    setUserDetailsModalVisible(false);
  };

  const handleCarClick = (record) => {
    setSelectedCar(record);
    setIsBestCar(false); // reset toggle when opening
    setCarDetailsModalVisible(true);
    navigate(`/bestcars/${record.key}/CarDetails`);
  };

  const closeCarDetailsModal = () => {
    setSelectedCar(null);
    setCarDetailsModalVisible(false);
  };

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#5c53e8",
            cursor: "pointer",
          }}
          onClick={() => handleNameClick(record)}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          <Avatar src={record.avatar} style={{ marginRight: 8 }}>
            {text.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Car Make & Model",
      dataIndex: "carmakemodel",
      key: "carmakemodel",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#5c53e8",
            cursor: "pointer",
          }}
          onClick={() => handleCarClick(record)}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Mfg & Transmission",
      dataIndex: "yearmfg",
      key: "yearmfg",
    },
    {
      title: "Created On",
      dataIndex: "lastLogin",
      key: "lastLogin",
    },
  ];

  const renderRow = (label, value) => (
    <tr>
      <td style={{ fontWeight: "bold", padding: "8px 4px" }}>{label}</td>
      <td style={{ padding: "8px 4px" }}>{value}</td>
    </tr>
  );

  const summaryBoxStyle = {
    width: "23%",
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    textAlign: "center",
  };

  const summaryTitleStyle = {
    fontSize: "13px",
    color: "#888",
    marginBottom: 4,
  };

  const summaryValueStyle = {
    fontWeight: 600,
    fontSize: "16px",
  };

  // Table Styles
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const data = [
    {
      key: "1",
      name: "Warner",
      carmakemodel: "Honda City",
      yearmfg: "Manual, 2018",
      carengine: "V8",
      lastLogin: "2024-01-15 10:30",
      avatar: "https://via.placeholder.com/40",
      carImages: [
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
      ],
      carDescription:
        "A stylish and fuel-efficient sedan with spacious interiors.",
      firstname: "David",
      lastname: "Warner",
      email: "warner@example.com",
      date_of_birth: "1990-10-27",
      country_code: "91",
      phone_number: "9876543210",
      address: "Sydney, Australia",
      designation: "Cricketer",
      industry: "Sports",
      role: "Dealer",
    },
    {
      key: "2",
      name: "Jane Smith",
      carmakemodel: "Hyundai i20",
      yearmfg: "Manual, 2018",
      carengine: "V8",
      lastLogin: "2024-01-14 15:45",
      avatar: "https://via.placeholder.com/40",
      carImages: [
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
      ],
      carDescription: "Compact hatchback offering premium features and safety.",
      firstname: "Jane",
      lastname: "Smith",
      email: "jane@example.com",
      date_of_birth: "1988-07-14",
      country_code: "1",
      phone_number: "1234567890",
      address: "New York, USA",
      designation: "Manager",
      industry: "Tech",
      role: "Dealer",
    },
    {
      key: "3",
      name: "Mike Johnson",
      carmakemodel: "Tata Nexon",
      yearmfg: "Manual, 2018",
      carengine: "V8",
      lastLogin: "2024-01-10 09:15",
      avatar: "https://via.placeholder.com/40",
      carImages: [
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
      ],
      carDescription: "Indian compact SUV known for safety and performance.",
      firstname: "Mike",
      lastname: "Johnson",
      email: "mike@example.com",
      date_of_birth: "1985-05-23",
      country_code: "44",
      phone_number: "1122334455",
      address: "London, UK",
      designation: "Engineer",
      industry: "Automotive",
      role: "Dealer",
    },
  ];

  return (
    <div className="content-wrapper">
      <div className="content-body">
        <div className="card">
          <div className="card-body">
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      <Modal
        open={userDetailsModalVisible}
        onCancel={closeUserDetailsModal}
        footer={[
          <Button
            key="close"
            onClick={closeUserDetailsModal}
            className="close-usermodal"
          >
            Close
          </Button>,
        ]}
        centered
        width={500}
      >
        {selectedUser && (
          <div style={{ textAlign: "center" }}>
            <Avatar
              size={80}
              style={{
                backgroundColor: "#CE3A3B",
                fontSize: 32,
                marginBottom: 10,
              }}
            >
              {getInitials(selectedUser.firstname, selectedUser.lastname)}
            </Avatar>
            <h2 style={{ marginBottom: 4 }}>
              {selectedUser.firstname} {selectedUser.lastname}
            </h2>
            <p style={{ color: "gray", marginBottom: 20 }}>
              {selectedUser.email}
            </p>

            <div
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
                textAlign: "left",
              }}
            >
              <h6 style={{ marginBottom: "16px" }}>User details:</h6>

              {[
                {
                  label: "Full name",
                  value: `${selectedUser.firstname} ${selectedUser.lastname}`,
                },
                {
                  label: "Date of Birth",
                  value: selectedUser.date_of_birth
                    ? moment(selectedUser.date_of_birth).format("DD MMM YYYY")
                    : "-",
                },
                {
                  label: "Phone Number",
                  value:
                    selectedUser.country_code && selectedUser.phone_number
                      ? `+${selectedUser.country_code} ${selectedUser.phone_number}`
                      : "—",
                },
                {
                  label: "Address",
                  value: selectedUser.address || "—",
                },
                { label: "Role", value: selectedUser.role },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", marginBottom: "8px" }}
                >
                  <div
                    style={{
                      width: "150px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ width: "10px" }}>:</div>
                  <div style={{ width: "260px" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Car Details Modal */}
      <CarDetails />
    </div>
  );
}

export default BestCars;
