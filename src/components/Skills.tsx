import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { skillsApi } from '../services/api';
import { Skill } from '../types';

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await skillsApi.getAll();
        // Ensure response.data is an array before setting skills
        const skillsData = Array.isArray(response.data) ? response.data : [];
        setSkills(skillsData);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setSkills([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Group skills by category - ensure skills is an array before using reduce
  const skillsByCategory = Array.isArray(skills) ? skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>) : {};

  const categories = ['all', ...Object.keys(skillsByCategory)];
  const filteredSkills = selectedCategory === 'all' ? skills : skillsByCategory[selectedCategory] || [];

  const getSkillColor = (level: number) => {
    if (level >= 8) return 'bg-green-500';
    if (level >= 6) return 'bg-blue-500';
    if (level >= 4) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getSkillLevel = (level: number) => {
    if (level >= 8) return 'Expert';
    if (level >= 6) return 'Advanced';
    if (level >= 4) return 'Intermediate';
    return 'Beginner';
  };

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-16"></div>
            <div className="flex justify-center mb-8 space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded w-24"></div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Skills & Technologies
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The technologies and tools I use to bring ideas to life.
          </p>
        </motion.div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex bg-white rounded-lg shadow-md p-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-center space-y-4">
                  {/* Skill Icon/Name */}
                  <div className="relative">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {skill.name}
                    </h3>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {skill.category}
                    </span>
                  </div>

                  {/* Skill Level Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Proficiency</span>
                      <span className={`font-medium ${
                        skill.proficiencyLevel >= 8 ? 'text-green-600' :
                        skill.proficiencyLevel >= 6 ? 'text-blue-600' :
                        skill.proficiencyLevel >= 4 ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {getSkillLevel(skill.proficiencyLevel)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiencyLevel * 10}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className={`h-2 rounded-full ${getSkillColor(skill.proficiencyLevel)}`}
                      ></motion.div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        {skill.proficiencyLevel}/10
                      </span>
                    </div>
                  </div>

                  {/* Featured badge */}
                  {skill.isFeatured && (
                    <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      ⭐ Featured
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Skills Found</h3>
            <p className="text-gray-600">
              Skills will appear here once they're added to your portfolio.
            </p>
          </motion.div>
        )}

        {/* Skills Summary */}
        {skills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Skills Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {skills.length}
                  </div>
                  <div className="text-gray-600 text-sm">Total Skills</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {skills.filter(s => s.proficiencyLevel >= 8).length}
                  </div>
                  <div className="text-gray-600 text-sm">Expert Level</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {Object.keys(skillsByCategory).length}
                  </div>
                  <div className="text-gray-600 text-sm">Categories</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {skills.filter(s => s.isFeatured).length}
                  </div>
                  <div className="text-gray-600 text-sm">Featured</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Skills;
