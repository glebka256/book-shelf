import { SortQuery } from "@app/interfaces/Sort";
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

BookSchema.index({
    'meta.isbn': 'text',
    'title': 'text'
});

const BookModel = mongoose.model('Book', BookSchema);

export const getTotalEntries = () => 
    BookModel.countDocuments();

export const getBooks = () => 
    BookModel.find();

export const queryBooks = (query: Object) => 
    BookModel.find(query);

export const queryPaginated = (page: number, limit: number) => 
    BookModel.find({}).skip((page - 1) * limit).limit(limit).exec();

export const sortBooks = (query: SortQuery) => 
    BookModel.find({})
        .sort({ [query.sortBy]: query.order })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .exec();

export const aggreageBooks = (aggregator: Array<any>) => 
    BookModel.aggregate(aggregator);

export const getUniqueEntryCount = async (entry: string) => {
    const uniqueEntries = await BookModel.distinct(entry);
    return uniqueEntries.length;
}

export const getBookById = (id: String) => 
    BookModel.findById(id);

export const getBooksByIds = (bookIds: String[]) => 
    queryBooks({ _id: { $in: bookIds } });

export const getBookByTitle = (title: String) => 
    BookModel.findOne({ title });

export const getBooksByGenres = (genres: [String]) =>
    BookModel.find({ subject: { $in: genres } });

export const getBooksByAuthors = (authors: [String]) =>
    BookModel.find({ author: { $in: authors } });

export const getBooksByLanguages = (languages: [String]) =>
    BookModel.find({ language: { $in: languages } });

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

export const createBook = async (values: Record<string, any>) => {
    const book = await new BookModel(values).save();
    return book.toObject();
}

export const deleteBookById = (id: string) => 
    BookModel.findOneAndDelete({ _id: id });

export const updateBookById = async (id: string, values: Record<string, any>) =>
    await BookModel.findByIdAndUpdate(id, values, { new: true }).exec();

export const addBookProperty = async (id: string, newProperty: Record<string, any>) => {
    return await BookModel.findByIdAndUpdate(
        id,
        { $set: newProperty },
        { new: true }
    ).exec();
}

export const addBookLinkProperty = (id: string, linkData: any) =>
    addBookProperty(id, { "link": linkData });

export const updateBookCompleteStatus = async (id: string, isComplete: boolean) => {
    return await BookModel.findByIdAndUpdate(
        id,
        { $set: { complete: isComplete } },
        { new: true }
    ).exec();
};