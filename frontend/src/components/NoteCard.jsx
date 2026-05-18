import { PenSquareIcon, Trash2Icon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../lib/utils'
import api from '../lib/axios'
import toast from 'react-hot-toast'
import DOMPurify from 'dompurify';

const NoteCard = ({ note, setNotes }) => {

  const cleanHTML = DOMPurify.sanitize(note.content);
  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <Link to={`/note/${note._id}`}
      className="card rounded-2xl overflow-hidden bg-slate-900 hover:shadow-xl hover:shadow-slate-950/30 transition-all duration-200 border-t-4 border-solid border-[#e7d8bd] "

    >
      <div className='card-body '>
        <h3 className=' card-title text-slate-50'>{note.title}</h3>
        <div 
          className="mt-2 text-gray-700 quill-content"
          dangerouslySetInnerHTML={{ __html: cleanHTML }} 
        />
        <div className='flex flex-wrap gap-2 mt-4'>
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className='text-md text-[#e7d8bd]'
            >
              #{tag}

            </span>
          ))}
        </div>
        <div className='card-actions justify-between items-center mt-4'>
          <span className='text-sm text-slate-400'>
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className='flex items-center gap-1 text-slate-300'>
            <PenSquareIcon className='size-4' />
            <button className='btn btn-ghost btn-xs  text-error' onClick={(e) => handleDelete(e, note._id)}>
              <Trash2Icon className='size-4' />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default NoteCard
