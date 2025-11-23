import { 
  Eye, Globe, ArrowRight,
  Feather, Zap,  PenTool,
} from 'lucide-react';
import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom'

function Home () {
    const authState = useSelector ((state) => state.auth);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-black selection:text-white flex flex-col">
      <nav className="px-6 h-20 flex items-center justify-between border-b border-gray-100 w-full">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="bg-black text-white p-1 rounded-md"><Feather size={18} /></div>
          Loom.
        </div>
        <div className="flex items-center gap-6">
          <Link to={'/dashboard'}
            className="text-sm font-medium bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all"
          >
            Dashboard
          </Link>
          <Link to={'/profile'}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-600 shadow-md"
            >
            <img src={authState.data?.image?.url} className='w-10 h-10'></img>
            </Link>
        </div>
      </nav>

      <header className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="mb-6 p-3 bg-gray-50 rounded-full inline-flex items-center justify-center text-slate-500">
           <PenTool size={24} />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
          Just you and your words.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
          A minimalist publishing platform designed for focus. No ads, no distractions, just a clean canvas for your ideas.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto">
           <Link to={'/dashboard'} className="bg-black text-white px-8 py-4 rounded-xl text-lg font-medium hover:scale-105 transition-transform w-full flex items-center justify-center gap-2 shadow-xl shadow-gray-200">
             Start Writing Now <ArrowRight size={18} />
           </Link>
        </div>
      </header>

      <section className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="text-left">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Zap size={18} /> Lightning Fast</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Built on a modern stack for instant loading. Your readers won't wait.</p>
           </div>
           <div className="text-left">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Eye size={18} /> Live Preview</h3>
              <p className="text-sm text-gray-500 leading-relaxed">See exactly how your story looks before you publish. WYSIWYG done right.</p>
           </div>
           <div className="text-left">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Globe size={18} /> SEO Ready</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Clean HTML structure and meta tags generated automatically for better reach.</p>
           </div>
        </div>
      </section>

      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <div className="flex items-center gap-2 font-bold text-black tracking-tighter mb-4 md:mb-0">Loom.</div>
          <p>© 2024 Loom Platform.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;