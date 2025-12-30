export type NotificationChannel = 'push' | 'email' | 'sms' | 'whatsapp' | 'in_app'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export type NotificationCategory =
  | 'system'      // Actualizaciones del sistema
  | 'community'   // Actividad de comunidad
  | 'achievement' // Logros y badges
  | 'reminder'    // Recordatorios
  | 'promotion'   // Ofertas y novedades
  | 'alert'       // Alertas importantes

export interface Notification {
  id: string
  title: string
  message: string
  category: NotificationCategory
  priority: NotificationPriority
  channels: NotificationChannel[]
  read: boolean
  archived: boolean
  actionUrl?: string
  actionLabel?: string
  imageUrl?: string
  createdAt: Date
  expiresAt?: Date
}

export interface NotificationPreferences {
  // Canales habilitados
  channels: {
    push: boolean
    email: boolean
    sms: boolean
    whatsapp: boolean
    in_app: boolean
  }

  // Preferencias por categoría
  categories: {
    system: boolean
    community: boolean
    achievement: boolean
    reminder: boolean
    promotion: boolean
    alert: boolean
  }

  // Horarios de no molestar
  quietHours: {
    enabled: boolean
    start: string // "22:00"
    end: string   // "08:00"
  }

  // Frecuencia de digests
  emailDigest: 'realtime' | 'daily' | 'weekly' | 'never'
}

export interface NotificationStats {
  total: number
  unread: number
  byCategory: Record<NotificationCategory, number>
  byPriority: Record<NotificationPriority, number>
}

export const CATEGORY_CONFIG: Record<NotificationCategory, { label: string; emoji: string; color: string }> = {
  system: { label: 'Sistema', emoji: '⚙️', color: 'from-gray-500 to-slate-500' },
  community: { label: 'Comunidad', emoji: '👥', color: 'from-blue-500 to-cyan-500' },
  achievement: { label: 'Logros', emoji: '🏆', color: 'from-yellow-500 to-orange-500' },
  reminder: { label: 'Recordatorios', emoji: '⏰', color: 'from-purple-500 to-pink-500' },
  promotion: { label: 'Novedades', emoji: '🎁', color: 'from-green-500 to-emerald-500' },
  alert: { label: 'Alertas', emoji: '🚨', color: 'from-red-500 to-rose-500' }
}

export const PRIORITY_CONFIG: Record<NotificationPriority, { label: string; color: string }> = {
  low: { label: 'Baja', color: 'text-gray-400' },
  medium: { label: 'Media', color: 'text-blue-400' },
  high: { label: 'Alta', color: 'text-orange-400' },
  urgent: { label: 'Urgente', color: 'text-red-400' }
}

export const CHANNEL_CONFIG: Record<NotificationChannel, { label: string; emoji: string }> = {
  push: { label: 'Push', emoji: '📱' },
  email: { label: 'Email', emoji: '📧' },
  sms: { label: 'SMS', emoji: '💬' },
  whatsapp: { label: 'WhatsApp', emoji: '📲' },
  in_app: { label: 'In-App', emoji: '🔔' }
}
