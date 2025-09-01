"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFacebook, FiLinkedin, FiGithub, FiGlobe, FiCode, FiZap, FiDatabase, FiCpu } from 'react-icons/fi';

export default function DeveloperInfo({ darkMode = false }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the component after a short delay for a nice entrance effect
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/zahidhasantonmoybd",
      icon: <FiFacebook className="text-blue-600" />,
      color: "hover:text-blue-600"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/zahidhasantonmoy/",
      icon: <FiLinkedin className="text-blue-700" />,
      color: "hover:text-blue-700"
    },
    {
      name: "GitHub",
      url: "https://github.com/zahidhasantonmoy",
      icon: <FiGithub className="text-gray-900 dark:text-gray-300" />,
      color: "hover:text-gray-900 dark:hover:text-gray-300"
    },
    {
      name: "Portfolio",
      url: "https://zahidhasantonmoy.vercel.app",
      icon: <FiGlobe className="text-purple-600" />,
      color: "hover:text-purple-600"
    }
  ];

  const skills = [
    { name: "Full Stack Development", icon: <FiCode /> },
    { name: "Cloud Architecture", icon: <FiDatabase /> },
    { name: "Performance Optimization", icon: <FiZap /> },
    { name: "System Design", icon: <FiCpu /> }
  ];

  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-40 ${isVisible ? 'block' : 'hidden'}`}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <div className={`relative rounded-2xl shadow-2xl p-6 max-w-xs ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} backdrop-blur-lg bg-opacity-90`}>
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 blur-sm"></div>
        
        <div className="relative">
          {/* Header */}
          <motion.div 
            className="flex items-center mb-4"
            variants={itemVariants}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">Z</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div className="ml-4">
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>Zahid Hasan Tonmoy</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Senior Developer</p>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div 
            className="grid grid-cols-2 gap-2 mb-4"
            variants={itemVariants}
          >
            {skills.map((skill, index) => (
              <div 
                key={index}
                className={`flex items-center p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                <div className="text-blue-500 mr-2">{skill.icon}</div>
                <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{skill.name}</span>
              </div>
            ))}
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex justify-between"
            variants={itemVariants}
          >
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${link.color} transition-colors duration-300`}
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div 
            className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700"
            variants={itemVariants}
          >
            <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Crafting digital experiences with precision
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}