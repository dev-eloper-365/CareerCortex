import { Link } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function TopNavigation() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-white">
              CareerCortex
            </Link>
          </div>

          {/* Centered Navigation Links */}
          <div className="hidden sm:flex sm:justify-center sm:flex-1 sm:space-x-8">
            <Link
              to="/dashboard"
              className="text-white hover:text-yellow-300 inline-flex items-center px-3 py-2 text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/quiz"
              className="text-white hover:text-yellow-300 inline-flex items-center px-3 py-2 text-sm font-medium transition-colors"
            >
              Quiz
            </Link>
            <Link
              to="/explore"
              className="text-white hover:text-yellow-300 inline-flex items-center px-3 py-2 text-sm font-medium transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/assistant"
              className="text-white hover:text-yellow-300 inline-flex items-center px-3 py-2 text-sm font-medium transition-colors"
            >
              Smart Bot
            </Link>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/contact"
              className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-white hover:text-black transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/settings"
              className="p-2 rounded-full text-white hover:text-yellow-300 transition-colors"
            >
              <UserCircleIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 