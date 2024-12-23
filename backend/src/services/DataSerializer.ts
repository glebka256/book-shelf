import { mainSubjects, additionalSubjects } from "@app/data/scrapingCategories.json";
import associations from "@app/data/associations.json";
import { AssociateType, ScrapingTypes, SubjectAssociates } from "@app/interfaces/Data";

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
        const associate = this.associates.find(associate => associate.subject.name === name);
        if (!associate) {
            throw new Error(`Could not read subject associatoins from .JSON with name: ${name}`);
        }

        return associate;
    }
}
