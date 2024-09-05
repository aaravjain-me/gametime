import React from "react";
import { Route, Routes } from 'react-router-dom';
import Register from "./components/Register";
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App;