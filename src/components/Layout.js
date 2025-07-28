import React, { useState } from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Tooltip } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  FaHome,
  FaUsers,
  FaUserFriends,
  FaCog,
  FaChartBar,
  FaFileAlt,
  FaEnvelope,
  FaSignOutAlt,
  FaUserCircle,
  FaBell,
  FaSearch,
  FaCloud,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/styles/layout.css";
import { IoCarSharp } from "react-icons/io5";
import { MdSubscriptions } from "react-icons/md";

const { Header, Sider, Content } = Layout;

function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e) => {
    navigate(e.key);
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <FaUserCircle />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <FaCog />,
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <FaSignOutAlt />,
      label: "Logout",
    },
  ];

  const sideMenuItems = [
    {
      key: "/dashboard",
      icon: <FaHome />,
      label: "Dashboard",
    },
    {
      key: "/users",
      icon: <FaUsers />,
      label: "Users",
    },
    {
      key: "/customers",
      icon: <FaUserFriends />,
      label: "Customers",
    },
    {
      key: "/bestcars",
      icon: <IoCarSharp />,
      label: "Best Cars",
    },
    {
      key: "/transactions",
      icon: <FaFileAlt />, // You can use a different icon if you prefer
      label: "Transactions",
    },
    {
      key: "/subcriptions",
      icon: <MdSubscriptions />,
      label: "Subcriptions",
    },
    {
      key: "/documents",
      icon: <FaFileAlt />,
      label: "Documents",
    },
    {
      key: "/analytics",
      icon: <FaChartBar />,
      label: "Analytics",
    },
    {
      key: "/messages",
      icon: <FaEnvelope />,
      label: "Messages",
    },
    {
      key: "/settings",
      icon: <FaCog />,
      label: "Settings",
    },
    {
      key: "/content",
      icon: <FaCloud />,
      label: "Content",
      hasDropdown: true,
      children: [
        {
          key: "/content/websitecontent",
          label: "Website content",
        },
        {
          key: "/content/managecountry",
          label: "Manage Country",
        },
        {
          key: "/content/bannermanagement",
          label: "Banner management",
        },
      ],
    },
  ];

  // Create menu items with tooltips for collapsed state
  const menuItemsWithTooltips = sideMenuItems.map((item) => ({
    ...item,
    icon: collapsed ? (
      <Tooltip title={item.label} placement="right">
        <div className="menu-item-wrapper">{item.icon}</div>
      </Tooltip>
    ) : (
      item.icon
    ),
    label: collapsed ? "" : item.label,
  }));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="sidebar"
        breakpoint="lg"
        collapsedWidth="55"
        onBreakpoint={(broken) => {
          if (broken) {
            setCollapsed(true);
          }
        }}
      >
        <div className="logo-container">
          <h3 className="logo-text">{!collapsed && "SS Admin "}</h3>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItemsWithTooltips}
          onClick={handleMenuClick}
          className="sidebar-menu"
        />
      </Sider>

      <Layout>
        {/* Top Header */}
        <Header className="header">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapsed}
                className="trigger-btn"
              />
              <div className="search-container ms-3">
                <div className="search-input-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                  />
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center">
              <Button
                type="text"
                icon={<FaBell />}
                className="notification-btn me-3"
              />

              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: ({ key }) => {
                    if (key === "logout") {
                      console.log("Logout clicked");
                    }
                  },
                }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div className="user-profile">
                  <Avatar icon={<UserOutlined />} className="user-avatar" />
                  {/* {!collapsed && ( */}
                  <span className="user-name ms-2">John Doe</span>
                  {/* )} */}
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>

        {/* Main Content */}
        <Content className="content">{children}</Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
