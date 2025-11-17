
# 📘 Sistema de Gestión de Casos – Fullstack (Next.js + Express + JWT)

Aplicación fullstack para la gestión de casos, con autenticación JWT, arquitectura modular y una interfaz moderna construida con Next.js.
Incluye CRUD completo, validación, manejo de errores y un flujo de uso claro.

---

## 🌐 Demo en vivo

- **Frontend:** [https://gestion-casos-fullstack.onrender.com/](https://gestion-casos-fullstack.onrender.com/)
- **Backend:** [https://gestion-casos-fullstack-backend.onrender.com/](https://gestion-casos-fullstack-backend.onrender.com/)

> **Nota:** El backend usa almacenamiento en memoria. Los datos se reinician cuando Render duerme el servicio.

---

## 🏗️ Arquitectura

```text
proyecto/
├── backend-casos/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── dtos/
│   │   ├── filters/
│   │   └── seeds/
└── frontend-casos/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   └── lib/
```

---

## 🛠️ Tecnologías usadas

### Backend
- Node.js + Express
- TypeScript
- JWT
- class-validator

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

---

## 🔐 Variables de entorno

### Backend (`.env`)
```env
JWT_SECRET=tu_secreto
PORT=4000
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 📌 Endpoints principales

| Método | Ruta         | Descripción           |
|--------|--------------|-----------------------|
| POST   | /auth/login  | Obtener JWT           |
| GET    | /casos       | Listar casos (JWT)    |
| POST   | /casos       | Crear caso            |
| PUT    | /casos/:id   | Actualizar caso       |
| DELETE | /casos/:id   | Eliminar caso         |

---

## 👤 Usuario demo

- **Email:** demo@demo.com
- **Password:** Demo1234

---

## 🚀 Instalación

### Backend
```bash
cd backend-casos
npm install
npm run dev
```

### Frontend
```bash
cd frontend-casos
npm install
npm run dev
```

---

## 📅 Roadmap futuro

- Persistencia con PostgreSQL
- Roles y permisos
- Filtros y búsquedas
- Tests unitarios con Jest
- Docker + CI/CD

---

## 👤 Autor

**Christopher Eduardo Valdivia Baca**

- Frontend: Next.js + TS + Tailwind
- Backend: Express + TS + JWT