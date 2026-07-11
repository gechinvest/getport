import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import VideoEditor from '../assets/Video-editor.png';
import Inuproject from '../assets/inu.png';
import Hotel from '../assets/hotel-booking.png';
import { usePortfolio } from '../context/PortfolioContext';

const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [activeFilter, setActiveFilter] = useState('all');
  const { portfolioData, loading } = usePortfolio();

  const defaultProjects = [
    {
      id: 1,
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website built with React and Supabase.',
      image: '',
      tags: ['React', 'Supabase', 'Tailwind CSS'],
      category: 'frontend',
      liveUrl: '',
      githubUrl: ''
    },
    {
      id: 2,
      title: 'Secure Chat App',
      description: 'End-to-end encrypted chat application with real-time messaging.',
      image: '',
      tags: ['React', 'Node.js', 'Socket.io', 'AES-256'],
      category: 'fullstack',
      liveUrl: '',
      githubUrl: ''
    },
    {
      id: 3,
      title: 'E-Commerce Dashboard',
      description: 'Analytics dashboard for e-commerce businesses with real-time data.',
      image: '',
      tags: ['React', 'Chart.js', 'Express', 'MongoDB'],
      category: 'fullstack',
      liveUrl: '',
      githubUrl: ''
    }
  ];

  const projects = portfolioData?.projects || defaultProjects;

  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'fullstack', label: 'Fullstack' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  if (loading) {
    return (
      <section id="projects" ref={ref} className="py-20 bg-white/80 dark:bg-dark-300/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={ref} className="py-20 bg-white/80 dark:bg-dark-300/80 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              My <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Here are some of my recent works that showcase my skills and experience 
              in web development.
            </p>
          </div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'glass text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-dark-200/50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => {
              let projectImage = project.image;
              if (!projectImage) {
                if (index === 0) projectImage = VideoEditor;
                else if (index === 1) projectImage = Inuproject;
                else projectImage = Hotel;
              }
              
              return (
                <motion.div
                  key={project.id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass rounded-2xl overflow-hidden group"
                >
                  {/* Project Image */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={projectImage}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                      {project.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(project.tags || []).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-center py-2 rounded-lg transition-all duration-300"
                        >
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 glass text-gray-700 dark:text-gray-300 text-center py-2 rounded-lg hover:bg-white/50 dark:hover:bg-dark-200/50 transition-all duration-300"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* View More Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <a
              href="#contact"
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg transition-all inline-block"
            >
              View More Projects
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;