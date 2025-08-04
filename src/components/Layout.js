import React, { useState } from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Tooltip, message } from "antd";
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
import { RiAdminFill } from "react-icons/ri";
import "../assets/styles/layout.css";
import { IoCarSharp } from "react-icons/io5";
import { MdSubscriptions } from "react-icons/md";
import { loginApi, userAPI } from "../services/api";
const { Header, Sider, Content } = Layout;
// const superAdmin = Number(localStorage.getItem("isSuperAdmin"));

function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const handleMenuClick = (e) => {
    navigate(e.key);
  };
  const superAdmin = Number(localStorage.getItem("isSuperAdmin"));
  console.log("Superdamin", superAdmin);

  const userMenuItems = [
    {
      key: "profile",
      icon: <FaUserCircle />,
      label: "Profile",
    },

    ...(superAdmin === 1
      ? [
          {
            key: "subadmin",
            icon: <RiAdminFill />,
            label: "Create Admin",
          },
        ]
      : []),

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
      icon: <FaFileAlt />,
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
  // Profile API
  // Logout API
  const userlogoutAPI = async () => {
    try {
      console.log("API Call");
      const response = await loginApi.logout();
      const userData = response?.data || response;
      if (response.status_code === 200 || userData.status_code === 200) {
        message.success("Successfully Logged Out");
        setLoading(false);
        navigate("/");
      } else {
        message.error(userData?.error || "Logout failed");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during logout", error);
      message.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };
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
                      userlogoutAPI();
                    } else if (key === "profile") {
                      console.log("Profile clicked");
                      navigate("/profile");
                    } else if (key === "subadmin") {
                      console.log("Createadmin clicked");
                      navigate("/createsubadmin");
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
