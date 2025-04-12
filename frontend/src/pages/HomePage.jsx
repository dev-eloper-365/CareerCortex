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
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* ====================== SECTION 1: HERO VIDEO ====================== */}
      <Hero />
      
      {/* ====================== SECTION 2: COMPANY LOGOS ====================== */}
      <div className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-16 md:grid-cols-5 lg:grid-cols-5">
            {/* Google Logo */}
            <div className="col-span-1 flex items-center justify-center space-x-3">
              <div className="h-16 flex items-center">
                <img
                  src="/logos/google.svg"
                  alt="Google"
                  className="h-8 w-auto text-gray-400 fill-current"
                />
              </div>
              <p className="text-gray-400 text-xl font-bold">Google</p>
            </div>
            {/* Meta Logo */}
            <div className="col-span-1 flex items-center justify-center space-x-3">
              <div className="h-16 flex items-center">
                <img
                  src="/logos/meta.svg"
                  alt="Meta"
                  className="h-8 w-auto text-gray-400 fill-current"
                />
              </div>
              <p className="text-gray-400 text-xl font-bold">Meta</p>
            </div>
            {/* Amazon Logo */}
            <div className="col-span-1 flex items-center justify-center space-x-3">
              <div className="h-16 flex items-center">
                <img
                  src="/logos/amazon.svg"
                  alt="Amazon"
                  className="h-8 w-auto text-gray-400 fill-current"
                />
              </div>
              <p className="text-gray-400 text-xl font-bold">Amazon</p>
            </div>
            {/* Netflix Logo */}
            <div className="col-span-1 flex items-center justify-center space-x-3">
              <div className="h-16 flex items-center">
                <img
                  src="/logos/netflix.svg"
                  alt="Netflix"
                  className="h-8 w-auto text-gray-400 fill-current"
                />
              </div>
              <p className="text-gray-400 text-xl font-bold">Netflix</p>
            </div>
            {/* Goldman Sachs Logo */}
            <div className="col-span-1 flex items-center justify-center space-x-3">
              <div className="h-16 flex items-center">
                <img
                  src="/logos/goldman.svg"
                  alt="Goldman Sachs"
                  className="h-8 w-auto text-gray-400 fill-current"
                />
              </div>
              <p className="text-gray-400 text-xl font-bold">Goldman Sachs</p>
            </div>
          </div>
        </div>
      </div>

      {/* ====================== SECTION 3: TAILORED SOLUTIONS ====================== */}
      <div className="py-12 bg-white">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Tailored Solutions for Your Success
            </h2>
            <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
              Empowering your career journey with comprehensive solutions and expert guidance
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className={`relative group bg-white p-8 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-xl transition-all duration-200 ${
                    service.highlighted ? 'bg-yellow-50' : ''
                  }`}
                >
                  <div>
                    <span className="rounded-xl inline-flex p-4 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                      <service.icon className="h-8 w-8" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold">
                      <Link to="/services" className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {service.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-base text-gray-500 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <span
                    className="pointer-events-none absolute top-8 right-8 text-gray-300 group-hover:text-gray-400"
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

      {/* ====================== SECTION 4: PROVEN METHODOLOGY ====================== */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl mb-8 md:text-5xl font-extrabold text-gray-900">
              Our Proven Methodology<br />
              for Success
            </h2>
            <p className="mt-10 text-xl text-gray-500 max-w-3xl mx-auto">
              A systematic approach to transform your career aspirations into reality
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {methodology.map((step, index) => (
                <div
                  key={step.step}
                  className={`relative group p-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1
                    ${index === 0 ? 'bg-blue-100' : ''} 
                    ${index === 1 ? 'bg-purple-100' : ''} 
                    ${index === 2 ? 'bg-indigo-100' : ''} 
                    ${index === 3 ? 'bg-violet-100' : ''}`}
                >
                  <div className="flex flex-col items-start">
                    <span className={`text-3xl font-bold mb-4 
                      ${index === 0 ? 'text-blue-700' : ''} 
                      ${index === 1 ? 'text-purple-700' : ''} 
                      ${index === 2 ? 'text-indigo-700' : ''} 
                      ${index === 3 ? 'text-violet-700' : ''}`}>
                      {step.step}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                    <div className={`w-12 h-1 mb-4 
                      ${index === 0 ? 'bg-blue-700' : ''} 
                      ${index === 1 ? 'bg-purple-700' : ''} 
                      ${index === 2 ? 'bg-indigo-700' : ''} 
                      ${index === 3 ? 'bg-violet-700' : ''}`}></div>
                    <p className="text-base text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 