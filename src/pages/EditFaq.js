import React, { useEffect, useState,useRef  } from "react";
import {
  ArrowLeftOutlined ,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Row,
  Col,
  Input,
  Card,
  Divider,
  Select,
  Tabs,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import bluelogo_icon1 from "../assets/images/globe.svg";
import { loginApi } from "../services/api";
import { handleApiError } from "../utils/apiUtils";
const { TextArea } = Input;

const EditFaq = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("english");
  const [messageApi, contextHolder] = message.useMessage();
  const {user,token} = useSelector((state) => state.auth);
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(id);

   const isLoggedIn = token && user;
    
      useEffect(() => {
        if (!isLoggedIn) navigate("/");
      }, [isLoggedIn, navigate]);

  const [faqData, setFaqData] = useState({
    english: { question: "", answer: "" },
    arabic: { question: "", answer: "" },
    kurdish: { question: "", answer: "" },
    category: "",
  });

  const [errors, setErrors] = useState({
    question: "",
    answer: "",
    category: "",
  });

  const handleChange = (lang, field, value) => {
  setFaqData((prev) => ({
    ...prev,
    [lang]: {
      ...prev[lang],
      [field]: value,
    },
  }));

  setErrors((prev) => ({
    ...prev,
    [field]: "",   
  }));
};
useEffect(() => {
  if (!isEdit) return;

  let hasFetched = false;

  const fetchFaqDetails = async () => {
    if (hasFetched) return; 
    hasFetched = true;

    try {
      const res = await loginApi.geteditfaq(id);
      const data = res?.data;

      if (data?.status_code === 200 || data?.status === "success") {
        const faq = data.data;

        let detectedLang = "english";
        if (faq.lang === "ar") detectedLang = "arabic";
        else if (faq.lang === "ku") detectedLang = "kurdish";

        setFaqData({
          english: {
            question: detectedLang === "english" ? faq.question ?? "" : "",
            answer: detectedLang === "english" ? faq.answer ?? "" : "",
          },
          arabic: {
            question: detectedLang === "arabic" ? faq.question ?? "" : "",
            answer: detectedLang === "arabic" ? faq.answer ?? "" : "",
          },
          kurdish: {
            question: detectedLang === "kurdish" ? faq.question ?? "" : "",
            answer: detectedLang === "kurdish" ? faq.answer ?? "" : "",
          },
          category: faq.is_published === 1 ? "published" : "draft",
        });

        setActiveTab(detectedLang);
      } else {
        messageApi.error(data?.message || "Failed to fetch FAQ details");
      }
    } catch (err) {
      console.error("Error fetching FAQ:", err);
      messageApi.error("Something went wrong while fetching FAQ details");
    }
  };

  fetchFaqDetails();
}, [id, isEdit]);

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true)
    const langCode = activeTab.slice(0, 2);
    const body = {
      question: faqData[activeTab].question,
      answer: faqData[activeTab].answer,
      is_published: faqData.category === "published" ? 1 : 0,
      created_by: user,
    };

    try {
      if (isEdit) {
        const res = await loginApi.updatefaq(id, body);
        const resData = res?.data;
        if (resData?.status_code === 200 || resData?.status === "success" || resData?.status_code === 201) {
          messageApi.success("FAQ updated successfully");
         setTimeout(() => {
      navigate("/FAQ'S");
    }, 1000);
        } else {
          messageApi.error(resData?.message || "Failed to update FAQ");
        }
      } else {
        const res = await loginApi.addfaq(langCode,body);
        const resData = res?.data;
        if (resData?.status_code === 200 || resData?.status === "success" || resData?.status_code === 201) {
          messageApi.success("FAQ added successfully");
          setTimeout(() => {
      navigate("/FAQ'S");
    }, 1000);
        } else {
          messageApi.error(resData?.message || "Failed to add FAQ");
        }
      }
    } catch (err) {
      console.error("FAQ save error:", err);
     const errorMessage = handleApiError(err);
           messageApi.open({
             type: "error",
             content: errorMessage?.error || "Error fetching FAQs",
           });
    }finally{
       setSaving(false)
    }
  };

