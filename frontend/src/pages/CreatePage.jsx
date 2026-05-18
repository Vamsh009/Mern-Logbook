import { ArrowLeftIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/axios'
import Navbar from '../components/Navbar'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';


const CreatePage = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagsArray = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '')

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required")
      return

    }
    setLoading(true)
    try {
      await api.post("/notes", { title, content, tags: tagsArray })
      toast.success("Note created successfully")
      navigate("/");
    } catch (error) {
      console.log("Error creating note:", error)
      toast.error("Failed to create note. Please try again.")

    } finally {
      setLoading(false)
    }
  };

  return (
    <div className='min-h-screen'>
      <Navbar />
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Link to={"/"} className='btn btn-ghost mb-6 text-slate-300 hover:bg-slate-800 hover:text-[#f1e5d0]'>
            <ArrowLeftIcon className='size-5' />
            Back to Home
          </Link>

          <div className='card rounded-2xl overflow-hidden bg-slate-900 border-t-4 border-[#e7d8bd] shadow-xl shadow-slate-950/30'>
            <div className='card-body'>
              <h2 className='card-title text-2xl mb-4 text-slate-50'>Create New Note</h2>
              <form onSubmit={handleSubmit}>
                <div className='form-control mb-4'>
                  <label className="label">
                    <span className='label-text text-slate-300'>Title</span>
                  </label>
                  <input type="text"
                    placeholder='Note Title'
                    className='input input-bordered bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-[#e7d8bd] focus:outline-none'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className='form-control mb-4'>
                  <label className="label">
                    <span className='label-text text-slate-300'>Content</span>
                  </label>
                  <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent} 
                    className="h-64 mb-12" 
                  />
                </div>
                <input
                  type='text'
                  placeholder='Add tags(eg ideas, work, personal)'
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className='input input-bordered w-full bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-[#e7d8bd] focus:outline-none'
                />
                <div className="card-actions justify-end mt-6">
                  <button type='submit' className='btn rounded-xl border-0 bg-[#e7d8bd] px-5 text-slate-950 shadow-lg shadow-[#e7d8bd]/20 hover:bg-[#f1e5d0] disabled:bg-slate-700 disabled:text-slate-400' disabled={loading} >
                    {loading ? "Creating..." : "Create Note"}
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

export default CreatePage
