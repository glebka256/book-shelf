import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    type: { type: String, requried: true },
    title: { type: String, reuqired: true },
    author: { type: [String], required: true },
    subject: { type: [String], required: true },
    rating: { type: Number, required: true },
    publishedYear: { type: Number, required: true },
    language: { type: [String], required: true },
    ebookAccess: { type: Boolean, required: true }
});

const BookModel = mongoose.model('Book', BookSchema);

export const getBooks = () => BookModel.find();
export const getBookById = (id: String) => BookModel.findOne({ id });
export const getBookByTitle = (title: String) => BookModel.findOne({ title });

export const getBooksByGenres = (genres: [String]) => {
    return BookModel.find({ subject: { $in: genres } });
}
export const getBooksByAuthors = (authors: [String]) => {
    return BookModel.find({ author: { $in: authors } });
}
export const getBooksByLanguages = (languages: [String]) => {
    return BookModel.find({ language: { $in: languages } });
}

export const getBooksByCritiria = (
    genres: string[], 
    authors: string[], 
    languages: string[]
) => {
    return BookModel.aggregate([
        {
            $match: {
                subject: { $in: genres },
                author: { $in: authors },
                language: { $in: languages }
            }
        },
        {
            $sort: { rating: -1 }
        }
    ]);
}

export const createBook = (values: Record<string, any>) => {
    new BookModel(values).save().then((user) => user.toObject());
}
export const deleteBookById = (id: string) => BookModel.findOneAndDelete({ _id: id });
export const updateBookById = (id: string, values: Record<string, any>) => {
    BookModel.findByIdAndUpdate(id, values, { new: true }).exec();
}
