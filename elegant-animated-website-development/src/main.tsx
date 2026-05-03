import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // 1. Import Router tools
import "./index.css";
import App from "./App";
import Login from "./pages/Login/Login"; 
import Dashboard from "./pages/Dashboard/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 3. Wrap everything in BrowserRouter */}
    <BrowserRouter>
      {/* 4. Define your paths */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);