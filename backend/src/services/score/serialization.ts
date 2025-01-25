import { table } from 'console';
import fs from 'fs';
import path from 'path';

const DIRPATH = "../../data/relation/";

function getFilePath(subject: string, chunk: string): string {
    const filename = `${subject}_${chunk}.json`;

    return path.join(__dirname, DIRPATH.concat(filename));
}

export async function saveRelations(subject: string, chunk: string, table: Record<string, number>) {
    const filepath = getFilePath(subject, chunk);

    await fs.promises.writeFile(filepath, JSON.stringify(table, null, 2), "utf8");
    
    console.log(`Table: '${subject}_${chunk}' saved to path: ${filepath}.`);
}

export async function loadRelations(subject: string, chunk: string): Promise<Record<string, number>> {
    const filepath = getFilePath(subject, chunk);

    try {
        const data = await fs.promises.readFile(filepath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading relation table from path: ", filepath);
        return null;
    }
}

export async function loadBookRelations(
    subject: string, 
    chunk: string, 
    id: string
): Promise<Record<string, number>> {
    const relations = await loadRelations(subject, chunk);
    if (!relations) return null;
    
    let result: Record<string, number> = {};

    for (const [key, value] of Object.entries(relations)) {
        if (key.includes(id)) {
            result[key] = value;
        }
    }

    return result;
}

export async function loadAllBookRelations(subject: string, id: string): Promise<Record<string, number>> {
    let result: Record<string, number> = {};

    try {
        const files = await fs.promises.readdir(DIRPATH);
        const subjectFiles = files.filter((file) => file.startsWith(subject) && file.endsWith(".json"));

        for (const file of subjectFiles) {
            const filepath = path.join(DIRPATH, file);
            const data = await fs.promises.readFile(filepath, 'utf-8');
            const table: Record<string, number> = JSON.parse(data);

            for (const [key, value] of Object.entries(table)) {
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
