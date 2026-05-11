import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createNotes, deleteNotes, getAllNotes, updateNotes, getNotesById } from '../controllers/notesController.js';
const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllNotes);
router.get('/:id', getNotesById);

router.post('/', createNotes);
router.put('/:id', updateNotes);
router.delete('/:id', deleteNotes);

export default router;





