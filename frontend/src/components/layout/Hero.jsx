import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TopNavigation from './TopNavigation';

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Force reload the video and prevent caching
      videoRef.current.load();
      // Set cache control headers
      const currentSrc = videoRef.current.getElementsByTagName('source')[0];
      currentSrc.src = `/videos/hero-background.mp4?t=${new Date().getTime()}`;
    }
  }, []); // Run once when component mounts

  return (
    <div className="relative h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
          style={{ filter: 'brightness(0.7)' }}
        >
          <source src={`/videos/hero-background.mp4?t=${new Date().getTime()}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <TopNavigation />

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center h-full bg-black bg-opacity-50">
        <div className="max-w-[90%] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1200px]">
            <h1 className="text-[64px] leading-[1.1] sm:text-[72px] md:text-[86px] lg:text-[96px] font-display font-semibold text-white tracking-[-0.02em] mb-8">
              Obviously, <br />we have a
              {/* <br /> */}
              <span className="text-[#F9A600]"> crystal ball.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl font-light">
              We'll help you Succeed<br />
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              {/* <Link
                to="/services"
                className="inline-flex items-center px-8 py-4 text-lg font-normal rounded-md text-black bg-yellow-400 hover:bg-yellow-500 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center px-8 py-4 text-lg font-normal rounded-md text-white border-2 border-white hover:bg-white hover:text-black transition-colors"
              >
                Learn More
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 