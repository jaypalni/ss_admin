import React, { useState } from "react";
import { Table, Form, Input, Button, Select, Card, message, Spin } from "antd";
import { FaEdit } from "react-icons/fa";
import { AiOutlineUpload } from "react-icons/ai";
import { handleApiError, handleApiResponse } from "../utils/apiUtils";
import { userAPI } from "../services/api";

const { Option } = Select;

const CarTypes = () => {
  const [carData, ] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const columns = [
    { title: "Id", dataIndex: "id", key: "id", align: "center" },
    { title: "Make", dataIndex: "make", key: "make", align: "center" },
    { title: "Model", dataIndex: "model", key: "model", align: "center" },
    { title: "Year", dataIndex: "year", key: "year", align: "center" },
    { title: "Trim", dataIndex: "trim", key: "trim", align: "center" },
    { title: "Make Image", dataIndex: "makeImage", key: "makeImage", align: "center" },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <FaEdit
          style={{ color: "#1890ff", fontSize: "18px", cursor: "pointer" }}
          onClick={() => messageApi.info(`Edit ${record.make} - ${record.model}`)}
        />
      ),
    },
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) {
      message.error("Only image files are allowed!");
      return;
    }
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("attachment", file);

      const response = await userAPI.uploadimages(formData);
      const data = handleApiResponse(response);

      if (data?.attachment_url) {
        setUploadedUrl(data.attachment_url);
        form.setFieldsValue({ makeImage: data.attachment_url });
        messageApi.open({ type: 'success', content: data.message });
      } else {
        message.error("Upload failed!");
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({ type: 'error', content: errorData?.error });
    } finally {
      setUploading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const body = {
        make: values.make,
        model: values.model,
        year: values.year,
        trim: values.trim,
        //make_mage: values.makeImage
        make_image: '/api/search/upload-attachment/bmw_logo_20250905_122011_ce396f74.png'
      };

      const response = await userAPI.carTypeDetails(body);
      const data = handleApiResponse(response);

      if (data) {
        messageApi.open({ type: "success", content: data.message || "Car added successfully!" });
        form.resetFields();
      }
    } catch (error) {
      const errorData = handleApiError(error);
      messageApi.open({ type: "error", content: errorData?.message || "Failed to add car type" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <h2>Car Types</h2>

      <Card style={{ marginBottom: 20 }}>
        <Form form={form} layout="inline" onFinish={onFinish}>
          <Form.Item name="make" rules={[{ required: true, message: "Please enter car make!" }]}>
            <Input placeholder="Enter Make" />
          </Form.Item>

        <Form.Item>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              cursor: "pointer",
              padding: "6px 12px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              background: "#fafafa",
            }}
          >
            {uploading ? (
              <Spin size="small" />
            ) : (
              <>
                <AiOutlineUpload style={{ marginRight: 8 }} />
                {uploadedUrl ? "Change Image" : "Upload Image"}
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              rules={[{ required: false, message: "Please upload make image!" }]}
            />
          </label>
        </Form.Item>

          <Form.Item name="model" rules={[{ required: true, message: "Please enter car model!" }]}>
            <Input placeholder="Enter Model" />
          </Form.Item>

          <Form.Item name="year" rules={[{ required: true, message: "Please enter car year!" }]}>
            <Input placeholder="Enter Year" />
          </Form.Item>

          <Form.Item name="body_type" rules={[{ required: true, message: "Please select body type!" }]}>
            <Select placeholder="Select Body Type" style={{ width: 150 }}>
              <Option value="Sedan">Sedan</Option>
              <Option value="SUV">SUV</Option>
              <Option value="Coupe">Coupe</Option>
              <Option value="Hatchback">Hatchback</Option>
              <Option value="Pickup">Pickup</Option>
            </Select>
          </Form.Item>

           <Form.Item name="trim" rules={[{ required: true, message: "Please enter car trim!" }]}>
            <Input  style={{marginTop:'10px'}} placeholder="Enter Trim" />
          </Form.Item>

          <Form.Item>
            <Button style={{marginTop:'10px'}}type="primary" htmlType="submit" loading={loading}>
              Add Car
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Table
        dataSource={carData.map((item, index) => ({ key: index + 1, id: index + 1, ...item }))}
        columns={columns}
        bordered
        pagination={false}
        loading={loading}
        style={{ textAlign: "center" }}
      />
    </div>
  );
};

export default CarTypes;
