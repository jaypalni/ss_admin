import React, { useState } from "react";
import { Layout, Menu, Button, Avatar, Dropdown, Tooltip, message, Modal } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LockOutlined,
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
import dashboard_icon from "../assets/images/dashboard_icon.svg";
import { IoMdSettings } from "react-icons/io";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import { useSelector } from "react-redux";
const { Header, Sider, Content } = Layout;

function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const {user,role} = useSelector((state) => state.auth);
  const location = useLocation();

  const pathname = location.pathname || "/";
  const pathSegments = pathname.split("/").filter(Boolean);
  const routeBase = pathSegments[0] ? pathSegments[0].toLowerCase() : "";

  const isCreateRoute = routeBase === "createadmin" || routeBase === "createnewadmin";
  const hasId = pathSegments.length > 1 && pathSegments[1] !== "" && pathSegments[1] !== "undefined" && pathSegments[1] !== "null";

  const isEdit = isCreateRoute && hasId;       
  const isCreateNewAdmin = isCreateRoute && !hasId;


  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

const headerHeight = 64; 
const expandedSiderWidth = 200; 
const collapsedSiderWidth = 55;
const siderWidth = collapsed ? collapsedSiderWidth : expandedSiderWidth;

  console.log("1234562345",role)
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  
  const superAdmin = Number(localStorage.getItem("isSuperAdmin"));
  console.log("Superdamin", superAdmin);

  const userMenuItems = [
    {
      key: "profile",
      icon: <FaUserCircle />,
      label: "Profile",
    },

    ...(role === "super admin"
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
      icon:  <img src={dashboard_icon} alt="Dashboard" style={{ width: 12, height: 12 }} />,
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
      ...(role === "super admin"
      ? [
          {
        key: "/Admins", 
        label: "Admin",
      },
        ]
      : []),
      
    ],
  },
    {
      key: "",
      icon: <BiSupport />,
      label: "Support",
    },
    {
      key: "/accountsettings",
      icon: <FaCog />,
      label: "Settings",
      hasDropdown: true,
      children: [
      {
        key: "/accountsettings/changepassword", 
        label: "Change Password",
      },
    ],
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
  "/accountsettings": {
    title: "Account Settings",
    tagline: "Manage your password and security settings",
  },
};

const currentHeader =
  headerTitles[location.pathname] ||
  headerTitles[`/${pathSegments[0]}/${pathSegments[1]}`] ||
  headerTitles[`/${pathSegments[0]}`] ||
  {
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

  const handleMenuClick = ({ key }) => {
    if (key === "logoutBottom") {
      setLogoutModalOpen(true);
      return;
    }
    navigate(key);
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === "logout") {
      setLogoutModalOpen(true);
      return;
    }
    if (key === "profile") navigate("/profile");
    if (key === "subadmin") navigate("/createNewAdmin");
    if (key === "settings") navigate("/accountsettings/changepassword");
  };

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
let breadcrumbItems = null;
if (isCreateNewAdmin) {
  breadcrumbItems = [
    { title: "User Management" },
    {
      title: (
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/Admins")}>
          Admin Users
        </span>
      ),
    },
    { title: "Create New Admin User" },
  ];
} else if (isEdit) {
  breadcrumbItems = [
    { title: "User Management" },
    {
      title: (
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/Admins")}>
          Admin Users
        </span>
      ),
    },
    { title: "Edit Admin User" },
  ];
}
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
        {!isListingDetails && (
          <Header className="header">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="d-flex align-items-center">
               {!breadcrumbItems && (
                 <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={toggleCollapsed}
                  className="trigger-btn"
                 />
                )}
                
                <div className="search-container ms-3">
                 {breadcrumbItems ? (
                  <Breadcrumb
                  separator={<img src={Right} alt="" />}
                  items={breadcrumbItems}
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
                    onClick: handleUserMenuClick,
                  }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="user-profile">
                    <Avatar icon={<UserOutlined />} className="user-avatar" />
                    {/* {!collapsed && ( */}
                    <span className="user-name ms-2">{user}</span>
                    {/* )} */}
                  </div>
                </Dropdown>
              </div>
            </div>
          </Header>
        )}
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
