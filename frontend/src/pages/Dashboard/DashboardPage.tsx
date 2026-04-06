import { useState, useEffect } from 'react';
import { dashboardAPI, alertsAPI } from '../../services/api';
import { DashboardStats, ChartData, KPIs } from '../../types';
import { Card } from '../../components/common/Card';
import { KPICard } from '../../components/dashboard/KPICard';
import { Layout } from '../../components/layout/Layout';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, chartRes, kpisRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getChartData(),
        dashboardAPI.getKPIs()
      ]);
      setStats(statsRes.data);
      setChartData(chartRes.data);
      setKpis(kpisRes.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  };

  const rotationChartData = {
    labels: chartData?.rotation.map(r => r.fecha.slice(5)) || [],
    datasets: [
      {
        label: 'Entradas',
        data: chartData?.rotation.map(r => r.entradas) || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Salidas',
        data: chartData?.rotation.map(r => r.salidas) || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const categoryChartData = {
    labels: chartData?.byCategory.map(c => c.categoria.toUpperCase()) || [],
    datasets: [{
      data: chartData?.byCategory.map(c => c.cantidad) || [],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      borderWidth: 0
    }]
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">Resumen ejecutivo del sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Productos"
            value={stats?.inventory.total_productos || 0}
            icon="📦"
            color="primary"
          />
          <KPICard
            title="Valor Inventario"
            value={formatCurrency(stats?.inventory.valor_total_inventario || 0)}
            icon="💰"
            color="success"
          />
          <KPICard
            title="Bajo Stock"
            value={stats?.inventory.productos_bajo_stock || 0}
            icon="⚠️"
            color="warning"
          />
          <KPICard
            title="Stock Crítico"
            value={stats?.inventory.productos_stock_critico || 0}
            icon="🚨"
            color="danger"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card title="Rotación de Inventario (Últimos 30 días)">
            <Line
              data={rotationChartData}
              options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </Card>

          <Card title="Inventario por Categoría">
            <div className="h-64 flex items-center justify-center">
              <Doughnut
                data={categoryChartData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'bottom' } }
                }}
              />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="KPIs Importantes">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Tasa de Rotación</span>
                <span className="font-semibold text-slate-800">{kpis?.tasa_rotacion || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Promedio Unitario</span>
                <span className="font-semibold text-slate-800">{formatCurrency(kpis?.promedio_unitario || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Entradas del Mes</span>
                <span className="font-semibold text-success-500">{kpis?.entradas_mes || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Salidas del Mes</span>
                <span className="font-semibold text-danger-500">{kpis?.salidas_mes || 0}</span>
              </div>
            </div>
          </Card>

          <Card title="Movimientos de Hoy">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Entradas</span>
                <span className="text-2xl font-bold text-success-500">+{stats?.movements.entradas_hoy || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Salidas</span>
                <span className="text-2xl font-bold text-danger-500">-{stats?.movements.salidas_hoy || 0}</span>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <span className="text-slate-500">Total Semana</span>
                <span className="text-xl font-semibold text-slate-800 ml-2">{stats?.movements.movimientos_semana || 0}</span>
              </div>
            </div>
          </Card>

          <Card title="Alertas">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Sin leer</span>
                <span className="px-2 py-1 bg-danger-100 text-danger-600 rounded-full text-sm font-medium">
                  {stats?.alerts.alertas_sin_leer || 0}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
