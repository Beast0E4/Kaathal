import { 
  Plus, Edit3, Trash2, ExternalLink, ArrowRight,
  Feather
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { deleteBlog, getAllBlogs } from '../redux/slices/blog.slice';
import { showToast } from '../redux/slices/toast.slice';

function Dashboard () {
    const authState = useSelector ((state) => state.auth);
  const blogState = useSelector ((state) => state.blog);

  const dispatch = useDispatch ();
  const navigate = useNavigate();

  // State for Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  async function getBlogs () {
    try {
        await dispatch (getAllBlogs ());
    } catch (err) {
        dispatch(showToast({ message: 'Blog fetched failed!', type: 'error' }));
    }
  }

  const handleDeleteClick = (slug) => {
    setBlogToDelete(slug);
    setShowDeleteModal(true);
  };

  async function confirmDelete () {
    if (!blogToDelete) return;
    
    try {
        await dispatch (deleteBlog (blogToDelete));
        dispatch(showToast({ message: 'Blog deleted successfully', type: 'success' }));
        setShowDeleteModal(false);
        setBlogToDelete(null);
    } catch (err) {
        dispatch(showToast({ message: 'Blog could not be deleted!', type: 'error' }));
    }
  }

  useEffect (() => {
    getBlogs ();
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 relative">
      {/* Navbar: Adjusted padding for mobile */}
      <nav className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
         <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
            <Feather size={18} /> Kaathal.
         </div>
      </nav>

      {/* Main Content: Adjusted padding */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Header Section: Flex-col on mobile, Flex-row on desktop */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">{authState.isLoggedIn ? 'Your Stories' : 'All Stories'}</h1>
            <p className="text-gray-500 text-sm sm:text-base">{authState.isLoggedIn ? 'Manage your blog blogs and drafts.' : ''}</p>
          </div>
          
          {/* New Story Button: Full width on mobile for better tapping */}
          {authState.isLoggedIn && <Link to={'/blog/edit'}
            className="w-full sm:w-auto justify-center bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New Story
          </Link>}
        </div>

        {blogState.blogList.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Edit3 size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
            <p className="text-gray-500 mb-6">Create your first blog post to get started.</p>
            <Link to={'/blog/edit'} className="text-slate-900 font-medium hover:underline">Write a story</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {blogState.blogList.map(blog => (
              <div 
                key={blog._id}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700`}>
                    'Published'
                  </span>
                  
                  {/* Action Buttons: Visible by default on mobile (opacity-100), hidden until hover on desktop (sm:opacity-0) */}
                  <div className="flex gap-2 opacity-100 sm:group-hover:opacity-100 transition-opacity">
                    <Link to={`/blog/${blog.slug}`}
                      className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600"
                      title="View Live Page"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    {authState.isLoggedIn && <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleDeleteClick(blog.slug);
                      }}
                      className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>}
                  </div>
                </div>
                
                <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-2">{blog.title || "Untitled Story"}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                  {blog.content || "No content yet..."}
                </p>
                
                <div className="text-xs text-gray-400 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span>{blog?.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })
                    : 'Unknown Date'}</span>
                  {authState.isLoggedIn && <Link to={`/blog/edit/${blog?.slug}`} className="flex items-center gap-1 group-hover:text-slate-900 transition-colors">Edit <ArrowRight size={12} /></Link>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden scale-100 animation-fade-in">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <Trash2 size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete this story?</h3>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Are you sure you want to delete this blog? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;