import React, { useState } from "react";
import { Table, Button, Modal, Tag } from "antd";
import { FaCar, FaUser } from "react-icons/fa";
import "antd/dist/reset.css"; 


function Transactions() {
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [carModalVisible, setCarModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  const columns = [
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>User ID</span>,
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (text) => <span style={{ color: "#111827", cursor: "pointer", fontWeight: 400, fontSize: "14px" }}>{text}</span>,
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Full Name</span>,
      dataIndex: "fullname",
      key: "fullname",
      width: 120,
      render: (text) => text || "-",
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Email Address</span>,
      dataIndex: "emailaddress",
      width: 120,
      key: "emailaddress",
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Phone Number</span>,
      dataIndex: "phone",
      key: "phone",
      width: 170,
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Registered</span>,
      dataIndex: "registered",
      key: "registered",
      width: 120,
      render: (text) => {
        if (!text) return "-";
        const formattedDate = text.split(" ").slice(0, 4).join(" ");
        return <span style={{ color: "#111827", fontSize: "14px", fontWeight: 400 }}>{formattedDate}</span>;
      },
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Listings</span>,
      dataIndex: "listings",
      key: "listings",
      align: "center",
    },
    {
      title: <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: "500" }}>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const s = (status || "").toLowerCase();
        let bgColor = "#FEF9C3";
        let textColor = "#854D0E";

        if (s === "active") {
          bgColor = "#DCFCE7";
          textColor = "#166534";
        } else if (s === "banned") {
          bgColor = "#FEE2E2";
          textColor = "#991B1B";
        } else if (s === "flagged") {
          bgColor = bgColor;
          textColor = textColor;
        }

        const display = s ? s.charAt(0).toUpperCase() + s.slice(1) : "-";

        return (
          <span
            style={{
              backgroundColor: bgColor,
              color: textColor,
              padding: "2px 8px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {display}
          </span>
        );
      },
    },
   
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: 4 }}>Transactions</h2>
      <p style={{ marginBottom: 20, color: "#888" }}>
        View all user transactions
      </p>

      <Table
        rowKey="key"
        columns={columns}
        dataSource={columns}
        pagination={{ pageSize: 10 }}
        size="middle"
      />

      {/* User Modal */}
      <Modal
        title="User Details"
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setUserModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedUser && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  marginRight: 16,
                }}
              />
              <div>
                <h3 style={{ margin: 0 }}>{selectedUser.name}</h3>
                <p style={{ margin: 0, color: "#666" }}>{selectedUser.email}</p>
              </div>
            </div>

            <Table
              showHeader={false}
              pagination={false}
              dataSource={[
                { label: "Phone", value: selectedUser.phone },
                { label: "Customer Type", value: selectedUser.customerType },
                { label: "Verified", value: selectedUser.verified ? "Yes" : "No" },
                { label: "Address", value: selectedUser.address },
                { label: "Join Date", value: selectedUser.joinDate },
                { label: "Buy Count", value: selectedUser.buyCount },
                { label: "Sell Count", value: selectedUser.sellCount },
                {
                  label: "Preferences",
                  value: selectedUser.preferences.join(", "),
                },
              ]}
              columns={[
                { title: "", dataIndex: "label", key: "label", width: 150 },
                { title: "", dataIndex: "value", key: "value" },
              ]}
            />
          </div>
        )}
      </Modal>

      {/* Car Modal */}
      <Modal
        title="Car Details"
        open={carModalVisible}
        onCancel={() => setCarModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCarModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={500}
      >
        {selectedCar && (
          <div>
            <h3 style={{ marginBottom: 16 }}>{selectedCar.name}</h3>
            <p>{selectedCar.details}</p>
            <p style={{ color: "#888" }}>
              <i>More car details can be shown here...</i>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Transactions;
