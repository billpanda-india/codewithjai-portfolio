'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface ChatMessage {
  id: string
  session_id: string
  sender_type: 'visitor' | 'admin'
  sender_name: string
  message: string
  created_at: string
}

interface ChatSession {
  id: string
  visitor_id: string
  visitor_name: string
  visitor_email: string | null
  status: string
  created_at: string
  updated_at: string
  last_message_at: string | null
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [showSessionList, setShowSessionList] = useState(false)
  const [visitorName, setVisitorName] = useState('')
  const [visitorEmail, setVisitorEmail] = useState('')
  const [showNameForm, setShowNameForm] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [sessionClosed, setSessionClosed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check for existing visitor
    const visitorId = localStorage.getItem('visitor_id')
    const storedName = localStorage.getItem('chat_visitor_name')
    const storedEmail = localStorage.getItem('chat_visitor_email')

    if (visitorId && storedName) {
      setVisitorName(storedName)
      setVisitorEmail(storedEmail || '')
      setShowNameForm(false)
      loadAllSessions(visitorId)
    }
  }, [])

  useEffect(() => {
    if (!isOpen && unreadCount > 0) {
      // Show notification
    }
  }, [unreadCount, isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadAllSessions = async (visitorId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('visitor_id', visitorId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setSessions(data || [])
      
      // Load the most recent active session, or the most recent one
      const activeSession = data?.find(s => s.status === 'active')
      const latestSession = activeSession || data?.[0]
      
      if (latestSession) {
        switchToSession(latestSession.id, latestSession.status === 'closed')
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }

  const switchToSession = (newSessionId: string, isClosed: boolean) => {
    setSessionId(newSessionId)
    setSessionClosed(isClosed)
    setShowSessionList(false)
    localStorage.setItem('chat_session_id', newSessionId)
    loadMessages(newSessionId)
    subscribeToMessages(newSessionId)
  }

  const checkSessionStatus = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('status')
        .eq('id', sessionId)
        .single()

      if (error) throw error
      
      if (data?.status === 'closed') {
        setSessionClosed(true)
      }
    } catch (error) {
      console.error('Error checking session status:', error)
    }
  }

  const startNewChat = async () => {
    const visitorId = localStorage.getItem('visitor_id')
    if (!visitorId) return

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          visitor_id: visitorId,
          visitor_name: visitorName,
          visitor_email: visitorEmail || null,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error

      // Reload all sessions
      await loadAllSessions(visitorId)
      
      // Switch to new session
      switchToSession(data.id, false)

      // Send welcome message
      await sendSystemMessage(data.id, 'Hello! How can we help you today?')
    } catch (error) {
      console.error('Error starting new chat:', error)
      alert('Failed to start new chat. Please try again.')
    }
  }

  const startChat = async () => {
    if (!visitorName.trim()) {
      alert('Please enter your name')
      return
    }

    try {
      const visitorId = localStorage.getItem('visitor_id') || `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('visitor_id', visitorId)

      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          visitor_id: visitorId,
          visitor_name: visitorName,
          visitor_email: visitorEmail || null,
          status: 'active'
        })
        .select()
        .single()

      if (error) throw error

      setSessionId(data.id)
      localStorage.setItem('chat_session_id', data.id)
      localStorage.setItem('chat_visitor_name', visitorName)
      if (visitorEmail) localStorage.setItem('chat_visitor_email', visitorEmail)
      
      setShowNameForm(false)
      subscribeToMessages(data.id)

      // Send welcome message
      await sendSystemMessage(data.id, 'Hello! How can we help you today?')
    } catch (error) {
      console.error('Error starting chat:', error)
      alert('Failed to start chat. Please try again.')
    }
  }

  const sendSystemMessage = async (sessionId: string, message: string) => {
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      sender_type: 'admin',
      sender_name: 'Support Team',
      message
    })
  }

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])

      // Mark visitor messages as read
      const unread = data?.filter(m => m.sender_type === 'admin' && !m.read_at).length || 0
      setUnreadCount(unread)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const subscribeToMessages = (sessionId: string) => {
    const channel = supabase
      .channel(`chat_widget_${sessionId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          setMessages(prev => [...prev, newMsg])
          
          if (newMsg.sender_type === 'admin' && !isOpen) {
            setUnreadCount(prev => prev + 1)
          }
        }
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_sessions', filter: `id=eq.${sessionId}` },
        (payload) => {
          const updatedSession = payload.new as any
          if (updatedSession.status === 'closed') {
            setSessionClosed(true)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !sessionId) return

    try {
      const { error } = await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender_type: 'visitor',
        sender_name: visitorName,
        message: newMessage.trim()
      })

      if (error) throw error

      await supabase
        .from('chat_sessions')
        .update({
          updated_at: new Date().toISOString(),
          last_message_at: new Date().toISOString(),
          unread_admin_count: supabase.rpc('increment', { x: 1, row_id: sessionId })
        })
        .eq('id', sessionId)

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    setIsMinimized(false)
    setUnreadCount(0)
  }

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center z-50 group"
      >
        <MessageCircle className="w-7 h-7" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
        <span className="absolute right-20 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Chat with us!
        </span>
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col transition-all ${
      isMinimized ? 'h-16' : 'h-[600px]'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Live Chat Support</h3>
            <p className="text-xs text-white/80">
              {sessions.length > 0 ? `${sessions.length} conversation${sessions.length > 1 ? 's' : ''}` : "We're here to help!"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {sessions.length > 0 && !showNameForm && (
            <button
              onClick={() => setShowSessionList(!showSessionList)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-xs"
              title="View all chats"
            >
              History
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label="Minimize chat"
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {showNameForm ? (
            <div className="flex-1 p-6 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Start a conversation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">We typically reply within minutes</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={visitorEmail}
                    onChange={(e) => setVisitorEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={startChat}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Start Chat
                </button>
              </div>
            </div>
          ) : showSessionList ? (
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Chat History</h3>
                <button
                  onClick={startNewChat}
                  className="text-sm px-3 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:opacity-90"
                >
                  New Chat
                </button>
              </div>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => switchToSession(session.id, session.status === 'closed')}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      session.id === sessionId
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {new Date(session.created_at).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        session.status === 'active'
                          ? session.id === sessionId ? 'bg-white/20' : 'bg-green-100 text-green-700'
                          : session.id === sessionId ? 'bg-white/20' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <p className="text-xs opacity-70">
                      {new Date(session.created_at).toLocaleTimeString()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === 'visitor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${
                      msg.sender_type === 'visitor'
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                    } rounded-2xl px-4 py-2 shadow-sm`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {sessionClosed ? (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      This chat session has been closed by our support team.
                    </p>
                    <button
                      onClick={startNewChat}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Start New Chat
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      aria-label="Send message"
                      className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
