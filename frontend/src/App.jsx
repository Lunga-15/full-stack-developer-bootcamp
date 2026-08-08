import React, { useState, useEffect } from 'react';
import BrewCard from './BrewCard';
import BrewModal from './BrewModal';

const API_BASE = 'https://coffee-brew-log-api-aewk.onrender.com';
const FILTER_OPTIONS = ['All', 'Pour Over', 'French Press', 'Espresso', 'Aeropress', 'Cold Brew'];

export default function App() {
  const [brews, setBrews] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('All');
  const [viewMode, setViewMode] = useState('list'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrew, setEditingBrew] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch brews from API
  const fetchBrews = async (method = 'All') => {
    setLoading(true);
    try {
      const url = method && method !== 'All' 
        ? `${API_BASE}?method=${encodeURIComponent(method)}` 
        : API_BASE;
      const res = await fetch(url);
      const data = await res.json();
      setBrews(data);
    } catch (err) {
      console.error('Error fetching brews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrews(selectedMethod);
  }, [selectedMethod]);

  // Handle Create or Update
  const handleSaveBrew = async (formData) => {
    try {
      if (editingBrew) {
        await fetch(`${API_BASE}/${editingBrew.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setIsModalOpen(false);
      setEditingBrew(null);
      fetchBrews(selectedMethod);
    } catch (err) {
      console.error('Error saving brew:', err);
    }
  };

  // Handle Delete from inside Modal
  const handleDeleteBrew = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brew entry?')) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      setIsModalOpen(false);
      setEditingBrew(null);
      fetchBrews(selectedMethod);
    } catch (err) {
      console.error('Error deleting brew:', err);
    }
  };

  const openAddModal = () => {
    setEditingBrew(null);
    setIsModalOpen(true);
  };

  const openEditModal = (brew) => {
    setEditingBrew(brew);
    setIsModalOpen(true);
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-gray-900 pb-12">
      {/* Header */}
      <header className="bg-amber-900 text-amber-50 py-6 px-4 shadow-md mb-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Brews: {brews.length}</h1>
            <p className="text-amber-200 text-sm mt-1"></p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold px-5 py-2.5 rounded-lg shadow transition"
          >
            + Log New Brew
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4">
        {/* Controls Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex items-center justify-between flex-wrap gap-4">
          
          {/* Dropdown Filter */}
          <div className="flex items-center gap-3">
            <label htmlFor="method-filter" className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Filter by Method:
            </label>
            <select
              id="method-filter"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="bg-stone-50 border border-gray-300 text-gray-800 text-sm rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none font-medium cursor-pointer"
            >
              {FILTER_OPTIONS.map((method) => (
                <option key={method} value={method}>
                  {method === 'All' ? 'All Methods' : method}
                </option>
              ))}
            </select>
          </div>

          {/* Grid / List Switcher */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                viewMode === 'list'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              ☰ List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition ${
                viewMode === 'grid'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              田 Grid
            </button>
          </div>
        </div>

        {/* Brew Logs View */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading brew log...</div>
        ) : brews.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg mb-4">No brews recorded</p>
            <button
              onClick={openAddModal}
              className="text-amber-800 font-semibold hover:underline"
            >
              Click here to log your first brew!
            </button>
          </div>
        ) : viewMode === 'list' ? (
          /* LIST VIEW */
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead className="bg-stone-100 text-gray-700 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-4">Beans</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Coffee</th>
                    <th className="p-4">Water</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Tasting Notes</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {brews.map((brew) => (
                    <tr key={brew.id} className="hover:bg-amber-50/40 transition">
                      <td className="p-4 font-bold text-gray-800">{brew.beans}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                          {brew.method}
                        </span>
                      </td>
                      <td className="p-4">{brew.coffee_grams}g</td>
                      <td className="p-4">{brew.water_grams}g</td>
                      <td className="p-4 text-amber-500 whitespace-nowrap">
                        {renderStars(brew.rating)}
                      </td>
                      <td className="p-4 italic text-gray-600 max-w-xs truncate">
                        "{brew.tasting_notes}"
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => openEditModal(brew)}
                          className="px-3 py-1 text-xs bg-amber-100 text-amber-900 hover:bg-amber-200 rounded font-medium transition"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brews.map((brew) => (
              <BrewCard
                key={brew.id}
                brew={brew}
                onEdit={openEditModal}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal Component */}
      <BrewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBrew}
        onDelete={handleDeleteBrew}
        initialData={editingBrew}
      />
    </div>
  );
}