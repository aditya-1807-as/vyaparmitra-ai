import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import dashboardRoutes from './modules/dashboard/routes.js';
import inventoryRoutes from './modules/inventory/routes.js';
import salesRoutes from './modules/sales/routes.js';
import customerRoutes from './modules/customers/routes.js';
import supplierRoutes from './modules/suppliers/routes.js';
import purchaseRoutes from './modules/purchases/routes.js';
import expenseRoutes from './modules/expenses/routes.js';
import analyticsRoutes from './modules/analytics/routes.js';
import aiRoutes from './modules/ai/routes.js';
import adminRoutes from './modules/admin/routes.js';
import authRoutes from './modules/auth/routes.js';
import superAdminRoutes from './modules/superadmin/routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super-admin', superAdminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'VyaparMitra AI API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build if available (Unified fullstack deployment)
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`VyaparMitra AI Backend running on http://localhost:${PORT}`);
});

