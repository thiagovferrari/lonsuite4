import React from 'react';
import { Search, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { EvidenceLevel, AssetType } from '../types';

interface FilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedType: AssetType | 'all';
    onTypeChange: (type: AssetType | 'all') => void;
    selectedEvidence: EvidenceLevel | 'all';
    onEvidenceChange: (level: EvidenceLevel | 'all') => void;
    viewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
    searchQuery,
    onSearchChange,
    selectedType,
    onTypeChange,
    selectedEvidence,
    onEvidenceChange,
    viewMode,
    onViewModeChange
}) => {
    return (
        <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input
                    type="text"
                    placeholder="Busca Semântica"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:border-slate-200 focus:shadow-sm transition-all placeholder:text-slate-300"
                />
            </div>

            {/* Type Filter */}
            <div className="relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute -top-4 left-1">
                    Tipo
                </label>
                <div className="relative">
                    <select
                        value={selectedType}
                        onChange={(e) => onTypeChange(e.target.value as AssetType | 'all')}
                        className="appearance-none pl-4 pr-10 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:border-slate-200 cursor-pointer"
                    >
                        <option value="all">Todos</option>
                        <option value="image">Imagem</option>
                        <option value="pdf">PDF</option>
                        <option value="case">Caso</option>
                        <option value="document">Documento</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Evidence Filter */}
            <div className="relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider absolute -top-4 left-1">
                    Evidência
                </label>
                <div className="relative">
                    <select
                        value={selectedEvidence}
                        onChange={(e) => onEvidenceChange(e.target.value as EvidenceLevel | 'all')}
                        className="appearance-none pl-4 pr-10 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:border-slate-200 cursor-pointer"
                    >
                        <option value="all">Todas</option>
                        <option value="Alto">Alto</option>
                        <option value="Moderado">Moderado</option>
                        <option value="Baixo">Baixo</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1">
                <button
                    onClick={() => onViewModeChange('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <LayoutGrid size={18} />
                </button>
                <button
                    onClick={() => onViewModeChange('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <List size={18} />
                </button>
            </div>
        </div>
    );
};

export default FilterBar;
