import React, { useState, useEffect } from 'react';
import LineChartComponent from '../components/LineChartComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RevenueStatisticsPage = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState('Năm');
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);

  const dataKeys = [
    { key: 'thu', color: '#8884d8' },
    { key: 'chi', color: '#82ca9d' },
  ];
  const xAxisKey = 'name';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/admin/statistics/revenue-cost?year=${year}&type=${selected.toLowerCase()}&month=${month}&day=${day}`);
        if (!response.ok) throw new Error('Không thể lấy dữ liệu thống kê');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message);
        toast.error('Lỗi khi lấy dữ liệu thống kê: ' + error.message, { autoClose: 3000 });
      }
    };
    fetchData();
  }, [year, selected, month, day]);

  const handleSelect = (value) => {
    setSelected(value);
  };

  const totalProfit = data.reduce((total, item) => total + (item.thu - item.chi), 0);

  const increaseYear = () => {
    if (year < 2025) {
      setYear(year + 1);
    }
  };
  const decreaseYear = () => {
    if (year > 2000) {
      setYear(year - 1);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="max-w-screen overflow-x-hidden px-4 py-6">
      <ToastContainer />
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
      {selected !== 'Năm' && (
        <div className="dropdown border border-gray-300 rounded-lg mb-4">
          <label tabIndex={0} className="btn rounded-lg">
            Tháng {month} <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            {months.map((m) => (
              <li key={m}>
                <a onClick={() => setMonth(m)}>Tháng {m}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selected === 'Ngày' && (
        <div className="dropdown border border-gray-300 rounded-lg mb-4">
          <label tabIndex={0} className="btn rounded-lg">
            Ngày {day} <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            {days.map((d) => (
              <li key={d}>
                <a onClick={() => setDay(d)}>Ngày {d}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <LineChartComponent data={data} dataKeys={dataKeys} xAxisKey={xAxisKey} />
      <div className="flex justify-end">
        <span className="font-bold text-2xl text-blue-600">
          Tổng lợi nhuận: {totalProfit.toLocaleString('vi-VN')} VND
        </span>
      </div>
    </div>
  );
};

export default RevenueStatisticsPage;