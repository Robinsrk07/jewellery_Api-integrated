// SalesOverviewChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const data = [
  { name: 'Apr', sales: 50, revenue: 30 },
  { name: 'May', sales: 25, revenue: 90 },
  { name: 'Jun', sales: 300, revenue: 40 },
  { name: 'Jul', sales: 220, revenue: 160 },
  { name: 'Aug', sales: 490, revenue: 300 },
  { name: 'Sep', sales: 280, revenue: 270 },
  { name: 'Oct', sales: 400, revenue: 340 },
  { name: 'Nov', sales: 230, revenue: 250 },
  { name: 'Dec', sales: 500, revenue: 400 },
];

const SalesOverviewChart = () => {
  return (
    <div className="w-full h-full p-2 md:p-4 rounded-2xl bg-white">
      <h2 className="text-gray-700 text-sm md:text-md font-semibold mb-1">Sales Overview</h2>
      <p className="text-green-500 text-xs md:text-sm font-medium">↑ 4% more in 2021</p>
      <ResponsiveContainer width="100%" height={"85%"} minHeight={180} minWidth={200}>
        <AreaChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#999', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#999', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #E5E7EB',
            }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
          <Line type="monotone" dataKey="revenue" stroke="#111827" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesOverviewChart;
