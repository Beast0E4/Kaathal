import React from 'react';
import { FileQuestion, ArrowLeft } from 'lucide-react'; // Using your icon set
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
      <div className="bg-gray-100 p-4 rounded-full mb-6">
        <FileQuestion size={64} className="text-gray-400" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 max-w-md mb-8">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>

      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg"
      >
        <ArrowLeft size={18} />
        Go Home
      </button>
    </div>
  );
};

export default NotFound;