export default function MaintenancePage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const message = searchParams.message || 'We are performing scheduled maintenance. Please check back soon.';
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#FFCC00] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-10 h-10 text-gray-900" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </div>
        
        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Scheduled Maintenance
        </h1>
        
        {/* Message */}
        <p className="text-gray-600 mb-8">
          {message}
        </p>
        
        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
          System temporarily unavailable
        </div>
        
        {/* Admin link */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">
            Staff access:
          </p>
          <a 
            href="/admin/login"
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium"
          >
            Administrator Login
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-xs text-gray-400">
          c3scan Mail Management System
        </div>
      </div>
    </div>
  );
}
