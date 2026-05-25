import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CameraIcon, LogOutIcon, LogInIcon, PlusIcon, UserPlus2Icon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/axios'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout, updateUser } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const profileRef = useRef(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleProfileToggle = async () => {
    const nextOpen = !profileOpen
    setProfileOpen(nextOpen)

    if (!nextOpen) return

    try {
      const res = await api.get('/auth/me')
      updateUser(res.data.user)
    } catch (error) {
      console.log('Error refreshing profile:', error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }

    if (file.size > 75000) {
      toast.error('Choose an image under 75 KB')
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      setUploadingAvatar(true)
      try {
        const res = await api.put('/auth/profile', { avatarUrl: reader.result })
        updateUser(res.data.user)
        toast.success('Profile picture updated')
      } catch (error) {
        console.log('Error updating profile picture:', error)
        toast.error(error.response?.data?.message || 'Failed to update profile picture')
      } finally {
        setUploadingAvatar(false)
        event.target.value = ''
      }
    }
    reader.readAsDataURL(file)
  }

  const avatar = user?.avatarUrl
  const initial = user?.username?.charAt(0)?.toUpperCase() || 'U'
  const noteCount = user?.noteCount ?? 0

  return (
    <header className='sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl'>
      <div className='mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8'>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <Link to='/' className='group inline-flex w-fit items-center gap-3'>
            <span className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e7d8bd] text-lg font-black text-slate-950 shadow-lg shadow-[#e7d8bd]/20'>
              L
            </span>
            <h1 className='font-mono text-2xl font-bold tracking-normal text-slate-50 transition-colors group-hover:text-[#f1e5d0] sm:text-3xl'>
              LogBook
            </h1>
          </Link>

          <div className='flex w-full items-center gap-2 sm:w-auto sm:justify-end sm:gap-3'>
            {user ? (
              <>
                <Link to='/create' className='btn btn-sm h-10 min-h-10 flex-1 rounded-lg border-0 bg-[#e7d8bd] px-4 text-slate-950 shadow-lg shadow-[#e7d8bd]/20 transition-all hover:bg-[#f1e5d0] hover:shadow-[#e7d8bd]/30 sm:flex-none'>
                  <PlusIcon className='size-4' />
                  <span>New Note</span>
                </Link>
                <div className='relative flex-1 sm:flex-none' ref={profileRef}>
                  <button
                    type='button'
                    onClick={handleProfileToggle}
                    className='flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-700/70 bg-slate-800 px-2.5 text-sm font-medium text-slate-100 transition-all hover:border-slate-600 hover:bg-slate-700 sm:w-auto sm:justify-start sm:px-3'
                  >
                    <span className='flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700 text-xs font-bold text-[#e7d8bd]'>
                      {avatar ? (
                        <img src={avatar} alt={`${user.username} profile`} className='size-full object-cover' />
                      ) : (
                        initial
                      )}
                    </span>
                    <span className='max-w-24 truncate sm:max-w-32'>{user.username}</span>
                  </button>

                  {profileOpen && (
                    <div className='absolute right-0 top-12 z-40 w-72 rounded-lg border border-slate-800 bg-slate-950 p-4 text-slate-100 shadow-2xl shadow-slate-950/50'>
                      <div className='flex items-center gap-3'>
                        <button
                          type='button'
                          onClick={() => fileInputRef.current?.click()}
                          className='group relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-800 text-xl font-bold text-[#e7d8bd] ring-1 ring-slate-700 transition hover:ring-[#e7d8bd]/70'
                          disabled={uploadingAvatar}
                        >
                          {avatar ? (
                            <img src={avatar} alt={`${user.username} profile`} className='size-full object-cover' />
                          ) : (
                            initial
                          )}
                          <span className='absolute inset-0 flex items-center justify-center bg-slate-950/60 opacity-0 transition group-hover:opacity-100'>
                            <CameraIcon className='size-5' />
                          </span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type='file'
                          accept='image/*'
                          className='hidden'
                          onChange={handleAvatarChange}
                        />
                        <div className='min-w-0'>
                          <p className='truncate text-base font-semibold'>{user.username}</p>
                          <p className='truncate text-sm text-slate-400'>{user.email}</p>
                        </div>
                      </div>

                      <div className='mt-4 grid grid-cols-2 gap-3'>
                        <div className='rounded-lg border border-slate-800 bg-slate-900 p-3'>
                          <p className='text-xs text-slate-400'>Notes</p>
                          <p className='text-xl font-semibold text-[#e7d8bd]'>{noteCount}</p>
                        </div>
                        <button
                          type='button'
                          onClick={() => fileInputRef.current?.click()}
                          className='rounded-lg border border-slate-800 bg-slate-900 p-3 text-left text-sm font-medium text-slate-200 transition hover:border-slate-700 hover:bg-slate-800 disabled:text-slate-500'
                          disabled={uploadingAvatar}
                        >
                          {uploadingAvatar ? 'Uploading...' : 'Change photo'}
                        </button>
                      </div>

                      <button
                        type='button'
                        onClick={handleLogout}
                        className='mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 text-sm font-semibold text-red-200 transition hover:border-red-400/60 hover:bg-red-500/20'
                      >
                        <LogOutIcon className='size-4' />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to='/login' className='btn btn-sm h-10 min-h-10 flex-1 rounded-lg border-0 bg-[#e7d8bd] px-4 text-slate-950 shadow-lg shadow-[#e7d8bd]/20 transition-all hover:bg-[#f1e5d0] sm:flex-none'>
                  <LogInIcon className='size-4' />
                  Login
                </Link>
                <Link to='/register' className='btn btn-sm h-10 min-h-10 flex-1 rounded-lg border border-slate-700/70 bg-slate-800 px-4 text-slate-100 transition-all hover:border-slate-600 hover:bg-slate-700 sm:flex-none'>
                  <UserPlus2Icon className='size-4' />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  )
}

export default Navbar
