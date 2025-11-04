import React from "react";
import AppRouter from "./router"; 
import logo from "./logo.svg";
import "./App.css";
import { Modal } from "antd"; // here ✅
import 'antd/dist/reset.css'; 
function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
