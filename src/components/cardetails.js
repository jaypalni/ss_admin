import React from "react";
import { Button, Switch, Carousel } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/styles/cardetails.css";

const CarDetails = () => {
  const navigate = useNavigate();
  const { car_id } = useParams();
  const [isBestCar, setIsBestCar] = React.useState(false);

  const data = [
    {
      key: "1",
      name: "Warner",
      carmakemodel: "Honda City",
      yearmfg: "Manual, 2018",
      carengine: "V8",
      lastLogin: "2024-01-15 10:30",
      avatar: "https://via.placeholder.com/40",
      carImages: [
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
      ],
      carDescription:
        "A stylish and fuel-efficient sedan with spacious interiors.",
      firstname: "David",
      lastname: "Warner",
      email: "warner@example.com",
      date_of_birth: "1990-10-27",
      country_code: "91",
      phone_number: "9876543210",
      address: "Sydney, Australia",
      designation: "Cricketer",
      industry: "Sports",
      role: "Dealer",
    },
    {
      key: "2",
      name: "Jane Smith",
      carmakemodel: "Hyundai i20",
      yearmfg: "Manual, 2018",
      carengine: "V8",
      lastLogin: "2024-01-14 15:45",
      avatar: "https://via.placeholder.com/40",
      carImages: [
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
      ],
      carDescription: "Compact hatchback offering premium features and safety.",
      firstname: "Jane",
      lastname: "Smith",
      email: "jane@example.com",
      date_of_birth: "1988-07-14",
      country_code: "1",
      phone_number: "1234567890",
      address: "New York, USA",
      designation: "Manager",
      industry: "Tech",
      role: "Dealer",
    },
    {
      key: "3",
      name: "Mike Johnson",
      carmakemodel: "Tata Nexon",
      yearmfg: "Manual, 2018",
      carengine: "V8",
      lastLogin: "2024-01-10 09:15",
      avatar: "https://via.placeholder.com/40",
      carImages: [
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
        "https://cdn.pixabay.com/photo/2015/01/19/13/51/car-604019_1280.jpg",
      ],
      carDescription: "Indian compact SUV known for safety and performance.",
      firstname: "Mike",
      lastname: "Johnson",
      email: "mike@example.com",
      date_of_birth: "1985-05-23",
      country_code: "44",
      phone_number: "1122334455",
      address: "London, UK",
      designation: "Engineer",
      industry: "Automotive",
      role: "Dealer",
    },
  ];

  const selectedCar = data.find((car) => car.key === String(car_id));
  const defaultImages = data[0].carImages;
  const imagesToShow = selectedCar?.carImages?.length
    ? selectedCar.carImages
    : defaultImages;

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

  if (!selectedCar) {
    return <div style={{ padding: 24 }}> </div>;
  }

  return (
    <div className="car-details-container">
      <Carousel autoplay>
  {imagesToShow.map((image) => (
    <div key={image} className="d-flex justify-content-center">
      <img
        src={image}
        alt="Car"
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


      <h2 className="car-title">{selectedCar.carmakemodel}</h2>
      <p className="car-description">{selectedCar.carDescription}</p>

      <div className="summary-container">
        <div className="summary-box">
          <div className="summary-title">Year</div>
          <div className="summary-value">2021</div>
        </div>
        <div className="summary-box">
          <div className="summary-title">Fuel Type</div>
          <div className="summary-value">Petrol</div>
        </div>
        <div className="summary-box">
          <div className="summary-title">Condition</div>
          <div className="summary-value">New</div>
        </div>
        <div className="summary-box">
          <div className="summary-title">Kilometers</div>
          <div className="summary-value">59,000</div>
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
              {renderRow("Body Type", "Wagon")}
              {renderRow("Regional Specs", "US Specs")}
              {renderRow("Door Count", "4")}
              {renderRow("Number of Seats", "5")}
              {renderRow("Version", "B200")}
            </tbody>
          </table>
        </div>
        <div style={{ width: "48%" }}>
          <h3>Additional Details</h3>
          <table style={tableStyle}>
            <tbody>
              {renderRow("Engine CC", "1600")}
              {renderRow("Number of Cylinders", "4")}
              {renderRow("Consumption (1/100 km)", "20")}
              {renderRow("Transmission", "Automatic")}
              {renderRow("Drive Type", "Front Wheel Drive")}
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
        <span style={{ fontWeight: 600, marginRight: 10 }}>
          Select as Best Car:
        </span>
        <Switch checked={isBestCar} onChange={setIsBestCar} />
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
