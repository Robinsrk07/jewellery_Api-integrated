import React from 'react';
import './App.css';
import DashBoard from './components/DashBoard';
import Body from './components/Body';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import List_item_Type from './components/Manage/List_item_Type';
// import Jewellery_Type from './components/Manage/Jewellery_Type';
// import Category from './components/Manage/Product-Management/Category';
// import SubCategory from './components/Manage/Product-Management/SubCategory';
// import Brand from './components/Manage/Product-Management/Brand';
// import Color from './components/Manage/Product-Management/Color';
// import Login from './components/LoginPage';
// import List_return_Type from './components/Manage/Product-Management/List_return_Type';
// import Product_Size from './components/Manage/Product-Management/Product_size';
// import Gender from './components/Manage/Product-Management/Gender';
// import Diamond_Type from './components/Manage/Product-Management/Diamond_Type';
// import StoneType from './components/Manage/Product-Management/StoneType';
// import Occasion from './components/Manage/Product-Management/Occasion';
// import Stock_point from './components/Manage/Product-Management/Stock_point';
// import Style from './components/Manage/Product-Management/Style';
// import Design from './components/Manage/Product-Management/Design';
// import Country from './components/Manage/Location-Management/Country';
// import City from './components/Manage/Location-Management/City';
// import Adress_Type from './components/Manage/Location-Management/AdressType';
// import ControllAccount from './components/Supplier/ControllAccount';
// import Group from './components/Supplier/Group';
// import Tax from './components/Supplier/Tax';
// import List_supplier from './components/Supplier/List_supplier';
// import CreateSupplier from './components/Supplier/CreateSupplier';
// import Departments from './components/Employees/Departments';
// import EmployeeList from './components/Employees/EmployeeList';
// import PaymentMethodes from './components/Employees/PaymentMethodes';
// import Genders from './components/Employees/Genders';
// import Positions from './components/Employees/Postitions';
// import CustomersList from './components/Cutomers/CustomersList.jsx';
// import Item from './components/Inventory/Item.jsx';
// import CreateItem from './components/Inventory/CreateItem.jsx';
// import Purchase from './components/Inventory/Gold/Purchase.jsx';
// import PurchaseFix from './components/Inventory/Gold/PurchaseFix.jsx';
// import ListPurchase from './components/Inventory/Gold/ListPurchase.jsx';
// import CreateGoldPurchase from './components/Inventory/Gold/CreateGoldPurchase.jsx';
// import CreateNewPurchase from './components/Inventory/Gold/CreateNewPurchase.jsx';
// import ViewPurchase from './components/Inventory/Gold/ViewPurchase.jsx';
// import UpdateGoldPurchase from './components/Inventory/Gold/UpdateGoldPurchase.jsx';
// import UpdateItem from './components/Inventory/UpdateItem.jsx';
// import SettingsTax from './components/Settings/SettingsTax.jsx';
// import Currency from './components/Settings/Currency.jsx';
// import UnitOfMeasures from './components/Settings/UnitOfMeasures.jsx';
// import TermsOfPayment from './components/Settings/TermsOfPayment.jsx';
// import GroupAndPermission from './components/Group&Permission/GroupAndPermission.jsx';
// import ManagePermissions from './components/Group&Permission/ManagePermissions.jsx';
// import DiamondPurchhase from './components/Inventory/Diamond/DiamondPurchhase.jsx';
// import CreateDiamondPurchase from './components/Inventory/Diamond/CreateDiamondPurchase.jsx';
// import ItemDetials from './components/Inventory/Diamond/ItemDetials.jsx';
// import PaySlip from './components/Employees/PaySlip.jsx';
// import Pos from './components/Pos.jsx';
// import { Provider } from 'react-redux';
// import store from './StateManagement/store.js';
// import Branches from './components/Branch/Branches.jsx';
// import BranchWiseEmployee from './components/Branch/BranchWiseEmployee.jsx';
// import Stock_Transfer from './components/Inventory/Stock-Transfer.jsx';
import List_item_Type from './Pages/Manage/List_item_Type';
import Jewellery_Type from './Pages/Manage/Jewellery_Type';
import Category from './Pages/Manage/Product-Management/Category';
import SubCategory from './Pages/Manage/Product-Management/SubCategory';
import Brand from './Pages/Manage/Product-Management/Brand';
import Color from './Pages/Manage/Product-Management/Color';
import Login from './Pages/LoginPage';
import List_return_Type from './Pages/Manage/Product-Management/List_return_Type';
import Product_Size from './Pages/Manage/Product-Management/Product_size';
import Gender from './Pages/Manage/Product-Management/Gender';
import Diamond_Type from './Pages/Manage/Product-Management/Diamond_Type';
import StoneType from './Pages/Manage/Product-Management/StoneType';
import Occasion from './Pages/Manage/Product-Management/Occasion';
import Stock_point from './Pages/Manage/Product-Management/Stock_point';
import Style from './Pages/Manage/Product-Management/Style';
import Design from './Pages/Manage/Product-Management/Design';
import Country from './Pages/Manage/Location-Management/Country';
import City from './Pages/Manage/Location-Management/City';
import Adress_Type from './Pages/Manage/Location-Management/AdressType';
import ControllAccount from './Pages/Supplier/ControllAccount';
import Group from './Pages/Supplier/Group';
import Tax from './Pages/Supplier/Tax';
import List_supplier from './Pages/Supplier/List_supplier';
import CreateSupplier from './Pages/Supplier/CreateSupplier';
import Departments from './Pages/Employees/Departments';
import EmployeeList from './Pages/Employees/EmployeeList';
import PaymentMethodes from './Pages/Employees/PaymentMethodes';
import Genders from './Pages/Employees/Genders';
import Positions from './Pages/Employees/Postitions';
import CustomersList from './Pages/Cutomers/CustomersList.jsx';
import Item from './Pages/Inventory/Item.jsx';
import CreateItem from './Pages/Inventory/CreateItem.jsx';
import Purchase from './Pages/Inventory/Gold/Purchase.jsx';
import PurchaseFix from './Pages/Inventory/Gold/PurchaseFix.jsx';
import ListPurchase from './Pages/Inventory/Gold/ListPurchase.jsx';
import CreateGoldPurchase from './Pages/Inventory/Gold/CreateGoldPurchase.jsx';
import CreateNewPurchase from './Pages/Inventory/Gold/CreateNewPurchase.jsx';
import ViewPurchase from './Pages/Inventory/Gold/ViewPurchase.jsx';
import UpdateGoldPurchase from './Pages/Inventory/Gold/UpdateGoldPurchase.jsx';
import UpdateItem from './Pages/Inventory/UpdateItem.jsx';
import SettingsTax from './Pages/Settings/SettingsTax.jsx';
import Currency from './Pages/Settings/Currency.jsx';
import UnitOfMeasures from './Pages/Settings/UnitOfMeasures.jsx';
import TermsOfPayment from './Pages/Settings/TermsOfPayment.jsx';
import GroupAndPermission from './Pages/Group&Permission/GroupAndPermission.jsx';
import ManagePermissions from './Pages/Group&Permission/ManagePermissions.jsx';
import DiamondPurchhase from './Pages/Inventory/Diamond/DiamondPurchhase.jsx';
import CreateDiamondPurchase from './Pages/Inventory/Diamond/CreateDiamondPurchase.jsx';
import ItemDetials from './Pages/Inventory/Diamond/ItemDetials.jsx';
import PaySlip from './Pages/Employees/PaySlip.jsx';
import Pos from './Pages/Pos.jsx';
import { Provider } from 'react-redux';
import Branches from './Pages/Branch/Branches.jsx';
import BranchWiseEmployee from './Pages/Branch/BranchWiseEmployee.jsx';
import Stock_Transfer from './Pages/Inventory/Stock-Transfer.jsx';
import Logout from './components/LogOut.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthRedirect from './components/AuthRedirect';
import EditDiamondItem from './Pages/Inventory/Diamond/EditDiamondItem.jsx';
import ListDiamond from './Pages/Inventory/Diamond/ListDiamond.jsx';
import CreateDiamond from './Pages/Inventory/Diamond/CreateDiamond.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="w-full h-full m-0 p-0">
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <Routes>
           <Route path="/" element={<AuthRedirect />} />
          <Route path='/login' element={<Login />} />
          <Route path="/logout" element={<Logout />} />


          <Route element={<ProtectedRoute />}>
          <Route path='/pos' element={<Pos />} />
          <Route path='/dashboard' element={<Body />} >
                <Route path='' element={<DashBoard/>}/>
          {/* basic configuration */}
                <Route path='country' element={<Country/>} />
                <Route path='city' element={<City/>} />
                <Route path='address_type' element={<Adress_Type/>} />
                <Route path='stock_point' element={<Stock_point/>} />
                <Route path='return_type' element={<List_return_Type />} />

          {/*  product management */}
                <Route path='item_type' element={<List_item_Type />} />
                <Route path='category' element={<Category />} />
                <Route path='subcategory' element={<SubCategory />} />
                <Route path='brand' element={<Brand />} />
                <Route path='design' element={<Design/>} />
                <Route path='product_gender' element={<Gender/>} />
                <Route path='product_size' element={<Product_Size />} />

                {/* jewellery specs */}
                <Route path='jewellery_type' element={<Jewellery_Type />} />
                 <Route path='diamond_type' element={<Diamond_Type/>} />
                 <Route path='stone_type' element={<StoneType/>} />
                 <Route path='color' element={<Color />} />
                 <Route path='occasion' element={<Occasion/>} />


                 {/* suppliers */}
                 <Route path='control_account' element={<ControllAccount/>} />
                 <Route path='supplier_group' element={<Group/>} />
                 <Route path='tax_category' element={<Tax/>} />
                 <Route path='supplier' element={<List_supplier/>} />


                 {/* Employees */}
                 <Route path='department' element={<Departments/>} />
                 <Route path='role' element={<Positions/>} />
                 <Route path='payment_method' element={<PaymentMethodes/>} />
                 <Route path='gender' element={<Genders/>} />
                 <Route path='employee_list' element={<EmployeeList/>} />

                 {/* customers */}
               
                 <Route path='customers' element={<CustomersList/>} />
                 {/* inventory Operations -submenu*/}
                 {/* inventory Operations -gold*/}

                <Route path='item' element={<Item/>} />
                <Route path='purchase' element={<Purchase/>} />
                <Route path='list_purchase_fix' element={<ListPurchase/>} />
                <Route path='ListPurchase' element={<PurchaseFix/>} />
                <Route path='creategoldpurchase' element={<CreateGoldPurchase/>} />
                <Route path='createnewpurchase/:id' element={<CreateNewPurchase/>} />
                <Route path='viewpurchase/:id' element={<ViewPurchase/>} />
                <Route path='updatepurchase/:itemId/:id' element={<UpdateGoldPurchase/>} />
                <Route path='updateitem/:id' element={<UpdateItem/>} />

