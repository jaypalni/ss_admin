import { useParams } from "react-router-dom";
import { Card, Button, Tag, Row, Col, Avatar, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import crownicon from "../assets/images/crown_icon.png";
import boosticon from "../assets/images/boosticon.png";
import { FaCalendar } from "react-icons/fa";
import approveIcon from "../assets/images/tick_icon.png"; 
import rejectIcon from "../assets/images/cross_icon.png";
import greentickicon from "../assets/images/greentick_icon.png"
import carone_icon from '../assets/images/careimageone.png'
import cartwo_icon from '../assets/images/careimagetwo.png'
import carthree_icon from '../assets/images/careimagethree.png'
import carfour_icon from '../assets/images/careimagefour.png'
import carfive_icon from '../assets/images/careimagefive.png'
import carsix_icon from '../assets/images/careimagesix.png'
import "../assets/styles/listingdetails.css";

const ListingDetails = () => {
  const { listingId } = useParams();

  return (
    <div  style={{
        background: "#f7f7f7",
        padding: 24,
        height: "100%",        
        overflowY: "auto",     
        boxSizing: "border-box",
      }}>
      {/* ===== TOP BAR ===== */}
      <div className="top-bar">
        <h2 style={{ margin: 0 }}>Listing Details</h2>
        <Tag className="pending-tag">
          Pending Review
        </Tag>
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
        <span>#LST-2024-03-15-7892</span>
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
      backgroundColor: "#DCFCE7", 
      color: "#166534",          
      borderRadius: "22px",
      border: "none",
      padding: "2px 10px",
      fontWeight: 500,
    }}
  >
    Active
  </Tag>
  <img
    src={boosticon}
    alt="Crown Icon"
    style={{ width: 18, height: 18 }}
  />
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
  March 15, 2024 - March 22, 2024
</span>

      </div>
    </Col>
  </Row>
</Card>
 {/* Vehicle Images */}
<Card style={{ marginBottom: 24 }}>
  <h3 style={{ marginBottom: 16 }}>Vehicle Images</h3>
  <Row gutter={[16, 16]}>
    {[
      carone_icon,
      cartwo_icon,
      carthree_icon,
      carfour_icon,
      carfive_icon,
      carsix_icon,
    ].map((imgSrc, index) => (
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
            src={imgSrc}
            alt={`Vehicle ${index + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </Col>
    ))}
  </Row>
</Card>



          {/* Basic Information */}
         <Card style={{ marginBottom: 24 }}>
  <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600' }}>
    Basic Information
  </h3>
  <h2 style={{ marginBottom: 12, fontSize: '20px', fontWeight: '700' }}>
    2023 BMW 5 Series 530i M Sport
  </h2>
  <p
    style={{
      color: "#4B5563",
      marginBottom: 16,
      fontSize: '16px',
      fontWeight: '400'
    }}
  >
    Luxury sedan in excellent condition with premium features and low mileage.
    Perfect for business and personal use.
  </p>

  <Row gutter={24}>
    <Col xs={24} md={12}>
      <h4 style={{ marginBottom: 4, fontSize: '14px', fontWeight: '400', color: '#6B7280' }}>Price</h4>
      <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#2563EB' }}>
        85,000,000 IQD
      </p>
    </Col>
    <Col xs={24} md={12}>
      <h4 style={{ marginBottom: 4, fontSize: '14px', fontWeight: '400', color: '#6B7280' }}>Location</h4>
      <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#000000' }}>Baghdad, Iraq</p>
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
            backgroundColor: '#3B82F6', // Blue dot, you can change per item
          }}
        />
        <strong>Date of Creation:</strong>
      </div>
      <span style={{ marginRight: 12 }}>March 15, 2024</span>
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
      <span style={{ marginRight: 12 }}>Pending</span>
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
      <span style={{ marginRight: 12 }}>Not sold</span>
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
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>Sedan</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Body Type</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>4-Door Sedan</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Make</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>BMW</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Model</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>5 Series</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Trim</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>530i M Sport</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Regional Specs</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>GCC</p>
      </div>
    </Col>

    <Col xs={24} md={8}>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Kilometers</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>15,000 km</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Year</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>2023</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Condition</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>Used</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Fuel Type</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>Gasoline</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Transmission</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>Automatic</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Exterior Color</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>Alpine White</p>
      </div>
    </Col>

    <Col xs={24} md={8}>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Interior Color</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>Black Leather</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Seats</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>5</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Cylinders</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>4</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Engine</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>2.0L Turbo</p>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ margin: 0, color: '#6B7280', fontSize: 14, fontWeight: 400 }}>Horsepower</p>
        <p style={{ margin: 0, color: '#000000', fontSize: 16, fontWeight: 500 }}>248 HP</p>
      </div>
    </Col>
  </Row>
</Card>


          {/* Features */}
         <Card>
  <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600' }}>Features</h3>
  <Row gutter={[8, 8]}>
    {[
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
                  <p style={{ margin: 0, fontWeight: 600 }}>Ahmed Hassan</p>
                  <p style={{ margin: 0, color: "#888" }}>Individual Seller</p>
                </div>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <p style={{ marginBottom: 8 }}>📞 +964 770 123 4567</p>
              <p style={{ marginBottom: 8 }}>✉️ ahm.hassan@gmail.com</p>
              <p style={{ marginBottom: 0 }}><FaCalendar/>  Member since 2022</p>
            </Card>

            <Card>
              <h3 style={{ marginBottom: 16, fontSize: '18px', fontWeight: '600' }}>Actions</h3>
             <div>
  <Button
    type="primary"
    block
    style={{
      marginBottom: 12,
      backgroundColor: "#28a745", // Green color
      borderColor: "#28a745",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
    }}
  >
    <img src={approveIcon} alt="tick" style={{ width: 14, height: 16 }} />
    Approve Listing
  </Button>

  <Button
    danger
    block
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      backgroundColor: "#DC2626",
      borderColor: "#DC2626",
      color: "#fff",
    }}
  >
    <img src={rejectIcon} alt="cross" style={{ width: 14, height: 16 }} />
    Reject Listing
  </Button>
</div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ListingDetails;



