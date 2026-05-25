import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      toast.error('Email and password are required')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password
      })
      login(res.data.user, res.data.token)
      toast.success('Logged in successfully')
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen'>
      <Navbar />
      <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8'>
        <div className='max-w-md mx-auto'>
          <div className='card overflow-hidden rounded-lg border border-slate-800 border-t-[#e7d8bd] bg-slate-900/95 shadow-xl shadow-slate-950/30'>
            <div className='card-body p-5 sm:p-6'>
              <h2 className='mb-4 text-2xl font-semibold text-slate-50'>Login</h2>
              <form onSubmit={handleSubmit}>
                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text text-slate-300'>Email</span>
                  </label>
                  <input
                    type='email'
                    placeholder='you@example.com'
                    className='input input-bordered bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-[#e7d8bd] focus:outline-none'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text text-slate-300'>Password</span>
                  </label>
                  <input
                    type='password'
                    placeholder='Your password'
                    className='input input-bordered bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-[#e7d8bd] focus:outline-none'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className='card-actions justify-end mt-6'>
                  <button
                    type='submit'
                    className='btn h-11 min-h-11 w-full rounded-lg border-0 bg-[#e7d8bd] px-5 text-slate-950 shadow-lg shadow-[#e7d8bd]/20 hover:bg-[#f1e5d0] disabled:bg-slate-700 disabled:text-slate-400 sm:w-auto'
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
              </form>
              <p className='mt-4 text-slate-300'>
                Don&apos;t have an account?{' '}
                <Link to='/register' className='text-[#e7d8bd] hover:text-[#f1e5d0]'>
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
