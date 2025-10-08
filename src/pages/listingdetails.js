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

// Helper functions
const getApprovalStatusStyle = (approval) => {
  if (approval === "approved") return { backgroundColor: "#d4edda", color: "#155724", border: "1px solid #c3e6cb" };
  if (approval === "rejected") return { backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb" };
  return { backgroundColor: "#fff3cd", color: "#856404", border: "1px solid #ffeaa7" };
};
const getApprovalStatusText = (approval) => approval === "pending" ? "Pending Review" : approval || "Pending";
const getBoostStatusStyle = (isFeatured) => ({
  backgroundColor: isFeatured === 1 ? "#DCFCE7" : "#FFF4E5",
  color: isFeatured === 1 ? "#166534" : "#B45309",
  borderRadius: "22px",
  border: "none",
  padding: "2px 10px",
  fontWeight: 500,
});
const formatDate = (dateString) => !dateString ? "" : new Date(dateString).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const validateRejectionReason = (rejectionReason, rejectReasonData, comment, messageApi) => {
  if (!rejectionReason) { messageApi.open({ type: "warning", content: "Please select a rejection reason." }); return false; }
  const selectedReason = rejectReasonData.find((r) => r.id === rejectionReason);
  if (selectedReason?.rejected_reason.toLowerCase() === "other" && !comment?.trim()) {
    messageApi.open({ type: "warning", content: "Please add a comment for 'Other' reason." });
    return false;
  }
  return true;
};

// Components
const ApprovalStatusTag = ({ approval }) => (
  <Tag style={{ ...getApprovalStatusStyle(approval), borderRadius: 6, padding: "4px 12px", fontSize: "14px", fontWeight: 500 }}>
    {getApprovalStatusText(approval)}
  </Tag>
);

const BoostStatus = ({ isFeatured }) => (
  <div style={{ display: "flex", alignItems: "center" }}>
    <Tag style={getBoostStatusStyle(isFeatured)}>{isFeatured === 1 ? "Active" : "Not Active"}</Tag>
    {isFeatured === 1 && <img src={boosticon} alt="Boost Icon" style={{ width: 18, height: 18, marginLeft: 6 }} />}
  </div>
);

const TimelineItem = ({ label, date, color, isPending = false }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12, gap: 8 }}>
      <div style={{ width: 12, height: 12, borderRadius: 12, backgroundColor: color }} />
      <strong>{label}:</strong>
    </div>
    <span style={{ marginRight: 12, color: isPending ? '#9CA3AF' : 'inherit' }}>{date}</span>
  </div>
);

const ActionButtons = ({ approval, isBestCar, setIsBestCar, handleApprove, handleReject, handleMarkAsBest, loading, rejectionReason, comment }) => {
  if (approval === "rejected") return (
    <div style={{ backgroundColor: "#fff6f6", border: "1px solid #ffa39e", borderRadius: "8px", padding: "12px 16px", color: "#cf1322", lineHeight: "1.6" }}>
      <p style={{ marginBottom: "8px", fontWeight: 500 }}><strong>Rejection Reason:</strong> {rejectionReason || "Not specified"}</p>
      {comment && <p style={{ marginBottom: 0 }}><strong>Comments:</strong> {comment}</p>}
    </div>
  );

  if (approval === "approved") return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Switch
        checked={isBestCar}
        onChange={(checked) => { setIsBestCar(checked); handleMarkAsBest(checked ? 1 : 0); }}
        style={{ backgroundColor: isBestCar ? "#52c41a" : "#d9d9d9" }}
        aria-label="Mark as Best Car"
      />
      <span style={{ fontSize: "16px", fontWeight: 500 }}>Mark as Best Car</span>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Button type="primary" block onClick={handleApprove} loading={loading} style={{ backgroundColor: "#28a745", borderColor: "#28a745", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontWeight: 500 }}>
        <img src={approveIcon} alt="" style={{ width: 16, height: 16 }} />
        Approve Listing
      </Button>
      <Button danger block onClick={handleReject} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: "#DC2626", borderColor: "#DC2626", color: "#fff", fontWeight: 500 }}>
        <img src={rejectIcon} alt="" style={{ width: 16, height: 16 }} />
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

