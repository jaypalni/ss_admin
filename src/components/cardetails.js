  import React, { useState,useEffect } from "react";
  import { Button, Switch, Carousel,Radio,message,Select,Input,Modal,Spin } from "antd";
  import { useNavigate, useParams } from "react-router-dom";
  import "../assets/styles/cardetails.css";
  import { userAPI } from "../services/api";
  import { handleApiError, handleApiResponse } from "../utils/apiUtils";

  const CarDetails = () => {
    const navigate = useNavigate();
    const { car_id } = useParams();
    const [loading, setLoading] = useState(false);
    const [customerData, setCustomerData] = useState(null);
    const [rejectReasonData, setRejectReasonData] = useState([]);
    const [isBestCar, setIsBestCar] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const [radioValue, setRadioValue] = useState(null);
    const [, setNotifySaved] = useState('');
    const [, setApproved] = useState('');
    const [prevApprovalStatus, setPrevApprovalStatus] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState(null);
    const [rejectComment, setRejectComment] = useState("");
    const [submittingRejection, setSubmittingRejection] = useState(false); 
    const API_BASE_URL = process.env.REACT_APP_API_URL
    const { TextArea } = Input;
    const { Option } = Select;

    useEffect(() => {
        fetchCustomersIdData(car_id);
    }, [car_id]);

    const fetchCustomersIdData = async (car_id) => {
        try {
          setLoading(true);
          const response = await userAPI.getCarByIdDetails(Number(car_id));
          const result = handleApiResponse(response);
    
          if (result?.data) {
            setCustomerData(result.data);
            const bestPick = result?.data?.is_best_pick ?? 0;
            setIsBestCar(Number(bestPick) === 1);
           const status = result?.data?.approval ?? "";
           setApprovalStatus(status);
          }
          messageApi.open({ type: 'success', content: result.message});
        } catch (error) {
          const errorData = handleApiError(error);
          messageApi.open({ type: 'error', content: errorData});
        } finally {
          setLoading(false);
        }
    };
      
    const handleEnableNotification = async (id, enabled) => {
      setLoading(true);
      const previous = isBestCar;
      setIsBestCar(enabled);
    try {
      const pick = enabled ? 1 : 0;

      const res = await userAPI.carBestPick(id, pick);
      const response = handleApiResponse(res);

      if (response) {
        messageApi.open({ type: 'success', content: response.message });
        //Allsavedsearches('1');
      } else {
        setIsBestCar(previous);
        setNotifySaved([]);
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({ type: 'error', content: errorData.message });
    } finally {
      setLoading(false);
    }
    };

const onApprovalChange = (e) => {
  const newVal = e.target.value;
  if (newVal === "rejected") {
    setPrevApprovalStatus(approvalStatus);
    if (!rejectReasonData || rejectReasonData.length === 0) {
      getReasonRejection();
    }
    setShowRejectModal(true);
    return;
  }

  if (newVal === "approved") {
    setPrevApprovalStatus(approvalStatus);
    getApproved();
    return;
  }
  setApprovalStatus(newVal);
};

  const getReasonRejection = async () => {
        try {
          setLoading(true);
          const response = await userAPI.reasonRejection();
          const result = handleApiResponse(response);
    
          if (result?.data?.rejection_reasons) {
            setRejectReasonData(result.data.rejection_reasons);
        
          }
          messageApi.open({ type: 'success', content: result.data.message});
        } catch (error) {
          const errorData = handleApiError(error);
          messageApi.open({ type: 'error', content: errorData});
          setRejectReasonData([]);
        } finally {
          setLoading(false);
        }
    };

    const getRejection = async () => {
      if (!rejectReason) {
      messageApi.open({ type: "warning", content: "Please select a reason for rejection." });
      return;
    }

    if (!rejectComment) {
      messageApi.open({ type: "warning", content: "Please enter a comment." });
      return;
    }
      const body =  {
        rejection_reason : rejectReason,
        admin_rejection_comment: rejectComment
      }
        try {
          setLoading(true);
          const response = await userAPI.carRejected(Number(car_id),body);
          const result = handleApiResponse(response);
    
          if (result?.data?.rejection_reasons) {
            setRejectReasonData(result.data.rejection_reasons);
            setApprovalStatus("rejected");
            setShowRejectModal(false);
        
          }
          messageApi.open({ type: 'success', content: result.data.message});
        } catch (error) {
          const errorData = handleApiError(error);
          messageApi.open({ type: 'error', content: errorData});
          setRejectReasonData([]);
        } finally {
          setLoading(false);
        }
    };

    const getApproved = async () => {

        try {
          setLoading(true);
          const response = await userAPI.carApprove(Number(car_id));
          const result = handleApiResponse(response);
    
          if (result?.data?.rejection_reasons) {
            setRejectReasonData(result.data.rejection_reasons);
            setApprovalStatus("approved");
            setShowRejectModal(false);
        
          }
          messageApi.open({ type: 'success', content: result.data.message});
        } catch (error) {
          const errorData = handleApiError(error);
          messageApi.open({ type: 'error', content: errorData});
          setRejectReasonData([]);
        } finally {
          setLoading(false);
        }
    };

  const onCancelRejection = () => {
    setShowRejectModal(false);
    setApprovalStatus(prevApprovalStatus ?? "");
    setRejectReason(null);
    setRejectComment("");
  };

  const imagesToShow = customerData?.car_image?.length
    ? customerData.car_image
    : [];

    const renderRow = (label, value) => (
      <tr>
        <td style={{ fontWeight: "bold", padding: "8px 4px" }}>{label}</td>
        <td style={{ padding: "8px 4px" }}>{value}</td>
      </tr>
    );

    const tableStyle = {
      width: "100%",
      borderCollapse: "collapse",
    };
    if (!customerData?.car_image) {
      return <div style={{ padding: 24 }}> </div>;
    }

    if (loading && !customerData) {
      return (
        <div style={{ padding: 24, textAlign: "center" }}>
          {contextHolder}
          <Spin />
        </div>
      );
    }

    return (
      <div className="car-details-container">
        {contextHolder}
        {imagesToShow.length > 0 && (
    <Carousel autoplay  dots arrows>
      {imagesToShow.map((image, idx) => (
        <div key={idx} className="d-flex justify-content-center">
          <img
            src={`${API_BASE_URL}${image}`}
            alt={`Car ${idx}`}
            style={{
              width: "80%",
              height: "500px",
              objectFit: "cover",
              borderRadius: 10,
            }}
          />
        </div>
      ))}
    </Carousel>
  )}


        <h2 className="car-title">{customerData.ad_title}</h2>
        <p className="car-description">{customerData.description}</p>

        <div className="summary-container">
          <div className="summary-box">
            <div className="summary-title">Year</div>
            <div className="summary-value">{customerData.year}</div>
          </div>
          <div className="summary-box">
            <div className="summary-title">Fuel Type</div>
            <div className="summary-value">{customerData.fuel_type}</div>
          </div>
          <div className="summary-box">
            <div className="summary-title">Condition</div>
            <div className="summary-value">{customerData.condition}</div>
          </div>
          <div className="summary-box">
            <div className="summary-title">Kilometers</div>
            <div className="summary-value">{customerData.kilometers}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ width: "48%" }}>
            <h3>Car Informations</h3>
            <table style={tableStyle}>
              <tbody>
                {renderRow("Body Type", customerData?.body_type)}
                {renderRow("Regional Specs", customerData?.regional_specs)}
                {renderRow("Door Count", customerData?.number_of_doors)}
                {renderRow("Number of Seats", customerData?.number_of_seats)}
                {renderRow("Version", customerData?.trim)}
              </tbody>
            </table>
          </div>
          <div style={{ width: "48%" }}>
            <h3>Additional Details</h3>
            <table style={tableStyle}>
              <tbody>
                {renderRow("Engine CC", customerData?.engine_cc)}
                {renderRow("Number of Cylinders", customerData?.no_of_cylinders)}
                {renderRow("Consumption (1/100 km)", customerData?.consumption)}
                {renderRow("Transmission", customerData?.transmission_type)}
                {renderRow("Drive Type", customerData?.drive_type)}
              </tbody>
            </table>
          </div>
        </div>

        <div
      style={{
        background: "#f9f9f9",
        borderRadius: 8,
        padding: 16,
        marginTop: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >

        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontWeight: 600, marginRight: 10 }}>
            Select as Best Car:
          </span>
          <Switch  checked={isBestCar}
          onChange={(checked) => handleEnableNotification(customerData?.id ?? car_id, checked)} />
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>

          <Radio.Group 
            onChange={onApprovalChange} value={approvalStatus}
            style={{ marginLeft: 180 }}
          >
             <Radio value="pending" style={{ marginRight: 20 }}>
              Pending
            </Radio>
            <Radio value="approved">
              Approved
            </Radio>
            <Radio value="rejected">Rejected</Radio>
          </Radio.Group>
        </div>

        <Modal
      title="Reject Car"
      visible={showRejectModal}
      onOk={getRejection}
      onCancel={onCancelRejection}
      okText="Confirm"
      cancelText="Cancel"
      confirmLoading={submittingRejection}
    >
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Reason</label>
      <Select
    placeholder="Select a rejection reason"
    value={rejectReason}
    onChange={(val) => setRejectReason(val)}
    style={{ width: "100%" }}
    loading={loading}
  >
    {rejectReasonData && rejectReasonData.length > 0 ? (
      rejectReasonData.map((r) => (
        <Option key={r.id} value={r.rejected_reason}>
          {r.rejected_reason}
        </Option>
      ))
    ) : (
      <Option disabled key="no-data" value="">
        No reasons available
      </Option>
    )}
      </Select>

      </div>

      <div>
        <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>Rejection Comments</label>
        <TextArea
          rows={4}
          placeholder="Add extra information for the user..."
          value={rejectComment}
          onChange={(e) => setRejectComment(e.target.value)}
        />
      </div>
    </Modal>
      </div>
    </div>

        <Button
          type="primary"
          style={{ marginTop: 20 }}
          onClick={() => navigate(-1)}
        >
          Back to List
        </Button>
      </div>
    );
  };

  export default CarDetails;
