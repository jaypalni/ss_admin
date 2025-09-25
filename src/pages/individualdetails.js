import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { userAPI } from "../services/api";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import activeIcon from "../assets/images/total.svg"; 
import pendingIcon from "../assets/images/active-icon.png";
import soldIcon from "../assets/images/sold-icon.png";
import modelIcon from "../assets/images/reject.svg";
import "../assets/styles/allcarsdashboard.css";
import "../assets/styles/individualdetails.css";
import { message,Table, Select, Row, Col, Button } from "antd";

const { Option } = Select;

const Individualdetails = () => {
    const { individualId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [carDetails, setCarDetails] = useState(null);
    const BASE_URL = process.env.REACT_APP_API_URL;
    const [listingFilter, setListingFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("Newest");

    const dataSource = [
        { id: "#LST2024001", title: "2018 Toyota Camry LE", location: "Baghdad",  status: "Active",data: "Dec 15, 2024", price: "25,000,000" },
        { id: "#LST2024002", title: "2020 Honda Civic Sport", location: "Erbil",  status: "Sold",data: "Dec 10, 2024", price: "32,500,000" },
        { id: "#LST2024003", title: "2019 Nissan Altima SL", location: "Erbil", status: "Active",data: "Dec 8, 2024", price: "28,000,000" },
        { id: "#LST2024004", title: "2017 BMW 320i", location: "Erbil",  status: "Rejected",data: "Dec 5, 2024", price: "45,000,000" },
        { id: "#LST2024005", title: "2021 Hyundai Elantra SEL", location: "Erbil",  status: "Pending",data: "Dec 3, 2024", price: "30,000,000" },
      ];

     const columns = [
    {
      title: () => <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>Listing ID</span>,
      dataIndex: "id",
      key: "id",
      render: (text) => <span style={{ color: "#1890ff", cursor: "pointer" }}>{text}</span>,
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>Title </span>,
      dataIndex: "title",
      key: "title",
      render: (text) => <span style={{ color: "#111827" }}>{text}</span>,
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>Location </span>,
      dataIndex: "location",
      key: "location",
      render: (text) => <span style={{ color: "#111827" }}>{text}</span>,
    },

    {
      title: () => <span style={{ color: "#6B7280", fontSize: "10px", fontWeight: 600 }}>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let bgColor = "#FEF9C3";
        let textColor = "#DBEAFE";

        if (status === "Active") {
          bgColor = "#DCFCE7";
          textColor = "#166534";
        } else if (status === "Rejected") {
          bgColor = "#FEE2E2";
          textColor = "#991B1B";
        }else if (status === "Sold") {
          bgColor = "#DBEAFE";
          textColor = "#1E40AF";
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
      title: () => <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>Date Created</span>,
      dataIndex: "data",
      key: "data",
      render: (text) => <span style={{ color: "#111827" }}>{text}</span>,
    },
    {
      title: () => <span style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>Price (IQD)</span>,
      dataIndex: "price",
      key: "price",
      render: (text) => <span style={{ color: "#111827" }}>{text}</span>,
    },
  ];

  return (
     <div className="content-wrapper-allcardashboard">
      {/* {contextHolder} */}
      <div className="content-body">
        <div className="row">
          {/* Active Listings */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card dashboard-card">
              <div className="card-body dashboard-card-body">
                <div className="card-text-container">
                  <h5 className="card-individual-title">Total Listings</h5>
                  <p className="card-individual-number" style={{ color: '#111827' }}>
                       24
                  </p>
                </div>
                <div className="card-icon-individual-wrapper" style={{ backgroundColor: "#DBEAFE" }}>
                  <img src={activeIcon} alt="Total Listings" className="card-individual-icon" />
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approval */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card dashboard-card">
              <div className="card-body dashboard-card-body">
                <div className="card-text-container">
                  <h5 className="card-individual-title">Active Listings</h5>
                  <p className="card-individual-number" style={{ color: '#16A34A' }}>
                    8
                  </p>
                </div>
                <div className="card-icon-individual-wrapper" style={{ backgroundColor: "#DCFCE7" }}>
                  <img src={pendingIcon} alt="Active Listings" className="card-individual-icon-active" />
                </div>
              </div>
            </div>
          </div>

          {/* Sold This Month */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card dashboard-card">
              <div className="card-body dashboard-card-body">
                <div className="card-text-container">
                  <h5 className="card-individual-title">Sold Listings</h5>
                  <p className="card-individual-number" style={{ color: '#2563EB' }}>
                    14
                  </p>
                </div>
                <div className="card-icon-individual-wrapper" style={{ backgroundColor: "#DBEAFE" }}>
                  <img src={soldIcon} alt="Sold Listings" className="card-individual-icon-active" />
                </div>
              </div>
            </div>
          </div>

          {/* Total Model */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card dashboard-card">
              <div className="card-body dashboard-card-body">
                <div className="card-text-container">
                  <h5 className="card-individual-title">Rejected Listings</h5>
                  <p className="card-individual-number" style={{ color: '#DC2626', font: '18px', fontWeight: '700' }}>
                   2
                  </p>
                </div>
                <div className="card-icon-individual-wrapper" style={{ backgroundColor: "#FEE2E2" }}>
                  <img src={modelIcon} alt="Rejected Listings" className="card-individual-icon" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>


      <Table
  dataSource={dataSource}
  columns={columns}
  rowKey="id"
  bordered={false}
  pagination={{
    pageSize: 5,
    showSizeChanger: false,
    showTotal: (total, range) =>
      `Showing ${range[0]} to ${range[1]} of ${total} results`,
  }}
  title={() => (
    <Row justify="space-between" align="middle" style={{ background: "#fff" }}>
      {/* Left side */}
      <Col>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: "16px" }}>
          User Listings
        </h3>
      </Col>

      {/* Right side */}
      <Col style={{ display: "flex", alignItems: "center", gap: 12 }}>
       {["All", "Active", "Pending", "Sold"].map((status) => {
  const isSelected = listingFilter === status;

  const styles = {
    minWidth: 50,
    padding: "0 0px",
    fontSize: "10px",
    fontWeight: 500,
    borderRadius: 6,
    border: "none",
    backgroundColor: isSelected ? "#008AD5" : "#E5E7EB",
    color: isSelected ? "#FFFFFF" : "#374151",
  };

  return (
    <Button
      key={status}
      size="small"
      style={styles}
      onClick={() => setListingFilter(status)}
    >
      {status}
    </Button>
  );
})}

        <Select
          value={sortOrder}
          onChange={setSortOrder}
          style={{ width: 120, backgroundColor: "#D1D5DB", 
    color: "#fff",            
    borderRadius: 6, }}
        >
          <Option value="Sort by Newest">Newest</Option>
          <Option value="Oldest">Oldest</Option>
          <Option value="PriceHigh">Price: High → Low</Option>
          <Option value="PriceLow">Price: Low → High</Option>
        </Select>
      </Col>
    </Row>
  )}
/>
    </div>
  )
}

export default Individualdetails