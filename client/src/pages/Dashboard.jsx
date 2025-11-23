import { 
  Plus, Edit3, Trash2, ExternalLink, ArrowRight,
  Feather
} from 'lucide-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteBlog, getAllBlogs, getBlog } from '../redux/slices/blog.slice';
import { showToast } from '../redux/slices/toast.slice';

function Dashboard () {
  const blogState = useSelector ((state) => state.blog);

  const dispatch = useDispatch ();

  async function getBlogs () {
    try {
        await dispatch (getAllBlogs ());
    } catch (err) {
        dispatch(showToast({ message: 'Blog fetched failed!', type: 'error' }));
    }
  }

  async function delete_blog (slug) {
    try {
        await dispatch (deleteBlog (slug));
    } catch (err) {
        dispatch(showToast({ message: 'Blog could not be deleted!', type: 'error' }));
    }
  }

  useEffect (() => {
    getBlogs ();
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      <nav className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-50">
         <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
            <Feather size={18} /> Loom.
         </div>
         <div className="text-sm text-gray-500">Dashboard</div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Your Stories</h1>
            <p className="text-gray-500">Manage your blog blogs and drafts.</p>
          </div>
          <Link to={'/blog'}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus size={18} /> New Story
          </Link>
        </div>

        {blogState.blogList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Edit3 size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
            <p className="text-gray-500 mb-6">Create your first blog post to get started.</p>
            <Link to={'/blog'} className="text-slate-900 font-medium hover:underline">Write a story</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogState.blogList.map(blog => (
              <div 
                key={blog._id}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {blog.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/blog/${blog.slug}`}
                      className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-blue-600"
                      title="View Live Page"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <button 
                    onClick={() => delete_blog (blog.slug)}
                      className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-2">{blog.title || "Untitled Story"}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                  {blog.content || "No content yet..."}
                </p>
                
                <div className="text-xs text-gray-400 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span>{blog.createdAt ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                  <span className="flex items-center gap-1 group-hover:text-slate-900 transition-colors">Edit <ArrowRight size={12} /></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;