import { useEffect, useState } from "react";
import { parseMarkdown } from "../utils/MarkdownParser";
import { Link, useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../redux/slices/blog.slice";
import { showToast } from "../redux/slices/toast.slice";

import { 
  ChevronLeft, Edit3
} from 'lucide-react';

function Preview () {
    const authState = useSelector ((state) => state.auth);

  const [blog, setBlog] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook needed for the back button
  const { slug } = useParams();

  async function get_blog () {
    try {
        const res = await dispatch(getBlog(slug));
        setBlog(res.payload.data.blogsData.blog);
    } catch (err) {
        dispatch(showToast({ message: 'Blog fetch failed!', type: 'error' }));
    }
  }

  useEffect (() => {
    get_blog ();
  }, [slug]);

  // 1. Extract color with a fallback to white
  // This ensures the page isn't transparent while loading
  const pageBgColor = blog?.theme;
  console.log (blog);

  return (
    // 2. Apply background color via inline style
    // Removed 'bg-white' class to prevent conflicts
    <div 
      className="min-h-screen font-serif text-slate-900 selection:bg-yellow-100 transition-colors duration-500 bg-white"
    >
      {/* 3. Updated Navbar to match background with 90% opacity (CC hex) */}
      {authState.isLoggedIn && <nav 
        className="fixed top-0 w-full backdrop-blur-md border-b border-gray-100/50 z-50 px-6 h-16 flex items-center justify-end transition-colors duration-500"
      >
        <Link to={`/blog/edit/${blog?.slug}`} className="flex items-center gap-2 text-sm font-sans bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800">
          <Edit3 size={14} /> Edit this blog
        </Link>
      </nav>}

      <article className="pt-24 pb-32">
        <div className="max-w-3xl mx-auto p-6 rounded-md"  style={{ backgroundColor: pageBgColor }}>
          {blog?.cover_image?.url && (
            <div className="mb-12 rounded-xl overflow-hidden shadow-sm">
               <img src={blog?.cover_image?.url} alt="Cover" className="w-full h-auto max-h-[500px] object-cover" />
            </div>
          )}
          
          <div className="mb-12 text-center">
             {blog?.tags?.length > 0 && <div className="flex justify-center gap-2 mb-6">
                {blog?.tags && blog?.tags.map(tag => (
                  <span key={tag} className="text-xs font-sans uppercase tracking-widest text-gray-500 border border-gray-200 px-3 py-1 rounded-full bg-white/50">{tag}</span>
                ))}
             </div>}
             <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{blog?.title}</h1>
             <div className="flex items-center justify-center gap-4 font-sans text-sm text-gray-500">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                    {/* Added optional chaining for safety */}
                    <img src={blog?.userId?.image?.url} alt="Author" className="w-full h-full object-cover" />
                 </div>
                 <span>{blog?.userId?.username}</span>
               </div>
               <span>•</span>
               <span>
                {blog?.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })
                    : 'Unknown Date'}
               </span>
             </div>
          </div>
          
          {/* Added 'bg-transparent' to ensure prose doesn't force a white background  */}
          <div className="prose prose-lg prose-slate mx-auto bg-transparent">
            {parseMarkdown(blog?.content)}
          </div>

          <div className="mt-24 pt-12 border-t border-gray-100 font-sans text-center text-gray-400">
            <p>Thanks for reading.</p>
          </div>
        </div>
      </article>
    </div>
  );
}

export default Preview;