import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export default function SkillSnapshotPage() {
  const barChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const waveChartRef = useRef(null);
  const [chartsInitialized, setChartsInitialized] = useState(false);

  // Sample data for user's skill progress
  const skillProgress = {
    languageProficiency: 75,
    academicResearch: 60,
    culturalAdaptability: 90,
    timeManagement: 45,
    criticalThinking: 80
  };

  // Calculate average progress for wave chart
  const avgProgress = Object.values(skillProgress).reduce((a, b) => a + b, 0) / Object.keys(skillProgress).length;

  useEffect(() => {
    if (!chartsInitialized && barChartRef.current && donutChartRef.current && waveChartRef.current) {
      try {
        // Initialize Bar Chart
        const barCtx = barChartRef.current.getContext('2d');
        new Chart(barCtx, {
          type: 'bar',
          data: {
            labels: [
              'Language',
              'Research Skills',
              'Cultural Adaptability',
              'Time Management',
              'Critical Thinking'
            ],
            datasets: [{
              data: [
                skillProgress.languageProficiency,
                skillProgress.academicResearch,
                skillProgress.culturalAdaptability,
                skillProgress.timeManagement,
                skillProgress.criticalThinking
              ],
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
                max: 100,
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
            labels: [
              'Language Proficiency',
              'Academic Research',
              'Cultural Adaptability',
              'Time Management',
              'Critical Thinking'
            ],
            datasets: [{
              data: [
                skillProgress.languageProficiency,
                skillProgress.academicResearch,
                skillProgress.culturalAdaptability,
                skillProgress.timeManagement,
                skillProgress.criticalThinking
              ],
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
                min: 0,
                max: 100,
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
      }
    }
  }, [chartsInitialized]);

  return (
    <div className="w-full min-h-screen bg-gray-50" >
      
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Carrer Suggestions</h1>

        <div className="lg:flex-1">
          <div className="bg-white rounded-lg shadow-md p-6 h-[100%]" >
            <h2 className="text-2xl font-bold text-blue-600 mb-6">Foreign Studies</h2>
            
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