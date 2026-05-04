import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import toast from 'react-hot-toast'
import api from '../lib/axios'
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from 'lucide-react'
import Navbar from '../components/Navbar'

const NoteDetailPage = () => {
  const [note , setNote] = useState(null);
  const [loading , setLoading] = useState(true);
  const [saving , setSaving] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect( ()=>{
    const fetchnote = async()=>{
      try {
        const res = await api.get(`/notes/${id}`)
        setNote(res.data);
      } catch (error) {
        console.log("Error fetching note details:", error)
        toast.error("Failed to fetch note details. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchnote();
  },[id])

  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await api.delete(`/notes/${id}`)
      toast.success("Note deleted successfully")
      navigate("/")
    } catch (error) {
      console.log("Error deleting note:", error)
      toast.error("Failed to delete note")
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()

    if (!note.title.trim() || !note.content.trim()) {
      toast.error("All fields are required")
      return
    }

    setSaving(true)
    try {
      await api.put(`/notes/${id}`, {
        title: note.title,
        content: note.content,
      })
      toast.success("Note updated successfully")
      navigate("/")
    } catch (error) {
      console.log("Error updating note:", error)
      toast.error("Failed to update note")
    } finally {
      setSaving(false)
    }
  }

  if(loading){
    return <div className='min-h-screen flex items-center justify-center'>
      <span className='loading loading-spinner loading-lg text-[#e7d8bd]'></span>
    </div>
  }

  if(!note){
    return <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold mb-4 text-slate-50'>Note not found</h2>
        <Link to={"/"} className='btn rounded-xl border-0 bg-[#e7d8bd] text-slate-950 hover:bg-[#f1e5d0]'>Back to Home</Link>
      </div>
    </div>
  }

  return (
   <div className='min-h-screen'>
      <Navbar />
      <div className='container mx-auto px-4 py-8'>
        <div className="max-w-2xl mx-auto">

          <div className='flex items-center justify-between mb-6'>
            <Link to={"/"} className='btn btn-ghost text-slate-300 hover:bg-slate-800 hover:text-[#f1e5d0]'>
                <ArrowLeftIcon className='size-5' />
                Back to Home
            </Link>
            <button onClick={handleDelete} className='btn btn-outline rounded-xl border-red-400/70 text-red-300 hover:border-red-500 hover:bg-red-500 hover:text-white'>
              <Trash2Icon className='h-5 w-5'/>

            </button>
          </div>

          <div className='card rounded-2xl overflow-hidden bg-slate-900 border-t-4 border-[#e7d8bd] shadow-xl shadow-slate-950/30'>
            <div className='card-body'>
              <form onSubmit={handleSave}>
                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text text-slate-300'>Title</span>
                  </label>
                  <input
                    type='text'
                    className='input input-bordered bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-[#e7d8bd] focus:outline-none'
                    value={note.title}
                    onChange={(e) => setNote({ ...note, title: e.target.value })}
                  />
                </div>

                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text text-slate-300'>Content</span>
                  </label>
                  <textarea
                    className='textarea textarea-bordered h-32 bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-[#e7d8bd] focus:outline-none'
                    value={note.content}
                    onChange={(e) => setNote({ ...note, content: e.target.value })}
                  />
                </div>

                <div className='card-actions justify-end'>
                  <button type='submit' className='btn rounded-xl border-0 bg-[#e7d8bd] px-5 text-slate-950 shadow-lg shadow-[#e7d8bd]/20 hover:bg-[#f1e5d0] disabled:bg-slate-700 disabled:text-slate-400' disabled={saving}>
                    <SaveIcon className='size-5' />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
   </div>          

  )
}

export default NoteDetailPage
