import React, { useEffect, useState } from "react";
import {
  Descriptions,
  Typography,
  Spin,
  message,
  Card,
  Avatar,
  Empty,
} from "antd";
import { FaUserCircle } from "react-icons/fa";
import { userAPI } from "../services/api";
const { Title } = Typography;
function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUserProfile = async () => {
    try {
      const response = await userAPI.userprofile(); // Adjust this to match your actual API function
      const data = response?.admin || response?.data?.admin;
      console.log("User Data:", data);
      if (data) {
        setProfileData(data);
      } else {
        message.error("Failed to load profile data.");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      message.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);
  if (loading) {
    return (
      <Spin
        tip="Loading Profile..."
        style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
      />
    );
  }
  if (!profileData) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="No profile data available" />
      </div>
    );
  }
  return (
    <Card style={{ margin: 24 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <Avatar size={64} icon={<FaUserCircle />} style={{ marginRight: 16 }} />
        <Title level={3}>
          {profileData.first_name} {profileData.last_name}
        </Title>
      </div>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Email">{profileData.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">
          {profileData.phone_number}
        </Descriptions.Item>
        <Descriptions.Item label="Designation">
          {profileData.designation}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(profileData.created_at).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
export default Profile;
