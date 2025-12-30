'use client'

import { useT12Init, useT12Subscribe, T12_EVENTS } from '@newcool/t12-shared'
import type { EventRSVPPayload, ReportResolvedPayload, BadgeUnlockedPayload } from '@newcool/t12-shared'
import { useNotificationStore } from '@/lib/stores/useNotificationStore'

export function T12Provider({ children }: { children: React.ReactNode }) {
  useT12Init('notifications')

  const addNotification = useNotificationStore((s) => s.addNotification)

  // Listen for Event RSVP with reminders
  useT12Subscribe<EventRSVPPayload>(T12_EVENTS.EVENT_RSVP, (event) => {
    if (event.payload.status === 'going' && event.payload.reminder) {
      console.log('[Notifications] Creating reminder for event:', event.payload.eventTitle)

      addNotification({
        title: 'Recordatorio de Evento',
        message: `Te inscribiste a "${event.payload.eventTitle}". Te notificaremos antes del evento.`,
        category: 'reminder',
        priority: 'medium',
        channels: ['push', 'in_app'],
        actionUrl: `/events/${event.payload.eventId}`,
        actionLabel: 'Ver evento'
      })
    }
  })

  // Listen for moderation resolutions
  useT12Subscribe<ReportResolvedPayload>(T12_EVENTS.REPORT_RESOLVED, (event) => {
    console.log('[Notifications] Report resolved:', event.payload.reportId)

    addNotification({
      title: 'Reporte Resuelto',
      message: `Tu reporte ha sido procesado. Accion: ${event.payload.resolution}`,
      category: 'system',
      priority: 'low',
      channels: ['in_app'],
      actionUrl: '/moderation/my-reports',
      actionLabel: 'Ver detalles'
    })
  })

  // Listen for badge unlocks
  useT12Subscribe<BadgeUnlockedPayload>(T12_EVENTS.BADGE_UNLOCKED, (event) => {
    console.log('[Notifications] Badge unlocked:', event.payload.badgeName)

    addNotification({
      title: 'Badge Desbloqueado!',
      message: `Conseguiste el badge "${event.payload.badgeName}" (${event.payload.rarity})`,
      category: 'achievement',
      priority: 'high',
      channels: ['push', 'in_app'],
      actionUrl: '/achievements',
      actionLabel: 'Ver badges'
    })
  })

  return <>{children}</>
}
