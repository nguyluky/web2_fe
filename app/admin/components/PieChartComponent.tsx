import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const paymentData = [
  { method: 'PayPal', value: 60 },
  { method: 'Tiền mặt', value: 40 },
];

const COLORS = ['#8884d8', '#82ca9d'];

const PieChartComponent = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={paymentData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          nameKey="method" // Đặt tên `dataKey` để hiển thị trong Legend
          label={(entry) => entry.method} // Hiển thị phương thức trên biểu đồ
        >
          {paymentData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend /> {/* Thêm Legend để ghi tên dataKey bên dưới */}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
