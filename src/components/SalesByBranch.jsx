import React from 'react';

const salesData = [
  {
    country: 'United States',
    sales: '2500',
    value: '$230,900',
    bounce: '29.9%',
    countryCode: 'us',
  },
  {
    country: 'Germany',
    sales: '3.900',
    value: '$440,000',
    bounce: '40.22%',
    countryCode: 'de',
  },
  {
    country: 'Great Britain',
    sales: '1.400',
    value: '$190,700',
    bounce: '23.44%',
    countryCode: 'gb',
  },
  {
    country: 'Brazil',
    sales: '562',
    value: '$143,960',
    bounce: '32.14%',
    countryCode: 'br',
  },
];

const SalesByBranch = () => {
  return (
    <div className="bg-white rounded-2xl w-full h-full" style={{ padding: '20px' }}>
      <h3 className="text-lg font-semibold text-gray-500 mb-4">Sales by Branch</h3>

      {/* Enable horizontal scroll while keeping your original layout */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px] ">
          {salesData.map((sale, index) => (
            <div
              key={index}
              style={{ padding: '5px 5px' }}
              className="flex gap-3 items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex gap-1 items-center w-1/4">
                <img
                  src={`https://flagcdn.com/w40/${sale.countryCode}.png`}
                  alt={`${sale.country} flag`}
                  className="w-6 h-6 mr-4 rounded-full"
                />
                <div>
                  <p className="text-xs text-gray-500">Country:</p>
                  <p className="font-normal text-[14px] text-gray-500">{sale.country}</p>
                </div>
              </div>
              <div className="w-1/4">
                <p className="text-xs text-gray-500">Sales:</p>
                <p className="font-normal text-[14px] text-gray-500">{sale.sales}</p>
              </div>
              <div className="w-1/4">
                <p className="text-xs text-gray-500">Value:</p>
                <p className="font-normal text-[14px] text-gray-500">{sale.value}</p>
              </div>
              <div className="w-1/4">
                <p className="tex-xs text-gray-500">Bounce:</p>
                <p className="font-semibold text-gray-500">{sale.bounce}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesByBranch;
