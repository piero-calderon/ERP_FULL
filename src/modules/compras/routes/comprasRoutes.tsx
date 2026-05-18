// ============================================================
// MÓDULO 4 — COMPRAS Y PROVEEDORES
// routes/comprasRoutes.tsx
// ============================================================
// Agrega estas rutas dentro de tu <Routes> principal en App.tsx
// Ejemplo:
//   import { comprasRoutes } from './modules/compras/routes/comprasRoutes';
//   ...
//   {comprasRoutes}
// ============================================================

import React from 'react';
import { Route } from 'react-router-dom';
import ComprasPage from '../pages/ComprasPage';

export const comprasRoutes = (
  <Route path="/compras" element={<ComprasPage />} />
);
