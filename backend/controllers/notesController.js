import Note from '../models/Note.js';

export async function getAllNotes (req, res)  {
  try{
    const notes =await Note.find({user: req.user._id}).sort({createdAt:-1}); //{createdAt:-1} means newest
    res.status(200).json(notes);
  } catch(error){
    console.error("Error in getAllNotes:", error);
    res.status(500).json({message:"Server error"});
}
}


export async function getNotesById (req, res)  {
  try{
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if(!note){
      return res.status(404).json({message:"Note not found"});
    }
    res.status(200).json(note);
  }catch(error){
    console.error("Error in getNotesById:", error);
    res.status(500).json({message:"Server error"});
  }
}

export async function createNotes (req, res)  {
    try{
        const {title, content,tags} = req.body;
        const note = new Note({title, content , tags: tags || [], user: req.user._id});
        const savednote = await note.save();
        res.status(201).json(savednote);
    } catch(error){
        
        console.error("Error in getAllNotes:", error);
        res.status(500).json({message:"Server error"});
    }
}
  
   
export async function updateNotes (req, res)  {
  try{
    const {title, content,tags} = req.body;
    const updateNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, content, tags: tags || [] },
      { new: true }
    );
    if(!updateNote){
      return res.status(404).json({message:"Note not found"});
    }
    res.status(200).json(updateNote);
  } catch(error){
     console.error("Error in updateNotes:", error);
     res.status(500).json({message:"Server error"});
  }
}
export async function deleteNotes (req, res)  {
  
   try {
    const deleteNote = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if(!deleteNote){
      return res.status(404).json({message:"Note not found"});
    }
    res.status(200).json({message:"Note deleted successfully"});
   } catch (error) {
    console.error("Error in deleteNotes:", error);
    res.status(500).json({message:"Server error"});
   }
}
