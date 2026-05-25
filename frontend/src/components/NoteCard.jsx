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
      className="card h-full overflow-hidden rounded-lg border border-slate-800/80 border-t-[#e7d8bd] bg-slate-900/95 shadow-lg shadow-slate-950/20 transition-all duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-slate-950/30"

    >
      <div className='card-body flex h-full p-5'>
        <h3 className='line-clamp-2 text-lg font-semibold leading-snug text-slate-50'>{note.title}</h3>
        <div 
          className="quill-content mt-2 line-clamp-4 text-sm leading-6 text-slate-300"
          dangerouslySetInnerHTML={{ __html: cleanHTML }} 
        />
        <div className='mt-4 flex flex-wrap gap-2'>
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className='rounded-full border border-[#e7d8bd]/20 bg-[#e7d8bd]/10 px-2.5 py-1 text-xs font-medium text-[#e7d8bd]'
            >
              #{tag}

            </span>
          ))}
        </div>
        <div className='mt-auto flex items-center justify-between gap-3 pt-5'>
          <span className='min-w-0 truncate text-sm text-slate-400'>
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className='flex shrink-0 items-center gap-1 text-slate-300'>
            <PenSquareIcon className='size-4' />
            <button className='btn btn-ghost btn-xs rounded-lg text-error hover:bg-red-500/10' onClick={(e) => handleDelete(e, note._id)}>
              <Trash2Icon className='size-4' />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default NoteCard
