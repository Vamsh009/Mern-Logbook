import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../lib/axios'
import { toast } from 'react-hot-toast'
import NoteCard from '../components/NoteCard'
import NoteNotFound from '../components/NoteNotFound'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get('/notes')
        setNotes(res.data)
      } catch (error) {
        console.log('Error fetching notes:', error)
        if (error.response?.status === 429) {
          toast.error('Too many requests. Please try again later.')
        } else if (error.response?.status === 401) {
          toast.error('Please login to view your notes.')
        } else {
          toast.error('Failed to fetch notes.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (!user) {
      setNotes([])
      setLoading(false)
      return
    }

    setLoading(true)
    fetchNotes()
  }, [user])

  if (authLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <span className='loading loading-spinner loading-lg text-[#e7d8bd]'></span>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      <Navbar />

      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {!user && (
          <div className='rounded-3xl bg-slate-900 border border-slate-700 p-8 text-center text-slate-100 shadow-xl shadow-slate-950/40'>
            <h2 className='text-3xl font-bold mb-4'>Welcome to LogBook</h2>
            <p className='text-slate-300 mb-6'>Login or register to view and manage your notes.</p>
            <div className='flex flex-col sm:flex-row justify-center gap-3'>
              <Link to='/login' className='btn rounded-xl border-0 bg-[#e7d8bd] px-6 text-slate-950 shadow-lg shadow-[#e7d8bd]/20 hover:bg-[#f1e5d0]'>Login</Link>
              <Link to='/register' className='btn rounded-xl border-0 bg-slate-800 text-slate-100 hover:bg-slate-700'>Register</Link>
            </div>
          </div>
        )}

        {user && loading && <div className='text-center text-[#e7d8bd] py-10'>Loading notes...</div>}

        {user && !loading && notes.length === 0 && <NoteNotFound />}

        {user && notes.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
