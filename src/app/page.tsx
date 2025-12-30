'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { NotificationCenter } from '@/components/NotificationCenter/NotificationCenter'
import { PreferencesForm } from '@/components/PreferencesForm/PreferencesForm'
import { useNotificationStore } from '@/lib/stores/useNotificationStore'

type Tab = 'notifications' | 'preferences' | 'stats'

export default function NotificationsDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('notifications')
  const { getStats, addNotification } = useNotificationStore()
  const stats = getStats()

  const tabs = [
    { id: 'notifications', label: 'Notificaciones', emoji: '🔔' },
    { id: 'preferences', label: 'Preferencias', emoji: '⚙️' },
    { id: 'stats', label: 'Estadísticas', emoji: '📊' },
  ]

  const handleTestNotification = () => {
    addNotification({
      title: '¡Notificación de prueba!',
      message: 'Esta es una notificación de prueba generada desde el dashboard.',
      category: 'system',
      priority: 'medium',
      channels: ['in_app', 'push']
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/80 via-purple-900/40 to-pink-900/40 backdrop-blur-xl border-b border-purple-500/20 p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              🔔
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                NewCool Notifications
              </h1>
              <p className="text-gray-400 mt-1">
                Sistema Multicanal | T12-COMMUNITY
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTestNotification}
            className="ml-auto px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 hover:border-green-400/50 transition-all"
          >
            + Test
          </motion.button>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'notifications' && <NotificationCenter />}

          {activeTab === 'preferences' && <PreferencesForm />}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-8 backdrop-blur-xl border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📊</span> Resumen de Notificaciones
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                    <div className="text-3xl font-black text-white">{stats.total}</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                  <div className="bg-cyan-500/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-black text-cyan-400">{stats.unread}</div>
                    <div className="text-xs text-gray-400">Sin leer</div>
                  </div>
                  <div className="bg-purple-500/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-black text-purple-400">
                      {stats.total > 0 ? Math.round((stats.unread / stats.total) * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-400">Pendientes</div>
                  </div>
                  <div className="bg-green-500/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-black text-green-400">
                      {stats.total - stats.unread}
                    </div>
                    <div className="text-xs text-gray-400">Leídas</div>
                  </div>
                </div>

                {/* By Category */}
                <h4 className="text-lg font-semibold text-white mb-4">Por Categoría</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(stats.byCategory).map(([category, count]) => (
                    <div key={category} className="bg-gray-700/30 rounded-xl p-4 flex items-center gap-3">
                      <span className="text-2xl">
                        {category === 'system' && '⚙️'}
                        {category === 'community' && '👥'}
                        {category === 'achievement' && '🏆'}
                        {category === 'reminder' && '⏰'}
                        {category === 'promotion' && '🎁'}
                        {category === 'alert' && '🚨'}
                      </span>
                      <div>
                        <div className="text-xl font-bold text-white">{count}</div>
                        <div className="text-xs text-gray-400 capitalize">{category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channels Info */}
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-8 backdrop-blur-xl border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📡</span> Canales Disponibles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📱</span>
                      <span className="font-medium text-white">Push Notifications</span>
                    </div>
                    <p className="text-sm text-gray-400">Notificaciones instantáneas en dispositivos móviles y escritorio.</p>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📧</span>
                      <span className="font-medium text-white">Email</span>
                    </div>
                    <p className="text-sm text-gray-400">Resúmenes diarios, semanales o en tiempo real.</p>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">💬</span>
                      <span className="font-medium text-white">SMS</span>
                    </div>
                    <p className="text-sm text-gray-400">Para alertas críticas y zonas con conectividad limitada.</p>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📲</span>
                      <span className="font-medium text-white">WhatsApp</span>
                    </div>
                    <p className="text-sm text-gray-400">Integración con WhatsApp Business para recordatorios.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>NewCool Notifications | T12-COMMUNITY | Sistema Multicanal</p>
      </footer>
    </div>
  )
}