// Main Component
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
  const [isBestCar, setIsBestCar] = useState(false);
  const fetchCalled = useRef(false);
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = token && user;

  useEffect(() => { if (!isLoggedIn) navigate('/'); }, [isLoggedIn, navigate]);

  const showRejectModal = () => { getReasonRejection(); setIsRejectModalVisible(true); };
  const handleRejectCancel = () => { setIsRejectModalVisible(false); setRejectionReason(null); setComment(""); };

  const getReasonRejection = async () => {
    try {
      const response = await userAPI.reasonRejection();
      const result = handleApiResponse(response);
      setRejectReasonData(result?.data?.rejection_reasons || []);
    } catch (error) {
      messageApi.open({ type: "error", content: handleApiError(error) });
    }
  };

  useEffect(() => {
    if (!listingId || fetchCalled.current) return;
    fetchCalled.current = true;
    const fetchCarDetails = async () => {
      try {
        const response = await userAPI.getCarById(Number(listingId));
        const result = handleApiResponse(response);
        if (result?.data) {
          setCarDetails(result.data);
          setIsBestCar(result?.data?.is_best_pick === "1");
        }
      } catch (error) { messageApi.open({ type: "error", content: handleApiError(error)?.error || "Error fetching car details" }); }
    };
    fetchCarDetails();
  }, [listingId]);

  const handleRejectSubmit = async () => {
    if (!validateRejectionReason(rejectionReason, rejectReasonData, comment, messageApi)) return;
    const selectedReason = rejectReasonData.find((r) => r.id === rejectionReason);
    try {
      const response = await userAPI.rejectcar({ car_id: listingId, rejection_reason: selectedReason?.rejected_reason, admin_rejection_comment: comment || "" });
      const data = handleApiResponse(response);
      if (data.status_code === 200) { messageApi.open({ type: "success", content: data.message }); setIsRejectModalVisible(false); navigate("/listingmanagement"); }
      else messageApi.open({ type: "error", content: data?.message || "Failed to reject car" });
    } catch (error) { messageApi.open({ type: "error", content: handleApiError(error)?.message || "Failed to reject car" }); }
  };

  const handleapproveapi = async () => {
    try { setLoading(true); const data = handleApiResponse(await userAPI.approvecar({ car_id: listingId })); if (data.status_code === 200) { messageApi.open({ type: "success", content: data.message }); navigate("/listingmanagement"); } else { messageApi.open({ type: "error", content: data?.message || "Failed to approve car" }); } } 
    catch (error) { messageApi.open({ type: "error", content: handleApiError(error)?.message || 'Failed to approve car' }); } 
    finally { setLoading(false); }
  };

  const handleMarkAsBestApi = async (isBestPickValue) => {
    try { setLoading(true); const data = handleApiResponse(await userAPI.markasbestcar({ car_id: listingId, is_best_pick: isBestPickValue })); if (data.status_code === 200) messageApi.open({ type: "success", content: data.message }); else messageApi.open({ type: "error", content: data?.message || "Failed to mark as best car" }); } 
    catch (error) { messageApi.open({ type: "error", content: handleApiError(error)?.message || 'Failed to mark as best car' }); } 
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: "#f7f7f7", height: "100vh", overflowY: "auto", padding: "20px" }}>
      {contextHolder}
      {/* PAGE HEADER & Breadcrumbs */}
      <div style={{ marginBottom: 24 }}>
        <Breadcrumb separator=">" items={[
          { title: <Button type="link" onClick={() => navigate("/dashboard")}>Dashboard</Button> },
          { title: <Button type="link" onClick={() => navigate("/listingmanagement")}>Listing Management</Button> },
          { title: <span>Listing Details</span> }
        ]}/>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/listingmanagement")} style={{ fontWeight: 500 }}>Back to Listings</Button>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>Listing Details</h1>
          </div>
          <ApprovalStatusTag approval={carDetails?.approval} />
        </div>
      </div>

      {/* LEFT & RIGHT COLUMNS */}
      <Row gutter={24}>
        <Col xs={24} md={18}>
          {/* Listing Reference, Images, Info, Timeline, Features */}
          {/* ... SAME STRUCTURE AS BEFORE ... */}
        </Col>

        <Col xs={24} md="auto" style={{ flex: "0 0 250px", maxWidth: 250, paddingLeft: 12 }}>
          <div style={{ position: "sticky", top: 24 }}>
            <Card>
              <h3>Seller Information</h3>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                <Avatar size={48} icon={<UserOutlined />} style={{ marginRight: 12 }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{carDetails?.seller?.first_name} {carDetails?.seller?.last_name}</p>
                  <p style={{ margin: 0, color: "#888" }}>{carDetails?.seller?.is_dealer === "True" ? "Dealer Seller" : "Individual Seller"}</p>
                </div>
                <button style={{ background: "none", border: "none", marginLeft: "auto", cursor: "pointer" }} aria-label="Share"><img src={shareicon} alt="Share"/></button>
              </div>
              <Divider style={{ margin: "12px 0" }} />
              <p>📞 {carDetails?.seller?.phone_number}</p>
              <p>✉️ {carDetails?.seller?.email || "N/A"}</p>
              <p><FaCalendar/> Member since {carDetails?.seller?.member_since}</p>
            </Card>

            <Card>
              <h3>{carDetails?.approval === "rejected" ? "Reason" : "Actions"}</h3>
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

      <Modal title="Rejection Reason" visible={isRejectModalVisible} onCancel={handleRejectCancel} footer={[
        <Button key="cancel" onClick={handleRejectCancel}>Cancel</Button>,
        <Button key="submit" type="primary" danger onClick={handleRejectSubmit}>Submit</Button>
      ]}>
        <Select placeholder="Select a reason" style={{ width: "100%", marginBottom: 16 }} value={rejectionReason} onChange={setRejectionReason}>
          {rejectReasonData.length > 0 ? rejectReasonData.map(reason => <Select.Option key={reason.id} value={reason.id}>{reason.rejected_reason}</Select.Option>) : <Select.Option disabled>No reasons available</Select.Option>}
        </Select>
        <Input.TextArea placeholder="Add comment (optional)" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
      </Modal>
    </div>
  );
};

export default ListingDetails;
