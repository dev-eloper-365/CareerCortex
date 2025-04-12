export default function CareerSuggestionsPage() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Career Suggestions</h1>
      <p className="text-gray-600 mb-8">Explore these high-demand career paths based on current market trends</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-18 justify-items-center">
        {/* Foreign Studies Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow w-[350px]">
          <div className="mb-4">
            <img 
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Foreign Studies" 
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-blue-600 mb-3">Foreign Studies</h2>
            <p className="text-gray-600 mb-4">
              Pursue education abroad to gain international exposure, diverse perspectives, and globally recognized qualifications.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Salary Range:</h3>
              <p className="text-gray-600">$60,000 - $120,000</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Key Skills:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Language Proficiency</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Research Skills</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Cultural Adaptability</span>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow w-[350px]">
          <div className="mb-4">
            <img 
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Developer" 
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-green-600 mb-3">Developer</h2>
            <p className="text-gray-600 mb-4">
              Design and build applications and systems that power the modern world. Specialize in web, mobile, or AI development.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Salary Range:</h3>
              <p className="text-gray-600">$70,000 - $150,000</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Key Skills:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Programming</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Web Development</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Problem Solving</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Card */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow w-[350px]">
          <div className="mb-4">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Sales" 
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-purple-600 mb-3">Sales</h2>
            <p className="text-gray-600 mb-4">
              Drive business growth through strategic sales planning, relationship building, and market analysis.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Salary Range:</h3>
              <p className="text-gray-600">$55,000 - $120,000</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Key Skills:</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Communication</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Negotiation</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Sales Strategy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 