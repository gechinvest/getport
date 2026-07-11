
import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { supabase } from '../lib/supabase';

const Admin = () => {
  const { portfolioData, fetchPortfolioData } = usePortfolio();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    if (portfolioData) {
      setFormData(portfolioData);
    }
  }, [portfolioData]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === portfolioData?.admin?.password || password === 'admin123') {
      setIsLoggedIn(true);
      setMessage('');
    } else {
      setMessage('Incorrect password!');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('portfolio')
        .update({ data: formData })
        .eq('id', 1);

      if (error) throw error;
      await fetchPortfolioData();
      setMessage('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      setMessage('Error saving changes!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Skills
  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), { name: '', icon: 'SiReact', level: 50, color: '#61DAFB' }
    }));
  };
  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };
  const updateSkill = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? { ...skill, [field]: value } : skill)
    }));
  };

  // Projects
  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), { id: Date.now(), title: '', description: '', image: '', tags: [], category: 'fullstack', liveUrl: '', githubUrl: '' }
    }));
  };
  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };
  const updateProject = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => i === index ? { ...project, [field]: value } : project)
    }));
  };
  const updateProjectTags = (index, tagsString) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    updateProject(index, 'tags', tags);
  };

  // Experience
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { year: '', title: '', company: '', description: '', icon: '💼' }
    }));
  };
  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };
  const updateExperience = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => i === index ? { ...exp, [field]: value } : exp)
    }));
  };

  // Social Links
  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        socialLinks: [...(prev.contact?.socialLinks || []), { name: '', url: '', icon: '🔗' }
      }
    }));
  };
  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        socialLinks: prev.contact.socialLinks.filter((_, i) => i !== index)
      }
    }));
  };
  const updateSocialLink = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        socialLinks: prev.contact.socialLinks.map((link, i) => i === index ? { ...link, [field]: value } : link)
      }
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 gradient-text">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Login
            </button>
            {message && <p className="text-center text-red-500">{message}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold gradient-text">Admin Dashboard</h1>
          <div className="flex gap-4">
            <a
              href="/"
              className="px-6 py-2 glass rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
            >
              View Portfolio
            </a>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 flex-wrap">
          {[
            { id: 'hero', label: 'Hero' },
            { id: 'about', label: 'About' },
            { id: 'skills', label: 'Skills' },
            { id: 'projects', label: 'Projects' },
            { id: 'experience', label: 'Experience' },
            { id: 'contact', label: 'Contact' },
            { id: 'social', label: 'Social Links' },
            { id: 'settings', label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'glass hover:bg-gray-200 dark:hover:bg-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {formData ? (
          <form onSubmit={handleSave} className="space-y-8 max-w-6xl mx-auto">
            {/* Hero Section */}
            {activeTab === 'hero' && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Hero Section</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.hero?.name || ''}
                      onChange={(e) => handleChange('hero.name', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Titles (comma separated)</label>
                    <input
                      type="text"
                      value={(formData.hero?.titles || []).join(', ')}
                      onChange={(e) => handleChange('hero.titles', e.target.value.split(',').map(t => t.trim()))}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={formData.hero?.description || ''}
                      onChange={(e) => handleChange('hero.description', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
                      rows="4"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* About Section */}
            {activeTab === 'about' && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">About Section</h2>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.about?.description || ''}
                    onChange={(e) => handleChange('about.description', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
                    rows="6"
                  />
                </div>
              </div>
            )}

            {/* Skills Section */}
            {activeTab === 'skills' && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h2>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                  >
                    + Add Skill
                  </button>
                </div>
                <div className="space-y-4">
                  {(formData.skills || []).map((skill, index) => (
                    <div key={index} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border">
                      <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Skill {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:text-red-700 text-2xl"
                      >
                        ×
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSkill(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Icon</label>
                        <input
                          type="text"
                          value={skill.icon}
                          onChange={(e) => updateSkill(index, 'icon', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Level ({skill.level}%)</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.level}
                          onChange={(e) => updateSkill(index, 'level', Number(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Color</label>
                        <input
                          type="color"
                          value={skill.color}
                          onChange={(e) => updateSkill(index, 'color', e.target.value)}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Section */}
            {activeTab === 'projects' && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h2>
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                  >
                    + Add Project
                  </button>
                </div>
                <div className="space-y-6">
                  {(formData.projects || []).map((project, index) => (
                    <div key={project.id || index} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Project {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="text-red-500 hover:text-red-700 text-2xl"
                        >
                          ×
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Title</label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => updateProject(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Category</label>
                          <select
                            value={project.category}
                            onChange={(e) => updateProject(index, 'category', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          >
                            <option value="fullstack">Full Stack</option>
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                          value={project.description}
                          onChange={(e) => updateProject(index, 'description', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          rows="3"
                        />
                      </div>
                      <div className="mt-4 grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                          <input
                            type="text"
                            value={(project.tags || []).join(', ')}
                            onChange={(e) => updateProjectTags(index, e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Image URL</label>
                          <input
                            type="text"
                            value={project.image}
                            onChange={(e) => updateProject(index, 'image', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4 grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Live URL</label>
                          <input
                            type="text"
                            value={project.liveUrl}
                            onChange={(e) => updateProject(index, 'liveUrl', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">GitHub URL</label>
                          <input
                            type="text"
                            value={project.githubUrl}
                            onChange={(e) => updateProject(index, 'githubUrl', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {activeTab === 'experience' && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experience</h2>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                  >
                    + Add Experience
                  </button>
                </div>
                <div className="space-y-4">
                  {(formData.experience || []).map((exp, index) => (
                    <div key={index} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Experience {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="text-red-500 hover:text-red-700 text-2xl"
                        >
                          ×
                        </button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Year</label>
                          <input
                            type="text"
                            value={exp.year}
                            onChange={(e) => updateExperience(index, 'year', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                          type="text"
                          value={exp.title}
                          onChange={(e) => updateExperience(index, 'title', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(index, 'description', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          rows="3"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Icon</label>
                        <input
                          type="text"
                          value={exp.icon}
                          onChange={(e) => updateExperience(index, 'icon', e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Section */}
            {activeTab === 'contact' && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contact Section</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.contact?.email || ''}
                      onChange={(e) => handleChange('contact.email', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="text"
                      value={formData.contact?.phone || ''}
                      onChange={(e) => handleChange('contact.phone', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.contact?.location || ''}
                    onChange={(e) => handleChange('contact.location', e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            )}

            {/* Social Links Section */}
            {activeTab === 'social' && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social Links</h2>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                  >
                    + Add Social Link
                  </button>
                </div>
                <div className="space-y-4">
                  {(formData.contact?.socialLinks || []).map((link, index) => (
                    <div key={index} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Social Link {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeSocialLink(index)}
                          className="text-red-500 hover:text-red-700 text-2xl"
                        >
                          ×
                        </button>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Name</label>
                          <input
                            type="text"
                            value={link.name}
                            onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">URL</label>
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Icon</label>
                          <input
                            type="text"
                            value={link.icon}
                            onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Section */}
            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Change Admin Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      onChange={(e) => handleChange('admin.password', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current password is stored in your portfolio data. Save changes to update it.
                  </p>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
            {message && <p className={`text-center ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
          </form>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
