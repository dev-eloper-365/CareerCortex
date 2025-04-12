export default function CareerSuggestionsPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Carrer Suggestions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 justify-items-center">
        {/* Foreign Studies Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow w-[350px] h-[461px]">
          <div className="mb-4">
            <img 
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Foreign Studies" 
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-blue-600">Foreign Studies</h2>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Language Proficiency (IELTS/TOEFL)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Academic Research Skills</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Cultural Adaptability</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Time Management</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Critical Thinking</span>
            </li>
          </ul>
        </div>

        {/* Developer Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow w-[350px] h-[461px]">
          <div className="mb-4">
            <img 
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Developer" 
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-green-600">Developer</h2>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Programming Languages (Python, Java, JavaScript)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Web Development (HTML, CSS, React)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Database Management</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Version Control (Git)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Problem Solving</span>
            </li>
          </ul>
        </div>

        {/* Sales Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow w-[350px] h-[461px]">
          <div className="mb-4">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Sales" 
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-purple-600">Sales</h2>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Communication Skills</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Negotiation Techniques</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Customer Relationship Management</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Market Analysis</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Sales Pipeline Management</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 