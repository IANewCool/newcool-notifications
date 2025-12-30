'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { Notification } from '@/lib/types'
import { CATEGORY_CONFIG, PRIORITY_CONFIG } from '@/lib/types'

interface NotificationCardProps {
  notification: Notification
  onRead: () => void
  onArchive: () => void
  onDelete: () => void
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

  if (seconds < 60) return 'Hace un momento'
  if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`
  if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)}d`
  return new Date(date).toLocaleDateString('es-CL')
}

export function NotificationCard({ notification, onRead, onArchive, onDelete }: NotificationCardProps) {
  const categoryConfig = CATEGORY_CONFIG[notification.category]
  const priorityConfig = PRIORITY_CONFIG[notification.priority]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.01 }}
      className={`relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl p-4 border transition-all duration-200 ${
        notification.read
          ? 'border-gray-700/30 opacity-70'
          : 'border-gray-600/50 shadow-lg'
      }`}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute top-4 left-0 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r" />
      )}

      <div className="flex gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${categoryConfig.color} flex items-center justify-center text-2xl`}>
          {categoryConfig.emoji}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-semibold ${notification.read ? 'text-gray-300' : 'text-white'} truncate`}>
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {timeAgo(notification.createdAt)}
            </span>
          </div>

          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs ${priorityConfig.color}`}>
                {priorityConfig.label}
              </span>
              <span className="text-xs text-gray-600">•</span>
              <span className="text-xs text-gray-500">
                {categoryConfig.label}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {notification.actionUrl && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg"
                >
                  {notification.actionLabel || 'Ver'}
                </motion.button>
              )}

              {!notification.read && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onRead}
                  className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
                  title="Marcar como leída"
                >
                  ✓
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onArchive}
                className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                title="Archivar"
              >
                📥
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Eliminar"
              >
                🗑️
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
