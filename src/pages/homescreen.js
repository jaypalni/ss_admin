import React from "react";
import { Layout, Menu, Card, Avatar, Input, Button } from "antd";
import {
  DashboardOutlined,
  CreditCardOutlined,
  UserOutlined,
  MessageOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "../assets/styles/homescreen.css";
import bluelogo_icon from "../assets/images/souqLogo_blue.svg";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider theme="light" width={200}>
        <div className="logo-title">
          <img src={bluelogo_icon} alt="left side" className="ssblue-logo" />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          className="sidebar-menu"
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="listing management" icon={<CreditCardOutlined />}>
            Listing Management
          </Menu.Item>
          <Menu.Item key="rejection" icon={<UserOutlined />}>
            Listing Rejection Handling
          </Menu.Item>
          <Menu.Item key="approval" icon={<MessageOutlined />}>
            Listing Approval Handling
          </Menu.Item>
          <Menu.Item key="selling" icon={<MessageOutlined />}>
            Best Cars by Selling Type
          </Menu.Item>
          <Menu.Item key="subscription" icon={<MessageOutlined />}>
            Subscription Packages & Featured Pricing
          </Menu.Item>
          <Menu.Item key="user management" icon={<MessageOutlined />}>
            User Management
          </Menu.Item>
          <Menu.Item key="flagging" icon={<MessageOutlined />}>
            Flagging Users
          </Menu.Item>
          <Menu.Item key="banning" icon={<MessageOutlined />}>
            banning Users
          </Menu.Item>
          <Menu.Item key="review" icon={<MessageOutlined />}>
            Review Reported Users
          </Menu.Item>
          <Menu.Item key="dealer" icon={<MessageOutlined />}>
            Dealer Verification
          </Menu.Item>
          <Menu.Item key="support" icon={<MessageOutlined />}>
            Support MailBox Panel
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Layout */}
      <Layout>
        <Header className="header-section">
          <div className="profile-section">
            <BellOutlined />
            <div className="profile-details">
              Young Alaska
              <br />
            </div>
            <Avatar src="https://i.pravatar.cc/40" />
          </div>
        </Header>

        <Content className="content-section">
          <Card
            title="Cars Listed This Week "
            bordered={false}
            style={{ width: 300 }}
          >
            <div className="card-value">12,450</div>
            <div className="card-growth up">15.8% ↑</div>
          </Card>

          <Card
            title="Cars Sold This Week"
            bordered={false}
            style={{ width: 300 }}
          >
            <div className="card-value">$363.95</div>
            <div className="card-growth down">34.0% ↓</div>
          </Card>

          <Card
            title="Listings Pending Approval"
            bordered={false}
            style={{ width: 300 }}
          >
            <div className="card-value">86.5%</div>
            <div className="card-growth up">24.2% ↑</div>
          </Card>

          <Card
            title="User Incident Reports"
            bordered={false}
            style={{ width: 300 }}
          >
            <div className="card-value">86.5%</div>
            <div className="card-growth up">24.2% ↑</div>
          </Card>

          <Card
            title="Dealer Verification Tasks"
            bordered={false}
            style={{ width: 300 }}
          >
            <div className="card-value">86.5%</div>
            <div className="card-growth up">24.2% ↑</div>
          </Card>

          <Card
            title="Support Requests"
            bordered={false}
            style={{ width: 300 }}
          >
            <div className="card-value">86.5%</div>
            <div className="card-growth up">24.2% ↑</div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
