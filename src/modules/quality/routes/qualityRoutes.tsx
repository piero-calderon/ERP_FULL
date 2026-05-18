// Modulo 7 - Calidad - rutas
import React from "react";
import { Route } from "react-router-dom";
import QualityPage from "../pages/QualityPage";

export const qualityRoutes = (
  <Route path="/calidad" element={<QualityPage />} />
);
