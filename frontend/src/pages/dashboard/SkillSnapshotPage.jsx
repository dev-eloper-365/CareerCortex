import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import api from '../../utils/api';

export default function SkillSnapshotPage() {
  const barChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const waveChartRef = useRef(null);
  const [chartsInitialized, setChartsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skillsData, setSkillsData] = useState({});
  const [careerData, setCareerData] = useState({
    career1: { title: '', description: '' },
    career2: { title: '', description: '' },
    career3: { title: '', description: '' }
  });

  // Fetch data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token);
      
      try {
        const response = await api.get('/analysis/user/analysis');
        console.log('API Response:', response.data);
        
        setCareerData({
          career1: response.data.analysis.career1 || { title: '', description: '' },
          career2: response.data.analysis.career2 || { title: '', description: '' },
          career3: response.data.analysis.career3 || { title: '', description: '' }
        });
        
        setSkillsData(response.data.analysis.skills || {});
        setError(null);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // If no analysis exists, create a sample one
          console.log('No analysis found, creating sample data...');
          const createResponse = await api.post('/analysis/test/create-analysis');
          console.log('Created sample analysis:', createResponse.data);
          
          // Set the newly created data
          setCareerData({
            career1: createResponse.data.data.analysis.career1,
            career2: createResponse.data.data.analysis.career2,
            career3: createResponse.data.data.analysis.career3
          });
          
          setSkillsData(createResponse.data.data.analysis.skills);
          setError(null);
        } else {
          throw error; // Re-throw other errors to be caught by outer catch
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        if (error.response.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else {
          setError(`Failed to load analysis data: ${error.response.data.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response from server. Please check if the backend is running.');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate average progress for wave chart
  const avgProgress = skillsData ? 
    Object.values(skillsData).reduce((a, b) => a + b, 0) / Object.keys(skillsData).length : 0;

  useEffect(() => {
    if (!chartsInitialized && !loading && Object.keys(skillsData).length > 0) {
      try {
        // Initialize Bar Chart
        const barCtx = barChartRef.current.getContext('2d');
        new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: Object.keys(skillsData),
            datasets: [{
              data: Object.values(skillsData),
              backgroundColor: '#3B82F6',
              borderRadius: 8,
              barThickness: 20
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: {
                max: 10,
                grid: { display: false }
              },
              y: {
                grid: { display: false }
              }
            }
          }
        });

        // Initialize Donut Chart
        const donutCtx = donutChartRef.current.getContext('2d');
        new Chart(donutCtx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(skillsData),
            datasets: [{
              data: Object.values(skillsData),
              backgroundColor: [
                '#3B82F6',
                '#10B981',
                '#F59E0B',
                '#EF4444',
                '#8B5CF6'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  boxWidth: 12,
                  padding: 15
                }
              }
            }
          }
        });

        // Initialize Wave Chart
        const waveCtx = waveChartRef.current.getContext('2d');
        new Chart(waveCtx, {
          type: 'line',
          data: {
            labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            datasets: [{
              data: Array(12).fill(avgProgress).map(val => val + (Math.random() * 20 - 10)),
              borderColor: '#3B82F6',
              tension: 0.4,
              fill: false
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                min: -30,
                max: 30,
                grid: { display: false }
              },
              x: {
                grid: { display: false }
              }
            }
          }
        });

        setChartsInitialized(true);
      } catch (error) {
        console.error('Error initializing charts:', error);
        setError('Failed to initialize charts');
      }
    }
  }, [chartsInitialized, loading, skillsData]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Career Analysis</h1>

      <div className="lg:flex-1">
        <div className="bg-white rounded-lg shadow-md p-6 h-[100%]">
          <div className="flex flex-col space-y-2 mb-6">
            <h2 className="text-2xl font-bold text-blue-600">
              {careerData.career1.title || 'Loading career...'}
            </h2>
            <p className="text-gray-600">
              {careerData.career1.description || 'Loading description...'}
            </p>
          </div>
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Horizontal Bar Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Skill Proficiency</h3>
              <div className="h-[300px]">
                <canvas ref={barChartRef}></canvas>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Distribution</h3>
              <div className="h-[300px]">
                <canvas ref={donutChartRef}></canvas>
              </div>
            </div>

            {/* Wave Chart */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Trend</h3>
              <div className="h-[300px]">
                <canvas ref={waveChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}