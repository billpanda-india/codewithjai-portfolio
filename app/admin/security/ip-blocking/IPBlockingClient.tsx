'use client'

import { useState, useEffect } from 'react'
import { Ban, Plus, Trash2, Search, AlertCircle, RefreshCw, Shield, Globe } from 'lucide-react'

interface BlockedIP {
  id: string
  ip_address: string
  reason: string
  blocked_at: string
  blocked_by: string
  expires_at?: string
  is_permanent: boolean
}

interface VisitorIP {
  ip_address: string
  actual_ip?: string
  country?: string
  city?: string
  device_type?: string
  browser?: string
  os?: string
  last_visit: string
  total_visits: number
  is_blocked: boolean
  is_localhost?: boolean
}

export default function IPBlockingClient() {
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([])
  const [visitorIPs, setVisitorIPs] = useState<VisitorIP[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'visitors' | 'blocked'>('visitors')
  const [newIP, setNewIP] = useState({
    ip_address: '',
    reason: '',
    is_permanent: true,
    duration_hours: 24
  })

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    await Promise.all([fetchBlockedIPs(), fetchVisitorIPs()])
  }

  const fetchBlockedIPs = async () => {
    try {
      const res = await fetch('/api/security/blocked-ips')
      if (res.ok) {
        const data = await res.json()
        setBlockedIPs(data)
      }
    } catch (error) {
      console.error('Error fetching blocked IPs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVisitorIPs = async () => {
    try {
      const res = await fetch('/api/security/visitor-ips')
      if (res.ok) {
        const data = await res.json()
        setVisitorIPs(data)
      }
    } catch (error) {
      console.error('Error fetching visitor IPs:', error)
    }
  }

  const blockIP = async (ipAddress?: string, reason?: string) => {
    const ip = ipAddress || newIP.ip_address
    const blockReason = reason || newIP.reason || 'Blocked from admin panel'

    if (!ip) {
      alert('Please provide an IP address')
      return
    }

    try {
      const res = await fetch('/api/security/blocked-ips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ip_address: ip,
          reason: blockReason,
          is_permanent: ipAddress ? true : newIP.is_permanent,
          duration_hours: ipAddress ? 24 : newIP.duration_hours
        })
      })

      if (res.ok) {
        await fetchData()
        setShowAddModal(false)
        setNewIP({ ip_address: '', reason: '', is_permanent: true, duration_hours: 24 })
      } else {
        alert('Failed to block IP')
      }
    } catch (error) {
      console.error('Error blocking IP:', error)
      alert('Error blocking IP')
    }
  }

  const unblockIP = async (id: string) => {
    if (!confirm('Are you sure you want to unblock this IP address?')) return

    try {
      const res = await fetch(`/api/security/blocked-ips/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        await fetchData()
      } else {
        alert('Failed to unblock IP')
      }
    } catch (error) {
      console.error('Error unblocking IP:', error)
      alert('Error unblocking IP')
    }
  }

  const filteredBlockedIPs = blockedIPs.filter(ip =>
    ip.ip_address.includes(searchTerm) ||
    ip.reason.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredVisitorIPs = visitorIPs.filter(ip =>
    ip.ip_address.includes(searchTerm) ||
    ip.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ip.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">IP Blocking</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and block IP addresses accessing your site</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Block IP
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Visitors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{visitorIPs.length}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Blocked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{blockedIPs.length}</p>
            </div>
            <Ban className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Permanent Blocks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {blockedIPs.filter(ip => ip.is_permanent).length}
              </p>
            </div>
            <Ban className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Temporary Blocks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {blockedIPs.filter(ip => !ip.is_permanent).length}
              </p>
            </div>
            <Ban className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('visitors')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'visitors'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Active Visitors ({visitorIPs.length})
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'blocked'
                ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Blocked IPs ({blockedIPs.length})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={activeTab === 'visitors' ? "Search IP, country, or city..." : "Search IP address or reason..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Info Banner for Localhost */}
      {activeTab === 'visitors' && visitorIPs.some(v => v.is_localhost) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Development Mode Detected
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You're seeing localhost IPs (::1, 127.0.0.1) because you're testing locally. 
                When deployed to production, you'll see real visitor IP addresses from around the world.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === 'visitors' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading visitor IPs...</div>
          ) : filteredVisitorIPs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No visitor IPs found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Device</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Browser</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Visits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Visit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredVisitorIPs.map((visitor, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          {visitor.ip_address}
                          {visitor.is_localhost && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                              Local
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          {visitor.city && visitor.country ? `${visitor.city}, ${visitor.country}` : visitor.country || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {visitor.device_type || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {visitor.browser || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {visitor.total_visits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(visitor.last_visit).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visitor.is_blocked ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                            Blocked
                          </span>
                        ) : (
                          <button
                            onClick={() => blockIP(visitor.actual_ip || visitor.ip_address, `Blocked visitor from ${visitor.country || 'unknown location'}`)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                          >
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading blocked IPs...</div>
          ) : filteredBlockedIPs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No blocked IP addresses</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Blocked At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expires</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredBlockedIPs.map((ip) => (
                    <tr key={ip.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                        {ip.ip_address}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {ip.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ip.is_permanent 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
                        }`}>
                          {ip.is_permanent ? 'Permanent' : 'Temporary'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(ip.blocked_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {ip.expires_at ? new Date(ip.expires_at).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => unblockIP(ip.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add IP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Block IP Address</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  IP Address *
                </label>
                <input
                  type="text"
                  value={newIP.ip_address}
                  onChange={(e) => setNewIP({ ...newIP, ip_address: e.target.value })}
                  placeholder="192.168.1.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason *
                </label>
                <textarea
                  value={newIP.reason}
                  onChange={(e) => setNewIP({ ...newIP, reason: e.target.value })}
                  placeholder="Suspicious activity detected..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newIP.is_permanent}
                    onChange={(e) => setNewIP({ ...newIP, is_permanent: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Permanent block</span>
                </label>
              </div>

              {!newIP.is_permanent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    value={newIP.duration_hours}
                    onChange={(e) => setNewIP({ ...newIP, duration_hours: parseInt(e.target.value) })}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
              )}

              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Blocked IPs will be unable to access any part of your website.
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => blockIP()}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Block IP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
