'use client'

import { useState, useEffect } from 'react'
import { FileText, AlertCircle, Info, AlertTriangle, XCircle, Search, Download, RefreshCw } from 'lucide-react'

interface SystemLog {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'critical'
  category: 'api' | 'database' | 'email' | 'auth' | 'system'
  message: string
  details?: string
  stack_trace?: string
}

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/security/system-logs')
      if (res.ok) {
        const data = await res.json()
        setLogs(data)
      }
    } catch (error) {
      console.error('Error fetching system logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error': return <AlertCircle className="w-5 h-5 text-orange-500" />
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
      case 'warning': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
      case 'error': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20'
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'api': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
      case 'database': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'email': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300'
      case 'auth': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300'
      case 'system': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel
    const matchesCategory = filterCategory === 'all' || log.category === filterCategory
    return matchesSearch && matchesLevel && matchesCategory
  })

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'Level', 'Category', 'Message', 'Details'],
      ...filteredLogs.map(log => [
        log.timestamp,
        log.level,
        log.category,
        log.message,
        log.details || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-logs-${new Date().toISOString()}.csv`
    a.click()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Logs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor errors, API calls, and system events</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['info', 'warning', 'error', 'critical'].map(level => {
          const count = logs.filter(log => log.level === level).length
          return (
            <div key={level} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{level}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{count}</p>
                </div>
                {getLevelIcon(level)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            <option value="api">API</option>
            <option value="database">Database</option>
            <option value="email">Email</option>
            <option value="auth">Auth</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-2">
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500">
            Loading logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center text-gray-500">
            No system logs found
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/50"
                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getLevelIcon(log.level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(log.category)}`}>
                          {log.category.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">{log.message}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {expandedLog === log.id && (log.details || log.stack_trace) && (
                <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  {log.details && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Details:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{log.details}</p>
                    </div>
                  )}
                  {log.stack_trace && (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Stack Trace:</p>
                      <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
                        {log.stack_trace}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
