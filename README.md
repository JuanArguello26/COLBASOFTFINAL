# COLBASOFT

Sistema Logístico para la Gestión de Inventarios en PYMES del Sector Textil del Eje Cafetero

---

## 📋 Descripción del Proyecto

**COLBASOFT** es un aplicativo web tipo SaaS desarrollado como proyecto de grado para la carrera de Ingeniería de Software. Su objetivo principal es **automatizar los procesos logísticos** en la gestión de inventarios de pequeñas y medianas empresas del sector textil del Eje Cafetero colombiano.

### 🎯 Problema que Resuelve

Las PYMES textiles del Eje Cafetero enfrentan desafíos críticos:

- **Procesos manuales**: Uso de planillas Excel para control de inventario
- **Errores humanos**: Falta de validación automática en las operaciones
- **Baja trazabilidad**: No se conoce quién hizo cada cambio ni cuándo
- **Falta de digitalización**: Sistemas obsoletos o inexistentes

### 💡 Solución Propuesta

Una plataforma web moderna que permite:
- Control de inventario en tiempo real
- Registro automático de movimientos (entradas, salidas, ajustes)
- Alertas automáticas de bajo stock
- Trazabilidad completa de cada operación
- Dashboard con métricas e indicadores clave (KPIs)

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

| Componente | Tecnología |
|------------|-------------|
| **Frontend** | React + Vite + Tailwind CSS |
| **Backend** | Node.js + Express + TypeScript |
| **Base de Datos** | SQLite (sql.js) - lista para migrar a PostgreSQL |
| **Autenticación** | JWT (JSON Web Tokens) |

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  React + Vite + Tailwind CSS + Chart.js                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │Dashboard │ │Inventario│ │Movimientos│ │Usuarios │        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │ REST API
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│  Node.js + Express + TypeScript                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │Controladores │ │  Servicios   │ │ Repositorios │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BASE DE DATOS                          │
│  SQLite (sql.js)                                            │
│  ┌───────┐ ┌────────┐ ┌──────────┐ ┌───────┐ ┌──────┐     │
│  │Users  │ │Products│ │Movements│ │Alerts │ │Logs  │     │
│  └───────┘ └────────┘ └──────────┘ └───────┘ └──────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Características Principales

### 1. 📦 Gestión de Inventario

- **CRUD completo** de productos (telas, insumos, prendas)
- Control de stock en **tiempo real**
- **Búsqueda y filtros** por categoría, almacén, código
- Alertas automáticas de bajo stock y stock crítico

### 2. 🔄 Movimientos Automáticos

- Registro de **entradas** (compras a proveedores)
- Registro de **salidas** (producción/ventas)
- **Ajustes** de inventario con motivo
- **Actualización automática** de stock en cada operación

### 3. 📊 Dashboard Inteligente

- KPIs: Total productos, valor inventario, bajo stock, stock crítico
- Gráficos de **rotación de inventario** (últimos 30 días)
- Distribución por **categoría** (telas, insumos, prendas)
- Resumen de **movimientos del día**

### 4. 🔍 Trazabilidad Completa

- Registro de cada operación con **usuario responsable**
- Historial completo de **movimientos por producto**
- Logs de auditoría para cumplimiento

### 5. 👥 Gestión de Usuarios

- **Roles**: Administrador y Operario
- Control de permisos
- Registro de actividad por usuario

### 6. 🏭 Múltiples Almacenes

- Tres almacenes del Eje Cafetero:
  - Pereira (Almacén Central)
  - Armenia
  - Manizales

---

## 🛠️ Instalación y Ejecución

### Prerrequisitos

- **Node.js** 18 o superior
- **npm** o **yarn**

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/JuanArguello26/COLBASOFTFINAL.git
cd COLBASOFTFINAL
```

### Paso 2: Instalar dependencias del Backend

```bash
cd backend
npm install
```

### Paso 3: Ejecutar datos de prueba (seed)

```bash
npm run seed
```

Esto creará automáticamente:
- 3 usuarios (1 administrador, 2 operarios)
- 3 almacenes (Pereira, Armenia, Manizales)
- 15 productos de ejemplo
- 25 movimientos de prueba
- 4 alertas iniciales

### Paso 4: Iniciar el Backend

```bash
npm run dev
```

El servidor estará disponible en: **http://localhost:3001**

### Paso 5: Instalar dependencias del Frontend

En otra terminal:

```bash
cd frontend
npm install
```

### Paso 6: Iniciar el Frontend

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## 🔑 Credenciales de Acceso

| Rol | Email | Contraseña |
|-----|-------|------------|
| Administrador | `admin@colbasoft.com` | `admin123` |
| Operario | `operario1@colbasoft.com` | `operario123` |
| Operario | `operario2@colbasoft.com` | `operario123` |

---

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/logout` - Cerrar sesión

### Productos
- `GET /api/products` - Listar productos (con filtros)
- `GET /api/products/:id` - Ver producto específico
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `GET /api/products/low-stock` - Productos con bajo stock
- `GET /api/products/critical` - Productos con stock crítico

