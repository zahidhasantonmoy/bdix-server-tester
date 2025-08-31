"use client";

import { useState } from 'react';
import { FiBook, FiGlobe, FiWifi, FiInfo, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function BDIXGuide({ darkMode }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const guideSections = [
    {
      id: 'what-is-bdix',
      title: 'What is BDIX?',
      icon: <FiInfo className="text-blue-500" />,
      content: (
        <div className="space-y-3">
          <p>
            BDIX stands for Bangladesh Internet Exchange. It's a network infrastructure that allows 
            Internet Service Providers (ISPs) in Bangladesh to exchange local internet traffic 
            directly without using international bandwidth.
          </p>
          <p>
            This means when you access local content (like movies, software, or websites hosted 
            in Bangladesh), the data travels directly within the country instead of going 
            through international routes, resulting in faster speeds and better performance.
          </p>
        </div>
      )
    },
    {
      id: 'how-it-works',
      title: 'How BDIX Works',
      icon: <FiGlobe className="text-green-500" />,
      content: (
        <div className="space-y-3">
          <p>
            BDIX works by connecting multiple ISPs and content providers to a central exchange point:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Content providers host their servers locally in Bangladesh</li>
            <li>ISPs connect to the BDIX exchange point</li>
            <li>Local traffic is routed directly between ISPs without international transit</li>
            <li>Users get faster access to local content with reduced latency</li>
          </ul>
          <p>
            This system reduces international bandwidth costs and improves user experience 
            for accessing local content.
          </p>
        </div>
      )
    },
    {
      id: 'benefits',
      title: 'Benefits of BDIX',
      icon: <FiWifi className="text-purple-500" />,
      content: (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Faster Speeds:</strong> Access local content at maximum speed without international bottlenecks</li>
            <li><strong>Lower Costs:</strong> ISPs save on international bandwidth costs</li>
            <li><strong>Better Reliability:</strong> Reduced dependency on international links</li>
            <li><strong>Improved Experience:</strong> Seamless access to local movies, software, and services</li>
            <li><strong>Local Economy:</strong> Promotes local content creation and hosting</li>
          </ul>
        </div>
      )
    },
    {
      id: 'testing-tips',
      title: 'BDIX Testing Tips',
      icon: <FiBook className="text-orange-500" />,
      content: (
        <div className="space-y-3">
          <p>
            When testing BDIX connectivity, keep these tips in mind:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Test During Peak Hours:</strong> Check connectivity when network usage is highest</li>
            <li><strong>Multiple Tests:</strong> Run tests multiple times for accurate results</li>
            <li><strong>Clear Cache:</strong> Clear browser cache before testing for fresh results</li>
            <li><strong>Direct Connection:</strong> Test with a direct ISP connection, not through proxies</li>
            <li><strong>Check URLs:</strong> Some servers may have multiple URLs - test all available</li>
          </ul>
          <p>
            Remember: If servers show as "Online" in this test, you have direct BDIX access to 
            that content. "Offline" means the content is not accessible via BDIX from your network.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className={`rounded-xl shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center mb-4">
        <FiBook className={`text-xl mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          BDIX Guide & Information
        </h3>
      </div>
      
      <div className="space-y-3">
        {guideSections.map((section) => (
          <div 
            key={section.id}
            className={`rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <button
              onClick={() => toggleSection(section.id)}
              className={`w-full p-4 text-left flex justify-between items-center rounded-lg ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">{section.icon}</span>
                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {section.title}
                </span>
              </div>
              {expandedSection === section.id ? (
                <FiChevronUp className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
              ) : (
                <FiChevronDown className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
              )}
            </button>
            
            {expandedSection === section.id && (
              <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {section.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className={`mt-4 p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
        <strong>Pro Tip:</strong> BDIX connectivity can vary by ISP and location. 
        Regular testing helps ensure you're getting the best local content experience.
      </div>
    </div>
  );
}