import React, { useState, useRef, useEffect } from 'react';
import { Nota, Pasta } from '../types';
import { Bold, Italic, Underline, Highlighter, Paperclip, Eye, Save, ChevronDown, Type } from 'lucide-react';

interface NotesEditorProps {
    nota: Nota | null;
    pastas: Pasta[];
    onSave: (nota: Nota) => void;
    onTitleChange: (title: string) => void;
    onContentChange: (content: string) => void;
    selectedPastaId?: string;
    onPastaChange: (pastaId: string) => void;
}

const NotesEditor: React.FC<NotesEditorProps> = ({
    nota,
    pastas,
    onSave,
    onTitleChange,
    onContentChange,
    selectedPastaId,
    onPastaChange
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        if (editorRef.current && nota) {
            editorRef.current.innerHTML = nota.content || '';
        }
    }, [nota?.id]);

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleInput = () => {
        if (editorRef.current) {
            onContentChange(editorRef.current.innerHTML);
        }
    };

    const handleSave = () => {
        if (nota && editorRef.current) {
            onSave({
                ...nota,
                content: editorRef.current.innerHTML,
                updatedAt: new Date().toISOString()
            });
        }
    };

    if (!nota) {
        return (
            <div className="flex-1 flex items-center justify-center text-slate-300">
                <div className="text-center">
                    <Type size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm">Selecione ou crie uma nota</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-light text-slate-800">Notas</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Edição</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Pasta Selector */}
                    <div className="relative">
                        <select
                            value={selectedPastaId || 'none'}
                            onChange={(e) => onPastaChange(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-100 rounded-xl text-xs outline-none focus:border-slate-200 cursor-pointer"
                        >
                            <option value="none">Sem Pasta</option>
                            {pastas.filter(p => p.id !== 'all' && p.id !== 'none').map(pasta => (
                                <option key={pasta.id} value={pasta.id}>{pasta.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${isPreview
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        <Eye size={14} />
                        Visualizar
                    </button>

                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-black transition-all shadow-sm"
                    >
                        <Save size={14} />
                        Salvar
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
                    {/* Formatting Toolbar */}
                    {!isPreview && (
                        <div className="flex items-center gap-1 px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                            <button
                                onClick={() => execCommand('bold')}
                                className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                                title="Negrito"
                            >
                                <Bold size={16} />
                            </button>
                            <button
                                onClick={() => execCommand('italic')}
                                className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                                title="Itálico"
                            >
                                <Italic size={16} />
                            </button>
                            <button
                                onClick={() => execCommand('underline')}
                                className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
                                title="Sublinhado"
                            >
                                <Underline size={16} />
                            </button>

                            <div className="w-px h-5 bg-slate-200 mx-2" />

                            <button
                                onClick={() => execCommand('foreColor', '#1e293b')}
                                className="p-2 hover:bg-white rounded-lg text-slate-800 transition-colors font-bold"
                                title="Cor do texto"
                            >
                                A
                            </button>
                            <button
                                onClick={() => execCommand('foreColor', '#3b82f6')}
                                className="p-2 hover:bg-white rounded-lg text-blue-500 transition-colors font-bold"
                                title="Texto azul"
                            >
                                A
                            </button>
                            <button
                                onClick={() => execCommand('foreColor', '#ef4444')}
                                className="p-2 hover:bg-white rounded-lg text-red-500 transition-colors font-bold"
                                title="Texto vermelho"
                            >
                                A
                            </button>

                            <div className="w-px h-5 bg-slate-200 mx-2" />

                            <button
                                onClick={() => execCommand('hiliteColor', '#fef08a')}
                                className="p-2 hover:bg-white rounded-lg text-yellow-500 hover:text-yellow-600 transition-colors"
                                title="Destacar"
                            >
                                <Highlighter size={16} />
                            </button>

                            <button
                                className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 transition-colors ml-auto"
                                title="Anexar"
                            >
                                <Paperclip size={16} />
                            </button>
                        </div>
                    )}

                    {/* Title */}
                    <div className="px-8 pt-8">
                        <input
                            type="text"
                            value={nota.title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            placeholder="Título da Anotação..."
                            className="w-full text-4xl font-light text-slate-800 placeholder:text-slate-200 outline-none bg-transparent"
                            disabled={isPreview}
                        />
                    </div>

                    {/* Content */}
                    <div className="px-8 py-6 min-h-[400px]">
                        {isPreview ? (
                            <div
                                className="prose prose-slate max-w-none text-lg leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: nota.content || '<p class="text-slate-300 italic">Sem conteúdo</p>' }}
                            />
                        ) : (
                            <div
                                ref={editorRef}
                                contentEditable
                                onInput={handleInput}
                                className="min-h-[300px] text-lg text-slate-600 leading-relaxed outline-none"
                                data-placeholder="Comece a escrever..."
                                suppressContentEditableWarning
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesEditor;
