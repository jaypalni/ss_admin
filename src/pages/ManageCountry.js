import React, { useState } from "react";

function ManageCountry() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const countries = ["India", "USA", "Canada"];
  const citiesByCountry = {
    India: ["Vishakapatnam", "Bangalore", "Hyderabad"],
    USA: ["New York", "Los Angeles", "Chicago"],
    Canada: ["Toronto", "Vancouver", "Montreal"],
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h3>Manage Country & City</h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "40px",
        }}
      >
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            flexDirection: "column",
            padding: "8px",
          }}
        >
          <label style={{ marginBottom: "4px", fontWeight: "600",fontSize:"14px" }}>
            Country:{" "}
          </label>
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            style={{
              padding: "8px 8px",
              fontSize: "14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "",
            }}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            flexDirection: "column",
            padding: "8px",
          }}
        >
          <label style={{ marginBottom: "4px", fontWeight: "600",fontSize:"14px"  }}>
            City:{" "}
          </label>
          <select
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedCountry}
            style={{
              padding: "8px 8px",
              fontSize: "14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "",
            }}
          >
            <option value="">Select City</option>
            {selectedCountry &&
              citiesByCountry[selectedCountry].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ManageCountry;
