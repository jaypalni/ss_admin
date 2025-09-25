import React from 'react';
import AllCarsDashboard from '../components/allcarsdashboard'; 
import PendingListings from "../components/pendinglistings";
import MostPopularModels from "../components/mostpopularmodels";

const ListingManagement = () => {
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
      <MostPopularModels /> 
    </div>
  );
};


export default ListingManagement;
