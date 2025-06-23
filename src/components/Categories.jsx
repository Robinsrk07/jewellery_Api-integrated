import React from 'react';

const categoriesData = [
  {
   icon: '🏢',
    name: 'Gold',
    details: '250 in stock, 346+ sold',
  },
  {
    icon: '💎',
    name: 'Diamond',
    details: '123 closed, 15 open',
  },
  {
    icon: '🏢',
    name: 'New Branch',
    details: '1 is active, 40 closed',
  },
  {
    icon: '🛒',
    name: 'Sales',
    details: '+430',
  },
];

const Categories = () => {
  return (
    <div className="bg-white p-6 rounded-2xl w-full h-full"style={{padding:'20px'}}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
      <div className="space-y-4">
        {categoriesData.map((category, index) => (
          <div key={index} className="flex items-center justify-between"style={{padding: "0.5rem 0"
}}>
            <div className="flex items-center">
              <div className="bg-gray-800 text-white w-10 h-10 flex items-center justify-center rounded-lg mr-4">
                <span className="text-xl">{category.icon}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">{category.name}</p>
                <p className="text-sm text-gray-500">{category.details}</p>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories; 