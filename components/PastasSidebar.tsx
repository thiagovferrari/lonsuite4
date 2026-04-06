import React, { useState } from 'react';
import { Pasta } from '../types';
import { Plus, Folder, FolderOpen, X } from 'lucide-react';

interface PastasSidebarProps {
    pastas: Pasta[];
    selectedPastaId: string;
    onSelect: (pastaId: string) => void;
    onCreatePasta: (name: string) => void;
    onDeletePasta?: (pastaId: string) => void;
}

const PastasSidebar: React.FC<PastasSidebarProps> = ({
    pastas,
    selectedPastaId,
    onSelect,
    onCreatePasta,
    onDeletePasta
}) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newPastaName, setNewPastaName] = useState('');

    const handleCreate = () => {
        if (newPastaName.trim()) {
            onCreatePasta(newPastaName.trim());
            setNewPastaName('');
            setIsCreating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCreate();
        } else if (e.key === 'Escape') {
            setIsCreating(false);
            setNewPastaName('');
        }
    };

    return (
        <div className="w-64 bg-white border-l border-slate-100 p-6 overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Pastas
                </h3>
                <button
                    onClick={() => setIsCreating(true)}
                    className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="space-y-1">
                {pastas.map((pasta) => {
                    const isSelected = selectedPastaId === pasta.id;
                    const isSystem = pasta.id === 'all' || pasta.id === 'none';

                    return (
                        <div
                            key={pasta.id}
                            className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
                ${isSelected
                                    ? 'bg-slate-900 text-white'
                                    : 'hover:bg-slate-50 text-slate-600'
                                }
              `}
                            onClick={() => onSelect(pasta.id)}
                        >
                            {pasta.id === 'none' ? (
                                <FolderOpen size={18} className={isSelected ? 'text-white' : 'text-slate-400'} />
                            ) : (
                                <Folder size={18} className={isSelected ? 'text-white' : 'text-slate-400'} />
                            )}
                            <span className="flex-1 text-sm font-medium truncate">
                                {pasta.name}
                            </span>
                            {!isSystem && !isSelected && onDeletePasta && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeletePasta(pasta.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded transition-all"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    );
                })}

                {isCreating && (
                    <div className="flex items-center gap-2 px-4 py-2">
                        <Folder size={18} className="text-slate-300" />
                        <input
                            type="text"
                            value={newPastaName}
                            onChange={(e) => setNewPastaName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={() => {
                                if (!newPastaName.trim()) {
                                    setIsCreating(false);
                                }
                            }}
                            placeholder="Nova pasta..."
                            className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-300"
                            autoFocus
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PastasSidebar;
