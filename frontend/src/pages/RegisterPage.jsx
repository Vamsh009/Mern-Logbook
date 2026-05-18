import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error('All fields are required')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password
      })
      login(res.data.user, res.data.token)
      toast.success('Account created successfully')
      navigate('/')
    } catch (error) {
      console.error('Registration failed:', error)
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen'>
      <Navbar />
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-md mx-auto'>
          <div className='card rounded-2xl overflow-hidden bg-slate-900 border-t-4 border-[#e7d8bd] shadow-xl shadow-slate-950/30'>
            <div className='card-body'>
              <h2 className='card-title text-2xl mb-4 text-slate-50'>Register</h2>
              <form onSubmit={handleSubmit}>
                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text text-slate-300'>Name</span>
                  </label>
                  <input
                    type='text'
                    placeholder='Your name'
                    className='input input-bordered bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-[#e7d8bd] focus:outline-none'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
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
                    placeholder='Create a password'
                    className='input input-bordered bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-[#e7d8bd] focus:outline-none'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className='card-actions justify-end mt-6'>
                  <button
                    type='submit'
                    className='btn rounded-xl border-0 bg-[#e7d8bd] px-5 text-slate-950 shadow-lg shadow-[#e7d8bd]/20 hover:bg-[#f1e5d0] disabled:bg-slate-700 disabled:text-slate-400'
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Register'}
                  </button>
                </div>
              </form>
              <p className='mt-4 text-slate-300'>
                Already have an account?{' '}
                <Link to='/login' className='text-[#e7d8bd] hover:text-[#f1e5d0]'>
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
