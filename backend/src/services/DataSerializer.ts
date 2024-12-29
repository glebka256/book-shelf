import { mainSubjects, additionalSubjects } from "@app/data/scrapingCategories.json";
import associations from "@app/data/associations.json";
import { AssociateType, ScrapingTypes, SubjectAssociates, SubjectGenre } from "@app/interfaces/Data";

export class DataSerializer {
    private static associates = Object.entries(associations).map(([key, value]) => ({
        subject: {
            name: key,
            type: value.type as AssociateType,
            associations: value.associates
        }
    }));

    static getParsingSubjects(type: ScrapingTypes ): string[] {
        if (type === 'all') {
            return mainSubjects.concat(additionalSubjects);
        }
        if (type === 'main') {
            return mainSubjects;
        }
        return additionalSubjects
    }

    static getAllAsociates(): SubjectAssociates[] {
        return this.associates;
    }

    static getAssociations(name: string): SubjectAssociates {        
        const associate = this.associates.find(associate => {
            return associate.subject.associations.includes(name)
        });

        if (!associate) {
            throw new Error(`Could not read subject '${name}' associatoins from .JSON.`);
        }

        return associate;
    }

    static formAssociations(subjects: string[]): SubjectAssociates[] {
        const subjectAssociates = new Set<SubjectAssociates>();

        for (const subject of subjects) {
            subjectAssociates.add(DataSerializer.getAssociations(subject));
        }

        return Array.from(subjectAssociates);
    }

    static getAssociationKeywords(associations: SubjectAssociates[]): string[] {
        const keywords: string[] = [];
        
        for (const associate of associations) {
            keywords.push(...associate.subject.associations);
        }

        return keywords;
    }

    static parseGenres(): SubjectGenre[] {
        const genres: SubjectGenre[] = [];

        for (const associate of this.associates) {
            const genre = {
                name: associate.subject.name,
                subjects: associate.subject.associations
            };
            genres.push(genre);
        }

        return genres;
    }
}
