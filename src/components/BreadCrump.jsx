import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MenuListModel from '../models/menuListModel';
import '@fontsource/open-sans'; // Default weight 400
import '@fontsource/open-sans/600.css'; // Semi-bold
import '@fontsource/open-sans/700.css'; // Bold

const BreadCrumb = () => {
  const location = useLocation();
  const [menuData, setMenuData] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const fetchMenuData = async () => {
    try {
      const response = await MenuListModel.getMenuList();
      if (response.data && response.data.data) {
        setMenuData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    if (menuData.length > 0) {
      const path = location.pathname;
      const crumbs = [{ name: "Home", path: "/dashboard" }];
  
      // Helper to flatten all menu arrays
      const allMenus = [];
      menuData.forEach(menu => {
        // Handle main_menu + sub_menu
        if (menu.main_menu && Array.isArray(menu.sub_menu)) {
          allMenus.push({
            main_menu: menu.main_menu,
            sub_menu: menu.sub_menu
          });
        }
        // Handle gold_menu, diamond_menu, etc.
        if (Array.isArray(menu.gold_menu)) {
          allMenus.push({
            main_menu: "Gold",
            sub_menu: menu.gold_menu
          });
        }
        if (Array.isArray(menu.diamond_menu)) {
          allMenus.push({
            main_menu: "Diamond",
            sub_menu: menu.diamond_menu
          });
        }
      });
  
      let found = false;
      for (const menu of allMenus) {
        for (const sub of menu.sub_menu) {
          // Match if the path ends with the sub_menu url (handles nested routes)
          if (path.endsWith(`/${sub.url}`) || path === `/${sub.url}`) {
            crumbs.push({
              name: menu.main_menu,
              path: "#", // You can set a real path if you want to link to the main menu
            });
            crumbs.push({
              name: sub.menu_name,
              path: path,
            });
            found = true;
            break;
          }
        }
        if (found) break;
      }
  
      setBreadcrumbs(crumbs);
    }
  }, [location, menuData]);

  return (
    <div className="breadcrumb-container text-white " style={{ fontFamily: 'Open Sans'}}>
      {breadcrumbs.map((crumb, index) => (
        <span key={index}>
          {index > 0 && <span className="separator"> / </span>}
          {index === breadcrumbs.length - 1 ? (
            <span className="current  font-bold ">{crumb.name}</span>
          ) : (
            <Link to={crumb.path} className="text-gray-200 text-[15px]">{crumb.name}</Link>
          )}
        </span>
      ))}
    </div>
  );
};

export default BreadCrumb;