const validate = () => {
    let valid = true;
    let newErrors = { question: "", answer: "", category: "" };

    if (!faqData[activeTab].question.trim()) {
      newErrors.question = "Question is required";
      valid = false;
    }
    if (!faqData[activeTab].answer.trim()) {
      newErrors.answer = "Answer is required";
      valid = false;
    }
    if (!faqData.category) {
      newErrors.category = "Status is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const tabItems = [
    {
      key: "english",
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <img
            src={bluelogo_icon1}
            alt="English Icon"
            style={{
              width: 12,
              height: 12,
              filter:
                activeTab === "english"
                  ? "invert(36%) sepia(89%) saturate(747%) hue-rotate(188deg) brightness(95%) contrast(90%)"
                  : "grayscale(100%)",
            }}
          />
          <span
            style={{
              color: activeTab === "english" ? "#008AD5" : "#4B5563",
              fontWeight: activeTab === "english" ? 600 : 400,
            }}
          >
            English
          </span>
        </div>
      ),
    },
    {
      key: "arabic",
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <img
            src={bluelogo_icon1}
            alt="Arabic Icon"
            style={{
              width: 12,
              height: 12,
              filter:
                activeTab === "arabic"
                  ? "invert(36%) sepia(89%) saturate(747%) hue-rotate(188deg) brightness(95%) contrast(90%)"
                  : "grayscale(100%)",
            }}
          />
          <span
            style={{
              color: activeTab === "arabic" ? "#008AD5" : "#4B5563",
              fontWeight: activeTab === "arabic" ? 600 : 400,
            }}
          >
            Arabic
          </span>
        </div>
      ),
    },
    {
      key: "kurdish",
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <img
            src={bluelogo_icon1}
            alt="Kurdish Icon"
            style={{
              width: 12,
              height: 12,
              filter:
                activeTab === "kurdish"
                  ? "invert(36%) sepia(89%) saturate(747%) hue-rotate(188deg) brightness(95%) contrast(90%)"
                  : "grayscale(100%)",
            }}
          />
          <span
            style={{
              color: activeTab === "kurdish" ? "#008AD5" : "#4B5563",
              fontWeight: activeTab === "kurdish" ? 600 : 400,
            }}
          >
            Kurdish
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4" style={{ position: "relative" }}>
      {contextHolder}
      <Row align="middle" justify="space-between">
        <Col>
          <div>
            <h2 style={{ fontSize: 23 }} className="font-bold mb-1">
              {isEdit ? "Edit FAQ" : "Add FAQ"}
            </h2>
            <p style={{ color: "#4B5563", fontSize: 13 }}>
              {isEdit
                ? "Modify the selected frequently asked question"
                : "Create a new frequently asked question"}
            </p>
          </div>
        </Col>
        <Col>
          <Button
            onClick={() => navigate("/FAQ'S")}
            icon={<ArrowLeftOutlined style={{width:10,height:10}}  />}
            style={{
              padding: "0 10px",
              height: 36,
              background: "#E5E7EB",
              color: "#374151",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            Back to List
          </Button>
        </Col>
      </Row>

      <Card bordered style={{ borderRadius: "10px", marginTop: 20 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarStyle={{ marginBottom: 20 }}
          items={tabItems}
        />

       <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500, fontSize: 14 }}>Question</label>
          <Input
            placeholder="Enter question"
            value={faqData[activeTab].question}
            onChange={(e) => handleChange(activeTab, "question", e.target.value)}
          />
          {errors.question && (
            <p style={{ color: "red", marginTop: 4 }}>{errors.question}</p>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500, fontSize: 14 }}>Answer</label>
          <TextArea
            rows={5}
            placeholder="Enter answer"
            value={faqData[activeTab].answer}
            onChange={(e) => handleChange(activeTab, "answer", e.target.value)}
          />
          {errors.answer && (
            <p style={{ color: "red", marginTop: 4 }}>{errors.answer}</p>
          )}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 500, fontSize: 14 }}>Status</label>
          <Select
            placeholder="Select a status"
            value={faqData.category}
            onChange={(value) => {
              setFaqData({ ...faqData, category: value });
              setErrors((prev) => ({ ...prev, category: "" }));
            }}
            style={{ width: "100%" }}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
            ]}
          />
          {errors.category && (
            <p style={{ color: "red", marginTop: 4 }}>{errors.category}</p>
          )}
        </div>

        <div
          style={{
            textAlign: "right",
            marginTop: 24,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <Button
            onClick={() => navigate("/FAQ'S")}
            style={{
              backgroundColor: "#E5E7EB",
              color: "#374151",
              borderColor: "#E5E7EB",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            loading={saving} 
            disabled={saving}
            style={{
              backgroundColor: "#008AD5",
              borderColor: "#008AD5",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {isEdit ? "Update" : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditFaq;
