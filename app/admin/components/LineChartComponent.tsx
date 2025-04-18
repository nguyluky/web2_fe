import React from 'react';
// import {
//   Line,
//   LineChart,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LineChartProps {
  data: Array<Record<string, any>>;
  dataKeys: Array<{ key: string; color: string }>;
  xAxisKey: string;
}

const LineChartComponent: React.FC<LineChartProps> = ({ data, dataKeys, xAxisKey }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        {/* Lưới biểu đồ */}
        <CartesianGrid strokeDasharray="3 3" />
        {/* Trục X */}
        <XAxis dataKey={xAxisKey} />
        {/* Trục Y */}
        <YAxis />
        {/* Công cụ Tooltip */}
        <Tooltip />
        {/* Chú thích */}
        <Legend />
        {/* Vẽ từng đường trong LineChart dựa trên dataKeys */}
        {dataKeys.map((key, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={key.key}
            stroke={key.color}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;

// const LineChartComponent = () => {
//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <LineChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Line type="monotone" dataKey="năm này" stroke="#8884d8" activeDot={{ r: 8 }} />
//         <Line type="monotone" dataKey="năm trước" stroke="#82ca9d" />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };
