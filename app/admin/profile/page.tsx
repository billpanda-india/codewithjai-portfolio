'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Mail, Lock, Save, Loader2, CheckCircle2, XCircle, Upload, Camera } from 'lucide-react'
import Image from 'next/image'

interface AdminProfile {
  id: string
  name: string
  email: string
  avatar?: string | null
}

export default function AdminProfilePage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'profile'
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const [profile, setProfile] = useState<AdminProfile>({
    id: '',
    name: '',
    email: '',
    avatar: null
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' })
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 2MB' })
      return
    }

    setUploadingAvatar(true)
    try {
      // Convert to base64 for simple storage
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64String = reader.result as string
        setProfile({ ...profile, avatar: base64String })
        setMessage({ type: 'success', text: 'Avatar uploaded! Click Save to apply changes.' })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload avatar' })
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar
        })
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Failed to change password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error changing password' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-black dark:text-white">Admin Profile</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account settings</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-gray-900 h-auto p-2 rounded-lg border border-gray-200 dark:border-gray-800">
          <TabsTrigger value="profile" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            Profile Settings
          </TabsTrigger>
          <TabsTrigger value="password" className="px-3 py-2 rounded-md font-medium transition-colors data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
            Password Settings
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white">Profile Information</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Update your personal details</p>
          </div>
        </div>

            <div className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-800"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">Profile Picture</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="John Doe"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="admin@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-black dark:text-white">Change Password</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
          </div>
        </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500">Minimum 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="pl-10"
                  />
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
