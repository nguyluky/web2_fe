import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxesPacking,
  faFileCirclePlus,
  faHouse,
  faMagnifyingGlass,
  faRightFromBracket,
  faPalette,
  faCartShopping,
  faTicket,
  faTruck,
  faUsers,
  faUser,
  faBriefcase,
  faChartArea,
  faChevronDown,
  faChevronRight,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  {
    id: 1,
    text: 'Dashboard',
    to: '/admin/dashboard',
    icon: <FontAwesomeIcon icon={faHouse} />,
  },
  {
    id: 2,
    text: 'Người dùng',
    to: '/admin/user',
    icon: <FontAwesomeIcon icon={faUsers} />,
  },
  {
    id: 3,
    text: 'Nhóm quyền',
    to: '/admin/role',
    icon: <FontAwesomeIcon icon={faUsers} />,
  },
  {
    id: 4,
    text: 'Loại sản phẩm',
    to: '/admin/category',
    icon: <FontAwesomeIcon icon={faBoxesPacking} />,
  },
  {
    id: 5,
    text: 'Sản phẩm',
    to: '/admin/product',
    icon: <FontAwesomeIcon icon={faBoxesPacking} />,
  },
  {
    id: 6,
    text: 'Đơn hàng',
    to: '/admin/order',
    icon: <FontAwesomeIcon icon={faCartShopping} />,
  },
  {
    id: 7,
    text: 'Nhà cung cấp',
    to: '/admin/supplier',
    icon: <FontAwesomeIcon icon={faTruck} />,
  },
  {
    id: 8,
    text: 'Bảo hành',
    to: '/admin/warranty',
    icon: <FontAwesomeIcon icon={faWrench} />,
  },
  {
    id: 9,
    text: 'Nhập hàng',
    to: '/admin/import',
    icon: <FontAwesomeIcon icon={faFileCirclePlus} />,
  },
  {
    id: 10,
    title: 'Thống kê',
    text: 'Thống kê',
    to: '/admin/statistical',
    icon: <FontAwesomeIcon icon={faChartArea} />,
    children: [
      {
        id: 11,
        text: 'Thống kê thu chi',
        to: '/admin/statistical/revenueandcoststatistics',
      },
      { id: 12, text: 'Thống kê tồn kho', to: '/admin/statistical/inventorystatistics' },
    ],
  },
];

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({});

  const toggleMenu = (id: number) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed p-5 bg-gray-100 w-64 h-screen flex flex-col">
      <h2 className="mb-6 text-2xl font-bold">TechStore Admin</h2>
      <nav className="flex-1 flex flex-col">
        <ul className="flex-1 flex-col">
          {items.map((item) => (
            <li key={item.id} className="mb-2">
              {/* Nếu có children (dropdown) */}
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className="w-full flex items-center justify-between p-2 text-gray-500 font-medium hover:bg-gray-200 hover:text-black rounded"
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.text}</span>
                    </div>
                    <FontAwesomeIcon
                      icon={openMenus[item.id] ? faChevronDown : faChevronRight}
                      className="ml-2"
                    />
                  </button>
                  {openMenus[item.id] && (
                    <ul className="ml-6 mt-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <NavLink
                            to={child.to}
                            className="block py-1 text- text-gray-600 hover:text-black"
                          >
                            {child.text}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.to || '#'}
                  className="flex items-center p-2 text-gray-500 font-medium hover:bg-gray-200 hover:text-black rounded"
                >
                  {item.icon}
                  <span className="ml-2">{item.text}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        {/* Đăng xuất */}
        <button className="flex items-center justify-between border w-full px-4 py-2 text-base bg-white-500 text-gray-500 rounded hover:bg-gray-200 hover:text-black mt-auto">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faUser} />
            <div className="flex flex-col text-left">
              <span className="font-semibold">UserName</span>
              <span className="text-sm">abc@gmail.com</span>
            </div>
          </div>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
