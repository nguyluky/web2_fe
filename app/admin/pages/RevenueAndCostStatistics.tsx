import React from 'react';
import LineChartComponent from '../components/LineChartComponent';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const RevenueStatisticsPage = () => {


const [data, setData] = useState([]);
    useEffect(() => {
      // Simulate fetching data from an API
      const fetchData = async () => {
        const response = await fetch(`/api/admin/statistics/revenue-cost?year=${year}&type=${selected.toLowerCase()}`); // Replace with your API endpoint
        const data = await response.json();
        setData(data);
      };

      fetchData();
    }, []);
  const dataKeys = [
    { key: 'thu', color: '#8884d8' },
    { key: 'chi', color: '#82ca9d' },
  ];

  const xAxisKey = 'name';

  const [selected, setSelected] = useState('Năm');

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const totalProfit = data.reduce((total, item) => total + (item.thu - item.chi), 0);

  const [year, setYear] = useState(2025);
  const increaseYear = () => {
    if (year < 2025) {
      setYear(year + 1);
    }
  };
  const decreaseYear = () => {
    if (year > 1900) {
      setYear(year - 1);
    }
  };

  return (
    <div className="max-w-screen overflow-x-hidden px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Thống kê thu chi</h1>
      <div>
        <label tabIndex={0} className="mb-2 mr-3">
          Loại thống kê:
        </label>
        <div className="dropdown border border-gray-300 rounded-lg mb-4">
          <label tabIndex={0} className="btn rounded-lg">
            {selected} <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a onClick={() => handleSelect('Năm')}>Năm</a>
            </li>
            <li>
              <a onClick={() => handleSelect('Tháng')}>Tháng</a>
            </li>
            <li>
              <a onClick={() => handleSelect('Ngày')}>Ngày</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="inline-flex items-center border border-gray-200 rounded-lg shadow-sm mb-4">
        <button onClick={decreaseYear} className="btn bg-white rounded-lg mr-3">
          <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
        </button>
        <span>{year}</span>
        <button onClick={increaseYear} className="btn bg-white rounded-lg ml-3">
          <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
        </button>
      </div>

      <LineChartComponent data={data} dataKeys={dataKeys} xAxisKey={xAxisKey} />

      <div className="flex justify-end">
        <span className="font-bold text-2xl text-blue-600">Tổng lợi nhuận: {totalProfit}</span>
      </div>
    </div>
  );
};

export default RevenueStatisticsPage;
