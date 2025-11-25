'use client'

import { useState, useEffect } from 'react'
import { Mail, Search, RefreshCw, Send, X, CheckCircle, Clock, Trash2, Eye } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  project_interest?: string
  created_at: string
  status: 'new' | 'read' | 'replied'
  replied_at?: string
  reply_message?: string
}

export default function LeadsClient() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads')
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}/read`, {
        method: 'PATCH'
      })
      if (res.ok) {
        await fetchLeads()
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const sendReply = async () => {
    if (!selectedLead || !replyMessage.trim()) {
      alert('Please enter a reply message')
      return
    }

    setSending(true)
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage })
      })

      if (res.ok) {
        alert('Reply sent successfully!')
        setShowReplyModal(false)
        setReplyMessage('')
        setSelectedLead(null)
        await fetchLeads()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to send reply')
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Error sending reply')
    } finally {
      setSending(false)
    }
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchLeads()
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }

  const openViewModal = (lead: Lead) => {
    setSelectedLead(lead)
    setShowViewModal(true)
    if (lead.status === 'new') {
      markAsRead(lead.id)
    }
  }

  const openReplyModal = (lead: Lead) => {
    setSelectedLead(lead)
    setShowReplyModal(true)
    setShowViewModal(false)
    if (lead.status === 'new') {
      markAsRead(lead.id)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
      case 'read': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'replied': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Mail className="w-4 h-4" />
      case 'read': return <Eye className="w-4 h-4" />
      case 'replied': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage contact form submissions and replies</p>
        </div>
        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{leads.length}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">New</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {leads.filter(l => l.status === 'new').length}
              </p>
            </div>
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Read</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {leads.filter(l => l.status === 'read').length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Replied</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {leads.filter(l => l.status === 'replied').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No leads found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Received</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                        {getStatusIcon(lead.status)}
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                      {lead.project_interest && (
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 mb-1">
                          {lead.project_interest}
                        </span>
                      )}
                      <p className="truncate">{lead.message}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(lead.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openViewModal(lead)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openReplyModal(lead)}
                          className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                          title="Reply"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
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

      {/* View Modal */}
      {showViewModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <div className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full ${getStatusColor(selectedLead.status)}`}>
                {getStatusIcon(selectedLead.status)}
                {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">Name:</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{selectedLead.name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">Email:</span>
                    <a href={`mailto:${selectedLead.email}`} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                      {selectedLead.email}
                    </a>
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">Phone:</span>
                      <a href={`tel:${selectedLead.phone}`} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                        {selectedLead.phone}
                      </a>
                    </div>
                  )}
                  {selectedLead.project_interest && (
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">Interest:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{selectedLead.project_interest}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">Received:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{new Date(selectedLead.created_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{selectedLead.message}</p>
              </div>

              {/* Previous Reply */}
              {selectedLead.status === 'replied' && selectedLead.reply_message && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">Your Reply</h3>
                  <p className="text-sm text-green-600 dark:text-green-400 whitespace-pre-wrap">{selectedLead.reply_message}</p>
                  <p className="text-xs text-green-500 dark:text-green-400 mt-2">
                    Sent: {selectedLead.replied_at ? new Date(selectedLead.replied_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => openReplyModal(selectedLead)}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Reply
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  deleteLead(selectedLead.id)
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Reply to {selectedLead.name}</h2>
              <button
                onClick={() => {
                  setShowReplyModal(false)
                  setReplyMessage('')
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Original Message */}
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Original Message:</p>
              {selectedLead.project_interest && (
                <div className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <strong>Project Interest:</strong> {selectedLead.project_interest}
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedLead.message}</p>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  From: {selectedLead.email} • {new Date(selectedLead.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Previous Reply */}
            {selectedLead.status === 'replied' && selectedLead.reply_message && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-2">Previous Reply:</p>
                <p className="text-sm text-green-600 dark:text-green-400">{selectedLead.reply_message}</p>
                <p className="text-xs text-green-500 dark:text-green-400 mt-2">
                  Sent: {selectedLead.replied_at ? new Date(selectedLead.replied_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            )}

            {/* Reply Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Reply *
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowReplyModal(false)
                    setReplyMessage('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReply}
                  disabled={sending || !replyMessage.trim()}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
