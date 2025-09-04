import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Descriptions,
  Divider,
  Tag,
  Avatar,
  Button,
  message,
  Radio,
  Modal
} from "antd";
import { userAPI } from "../services/api";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import {
  FaPhone,
  FaCalendar,
  FaMapMarkerAlt,
} from "react-icons/fa";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [, setLoading] = useState(false);
  const [radioValue, setRadioValue] = useState(null);
  const [, setVerifiedFlag] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalText, setModalText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRadio, setSelectedRadio] = useState(null);

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
       const defaultStatus =
        result.data.is_verified === "pending" ? "non_verified" : result.data.is_verified;

      setRadioValue(defaultStatus);
      }
      messageApi.open({ type: 'success', content: result.message});
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({ type: 'error', content: errorData});
    } finally {
      setLoading(false);
    }
  };

  const handleRadioChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedRadio(selectedValue)

    if (selectedValue === "verified") {
      setModalText("Are you sure you want to verify the user?");
      setIsModalVisible(true);
    } else {
      setModalText("Are you sure you want to reject the user?");
      setIsModalVisible(true);
    }
  };

 const handleConfirm = async (id, value = null) => {
  const statusToSend = value || selectedRadio;

  setIsModalVisible(false);
  setRadioValue(statusToSend); 

  const body = {
    verification_status: statusToSend,
  };

  try {
    setLoading(true);
    const response = await userAPI.adminVerifyUserData(Number(id), body);
    const cardetail = handleApiResponse(response);
    if (cardetail) {
      setVerifiedFlag(cardetail);
      fetchCustomersIdData(cardetail.user.id);
    }
    messageApi.open({ type: 'success', content: cardetail.message });
  } catch (error) {
    const errorData = handleApiError(error);
    messageApi.open({ type: 'error', content: errorData });
  } finally {
    setLoading(false);
  }
};


  const getStatusColor = (status) => {
    if (status === "verified") return "green";
    if (status === "pending") return "orange";
    return "red";
  };

  const banStatusMap = {
  0: { color: "green", label: "Not Banned" },
  1: { color: "orange", label: "Banned" },
  };

  const { color, label } = banStatusMap[customer.is_banned] || {
  color: "red",
  label: "Unknown",
  };

   const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (!customer) return <p>Loading customer details...</p>;

  return (
    <div className="content-wrapper" style={{ padding: "24px" }}>
      {contextHolder}
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


<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
     width: "100%",
  }}
>
  <div>
    <h2 style={{ margin: 0 }}>{customer.name}</h2>
    <p style={{ margin: 0, color: "#666" }}>{customer.company_name}</p>
  </div>

  <Radio.Group
    onChange={handleRadioChange}
        value={radioValue}
      >
    <Radio value="verified">
        Verify
      </Radio>
      <Radio value="rejected" >
        Reject
      </Radio>
       {customer.is_verified === "pending" && (
        <Radio value="non_verified">Non Verified</Radio>
       )}
      
  </Radio.Group>
</div>

      </div>

       <Modal
        title="Confirmation"
        visible={isModalVisible}
        onOk={() => handleConfirm(id)}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>{modalText}</p>
      </Modal>

      <Descriptions bordered column={2}>
        <Descriptions.Item label="Company Phone">
          <FaPhone style={{ marginRight: 8 }} />
          {customer.phone_number}
        </Descriptions.Item>
        <Descriptions.Item label="Verification Status">
          <Tag color={getStatusColor(customer.is_verified)}>
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
         <Tag color={color}>{label}</Tag>
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
         <Descriptions.Item label="Document">
          <a
            href={customer.document}
            target="_blank"
            rel="noreferrer"
          >
            Document
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
