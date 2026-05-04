import React from 'react'
import { Link } from 'react-router'
import { PlusIcon } from 'lucide-react'

const Navbar = () => {
  return (
    <header className='bg-slate-950/85 border-b border-slate-800/80 backdrop-blur'>
      <div className='mx-auto max-w-6xl p-4'>

        <div className='flex items-center justify-between'>
          <Link to="/" className='group inline-flex items-center gap-3'>
            <span className='flex size-10 items-center justify-center rounded-2xl bg-[#e7d8bd] text-lg font-black text-slate-950 shadow-lg shadow-[#e7d8bd]/20'>
              L
            </span>
            <h1 className='text-3xl font-bold text-slate-50 font-mono tracking-tight group-hover:text-[#f1e5d0] transition-colors'>
              LogBook
            </h1>
          </Link>
          <div className=''>
            <Link to="/create" className='btn btn-sm rounded-xl border-0 bg-[#e7d8bd] px-4 text-slate-950 shadow-lg shadow-[#e7d8bd]/20 hover:bg-[#f1e5d0] hover:shadow-[#e7d8bd]/30'>
              <PlusIcon className='size-4'/>
              <span>New Note</span>
            </Link>
          </div>
        </div>

      </div>
    </header>
  )
}

export default Navbar
