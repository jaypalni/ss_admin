import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import "../assets/styles/otp.css";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/api";
import { Table, message, Button, Popconfirm } from "antd";
import editIcon from "../assets/images/edit.svg";
import plusIcon from "../assets/images/plus_icon.svg";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import { FaTrash } from "react-icons/fa";
import { useSelector } from 'react-redux';

const ActionButtons = ({ record, onEdit, onDelete }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
    <button
      style={{
        backgroundColor: "#E5E7EB",
        color: "#374151",
        border: "none",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "400",
        display: "flex",
        alignItems: "center",
        gap: 3,
      }}
      onClick={() => onEdit(record.key)}
    >
      <img src={editIcon} alt="edit" style={{ width: "12px", height: "12px" }} />
      <span>Edit</span>
    </button>

    <Popconfirm
      title="Delete User"
      description="Are you sure you want to delete this user?"
      onConfirm={() => onDelete(record.key)}
      okText="Yes"
      cancelText="No"
      okType="danger"
    >
      <Button
        type="text"
        icon={<FaTrash />}
        size="small"
        danger
        title="Delete User"
      />
    </Popconfirm>
  </div>
);

ActionButtons.propTypes = {
  record: PropTypes.shape({
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const GetAdminsData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [tableData, setTableData] = useState([]);

  const { user, token } = useSelector(state => state.auth);
  const isLoggedIn = token && user;

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetchAdminData(1, pagination.pageSize);
  }, []);

  const fetchAdminData = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await loginApi.getadmindata(page, limit);
      const data = handleApiResponse(response);

      if (data?.admins) {
        const formattedData = data.admins.map((item) => ({
          key: item.id,
          firstname: item.first_name,
          lastname: item.last_name,
          emailaddress: item.email,
          lastlogin: item.last_login,
        }));

        setTableData(formattedData);

        setPagination({
          current: data.pagination.current_page,
          pageSize: data.pagination.limit,
          total: data.pagination.total_cars,
        });
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: "error",
        content: errorData?.message || "Failed to fetch admins",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await loginApi.deletedata(id);
      const data = handleApiResponse(response);

      if (data?.status_code === 200) {
        messageApi.success(data?.message);
        fetchAdminData(pagination.current, pagination.pageSize);
      } else {
        messageApi.error(data?.message || "Failed to delete data");
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({
        type: "error",
        content: errorData?.message || "Failed to delete user",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/createNewAdmin/${id}`);
  };

  const handleTableChange = (paginationInfo) => {
    fetchAdminData(paginationInfo.current, paginationInfo.pageSize);
  };

  const columns = [
    { title: 'ID', dataIndex: 'key', key: 'key' },
    { title: 'First Name', dataIndex: 'firstname', key: 'firstname' },
    { title: 'Last Name', dataIndex: 'lastname', key: 'lastname' },
    { title: 'Email Address', dataIndex: 'emailaddress', key: 'emailaddress' },
    { title: 'Last Login', dataIndex: 'lastlogin', key: 'lastlogin' },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <ActionButtons
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "600", color: "#1F2937", marginBottom: "2px" }}>Admin Users</h1>
          <p style={{ fontSize: "15px", color: "#4B5563", margin: 0, fontWeight: "400" }}>
            Manage administrator accounts and their access levels
          </p>
        </div>

        <button
          style={{
            backgroundColor: "#008AD5",
            color: "white",
            border: "none",
            padding: "6px 24px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
          onClick={() => navigate("/createNewAdmin")}
        >
          <img src={plusIcon} alt="add" style={{ width: "12px", height: "12px" }} />
          <span>Add New Admin</span>
        </button>
      </div>

      <Table
        dataSource={tableData}
        columns={columns}
        rowKey="key"
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false,
          showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} results`,
        }}
      />
    </div>
  );
};

export default GetAdminsData;
