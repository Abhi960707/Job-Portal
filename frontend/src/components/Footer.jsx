import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">
            <span className="text-[#F83002]">Job</span>
            <span className="text-[#6A38C2]">Portal</span>
          </h2>
          <p className="mt-3 text-sm leading-6">
            Find your dream job with trusted companies.  
            Build your career with confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
            <li><Link to="/jobs" className="hover:text-purple-400 transition-colors">Jobs</Link></li>
            <li><Link to="/browse" className="hover:text-purple-400 transition-colors">Browse</Link></li>
          </ul>
        </div>

        {/* Job Seekers */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Job Seekers
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/jobs" className="hover:text-purple-400 transition-colors">Browse Jobs</Link></li>
            <li><Link to="/profile" className="hover:text-purple-400 transition-colors">Upload Resume</Link></li>
            <li><Link to="/profile" className="hover:text-purple-400 transition-colors">Profile</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Contact Us
          </h3>
          <p className="text-sm hover:text-white transition-colors"><a href="mailto:abhi@jobportal.com">Email: abhi@jobportal.com</a></p>
          <p className="text-sm mt-1 hover:text-white transition-colors"><a href="tel:+919665898888">Phone: +91 9665898888</a></p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} Job Portal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
