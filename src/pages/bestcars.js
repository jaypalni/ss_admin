import React, { useState } from "react";
import { Row, Col, ProgressBar, Form } from "react-bootstrap";
import { Card, Tag, Input, Select } from "antd";

const { Option } = Select;

function BestCars() {
  const [searchValue, setSearchValue] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [cars, setCars] = useState([
    {
      id: 1,
      image:
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
      makeModel: "2022 BMW 3 Series",
      details: "320i M Sport • Automatic • 15,000 km",
      price: "$45,000",
      status: "Active",
      statusColor: "#DCFCE7",
      statusTextColor: "#166534",
      premium: "Premium",
      premiumColor: "#FEF3C7",
      premiumTextColor: "#EA580C",
      qualityScore: 9.2,
      views: 1247,
      bestPick: true,
    },
    {
      id: 2,
      image:
        "https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg",
      makeModel: "2023 Toyota Camry",
      details: "LE Hybrid • CVT • 8,500 km",
      price: "$32,500",
      status: "Active",
      statusColor: "#DCFCE7",
      statusTextColor: "#166534",
      premium: "Featured",
      premiumColor: "#E0F2FE",
      premiumTextColor: "#1E40AF",
      qualityScore: 7.5,
      views: 892,
      bestPick: false,
    },
    {
      id: 3,
      image:
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
      makeModel: "2021 Mercedes GLC 300",
      details: "4MATIC SUV • 9-Speed Automatic • 22,000 km",
      price: "$52,000",
      status: "Active",
      statusColor: "#DCFCE7",
      statusTextColor: "#166534",
      premium: "Luxury",
      premiumColor: "#FCE7F3",
      premiumTextColor: "#9D174D",
      qualityScore: 9.5,
      views: 1567,
      bestPick: true,
    },
  ]);

  // Function to get progress color based on quality score
  const getProgressColor = (score) => {
    if (score >= 9) return "#22C55E"; // green
    if (score >= 5) return "#FACC15"; // yellow
    return "#DC2626"; // red
  };

  // Toggle Best Pick
  const handleToggle = (id) => {
    setCars((prevCars) =>
      prevCars.map((car) =>
        car.id === id ? { ...car, bestPick: !car.bestPick } : car
      )
    );
  };

  // Filter Cars
  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.makeModel
      .toLowerCase()
      .includes(searchValue.toLowerCase());

    const matchesCategory = categoryFilter
      ? car.premium === categoryFilter
      : true;

    const matchesStatus = statusFilter ? car.status === statusFilter : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="container-fluid p-0" style={{ height: "calc(100vh - 80px)", 
        padding: "4px",
        overflowY: "auto",  
        boxSizing: "border-box",
        }}>
      {/* Search & Filters Section */}
      <div
  style={{
    backgroundColor: "#fff",
    marginTop: "0px",
    marginLeft: "0px",
    marginRight: "0px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <div style={{ width: "90%" }}>
    <Row
      className="w-100"
      style={{ alignItems: "center", width: "100%" }}
      gutter={16}
    >
      {/* Search */}
      <Col md={3}>
        <strong>Search</strong>
        <Input
          placeholder="Search Vehicles..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </Col>

      {/* Category Filter */}
      <Col md={3}>
        <strong>All Categories</strong>
        <Select
          value={categoryFilter}
          onChange={setCategoryFilter}
          style={{ width: "100%", marginTop: 6 }}
          placeholder="Select Category"
          allowClear
        >
          <Option value="">All Categories</Option>
          <Option value="Premium">Premium</Option>
          <Option value="Featured">Featured</Option>
          <Option value="Luxury">Luxury</Option>
        </Select>
      </Col>

      {/* Status Filter */}
      <Col md={3}>
        <strong>All Status</strong>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: "100%", marginTop: 6 }}
          placeholder="Select Status"
          allowClear
        >
          <Option value="">All Status</Option>
          <Option value="Pending">Pending</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Rejected">Rejected</Option>
          <Option value="Active">Active</Option>
        </Select>
      </Col>

      {/* Total and Best Picks */}
      <Col
        md={3}
        style={{
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap", 
        }}
      >
        {/* Total Vehicles */}
        <div style={{ fontSize: 14, marginRight: "20px" }}>
          Total: <strong>247 Vehicles</strong>
        </div>

        {/* Best Picks Vehicles */}
        <div style={{ fontSize: 14, marginRight: "12px" }}>
          Best Picks:{" "}
          <strong style={{ color: "#2563EB" }}>23 Vehicles</strong>
        </div>
      </Col>
    </Row>
  </div>
</div>





      {/* Cars Listing Section */}
      <div className="container my-4">
        {filteredCars.map((car) => (
          <Card
            key={car.id}
            className="mb-3 shadow-sm"
            style={{ borderRadius: "12px", padding: "16px" }}
          >
            <Row className="align-items-center">
              {/* Left Section: Image */}
              <Col xs={12} md={2} className="text-center">
                <img
                  src={car.image}
                  alt={car.makeModel}
                  className="img-fluid rounded"
                  style={{ maxHeight: "100px", borderRadius: "8px" }}
                />
              </Col>

              {/* Middle Section: Car Details */}
              <Col xs={12} md={5}>
                <h6 style={{ fontWeight: 600 }}>{car.makeModel}</h6>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6B7280",
                    marginBottom: "6px",
                  }}
                >
                  {car.details}
                </p>

                {/* Price + Tags */}
                <div className="d-flex align-items-center gap-2">
                  <span
                    style={{
                      color: "#2563EB",
                      fontWeight: 600,
                      fontSize: "16px",
                    }}
                  >
                    {car.price}
                  </span>

                  <Tag
                    style={{
                      backgroundColor: car.statusColor,
                      color: car.statusTextColor,
                      border: "none",
                      borderRadius: "12px",
                      padding: "2px 8px",
                      fontWeight: 500,
                    }}
                  >
                    {car.status}
                  </Tag>

                  <Tag
                    style={{
                      backgroundColor: car.premiumColor,
                      color: car.premiumTextColor,
                      border: "none",
                      borderRadius: "12px",
                      padding: "2px 8px",
                      fontWeight: 500,
                    }}
                  >
                    {car.premium}
                  </Tag>
                </div>
              </Col>

              {/* Right Section: Quality Score, Views, Toggle */}
              <Col xs={12} md={5} className="text-md-start mt-3 mt-md-0">
                <Row>
                  <Col xs={12} md={8}>
                    {/* Quality Score */}
                    <div className="d-flex justify-content-md-start align-items-center gap-2">
                      <span style={{ fontSize: "14px", color: "#374151" }}>
                        Quality Score:
                      </span>
                      <div style={{ width: "64px" }}>
                      <ProgressBar
  now={(car.qualityScore / 10) * 100}
  style={{
    height: "8px",
    backgroundColor: "#E5E7EB", // track color
  }}
>
  <div
    style={{
      width: `${(car.qualityScore / 10) * 100}%`,
      backgroundColor: getProgressColor(car.qualityScore), // fill color
      height: "100%",
    }}
  />
</ProgressBar>

                      </div>
                      <span
                        style={{
                          color: getProgressColor(car.qualityScore),
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        {car.qualityScore}/10
                      </span>
                    </div>

                    {/* Views */}
                    <div
                      style={{
                        marginTop: "8px",
                        color: "#6B7280",
                        fontSize: "14px",
                      }}
                    >
                      Views:{" "}
                      <strong style={{ color: "#111827" }}>
                        {car.views.toLocaleString()}
                      </strong>
                    </div>
                  </Col>

                  {/* Best Pick Toggle */}
                  <Col xs={12} md={4}>
                    <div className="d-flex justify-content-md-end align-items-center gap-2 mt-2">
                      <Form.Check
                        type="switch"
                        id={`switch-${car.id}`}
                        checked={car.bestPick}
                        onChange={() => handleToggle(car.id)}
                        style={{
                          accentColor: car.bestPick ? "#2563EB" : "#E5E7EB",
                        }}
                      />
                      <span
                        style={{
                          color: car.bestPick ? "#2563EB" : "#6B7280",
                          fontWeight: 600,
                          fontSize: "14px",
                        }}
                      >
                        Best Pick
                      </span>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default BestCars;
