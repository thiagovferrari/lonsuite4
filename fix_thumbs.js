const fs = require('fs');
let content = fs.readFileSync('components/AssetModal.tsx', 'utf8');

// Replace the inline mapping of thumbnails with a local component that loads the thumb
const attachmentThumbComp = `
const AttachmentThumb = ({ att, idx, currentIndex, onSelect, isTrashMode, onDelete }: any) => {
    const [url, setUrl] = useState(att.data || null);
    useEffect(() => {
        let active = true;
        if (!att.data && att.type.includes('image')) {
            getAttachmentData(att.id).then(data => { if(active && data) setUrl(data); });
        }
        return () => { active = false; };
    }, [att]);

    return (
        <div onClick={() => onSelect(idx)}
            className={\`w-[60px] h-[60px] rounded-apple overflow-hidden cursor-pointer transition-all border-2 relative shrink-0 group/thumb \${currentIndex === idx ? 'border-[#4285F4] shadow-apple' : 'border-transparent opacity-50 hover:opacity-80'}\`}>
            {att.type.includes('image') ? (
                url ? <img src={url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#f5f5f7] animate-pulse" />
            ) : (
                <div className="w-full h-full bg-[#f5f5f7] flex items-center justify-center">
                    <FileText size={18} className="text-[#86868b]" />
                </div>
            )}
            {!isTrashMode && (
                <button onClick={e => onDelete(att.id, e)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-red-500/90 text-white rounded-full opacity-0 group-hover/thumb:opacity-100 transition-opacity hover:bg-red-600 shadow-sm">
                    <X size={9} />
                </button>
            )}
        </div>
    );
};
`;

if (!content.includes('const AttachmentThumb')) {
    content = content.replace('const AssetModal: React.FC<AssetModalProps> = ({', attachmentThumbComp + '\nconst AssetModal: React.FC<AssetModalProps> = ({');
}

// Replace the mapping implementation
const searchThumbLoop = `{editedAsset.attachments.map((att, idx) => (
                            <div key={att.id} onClick={() => setCurrentSlideIndex(idx)}
                                className={\`w-[60px] h-[60px] rounded-apple overflow-hidden cursor-pointer transition-all border-2 relative shrink-0 group/thumb \${currentSlideIndex === idx ? 'border-[#4285F4] shadow-apple' : 'border-transparent opacity-50 hover:opacity-80'}\`}>
                                {att.type.includes('image') ? (
                                    <img src={att.data} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-[#f5f5f7] flex items-center justify-center">
                                        <FileText size={18} className="text-[#86868b]" />
                                    </div>
                                )}
                                {!isTrashMode && (
                                    <button onClick={e => handleDeleteAttachment(att.id, e)}
                                        className="absolute top-0.5 right-0.5 p-0.5 bg-red-500/90 text-white rounded-full opacity-0 group-hover/thumb:opacity-100 transition-opacity hover:bg-red-600 shadow-sm">
                                        <X size={9} />
                                    </button>
                                )}
                            </div>
                        ))}`;

const replaceThumbLoop = `{editedAsset.attachments.map((att, idx) => (
                            <AttachmentThumb key={att.id} att={att} idx={idx} currentIndex={currentSlideIndex} onSelect={setCurrentSlideIndex} isTrashMode={isTrashMode} onDelete={handleDeleteAttachment} />
                        ))}`;

content = content.replace(searchThumbLoop, replaceThumbLoop);
fs.writeFileSync('components/AssetModal.tsx', content);
console.log("AsserModal thumbs patched");
