import { Link } from 'react-router-dom';
import { useState } from 'react';
import '@fontsource/open-sans';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import Logo from '../assets/images/logo-ct-dark.png';

const Card = () => {
  // State for each collapsible section
  const [openSections, setOpenSections] = useState({
    manage: false,
    productManagement: false,
    locationManagement: false,
    branch: false,
    supplier: false,
    employees: false,
    customers: false,
    inventory: false,
    gold: false,
    settings: false,
    tradeSettings: false,
    groupPermissions: false
  });

  // Toggle function for each section
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-white rounded-2xl w-[250px] h-[90vh]" style={{ fontFamily: 'Open Sans', overflow: 'auto' }}>
      {/* Logo and Dashboard title */}
      
      <div className="pt-[25px] pl-[65px] flex  items-center gap-2 font-semibold text-[14px] text-gray-500" style={{ paddingLeft: '30px', paddingTop: '25px' }}>
        <img src={Logo} alt="Logo" className="w-[30px] h-[30px]" />
        <span>Dashboard</span>
      </div>

      {/* Divider line */}
      <div className='' style={{ padding: '20px', paddingLeft: '35px' }}>
        <hr className="border-gray-200" style={{ width: '95%' }} />
      </div>

      {/* Menu starts */}
      <div>
        {/* Manage Section */}
        <div className="mt-4 pl-[35px] text-sm text-gray-400" style={{ fontFamily: 'Open Sans' }}>
          <div 
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700" 
            style={{ paddingTop: '20px', paddingLeft: '36px' }}
            onClick={() => toggleSection('manage')}
          >
            
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 512 512"><path d="M184 48l144 0c4.4 0 8 3.6 8 8l0 40L176 96l0-40c0-4.4 3.6-8 8-8zm-56 8l0 40L64 96C28.7 96 0 124.7 0 160l0 96 192 0 128 0 192 0 0-96c0-35.3-28.7-64-64-64l-64 0 0-40c0-30.9-25.1-56-56-56L184 0c-30.9 0-56 25.1-56 56zM512 288l-192 0 0 32c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-32L0 288 0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-128z"/></svg>
            <span>Manage</span>

            <span className="text-xs text-gray-400" style={{ paddingLeft: '75px', fontSize: '7px', width: '9px' }}>
              {openSections.manage ? '▲' : '▼'}
            </span>
          </div>

          {openSections.manage && (
            <ul>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/manage/item_type' className='hover:text-black'>Item Type</Link></li>
              <li style={{ paddingLeft: '63px', paddingTop: '20px' }}><Link to="/dashboard/manage/jewellery_type">Jewellery Type</Link></li>
              
              {/* Product Management Subsection */}
              <div style={{ paddingLeft: '31px', paddingTop: '20px' }}>
                <div 
                  className="list-none cursor-pointer flex items-center gap-2 text-sm" 
                  style={{ paddingLeft: '30px' }}
                  onClick={() => toggleSection('productManagement')}
                >
                  Product Management
                  <span className="text-xs text-gray-400" style={{ paddingLeft: '10px', fontSize: '7px', width: '9px' }}>
                    {openSections.productManagement ? '▲' : '▼'}
                  </span>
                </div>
                
                {openSections.productManagement && (
                  <ul className="flex flex-col gap-[20px] mt-2 text-gray-400 pl-6">
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px', marginTop: '10px' }}><Link to='/dashboard/manage/category'>Category</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/subcategory'>Sub Category</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/brand'>Brand</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/color'>Colour Code</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/list_return_Type'>Return Type</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/product_size'>Size</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/gender'>Gender</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/diamond_type'>Diamond Type</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/stonetype'>Stone Type</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/occasion'>Occasion</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/stock-point'>Stock Point</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/style'>Style</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/design'>Design</Link></li>
                  </ul>
                )}
              </div>
              
              {/* Location Management Subsection */}
              <div style={{ paddingLeft: '31px', paddingTop: '20px' }}>
                <div 
                  className="list-none cursor-pointer flex items-center gap-2 text-sm" 
                  style={{ paddingLeft: '30px' }}
                  onClick={() => toggleSection('locationManagement')}
                >
                  Location Management
                  <span className="text-xs text-gray-400" style={{ paddingLeft: '10px', fontSize: '7px', width: '9px' }}>
                    {openSections.locationManagement ? '▲' : '▼'}
                  </span>
                </div>
                
                {openSections.locationManagement && (
                  <ul className="flex flex-col gap-[20px] mt-2 text-gray-400 pl-6">
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px', marginTop: '10px' }}><Link to='/dashboard/manage/country'>Country</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/city'>City</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/manage/adresstype'>Adress Type</Link></li>
                  </ul>
                )}
              </div>
            </ul>
          )}
        </div>

        {/* Branch Section */}
        <div className="mt-4 pl-[35px] text-sm text-gray-400" style={{ fontFamily: 'Open Sans' }}>
          <div 
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700" 
            style={{ paddingTop: '40px', paddingLeft: '36px' }}
            onClick={() => toggleSection('branch')}
          >
            
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-4 h-4 text-red-500" 
                 fill="currentColor"
                viewBox="0 0 448 512"
              >
                <path d="M80 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm80-24c0 32.8-19.7 61-48 73.3l0 87.8c18.8-10.9 40.7-17.1 64-17.1l96 0c35.3 0 64-28.7 64-64l0-6.7C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3l0 6.7c0 70.7-57.3 128-128 128l-96 0c-35.3 0-64 28.7-64 64l0 6.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3l0-6.7 0-198.7C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm232 0a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM80 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
              </svg>      
                 

 <span>Branch</span>
            <span className="text-xs text-gray-400" style={{ paddingLeft: '80px', fontSize: '7px', width: '9px' }}>
              {openSections.branch ? '▲' : '▼'}
            </span>
          </div>

          {openSections.branch && (
            <ul>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/branch/branches'>Branch</Link></li>
            </ul>
          )}
        </div>

        {/* Supplier Section */}
        <div className="mt-4 pl-[35px] text-sm text-gray-400" style={{ fontFamily: 'Open Sans' }}>
          <div 
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700" 
            style={{ paddingTop: '40px', paddingLeft: '36px' }}
            onClick={() => toggleSection('supplier')}
          >
            

            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-rose-300" fill="currentColor" viewBox="0 0 640 512">
            <path d="M256 48c0-26.5 21.5-48 48-48L592 0c26.5 0 48 21.5 48 48l0 416c0 26.5-21.5 48-48 48l-210.7 0c1.8-5 2.7-10.4 2.7-16l0-242.7c18.6-6.6 32-24.4 32-45.3l0-32c0-26.5-21.5-48-48-48l-112 0 0-80zM571.3 347.3c6.2-6.2 6.2-16.4 0-22.6l-64-64c-6.2-6.2-16.4-6.2-22.6 0l-64 64c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L480 310.6 480 432c0 8.8 7.2 16 16 16s16-7.2 16-16l0-121.4 36.7 36.7c6.2 6.2 16.4 6.2 22.6 0zM0 176c0-8.8 7.2-16 16-16l352 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16L16 224c-8.8 0-16-7.2-16-16l0-32zm352 80l0 224c0 17.7-14.3 32-32 32L64 512c-17.7 0-32-14.3-32-32l0-224 320 0zM144 320c-8.8 0-16 7.2-16 16s7.2 16 16 16l96 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-96 0z"/></svg>
            <span>Supplier</span>
            <span className="text-xs text-gray-400" style={{ paddingLeft: '75px', fontSize: '7px', width: '9px' }}>
              {openSections.supplier ? '▲' : '▼'}
            </span>
          </div>

          {openSections.supplier && (
            <ul>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/supplier/controllaccount'>Controll Account</Link></li>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/supplier/group'>Group</Link></li>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/supplier/tax'>Text Category</Link></li>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/supplier/List_supplier'>List Supplier</Link></li>
            </ul>
          )}
        </div>

        {/* Employees Section */}
        <div className="mt-4 pl-[35px] text-sm text-gray-400" style={{ fontFamily: 'Open Sans' }}>
          <div 
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700" 
            style={{ paddingTop: '40px', paddingLeft: '36px' }}
            onClick={() => toggleSection('employees')}
          >
            
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 448 512"><path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7l131.7 0c0 0 0 0 .1 0l5.5 0 112 0 5.5 0c0 0 0 0 .1 0l131.7 0c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2L224 304l-19.7 0c-12.4 0-20.1 13.6-13.7 24.2z"/></svg>
            <span>Employees</span>
            <span className="text-xs text-gray-400" style={{ paddingLeft: '59px', fontSize: '7px', width: '9px' }}>
              {openSections.employees ? '▲' : '▼'}
            </span>
            
          </div>

          {openSections.employees && (
            <ul>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/employees/departments'>Departments</Link></li>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/employees/positions'>Positions</Link></li>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/employees/paymentmethodes'>Payment Methodes</Link></li>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/employees/gender'>Gender</Link></li>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/employees/employeelist'>Employee List</Link></li>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/employees/payslip'>Payslip</Link></li>
            </ul>
          )}
        </div>

        {/* Customers Section */}
        <div className="mt-4 pl-[35px] text-sm text-gray-400" style={{ fontFamily: 'Open Sans' }}>
          <div 
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700" 
            style={{ paddingTop: '40px', paddingLeft: '36px' }}
            onClick={() => toggleSection('customers')}
          >
            
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 640 512"><path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3l0-84.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5l0 21.5c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-26.8C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112l32 0c24 0 46.2 7.5 64.4 20.3zM448 416l0-21.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176l32 0c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2l0 26.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7l0 84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3l0-84.7c-10 11.3-16 26.1-16 42.3zm144-42.3l0 84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2l0 42.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-42.8c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112l32 0c61.9 0 112 50.1 112 112z"/></svg>
            <span>Customers</span>
            <span className="text-xs text-gray-400" style={{ paddingLeft: '60px', fontSize: '7px', width: '9px' }}>
              {openSections.customers ? '▲' : '▼'}
            </span>
          </div>

          {openSections.customers && (
            <ul>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/customers/customerslist'>Customers List</Link></li>
            </ul>
          )}
        </div>

        {/* Inventory Section */}
        <div className="mt-4 pl-[35px] text-sm text-gray-400" style={{ fontFamily: 'Open Sans' }}>
          <div 
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700" 
            style={{ paddingTop: '40px', paddingLeft: '36px' }}
            onClick={() => toggleSection('inventory')}
          >
           
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 448 512"><path d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z"/></svg>
            <span>Inventory</span>
            <span className="text-xs text-gray-400" style={{ paddingLeft: '70px', fontSize: '7px', width: '9px' }}>
              {openSections.inventory ? '▲' : '▼'}
            </span>
          </div>

          {openSections.inventory && (
            <ul>
              <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/inventory/item'>Item</Link></li>
              
              {/* Gold Subsection */}
              <div style={{ paddingLeft: '31px', paddingTop: '20px' }}>
                <div 
                  className="list-none cursor-pointer flex items-center gap-2 text-sm" 
                  style={{ paddingLeft: '30px' }}
                  onClick={() => toggleSection('gold')}
                >
                  Gold
                  <span className="text-xs text-gray-400" style={{ paddingLeft: '10px', fontSize: '7px', width: '9px' }}>
                    {openSections.gold ? '▲' : '▼'}
                  </span>
                </div>
                
                {openSections.gold && (
                  <ul className="flex flex-col gap-[20px] mt-2 text-gray-400 pl-6">
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px', marginTop: '10px' }}><Link to='/dashboard/inventory/gold/purchase'>Purchase</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/inventory/gold/purchaseFix'>Purchase Fix</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/inventory/gold/ListPurchase'>List Purchase Fix</Link></li>
                  </ul>
                )}
              </div>
              <div style={{ paddingLeft: '31px', paddingTop: '20px' }}>
                <div 
                  className="list-none cursor-pointer flex items-center gap-2 text-sm" 
                  style={{ paddingLeft: '30px' }}
                  onClick={() => toggleSection('diamond')}
                >
                  Diamond
                  <span className="text-xs text-gray-400" style={{ paddingLeft: '10px', fontSize: '7px', width: '9px' }}>
                    {openSections.diamond ? '▲' : '▼'}
                  </span>
                </div>
                
                {openSections.diamond && (
                  <ul className="flex flex-col gap-[20px] mt-2 text-gray-400 pl-6">
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px', marginTop: '10px' }}><Link to='/dashboard/inventory/diamond/purchasediamond'>Item</Link></li>
                  </ul>
                )}

              </div>
                <li style={{ paddingLeft: '63px', paddingTop: '23px' }}><Link to='/dashboard/inventory/stock-transfer'>Stock Transfer</Link></li>

            </ul>
          )}
        </div>

        {/* Settings Section */}
        <div className="mt-4 pl-[35px] text-sm text-gray-400" style={{ fontFamily: 'Open Sans' }}>
          <div 
            className="list-none cursor-pointer flex items-center gap-3 text-gray-500 text-sm transition-all duration-300 hover:text-gray-700" 
            style={{ paddingTop: '40px', paddingLeft: '36px' }}
            onClick={() => toggleSection('settings')}
          >
            
            <svg xmlns="http://www.w3.org/2000/svg"className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 640 512"><path d="M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.9 8.4 167.2 8 160.4 8l-.7 0c-6.8 0-13.5 .4-20.1 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM112 176a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9 16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5 9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 304a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
            <span>Settings</span>
            <span className="text-xs text-gray-400" style={{ paddingLeft: '80px', fontSize: '7px', width: '9px' }}>
              {openSections.settings ? '▲' : '▼'}
            </span>
          </div>

          {openSections.settings && (
            <ul>
              {/* Trade Settings Subsection */}
              <div style={{ paddingLeft: '31px', paddingTop: '20px' }}>
                <div 
                  className="list-none cursor-pointer flex items-center gap-2 text-sm" 
                  style={{ paddingLeft: '30px' }}
                  onClick={() => toggleSection('tradeSettings')}
                >
                  Trade Settings
                  <span className="text-xs text-gray-400" style={{ paddingLeft: '10px', fontSize: '7px', width: '9px' }}>
                    {openSections.tradeSettings ? '▲' : '▼'}
                  </span>
                </div>
                
                {openSections.tradeSettings && (
                  <ul className="flex flex-col gap-[20px] mt-2 text-gray-400 pl-6">
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px', marginTop: '10px' }}><Link to='/dashboard/settings/tradesettings/tax'>Tax</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/settings/tradesettings/currency'>Currency</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/settings/tradesettings/uom'>UOM</Link></li>
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px' }}><Link to='/dashboard/settings/tradesettings/termsofpayment'>Terms Of Payment</Link></li>
                  </ul>
                )}
              </div>
              
              {/* Group & Permissions Subsection */}
              <div style={{ paddingLeft: '31px', paddingTop: '20px' }}>
                <div 
                  className="list-none cursor-pointer flex items-center gap-2 text-sm" 
                  style={{ paddingLeft: '30px' }}
                  onClick={() => toggleSection('groupPermissions')}
                >
                  Group & Permissions
                  <span className="text-xs text-gray-400" style={{ paddingLeft: '10px', fontSize: '7px', width: '9px' }}>
                    {openSections.groupPermissions ? '▲' : '▼'}
                  </span>
                </div>
                
                {openSections.groupPermissions && (
                  <ul className="flex flex-col gap-[20px] mt-2 text-gray-400 pl-6">
                    <li className="text-xs hover:text-blue-500" style={{ paddingLeft: '30px', marginTop: '10px' }}><Link to='/dashboard/settings/groupandpermissions/group'>Groups</Link></li>
                    
                  </ul>
                )}
              </div>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;