import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Descriptions,
  Divider,
  Tag,
  Avatar,
  Button,
  Typography,
  message,
} from "antd";
import { userAPI } from "../services/api";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import {
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendar,
  FaMapMarkerAlt,
} from "react-icons/fa";

const { Text } = Typography;

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomersIdData(id);
  }, [id]);

  const fetchCustomersIdData = async (id) => {
    try {
      setLoading(true);
      const response = await userAPI.adminGetUserSummary(Number(id));
      const result = handleApiResponse(response);

      if (result?.data) {
        setCustomer(result.data);
        console.log("Fetched data:", result.data);
      }
      message.success(result.message || "Fetched successfully");
    } catch (error) {
      const errorData = handleApiError(error);
      message.error(errorData.message || "Failed to load customer data");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return <p>Loading customer details...</p>;

  return (
    <div className="content-wrapper" style={{ padding: "24px" }}>
      <Button onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
        ← Back
      </Button>

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}
      >
        <Avatar
          src={customer.profile_pic}
          size={64}
          style={{ marginRight: "16px" }}
        >
          {customer.name.charAt(0)}
        </Avatar>
        <div>
          <h2 style={{ margin: 0 }}>{customer.name}</h2>
          <p style={{ margin: 0, color: "#666" }}>{customer.company_name}</p>
        </div>
      </div>

      <Descriptions bordered column={2}>
        <Descriptions.Item label="Company Phone">
          <FaPhone style={{ marginRight: 8 }} />
          {customer.phone_number}
        </Descriptions.Item>
        <Descriptions.Item label="Verification Status">
          <Tag
            color={
              customer.is_verified === "verified"
                ? "green"
                : customer.is_verified === "pending"
                ? "orange"
                : "red"
            }
          >
            {customer.is_verified}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Registered Since">
          <FaCalendar style={{ marginRight: 8 }} />
          {customer.registered_since}
        </Descriptions.Item>
        <Descriptions.Item label="Company Address" span={2}>
          <FaMapMarkerAlt style={{ marginRight: 8 }} />
          {customer.company_address}
        </Descriptions.Item>
        <Descriptions.Item label="Ban Reason" span={2}>
          <Tag
            color={
              customer.is_banned === 0
                ? "green"
                : customer.is_banned === 1
                ? "orange"
                : "red"
            }
          >
            {customer.is_banned === 0 ? "Not Banned" : "Banned"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Company Registration No.">
          {customer.company_registration_number}
        </Descriptions.Item>
        <Descriptions.Item label="Facebook">
          <a href={customer.facebook_page} target="_blank" rel="noreferrer">
            Facebook Page
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="Instagram">
          <a
            href={customer.instagram_company_profile}
            target="_blank"
            rel="noreferrer"
          >
            Instagram Profile
          </a>
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions title="Listing Stats" bordered column={3}>
        <Descriptions.Item label="Total">
          {customer.listing_stats.total}
        </Descriptions.Item>
        <Descriptions.Item label="Active">
          {customer.listing_stats.active}
        </Descriptions.Item>
        <Descriptions.Item label="Pending">
          {customer.listing_stats.pending}
        </Descriptions.Item>
        <Descriptions.Item label="Rejected">
          {customer.listing_stats.rejected}
        </Descriptions.Item>
        <Descriptions.Item label="Sold">
          {customer.listing_stats.sold}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}

export default CustomerDetails;
