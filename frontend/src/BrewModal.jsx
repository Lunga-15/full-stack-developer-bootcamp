import React, { useState, useEffect } from 'react';

const BREW_METHODS = ['Pour Over', 'French Press', 'Espresso', 'Aeropress', 'Cold Brew'];

export default function BrewModal({ isOpen, onClose, onSave, onDelete, initialData }) {
  const [formData, setFormData] = useState({
    beans: '',
    method: '', // Default to empty string for placeholder selection
    coffee_grams: '',
    water_grams: '',
    rating: '5',
    tasting_notes: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        beans: initialData.beans || '',
        method: initialData.method || '',
        coffee_grams: initialData.coffee_grams || '',
        water_grams: initialData.water_grams || '',
        rating: initialData.rating || '5',
        tasting_notes: initialData.tasting_notes || ''
      });
    } else {
      setFormData({
        beans: '',
        method: '',
        coffee_grams: '',
        water_grams: '',
        rating: '5',
        tasting_notes: ''
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation ensures a method is selected
    if (
      !formData.beans.trim() ||
      !formData.method ||
      !formData.coffee_grams ||
      !formData.water_grams ||
      !formData.tasting_notes.trim()
    ) {
      setError('Please fill out all fields, including selecting a brewing method.');
      return;
    }

    onSave({
      ...formData,
      coffee_grams: parseFloat(formData.coffee_grams),
      water_grams: parseFloat(formData.water_grams),
      rating: parseInt(formData.rating, 10)
    });
  };

  const handleDelete = () => {
    if (initialData && onDelete) {
      onDelete(initialData.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 pr-6">
          {initialData ? 'Edit Brew Entry' : 'Log New Brew'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coffee Beans</label>
            <input
              type="text"
              name="beans"
              value={formData.beans}
              onChange={handleChange}
              placeholder="e.g. Zimbabwean highlands"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brewing Method</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {/* Disabled Placeholder Option */}
              <option value="" disabled>
                Select brewing method
              </option>
              {BREW_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coffee (grams)</label>
              <input
                type="number"
                step="0.1"
                name="coffee_grams"
                value={formData.coffee_grams}
                onChange={handleChange}
                placeholder="18"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Water (grams)</label>
              <input
                type="number"
                step="0.1"
                name="water_grams"
                value={formData.water_grams}
                onChange={handleChange}
                placeholder="300"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1 to 5 Stars)</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="5">★★★★★ (5 Stars)</option>
              <option value="4">★★★★☆ (4 Stars)</option>
              <option value="3">★★★☆☆ (3 Stars)</option>
              <option value="2">★★☆☆☆ (2 Stars)</option>
              <option value="1">★☆☆☆☆ (1 Star)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tasting Notes</label>
            <textarea
              name="tasting_notes"
              rows="3"
              value={formData.tasting_notes}
              onChange={handleChange}
              placeholder="e.g. Floral aromatics, bright blueberry acidity, smooth honey finish."
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between items-center">
            <div>
              {initialData && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition"
                >
                  Delete Brew
                </button>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition"
              >
                {initialData ? 'Update Brew' : 'Save Brew'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}