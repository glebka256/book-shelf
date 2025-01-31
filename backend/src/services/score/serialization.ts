import fs from 'fs';
import path from 'path';
import { ScoreTableChunk } from './interfaces';
import { toUnderscore } from '@app/utils';

const DIRPATH = "../../data/relation/";

const getFilePath = (subject: string, chunk: string): string => {
    const filename = `${subject}_${chunk}.json`;

    return path.join(__dirname, DIRPATH.concat(filename));
}

export const saveRelations = async (table: ScoreTableChunk): Promise<void> => {
    const filepath = getFilePath(table.subject, table.chunk);

    await fs.promises.writeFile(filepath, JSON.stringify(table.data, null, 2), "utf8");
    
    console.log(`Table: '${table.subject}_${table.chunk}' saved to path: ${filepath}.`);
}

export const loadRelations = async (subject: string, chunk: string): Promise<ScoreTableChunk> => {
    const filepath = getFilePath(subject, chunk);

    try {
        const data = await fs.promises.readFile(filepath, 'utf-8');
        return {
            subject: subject,
            chunk: chunk,
            data: JSON.parse(data)
        }
    } catch (error) {
        console.error("Error loading relation table from path: ", filepath);
        return null;
    }
}

export const loadBookRelations = async (
    subject: string, 
    chunk: string, 
    id: string
): Promise<Record<string, number>> => {
    const relations: ScoreTableChunk = await loadRelations(subject, chunk);
    if (!relations.data) return null;

    return relations.data[id];
}

const loadSubjectRelations = async (subject: string): Promise<ScoreTableChunk> => {
    const filepath = path.join(__dirname, DIRPATH.concat(`${subject}.json`));

    try {
        const data = await fs.promises.readFile(filepath, 'utf-8');
        return {
            subject: subject,
            chunk: '-1',
            data: JSON.parse(data)
        }
    } catch (error) {
        console.error("Error loading subject relation table from path: ", filepath);
        return null;
    }
}

export const loadBookRelationsSubject = async (
    subject: string, 
    bookId: string
): Promise<Record<string, number>> => {
    const subjectTable = await loadSubjectRelations(toUnderscore(subject));

    const data = Object.entries(subjectTable.data)
        .filter(([key, value]) => key === bookId)
        .map(([key, value]) => value)
        .reduce((acc, obj) => {
            Object.entries(obj).forEach(([innerKey, innerValue]) => {
                acc[innerKey] = innerValue;
            });
            return acc;
        }, {} as Record<string, number>);

    return data;
}
