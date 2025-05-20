import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AbsentForm, FormState } from '../../types/AbsentFormType';

interface AbsentFormDialogProps {
    open: boolean;
    onClose: () => void;
    form?: AbsentForm;
    onSave: () => void;
}

const AbsentFormDialog: React.FC<AbsentFormDialogProps> = ({ open, onClose, form, onSave }) => {
    const [formData, setFormData] = useState<AbsentForm>({
        residentId: 0,
        startDate: '',
        endDate: '',
        reason: '',
        state: FormState.PENDING,
    });

    useEffect(() => {
        if (form) {
            setFormData(form);
        }
    }, [form]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (form?.id) {
                await axios.put(`/api/absent-forms/${form.id}/state`, null, { params: { state: formData.state } });
            } else {
                await axios.post('/api/absent-forms', formData);
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving absent form:', error);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{form ? 'Edit Absent Form' : 'Add Absent Form'}</h2>
            <div className="space-y-4">
    <div>
        <label className="block text-sm font-medium text-gray-700">Resident ID</label>
    <input
    type="number"
    name="residentId"
    value={formData.residentId}
    onChange={handleChange}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    required
    />
    </div>
    <div>
    <label className="block text-sm font-medium text-gray-700">Start Date</label>
    <input
    type="datetime-local"
    name="startDate"
    value={formData.startDate}
    onChange={handleChange}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    required
    />
    </div>
    <div>
    <label className="block text-sm font-medium text-gray-700">End Date</label>
    <input
    type="datetime-local"
    name="endDate"
    value={formData.endDate}
    onChange={handleChange}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    required
    />
    </div>
    <div>
    <label className="block text-sm font-medium text-gray-700">Reason</label>
        <textarea
    name="reason"
    value={formData.reason}
    onChange={handleChange}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
    required
    />
    </div>
    <div>
    <label className="block text-sm font-medium text-gray-700">State</label>
        <select
    name="state"
    value={formData.state}
    onChange={handleChange}
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
        {Object.values(FormState).map((state) => (
                <option key={state} value={state}>
            {state}
            </option>
))}
    </select>
    </div>
    </div>
    <div className="mt-6 flex justify-end space-x-2">
    <button
        onClick={onClose}
    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        >
        Cancel
        </button>
        <button
    onClick={handleSubmit}
    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
        Save
        </button>
        </div>
        </div>
        </div>
);
};

export default AbsentFormDialog;