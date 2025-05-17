export interface Building {
    id: string;
    area: string;
    floors: number;
    units: number;
    residents: number;
}

export interface Feedback {
    id: number;
    from: string;
    unit: string;
    content: string;
    date: string;
}