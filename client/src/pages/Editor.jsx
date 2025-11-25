import { useEffect, useRef, useState } from "react";
import {
    Bold, Italic, Image as ImageIcon, List, Type,
    ChevronLeft, Eye, Settings, X,
    Save, Send, Globe, Hash, Sparkles,
    PanelLeftClose, CheckCircle2, AlertCircle,
    Quote, Highlighter, ImagePlus, UploadCloud, Palette,
    Link as LinkIcon,
    Loader2
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

    // Initialize sidebar: Open on desktop (>1024px), Closed on mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [cover_image, setCoverImage] = useState(null);
    const [slug, setSlug] = useState("");
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [status, setStatus] = useState('draft');
    const [saveStatus, setSaveStatus] = useState('saved');

    // Colors
    const [pageBgColor, setPageBgColor] = useState('#ffffff');
    const [highlightColor, setHighlightColor] = useState('#facc15');

    // Modal states
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [tempUrl, setTempUrl] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [tempLink, setTempLink] = useState('');
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
        
        // Handle resize events
        const handleResize = () => {
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
            const blog = res.payload?.data?.blogsData?.blog;
            if(blog) {
                setTitle(blog.title);
                setContent(blog.content);
                if (blog.tags?.length > 0) setTags(blog.tags);
                const image = blog.cover_image?.url || blog.cover_image;
                setCoverImage(image);
                setSlug(blog.slug);
                if(blog.theme?.background) setPageBgColor(blog.theme.background);
            }
        }
    }

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
        if (type === 'link') {
            setSelectionRange({ start, end });
            setShowLinkInput(true);
            return;
        }
        if (type === 'highlight') {
            const prefix = `<mark style="background-color: ${highlightColor};">`;
            const suffix = `</mark>`;
            const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
            setContent(newText);
            const newCursorPos = end + prefix.length; 
            setTimeout(() => {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }, 0);
            return;
        }

        let newText = text;
        let newCursorPos = end;
        const formats = {
            bold: { wrap: '**', offset: 4 },
            italic: { wrap: '_', offset: 2 },
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

    const confirmLinkInput = () => {
        if (!selectionRange) return;
        const { start, end } = selectionRange;
        const selectedText = content.substring(start, end) || 'link';
        const replacement = `[${selectedText}](${tempLink})`;
        const newText = content.substring(0, start) + replacement + content.substring(end);
        setContent(newText);
        setShowLinkInput(false);
        setTempLink('');
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

    const handleCoverImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            e.target.value = '';
        }
    };

    const handleSave = async (currentStatus = status) => {
        setSaveStatus('saving');
        const formData = new FormData();
        formData.append('userId', authState.data?._id);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('theme', pageBgColor);
        const finalSlug = slug || title.toLowerCase().replace(/\s+/g, '-');
        formData.append('slug', finalSlug);
        tags.forEach(tag => formData.append('tags', tag));
        if (cover_image instanceof File) {
            formData.append('image', cover_image);
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

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);   
        setSlug(value.toLowerCase().trim().replace(/\s+/g, '-').slice(0, 50));
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50 text-slate-800 font-sans">
            <style>{`
                ::selection {
                    background-color: ${highlightColor}80 !important; 
                    color: black;
                }
                /* Hide Scrollbar for Toolbar */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* --- TOP NAVIGATION BAR --- */}
            <nav className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40 shrink-0">
                <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 text-sm text-gray-500">
                        <span className="font-medium text-gray-900 hidden sm:inline">Studio</span>
                        <span className="text-gray-300 hidden sm:inline">/</span>
                        <span className="truncate max-w-[120px] sm:max-w-[200px] font-medium sm:font-normal">{title || "Untitled"}</span>
                    </div>
                    <div className="text-xs ml-2">
                        {saveStatus === 'saved' && <span className="text-gray-400 flex items-center gap-1"><CheckCircle2 size={12} /> <span className="hidden sm:inline">Saved</span></span>}
                        {saveStatus === 'saving' && <span className="text-blue-500 animate-pulse">Saving...</span>}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={() => handleSave()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg hidden sm:block" title="Save Draft">
                        <Save size={20} />
                    </button>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 text-gray-500 hover:bg-gray-100 rounded-lg ${isSidebarOpen ? 'bg-gray-100' : ''}`}>
                        {isSidebarOpen ? <PanelLeftClose size={20} /> : <Settings size={20} />}
                    </button>
                    <button onClick={viewBlog} className="flex items-center justify-center sm:gap-2 bg-slate-100 text-slate-700 w-9 h-9 sm:w-auto sm:px-4 sm:py-2 rounded-full text-sm font-medium hover:bg-slate-200 transition-all">
                        <Eye size={18} /> <span className="hidden sm:inline">Preview</span>
                    </button>

                    <button 
                        onClick={() => handleSave()} 
                        disabled={saveStatus === 'saving'}
                        className={`
                            flex items-center justify-center sm:gap-2 
                            bg-black text-white 
                            w-9 h-9 sm:w-auto sm:px-4 sm:py-2 
                            rounded-full text-sm font-medium 
                            transition-all shadow-lg
                            ${saveStatus === 'saving' ? 'bg-gray-800 cursor-not-allowed opacity-80' : 'hover:bg-gray-800'}
                        `}
                    >
                        {saveStatus === 'saving' ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span className="hidden sm:inline">
                                    {blog_slug ? 'Updating...' : 'Publishing...'}
                                </span>
                            </>
                        ) : (
                            <>
                                <Send size={16} /> 
                                <span className="hidden sm:inline">
                                    {blog_slug ? 'Update' : 'Publish'}
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </nav>

            {/* --- MAIN EDITOR AREA --- */}
            <div className="flex flex-1 relative overflow-hidden">
                <main 
                    className="flex-1 overflow-y-auto h-full scroll-smooth" 
                    style={{ backgroundColor: pageBgColor }}
                >
                    <div className={`max-w-3xl mx-auto py-6 px-4 sm:px-8 sm:py-10 transition-all duration-300 ${isSidebarOpen ? 'lg:mr-80' : ''} pb-32`}>
                        
                        {/* Cover Image Uploader */}
                        {!cover_image ? (
                            <div className="group relative h-32 sm:h-52 bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-all cursor-pointer mb-6 overflow-hidden">
                                <div className="flex flex-col items-center gap-2">
                                    <ImageIcon size={24} />
                                    <span className="text-sm font-medium">Add Cover</span>
                                </div>
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleCoverImageUpload}
                                    accept="image/*"
                                />
                            </div>
                        ) : (
                            <div className="relative h-48 sm:h-72 w-full mb-8 rounded-xl overflow-hidden group shadow-sm">
                                <img
                                    src={typeof cover_image === 'string' ? cover_image : URL.createObjectURL(cover_image)}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button onClick={() => coverInputRef.current.click()} className="bg-white/90 p-2 rounded-full text-gray-700 shadow-md hover:text-blue-600">
                                        <ImagePlus size={16} />
                                    </button>
                                    <button onClick={() => setCoverImage(null)} className="bg-white/90 p-2 rounded-full text-gray-700 shadow-md hover:text-red-500">
                                        <X size={16} />
                                    </button>
                                </div>
                                <input ref={coverInputRef} type="file" className="hidden" onChange={handleCoverImageUpload} accept="image/*" />
                            </div>
                        )}

                        {/* Title Input */}
                        <input 
                            type="text" 
                            value={title} 
                            onChange={handleTitleChange} 
                            placeholder="Post Title..." 
                            className="w-full text-3xl sm:text-5xl font-bold text-slate-900 placeholder-gray-300 border-none focus:ring-0 focus:outline-none mb-4 tracking-tight leading-tight bg-transparent" 
                        />

                        {/* Sticky Toolbar */}
                        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm py-2 sm:py-3 border-b border-gray-100 mb-6 flex items-center gap-1 rounded-xl overflow-x-auto no-scrollbar shadow-sm px-1">
                            <div className="flex items-center shrink-0 pr-4">
                                <ToolbarButton title={'Bold'} icon={<Bold size={18} />} onClick={() => insertFormat('bold')} />
                                <ToolbarButton title={'Italic'} icon={<Italic size={18} />} onClick={() => insertFormat('italic')} />
                                
                                <div className="flex items-center bg-gray-100 rounded-lg mx-1 px-1 border border-gray-200">
                                    <ToolbarButton title={'Highlight'} icon={<Highlighter size={18} />} onClick={() => insertFormat('highlight')} />
                                    <div className="h-4 w-px bg-gray-300 mx-1"></div>
                                    <input 
                                        type="color" 
                                        value={highlightColor} 
                                        onChange={(e) => setHighlightColor(e.target.value)} 
                                        className="w-5 h-5 rounded cursor-pointer border-none p-0 bg-transparent" 
                                    />
                                </div>

                                <div className="w-px h-5 bg-gray-200 mx-1 sm:mx-2" />
                                <ToolbarButton title={'Heading'} icon={<Type size={18} />} onClick={() => insertFormat('h2')} />
                                <ToolbarButton title={'Quote'} icon={<Quote size={18} />} onClick={() => insertFormat('quote')} />
                                <ToolbarButton title={'List'} icon={<List size={18} />} onClick={() => insertFormat('list')} />
                                <div className="w-px h-5 bg-gray-200 mx-1 sm:mx-2" />
                                <ToolbarButton title={'Link'} icon={<LinkIcon size={18} />} onClick={() => insertFormat('link')} />
                                <ToolbarButton title={'Image'} icon={<ImagePlus size={18} />} onClick={() => insertFormat('image')} />
                            </div>
                            
                            <button className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs font-medium hover:bg-purple-100 transition-colors ml-auto shrink-0 whitespace-nowrap">
                                <Sparkles size={14} /> <span className="hidden sm:inline">AI Assist</span>
                            </button>
                        </div>

                        {/* Main Content Textarea */}
                        <textarea 
                            ref={textareaRef} 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="Tell your story..." 
                            className="w-full resize-none text-lg sm:text-xl leading-relaxed text-gray-700 border-none focus:ring-0 focus:outline-none min-h-[50vh] font-serif bg-transparent" 
                            spellCheck={false} 
                        />
                    </div>
                </main>

                {/* --- RESPONSIVE MODALS (Fixed positioning for mobile) --- */}
                
                {/* Image URL Modal */}
                {showUrlInput && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-md p-5 rounded-2xl shadow-2xl">
                            <h3 className="font-bold text-gray-900 mb-4">Add Image</h3>
                            
                            {/* Upload Area */}
                            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative mb-4 ${isUploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                                {isUploadingImage ? (
                                    <span className="text-sm text-blue-500 font-medium animate-pulse">Uploading...</span>
                                ) : tempUrl ? (
                                    <img src={tempUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <UploadCloud className="w-8 h-8 mb-2" />
                                        <span className="text-xs font-semibold uppercase">Click to Upload</span>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageFileUpload} />
                            </label>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-px bg-gray-200 flex-1"></div>
                                <span className="text-xs text-gray-400 font-medium uppercase">Or paste URL</span>
                                <div className="h-px bg-gray-200 flex-1"></div>
                            </div>

                            <input 
                                autoFocus 
                                type="text" 
                                placeholder="https://..." 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                                value={tempUrl} 
                                onChange={(e) => setTempUrl(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && confirmUrlInput()} 
                            />
                            
                            <div className="flex justify-end gap-2">
                                <button onClick={() => { setShowUrlInput(false); setTempUrl(''); }} className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button onClick={confirmUrlInput} disabled={!tempUrl} className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">Insert Image</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Link Modal */}
                {showLinkInput && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white w-full max-w-sm p-5 rounded-2xl shadow-2xl">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-blue-50 p-2 rounded-full text-blue-600"><LinkIcon size={18} /></div>
                                <h3 className="font-bold text-gray-900">Add Link</h3>
                            </div>
                            <input 
                                autoFocus 
                                type="url" 
                                placeholder="https://example.com" 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
                                value={tempLink} 
                                onChange={(e) => setTempLink(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && confirmLinkInput()} 
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => { setShowLinkInput(false); setTempLink(''); }} className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button onClick={confirmLinkInput} disabled={!tempLink} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Add Link</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- SIDEBAR OVERLAY (Mobile) --- */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* --- SIDEBAR SETTINGS --- */}
                <aside className={`
                    fixed lg:absolute right-0 top-0 h-full bg-white border-l border-gray-100 
                    w-[85vw] sm:w-80 
                    z-40 shadow-2xl lg:shadow-none
                    transition-transform duration-300 ease-out
                    ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                    overflow-y-auto
                `}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-lg text-gray-900">Settings</h3>
                            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Appearance */}
                        <div className="mb-8">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Palette size={14} /> Appearance
                            </label>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <span className="text-sm font-medium text-gray-600">Background</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 font-mono">{pageBgColor}</span>
                                    <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm overflow-hidden relative cursor-pointer hover:scale-105 transition-transform">
                                        <input type="color" value={pageBgColor} onChange={(e) => setPageBgColor(e.target.value)} className="absolute -top-4 -left-4 w-16 h-16 p-0 border-0 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Slug */}
                        <div className="mb-8">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">URL Slug</label>
                            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all overflow-hidden">
                                <div className="pl-3 text-gray-400"><Globe size={16} /></div>
                                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-slug" className="w-full bg-transparent border-none text-sm p-3 text-gray-700 focus:ring-0 placeholder-gray-400" />
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mb-8">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">Tags</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tags.map((tag) => (
                                    <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md flex items-center gap-1 border border-slate-200">
                                        {tag} <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-red-500"><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 focus-within:border-black transition-all">
                                <div className="pl-3 text-gray-400"><Hash size={16} /></div>
                                <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={addTag} placeholder="Add tag..." className="w-full bg-transparent border-none text-sm p-3 text-gray-700 focus:ring-0" />
                            </div>
                        </div>

                        {/* SEO Score */}
                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">SEO Check</label>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`font-bold text-2xl ${title.length > 10 ? 'text-green-500' : 'text-orange-400'}`}>{title.length > 10 ? '92' : '45'}</span>
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">{title.length > 10 ? 'Good' : 'Weak'}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                                    <div className={`h-1.5 rounded-full transition-all duration-500 ${title.length > 10 ? 'bg-green-500 w-[92%]' : 'bg-orange-400 w-[45%]'}`}></div>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-xs text-gray-600">
                                        <CheckCircle2 size={14} className={title.length > 0 ? 'text-green-500' : 'text-gray-300'} />
                                        <span>Title Present</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-gray-600">
                                        <AlertCircle size={14} className={cover_image ? 'text-green-500' : 'text-orange-400'} />
                                        <span>{cover_image ? 'Cover Added' : 'Missing Cover'}</span>
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