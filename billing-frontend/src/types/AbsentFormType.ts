export enum FormState {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface AbsentForm {
    id?: number;
    residentId: number;
    residentName?: string;
    startDate: string;
    endDate: string;
    reason: string;
    state: FormState;
    createdAt?: string;
    updatedAt?: string;
}