import mongoose from "mongoose";

const booksandaudioSchema = new mongoose.Schema({
    bookTitle: { type: String, required: true },
    productImage: { type: String, required: true }, // Store the image URL or path
    audio: { type: String, required: true }, // Store the audio URL or path
    category: { type: String, required: true }, // Fixed typo in category
    price: { type: Number, required: true },
});

// Virtual property to format price with a dollar sign
booksandaudioSchema.virtual('formattedPrice').get(function() {
    return `$${this.price.toFixed(2)}`;
});

const BooksandAudio = mongoose.model('BooksandAudio', booksandaudioSchema);

export default BooksandAudio;
