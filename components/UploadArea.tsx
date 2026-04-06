import React, { useRef, useState } from 'react';
import { CloudUpload } from 'lucide-react';

interface UploadAreaProps {
    onFilesSelected: (files: File[]) => void;
    title?: string;
    subtitle?: string;
}

const UploadArea: React.FC<UploadAreaProps> = ({
    onFilesSelected,
    title = "Novo Ativo",
    subtitle = "Arraste imagens ou PDFs para adicionar ao seu patrimônio científico."
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFilesSelected(files);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            onFilesSelected(files);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          bg-white rounded-[40px] p-16 text-center
          border-2 border-dashed transition-all duration-500
          ${isDragging
                        ? 'border-blue-400 bg-blue-50/50 scale-[1.02]'
                        : 'border-slate-100 hover:border-slate-200'
                    }
        `}
            >
                <div className={`
          w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center
          transition-all duration-500
          ${isDragging ? 'bg-blue-100 text-blue-500 scale-110' : 'bg-slate-50 text-slate-300'}
        `}>
                    <CloudUpload size={40} strokeWidth={1} />
                </div>

                <h3 className="text-2xl font-light text-slate-800 mb-3">
                    {title}
                </h3>

                <p className="text-sm text-slate-400 mb-8 max-w-xs mx-auto leading-relaxed">
                    {subtitle}
                </p>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-10 py-4 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95"
                >
                    Selecionar Arquivos
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default UploadArea;
