import { v4 as uuidv4 } from 'uuid';
import type { Caso } from '../types.js';

export const seedCasos: Caso[] = [
  {
    id: uuidv4(),
    nombre: '🔴 Error crítico en login',
    descripcion: 'Los usuarios no pueden iniciar sesión con redes sociales',
    estado: 'nuevo',
    prioridad: 'alta',
    responsable: 'Juan Pérez',
  },
  {
    id: uuidv4(),
    nombre: '🟡 Mejorar UI del dashboard',
    descripcion: 'Hacer la interfaz más moderna y responsiva',
    estado: 'en progreso',
    prioridad: 'media',
    responsable: 'María García',
  },
  {
    id: uuidv4(),
    nombre: '🟢 Documentar API REST',
    descripcion: 'Crear documentación completa de todos los endpoints',
    estado: 'completado',
    prioridad: 'baja',
    responsable: undefined,
  },
  {
    id: uuidv4(),
    nombre: '🔵 Implementar búsqueda global',
    descripcion: 'Agregar barra de búsqueda en el dashboard',
    estado: 'nuevo',
    prioridad: 'media',
    responsable: 'Carlos López',
  },
  {
    id: uuidv4(),
    nombre: '⚪ Optimizar base de datos',
    descripcion: 'Revisar índices y queries lentos',
    estado: 'nuevo',
    prioridad: 'baja',
    responsable: undefined,
  },
];
