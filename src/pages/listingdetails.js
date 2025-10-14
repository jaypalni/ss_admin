import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Card, Button, Tag, Row, Col, Avatar, Divider, Modal, Select, Input, message, Breadcrumb, Switch } from "antd";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import crownicon from "../assets/images/crown_icon.png";
import boosticon from "../assets/images/boosticon.png";
import { FaCalendar } from "react-icons/fa";
import approveIcon from "../assets/images/tick_icon.png"; 
import rejectIcon from "../assets/images/cross_icon.png";
import greentickicon from "../assets/images/greentick_icon.png"
import "../assets/styles/listingdetails.css";
import { userAPI } from "../services/api";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import shareicon from "../assets/images/share_icon.png";
import { useSelector } from 'react-redux';
import PropTypes from "prop-types";

const getApprovalStatusStyle = (approval) => {
  if (approval === "approved") {
    return {
      backgroundColor: "#d4edda",
      color: "#155724",
      border: "1px solid #c3e6cb",
    };
  }
  if (approval === "rejected") {
    return {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      border: "1px solid #f5c6cb",
    };
  }
  return {
    backgroundColor: "#fff3cd",
    color: "#856404",
    border: "1px solid #ffeaa7",
  };
};

const getApprovalStatusText = (approval) => {
  return approval === "pending" ? "Pending Review" : approval || "Pending";
};

const getBoostStatusStyle = (isFeatured) => {
  return {
    backgroundColor: isFeatured === 1 ? "#DCFCE7" : "#FFF4E5",
    color: isFeatured === 1 ? "#166534" : "#B45309",
    borderRadius: "22px",
    border: "none",
    padding: "2px 10px",
    fontWeight: 500,
  };
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const validateRejectionReason = (rejectionReason, rejectReasonData, comment, messageApi) => {
  if (!rejectionReason) {
    messageApi.open({ type: "warning", content: "Please select a rejection reason." });
    return false;
  }

  const selectedReason = rejectReasonData.find((r) => r.id === rejectionReason);

  if (selectedReason?.rejected_reason.toLowerCase() === "other" && !comment?.trim()) {
    messageApi.open({ type: "warning", content: "Please add a comment for 'Other' reason." });
    return false;
  }

  return true;
};

const ApprovalStatusTag = ({ approval }) => {
  const style = getApprovalStatusStyle(approval);
  const text = getApprovalStatusText(approval);
  
  return (
    <Tag
      style={{
        ...style,
        borderRadius: 6,
        padding: "4px 12px",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      {text}
    </Tag>
  );
};

const BoostStatus = ({ isFeatured }) => {
  const style = getBoostStatusStyle(isFeatured);
  
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Tag style={style}>
        {isFeatured === 1 ? "Active" : "Not Active"}
      </Tag>
      {isFeatured === 1 && (
        <img
          src={boosticon}
          alt="Boost Icon"
          style={{ width: 18, height: 18, marginLeft: 6 }}
        />
      )}
    </div>
  );
};

BoostStatus.propTypes = { isFeatured: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]).isRequired };

const TimelineItem = ({ label, date, color, isPending = false }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12, gap: 8 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 12,
            backgroundColor: color,
          }}
        />
        <strong>{label}:</strong>
      </div>
      <span style={{ marginRight: 12, color: isPending ? '#9CA3AF' : 'inherit' }}>
        {date}
      </span>
    </div>
  );
};

TimelineItem.propTypes = {
  label: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  isPending: PropTypes.bool,
};
TimelineItem.defaultProps = { isPending: false };

