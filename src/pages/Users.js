import React, { useState } from "react";
import { 
  Table, 
  Avatar, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Popconfirm,
  Descriptions,
  Divider
} from "antd";
import { FaEdit, FaTrash, FaEye, FaUser, FaEnvelope, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const { Option } = Select;

function Users() {
  const [users, setUsers] = useState([
    {
      key: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-01-15 10:30",
      avatar: "https://via.placeholder.com/40",
      phone: "+1-555-0123",
      department: "IT",
      joinDate: "2023-01-15",
      permissions: ["read", "write", "delete", "admin"]
    },
    {
      key: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Manager",
      status: "Active",
      lastLogin: "2024-01-14 15:45",
      avatar: "https://via.placeholder.com/40",
      phone: "+1-555-0124",
      department: "Marketing",
      joinDate: "2023-03-20",
      permissions: ["read", "write"]
    },
    {
      key: "3",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      role: "User",
      status: "Inactive",
      lastLogin: "2024-01-10 09:15",
      avatar: "https://via.placeholder.com/40",
      phone: "+1-555-0125",
      department: "Sales",
      joinDate: "2023-06-10",
      permissions: ["read"]
    },
  ]);

  

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm] = Form.useForm();

  const roleColor =
  selectedUser.role === "Admin"
    ? "red"
    : selectedUser.role === "Manager"
    ? "blue"
    : "green";

  // Handle edit user
  const handleEdit = (record) => {
    setSelectedUser(record);
    editForm.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
      status: record.status,
      phone: record.phone,
      department: record.department
    });
    setEditModalVisible(true);
  };

  // Handle view user details
  const handleView = (record) => {
    setSelectedUser(record);
    setViewModalVisible(true);
  };

  // Handle delete user
  const handleDelete = (record) => {
    setUsers(users.filter(user => user.key !== record.key));
    message.success('User deleted successfully');
  };

  // Handle edit form submission
  const handleEditSubmit = (values) => {
    const updatedUsers = users.map(user => 
      user.key === selectedUser.key 
        ? { ...user, ...values }
        : user
    );
    setUsers(updatedUsers);
    setEditModalVisible(false);
    setSelectedUser(null);
    editForm.resetFields();
    message.success('User updated successfully');
  };

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar src={record.avatar} style={{ marginRight: 8 }}>
            {text.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
  // Determine tag color based on role
  let tagColor;
  if (role === "Admin") {
    tagColor = "red";
  } else if (role === "Manager") {
    tagColor = "blue";
  } else {
    tagColor = "green";
  }

  return <Tag color={tagColor}>{role}</Tag>;
}

    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<FaEye />} 
            size="small"
            onClick={() => handleView(record)}
            title="View Details"
          />
          <Button 
            type="text" 
            icon={<FaEdit />} 
            size="small"
            onClick={() => handleEdit(record)}
            title="Edit User"
          />
          <Popconfirm
            title="Delete User"
            description="Are you sure you want to delete this user? This action cannot be undone."
            onConfirm={() => handleDelete(record)}
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
        </Space>
      ),
    },

    
  ];

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h2>Users</h2>
        <p>Manage your application users</p>
      </div>

      <div className="content-body">
        <div className="card">
          <div className="card-body">
            <Table
              columns={columns}
              dataSource={users}
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedUser(null);
          editForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter full name' }]}
              style={{ flex: 1 }}
            >
              <Input prefix={<FaUser />} placeholder="Enter full name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter valid email' }
              ]}
              style={{ flex: 1 }}
            >
              <Input prefix={<FaEnvelope />} placeholder="Enter email" />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select role' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Select role">
                <Option value="Admin">Admin</Option>
                <Option value="Manager">Manager</Option>
                <Option value="User">User</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Select status">
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="phone"
              label="Phone"
              style={{ flex: 1 }}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item
              name="department"
              label="Department"
              style={{ flex: 1 }}
            >
              <Input placeholder="Enter department" />
            </Form.Item>
          </div>

          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <Space>
              <Button 
                onClick={() => {
                  setEditModalVisible(false);
                  setSelectedUser(null);
                  editForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update User
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* View User Details Modal */}
      <Modal
        title="User Details"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedUser(null);
        }}
        footer={[
          <Button 
            key="close" 
            onClick={() => {
              setViewModalVisible(false);
              setSelectedUser(null);
            }}
          >
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedUser && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <Avatar 
                src={selectedUser.avatar} 
                size={64}
                style={{ marginRight: '16px' }}
              >
                {selectedUser.name.charAt(0)}
              </Avatar>
              <div>
                <h3 style={{ margin: 0 }}>{selectedUser.name}</h3>
                <p style={{ margin: 0, color: '#666' }}>{selectedUser.email}</p>
              </div>
            </div>


            <Descriptions bordered column={2}>

<Descriptions.Item label="Role" span={1}>
  
  <Tag color={roleColor}>{selectedUser.role}</Tag>
</Descriptions.Item>

              <Descriptions.Item label="Status" span={1}>
                <Tag color={selectedUser.status === "Active" ? "green" : "orange"}>
                  {selectedUser.status === "Active" ? (
                    <span><FaCheckCircle style={{ marginRight: '4px' }} />Active</span>
                  ) : (
                    <span><FaTimesCircle style={{ marginRight: '4px' }} />Inactive</span>
                  )}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phone" span={1}>
                {selectedUser.phone || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Department" span={1}>
                {selectedUser.department || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Join Date" span={1}>
                {selectedUser.joinDate}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login" span={1}>
                {selectedUser.lastLogin}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <div>
  <h4>Permissions</h4>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
    {selectedUser.permissions.map((permission) => (
      <Tag key={permission} color="blue">
        {permission}
      </Tag>
    ))}
  </div>
</div>

          </div>
        )}
      </Modal>
    </div>
  );
}

export default Users;
