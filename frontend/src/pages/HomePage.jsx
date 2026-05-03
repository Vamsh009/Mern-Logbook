import React, { useEffect } from 'react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import api  from '../lib/axios'
import { toast } from 'react-hot-toast'
import NoteCard from '../components/NoteCard'
import NoteNotFound from '../components/NoteNotFound'

const HomePage = () => {
  const [ notes , setnotes ] = useState([])
  const [ loading , setloading ] = useState(true)

  useEffect(() => {
    const fetchNotes = async() =>{
      try {
        const res = await api.get("/notes")
        console.log(res.data)
        setnotes(res.data)
      } catch (error) {
        console.log("Error fetching notes:", error)
        if(error.response?.status === 429){
          toast.error("Too many requests. Please try again later.")
        }
      } finally {
        setloading(false)
      }
    };

    fetchNotes();
  },[])

  return (
    <div className='min-h-screen'>
      <Navbar />

      <div className='max-w-7xl mx-auto p-4 mt-6'>
        {loading && <div className='text-center text-primary py-10'>Loading notes...</div>}

        {notes.length === 0 && !loading && <NoteNotFound/>}

        {notes.length>0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {notes.map(note =>(
              <NoteCard key={note._id} note={note} setNotes={setnotes} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default HomePage