const ActionButtons = ({ approval, isBestCar, setIsBestCar, handleApprove, handleReject, handleMarkAsBest, loading, rejectionReason, comment }) => {
  if (approval === "rejected") {
    return (
      <div
        style={{
          backgroundColor: "#fff6f6",
          border: "1px solid #ffa39e",
          borderRadius: "8px",
          padding: "12px 16px",
          color: "#cf1322",
          lineHeight: "1.6",
        }}
      >
        <p style={{ marginBottom: "8px", fontWeight: 500 }}>
          <strong>Rejection Reason:</strong> {rejectionReason || "Not specified"}
        </p>
        {comment && (
          <p style={{ marginBottom: 0 }}>
            <strong>Comments:</strong> {comment}
          </p>
        )}
      </div>
    );
  }

  if (approval === "approved") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Switch
          checked={isBestCar}
          onChange={(checked) => {
            setIsBestCar(checked);
            handleMarkAsBest(checked ? 1 : 0);
          }}
          style={{
            backgroundColor: isBestCar ? "#52c41a" : "#d9d9d9",
          }}
        />
        <span style={{ fontSize: "16px", fontWeight: 500 }}>Mark as Best Car</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Button
        type="primary"
        block
        onClick={handleApprove}
        loading={loading}
        style={{
          backgroundColor: "#28a745",
          borderColor: "#28a745",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontWeight: 500,
        }}
      >
        <img src={approveIcon} alt="approve" style={{ width: 16, height: 16,display: "inline-block" }} />
        Approve Listing
      </Button>

      <Button
        danger
        block
        onClick={handleReject}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          backgroundColor: "#DC2626",
          borderColor: "#DC2626",
          color: "#fff",
          fontWeight: 500,
        }}
      >
        <img src={rejectIcon} alt="reject" style={{ width: 16, height: 16,display: "inline-block" }} />
        Reject Listing
      </Button>
    </div>
  );
};
ActionButtons.propTypes = {
  approval: PropTypes.string,
  isBestCar: PropTypes.bool.isRequired,
  setIsBestCar: PropTypes.func.isRequired,
  handleApprove: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
  handleMarkAsBest: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  rejectionReason: PropTypes.string,
  comment: PropTypes.string,
};

ActionButtons.defaultProps = { approval: "pending", loading: false, rejectionReason: "", comment: "" };

const ListingDetails = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
const [rejectionReason, setRejectionReason] = useState(null);
const [comment, setComment] = useState("");
const [loading, setLoading] = useState(false);
const [messageApi, contextHolder] = message.useMessage();
const [rejectReasonData, setRejectReasonData] = useState([]);
  const [carDetails, setCarDetails] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const fetchCalled = useRef(false)
  const [isBestCar, setIsBestCar] = useState(false);
  const { user,token } = useSelector(state => state.auth);
  const isLoggedIn = token && user
  const { confirm } = Modal;
   useEffect(() => {
    console.log('OTP Screen useEffect - isLoggedIn:', isLoggedIn);
    
    if (!isLoggedIn) {
      navigate('/');
    } else {
      console.log('User not logged in or coming from login flow, staying on OTP screen');
    }
  }, [isLoggedIn, navigate]);

const showRejectModal = () => {
    getReasonRejection();
  setIsRejectModalVisible(true);
};

const handleRejectCancel = () => {
  setIsRejectModalVisible(false);
  setRejectionReason(null);
  setComment("");
};

const handleRejectSubmitConfirm = () => {
  Modal.confirm({
    title: "Are you sure you want to reject this listing?",
    content: "This action cannot be undone.",
    okText: "Yes, Reject",
    okType: "danger",
    cancelText: "Cancel",
    onOk() {
      handleRejectSubmit();
    },
    getContainer: () => document.body, 
  });
};


const getReasonRejection = async () => {
  try {
  
    const response = await userAPI.reasonRejection();
    const result = handleApiResponse(response);

    if (result?.data?.rejection_reasons) {
      setRejectReasonData(result.data.rejection_reasons);
    } else {
      setRejectReasonData([]);
    }
  } catch (error) {
    const errorData = handleApiError(error);
    messageApi.open({ type: "error", content: errorData });
    setRejectReasonData([]);
  } finally {
    
  }
};

// Car Details Api