''                <Route path='diamond-items' element={<DiamondPurchhase/>} />
                <Route path='createDiamondPurchase' element={<CreateDiamondPurchase/>} />
                <Route path='itemDetials' element={<ItemDetials/>} />
                <Route path='editDiamondItems' element={<EditDiamondItem/>} />
                <Route path='listDiamond/:uuid' element={<ListDiamond/>}/>
                <Route path='createDiamond' element={<CreateDiamond/>}/>


                {/* settings */}
                <Route path='tax' element={<SettingsTax/>} />
                <Route path='currency' element={<Currency/>} />
                <Route path='uom' element={<UnitOfMeasures/>} />
                <Route path='term_payment' element={<TermsOfPayment/>} />

                 {/* Groups & Permissions */}
                <Route path='group_permission' element={<GroupAndPermission/>} />
                <Route path='permission' element={<ManagePermissions/>} />



            <Route path='manage'>
                <Route path='payslip' element={<PaySlip/>} />
                <Route path='style' element={<Style/>} />
            </Route>

            <Route path='supplier'>
              <Route path='Create_supplier' element={<CreateSupplier/>} />
            </Route>
 
            <Route path='employees'>
            </Route>
            <Route path='customers'>
            </Route>
            <Route path='branch'>
              <Route path='branches' element={<Branches/>} />
              <Route path='branchwiseemployee' element={<BranchWiseEmployee/>} />
            </Route>
            <Route path='inventory'>
              <Route path='createItem' element={<CreateItem/>} />
              <Route path='stock-transfer' element={<Stock_Transfer/>} />
              <Route path='gold'>
              
              </Route>
              <Route path='diamond'>
                
              
              </Route>
            </Route>
            <Route path='settings'>
              <Route path='tradesettings'>
               
              </Route>
              <Route path='groupandpermissions'>
                <Route path='group' element={<GroupAndPermission/>} />
                <Route path='managepermissions' element={<ManagePermissions/>} />
                
              </Route>
            </Route>
          </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;