import React from "react";

function Dashboard() {
  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h3>Dashboard</h3>
        {/* <p>Welcome to your dashboard</p> */}
      </div>

      <div className="content-body">
        <div className="row">
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Total Users</h5>
                <p className="card-text display-4">1,234</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Revenue</h5>
                <p className="card-text display-4">$45,678</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Orders</h5>
                <p className="card-text display-4">567</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Growth</h5>
                <p className="card-text display-4">+12%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
