import { useEffect, useRef, useState } from "react";
import {
    Bold, Italic, Image as ImageIcon, List, Type,
    ChevronLeft, Eye, Settings, X,
    Save, Send, Globe, Hash, Sparkles,
    PanelLeftClose, CheckCircle2, AlertCircle,
    Quote, Highlighter, ImagePlus, UploadCloud
} from 'lucide-react';
import ToolbarButton from "../components/ToolbarButton";
import { useDispatch, useSelector } from "react-redux";
import { createBlog, getBlog, updateBlog, uploadImage } from "../redux/slices/blog.slice";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../redux/slices/toast.slice";

function Editor() {
    const blogState = useSelector((state) => state.blog);
    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { blog_slug } = useParams();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [cover_image, setCoverImage] = useState(null);
    const [slug, setSlug] = useState("");
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [status, setStatus] = useState('draft');
    const [saveStatus, setSaveStatus] = useState('saved');

    // Modal states for insertion
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [tempUrl, setTempUrl] = useState('');
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [selectionRange, setSelectionRange] = useState(null);

    const textareaRef = useRef(null);
    const coverInputRef = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [content]);

    useEffect(() => {
        getCurrentBlog();
    }, [])

    const getCurrentBlog = async () => {
        if (!blog_slug) return;

        let res;

        try {
            res = await dispatch(getBlog(blog_slug));
        } catch (err) {
            dispatch(showToast({ message: 'Blog fetch failed!', type: 'error' }));
        }
        finally {
            const blog = res.payload.data.blogsData.blog;
            setTitle(blog?.title);
            setContent(blog?.content);
            if (blog?.tags?.length > 0) setTags(blog?.tags);
            
            // Handle potentially different image object structures
            const image = blog?.cover_image?.url || blog?.cover_image;
            setCoverImage(image);
            setSlug(blog?.slug);
        }
    }

    // Formatting Logic
    const insertFormat = (type) => {
        if (!textareaRef.current) return;
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = content;
        const selectedText = text.substring(start, end);

        if (type === 'image') {
            setSelectionRange({ start, end });
            setShowUrlInput(true);
            return;
        }

        let newText = text;
        let newCursorPos = end;

        const formats = {
            bold: { wrap: '**', offset: 4 },
            italic: { wrap: '_', offset: 2 },
            highlight: { wrap: '==', offset: 4 },
            list: { prefix: '\n- ', offset: 3 },
            h2: { prefix: '\n## ', offset: 4 },
            quote: { prefix: '\n> ', offset: 3 }
        };

        if (formats[type]) {
            const f = formats[type];
            if (f.wrap) {
                newText = text.substring(0, start) + `${f.wrap}${selectedText}${f.wrap}` + text.substring(end);
                newCursorPos = end + f.offset;
            } else {
                newText = text.substring(0, start) + `${f.prefix}${selectedText}` + text.substring(end);
                newCursorPos = end + f.offset;
            }
        }

        setContent(newText);
        setTimeout(() => {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const confirmUrlInput = () => {
        if (!selectionRange) return;
        const { start, end } = selectionRange;
        const replacement = `\n![Image](${tempUrl})\n`;
        const newText = content.substring(0, start) + replacement + content.substring(end);

        setContent(newText);
        setShowUrlInput(false);
        setTempUrl('');

        setTimeout(() => {
            const newCursor = start + replacement.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCursor, newCursor);
        }, 0);
    };

    const handleImageFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploadingImage(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await dispatch(uploadImage(formData));
            setTempUrl(res.payload.data.imagePath);
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image");
        } finally {
            setIsUploadingImage(false);
        }
    };

    // UPDATED: More robust handler
    const handleCoverImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            // Reset value so if you delete and re-select the same file, it triggers
            e.target.value = '';
        }
    };

    const handleSave = async () => {
        setSaveStatus('saving');

        const formData = new FormData();

        formData.append('userId', authState.data?._id);
        formData.append('title', title);
        formData.append('content', content);

        const finalSlug = slug || title.toLowerCase().replace(/\s+/g, '-');
        formData.append('slug', finalSlug);

        tags.forEach(tag => formData.append('tags', tag));

        // CRITICAL FIX: Only append if it is a NEW file. 
        // If it is a string (old URL), do not send 'image' field, 
        // so backend preserves the existing one.
        if (cover_image instanceof File) {
            console.log("Appending new image file:", cover_image);
            formData.append('image', cover_image);
        } else {
            console.log("Keeping old image (String):", cover_image);
            // Optional: If you support deleting images, you might need a separate flag
            // e.g. if cover_image is null, formData.append('deleteImage', true);
        }

        try {
            if (!blog_slug) await dispatch(createBlog(formData));
            else await dispatch(updateBlog(formData));
            setSaveStatus('saved');
        } catch (err) {
            console.error(err);
            setSaveStatus('error');
        }
    };

    const addTag = (e) => {
        if (e.key === 'Enter' && newTag.trim()) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };

    const viewBlog = () => {
        navigate(`/blog/${slug}`);
    }

    return (
        <div className="min-h-screen bg-gray-50 text-slate-800 font-sans flex flex-col">
            <nav className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium text-gray-900 hidden sm:inline">Personal Studio</span>
                        <span className="text-gray-300 hidden sm:inline">/</span>
                        <span className="truncate max-w-[150px]">{title || "Untitled Story"}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-4 text-xs">
                        {saveStatus === 'saved' && <span className="text-gray-400 flex items-center gap-1"><CheckCircle2 size={12} /> Saved</span>}
                        {saveStatus === 'saving' && <span className="text-blue-500 animate-pulse">Saving...</span>}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => handleSave(status)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg hidden sm:block">
                        <Save size={20} />
                    </button>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 text-gray-500 hover:bg-gray-100 rounded-lg ${isSidebarOpen ? 'bg-gray-100' : ''}`}>
                        {isSidebarOpen ? <PanelLeftClose size={20} /> : <Settings size={20} />}
                    </button>
                    <button onClick={viewBlog} className={`flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg transform active:scale-95 ${status === 'published' ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-600 hover:bg-slate-600'}`}>
                        <Eye size={16} /> View
                    </button>
                    <button onClick={() => handleSave()} className={`flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg transform active:scale-95 ${status === 'published' ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-900 hover:bg-slate-800'}`}>
                        <Send size={16} /> {blog_slug ? 'Update' : 'Publish'}
                    </button>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto relative">
                    <div className="max-w-3xl mx-auto py-12 px-8 min-h-[calc(100vh-4rem)] bg-white my-8 rounded-xl shadow-sm border border-gray-100 relative">
                        
                        {/* COVER IMAGE LOGIC */}
                        {!cover_image ? (
                            <div className="group relative h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all cursor-pointer mb-8 overflow-hidden">
                                <div className="flex flex-col items-center gap-2">
                                    <ImageIcon size={24} />
                                    <span className="text-sm font-medium">Add Cover Image</span>
                                </div>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleCoverImageUpload}
                                    accept="image/*"
                                    encType="multipart/form-data"
                                />
                            </div>
                        ) : (
                            <div className="relative h-64 w-full mb-8 rounded-xl overflow-hidden group">
                                <img
                                    src={typeof cover_image === 'string' ? cover_image : URL.createObjectURL(cover_image)}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => coverInputRef.current.click()} className="bg-white/90 p-2 rounded-full text-gray-600 shadow-md hover:text-blue-600 transition-colors" title="Change Cover Image">
                                        <ImagePlus size={18} />
                                    </button>
                                    <button onClick={() => setCoverImage(null)} className="bg-white/90 p-2 rounded-full text-gray-600 shadow-md hover:text-red-500 transition-colors" title="Remove Cover Image">
                                        <X size={18} />
                                    </button>
                                </div>
                                {/* Hidden Input for Change Action */}
                                <input
                                    ref={coverInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={handleCoverImageUpload}
                                    accept="image/*"
                                    encType="multipart/form-data"
                                />
                            </div>
                        )}

                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post Title..." className="w-full text-5xl font-bold text-slate-900 placeholder-gray-300 border-none focus:ring-0 focus:outline-none mb-6 tracking-tight leading-tight" />

                        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md py-3 border-b border-gray-100 mb-6 flex items-center gap-1">
                            <ToolbarButton icon={<Bold size={18} />} onClick={() => insertFormat('bold')} />
                            <ToolbarButton icon={<Italic size={18} />} onClick={() => insertFormat('italic')} />
                            <ToolbarButton icon={<Highlighter size={18} />} onClick={() => insertFormat('highlight')} />
                            <div className="w-px h-5 bg-gray-200 mx-2" />
                            <ToolbarButton icon={<Type size={18} />} onClick={() => insertFormat('h2')} />
                            <ToolbarButton icon={<Quote size={18} />} onClick={() => insertFormat('quote')} />
                            <ToolbarButton icon={<List size={18} />} onClick={() => insertFormat('list')} />
                            <div className="w-px h-5 bg-gray-200 mx-2" />
                            <ToolbarButton icon={<ImagePlus size={18} />} onClick={() => insertFormat('image')} />
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-md text-xs font-medium hover:bg-purple-100 transition-colors ml-auto">
                                <Sparkles size={14} /> AI Assist
                            </button>
                        </div>

                        {/* URL Input Modal */}
                        {showUrlInput && (
                            <div className="absolute top-36 left-0 right-0 mx-auto w-96 bg-white p-4 shadow-xl rounded-xl border border-gray-200 z-20 animate-in fade-in zoom-in duration-200">
                                <h3 className="font-bold text-sm mb-3">Insert Image</h3>
                                <div className="mb-4">
                                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                                        {isUploadingImage ? (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6"><span className="text-sm text-gray-500 animate-pulse">Uploading to server...</span></div>
                                        ) : tempUrl ? (
                                            <img src={tempUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <UploadCloud className="w-6 h-6 mb-1 text-gray-400" />
                                                <p className="text-xs text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" encType="multipart/form-data" onChange={handleImageFileUpload} />
                                    </label>
                                </div>
                                <div className="relative flex items-center mb-3">
                                    <div className="flex-grow border-t border-gray-200"></div>
                                    <span className="flex-shrink-0 mx-2 text-xs text-gray-400 uppercase">Or paste link</span>
                                    <div className="flex-grow border-t border-gray-200"></div>
                                </div>
                                <input autoFocus type="text" placeholder="https://example.com/image.jpg" className="w-full border border-gray-300 rounded-md p-2 text-sm mb-3 outline-none focus:border-black transition-colors" value={tempUrl} onChange={(e) => setTempUrl(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && confirmUrlInput()} />
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => { setShowUrlInput(false); setTempUrl(''); }} className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-md">Cancel</button>
                                    <button onClick={confirmUrlInput} className="px-3 py-1.5 text-xs font-medium bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50" disabled={!tempUrl}>Add Image</button>
                                </div>
                            </div>
                        )}

                        <textarea ref={textareaRef} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tell your story..." className="w-full resize-none text-xl leading-relaxed text-gray-700 border-none focus:ring-0 focus:outline-none min-h-[400px] font-serif" spellCheck={false} />
                    </div>
                </main>

                {/* Sidebar */}
                <aside className={`bg-white border-l border-gray-100 w-80 transition-all duration-300 ease-in-out flex flex-col overflow-y-auto absolute right-0 h-full z-20 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full opacity-0 pointer-events-none'}`}>
                    <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-6">Post Settings</h3>
                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">URL Slug</label>
                            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 transition-all">
                                <div className="pl-3 text-gray-400"><Globe size={16} /></div>
                                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={title.toLowerCase().replace(/\s+/g, '-')} className="w-full bg-transparent border-none text-sm p-3 text-gray-700 focus:ring-0" />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Tags</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md flex items-center gap-1">
                                        {tag} <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-slate-900"><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                                <div className="pl-3 text-gray-400"><Hash size={16} /></div>
                                <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={addTag} placeholder="Add tag + Enter..." className="w-full bg-transparent border-none text-sm p-3 text-gray-700 focus:ring-0" />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">SEO Score</label>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`font-bold text-xl ${title.length > 10 ? 'text-green-500' : 'text-yellow-500'}`}>{title.length > 10 ? '92' : '45'}</span>
                                    <span className="text-xs text-gray-500">{title.length > 10 ? 'Great!' : 'Needs Work'}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                    <div className={`h-2 rounded-full ${title.length > 10 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: title.length > 10 ? '92%' : '45%' }}></div>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2 text-xs text-gray-600">
                                        <CheckCircle2 size={14} className={title.length > 0 ? 'text-green-500 mt-0.5' : 'text-gray-300 mt-0.5'} />
                                        <span>Has a title</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-xs text-gray-600">
                                        <AlertCircle size={14} className={cover_image ? 'text-green-500 mt-0.5' : 'text-orange-400 mt-0.5'} />
                                        <span>{cover_image ? 'Cover image added' : 'Add cover image'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Editor;