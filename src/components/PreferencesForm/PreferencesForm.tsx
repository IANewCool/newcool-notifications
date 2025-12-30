'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useNotificationStore } from '@/lib/stores/useNotificationStore'
import { CATEGORY_CONFIG, CHANNEL_CONFIG } from '@/lib/types'
import type { NotificationCategory, NotificationChannel } from '@/lib/types'

export function PreferencesForm() {
  const { preferences, toggleChannel, toggleCategory, updatePreferences } = useNotificationStore()

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl backdrop-blur-xl border border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚙️</span>
          <div>
            <h2 className="text-xl font-bold text-white">Preferencias</h2>
            <p className="text-sm text-gray-400">Configura como recibir notificaciones</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Channels */}
        <section>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📡</span> Canales de Notificacion
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {(Object.entries(CHANNEL_CONFIG) as [NotificationChannel, typeof CHANNEL_CONFIG[NotificationChannel]][]).map(
              ([channel, config]) => (
                <motion.button
                  key={channel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleChannel(channel)}
                  className={`p-4 rounded-xl border transition-all ${
                    preferences.channels[channel]
                      ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50 text-white'
                      : 'bg-gray-700/30 border-gray-600/30 text-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-2">{config.emoji}</div>
                  <div className="text-sm font-medium">{config.label}</div>
                  <div className={`text-xs mt-1 ${preferences.channels[channel] ? 'text-cyan-400' : 'text-gray-500'}`}>
                    {preferences.channels[channel] ? 'Activo' : 'Inactivo'}
                  </div>
                </motion.button>
              )
            )}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🏷️</span> Categorias
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.entries(CATEGORY_CONFIG) as [NotificationCategory, typeof CATEGORY_CONFIG[NotificationCategory]][]).map(
              ([category, config]) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleCategory(category)}
                  className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                    preferences.categories[category]
                      ? `bg-gradient-to-r ${config.color} bg-opacity-20 border-transparent text-white`
                      : 'bg-gray-700/30 border-gray-600/30 text-gray-400'
                  }`}
                >
                  <span className="text-2xl">{config.emoji}</span>
                  <div className="text-left">
                    <div className="font-medium">{config.label}</div>
                    <div className={`text-xs ${preferences.categories[category] ? 'text-white/70' : 'text-gray-500'}`}>
                      {preferences.categories[category] ? 'Habilitado' : 'Deshabilitado'}
                    </div>
                  </div>
                </motion.button>
              )
            )}
          </div>
        </section>

        {/* Quiet Hours */}
        <section>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🌙</span> Horas de Silencio
          </h3>
          <div className="bg-gray-700/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium text-white">No molestar</div>
                <div className="text-sm text-gray-400">Silencia notificaciones durante ciertas horas</div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updatePreferences({
                  quietHours: { ...preferences.quietHours, enabled: !preferences.quietHours.enabled }
                })}
                className={`w-14 h-8 rounded-full transition-all ${
                  preferences.quietHours.enabled ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
              >
                <motion.div
                  animate={{ x: preferences.quietHours.enabled ? 24 : 4 }}
                  className="w-6 h-6 bg-white rounded-full shadow-md"
                />
              </motion.button>
            </div>

            {preferences.quietHours.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-4 pt-4 border-t border-gray-600/50"
              >
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Desde</label>
                  <input
                    type="time"
                    value={preferences.quietHours.start}
                    onChange={(e) => updatePreferences({
                      quietHours: { ...preferences.quietHours, start: e.target.value }
                    })}
                    className="px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Hasta</label>
                  <input
                    type="time"
                    value={preferences.quietHours.end}
                    onChange={(e) => updatePreferences({
                      quietHours: { ...preferences.quietHours, end: e.target.value }
                    })}
                    className="px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Email Digest */}
        <section>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📧</span> Resumen por Email
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'realtime', label: 'Tiempo real', desc: 'Cada notificacion' },
              { value: 'daily', label: 'Diario', desc: 'Una vez al dia' },
              { value: 'weekly', label: 'Semanal', desc: 'Una vez por semana' },
              { value: 'never', label: 'Nunca', desc: 'Solo in-app' }
            ].map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updatePreferences({ emailDigest: option.value as any })}
                className={`p-4 rounded-xl border transition-all text-left ${
                  preferences.emailDigest === option.value
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 text-white'
                    : 'bg-gray-700/30 border-gray-600/30 text-gray-400'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-xs mt-1 opacity-70">{option.desc}</div>
              </motion.button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
