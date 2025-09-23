import React, { useState } from "react";
import { Card, Row, Col, Checkbox } from "antd";

const carModels = [
  { id: 1, name: "Honda City", totalListings: 18, soldThisMonth: 12 },
  { id: 2, name: "Toyota Corolla", totalListings: 25, soldThisMonth: 20 },
  { id: 3, name: "Hyundai i20", totalListings: 15, soldThisMonth: 10 },
  { id: 4, name: "Kia Seltos", totalListings: 22, soldThisMonth: 18 },
];

const MostPopularModels = () => {
  const [selectedModels, setSelectedModels] = useState([]);

  const handleCheckboxChange = (checked, modelId) => {
    if (checked) {
      setSelectedModels([...selectedModels, modelId]);
    } else {
      setSelectedModels(selectedModels.filter((id) => id !== modelId));
    }
  };

  return (
    <div style={{ padding: "20px", background: "#f0f2f5" }}>
      <Card
        style={{
          margin: "0 auto",
          maxWidth: 1200,
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "20px",
        }}
      >
        
        <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
          Select Most Popular Models
        </div>
        <div style={{ fontSize: "14px", fontWeight: 400, color: "#6B7280", marginBottom: "20px" }}>
          Choose which models to feature as most popular on the platform
        </div>
        <Row gutter={[16, 16]}>
          {carModels.map((model) => (
            <Col xs={24} sm={12} md={8} lg={6} key={model.id}>
              <Card
                hoverable
                style={{
                  borderRadius: "8px",
                  border: selectedModels.includes(model.id)
                    ? "2px solid #1890ff"
                    : "1px solid #f0f0f0",
                }}
              >
                <Checkbox
                  checked={selectedModels.includes(model.id)}
                  onChange={(e) => handleCheckboxChange(e.target.checked, model.id)}
                  style={{ marginBottom: "10px", display: 'flex' }}
                >
                  <div style={{ fontWeight: 500, fontSize: "16px" }}>{model.name}</div>
                </Checkbox>
                <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "-12px", marginLeft: "25px" }}>
                  {model.totalListings} listings · {model.soldThisMonth} sold this month
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default MostPopularModels;
