'use client'

import { useState, useEffect } from 'react'
import { Shield, Plus, Trash2, Edit2, Save, X, AlertCircle } from 'lucide-react'

interface FirewallRule {
  id: string
  name: string
  rule_type: 'allow' | 'deny' | 'rate_limit' | 'geo_block'
  pattern: string
  priority: number
  enabled: boolean
  description: string
  created_at: string
  updated_at: string
}

export default function FirewallPage() {
  const [rules, setRules] = useState<FirewallRule[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRule, setEditingRule] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newRule, setNewRule] = useState({
    name: '',
    rule_type: 'deny' as 'allow' | 'deny' | 'rate_limit' | 'geo_block',
    pattern: '',
    priority: 100,
    enabled: true,
    description: ''
  })

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/security/firewall')
      if (res.ok) {
        const data = await res.json()
        setRules(data)
      }
    } catch (error) {
      console.error('Error fetching firewall rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const addRule = async () => {
    if (!newRule.name || !newRule.pattern) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const res = await fetch('/api/security/firewall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      })

      if (res.ok) {
        await fetchRules()
        setShowAddModal(false)
        setNewRule({
          name: '',
          rule_type: 'deny',
          pattern: '',
          priority: 100,
          enabled: true,
          description: ''
        })
      } else {
        alert('Failed to add rule')
      }
    } catch (error) {
      console.error('Error adding rule:', error)
      alert('Error adding rule')
    }
  }

  const toggleRule = async (id: string, enabled: boolean) => {
    try {
      const res = await fetch(`/api/security/firewall/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      })

      if (res.ok) {
        await fetchRules()
      }
    } catch (error) {
      console.error('Error toggling rule:', error)
    }
  }

  const deleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this firewall rule?')) return

    try {
      const res = await fetch(`/api/security/firewall/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        await fetchRules()
      } else {
        alert('Failed to delete rule')
      }
    } catch (error) {
      console.error('Error deleting rule:', error)
      alert('Error deleting rule')
    }
  }

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'allow': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      case 'deny': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
      case 'rate_limit': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'geo_block': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Firewall Rules</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Configure advanced security rules and access controls</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Rules</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{rules.length}</p>
            </div>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Rules</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {rules.filter(r => r.enabled).length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deny Rules</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {rules.filter(r => r.rule_type === 'deny').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rate Limits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {rules.filter(r => r.rule_type === 'rate_limit').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Firewall Rule Priority
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Rules are evaluated in order of priority (lower numbers = higher priority). 
              The first matching rule will be applied.
            </p>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading firewall rules...</div>
        ) : rules.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No firewall rules configured</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pattern</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {rules.sort((a, b) => a.priority - b.priority).map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      {rule.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {rule.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRuleTypeColor(rule.rule_type)}`}>
                        {rule.rule_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                      {rule.pattern}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {rule.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={(e) => toggleRule(rule.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteRule(rule.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Firewall Rule</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rule Name *
                </label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  placeholder="Block suspicious bots"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rule Type *
                </label>
                <select
                  value={newRule.rule_type}
                  onChange={(e) => setNewRule({ ...newRule, rule_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                  <option value="deny">Deny</option>
                  <option value="allow">Allow</option>
                  <option value="rate_limit">Rate Limit</option>
                  <option value="geo_block">Geo Block</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pattern *
                </label>
                <input
                  type="text"
                  value={newRule.pattern}
                  onChange={(e) => setNewRule({ ...newRule, pattern: e.target.value })}
                  placeholder="/api/* or user-agent:bot"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <input
                  type="number"
                  value={newRule.priority}
                  onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Lower numbers = higher priority
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Describe what this rule does..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newRule.enabled}
                    onChange={(e) => setNewRule({ ...newRule, enabled: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Enable rule immediately</span>
                </label>
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
                onClick={addRule}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
