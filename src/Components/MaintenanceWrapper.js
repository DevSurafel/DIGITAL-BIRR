import React from 'react';
import { X, FrownIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// This component will wrap your entire app
const MaintenanceWrapper = ({ children, isInMaintenance = true }) => {
  // If not in maintenance, render children normally
  if (!isInMaintenance) {
    return children;
  }

  // Optional: You can define specific routes/paths that should bypass maintenance mode
  const allowedPaths = ['/admin', '/login'];
  const currentPath = window.location.pathname;
  
  if (allowedPaths.includes(currentPath)) {
    return children;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/95 text-slate-100 relative">
        <CardContent className="pt-12 pb-8 px-6 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-lg">
              <span>Under Development</span>
              <FrownIcon className="h-6 w-6 text-yellow-400" />
            </div>

            <p className="text-lg">
              Our website is currently under development. We'll be back soon with something amazing!
            </p>

            {/* Optional: Add an estimated time or contact information */}
            <p className="text-sm text-slate-400">
              Expected completion: [Your Timeline]
            </p>
            
            {/* Optional: Add contact information or alternative ways to reach you */}
            <div className="text-sm text-slate-400">
              Need immediate assistance? 
              <a href="mailto:your@email.com" className="text-blue-400 hover:text-blue-300 ml-1">
                Contact us
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceWrapper;
