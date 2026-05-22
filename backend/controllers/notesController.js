import Note from '../models/Note.js';
import { GoogleGenerativeAI } from '@google/generative-ai'; 

const GEMINI_KEY_PLACEHOLDERS = new Set([
  'your_actual_api_key_here',
  'your_actual_real_key',
  'your_real_google_ai_studio_key',
]);

function getGeminiErrorResponse(error) {
  const message = error?.message || '';
  const status = error?.status || error?.response?.status;

  if (status === 400 || /API_KEY_INVALID|API key not valid|invalid api key/i.test(message)) {
    return {
      statusCode: 401,
      message: 'Gemini API key is invalid. Add a valid GEMINI_API_KEY in backend/.env and restart the server.',
    };
  }

  if (status === 403 || /permission|forbidden|not authorized/i.test(message)) {
    return {
      statusCode: 403,
      message: 'Gemini API access is not enabled for this key. Check your Google AI Studio API key permissions.',
    };
  }

  if (status === 404 || /not found|not supported/i.test(message)) {
    return {
      statusCode: 502,
      message: 'Gemini model was not found. Check GEMINI_MODEL in backend/.env or remove it to use the default.',
    };
  }

  if (status === 429 || /quota|rate limit|too many requests/i.test(message)) {
    return {
      statusCode: 429,
      message: 'Gemini quota or rate limit reached. Please try again later.',
    };
  }

  return {
    statusCode: 500,
    message: 'Server error during summarization',
  };
}

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

export async function summarize(req ,res){
  try {
    const { content } = req.body;
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if(!content || content.trim() === '') {
      return res.status(400).json({ message: "Content is required for summarization" });
    }

    if (!apiKey || GEMINI_KEY_PLACEHOLDERS.has(apiKey)) {
      return res.status(500).json({ message: "Gemini API key is missing. Add a valid GEMINI_API_KEY in backend/.env" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' });
    const prompt = `Summarize the following note content in a concise manner:\n\n${content}`;
    const result = await model.generateContent(prompt);
    const summary = result.response?.text()?.trim();

    if (!summary) {
      return res.status(502).json({ message: "Gemini returned an empty summary. Please try again." });
    }

    res.status(200).json({ summary });

  } catch (error) {
    console.error("Error in summarize:", error);
    const errorResponse = getGeminiErrorResponse(error);
    res.status(errorResponse.statusCode).json({ message: errorResponse.message });
  }
}
