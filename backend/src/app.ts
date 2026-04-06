import express from 'express';
import cors from 'cors';
import { initializeDatabase, saveDatabase } from './models/database';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import movementRoutes from './routes/movements';
import dashboardRoutes from './routes/dashboard';
import alertRoutes from './routes/alerts';
import userRoutes from './routes/users';
import warehouseRoutes from './routes/warehouse';
import supplierRoutes from './routes/suppliers';
import { LogRepository } from './repositories/LogRepository';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function startServer() {
  await initializeDatabase();

  LogRepository.create({
    accion: 'SERVIDOR_INICIADO',
    entidad: 'system',
    detalle: 'Servidor API iniciado correctamente'
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/movements', movementRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/alerts', alertRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/warehouses', warehouseRoutes);
  app.use('/api/suppliers', supplierRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    LogRepository.create({
      accion: 'ERROR_SERVIDOR',
      entidad: 'system',
      detalle: `Error: ${err.message}`
    });
    res.status(500).json({ error: 'Error interno del servidor' });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📦 API disponible en http://localhost:${PORT}/api`);
  });
}

startServer().catch(console.error);

export default app;
