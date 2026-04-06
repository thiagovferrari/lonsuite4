import React from 'react';
import { Nota, Pasta } from '../types';
import { Search, ChevronDown, FileText, Image } from 'lucide-react';

interface BibliotecaProps {
    notas: Nota[];
    pastas: Pasta[];
    selectedNotaId: string | null;
    onSelectNota: (notaId: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedPastaFilter: string;
    onPastaFilterChange: (pastaId: string) => void;
}

const Biblioteca: React.FC<BibliotecaProps> = ({
    notas,
    pastas,
    selectedNotaId,
    onSelectNota,
    searchQuery,
    onSearchChange,
    selectedPastaFilter,
    onPastaFilterChange
}) => {
    const filteredNotas = notas.filter(nota => {
        const matchesSearch = nota.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPasta = selectedPastaFilter === 'all' || nota.pastaId === selectedPastaFilter || (!nota.pastaId && selectedPastaFilter === 'none');
        return matchesSearch && matchesPasta;
    });

    return (
        <div className="w-72 bg-white border-l border-slate-100 flex flex-col h-full">
            <div className="p-4 border-b border-slate-50">
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Biblioteca
                    </h3>
                    <button className="ml-auto p-1 hover:bg-slate-50 rounded text-slate-300 hover:text-slate-500 transition-colors">
                        <ChevronDown size={14} />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-slate-200 transition-all placeholder:text-slate-300"
                    />
                </div>

                {/* Pasta Filter */}
                <div className="relative">
                    <select
                        value={selectedPastaFilter}
                        onChange={(e) => onPastaFilterChange(e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-slate-200 cursor-pointer"
                    >
                        <option value="all">Todas as Pastas</option>
                        {pastas.filter(p => p.id !== 'all').map(pasta => (
                            <option key={pasta.id} value={pasta.id}>{pasta.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-2">
                {filteredNotas.map(nota => {
                    const isSelected = selectedNotaId === nota.id;
                    const hasLinkedAssets = nota.linkedAssetIds && nota.linkedAssetIds.length > 0;

                    return (
                        <div
                            key={nota.id}
                            onClick={() => onSelectNota(nota.id)}
                            className={`
                group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1
                ${isSelected
                                    ? 'bg-blue-50 border border-blue-100'
                                    : 'hover:bg-slate-50 border border-transparent'
                                }
              `}
                        >
                            <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                ${isSelected ? 'bg-blue-100' : 'bg-slate-50'}
              `}>
                                {hasLinkedAssets ? (
                                    <Image size={14} className={isSelected ? 'text-blue-500' : 'text-slate-400'} />
                                ) : (
                                    <FileText size={14} className={isSelected ? 'text-blue-500' : 'text-slate-400'} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                                    {nota.title || 'Sem título'}
                                </h4>
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                    {new Date(nota.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {filteredNotas.length === 0 && (
                    <div className="text-center py-8 text-slate-300">
                        <FileText size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-xs">Nenhuma nota encontrada</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Biblioteca;
