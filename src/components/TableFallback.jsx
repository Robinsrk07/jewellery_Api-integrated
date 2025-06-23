import { AlertTriangle, Shield, RefreshCw, HelpCircle, Lock, Eye } from 'lucide-react';
import { useState } from 'react';

export default function TableFallback() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Simulate retry action
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  return (
    <div className="min-h-[400px] bg-white  border border-gray-200 rounded-xl shadow-lg overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="relative flex flex-col items-center justify-center h-full" style={{ padding: '40px 20px' }}>
        {/* Animated Icon Container */}
        <div className="relative" style={{ marginBottom: '32px' }}>
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full shadow-lg border-4 border-white">
            <Shield className="w-10 h-10 text-amber-600" />
          </div>
          <div className="absolute -top-1 -right-1 flex items-center justify-center w-8 h-8 bg-red-500 rounded-full shadow-md">
            <Lock className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Header with subtle animation */}
        <div className="text-center" style={{ marginBottom: '24px' }}>
          <h2 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '8px' }}>
            Access Restricted
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto" />
        </div>

        {/* Enhanced Message */}
        <div className="text-center max-w-lg" style={{ marginBottom: '32px' }}>
          <p className="text-gray-600 leading-relaxed text-lg" style={{ marginBottom: '16px' }}>
            You don't have the required permissions to view Item Types. This content is restricted based on your current access level.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Eye className="w-4 h-4" />
            <span>Contact your administrator for access</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Checking...' : 'Try Again'}
          </button>
          
          <button className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 transition-all duration-200 transform hover:scale-105 shadow-md">
            <HelpCircle className="w-4 h-4" />
            Get Help
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-400" style={{ marginTop: '24px' }}>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span>Error Code: 403 - Forbidden Access</span>
        </div>

        {/* Subtle Footer */}
        <div className="text-center text-xs text-gray-400" style={{ marginTop: '20px' }}>
          If you believe this is an error, please contact support
        </div>
      </div>
    </div>
  );
}

