import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlusIcon, LogOutIcon, LogInIcon, UserPlus2Icon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className='bg-slate-950/85 border-b border-slate-800/80 backdrop-blur'>
      <div className='mx-auto max-w-6xl p-4'>

        <div className='flex items-center justify-between gap-4'>
          <Link to='/' className='group inline-flex items-center gap-3'>
            <span className='flex size-10 items-center justify-center rounded-2xl bg-[#e7d8bd] text-lg font-black text-slate-950 shadow-lg shadow-[#e7d8bd]/20'>
              L
            </span>
            <h1 className='text-3xl font-bold text-slate-50 font-mono tracking-tight group-hover:text-[#f1e5d0] transition-colors'>
              LogBook
            </h1>
          </Link>

          <div className='flex flex-wrap items-center gap-3'>
            {user ? (
              <>
                <Link to='/create' className='btn btn-sm rounded-xl border-0 bg-[#e7d8bd] px-4 text-slate-950 shadow-lg shadow-[#e7d8bd]/20 hover:bg-[#f1e5d0] hover:shadow-[#e7d8bd]/30'>
                  <PlusIcon className='size-4' />
                  <span>New Note</span>
                </Link>
                <span className='hidden sm:inline text-slate-200'>Hi, {user.username}</span>
                <button onClick={handleLogout} className='btn btn-sm rounded-xl border-0 bg-slate-800 text-slate-100 hover:bg-slate-700'>
                  <LogOutIcon className='size-4' />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to='/login' className='btn btn-sm rounded-xl border-0 bg-[#e7d8bd] px-4 text-slate-950 shadow-lg shadow-[#e7d8bd]/20 hover:bg-[#f1e5d0]'>
                  <LogInIcon className='size-4' />
                  Login
                </Link>
                <Link to='/register' className='btn btn-sm rounded-xl border-0 bg-slate-800 text-slate-100 hover:bg-slate-700'>
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
