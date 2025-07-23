import React from "react";
import { Card, Row, Col, Statistic, Progress } from "antd";
import {
  FaChartLine,
  FaUsers,
  FaDollarSign,
  FaShoppingCart,
} from "react-icons/fa";

function Analytics() {
  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h2>Analytics</h2>
        <p>View your business metrics and performance</p>
      </div>

      <div className="content-body">
        {/* Key Metrics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={45678}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<FaDollarSign />}
                suffix="$"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Users"
                value={1234}
                valueStyle={{ color: "#1890ff" }}
                prefix={<FaUsers />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Orders"
                value={567}
                valueStyle={{ color: "#722ed1" }}
                prefix={<FaShoppingCart />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Growth Rate"
                value={12.5}
                precision={1}
                valueStyle={{ color: "#cf1322" }}
                prefix={<FaChartLine />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        {/* Progress Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={8}>
            <Card title="Sales Performance">
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Monthly Target</span>
                  <span>85%</span>
                </div>
                <Progress percent={85} strokeColor="#52c41a" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Quarterly Goal</span>
                  <span>72%</span>
                </div>
                <Progress percent={72} strokeColor="#1890ff" />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Annual Target</span>
                  <span>65%</span>
                </div>
                <Progress percent={65} strokeColor="#722ed1" />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="User Engagement">
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Daily Active Users</span>
                  <span>92%</span>
                </div>
                <Progress percent={92} strokeColor="#52c41a" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Weekly Retention</span>
                  <span>78%</span>
                </div>
                <Progress percent={78} strokeColor="#1890ff" />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Monthly Retention</span>
                  <span>65%</span>
                </div>
                <Progress percent={65} strokeColor="#722ed1" />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Conversion Rates">
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Website Visitors</span>
                  <span>3.2%</span>
                </div>
                <Progress percent={3.2} strokeColor="#52c41a" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Email Campaigns</span>
                  <span>8.5%</span>
                </div>
                <Progress percent={8.5} strokeColor="#1890ff" />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Social Media</span>
                  <span>12.3%</span>
                </div>
                <Progress percent={12.3} strokeColor="#722ed1" />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Additional Analytics Cards */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Top Performing Products">
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Product A</span>
                  <span>$12,450</span>
                </div>
                <Progress percent={85} strokeColor="#52c41a" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Product B</span>
                  <span>$8,920</span>
                </div>
                <Progress percent={65} strokeColor="#1890ff" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Product C</span>
                  <span>$6,780</span>
                </div>
                <Progress percent={45} strokeColor="#722ed1" />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Regional Performance">
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>North America</span>
                  <span>42%</span>
                </div>
                <Progress percent={42} strokeColor="#52c41a" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Europe</span>
                  <span>28%</span>
                </div>
                <Progress percent={28} strokeColor="#1890ff" />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Asia Pacific</span>
                  <span>20%</span>
                </div>
                <Progress percent={20} strokeColor="#722ed1" />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Others</span>
                  <span>10%</span>
                </div>
                <Progress percent={10} strokeColor="#faad14" />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Analytics;
