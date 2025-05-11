export enum FileSizeMetric {
    Bytes = 'Bt',
    Kilobytes = 'KB',
    Megabytes = 'MB',
    Gigabytes = 'GB',
    Terabytes = 'TB'
}

export enum Languages {
    English = 'eng',
    German = 'ger',
    French = 'fre',
    Spanish = 'spa',
    Russian = 'rus',
    Italian = 'ita',
    Chinease = 'chi',
    Japanease = 'jpn',
    Arabic = 'ara',
    Portuguese = 'por',
    Hebrew = 'heb',
    Korean = 'kor',
    Polish = 'pol',
    Ukrainian = 'ukr'
}

export interface ValidationResponse {
    status: boolean,
    message: string
}
