'use client';
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

type University = { id: number; name: string };

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (university: University) => void;
    universities: University[];
};

export default function UniversitySelectModal({
    open,
    onClose,
    onSubmit,
    universities,
}: Props) {
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState(universities);
    const [newUniversity, setNewUniversity] = useState('');

    useEffect(() => {
        if (Array.isArray(universities) && universities.length > 0) { 
            setFiltered(
                universities.filter((u) =>
                    u.name.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, universities]);

    const handleCreate = async () => {
        const created = { id: -1, name: newUniversity };
        try {
            const res = await fetch(`/api/universities`, { //pass query in body
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify({ name: newUniversity }),
            });

            console.log(res)
            if (!res.ok) {
                throw new Error('Failed to fetch explanation');
            }

            const data = await res.json();
            console.log(data, 'dsataexp')
            created.id = data.id; // Assuming the backend returns the created university with an ID
        } catch (error) {
            console.error('Error fetching explanation:', error);
        }
        onSubmit(created);
        onClose();
    };

    const handleSelect = (u: University) => {

        onSubmit(u);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center">
                <Dialog.Panel className="bg-white p-6 rounded shadow max-w-md w-full">
                    <Dialog.Title className="text-lg font-bold mb-4 text-gray-700	">Select University</Dialog.Title>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setNewUniversity(e.target.value);
                        }}
                        className="w-full px-3 py-2 border mb-2 rounded text-gray-700	"
                        placeholder="Search or create new"
                    />
                    <div className="max-h-40 overflow-y-auto mb-4">
                        {Array.isArray(filtered) && filtered.length > 0 && filtered.map((u) => (
                            <div
                                key={u.id}
                                onClick={() => handleSelect(u)}
                                className="p-2 hover:bg-gray-100 text-gray-700	 cursor-pointer rounded"
                            >
                                {u.name}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleCreate} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" >
                        Create &quot;{newUniversity}&quot;
                    </button>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}