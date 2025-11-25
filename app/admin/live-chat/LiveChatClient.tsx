'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, X, Clock, User, RefreshCw, CheckCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface ChatSession {
  id: string
  visitor_id: string
  visitor_name: string | null
  visitor_email: string | null
  status: 'active' | 'closed'
  created_at: string
  updated_at: string
  last_message_at: string | null
  unread_admin_count: number
}

interface ChatMessage {
  id: string
  session_id: string
  sender_type: 'visitor' | 'admin'
  sender_name: string
  message: string
  created_at: string
  read_at: string | null
}

export default function LiveChatClient() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchSessions()
    subscribeToSessions()
  }, [])

  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession.id)
      subscribeToMessages(selectedSession.id)
      markMessagesAsRead(selectedSession.id)
    }
  }, [selectedSession])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const markMessagesAsRead = async (sessionId: string) => {
    try {
      await supabase
        .from('chat_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('session_id', sessionId)
        .eq('sender_type', 'visitor')
        .is('read_at', null)

      await supabase
        .from('chat_sessions')
        .update({ unread_admin_count: 0 })
        .eq('id', sessionId)

      fetchSessions()
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  const subscribeToSessions = () => {
    const channel = supabase
      .channel('chat_sessions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, () => {
        fetchSessions()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const subscribeToMessages = (sessionId: string) => {
    const channel = supabase
      .channel(`chat_messages_${sessionId}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatMessage])
          if ((payload.new as ChatMessage).sender_type === 'visitor') {
            markMessagesAsRead(sessionId)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession || sending) return

    setSending(true)
    try {
      const { error } = await supabase.from('chat_messages').insert({
        session_id: selectedSession.id,
        sender_type: 'admin',
        sender_name: 'Admin',
        message: newMessage.trim()
      })

      if (error) throw error

      await supabase
        .from('chat_sessions')
        .update({ 
          updated_at: new Date().toISOString(),
          last_message_at: new Date().toISOString(),
          unread_visitor_count: supabase.rpc('increment', { x: 1, row_id: selectedSession.id })
        })
        .eq('id', selectedSession.id)

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const closeSession = async (sessionId: string) => {
    if (!confirm('Close this chat session?')) return

    try {
      await supabase
        .from('chat_sessions')
        .update({ status: 'closed' })
        .eq('id', sessionId)

      if (selectedSession?.id === sessionId) {
        setSelectedSession(null)
      }
      fetchSessions()
    } catch (error) {
      console.error('Error closing session:', error)
    }
  }

  const activeSessions = sessions.filter(s => s.status === 'active')
  const closedSessions = sessions.filter(s => s.status === 'closed')

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Sessions List */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Chat</h2>
            <button onClick={fetchSessions} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <RefreshCw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          <div className="flex gap-2 text-sm">
            <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full">
              {activeSessions.length} Active
            </div>
            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
              {closedSessions.length} Closed
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No chat sessions</div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    selectedSession?.id === session.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {session.visitor_name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {session.visitor_email || 'No email'}
                        </p>
                      </div>
                    </div>
                    {session.unread_admin_count > 0 && (
                      <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">
                        {session.unread_admin_count}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className={`px-2 py-0.5 rounded-full ${
                      session.status === 'active' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {session.status}
                    </span>
                    <span>{new Date(session.updated_at).toLocaleTimeString()}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedSession ? (
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          {/* Chat Header */}
          <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedSession.visitor_name || 'Anonymous Visitor'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedSession.visitor_email || 'No email provided'}
                </p>
              </div>
            </div>
            <button
              onClick={() => closeSession(selectedSession.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              Close Chat
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.sender_type === 'admin' ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-2xl px-4 py-2 ${
                    msg.sender_type === 'admin'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                    {msg.sender_type === 'admin' && msg.read_at && (
                      <CheckCheck className="w-3 h-3 text-emerald-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}
