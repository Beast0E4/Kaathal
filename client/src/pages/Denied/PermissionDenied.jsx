import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PermissionDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
      <div className="bg-red-50 p-4 rounded-full mb-6 animate-bounce">
        <ShieldAlert size={64} className="text-red-500" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Access Denied</h1>
      <p className="text-gray-500 max-w-md mb-8">
        You do not have permission to view this page. Please log in to access this content.
      </p>

      <div className="flex gap-4">
        <Link to={'/dashboard'}
          className="flex items-center hover:cursor-pointer gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PermissionDenied;