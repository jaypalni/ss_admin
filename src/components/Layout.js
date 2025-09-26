import React, { useState } from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Tooltip, message, Modal } from "antd";
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
  FaUser,
  FaDollarSign,
  FaStar,
  FaCarAlt,
} from "react-icons/fa";
import { Breadcrumb} from "antd";
import { BiSupport } from "react-icons/bi";
import { TfiMenuAlt } from "react-icons/tfi";
import { useNavigate, useLocation } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import "../assets/styles/layout.css";
import { IoCarSharp } from "react-icons/io5";
import { MdSubscriptions, MdLogout } from "react-icons/md";
import menucar_icon from "../assets/images/menucariocn.png";
import { loginApi } from "../services/api";
import PropTypes from 'prop-types';
import Right from "../assets/images/Right.svg";
import { IoMdSettings } from "react-icons/io";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
const { Header, Sider, Content } = Layout;

function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isCreateNewAdmin = location.pathname === "/createNewAdmin";


  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
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
      key: "/listingmanagement",
      icon: <TfiMenuAlt />,
      label: "Listing Management",
      hasDropdown: true,
    children: [
      {
        key: "/listingmanagement/bestcars", 
         icon: <FaStar />,
        label: "Best Cars",
      },
      {
        key: "/listingmanagement", 
        icon: <FaCarAlt />,
        label: "All Listings",
      },
    ],
    },
     {
    key: "/financials",  
    icon: <FaDollarSign />,
    label: "Financials",
    hasDropdown: true,
    children: [
      {
        key: "/financials/pricing", 
        label: "Pricing",
      },
      {
        key: "/financials/transactions", 
        label: "Transactions",
      },
    ],
  },
  {
    key: "/user-management", 
    icon: <FaUsers />,
    label: "User Management",
    hasDropdown: true,
    children: [
      {
        key: "/user-management/individual", 
        label: "Individual",
      },
      {
        key: "/user-management/dealer", 
        label: "Dealer",
      },
      {
        key: "/Admins", 
        label: "Admin",
      },
    ],
  },
    {
      key: "",
      icon: <BiSupport />,
      label: "Support",
    },
    {
      key: "/settings",
      icon: <IoMdSettings />,
      label: "Settings",
    },
    {
  key: "",
  label: (
    <span style={{ color: "red", display: "flex", alignItems: "center", gap: "8px" }} onClick={() => setLogoutModalOpen(true)}>
      <MdLogout style={{ color: "red" }} />
      Logout
    </span>
  ),
},

  ];

  const headerTitles = {
  "/dashboard": {
    title: "Dashboard",
    tagline: "Overview of all metrics and statistics",
  },
  "/listingmanagement": {
    title: "Listing Management",
    tagline: "Review and moderate vehicle listings",
  },
  "/listingmanagement/bestcars": {
    title: "Best Cars",
    tagline: "Manage and highlight outstanding vehicle listings",
  },
  "/financials": {
    title: "Financials",
    tagline: "View financial transactions and pricing",
  },
  "/financials/pricing": {
    title: "Pricing",
    tagline: "Manage pricing plans and rates",
  },
  "/financials/transactions": {
    title: "Transactions",
    tagline: "Track all financial transactions",
  },
  "/user-management": {
    title: "User Management",
    tagline: "Manage individual and dealer users",
  },
  "/user-management/individual": {
    title: "User Management - Individual",
    tagline: "Manage individual user accounts and monitor platform activity",
  },
  "/user-management/dealer": {
    title: "Dealer Users",
    tagline: "Manage dealer user accounts",
  },
  "/Admins": {
    title: "User Management",
    tagline: "Manage admin accounts and permissions",
  },
  "/settings": {
    title: "Support",
    tagline: "Get help and support for the portal",
  },
};

