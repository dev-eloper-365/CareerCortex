import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function JobApplyPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // In a real application, you would fetch this data from your backend API
        // const response = await axios.get('/api/jobs');
        // setJobs(response.data);
        
        // Mock data with more comprehensive information
        const mockJobs = [
          {
            id: 1,
            job_title: "International Student Advisor",
            employer_name: "Harvard University",
            category: "foreign_studies",
            location: "Cambridge, MA",
            salary_range: "$60,000 - $80,000",
            job_type: "Full-time",
            description: "Support international students with academic guidance, visa processing, and cultural adaptation. Help students navigate through the admission process and provide ongoing support throughout their academic journey.",
            requirements: ["Master's degree in Education or related field", "3+ years experience in international education", "Knowledge of visa regulations"],
            logo_url: "https://logo.clearbit.com/harvard.edu",
            job_apply_link: "https://careers.harvard.edu"
          },
          {
            id: 2,
            job_title: "Study Abroad Coordinator",
            employer_name: "Stanford University",
            category: "foreign_studies",
            location: "Stanford, CA",
            salary_range: "$55,000 - $75,000",
            job_type: "Full-time",
            description: "Coordinate study abroad programs, assist students with program selection, and manage partnerships with international institutions. Provide pre-departure orientation and support throughout the study abroad experience.",
            requirements: ["Bachelor's degree in International Relations", "Experience in study abroad programs", "Strong organizational skills"],
            logo_url: "https://logo.clearbit.com/stanford.edu",
            job_apply_link: "https://careers.stanford.edu"
          },
          {
            id: 3,
            job_title: "Senior Software Engineer",
            employer_name: "Google",
            category: "developer",
            location: "Mountain View, CA",
            salary_range: "$150,000 - $200,000",
            job_type: "Full-time",
            description: "Design and build advanced applications for the Google platform. Work on complex problems involving information retrieval, distributed computing, and large-scale system design.",
            requirements: ["BS/MS in Computer Science", "5+ years experience in software development", "Strong coding skills in Java/Python"],
            logo_url: "https://logo.clearbit.com/google.com",
            job_apply_link: "https://careers.google.com"
          },
          {
            id: 4,
            job_title: "Sales Director",
            employer_name: "Microsoft",
            category: "sales",
            location: "Redmond, WA",
            salary_range: "$120,000 - $180,000",
            job_type: "Full-time",
            description: "Lead and develop the sales strategy for enterprise solutions. Build and maintain relationships with key clients while managing and mentoring the sales team.",
            requirements: ["10+ years in enterprise sales", "Proven track record of hitting targets", "Strong leadership skills"],
            logo_url: "https://logo.clearbit.com/microsoft.com",
            job_apply_link: "https://careers.microsoft.com"
          }
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load job listings. Please try again later.');
        toast.error('Failed to load job listings');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search query and selected career
  useEffect(() => {
    let filtered = jobs;
    
    // Filter by career if not 'all'
    if (selectedCareer !== 'all') {
      filtered = filtered.filter(job => job.category === selectedCareer);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job => 
        job.job_title.toLowerCase().includes(query) ||
        job.employer_name.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredJobs(filtered);
  }, [jobs, searchQuery, selectedCareer]);

  const handleApply = (jobApplyLink) => {
    window.open(jobApplyLink, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Available Jobs</h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Career Filter */}
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Careers</option>
              <option value="foreign_studies">Foreign Studies</option>
              <option value="developer">Developer</option>
              <option value="sales">Sales</option>
            </select>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={job.logo_url}
                      alt={`${job.employer_name} logo`}
                      className="w-12 h-12 object-contain rounded-md"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/48?text=' + job.employer_name.charAt(0);
                      }}
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900">{job.job_title}</h2>
                      <p className="text-gray-600">{job.employer_name}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{job.job_type}</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{job.salary_range}</span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">{job.location}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900">Key Requirements:</h3>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {job.requirements.slice(0, 2).map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => handleApply(job.job_apply_link)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 