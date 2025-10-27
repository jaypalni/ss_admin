import React,{useEffect} from 'react';
import AllCarsDashboard from '../components/allcarsdashboard'; 
import PendingListings from "../components/pendinglistings";
import { useNavigate } from 'react-router-dom';
import {  useSelector } from 'react-redux';

const ListingManagement = () => {
  const navigate = useNavigate();
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
  return (
    <div
      style={{
        height: "calc(100vh - 70px)", 
        overflowY: "auto",
        padding: "20px",
      }}
    >
      <AllCarsDashboard /> 
      <PendingListings /> 
    </div>
  );
};


export default ListingManagement;