useEffect(() => {
  if (!listingId || fetchCalled.current) return;

  fetchCalled.current = true;

  const fetchCarDetails = async () => {
    try {
      
      const response = await userAPI.getCarById(Number(listingId));
      const result = handleApiResponse(response);
      if (result?.data) {
        setCarDetails(result.data);
        console.log('Mark as bes', result?.data?.is_best_pick)
        setIsBestCar(result?.data?.is_best_pick === "1"); // Initialize toggle state
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({ type: "error", content: errorData.error || "Error fetching car details" });
    } finally {
      
    }
  };

  fetchCarDetails();
}, [listingId]);
  

  const handleRejectSubmit = async () => {
    if (!validateRejectionReason(rejectionReason, rejectReasonData, comment, messageApi)) {
      return;
    }

    const selectedReason = rejectReasonData.find((r) => r.id === rejectionReason);

    try {
      const body = {
        car_id: listingId,
        rejection_reason: selectedReason?.rejected_reason,
        admin_rejection_comment: comment || "",
      };

      const response = await userAPI.rejectcar(body);
      const data = handleApiResponse(response);

      if (data.status_code === 200) {
        messageApi.open({ type: "success", content: data.message });
        setIsRejectModalVisible(false);
         setTimeout(() => {
      navigate("/listingmanagement");
    }, 1000);
      } else {
        messageApi.open({ type: "error", content: data?.message || "Failed to reject car" });
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({ type: "error", content: errorData.message || "Failed to reject car" });
    }
  };

const handleapproveapi = async () => {
  try {
    setLoading(true);
    const body = { car_id: listingId };
    const response = await userAPI.approvecar(body);
    const data = handleApiResponse(response);

    if (data.status_code === 200) {
      if (data?.message) {
        messageApi.open({ type: "success", content: data.message });
         setTimeout(() => {
      navigate("/listingmanagement");
    }, 1000);
      }
    } else {
      messageApi.open({ type: "error", content: data?.message || "Failed to approve car" });
    }
  } catch (error) {
    const errorData = handleApiError(error);
    messageApi.open({ type: "error", content: errorData.message || 'Failed to approve car' });
  } finally {
    setLoading(false);
  }
};

// Mark as Best API

const handleMarkAsBestApi = async (isBestPickValue) => {
  try {
    setLoading(true);

    const body = { 
      car_id: listingId, 
      is_best_pick: isBestPickValue 
    };

    const response = await userAPI.markasbestcar(body);
    const data = handleApiResponse(response);

    if (data.status_code === 200) {
      if (data?.message) {
        messageApi.open({ type: "success", content: data.message });
      }
    } else {
      messageApi.open({ type: "error", content: data?.message || "Failed to mark as best car" });
    }
  } catch (error) {
    const errorData = handleApiError(error);
    messageApi.open({ type: "error", content: errorData.message || 'Failed to mark as best car' });
  } finally {
    setLoading(false);
  }
};


  return (
    <div  style={{
        background: "#f7f7f7",
        padding: 14,
        height: "calc(100vh - 0px)", 
        overflowY: "auto",
        padding: "20px",
      
      }}>
        { contextHolder }
      
      {/* ===== PAGE HEADER SECTION ===== */}
      <div style={{ 
        padding: "0px 0", 
        marginBottom: 24
      }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb
  separator=">"
  style={{ marginBottom: 16 }}
  items={[
    {
      title: (
        <span
          style={{
            color: "#6B7280",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "400",
          }}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </span>
      ),
    },
    {
      title: (
        <span
          style={{
            color: "#6B7280",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "400",
          }}
          onClick={() => navigate("/listingmanagement")}
        >
          Listing Management
        </span>
      ),
    },
    {
      title: (
        <span
          style={{
            color: "#000000",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Listing Details
        </span>
      ),
    },
  ]}
/>
        {/* Header Row */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16
        }}>
          {/* Left Side - Back Button and Page Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/listingmanagement")}
              style={{
                backgroundColor: "#f8f9fa",
                borderColor: "#e9ecef",
                color: "#495057",
                borderRadius: 6,
                fontWeight: 500
              }}
            >
              Back to Listings
            </Button>
            
            <h1 style={{ 
              margin: 0, 
              fontSize: "24px", 
              fontWeight: 600, 
              color: "#212529"
            }}>
              Listing Details
            </h1>
          </div>
          
          {/* Right Side - Status Tag */}
          <ApprovalStatusTag approval={carDetails?.approval} />

        </div>
      </div>

      {/* ===== WRAPPER ROW FOR BOTH LEFT AND RIGHT ===== */}
      <Row gutter={24}>
        {/* ===== LEFT SIDE: Main Content ===== */}
        <Col xs={24} md={18}>
          {/* Listing Reference & Subscription */}
         <Card style={{ marginBottom: 24 }}>
  <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600' }}>
    Listing Reference & Subscription
  </h3>
  <Row gutter={16}>
    {/* Left Column */}
    <Col xs={24} md={12}>
      <div style={{ marginBottom: 16 }}>
        <strong
          style={{
            display: "block",
            marginBottom: 4,
            color: "#6B7280",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          Reference ID:
        </strong>
        <span>{ listingId }</span>
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong
          style={{
            display: "block",
            marginBottom: 4,
            color: "#6B7280",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          Subscription Model:
        </strong>
        <div style={{ display: "flex", alignItems: "center" }}>
  <Tag
    style={{
      backgroundColor: "#DBEAFE",
      color: "#1E40AF",
      borderRadius: "22px",
      border: "none",
      padding: "2px 10px",
      fontWeight: 500,
    }}
  >
    Premium Plus
  </Tag>

  <img
    src={crownicon}
    alt="Crown Icon"
    style={{ width: 18, height: 18 }}
  />
</div>

      </div>
    </Col>

    {/* Right Column */}
    <Col xs={24} md={12}>
      <div style={{ marginBottom: 16 }}>
        <strong
          style={{
            display: "block",
            marginBottom: 4,
            color: "#6B7280",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          Boost Status:
        </strong>
        <BoostStatus isFeatured={carDetails?.is_featured} />

      </div>
      <div style={{ marginBottom: 16 }}>
        <strong
          style={{
            display: "block",
            marginBottom: 4,
            color: "#6B7280",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          Boost Duration:
        </strong>
        <span style={{ fonSize: '16px', fontWeight: '600'}}>
  
</span>

      </div>
    </Col>
  </Row>
</Card>
 {/* Vehicle Images */}
<Card style={{ marginBottom: 24 }}>
  <h3 style={{ marginBottom: 16 }}>Vehicle Images</h3>
  <Row gutter={[16, 16]}>
  {carDetails?.car_image?.length > 0 ? (
    carDetails.car_image.map((imgSrc, index) => (
      <Col xs={12} md={8} key={index}>
        <div
          style={{
            background: "#e0e0e0",
            borderRadius: 8,
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img
            src={`${BASE_URL}${imgSrc}`}
            alt={`Vehicle ${index + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </Col>
    ))
  ) : (
    <p>No images available</p>
  )}
</Row>

</Card>



          {/* Basic Information */}
         <Card style={{ marginBottom: 24 }}>
  <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600' }}>
    Basic Information
  </h3>
  <h2 style={{ marginBottom: 12, fontSize: '20px', fontWeight: '700' }}>
    {carDetails?.ad_title}
  </h2>
  <p
    style={{
      color: "#4B5563",
      marginBottom: 16,
      fontSize: '16px',
      fontWeight: '400'
    }}
  >
    {carDetails?.description}
  </p>

  <Row gutter={24}>
    <Col xs={24} md={12}>
      <h4 style={{ marginBottom: 4, fontSize: '14px', fontWeight: '400', color: '#6B7280' }}>Price</h4>
      <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#2563EB' }}>
  {carDetails?.price ? Number(carDetails.price).toLocaleString('en-US') : '0'} IQD
</p>
    </Col>
    <Col xs={24} md={12}>
      <h4 style={{ marginBottom: 4, fontSize: '14px', fontWeight: '400', color: '#6B7280' }}>Location</h4>
      <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#000000' }}>{carDetails?.location}</p>
    </Col>
  </Row>
</Card>
          {/* Listing Timeline */}
        <Card style={{ marginBottom: 24 }}>
  <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600' }}>
    Listing Timeline
  </h3>

  {/* Timeline Items */}
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <TimelineItem 
      label="Date of Creation" 
      date={formatDate(carDetails?.created_at)} 
      color="#3B82F6" 
    />
    <TimelineItem 
      label="Date of Approval/Reject" 
      date={carDetails?.approval === "pending" ? "Pending" : formatDate(carDetails?.updated_at)} 
      color="#EAB308" 
      isPending={carDetails?.approval === "pending"}
    />
    <TimelineItem 
      label="Date of Sale" 
      date={carDetails?.status === "unsold" ? "Not Sold" : (carDetails?.status === "sold" ? formatDate(carDetails?.updated_at) : "")} 
      color="#D1D5DB" 
      isPending={carDetails?.status === "unsold"}
    />
  </div>
</Card>
          {/* Technical Specifications */}
        <Card style={{ marginBottom: 24 }}>
  <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600' }}>
    Technical Specifications
  </h3>

  <Row gutter={16}>
    <Col xs={24} md={8}>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Vehicle Type</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.vechile_type || 'N/A' }</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Body Type</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.body_type || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Make</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.make || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Model</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.model || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Trim</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.trim || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Regional Specs</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.regional_specs || 'N/A'}</p>
      </div>
    </Col>

    <Col xs={24} md={8}>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Kilometers</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.kilometers || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Year</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.year || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Condition</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.condition || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Fuel Type</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.fuel_type || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Transmission</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.transmission_type || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Exterior Color</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.exterior_color || 'N/A'}</p>
      </div>
    </Col>

    <Col xs={24} md={8}>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Interior Color</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.interior_color || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Seats</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.number_of_seats || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Cylinders</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.no_of_cylinders || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Engine</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.engine_cc || 'N/A'}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Horse Power</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.horse_power || 'N/A'}</p>
      </div>
       <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Doors</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.number_of_doors || 'N/A'}</p>
      </div>
    </Col>
  </Row>
</Card>


          {/* Features */}
         <Card>
  <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600' }}>Features</h3>
  <Row gutter={[8, 8]}>
    {/* {[
      "Leather Seats",
      "Sunroof",
      "Navigation System",
      "Bluetooth",
      "Backup Camera",
      "Heated Seats",
    ].map((f) => (
      <Col key={f} xs={12} sm={8}>
        <Tag
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#000",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 400,
            fontSize: 14,
            justifyContent: "flex-start",
          }}
        >
          <img src={greentickicon} alt="Tick" style={{ width: 14, height: 16 }} />
          {f}
        </Tag>
      </Col>
    ))} */}
    {carDetails?.extra_features?.map((feature, index) => (
                <Col key={index} xs={12} sm={8}>
                  <Tag  style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#000",
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 400,
            fontSize: 14,
            justifyContent: "flex-start",
          }}>
                    <img src={greentickicon} alt="Tick" style={{ width: 14, height: 16 }} />
                    {feature}
                  </Tag>
                </Col>
              ))}
  </Row>
</Card>
        </Col>

        {/* ===== RIGHT SIDE: Seller Info + Actions ===== */}
        <Col
          xs={24}
          md="auto"
          style={{
            flex: "0 0 250px",
            maxWidth: 250,
            paddingLeft: 12, 
          }}
        >
          <div style={{ position: "sticky", top: 24 }}>
            <Card style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600' }}>Seller Information</h3>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                <Avatar size={48} icon={<UserOutlined />} style={{ marginRight: 12 }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>
  {carDetails?.seller?.first_name} {carDetails?.seller?.last_name}
</p>

                  <p style={{ margin: 0, color: "#888" }}>{carDetails?.seller?.is_dealer === "True" ? "Dealer Seller" : "Individual Seller"}</p>
                </div>
                <img 
    src={shareicon} 
    alt="Share" 
    style={{ marginLeft: "auto", cursor: "pointer" }} 
  />
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <p style={{ marginBottom: 8 }}>📞 {carDetails?.seller?.phone_number}</p>
              <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 8 }}>
  <span style={{ marginRight: 6 }}>✉️</span>
  <span style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>
    {carDetails?.seller?.email || "N/A"}
  </span>
</div>
              <p style={{ marginBottom: 0 }}><FaCalendar/>  Member since {carDetails?.seller?.member_since}</p>
            </Card>

            <Card>
              <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600' }}>
                {carDetails?.approval === "rejected" ? "Reason" : "Actions"}
              </h3>
              <ActionButtons 
                approval={carDetails?.approval}
                isBestCar={isBestCar}
                setIsBestCar={setIsBestCar}
                handleApprove={handleapproveapi}
                handleReject={showRejectModal}
                handleMarkAsBest={handleMarkAsBestApi}
                loading={loading}
                rejectionReason={carDetails?.rejection_reason}
                comment={carDetails?.admin_rejection_comment}
              />
            </Card>


          </div>
        </Col>
      </Row>

      <Modal
  title="Rejection Reason"
  visible={isRejectModalVisible}
  onCancel={handleRejectCancel}
  footer={[
    <Button key="cancel" onClick={handleRejectCancel}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" danger onClick={handleRejectSubmit}>
      Submit
    </Button>,
  ]}
>
  <div style={{ marginBottom: 16 }}>
   <Select
  placeholder="Select a reason"
  style={{ width: "100%" }}
  value={rejectionReason}
  onChange={(value) => setRejectionReason(value)}
>
  {rejectReasonData.length > 0 ? (
    rejectReasonData.map((reason) => (
      <Select.Option key={reason.id} value={reason.id}>
        {reason.rejected_reason}
      </Select.Option>
    ))
  ) : (
    <Select.Option disabled>No reasons available</Select.Option>
  )}
</Select>

  </div>

  <div>
    <Input.TextArea
      placeholder="Add comment (optional)"
      rows={4}
      value={comment}
      onChange={(e) => setComment(e.target.value)}
    />
  </div>
      </Modal>

    </div>
  );
};

export default ListingDetails;



