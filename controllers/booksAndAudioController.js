import BooksandAudio from '../models/booksAndAudioModel.js';

// Controller to handle GET requests for books and audio
const getbooksandaudio = async (req, res) => {
    try {
        const newbooks = await BooksandAudio.find();
        res.status(200).json(newbooks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving books', error });
    }
};

// Controller to handle POST requests to create a new book/audio
const createbooksandaudio = async (req, res) => {
    const { bookTitle, productImage, audio, category, price } = req.body;

    // Validate required fields
    if (!bookTitle || !productImage || !audio || !category || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newbooks = new BooksandAudio({ bookTitle, productImage, audio, category, price });
        await newbooks.save();
        res.status(201).json(newbooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating book/audio', error });
    }
};

// Controller to handle PUT requests to update a book/audio by title
const updatebooksandaudio = async (req, res) => {
    const { bookTitle } = req.params;
    const { productImage, audio, category, price } = req.body;

    try {
        const updatedbook = await BooksandAudio.findOneAndUpdate(
            { bookTitle }, // Find book by title
            { productImage, audio, category, price }, // Update fields
            { new: true } // Return the updated document
        );
        if (!updatedbook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(updatedbook);
    } catch (error) {
        res.status(500).json({ message: 'Error updating book/audio', error });
    }
};

// Controller to handle DELETE requests to remove a book/audio by title
const deletebooksandaudio = async (req, res) => {
    const { bookTitle } = req.params;

    try {
        const deletedbook = await BooksandAudio.findOneAndDelete({ bookTitle });
        if (!deletedbook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book/audio deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book/audio', error });
    }
};

export { getbooksandaudio, createbooksandaudio, updatebooksandaudio, deletebooksandaudio };
