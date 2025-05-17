import { Building, Feedback } from '../../types/admin/DashboardType';

// Service functions
export const fetchBuildings = async (): Promise<Building[]> => {
    // In a real app, this would be an API call
    // For now, we'll return mock data
    return [
        {
            id: 'S2',
            area: '556 m2',
            floors: 5,
            units: 25,
            residents: 53,
        },
        {
            id: 'S1',
            area: '652 m2',
            floors: 5,
            units: 25,
            residents: 56,
        },
    ];
};

export const fetchRecentFeedback = async (): Promise<Feedback[]> => {
    // In a real app, this would be an API call
    return [
        {
            id: 1,
            from: 'Nguyễn Văn A',
            unit: '31',
            content: 'Phản ánh hàng xóm làm ồn',
            date: '25/11/2023',
        },
        {
            id: 2,
            from: 'Nguyễn Văn A',
            unit: '3',
            content: 'Phản ánh về vệ sinh chung cư',
            date: '25/11/2023',
        },
    ];
};