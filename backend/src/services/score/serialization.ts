import fs from 'fs';
import path from 'path';
import { ScoreTableChunk, ScoreTable } from './main';

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

export const loadAllBookRelations = async (subject: string, id: string): Promise<Record<string, number>> => {
    let result: Record<string, number> = {};

    try {
        const files = await fs.promises.readdir(DIRPATH);
        const subjectFiles = files.filter((file) => file.startsWith(subject) && file.endsWith(".json"));

        for (const file of subjectFiles) {
            const filepath = path.join(DIRPATH, file);
            const data = await fs.promises.readFile(filepath, 'utf-8');
            const table: ScoreTable = JSON.parse(data);
            const idRelated = table[id];

            for (const [key, value] of Object.entries(idRelated)) {
                if (key.includes(id)) {
                    result[key] = value;
                }
            }
        }
    } catch (error) {
        console.error("Error loading relation tables from path: ", DIRPATH);
    }

    return result;
}
