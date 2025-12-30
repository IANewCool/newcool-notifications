'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NotificationCard } from '@/components/NotificationCard/NotificationCard'
import { useNotificationStore } from '@/lib/stores/useNotificationStore'
import type { NotificationCategory } from '@/lib/types'
import { CATEGORY_CONFIG } from '@/lib/types'

type FilterTab = 'all' | 'unread' | NotificationCategory

export function NotificationCenter() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    getUnreadCount
  } = useNotificationStore()

  const unreadCount = getUnreadCount()

  const filteredNotifications = notifications.filter((n) => {
    if (n.archived) return false
    if (activeFilter === 'all') return true
    if (activeFilter === 'unread') return !n.read
    return n.category === activeFilter
  })

  const filterTabs: { id: FilterTab; label: string; emoji?: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'unread', label: `Sin leer (${unreadCount})` },
    ...Object.entries(CATEGORY_CONFIG).map(([id, config]) => ({
      id: id as NotificationCategory,
      label: config.label,
      emoji: config.emoji
    }))
  ]

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl backdrop-blur-xl border border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              🔔
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-white">Centro de Notificaciones</h2>
              <p className="text-sm text-gray-400">
                {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm bg-gray-700/50 hover:bg-gray-600/50 text-white rounded-lg transition-colors"
            >
              Marcar todas como leídas
            </motion.button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filterTabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-gray-700/30 text-gray-400 hover:bg-gray-600/30'
              }`}
            >
              {tab.emoji && <span className="mr-1">{tab.emoji}</span>}
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500"
            >
              <div className="text-5xl mb-4">📭</div>
              <p>No hay notificaciones</p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onRead={() => markAsRead(notification.id)}
                onArchive={() => archiveNotification(notification.id)}
                onDelete={() => deleteNotification(notification.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
