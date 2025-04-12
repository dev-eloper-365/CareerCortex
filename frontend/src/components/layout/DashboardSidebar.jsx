import { Link, useLocation } from 'react-router-dom';
import {
  ChartBarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Skill Snapshot', href: '/dashboard/skills', icon: ChartBarIcon },
  { name: 'Career Suggestions', href: '/dashboard/careers', icon: BriefcaseIcon },
  { name: 'Skill Gap Analysis', href: '/dashboard/gaps', icon: ArrowTrendingUpIcon },
  { name: 'Resume Center', href: '/dashboard/resume', icon: DocumentTextIcon },
  { name: 'Interview Prep', href: '/dashboard/interview', icon: UserGroupIcon },
  { name: 'Networking Zone', href: '/dashboard/networking', icon: UserGroupIcon },
  { name: 'Progress Tracker', href: '/dashboard/progress', icon: ChartPieIcon },
];

export default function DashboardSidebar() {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
} 