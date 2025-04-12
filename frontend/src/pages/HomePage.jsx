import { Link } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';
import Hero from '../components/layout/Hero';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
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
  {
    title: 'Career Guidance',
    description: 'AI-powered career assistance',
    icon: ChatBubbleLeftRightIcon,
    link: '/assistant',
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
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Comprehensive solutions for your business needs
            </p>
          </div>
          <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className={`relative rounded-lg p-6 ${
                  service.highlighted
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                {service.link ? (
                  <Link to={service.link} className="block">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <service.icon
                          className={`h-8 w-8 ${
                            service.highlighted ? 'text-white' : 'text-blue-600'
                          }`}
                        />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">{service.title}</h3>
                        <p
                          className={`mt-1 ${
                            service.highlighted ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <service.icon
                        className={`h-8 w-8 ${
                          service.highlighted ? 'text-white' : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">{service.title}</h3>
                      <p
                        className={`mt-1 ${
                          service.highlighted ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
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