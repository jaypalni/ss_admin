import React from "react";
import "../assets/styles/header.css";
import iconWhite from "../assets/images/souqLogo.svg";
import Car_icon from "../assets/images/Car_icon.png";


const Header = () => {
  

  return (
    <>
      <div>
        <div className="header">
          <div className="row remove_gutter">
            <div className="col-3 d-flex">
              <img className="headerLogo" src={iconWhite} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Profile Banner - Only show on login pages */}

          {/* Car Image Banner */}
          <div
            style={{
              width: "100%",
              height: 326,
              background: "#222",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Placeholder for car image */}
            <img
              src={Car_icon}
              alt="Car"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 70%",
                opacity: 0.7,
              }}
            />
            <h1
              style={{
                position: "absolute",
                color: "#fff",
                fontWeight: 700,
                fontSize: 32,
              }}
            >
              {"Welcome To Souq Sayarat"}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};
export default Header;
