import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '@fontsource/open-sans';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import Logo from '../assets/images/logo-ct-dark.png';
import { ChevronDown, ChevronUp} from 'lucide-react';
import MenuListModel from '../models/menuListModel';
import getMenuIcon from '../menuIcons';

const CardMoblie = ({onClose}) => {
  const location = useLocation();
  const [menuData, setMenuData] = useState([]);
  const [expandedMenus, setExpandedMenus] = useState({});
   

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await MenuListModel.getMenuList();
        setMenuData(response.data.data);
        
        const initialExpandedState = {};
        response.data.data.forEach((menu, index) => {
          if (menu.sub_menu?.length || menu.gold_menu?.length || menu.diamond_menu?.length) {
            initialExpandedState[index] = false;
          }
        });
        setExpandedMenus(initialExpandedState);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, []);

  const toggleMenu = (menuIndex) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuIndex]: !prev[menuIndex]
    }));
  };

  const isActive = (url) => {
    return location.pathname === `/${url}`;
  };

  const renderMenuItems = (items, level = 0, parentIndex = '') => {
   
    return items.map((item, index) => {

      const hasChildren = item.sub_menu?.length || item.gold_menu?.length || item.diamond_menu?.length;
      const uniqueKey = `${parentIndex}-${index}`;
      const isItemActive = isActive(item.url);
      const isExpanded = expandedMenus[uniqueKey];

      return (
        <div key={uniqueKey} style={{ marginLeft: level > 0 ? '2px' : '0' }}>
          <div 
            className={`flex items-center justify-between   transition-colors
              ${isItemActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}
            `}
            
          >
            {hasChildren ? (
            <button
              className="flex gap-3 items-center w-full text-left"
              onClick={() => toggleMenu(uniqueKey)}
            >
              <span className="mr-2">{getMenuIcon(item.menu_name || item.main_menu)}</span>
              <span className="text-[14px] text-gray-400 flex-grow text-left">
                {item.menu_name || item.main_menu}
              </span>
              <span className="text-[7px] text-gray-400 ml-1">
                {isExpanded ? '▲' : '▼'}
              </span>
            </button>

            ) : (
             <Link 
              to={`${item.url}`} 
              onClick={() => onClose?.()}
              className="flex items-center w-full text-[14px] text-gray-400"
            >
              {item.menu_name || item.main_menu}
            </Link>
            )}
          </div>

          {hasChildren && isExpanded && (
            <div style={{ marginTop: '15px' }}>
              {item.sub_menu?.length > 0 && (
                <div style={{ paddingLeft: '30px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {renderMenuItems(item.sub_menu, level + 1, uniqueKey)}
                </div>
              )}
              
              {item.gold_menu?.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <div className="text-[10px] font-semibold text-[#67748e] uppercase tracking-wider px-3 py-1">
                    Gold
                  </div>
                  <div style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '8px' }}>
                    {renderMenuItems(item.gold_menu, level + 1, `${uniqueKey}-gold`)}
                  </div>
                </div>
              )}
              
              {item.diamond_menu?.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1">
                    Diamond
                  </div>
                  <div style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '8px' }}>
                    {renderMenuItems(item.diamond_menu, level + 1, `${uniqueKey}-diamond`)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className=" fixed inset-0 bg-black/90 w-full h-full flex flex-col z-50 " 
         style={{ fontFamily: 'Open Sans', overflow: 'hidden' }}>
      <div style={{ padding: '25px 0 25px 30px' }} className="flex items-center gap-2 font-semibold text-[14px] text-gray-500">
        <img src={Logo} alt="Logo" className="w-[30px] h-[30px]" />
        <Link to={'/dashboard'}   onClick={() => onClose?.()}>
        <span className='text-white' >Dashboard</span>
        </Link>
      </div>

      <div style={{ padding:"0px 35px",paddingBottom:'30px' }}>
        <hr className="border-gray-200" />
      </div>

      <div style={{ paddingLeft:'35px', paddingRight:'18px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '36px' }}>
        {menuData.length > 0 ? (
          renderMenuItems(menuData)
        ) : (
          <div style={{ padding: '16px 0', textAlign: 'center' }} className="text-gray-500">
            Loading menu...
          </div>
        )}
      </div>
    </div>
  );
};

export default CardMoblie;