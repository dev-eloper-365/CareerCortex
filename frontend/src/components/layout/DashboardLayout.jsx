import TopNavigation from './TopNavigation';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavigation />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 md:pl-64">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 