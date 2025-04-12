import { Link } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';
import Hero from '../components/layout/Hero';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const services = [
  {
    title: 'Strategic Planning',
    description: 'Drive sustainable growth',
    icon: ChartBarIcon,
  },
  {
    title: 'Financial Advisory',
    description: 'Optimize financial decisions',
    icon: CurrencyDollarIcon,
    highlighted: true,
  },
  {
    title: 'Market Research',
    description: 'Data-driven insights',
    icon: MagnifyingGlassIcon,
  },
  {
    title: 'HR Management',
    description: 'Talent solutions',
    icon: UserGroupIcon,
  },
];

const methodology = [
  {
    step: '01',
    title: 'Discovery',
    description: 'Comprehensive assessment of your current situation and goals',
  },
  {
    step: '02',
    title: 'Analysis',
    description: 'In-depth analysis of data and market trends',
  },
  {
    step: '03',
    title: 'Strategy',
    description: 'Customized strategy development',
  },
  {
    step: '04',
    title: 'Implementation',
    description: 'Efficient execution of planned strategies',
  },
  {
    step: '05',
    title: 'Optimization',
    description: 'Continuous improvement and optimization',
  },
  {
    step: '06',
    title: 'Evaluation',
    description: 'Regular performance assessment',
  },
  {
    step: '07',
    title: 'Advisory',
    description: 'Ongoing consultation and support',
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      <Hero />
      
      {/* Logo Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-16 md:grid-cols-5 lg:grid-cols-5">
            {/* Google Logo */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="h-16 flex items-center">
                <img
                  src="/logos/google.svg"
                  alt="Google"
                  className="h-8 w-auto text-gray-400"
                />
              </div>
              <p className="mt-3 text-gray-400 text-sm">Google</p>
            </div>
            {/* Meta Logo */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="h-16 flex items-center">
                <img
                  src="/logos/meta.svg"
                  alt="Meta"
                  className="h-8 w-auto text-gray-400"
                />
              </div>
              <p className="mt-3 text-gray-400 text-sm">Meta</p>
            </div>
            {/* Amazon Logo */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="h-16 flex items-center">
                <img
                  src="/logos/amazon.svg"
                  alt="Amazon"
                  className="h-8 w-auto text-gray-400"
                />
              </div>
              <p className="mt-3 text-gray-400 text-sm">Amazon</p>
            </div>
            {/* Netflix Logo */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="h-16 flex items-center">
                <img
                  src="/logos/netflix.svg"
                  alt="Netflix"
                  className="h-8 w-auto text-gray-400"
                />
              </div>
              <p className="mt-3 text-gray-400 text-sm">Netflix</p>
            </div>
            {/* Goldman Sachs Logo */}
            <div className="col-span-1 flex flex-col items-center justify-center">
              <div className="h-16 flex items-center">
                <img
                  src="/logos/goldman.svg"
                  alt="Goldman Sachs"
                  className="h-8 w-auto text-gray-400"
                />
              </div>
              <p className="mt-3 text-gray-400 text-sm">Goldman Sachs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Tailored Solutions for Your Success
            </h2>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className={`relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg transition-all duration-200 ${
                    service.highlighted ? 'bg-yellow-50' : ''
                  }`}
                >
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                      <service.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-medium">
                      <Link to="/services" className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {service.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {service.description}
                    </p>
                  </div>
                  <span
                    className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                    aria-hidden="true"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Our Proven Methodology<br />
              for Success
            </h2>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {methodology.map((step) => (
                <div
                  key={step.step}
                  className="relative group bg-white p-6 rounded-lg transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-indigo-600 mr-3">
                      {step.step}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 