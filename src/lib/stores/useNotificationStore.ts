import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Notification,
  NotificationPreferences,
  NotificationStats,
  NotificationCategory,
  NotificationPriority
} from '@/lib/types'

interface NotificationState {
  // Data
  notifications: Notification[]
  preferences: NotificationPreferences

  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'archived' | 'createdAt'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  archiveNotification: (id: string) => void
  deleteNotification: (id: string) => void
  clearAll: () => void

  // Preferences
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void
  toggleChannel: (channel: keyof NotificationPreferences['channels']) => void
  toggleCategory: (category: NotificationCategory) => void

  // Computed
  getStats: () => NotificationStats
  getUnreadCount: () => number
  getFilteredNotifications: (filter: {
    category?: NotificationCategory
    read?: boolean
    archived?: boolean
  }) => Notification[]
}

const defaultPreferences: NotificationPreferences = {
  channels: {
    push: true,
    email: true,
    sms: false,
    whatsapp: false,
    in_app: true
  },
  categories: {
    system: true,
    community: true,
    achievement: true,
    reminder: true,
    promotion: false,
    alert: true
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  },
  emailDigest: 'daily'
}

// Demo notifications
const demoNotifications: Notification[] = [
  {
    id: 'demo-1',
    title: '¡Nuevo logro desbloqueado!',
    message: 'Has completado tu primera semana de aprendizaje continuo. ¡Sigue así!',
    category: 'achievement',
    priority: 'medium',
    channels: ['push', 'in_app'],
    read: false,
    archived: false,
    actionUrl: '/achievements',
    actionLabel: 'Ver logros',
    createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 min ago
  },
  {
    id: 'demo-2',
    title: 'Actualización del sistema',
    message: 'Hemos mejorado la velocidad de carga en un 40%. Disfruta la experiencia.',
    category: 'system',
    priority: 'low',
    channels: ['in_app'],
    read: false,
    archived: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: 'demo-3',
    title: 'María comentó en tu proyecto',
    message: '"¡Excelente trabajo! Me encantó tu solución creativa."',
    category: 'community',
    priority: 'medium',
    channels: ['push', 'email', 'in_app'],
    read: true,
    archived: false,
    actionUrl: '/community/projects/123',
    actionLabel: 'Ver comentario',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
  },
  {
    id: 'demo-4',
    title: 'Recordatorio: Clase en vivo',
    message: 'Tu clase de matemáticas comienza en 1 hora. ¡No te la pierdas!',
    category: 'reminder',
    priority: 'high',
    channels: ['push', 'sms', 'in_app'],
    read: false,
    archived: false,
    actionUrl: '/live/math-101',
    actionLabel: 'Unirse',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    id: 'demo-5',
    title: '🎁 Nuevos contenidos disponibles',
    message: '15 nuevas lecciones de ciencias han sido agregadas. ¡Explóralas!',
    category: 'promotion',
    priority: 'low',
    channels: ['email', 'in_app'],
    read: true,
    archived: false,
    actionUrl: '/explore/science',
    actionLabel: 'Explorar',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
  }
]

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: demoNotifications,
      preferences: defaultPreferences,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}`,
          read: false,
          archived: false,
          createdAt: new Date()
        }

        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }))
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true }))
        }))
      },

      archiveNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, archived: true } : n
          )
        }))
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id)
        }))
      },

      clearAll: () => {
        set({ notifications: [] })
      },

      updatePreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs }
        }))
      },

      toggleChannel: (channel) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            channels: {
              ...state.preferences.channels,
              [channel]: !state.preferences.channels[channel]
            }
          }
        }))
      },

      toggleCategory: (category) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            categories: {
              ...state.preferences.categories,
              [category]: !state.preferences.categories[category]
            }
          }
        }))
      },

      getStats: () => {
        const notifications = get().notifications.filter((n) => !n.archived)

        const byCategory = {} as Record<NotificationCategory, number>
        const byPriority = {} as Record<NotificationPriority, number>

        notifications.forEach((n) => {
          byCategory[n.category] = (byCategory[n.category] || 0) + 1
          byPriority[n.priority] = (byPriority[n.priority] || 0) + 1
        })

        return {
          total: notifications.length,
          unread: notifications.filter((n) => !n.read).length,
          byCategory,
          byPriority
        }
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read && !n.archived).length
      },

      getFilteredNotifications: (filter) => {
        return get().notifications.filter((n) => {
          if (filter.category && n.category !== filter.category) return false
          if (filter.read !== undefined && n.read !== filter.read) return false
          if (filter.archived !== undefined && n.archived !== filter.archived) return false
          return true
        })
      }
    }),
    {
      name: 'newcool-notifications-storage'
    }
  )
)
