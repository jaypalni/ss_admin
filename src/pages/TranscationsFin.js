import React,{useEffect,useState} from "react";
import {
  Spin,
  Empty,
} from "antd";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const TranscationsFin = () => {
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
            tip="Loading Transcations..."
            style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
          />
        );
      }
      if (!profileData) {
        return (
          <div style={{ padding: 24 }}>
            <Empty description="No transcations data available" />
          </div>
        );
      }
  return (
     <div className="content-wrapper">
      <div className="page-header">
        <h3>Transcations</h3>
      </div>
    </div>
  )
}

export default TranscationsFin