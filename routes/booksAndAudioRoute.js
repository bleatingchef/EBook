import express from 'express';
import { createbooksandaudio, getbooksandaudio, updatebooksandaudio, deletebooksandaudio } from '../controllers/booksAndAudioController.js';

const router = express.Router();

router.get('/getnewbooks', getbooksandaudio);                          // GET all books
router.post('/createnewbooks', createbooksandaudio);                   // POST new book/audio
router.put('/updatebooks/:bookTitle', updatebooksandaudio);            // PUT to update book/audio by title
router.delete('/deletebooks/:bookTitle', deletebooksandaudio);         // DELETE book/audio by title

export default router;
