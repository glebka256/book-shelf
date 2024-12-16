import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    meta: {
        isbn: { type: String, required: true },
        idGutenberg: { type: [String], required: true },
        idGoodreads: { type: [String], required: true },
        idAnnasArchive: { type: [String], required: true },
        idAmazon: { type: [String], required: true }
    },
    coverUrl: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: [String], required: true },
    subject: { type: [String], required: true },
    rating: { type: Number, required: true },
    publishedYear: { type: Number, required: true },
    language: { type: [String], required: true },
    ebookAccess: { type: Boolean, required: true },
    complete: { type: Boolean, default: false },
    link: { type: {
        readUrl: { type: String, required: false },
        downloadUrl: { type: String, required: false },
        format: { type: String, required: false },
        size: {
            value: { type: Number, required: false },
            metric: { type: String, required: false }
        },
        buyUrl: { type: String, required: false }
    }, required: false }
});

const BookModel = mongoose.model('Book', BookSchema);

export const getBooks = () => BookModel.find();
export const getBookById = (id: String) => BookModel.findById(id);
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

export const getBooksByCriteria = (
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
    new BookModel(values).save().then((book) => book.toObject());
}
export const deleteBookById = (id: string) => BookModel.findOneAndDelete({ _id: id });
export const updateBookById = async (id: string, values: Record<string, any>) => {
    return await BookModel.findByIdAndUpdate(id, values, { new: true }).exec();
}

export const addBookProperty = async (id: string, newProperty: Record<string, any>) => {
    return await BookModel.findByIdAndUpdate(
        id,
        { $set: newProperty },
        { new: true }
    ).exec();
}
export const addBookLinkProperty = (id: string, linkData: any) => {
    return addBookProperty(id, { "link": linkData });
}
export const linkExists = async (id: string) => {
    const book = await BookModel.findById(id).exec();
    
    if (!book) {
        return false;
    }

    if (!book.link || typeof book.link !== 'object') {
        return false;
    }

    if (!(Object.keys(book.link).length > 1 || book.complete === true)) {
        return false;
    }

    return true;
}
