import { NotebookIcon } from "lucide-react";
import { Link } from "react-router-dom";

const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
      <div className="rounded-full bg-slate-900 p-8 shadow-xl shadow-slate-950/30 border border-slate-800">
        <NotebookIcon className="size-10 text-[#e7d8bd]" />
      </div>
      <h3 className="text-2xl font-bold text-slate-50">No notes yet</h3>
      <p className="text-slate-300">
        Ready to organize your thoughts? Create your first note to get started on your journey.
      </p>
      <Link to="/create" className="btn rounded-xl border-0 bg-[#e7d8bd] px-5 text-slate-950 shadow-lg shadow-[#e7d8bd]/20 hover:bg-[#f1e5d0]">
        Create Your First Note
      </Link>
    </div>
  );
};
export default NotesNotFound;
