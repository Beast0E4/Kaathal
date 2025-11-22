import { parseMarkdown } from "../utils/MarkdownParser";

function Preview () {
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!user || !postId) return;
    const unsubscribe = onSnapshot(doc(db, 'artifacts', appId, 'users', user.uid, 'posts', postId), (doc) => {
      if (doc.exists()) setPost({ id: doc.id, ...doc.data() });
    });
    return () => unsubscribe();
  }, [user, postId]);

  if (!post) return <div className="flex items-center justify-center h-screen">Loading Webpage...</div>;

  return (
    <div className="min-h-screen bg-white font-serif text-slate-900 selection:bg-yellow-100">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm font-sans text-gray-500 hover:text-slate-900 transition-colors">
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
        <button onClick={() => navigate('/editor', { id: postId })} className="flex items-center gap-2 text-sm font-sans bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800">
          <Edit3 size={14} /> Edit this Post
        </button>
      </nav>

      <article className="pt-24 pb-32">
        <div className="max-w-3xl mx-auto px-6">
          {post.coverImage && (
            <div className="mb-12 rounded-xl overflow-hidden shadow-sm">
               <img src={post.coverImage} alt="Cover" className="w-full h-auto max-h-[500px] object-cover" />
            </div>
          )}
          
          <div className="mb-12 text-center">
             <div className="flex justify-center gap-2 mb-6">
                {post.tags && post.tags.map(tag => (
                  <span key={tag} className="text-xs font-sans uppercase tracking-widest text-gray-500 border border-gray-200 px-3 py-1 rounded-full">{tag}</span>
                ))}
             </div>
             <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{post.title}</h1>
             <div className="flex items-center justify-center gap-4 font-sans text-sm text-gray-500">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Author" />
                 </div>
                 <span>Author</span>
               </div>
               <span>•</span>
               <span>{post.updatedAt ? new Date(post.updatedAt.seconds * 1000).toLocaleDateString() : 'Unknown Date'}</span>
             </div>
          </div>

          <div className="prose prose-lg prose-slate mx-auto">
            {parseMarkdown (post.content)}
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