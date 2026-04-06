import React from 'react';
import { UploadIntention } from '../types';
import { Briefcase, FileText, Image, X } from 'lucide-react';

interface TypeSelectorProps {
    onSelect: (intention: UploadIntention) => void;
    onCancel: () => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({ onSelect, onCancel }) => {
    const options = [
        {
            id: 'caso_clinico' as UploadIntention,
            icon: Briefcase,
            title: 'Caso Clínico',
            description: 'Várias fotos, exames e documentos unificados por IA.',
            color: 'bg-blue-50',
            iconColor: 'text-blue-500'
        },
        {
            id: 'artigo_pdf' as UploadIntention,
            icon: FileText,
            title: 'Artigo / PDF',
            description: 'Material científico para indexação e busca semântica.',
            color: 'bg-purple-50',
            iconColor: 'text-purple-500'
        },
        {
            id: 'imagem_unica' as UploadIntention,
            icon: Image,
            title: 'Imagem Única',
            description: 'Fotos rápidas de procedimentos ou slides de aula.',
            color: 'bg-rose-50',
            iconColor: 'text-rose-500'
        }
    ];

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 animate-fade-in">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative w-full max-w-3xl bg-white rounded-[48px] p-12 shadow-2xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-light tracking-tight text-slate-900 mb-3">
                        O que deseja registrar hoje?
                    </h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
                        Escolha uma intenção para que a IA organize por você
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {options.map((option) => {
                        const IconComponent = option.icon;
                        return (
                            <button
                                key={option.id}
                                onClick={() => onSelect(option.id)}
                                className="group p-8 bg-white border border-slate-100 rounded-[32px] hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 text-center"
                            >
                                <div className={`w-16 h-16 ${option.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                    <IconComponent size={28} className={option.iconColor} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-lg font-medium text-slate-800 mb-2">
                                    {option.title}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {option.description}
                                </p>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={onCancel}
                    className="flex items-center justify-center gap-2 mx-auto text-slate-400 hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-[0.2em]"
                >
                    <X size={14} />
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default TypeSelector;
