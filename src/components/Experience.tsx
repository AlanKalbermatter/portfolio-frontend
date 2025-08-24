import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { experienceApi } from '../services/api';
import { Experience as ExperienceType } from '../types';

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await experienceApi.getAll();
        // Ensure response.data is an array before sorting
        const experiencesData = Array.isArray(response.data) ? response.data : [];
        // Sort by start date, current positions first
        const sortedExperiences = experiencesData.sort((a, b) => {
          if (a.isCurrent && !b.isCurrent) return -1;
          if (!a.isCurrent && b.isCurrent) return 1;
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
        setExperiences(sortedExperiences);
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setExperiences([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-16"></div>
            <div className="space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-4 h-4 bg-gray-200 rounded-full mt-6"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Work Experience
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            My professional journey and the experiences that have shaped my career.
          </p>
        </motion.div>

        {experiences.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content */}
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} ml-16 md:ml-0`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {experience.position}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            {experience.companyUrl ? (
                              <a
                                href={experience.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                              >
                                {experience.company}
                                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                              </a>
                            ) : (
                              <span className="text-blue-600 font-medium">
                                {experience.company}
                              </span>
                            )}
                          </div>
                        </div>

                        {experience.isCurrent && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Date */}
                      <div className="flex items-center text-gray-600 mb-4">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {formatDate(experience.startDate)} - {' '}
                          {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {experience.description}
                      </p>

                      {/* Responsibilities */}
                      {experience.responsibilities && experience.responsibilities.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Key Responsibilities:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                            {experience.responsibilities.map((responsibility, idx) => (
                              <li key={idx}>{responsibility}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Technologies */}
                      {experience.technologies && experience.technologies.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Technologies Used:</h4>
                          <div className="flex flex-wrap gap-2">
                            {experience.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Experience Found</h3>
            <p className="text-gray-600">
              Work experience will appear here once added to your portfolio.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Experience;