### Movimientos
- `GET /api/movements` - Historial de movimientos
- `POST /api/movements/entrada` - Registrar entrada
- `POST /api/movements/salida` - Registrar salida
- `POST /api/movements/ajuste` - Registrar ajuste

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/chart` - Datos para gráficos
- `GET /api/dashboard/kpis` - Indicadores clave de rendimiento

### Usuarios (Solo Admin)
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Alertas
- `GET /api/alerts` - Ver todas las alertas
- `GET /api/alerts/unread` - Alertas sin leer
- `PUT /api/alerts/:id/read` - Marcar alerta como leída
- `PUT /api/alerts/read-all` - Marcar todas como leídas

### Almacenes
- `GET /api/warehouses` - Listar almacenes
- `POST /api/warehouses` - Crear almacén
- `PUT /api/warehouses/:id` - Actualizar almacén

---

## 📊 Diferencial del Proyecto (para Presentación)

### 1. Reducción de Errores Humanos

- ✅ Validación automática de cantidad (no permite valores negativos)
- ✅ Códigos únicos por producto (evita duplicados)
- ✅ Validación de stock suficiente en salidas
- ✅ Confirmación en operaciones críticas

### 2. Eficiencia Operativa

- ✅ Búsqueda rápida de productos
- ✅ Actualización de stock en tiempo real
- ✅ Alertas proactivas automáticas (no reactivas)
- ✅ Reportes instantáneos

### 3. Trazabilidad Completa

- ✅ Quién hizo cada cambio (`user_id`)
- ✅ Cuándo se realizó (`timestamp`)
- ✅ Qué cambió (antes/después)
- ✅ Por qué se realizó (motivo registrado)

### 4. Adaptado al Contexto Regional

- ✅ Categorías específicas: telas, insumos, prendas
- ✅ Unidades de medida: metros, unidades, kilogramos
- ✅ Almacenes del Eje Cafetero (Pereira, Armenia, Manizales)
- ✅ Proveedores locales del sector textil

---

## 📁 Estructura del Proyecto

```
COLBASOFTFINAL/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Controladores API
│   │   ├── services/       # Lógica de negocio
│   │   ├── repositories/   # Acceso a datos
│   │   ├── models/         # Modelos de base de datos
│   │   ├── middleware/    # Autenticación y validación
│   │   ├── routes/        # Definición de rutas API
│   │   ├── types/         # Definiciones TypeScript
│   │   ├── app.ts         # Punto de entrada
│   │   └── seed.ts        # Datos de prueba
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   │   ├── common/    # Button, Input, Card, Table, Modal
│   │   │   ├── layout/    # Layout, Sidebar
│   │   │   └── dashboard/ # KPICard
│   │   ├── pages/         # Vistas principales
│   │   │   ├── Login/
│   │   │   ├── Dashboard/
│   │   │   ├── Inventario/
│   │   │   ├── Movimientos/
│   │   │   ├── Trazabilidad/
│   │   │   └── Usuarios/
│   │   ├── services/      # Cliente API
│   │   ├── context/       # Estado global (Auth)
│   │   ├── types/         # Tipos TypeScript
│   │   ├── App.tsx        # Componente principal
│   │   └── main.tsx       # Punto de entrada
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── index.html
│
├── README.md
└── .gitignore
```

---

## 🔄 Escalabilidad y Mejoras Futuras

El sistema está diseñado para escalar:

1. **Base de datos**: Migrar de SQLite a PostgreSQL sin cambios en el código de aplicación
2. **Backend**: Arquitectura modular que permite agregar nuevos módulos
3. **Frontend**: Componentes reutilizables para rápida expansión
4. **Cloud**: Listo para despliegue en servicios como Vercel, Render, Railway

### Mejoras propuestas:

- 📱 **App móvil** paraAndroid/iOS
- 🏭 **Módulo de producción** (órdenes de trabajo)
- 📦 **Módulo de proveedores**
- 📄 **Exportación** a PDF/Excel
- 📧 **Notificaciones** por email
- 📊 **Reportes** avanzados
- 🔗 **Integración** con sistemas contables

---

## 📝 Documentación Técnica

### Tecnologías Utilizadas

| Tecnología | Propósito |
|------------|-----------|
| React | Librería de interfaz de usuario |
| Vite | Build tool y servidor de desarrollo |
| Tailwind CSS | Framework de estilos |
| Chart.js | Gráficos y visualizaciones |
| Node.js | Runtime de JavaScript |
| Express | Framework web |
| TypeScript | Tipado estático |
| SQLite | Base de datos embebida |
| JWT | Autenticación basada en tokens |

### Patrones de Diseño

- **MVC** (Model-View-Controller) en el backend
- **Repository Pattern** para acceso a datos
- **Context API** para estado global en frontend
- **Component-based** architecture

---

## 👨‍💻 Autores

- **Juan Argüello** - Ingeniero de Software
- Proyecto de Grado - Ingeniería de Software

---

## 📄 Licencia

Este proyecto es de uso académico para trabajo de grado.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias.

---

<div align="center">

**⭐ Si te gusta el proyecto, no olvides给它 un estrella!**

Hecho con ❤️ para las PYMES textiles del Eje Cafetero

</div>
