import React from 'react';

export default function BrewCard({ brew, onEdit }) {
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800">{brew.beans}</h3>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
            {brew.method}
          </span>
        </div>

        <div className="text-amber-500 text-base mb-3">
          {renderStars(brew.rating)} <span className="text-xs text-gray-500">({brew.rating}/5)</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded">
          <div>
            <span className="font-semibold block text-gray-700">Coffee</span>
            {brew.coffee_grams}g
          </div>
          <div>
            <span className="font-semibold block text-gray-700">Water</span>
            {brew.water_grams}g
          </div>
        </div>

        <div className="text-sm text-gray-700 mb-4">
          <span className="font-semibold block text-gray-800">Tasting Notes:</span>
          <p className="italic text-gray-600 bg-amber-50/50 p-2 rounded mt-1">"{brew.tasting_notes}"</p>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(brew)}
          className="w-full py-2 text-sm bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-900 rounded-md font-medium transition text-center"
        >
          Edit Brew
        </button>
      </div>
    </div>
  );
}