export interface QueryField {
    id: string,
    label: string,
    placeholder?: string,
    required?: boolean,
    /** The same as for InputField component, update if changes made */
    type?: "text" | "number"
}

export const placeholderResultJSON = {
    "id": "example-1",
    "title": "Example result",
    "description": "This is a placeholder result"
}

export type FetchDataFunction = (formValues: Record<string, any>) => Promise<any> | any;