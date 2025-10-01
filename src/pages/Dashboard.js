import React,{useEffect,useState} from "react";
import {
  Spin,
  Empty,
} from "antd";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
function Dashboard() {
   const dispatch = useDispatch();
  const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
  const { user,token } = useSelector(state => state.auth);
   const isLoggedIn = token && user
   useEffect(() => {
    console.log('OTP Screen useEffect - isLoggedIn:', isLoggedIn);
    
    if (!isLoggedIn) {
      navigate('/');
    } else {
      console.log('User not logged in or coming from login flow, staying on OTP screen');
    }
  }, [isLoggedIn, navigate]);

 useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setProfileData(null); 
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Spin
        tip="Loading Profile..."
        style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
      />
    );
  }

  if (!profileData) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="No dashboard data available" />
      </div>
    );
  }

  if (loading) {
    return (
      <Spin
        tip="Loading Profile..."
        style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
      />
    );
  }
  if (!profileData) {
    return (
      <div style={{ padding: 24 }}>
        <Empty description="No dashboard data available" />
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h3>Dashboard</h3>
        {/* <p>Welcome to your dashboard</p> */}
      </div>

      {/* <div className="content-body">
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
      </div> */}
    </div>
  );
}

export default Dashboard;
