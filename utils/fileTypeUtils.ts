// Lon Suite - File Type Utilities

export interface FileTypeInfo {
    type: 'image' | 'pdf' | 'word' | 'excel' | 'powerpoint' | 'text' | 'document';
    icon: string;
    color: string;
    gradient: string;
    label: string;
}

export const getFileTypeInfo = (filename?: string, mimeType?: string): FileTypeInfo => {
    const safeFilename = filename || '';
    const safeMime = mimeType || '';
    const ext = safeFilename.split('.').pop()?.toLowerCase() || '';
    const mime = safeMime.toLowerCase();

    // Images
    if (mime.includes('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
        return {
            type: 'image',
            icon: '🖼️',
            color: '#3b82f6',
            gradient: 'from-blue-500 to-indigo-600',
            label: 'Imagem'
        };
    }

    // PDF
    if (mime.includes('pdf') || ext === 'pdf') {
        return {
            type: 'pdf',
            icon: '📄',
            color: '#ef4444',
            gradient: 'from-red-500 to-rose-600',
            label: 'PDF'
        };
    }

    // Word
    if (mime.includes('word') || mime.includes('msword') ||
        mime.includes('officedocument.wordprocessing') ||
        ['doc', 'docx'].includes(ext)) {
        return {
            type: 'word',
            icon: '📝',
            color: '#2563eb',
            gradient: 'from-blue-600 to-blue-700',
            label: 'Word'
        };
    }

    // Excel
    if (mime.includes('excel') || mime.includes('spreadsheet') ||
        ['xls', 'xlsx', 'csv'].includes(ext)) {
        return {
            type: 'excel',
            icon: '📊',
            color: '#059669',
            gradient: 'from-green-600 to-emerald-700',
            label: 'Excel'
        };
    }

    // PowerPoint
    if (mime.includes('powerpoint') || mime.includes('presentation') ||
        ['ppt', 'pptx'].includes(ext)) {
        return {
            type: 'powerpoint',
            icon: '📽️',
            color: '#d97706',
            gradient: 'from-orange-600 to-amber-700',
            label: 'PowerPoint'
        };
    }

    // Text files
    if (mime.includes('text/') || ['txt', 'md', 'json', 'xml'].includes(ext)) {
        return {
            type: 'text',
            icon: '📃',
            color: '#6b7280',
            gradient: 'from-gray-500 to-slate-600',
            label: 'Texto'
        };
    }

    // Default document
    return {
        type: 'document',
        icon: '📎',
        color: '#8b5cf6',
        gradient: 'from-violet-500 to-purple-600',
        label: 'Documento'
    };
};

export const getFileSizeString = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};
