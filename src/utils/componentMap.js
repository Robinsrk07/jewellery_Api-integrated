import List_item_Type from '../Pages/Manage/List_item_Type';
import Jewellery_Type from '../Pages/Manage/Jewellery_Type';
import Category from '../Pages/Manage/Product-Management/Category';
import SubCategory from '../Pages/Manage/Product-Management/SubCategory';
import Brand from '../Pages/Manage/Product-Management/Brand';
import Color from '../Pages/Manage/Product-Management/Color';
import List_return_Type from '../Pages/Manage/Product-Management/List_return_Type';
import Product_Size from '../Pages/Manage/Product-Management/Product_size';
import Gender from '../Pages/Manage/Product-Management/Gender';
import Diamond_Type from '../Pages/Manage/Product-Management/Diamond_Type';
import StoneType from '../Pages/Manage/Product-Management/StoneType';
import Occasion from '../Pages/Manage/Product-Management/Occasion';
import Stock_point from '../Pages/Manage/Product-Management/Stock_point';
import Style from '../Pages/Manage/Product-Management/Style';
import Design from '../Pages/Manage/Product-Management/Design';
import Country from '../Pages/Manage/Location-Management/Country';
import City from '../Pages/Manage/Location-Management/City';
import Adress_Type from '../Pages/Manage/Location-Management/AdressType';
import ControllAccount from '../Pages/Supplier/ControllAccount';
import Group from '../Pages/Supplier/Group';
import Tax from '../Pages/Supplier/Tax';
import List_supplier from '../Pages/Supplier/List_supplier';
import CreateSupplier from '../Pages/Supplier/CreateSupplier';
import Departments from '../Pages/Employees/Departments';
import EmployeeList from '../Pages/Employees/EmployeeList';
import PaymentMethodes from '../Pages/Employees/PaymentMethodes';
import Genders from '../Pages/Employees/Genders';
import Positions from '../Pages/Employees/Postitions';
import CustomersList from '../Pages/Cutomers/CustomersList.jsx';
import Item from '../Pages/Inventory/Item.jsx';
import CreateItem from '../Pages/Inventory/CreateItem.jsx';
import Purchase from '../Pages/Inventory/Gold/Purchase.jsx';
import PurchaseFix from '../Pages/Inventory/Gold/PurchaseFix.jsx';
import ListPurchase from '../Pages/Inventory/Gold/ListPurchase.jsx';
import CreateGoldPurchase from '../Pages/Inventory/Gold/CreateGoldPurchase.jsx';
import CreateNewPurchase from '../Pages/Inventory/Gold/CreateNewPurchase.jsx';
import ViewPurchase from '../Pages/Inventory/Gold/ViewPurchase.jsx';
import UpdateGoldPurchase from '../Pages/Inventory/Gold/UpdateGoldPurchase.jsx';
import UpdateItem from '../Pages/Inventory/UpdateItem.jsx';
import SettingsTax from '../Pages/Settings/SettingsTax.jsx';
import Currency from '../Pages/Settings/Currency.jsx';
import UnitOfMeasures from '../Pages/Settings/UnitOfMeasures.jsx';
import TermsOfPayment from '../Pages/Settings/TermsOfPayment.jsx';
import GroupAndPermission from '../Pages/Group&Permission/GroupAndPermission.jsx';
import ManagePermissions from '../Pages/Group&Permission/ManagePermissions.jsx';
import DiamondPurchhase from '../Pages/Inventory/Diamond/DiamondPurchhase.jsx';
import CreateDiamondPurchase from '../Pages/Inventory/Diamond/CreateDiamondPurchase.jsx';
import ItemDetials from '../Pages/Inventory/Diamond/ItemDetials.jsx';
import PaySlip from '../Pages/Employees/PaySlip.jsx';
import Branches from '../Pages/Branch/Branches.jsx';
import BranchWiseEmployee from '../Pages/Branch/BranchWiseEmployee.jsx';
import Stock_Transfer from '../Pages/Inventory/Stock-Transfer.jsx';

export const componentMap = {
    // Basic Configuration
    'country': Country,
    'city': City,
    'address_type': Adress_Type,
    'stock_point': Stock_point,
    'return_type': List_return_Type,
  
    // Product Management
    'item_type': List_item_Type,
    'category': Category,
    'subcategory': SubCategory,
    'brand': Brand,
    'design': Design,
    'product_gender': Gender,
    'product_size': Product_Size,
    'style': Style,
  
    // Jewellery Specification
    'jewellery_type': Jewellery_Type,
    'diamond_type': Diamond_Type,
    'stone_type': StoneType,
    'color': Color,
    'occasion': Occasion,
  
    // Suppliers
    'control_account': ControllAccount,
    'supplier_group': Group,
    'tax_category': Tax,
    'supplier': List_supplier,
    'Create_supplier': CreateSupplier,

    // Employees
    'department': Departments,
    'role': Positions, 
    'payment_method': PaymentMethodes,
    'gender': Genders,
    'employee_list': EmployeeList,
    'payslip': PaySlip,

    // Customers
    'customers': CustomersList,
  
    // Branch
    'branches': Branches,
    'branchwiseemployee': BranchWiseEmployee,

    // Inventory
    'item': Item,
    'createItem': CreateItem,
    'updateitem': UpdateItem,
    'stock-transfer': Stock_Transfer,
    'purchase': Purchase,
    'purchaseFix': PurchaseFix,
    'ListPurchase': ListPurchase,
    'creategoldpurchase': CreateGoldPurchase,
    'createnewpurchase': CreateNewPurchase,
    'viewpurchase': ViewPurchase,
    'updatepurchase': UpdateGoldPurchase,
    'purchasediamond': DiamondPurchhase,
    'createDiamondPurchase': CreateDiamondPurchase,
    'itemDetials': ItemDetials,
  
    // Settings
    'tax': SettingsTax,
    'currency': Currency,
    'uom': UnitOfMeasures,
    'term_payment': TermsOfPayment,
  
    // Groups & Permissions
    'group_permission': GroupAndPermission,
    'permission': ManagePermissions,
  }; 