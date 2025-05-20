import React, { useState, useEffect } from 'react';
import { AbsentForm, FormState } from '../../types/AbsentFormType';
import { absentFormService } from '../../services/admin/AbsentFormService';
import AbsentFormDialog from '../../components/admin/AbsentFormDialog';

const AbsentFormPage: React.FC = () => {
    const [forms, setForms] = useState<AbsentForm[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState<AbsentForm | undefined>(undefined);
    const [residentIdFilter, setResidentIdFilter] = useState<string>('');
    const [stateFilter, setStateFilter] = useState<FormState | ''>('');

    useEffect(() => {
        fetchForms();
    }, [residentIdFilter, stateFilter]);

    const fetchForms = async () => {
        try {
            let data: AbsentForm[];
            if (residentIdFilter) {
                data = await absentFormService.getAbsentFormsByResidentId(Number(residentIdFilter));
            } else if (stateFilter) {
                data = await absentFormService.getAbsentFormsByState(stateFilter);
            } else {
                data = await absentFormService.getAllAbsentForms();
            }
            setForms(data);
        } catch (error) {
            console.error('Error fetching absent forms:', error);
        }
    };

    const handleAddForm = () => {
        setSelectedForm(undefined);
        setIsDialogOpen(true);
    };

    const handleEditForm = (form: AbsentForm) => {
        setSelectedForm(form);
        setIsDialogOpen(true);
    };

    const handleDeleteForm = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this form?')) {
            try {
                await absentFormService.deleteAbsentForm(id);
                fetchForms();
            } catch (error) {
                console.error('Error deleting absent form:', error);
            }
        }
    };

    const handleResidentIdFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResidentIdFilter(e.target.value);
    };

    const handleStateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStateFilter(e.target.value as FormState | '');
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Absent Forms</h1>
                <button
                    onClick={handleAddForm}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Add New Form
                </button>
            </div>
            <div className="mb-4 flex space-x-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Filter by Resident ID</label>
                    <input
                        type="number"
                        value={residentIdFilter}
                        onChange={handleResidentIdFilterChange}
                        className="mt-1 block w-48 border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="Enter Resident ID"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Filter by State</label>
                    <select
                        value={stateFilter}
                        onChange={handleStateFilterChange}
                        className="mt-1 block w-48 border border-gray-300 rounded-md shadow-sm p-2"
                    >
                        <option value="">All States</option>
                        {Object.values(FormState).map((state) => (
                            <option key={state} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">ID</th>
                        <th className="px-4 py-2 border-b">Resident ID</th>
                        <th className="px-4 py-2 border-b">Resident Name</th>
                        <th className="px-4 py-2 border-b">Start Date</th>
                        <th className="px-4 py-2 border-b">End Date</th>
                        <th className="px-4 py-2 border-b">Reason</th>
                        <th className="px-4 py-2 border-b">State</th>
                        <th className="px-4 py-2 border-b">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {forms.map((form) => (
                        <tr key={form.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border-b">{form.id}</td>
                            <td className="px-4 py-2 border-b">{form.residentId}</td>
                            <td className="px-4 py-2 border-b">{form.residentName}</td>
                            <td className="px-4 py-2 border-b">{form.startDate}</td>
                            <td className="px-4 py-2 border-b">{form.endDate}</td>
                            <td className="px-4 py-2 border-b">{form.reason}</td>
                            <td className="px-4 py-2 border-b">{form.state}</td>
                            <td className="px-4 py-2 border-b flex space-x-2">
                                <button
                                    onClick={() => handleEditForm(form)}
                                    className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteForm(form.id!)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <AbsentFormDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                form={selectedForm}
                onSave={fetchForms}
            />
        </div>
    );
};

export default AbsentFormPage;