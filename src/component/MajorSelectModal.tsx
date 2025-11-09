import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

type Major = {
    id: number; name: string;
    universityId: number | null
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (major: Major) => void;
    majors: Major[];
    selectedMajor?: Major | null;
    selectedUniversity?: { id: number; name: string } | null;
};

export default function MajorSelectModal({
    open,
    onClose,
    onSubmit,
    majors,
    selectedMajor,
    selectedUniversity
}: Props) {
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState<Major[]>(majors);
    const [newMajor, setNewMajor] = useState('');

    useEffect(() => {
        if (Array.isArray(majors) && majors.length > 0){

            setFiltered(
                majors.filter((m) =>
                    m.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }
    }, [search, majors]);

    const handleCreate = async () => {
        const created = { id: -1, name: newMajor, universityId: selectedUniversity?.id || null };
        try {
            const res = await fetch(`/api/majors`, { //pass query in body    
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify({ name: newMajor, universityId: selectedUniversity?.id || null }),
            });

            console.log(res)
            if (!res.ok) {
                throw new Error('Failed to fetch explanation');
            }

            const data = await res.json();
            console.log(data, 'dsataexp')
            created.id = data.id; // Assuming the backend returns the created university with an ID
            onSubmit(created);
        } catch (error) {
            console.error('Error fetching explanation:', error);
        }
        onClose();
    };

    const handleSelect = (m: Major) => {
        onSubmit(m);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center">
                <Dialog.Panel className="bg-white p-6 rounded shadow max-w-md w-full">
                    <Dialog.Title className="text-lg font-bold mb-4">Select Major</Dialog.Title>
                    <input
                        type="text"
                        value={search || selectedMajor?.name}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setNewMajor(e.target.value);
                        }}
                        className="w-full px-3 py-2 border mb-2 rounded"
                        placeholder="Search or create new"
                    />
                    <div className="max-h-40 overflow-y-auto mb-4">
                        {Array.isArray(filtered) && filtered.length > 0 &&  filtered.map((m) => (
                            <div
                                key={m.id}
                                onClick={() => handleSelect(m)}
                                className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                            >
                                {m.name}
                            </div>
                        ))}
                    </div>
                    <button onClick={handleCreate} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" >
                        Create &quot;{newMajor}&quot;
                    </button>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}