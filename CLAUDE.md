# CLAUDE.md - NewCool Notifications

## Identidad del Modulo

```
MODULO: newcool-notifications
DEPARTAMENTO: T12-COMMUNITY
ROL: Sistema de Notificaciones Multicanal
DOMINIO: notifications.newcool.io
PUERTO: 3014
```

## Descripcion

Sistema completo de notificaciones multicanal que permite comunicarse con usuarios a traves de:
- **Push Notifications**: Notificaciones instantaneas en dispositivos
- **Email**: Resumenes y alertas por correo
- **SMS**: Para alertas criticas y zonas rurales
- **WhatsApp**: Integracion con WhatsApp Business
- **In-App**: Notificaciones dentro de la plataforma

## Componentes Principales

| Componente | Funcion | Archivo |
|------------|---------|---------|
| `NotificationCenter` | Centro de notificaciones con filtros | `components/NotificationCenter/NotificationCenter.tsx` |
| `NotificationCard` | Tarjeta individual de notificacion | `components/NotificationCard/NotificationCard.tsx` |
| `PreferencesForm` | Configuracion de preferencias | `components/PreferencesForm/PreferencesForm.tsx` |

## Categorias de Notificaciones

```yaml
categories:
  system:
    emoji: "⚙️"
    description: "Actualizaciones del sistema"
  community:
    emoji: "👥"
    description: "Actividad de la comunidad"
  achievement:
    emoji: "🏆"
    description: "Logros y badges"
  reminder:
    emoji: "⏰"
    description: "Recordatorios importantes"
  promotion:
    emoji: "🎁"
    description: "Novedades y ofertas"
  alert:
    emoji: "🚨"
    description: "Alertas criticas"
```

## Prioridades

```yaml
priorities:
  low: "Baja - informativa"
  medium: "Media - accion recomendada"
  high: "Alta - accion necesaria"
  urgent: "Urgente - atencion inmediata"
```

## Stack Tecnologico

```
Frontend: Next.js 15, React 19
Animaciones: Framer Motion
Estado: Zustand (persistente en localStorage)
Estilos: Tailwind CSS 4
Puerto: 3014
```

## Estructura de Archivos

```
newcool-notifications/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard principal
│   │   └── globals.css
│   ├── components/
│   │   ├── NotificationCenter/
│   │   │   └── NotificationCenter.tsx
│   │   ├── NotificationCard/
│   │   │   └── NotificationCard.tsx
│   │   └── PreferencesForm/
│   │       └── PreferencesForm.tsx
│   └── lib/
│       ├── stores/
│       │   └── useNotificationStore.ts
│       └── types/
│           └── index.ts
├── package.json
└── CLAUDE.md
```

## Comandos

```bash
# Desarrollo
npm run dev    # http://localhost:3014

# Build
npm run build

# Produccion
npm run start
```

## Integracion con T12-COMMUNITY

```yaml
recibe_de:
  - newcool-community: eventos de comunidad
  - newcool-cerebro: triggers de notificacion
  - newcool-gamification: logros completados
  - newcool-events: recordatorios de eventos

provee_a:
  - newcool-analytics: metricas de engagement
  - newcool-impact: datos de alcance
  - TODOS: capacidad de notificar usuarios
```

## API Endpoints (Planificados)

```yaml
POST /api/notifications/send:
  description: "Enviar notificacion"
  body: { userId: string, notification: Notification }

POST /api/notifications/broadcast:
  description: "Enviar a multiples usuarios"
  body: { userIds: string[], notification: Notification }

GET /api/notifications/user/{userId}:
  description: "Obtener notificaciones de usuario"
  response: { notifications: Notification[], unreadCount: number }

PUT /api/notifications/{id}/read:
  description: "Marcar como leida"

GET /api/notifications/preferences/{userId}:
  description: "Obtener preferencias de usuario"

PUT /api/notifications/preferences/{userId}:
  description: "Actualizar preferencias"
```

## Preferencias de Usuario

```yaml
channels:
  - push: Notificaciones push (mobile/desktop)
  - email: Correo electronico
  - sms: Mensajes de texto
  - whatsapp: WhatsApp Business
  - in_app: Dentro de la aplicacion

quiet_hours:
  enabled: boolean
  start: "22:00"
  end: "08:00"

email_digest:
  - realtime: Cada notificacion
  - daily: Resumen diario
  - weekly: Resumen semanal
  - never: Solo in-app
```

## Principios de Diseno

```
1. No spam - Respetar preferencias del usuario
2. Relevancia - Solo notificar lo importante
3. Multicanal - Llegar por el canal preferido
4. Accesibilidad - SMS para zonas rurales
5. Control total - Usuario decide que recibir
```

## Conectividad Rural

```yaml
estrategia_rural:
  sms_fallback:
    - Alertas criticas por SMS
    - Sin necesidad de internet
    - Bajo costo operativo

  offline_queue:
    - Almacenar notificaciones offline
    - Sincronizar cuando hay conexion

  whatsapp_lite:
    - Funciona con datos limitados
    - Mensajes comprimidos
```

## Metricas de Exito

| Metrica | Target | Critico |
|---------|--------|---------|
| Delivery rate | >98% | <90% |
| Open rate (push) | >40% | <20% |
| Click-through rate | >15% | <5% |
| Unsubscribe rate | <2% | >10% |
| Tiempo respuesta | <1s | >5s |

## Prohibiciones

```
- NO spam o notificaciones excesivas
- NO enviar sin consentimiento
- NO ignorar preferencias del usuario
- NO rastrear aperturas sin consentimiento
- NO vender datos de contacto
```

**Mantra: "La notificacion correcta, al usuario correcto, en el momento correcto."**
