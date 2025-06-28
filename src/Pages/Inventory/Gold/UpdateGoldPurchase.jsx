import { useEffect, useState } from "react";
import PurchaseUtils from "../../../models/PurchaseUtils";
import { toast } from "react-toastify";
import PurchaseModel from "../../../models/PurchaseModel";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
const UpdateGoldPurchase = () => {
  const [data, setData] = useState({
    purchase_type: '',
    items: '',
    design: '',
    brand: '',
    made_in: '',
    size: '',  
    style: '',
    occasion: '',
    metal_color: '',
    gender: '',
    stone_type: '',
    multi_stone_rate: '',
    gross_weight: '',
    discount: '',
    tag_line_1: '',
    tag_line_2: '',
    tag_line_3: '',
    tag_line_4: '',
    tag_defenition: '',
    alias: '',
    status: '',
    description: '',
    item_type: '',
    terms_of_payment: '',
    due_date: '',
    supplier: '',
    reference_no: '',
    stock_point: '',
    supplier_currency: '',
    buyer_currency: '',
    document_currency: '',
    making_rate: '',
    stone_rate: '',
    stone_weight: '',
    multi_stone_weight: '',
    address: '',
    
  });




  

  const [errors, setErrors] = useState({});
  const [UtilsData, setUtilsData] = useState([]);
  const {itemId,id}= useParams()
  const auth= useSelector((state) => state.auth);
  const {login_type,login_id} =auth
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [purchaseData,setPurchaseData] =useState([])
  console.log(purchaseData);
  
  const FetchPurchaseData =async()=>{
   try{
   const response = await PurchaseModel.getPurchaseList(login_id,login_type,limit,page,search,status,id)
    setPurchaseData(response.data.data);
    }catch(error){
    console.error("Error fetching purchase data:", error);
    }
  }

  useEffect(() => {
    FetchPurchaseData(); 
  }, [limit, page, search, status]);
  console.log(itemId,id);
  const requiredItem = purchaseData.filter((item)=>item.id == itemId )
  console.log(requiredItem);
  


  const FetUtilsdata = async () => {
    try {
      const response = await PurchaseUtils.getPurchaseUtils();
      setUtilsData(response.data);
      console.log("Utils Data fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching utils data:", error);
    }
  }
//const requiredFields = ['items', 'making_rate', 'stone_rate', 'stone_weight', 'gross_weight', 'supplier', 'stock_point', 'document_currency'];

  // Helper function to extract specific data from the utils
  const getUtilsData = (key) => {
    if (!UtilsData?.data) return [];
    
    const item = UtilsData.data.find(item => item[key] !== undefined);
    return item ? item[key] : [];
  };

  // Helper function to find ID by name
  const findIdByName = (key, name) => {
    const data = getUtilsData(key);
    const item = data.find(item => item.name === name);
    return item ? item.id : null;
  };

  // Helper function to get display value for select fields
  // This function converts brand names (like "Cartier") to IDs (like 123) for select fields
  // When the API returns a name, we find the corresponding ID from utils data
  // When the API returns an ID, we use it directly
  const getDisplayValue = (key, value) => {
    if (!value) return '';
    // If value is already a number (ID), return it
    if (!isNaN(value)) return value;
    // If value is a string (name), find the corresponding ID
    return findIdByName(key, value);
  };

const validateForm = () => {
  const newErrors = {};
  const requiredFields = [

  ];
  requiredFields.forEach(field => {
    if (!data[field]?.toString().trim()) {
      newErrors[field] = 'This field is required';
    }
  });
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
 

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setData({
        ...data,
        [name]: files[0] 
      });
    } else {
      setData({
        ...data,
        [name]: value
      });
    }
  };


  
  const handleSubmit = async() => {
    console.log('Submitting data:', data);
    if(!validateForm()){
      toast.error('Please fill all required fields');
      return;
    }
    
    console.log('Processed submit data:', data);
    
    try{
      const response = await PurchaseModel.EditPurchase(data, itemId);
      console.log('Response:', response);
      toast.success("Purchase edited successfully!");
    } catch(error){
      console.error("Error updating purchase:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(`Error: ${error.response.data?.message || 'Unable to update Purchase'}`);
      } else {
        toast.error("Unable to update Purchase, Please try again later.");
      }
    }
  };
 

  useEffect(() => {
    FetUtilsdata()
  }, [])

  useEffect(() => {
    if (purchaseData.length > 0 && itemId) {
      const requiredItem = purchaseData.find((item) => item.id == itemId);
      
      if (requiredItem) {
        console.log('Raw API data for item:', requiredItem);
        console.log('Available fields:', Object.keys(requiredItem));
        
        // Map existing data to form fields - store IDs, not names
        setData({
          purchase_type: requiredItem.purchase_type || '',
          items: requiredItem.items_id || requiredItem.items || '', // Use items_id if available
          design: requiredItem.design_id || requiredItem.design || '',
          brand: requiredItem.brand_id || requiredItem.brand || '', // Store brand name, will be converted to ID by helper
          made_in: requiredItem.made_in_id || requiredItem.made_in || '',
          size: requiredItem.size_id || requiredItem.size || '',
          style: requiredItem.style_id || requiredItem.style || '',
          occasion: requiredItem.occasion_id || requiredItem.occasion || '',
          metal_color: requiredItem.metal_color_id || requiredItem.metal_color || '',
          gender: requiredItem.gender_id || requiredItem.gender || '',
          stone_type: requiredItem.stone_type_id || requiredItem.stone_type || '',
          multi_stone_rate: requiredItem.adjusted_multi_stone_rate || '',
          gross_weight: requiredItem.gross_weight || '',
          discount: requiredItem.discount || '',
          tagline_1: requiredItem.tagline_1 || '',
          tagline_2: requiredItem.tagline_2 || '',
          tagline_3: requiredItem.tagline_3 || '',
          tagline_4: requiredItem.tagline_4 || '',
          tagdefenition: requiredItem.tag_defenition || '',
          alias: requiredItem.alias || '',
          status: requiredItem.status || '',
          description: requiredItem.description || '',
          item_type: requiredItem.item_type_id || requiredItem.item_type || '',
          terms_of_payment: requiredItem.terms_of_payment_id || requiredItem.terms_of_payment || '',
          due_date: requiredItem.due_date || '',
          supplier: requiredItem.supplier_id || requiredItem.supplier || '',
          reference_no: requiredItem.reference_no || '',
          stock_point: requiredItem.stock_point_id || requiredItem.stock_point || '',
          supplier_currency: requiredItem.supplier_currency || '',
          buyer_currency: requiredItem.buyer_currency_id || requiredItem.buyer_currency || '',
          document_currency: requiredItem.document_currency_id || requiredItem.document_currency || '',
          making_rate: requiredItem.adjusted_making_rate || '',
          stone_rate: requiredItem.adjusted_stone_rate || '',
          stone_weight: requiredItem.stone_weight || '',
          multi_stone_weight: requiredItem.multi_stone_weight || '',
          address: requiredItem.address || '',
        });
      }
    }
  }, [purchaseData, itemId]);

  return (
    <div 
      className="bg-white w-full
        max-w-[99vw] 
        xl:max-w-[90vw] 
        2xl:max-w-[95vw] 
        h-auto max-h-[85vh] 
        min-h-[80vh]
        rounded-xl px-4 md:px-8 lg:px-12
        mx-auto overflow-auto custom-scrollbar"
      style={{ fontFamily: 'Open Sans' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 " style={{ padding:"20px"}}>
        
        {/* Item Type */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Item Type</label>
          <select 
            name="item_type"
            value={data.item_type}
            onChange={handleChange}
            style={{paddingLeft:'20px'}}
            className={`select select-bordered select-sm w-full bg-gray-200 text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 ${
              errors.item_type ? 'border-red-500' : ''
            }`}
          >
            <option value="" disabled>Select Item Type</option>
            {getUtilsData('item_type') && (
              <option value={getUtilsData('item_type').id}>
                {getUtilsData('item_type').name}
              </option>
            )}
          </select>
          {errors.item_type && (
            <p className="text-red-500 text-xs mt-1">{errors.item_type}</p>
          )}
        </div>

        {/* Document Currency */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Document Currency</label>
          <select 
            name="document_currency"
            value={data.document_currency}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className={`select select-bordered select-sm w-full bg-gray-200 text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 ${
              errors.document_currency ? 'border-red-500' : ''
            }`}
          >
            <option value="" disabled>Select Document Currency</option>
            {getUtilsData('default_currency') && (
              <option value={getUtilsData('default_currency').id}>
                {getUtilsData('default_currency').name} ({getUtilsData('default_currency').code})
              </option>
            )}
            {getUtilsData('buyer_currency') && (
              <option value={getUtilsData('buyer_currency').id}>
                {getUtilsData('buyer_currency').name} ({getUtilsData('buyer_currency').code})
              </option>
            )}
          </select>
          {errors.document_currency && (
            <p className="text-red-500 text-xs mt-1">{errors.document_currency}</p>
          )}
        </div>

        {/* Terms Of Payment */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Terms Of Payment</label>
          <select 
            name="terms_of_payment"
            value={data.terms_of_payment}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className={`select bg-white select-bordered select-sm w-full text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 ${
              errors.terms_of_payment ? 'border-red-500' : ''
            }`}
          >
            <option value="" disabled>Select Terms of Payment</option>
            {getUtilsData('terms_of_payment').map(term => (
              <option key={term.id} value={term.id} className="text-sm text-gray-500">
                {term.name}
              </option>
            ))}
          </select>
          {errors.terms_of_payment && (
            <p className="text-red-500 text-xs mt-1">{errors.terms_of_payment}</p>
          )}
        </div>

        {/* Date */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Date</label>
          <input
            type="date"
            name="due_date"
            value={data.due_date}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className="input input-bordered bg-white input-sm w-full text-gray-500 rounded-lg 
                    focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
                    [&::-webkit-calendar-picker-indicator]:opacity-50"
            placeholder="Select date"
          />
        </div>

        {/* Supplier */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Supplier</label>
          <select 
            name="supplier"
            value={data.supplier}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className={`select select-bordered bg-white select-sm w-full text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 ${
              errors.supplier ? 'border-red-500' : ''
            }`}
          >
            <option value="" disabled>Select Supplier</option>
            {getUtilsData('supplier_list').map(supplier => (
              <option key={supplier.id} value={supplier.id} className="text-sm text-gray-500">
                {supplier.name} ({supplier.code})
              </option>
            ))}
          </select>
          {errors.supplier && (
            <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>
          )}
        </div>

        {/* Reference Number */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Reference Number</label>
          <input
            type="text"
            name="reference_no"
            value={data.reference_no}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            placeholder="Type here"
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Stock Point */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Stock Point</label>
          <select 
            name="stock_point"
            value={data.stock_point}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className={`select select-bordered bg-white select-sm w-full text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 ${
              errors.stock_point ? 'border-red-500' : ''
            }`}
          >
            <option value="" disabled>Select Stock Point</option>
            {getUtilsData('stock_point').map(point => (
              <option key={point.id} value={point.id} className="text-sm text-gray-500">
                {point.name}
              </option>
            ))}
          </select>
          {errors.stock_point && (
            <p className="text-red-500 text-xs mt-1">{errors.stock_point}</p>
          )}
        </div>

        {/* Buyer Currency */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Buyer Currency</label>
          <select 
            name="buyer_currency"
            value={data.buyer_currency}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className={`select select-bordered bg-white select-sm w-full text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 ${
              errors.buyer_currency ? 'border-red-500' : ''
            }`}
          >
            <option value="" disabled>Select Buyer Currency</option>
            {getUtilsData('buyer_currency') && (
              <option value={getUtilsData('buyer_currency').id}>
                {getUtilsData('buyer_currency').name} ({getUtilsData('buyer_currency').code})
              </option>
            )}
          </select>
          {errors.buyer_currency && (
            <p className="text-red-500 text-xs mt-1">{errors.buyer_currency}</p>
          )}
        </div>

        {/* Currency Rate */}
        <div className="w-full text-gray-900">
          <label className="text-xs font-bold text-[#344767]">Currency Rate</label>
          <input
            type="number"
            name="supplier_currency"
            value={data.supplier_currency}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className={`input input-bordered bg-white input-sm w-full text-gray-900 rounded-lg 
                    focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
                    [&::-webkit-calendar-picker-indicator]:opacity-50 ${
                      errors.supplier_currency ? 'border-red-500' : ''
                    }`}
            placeholder="$1.00000@3.6725000"
          />
          {errors.supplier_currency && (
            <p className="text-red-500 text-xs mt-1">{errors.supplier_currency}</p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="flex justify-center items-center h-[50px]">
        <hr className="w-full border-gray-300" />
      </div>   

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7" style={{ padding:"20px"}}>
        
        {/* Purchase Type */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Purchase Type</label>
          <select 
            name="purchase_type"
            value={data.purchase_type}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className={`select select-bordered bg-white select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 ${
              errors.purchase_type ? 'border-red-500' : ''
            }`}
          >
            <option value="" disabled>Select Purchase Type</option>
            {getUtilsData('purchase_type').map(type => (
              <option key={type} value={type} className="text-sm text-gray-500">
                {type}
              </option>
            ))}
          </select>
          {errors.purchase_type && (
            <p className="text-red-500 text-xs mt-1">{errors.purchase_type}</p>
          )}
        </div>

        {/* Items */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Items</label>
          <select 
            name="items"
            value={data.items}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className={`select select-bordered bg-white select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 ${
              errors.items ? 'border-red-500' : ''
            }`}
          >
            <option value="" disabled>Select an item</option>
            {getUtilsData('inventory_items').map(item => (
              <option key={item.id} value={item.id} className="text-sm text-gray-500">
                {item.code}
              </option>
            ))}
          </select>
          {errors.items && (
            <p className="text-red-500 text-xs mt-1">{errors.items}</p>
          )}
        </div>

        {/* Design */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Design</label>
          <select 
            name="design"
            value={getDisplayValue('product_design', data.design)}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className="select select-bordered bg-white select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Design</option>
            {getUtilsData('product_design').map(design => (
              <option key={design.id} value={design.id} className="text-sm text-gray-500">
                {design.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Brand</label>
          <select 
            name="brand"
            value={getDisplayValue('product_brand', data.brand)}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className="select select-bordered select-sm w-full bg-white text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Brand</option>
            {getUtilsData('product_brand').map(brand => (
              <option key={brand.id} value={brand.id} className="text-sm text-gray-500">
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Made in */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Made in</label>
          <select 
            name="made_in"
            value={data.made_in}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className="select select-bordered bg-white select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Country</option>
             <option className="text-sm text-gray-500" value="17">Bolivia</option>
              <option className="text-sm text-gray-500" value="18">Brazil</option>
          </select>
        </div>

        {/* Size */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Size</label>
          <select 
            name="size"
            value={data.size}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className="select select-bordered bg-white select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Size</option>
            {getUtilsData('product_size').map(size => (
              <option key={size.id} value={size.id} className="text-sm text-gray-500">
                {size.name}
              </option>
            ))}
          </select>
        </div>

        {/* Style */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Style</label>
          <select 
            name="style"
            value={data.style}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className="select select-bordered bg-white select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Style</option>
            {getUtilsData('product_style').map(style => (
              <option key={style.id} value={style.id} className="text-sm text-gray-500">
                {style.name}
              </option>
            ))}
          </select>
        </div>

        {/* Occasion */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Occasion</label>
          <select 
            name="occasion"
            value={data.occasion}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className="select select-bordered bg-white select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Occasion</option>
            {getUtilsData('occasion').map(occasion => (
              <option key={occasion.id} value={occasion.id} className="text-sm text-gray-500">
                {occasion.name}
              </option>
            ))}
          </select>
        </div>

        {/* Metal Color */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Metal Color</label>
          <select 
            name="metal_color"
            value={data.metal_color}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className="select select-bordered bg-white select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Metal Color</option>
            {getUtilsData('product_color').map(color => (
              <option key={color.id} value={color.id} className="text-sm text-gray-500">
                {color.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Gender</label>
          <select 
            name="gender"
            value={data.gender}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className="select select-bordered bg-white select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Gender</option>
            {getUtilsData('product_gender').map(gender => (
              <option key={gender.id} value={gender.id} className="text-sm text-gray-500">
                {gender.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stone Type */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Stone Type</label>
          <select 
            name="stone_type"
            value={data.stone_type}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className="select select-bordered bg-white select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Stone Type</option>
            {getUtilsData('stone_type').map(stone => (
              <option key={stone.id} value={stone.id} className="text-sm text-gray-500">
                {stone.name}
              </option>
            ))}
          </select>
        </div>

        {/* Making Rate */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Making Rate</label>
          <input
            type="number"
            name="making_rate"
            value={data.making_rate}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            min="0"
            placeholder="Making rate"
            className="input input-bordered bg-white text-gray-400 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Stone Rate */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Stone Rate</label>
          <input
            type="number"
            name="stone_rate"
            value={data.stone_rate}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            min="0"
            placeholder="Stone rate"
            className="input input-bordered bg-white text-gray-400 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Multi Stone Rate */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Multi Stone Rate</label>
          <input
            type="number"
            name="multi_stone_rate"
            value={data.multi_stone_rate}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            min="0"
            placeholder="Multi stone rate"
            className="input input-bordered input-sm w-full bg-white text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Stone Weight */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Stone Weight</label>
          <input
            type="number"
            name="stone_weight"
            value={data.stone_weight}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            min="0"
            placeholder="Stone weight"
            className="input input-bordered input-sm bg-white text-gray-400 w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Multi Stone Weight */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Multi Stone Weight</label>
          <input
            type="number"
            name="multi_stone_weight"
            value={data.multi_stone_weight}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            min="0"
            placeholder="Multi Stone weight"
            className="input input-bordered input-sm w-full bg-white text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Gross Weight */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Gross Weight</label>
          <input
            type="number"
            name="gross_weight"
            value={data.gross_weight}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            min="0"
            placeholder="Gross Weight"
            className="input input-bordered bg-white text-gray-400 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Discount */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Discount</label>
          <input
            type="number"
            name="discount"
            value={data.discount}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            min="0"
            placeholder="Discount"
            className="input input-bordered bg-white text-gray-400 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Tagline 1 */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Tagline 1</label>
          <input
            type="text"
            name="tag_line_1"
            value={data.tagline_1}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            placeholder="Tagline 1"
            className="input input-bordered input-sm w-full bg-white text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Tagline 2 */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Tagline 2</label>
          <input
            type="text"
            name="tag_line_2"
            value={data.tagline_2}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            placeholder="Tagline 2"
            className="input input-bordered input-sm w-full bg-white text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Tagline 3 */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Tagline 3</label>
          <input
            type="text"
            name="tag_line_3"
            value={data.tagline_3}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            placeholder="Tagline 3"
            className="input input-bordered input-sm w-full bg-white text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Tagline 4 */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Tagline 4</label>
          <input
            type="text"
            name="tag_line_4"
            value={data.tagline_4}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            placeholder="Tagline 4"
            className="input input-bordered input-sm w-full bg-white text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Tag Definition */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Tag Definition</label>
          <input
            type="text"
            name="tag_defenition"
            value={data.tag_defenition}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            placeholder="Tag Definition"
            className="input input-bordered input-sm w-full bg-white text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Alias */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Alias</label>
          <input
            type="text"
            name="alias"
            value={data.alias}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            placeholder="Alias"
            className="input input-bordered input-sm w-full bg-white text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

        {/* Status */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Status</label>
          <select 
            name="status"
            value={data.status}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className="select select-bordered select-sm w-full bg-white  text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="True">Active</option>
            <option value="False">Inactive</option>
          </select>
        </div>

        {/* Address */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Description</label>
          <textarea 
            name="description"
            value={data.description}
            onChange={handleChange}
                 style={{paddingLeft:'20px'}}
            className="textarea textarea-gray rounded-lg bg-white text-gray-400 border-gray-300" 
            placeholder="Description"
          />
        </div>
      </div>

      <div className="flex w-full h-[20vh] justify-end gap-2 text-white " style={{padding:'20px'}}>
        <button 
          onClick={handleSubmit}
          className="btn border-none text-white text-xs bg-[#5E72E4] w-full sm:w-1/4 md:w-[10vw] rounded-lg"
        >
          Save
        </button>
        <button className="btn text-white border-none text-xs bg-[#5E72E4] w-full sm:w-1/4 md:w-[15vw] rounded-lg">
          Save & Continue Adding
        </button>
      </div>
    </div>
  );
};

export default UpdateGoldPurchase;








