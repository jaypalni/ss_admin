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



const showRejectModal = () => {
    getReasonRejection();
  setIsRejectModalVisible(true);
};

const handleRejectCancel = () => {
  setIsRejectModalVisible(false);
  setRejectionReason(null);
  setComment("");
};

// Rejection Reasons API

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

      if (result?.message) {
       // messageApi.open({ type: "success", content: result.message });
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({ type: "error", content: errorData.error || "Error fetching car details" });
    } finally {
      
    }
  };

  fetchCarDetails();
}, [listingId]);


// Reject Car API
  

  const handleRejectSubmit = async () => {
  // Check if a reason is selected
  if (!rejectionReason) {
    messageApi.open({ type: "warning", content: "Please select a rejection reason." });
    return;
  }

  // Find the selected reason object
  const selectedReason = rejectReasonData.find((r) => r.id === rejectionReason);

  // If "Other" is selected, comment becomes mandatory
  if (selectedReason?.rejected_reason.toLowerCase() === "other" && !comment?.trim()) {
    messageApi.open({ type: "warning", content: "Please add a comment for 'Other' reason." });
    return;
  }

  // Call the API
  try {
    
    const body = {
      car_id: listingId,
      rejection_reason: rejectionReason,
      admin_rejection_comment: comment || "",
    };

    const response = await userAPI.rejectcar(body);
    const data = handleApiResponse(response);

    if (data.status_code === 200) {
      messageApi.open({ type: "success", content: data.message });
      setIsRejectModalVisible(false);
      navigate("/listingmanagement");
    } else {
      messageApi.open({ type: "error", content: data?.message || "Failed to reject car" });
    }
  } catch (error) {
    const errorData = handleApiError(error);
    messageApi.open({ type: "error", content: errorData.message || "Failed to reject car" });
  } finally {
    // setLoading(false);
  }
};


// Approve Car API

const handleapproveapi = async () => {
  try {
    setLoading(true);
    const body = { car_id: listingId }; // send car_id
    const response = await userAPI.approvecar(body);
    const data = handleApiResponse(response);

    if (data.status_code === 200) {
      if (data?.message) {
        messageApi.open({ type: "success", content: data.message });
        navigate("/listingmanagement")
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
         <Tag
  style={{
    backgroundColor:
      carDetails?.approval === "approved"
        ? "#d4edda" // Light green background
        : carDetails?.approval === "rejected"
        ? "#f8d7da" // Light red background
        : "#fff3cd", // Light orange background (default for pending/others)
    color:
      carDetails?.approval === "approved"
        ? "#155724" // Dark green text
        : carDetails?.approval === "rejected"
        ? "#721c24" // Dark red text
        : "#856404", // Dark orange text
    border:
      carDetails?.approval === "approved"
        ? "1px solid #c3e6cb" // Green border
        : carDetails?.approval === "rejected"
        ? "1px solid #f5c6cb" // Red border
        : "1px solid #ffeaa7", // Orange border
    borderRadius: 6,
    padding: "4px 12px",
    fontSize: "14px",
    fontWeight: 500,
  }}
>
  {carDetails?.approval === "pending"
    ? "Pending Review"
    : carDetails?.approval || "Pending"}
</Tag>

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
       <div style={{ display: "flex", alignItems: "center" }}>
  <Tag
    style={{
      backgroundColor: carDetails?.is_featured === 1 ? "#DCFCE7" : "#FFF4E5", // green bg if active, light orange if not
      color: carDetails?.is_featured === 1 ? "#166534" : "#B45309", // green text if active, orange if not
      borderRadius: "22px",
      border: "none",
      padding: "2px 10px",
      fontWeight: 500,
    }}
  >
    {carDetails?.is_featured === 1 ? "Active" : "Not Active"}
  </Tag>
  {carDetails?.is_featured === 1 && (
    <img
      src={boosticon}
      alt="Boost Icon"
      style={{ width: 18, height: 18, marginLeft: 6 }}
    />
  )}
</div>

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
    {/* Item 1 */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12, gap: 8 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: 12,
            backgroundColor: '#3B82F6', 
          }}
        />
        <strong>Date of Creation:</strong>
      </div>
      <span style={{ marginRight: 12 }}>
  {carDetails?.created_at
    ? new Date(carDetails.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : ""}
</span>
    </div>

    {/* Item 2 */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12, gap: 8 }}>
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: 12,
        backgroundColor: '#EAB308', // Yellow dot
      }}
    />
    <strong>Date of Approval/Reject:</strong>
  </div>
  <span style={{ marginRight: 12 }}>
    {carDetails?.approval === "pending"
      ? "Pending"
      : carDetails?.updated_at
      ? new Date(carDetails.updated_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : ""}
  </span>
</div>
    {/* Item 3 */}
   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12, gap: 8 }}>
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: 12,
        backgroundColor: '#D1D5DB', // Red dot
      }}
    />
    <strong>Date of Sale:</strong>
  </div>
  <span style={{ marginRight: 12 }}>
    {carDetails?.status === "unsold"
      ? "Not Sold"
      : carDetails?.status === "sold" && carDetails?.updated_at
      ? new Date(carDetails.updated_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : ""}
  </span>
</div>

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
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.vechile_type}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Body Type</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.body_type}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Make</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.make}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Model</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.model}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Trim</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.trim}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Regional Specs</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.regional_specs}</p>
      </div>
    </Col>

    <Col xs={24} md={8}>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Kilometers</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.kilometers}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Year</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.year}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Condition</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.condition}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Fuel Type</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.fuel_type}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Transmission</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.transmission_type}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Exterior Color</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.exterior_color}</p>
      </div>
    </Col>

    <Col xs={24} md={8}>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Interior Color</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.interior_color}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Seats</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.number_of_seats}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Cylinders</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.no_of_cylinders}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Engine</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.engine_cc}</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Horse Power</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.horse_power}</p>
      </div>
       <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Doors</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>{carDetails?.number_of_doors}</p>
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
    Actions
  </h3>

  {/* Conditional Rendering */}
  {carDetails?.approval === "rejected" ? (
    // If approval is rejected -> hide the entire card
    null
  ) : carDetails?.approval === "approved" ? (
    // If approval is approved -> show Toggle Button + Mark as Best Car text
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Switch
  checked={isBestCar}
  onChange={(checked) => {
    setIsBestCar(checked); // Update toggle instantly
    handleMarkAsBestApi(checked ? 1 : 0); // Send 1 for ON, 0 for OFF
  }}
  style={{
    backgroundColor: isBestCar ? "#52c41a" : "#d9d9d9",
  }}
/>
      <span style={{ fontSize: "16px", fontWeight: 500 }}>Mark as Best Car</span>
    </div>
  ) : (
    // Else (Pending or any other status) -> show Approve and Reject buttons
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Approve Button */}
      <Button
        type="primary"
        block
        onClick={handleapproveapi}
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
        <img
          src={approveIcon}
          alt="approve"
          style={{ width: 16, height: 16 }}
        />
        Approve Listing
      </Button>

      {/* Reject Button */}
      <Button
        danger
        block
        onClick={showRejectModal}
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
        <img
          src={rejectIcon}
          alt="reject"
          style={{ width: 16, height: 16 }}
        />
        Reject Listing
      </Button>
    </div>
  )}
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
//   loading={loading} // Show loading spinner while fetching
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