// In the Header section
const currentHeader = headerTitles[location.pathname] || {
  title: "Dashboard",
  tagline: "",
};
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

  const userlogoutAPI = async () => {
    try {
      setLoading(true);
      const response = await loginApi.logout();
      const userData = response?.data || response;
      if (response.status_code === 200 || userData.status_code === 200) {
          localStorage.clear();
          navigate("/");
          setTimeout(() => {
          messageApi.open({ type: 'success', content: response.message });
          }, 300);
    } else {
       messageApi.open({ type: 'error', content: response.error });
    }
    } catch (error) {
      console.error("Error during logout", error);
      message.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // User Logout API

  const handleLogout = async () => {
    try {
      const response = await loginApi.logout({});
      const data1 = handleApiResponse(response);
      localStorage.clear();
      navigate("/");
      messageApi.open({
        type: 'success',
        content: data1?.message,
      });
     
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: 'error',
        content: errorData?.error,
      });
    }
  };

  // Check if current route is listing details to hide header
  const isListingDetails = location.pathname.startsWith('/listingdetails/');

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
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
      <div
  className="logo-container"
  style={{
    display: 'flex',
    alignItems: 'center', 
    gap: '10px',          
    flexDirection: 'row',
  }}
>
  {/* Car Icon */}
  <img
    src={menucar_icon}
    alt="Car"
    style={{
      width: '40px',
      height: '40px',
    }}
  />

  {/* Text Section */}
  {!collapsed && (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.2',
      }}
    >
      <h3 className="logo-text" style={{ margin: 0 }}>
        Souq Sayarat
      </h3>
      <p
        className="logo-subtext"
        style={{
          margin: 0,
          fontSize: '14px',
          color: '#6B7280',
        }}
      >
        Admin Portal
      </p>
    </div>
  )}
</div>
        <Menu
          theme="light"
           mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItemsWithTooltips}
          onClick={handleMenuClick}
          className="sidebar-menu"
            style={{
    fontSize: "13px",
    fontWeight: 500,
  }}
        />
      </Sider>
      <Layout>
        {/* Top Header - Conditionally rendered */}
        {!isListingDetails && (
          <Header className="header">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="d-flex align-items-center">
               {!isCreateNewAdmin && (
                 <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={toggleCollapsed}
                  className="trigger-btn"
                 />
                )}
                
                <div className="search-container ms-3">
                 {isCreateNewAdmin ? (
                  <Breadcrumb
                   separator={
                    <img
                     src={Right}
                     alt=""
                     //style={{ width: 12, height: 12, margin: "0 4px" }}
                    />
                    }
                    items={[
                      { title: "User Management" },
                      {
                        title: (
                          <span
                            style={{ cursor: "pointer"}}
                            onClick={() => navigate("/Admins")}
                          >
                            Admin Users
                          </span>
                        ),
                      },
                      { title: "Create New Admin User" },
                    ]}
                  />
                ) : (

                  <div>
                    <div
                      className="card-number-total"
                      style={{
                        color: "#000000",
                        fontSize: "20px",
                        fontWeight: "700",
                        lineHeight: "24px",
                      }}
                    >
                      {currentHeader.title}
                    </div>
                    <div
                      className="card-number-name"
                      style={{
                        color: "#6B7280",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "20px",
                      }}
                    >
                      {currentHeader.tagline}
                    </div>
                  </div>
                )}
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
        )}
        {/* Main Content */}
        <Content className="content">{children}</Content>
      </Layout>
      <Modal
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        footer={null}
        title={
          <div className="brand-modal-title-row">
            <span style={{ textAlign: 'center', margin: '15px 0px 0px 15px', fontWeight: 700 }}>
              Are you sure you want to log out?
            </span>
          </div>
        }
        width={350}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '2px', marginTop: '15px' }}>
          <Button
            onClick={() => setLogoutModalOpen(false)}
            style={{
              width: 120,
              backgroundColor: '#ffffff',
              color: '#008AD5',
              borderColor: '#008AD5',
              borderWidth: 1,
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '24px',
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setLogoutModalOpen(false);
              handleLogout();
            }}
            style={{
              width: 120,
              backgroundColor: '#008AD5',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '24px',
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}
AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppLayout;
