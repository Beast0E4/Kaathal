import { useEffect, useState } from "react";

import { 
  ChevronLeft, User, Mail, Camera, Loader2,
} from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/slices/auth.slice";

function Profile () {
    const authState = useSelector ((state) => state.auth);

    const dispatch = useDispatch ();

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState ("");
  const [formData, setFormData] = useState({
    name: authState.data?.name,
    username: authState.data?.username,
    email: authState.data?.email || '',
    image: authState.data?.image?.url
  });

  const handleSave = async (e) => {
    e.preventDefault();   

    const fd = new FormData();

    fd.append("userId", authState.data?._id);
    fd.append("name", formData.name);
    fd.append("username", formData.username);
    fd.append("email", formData.email);

    if (formData.image instanceof File) {
        fd.append("image", formData.image);
    }

    try {
        await dispatch(updateUser(fd));
    } catch (err) {
        console.error(err);
    }
    };


  const handleImageChange = (event) => {
        const uploadedFile = event.target.files[0];
        setImageUrl(URL.createObjectURL(uploadedFile));
        setFormData ({ ...formData, image: uploadedFile});
    };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      <nav className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-6 sticky top-0 z-50">
         <div className="text-sm font-medium">Profile Settings</div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex items-center gap-6 bg-slate-50/50">
               <div className="relative group">
                   <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-sm">
                       <img 
                         src={imageUrl || formData.image} 
                         alt="Profile" 
                         className="w-full h-full object-cover" 
                       />
                   </div>
                   <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                       <Camera className="text-white" size={24} />
                       <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                   </label>
               </div>
               <div>
                   <h2 className="text-2xl font-bold text-slate-900">{formData.name || 'Anonymous User'}</h2>
                   <p className="text-gray-500">@{formData.username || 'username'}</p>
               </div>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
                       <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all px-3 py-2">
                           <User size={16} className="text-gray-400 mr-2" />
                           <input 
                             type="text" 
                             className="bg-transparent border-none focus:ring-0 w-full text-sm"
                             value={formData.name}
                             onChange={e => setFormData({...formData, name: e.target.value})}
                           />
                       </div>
                   </div>
                   <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Username</label>
                       <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-slate-900/10 transition-all px-3 py-2">
                           <span className="text-gray-400 mr-1 text-sm">@</span>
                           <input 
                             type="text" 
                             className="bg-transparent border-none focus:ring-0 w-full text-sm"
                             value={formData.username}
                             onChange={e => setFormData({...formData, username: e.target.value})}
                           />
                       </div>
                   </div>
               </div>

               <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                   <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 px-3 py-2 opacity-60 cursor-not-allowed">
                       <Mail size={16} className="text-gray-400 mr-2" />
                       <input 
                         type="email" 
                         className="bg-transparent border-none focus:ring-0 w-full text-sm text-gray-500"
                         value={formData.email}
                         disabled
                       />
                   </div>
                   <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed manually.</p>
               </div>

               <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio</label>
                   <textarea 
                       className="w-full bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-slate-900/10 transition-all p-3 text-sm min-h-[100px] resize-none"
                       placeholder="Tell your story..."
                       value={formData.bio}
                       onChange={e => setFormData({...formData, bio: e.target.value})}
                   />
               </div>

               <div className="pt-4 flex items-center justify-end gap-3">
                   <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Cancel</button>
                   <button 
                     type="submit" 
                     disabled={loading}
                     className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-70"
                   >
                       {loading && <Loader2 size={16} className="animate-spin" />}
                       {loading ? 'Saving...' : 'Save Changes'}
                   </button>
               </div>
            </form>
         </div>
      </div>
    </div>
  );
}

export default Profile;