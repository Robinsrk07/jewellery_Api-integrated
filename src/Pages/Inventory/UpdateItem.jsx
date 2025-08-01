import { Link } from "react-router";
import { useEffect, useState } from "react";
import UtilsGetModel from "../../models/Utils_getModel";
import { toast } from "react-toastify";
import GoldItemModel from "../../models/GoldItem";
import { useParams } from "react-router";
import TaxModel from "../../models/TaxModel";
import TableSkelton from "../../components/tableSkelton";
import CountryModel from "../../models/countryModel";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useRef } from "react";

const UpdateItem = () => {
  const [data, setData] = useState({
    code: '',
    name: '',
    item_type: '',
    uom: '',
    category: '',
    subcategory: '',
    jewellery_type: '',
    brand: '',
    making_calculation_on: '',
    is_scrap_item: '',
    is_serialized: '',
    is_gift_item: '',
    return_as: '',
    is_repair_item: '',
    item_image: null,
    default_tax: '',
    made_in: '',
    making_buffer_value: '',
    stone_buffer_value: '',
    stone_sale_markup: '',
    making_sale_markup: '',
    buffer_consider_type: '',
    hsn_code: '',
    status: '',
    prefix: '',
    id_length: ''
  });
  const [UtilsData, setUtilsData] = useState([]);
  const [goldItemData, setGoldItemData] = useState([]);
  const navigate = useNavigate()
  const [selectedItem, setItem] = useState([]);
  const [country,setCountry]= useState([])
  const [tax,setTax]= useState([])
  const { id } = useParams();
  const auth = useSelector((state) => state.auth);
  const { login_type, login_id } = auth;
  const [limit] = useState(10);
  const [page] = useState(1);
  const [search] = useState('');
  const [loading,setIsLoading] = useState(false)
  const [status] = useState('');
  const [errors, setErrors] = useState({});
const toBoolString = (val) => val === true ? "True" : val === false ? "False" : "";

  // Fetch utils data
  useEffect(() => {
    const FetUtilsdata = async () => {
      try {
        const response = await UtilsGetModel.getUtilsData();
        setUtilsData(response.data);
      } catch (error) {
        console.error("Error fetching utils data:", error);
      }
    };
    FetUtilsdata();
  }, []);

  // Fetch gold item data
  useEffect(() => {
    const FetchGoldItemData = async () => {
      try {
        const response = await GoldItemModel.getGoldItem(login_type, login_id, limit, page, search, status);
        setGoldItemData(response.data.data);
      } catch (error) {
        console.error("Error fetching gold item data:", error);
      }
    };
    FetchGoldItemData();
  }, [login_type, login_id, limit, page, search, status]);

  // Set selected item when goldItemData and id are available
  useEffect(() => {
    if (id && goldItemData.length > 0) {
      const itemTobeUpdate = goldItemData.find(item => item.id.toString() === id.toString());
      if (itemTobeUpdate) {
        setItem(itemTobeUpdate);
      }
    }
  }, [id, goldItemData]);

  // Fetch item details and update form data
  useEffect(() => {
    setIsLoading(true)
    const fetchItemDetials = async (uuid) => {
      try {
        const response = await GoldItemModel.getSingleItem(uuid);
        const itemTomap = response?.data?.data || {};
        
        setData({
          code: itemTomap.code || '',
          name: itemTomap.name || '',
          item_type: itemTomap.item_type || '',
          uom: itemTomap.uom || '',
          category: itemTomap.category || '',
          subcategory: itemTomap.subcategory?.toString() || '',
          jewellery_type: itemTomap.jewellery_type || '',
          brand: itemTomap.brand || '',
          making_calculation_on: itemTomap.making_calculation_on || '',
           is_scrap_item: toBoolString(itemTomap.is_scrap_item),
          is_serialized: toBoolString(itemTomap.is_serialized),
          is_gift_item: toBoolString(itemTomap.is_gift_item),
          return_as: itemTomap.return_as || '',
          is_repair_item: toBoolString(itemTomap.is_repair_item),
          item_image: itemTomap.item_image || null,
          default_tax: itemTomap.default_tax || '',
          made_in: itemTomap.made_in || '',
          making_buffer_value: itemTomap.making_buffer_value || '',
          stone_buffer_value: itemTomap.stone_buffer_value || '',
          stone_sale_markup: itemTomap.stone_sale_markup || '',
          making_sale_markup: itemTomap.making_sale_markup || '',
          buffer_consider_type: toBoolString(itemTomap.buffer_consider_type),
          status: toBoolString(itemTomap.status),
          prefix: itemTomap.prefix || '',
          id_length: itemTomap.id_length || ''
        });
      } catch (error) {
        console.error(error);
      } finally {
       setIsLoading(false); // <--- put here
    }
    };
    if (selectedItem && selectedItem.uuid) {
      fetchItemDetials(selectedItem.uuid);
    }
  }, [selectedItem,UtilsData]);

  const refs ={
       code:useRef(null),
       name:useRef(null),
       item_type:useRef(null),
       uom:useRef(null),
       category: useRef(null),          // ✅ ADD THIS
       subcategory:useRef(null),
       jewellery_type:useRef(null),
       making_calculation_on:useRef(null),
       is_serialized:useRef(null),
       status:useRef(null),
       hsn_code:useRef(null),
       prefix:useRef(null),
       making_buffer_value: useRef(null),
       stone_buffer_value:useRef(null),
       stone_sale_markup: useRef(null),
       
      }


  const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  // Clean the data: remove null, undefined, and empty string values
  const cleanedData = Object.fromEntries(
    Object.entries(data).filter(
      ([_, value]) => value !== null && value !== '' && value !== undefined
    )
  );

 

  if (!validateForm()) {
    toast.error("Please fix form errors");
    return;
  }

  try {
    const response = await GoldItemModel.updateGoldItem(cleanedData, id);
    navigate('/dashboard/item')
    if (response.data) {
      toast.success(response.data.message || "Item updated successfully!");
    } else {
      console.warn("Unexpected response structure:", response);
      toast.success("Item updated (check console for details)");
    }
    } catch (error) {
    console.error(error);
    const errorData = error.response?.data;

    let fieldErrors = {};
    let message = "Unable to create item. Please try again later.";

    if (errorData?.errors) {
      const errors = errorData.errors;

      // Handle non_field_errors (toast only)
      if (errors.non_field_errors && Array.isArray(errors.non_field_errors)) {
        message = errors.non_field_errors.join(' ');
      }

      // Handle field-level errors (add to state)
      const validFieldKeys = Object.keys(refs);
      const serverFieldErrors = Object.entries(errors).filter(
        ([field]) => validFieldKeys.includes(field)
      );

      if (serverFieldErrors.length > 0) {
        fieldErrors = Object.fromEntries(
          serverFieldErrors.map(([field, msgs]) => [field, Array.isArray(msgs) ? msgs[0] : msgs])
        );

        // Set errors to state
        setErrors(prev => ({ ...prev, ...fieldErrors }));

        // Focus first invalid field
        const firstField = serverFieldErrors[0][0];
        if (firstField && refs[firstField]?.current) {
          refs[firstField].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            refs[firstField].current?.focus();
          }, 0);
        }

        const firstError = Object.values(fieldErrors)[0];
        message = firstError || message;
      }
    }

    // Always show a toast
    toast.error(message);
  }
};

const validateForm = () => {
  const newErrors = {};
  let firstInvalidField = null;

  // ✅ Format validation FIRST
  if (data.code && !/^[A-Z0-9]{3,10}$/.test(data.code)) {
   newErrors.code = 'Code must be 3–10 uppercase letters or numbers (A–Z, 0–9)';
    firstInvalidField = 'code';
  }
  if (data.hsn_code && !/^\d{4}(\d{2})?(\d{2})?$/.test(data.hsn_code)) {
    newErrors.hsn_code = 'HSN must be 4, 6, or 8 digits';
    if (!firstInvalidField) firstInvalidField = 'hsn_code';
  }

  if (data.prefix && !/^[A-Z]{1,5}$/.test(data.prefix)) {
    newErrors.prefix = 'Prefix must be 1–5 uppercase letters';
    if (!firstInvalidField) firstInvalidField = 'prefix';
  }

  

  if (data.name && !/^[A-Za-z0-9\s]{3,50}$/.test(data.name)) {
    newErrors.name = 'Name must be 3–50 alphanumeric characters';
    if (!firstInvalidField) firstInvalidField = 'name';
  }

  // ✅ Required field validation NEXT
  const requiredFields = [
    'code',
    'item_type',
    'uom',
    'category',
    'subcategory',
    'jewellery_type',
    'making_calculation_on',
    'is_serialized',
    'status',
  ];

  for (const field of requiredFields) {
    if (!data[field]?.toString().trim()) {
      newErrors[field] = 'This field is required';
      if (!firstInvalidField) firstInvalidField = field;
    }
  }

  setErrors(newErrors);

  // ✅ Focus after validation is complete
  if (firstInvalidField && refs[firstInvalidField]?.current) {
    refs[firstInvalidField].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      refs[firstInvalidField].current?.focus();
    }, 0); // prevents occasional "element not focusable" issues
  }

  return Object.keys(newErrors).length === 0;
};


  const getUtilsData = (key) => {
    if (!UtilsData?.data) return [];
    
    const item = UtilsData.data.find(item => item[key] !== undefined);
    return item ? item[key] : [];
  };

const getSubcategories = () => {
  if (!data.category) return [];
  const categories = getUtilsData('categories');
  const selectedCategory = categories.find(cat => 
    cat.category_id == data.category || // Try with ==
    cat.id == data.category ||          // Try with id property
    cat.category_id === parseInt(data.category) // Try converting to number
  );
  return selectedCategory ? selectedCategory.sub_cat : [];
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
    setErrors(prevErrors => ({
    ...prevErrors,
    [name]: undefined
  }));
  };
  useEffect(()=>{
 const fetchCounty = async()=>{
  try{
  const res = await CountryModel.getCountries(login_id,login_type, 1000, page, search, status)
  setCountry(res?.data?.data)
  }catch(error){
  console.error(error)
  }
 }
 fetchCounty()
},[])
  useEffect(()=>{
   const fetchTax = async()=>{
  try{
  const res = await TaxModel.getTax(login_id,login_type, 1000, page, search, status)
  setTax(res?.data?.data)
  }catch(error){
  console.error(error)
  }
 }
 fetchTax()
  },[])

//   console.log("Categories from utils:", getUtilsData('categories'));
// console.log("Looking for category ID:", data.category);

// const categories = getUtilsData('categories');
// console.log("All categories:", categories);
// categories.forEach((cat, index) => {
//   console.log(`Category ${index}:`, {
//     category_id: cat.category_id,
//     category_name: cat.category_name,
//     type_of_category_id: typeof cat.category_id
//   });
// });

if (loading) {
  return (  <div 
      className="bg-white w-full
        max-w-[99vw] 
        xl:max-w-[90vw] 
        2xl:max-w-[95vw] 
        h-auto max-h-[85vh] 
        min-h-[80vh]
        rounded-xl px-4 md:px-8 lg:px-12
        mx-auto overflow-auto custom-scrollbar flex items-center justify-center"
      style={{ fontFamily: 'Open Sans' }}
    >
<TableSkelton/>

    </div>)
}

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

      <Link to='/dashboard/item'>
      <div className="flex justify-end   h-[30px]" style={{padding:'10px'}}>
        <button className="btn bg-blue-500 border-none w-[100px] h-[30px] text-white ">Back</button>
      </div></Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7" style={{padding:'30px'}} >
          {/* code */}
            <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Code<span className="text-red-500 text-[14px]">*</span></label>
          <input
            type="text"
            name='code'
            ref={refs.code}
            required
            value={data.code}
            placeholder="Type here"
            style={{ paddingLeft: '10px' }}
            onChange={handleChange}
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
          {errors.code && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.code}</span>}
        </div>
      
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Name</label>
          <input
            type="text"
            name='name'
            required
             ref={refs.name}
            value={data.name }
            onChange={handleChange}
            placeholder="Type here"
            style={{ paddingLeft: '10px' }}
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
          {errors.name && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.name}</span>}
        </div>


        {/* item type */}
           <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Item Type<span className="text-red-500 text-[14px]">*</span></label>
          <select  
            name="item_type"
            onChange={handleChange}
            ref={refs.item_type}
            value={data.item_type}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option  className="text-xs text-gray-400" value=""> --Select Item Type--</option>
            {Array.isArray(getUtilsData('item_type'))
              ? getUtilsData('item_type').map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))
              : getUtilsData('item_type') && (
                  <option value={getUtilsData('item_type').id}>
                    {getUtilsData('item_type').name}
                  </option>
                )
            }
          </select>
                    {errors.item_type && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.item_type}</span>}

        </div>
        {/* uom */}

        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">UOM<span className="text-red-500 text-[14px]">*</span></label>
          <select
            name="uom"
            ref={refs.uom}
            onChange={handleChange}
            value={data.uom}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select UOM</option>
            { 
              getUtilsData('uom').map(uom => (
                <option key={uom.id} value={uom.id} className="text-sm text-gray-500">
                  {uom.name}
                </option>
              ))
            }
          </select>
          {errors.uom && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.uom}</span>}
        </div>

        {/* category */}
         <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Category<span className="text-red-500 text-[14px]">*</span></label>
          <select
            name="category"
            onChange={handleChange}
            ref={refs.category}
            value={data.category}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Category</option>
            {getUtilsData('categories').map(category => (
              <option 
                key={category.category_id} 
                value={category.category_id}
                className="text-sm text-gray-500"
              >
                {category.category_name}
              </option>
            ))}
          </select>
                    {errors.category && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.category}</span>}

        </div>
  
       {/* sub Category */}
         <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Sub Category<span className="text-red-500 text-[14px]">*</span></label>
          <select
            name="subcategory"
            value={ data.subcategory}
            ref={refs.subcategory}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Subcategory</option>
            {getSubcategories().map(subCat => (
              <option key={subCat.id}  value={subCat.id.toString()} className="text-sm text-gray-500">
                {subCat.name}
              </option>
            ))}
          </select>
                              {errors.subcategory && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.subcategory}</span>}

        </div>
            {/* jewellery type */}
         <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Jewellery Type<span className="text-red-500 text-[14px]">*</span></label>
          <select
            name="jewellery_type"
            value={data.jewellery_type}
            ref={refs.jewellery_type}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full text-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select jewellery type</option>
            
             { getUtilsData('jewelley_type').map(type => (
                <option key={type.id} value={type.id} className="text-sm text-gray-500">
                  {type.name}
                </option>
              ))}
            
          </select>
         {errors.jewellery_type && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.jewellery_type}</span>}

        </div>
                {/* brand */}
      <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Brand</label>
          <select
            name="brand"
            value={data.brand}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full text-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Brand</option>
            {getUtilsData('product_brand').map(brand => (
              <option key={brand.id} value={brand.id} className="text-sm text-gray-500">
                {brand.name}
              </option>
            ))}
          </select>
        </div>


        {/* --------------- */}

          <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Making Calculation On<span className="text-red-500 text-[14px]">*</span></label>
          <select
            name="making_calculation_on"
            value={data.making_calculation_on}
            onChange={handleChange}
            ref={refs.making_calculation_on}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Calculation</option>
            {getUtilsData('making_calculation').map((calc, index) =>
              Object.entries(calc).map(([key, label]) => (
                <option key={`${key}-${index}`} value={key} className="text-sm text-gray-500">
                  {label}
                </option>
              ))
            )}
          </select>
          {errors.making_calculation_on && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.making_calculation_on}</span>}
</div>
    {/* --------------- */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">--Is Scrap Item--</label>
          <select
            name="is_scrap_item"
            value={data.is_scrap_item}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" >--Select Option--</option>
            <option value="True" className="text-sm text-gray-500">Yes</option>
            <option value="False" className="text-sm text-gray-500">No</option>
          </select>
        </div>
{/* --------------- */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Is Serialized<span className="text-red-500 text-[14px]">*</span></label>
          <select
            name="is_serialized"
            value={data.is_serialized}
            ref={refs.is_serialized}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" >--Select Option--</option>
            <option value="True" className="text-sm text-gray-500">Yes</option>
            <option value="False" className="text-sm text-gray-500">No</option>
          </select>
          {errors.is_serialized && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.is_serialized}</span>}
        </div>

        


       
 {/* --------------- */}

         <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Is Gift Item</label>
          <select
            name="is_gift_item"
          
            value={data.is_gift_item}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" >--Select Option--</option>
            <option value="True" className="text-sm text-gray-500">Yes</option>
            <option value="False" className="text-sm text-gray-500">No</option>
          </select>
        </div>

{/* --------------- */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Return As</label>
          <select
            name="return_as"
            value={data.return_as}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Return Type</option>
            {getUtilsData('return_type').map(returnType => (
              <option key={returnType.id} value={returnType.id} className="text-sm text-gray-500">
                {returnType.name}
              </option>
            ))}
          </select>
        </div>

         {/* --------------- */}

        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Is Repair Item</label>
          <select
            name="is_repair_item"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            onChange={handleChange}
            value={data.is_repair_item || ''}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option disabled value="">Select Option</option>
            <option value="True">Yes</option>
            <option value="False">No</option>
          </select>
        </div>

{/* --------------- */}
       <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Item Image</label>
          <input
            type="file"
            name="item_image"
            onChange={handleChange}
            style={{ paddingLeft: '10px' }}
            className="w-full text-sm text-gray-500
               file:mr-4 file:py-1 file:px-4
               file:rounded-lg file:border-0
               file:text-sm file:font-semibold
               file:bg-gray-100 file:text-gray-600
               hover:file:bg-gray-200 border border-gray-200 rounded-lg h-[33px]"
          />
        </div>

{/* --------------- */}

      <div className="w-full flex flex-col gap-2"> 
            <label className="text-xs font-bold text-[#344767]">Default Tax</label>
            <select
              name="default_tax"
              value={data.default_tax}
              onChange={handleChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            >
              
              <option  value="">-- select tax --</option>
              {tax.map((c) => (
                <option key={c.id} value={c.id} className="text-xs text-gray-500">
                  {c.tax_name}
                </option>
              ))}
            </select>
          </div>


 {/* --------------- */}
       
            <div className="w-full flex flex-col gap-2"> 
            <label className="text-xs font-bold text-[#344767]">Made in</label>
            <select
              name="made_in"
              value={data.made_in}
              onChange={handleChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            >
              <option  value="">-- select country --</option>
              {country.map((c) => (
                <option key={c.id} value={c.id} className="text-xs text-gray-500">
                  {c.name}
                </option>
              ))}
              
            </select>
          </div>


         {/* --------------- */}

        <div className="w-full flex flex-col gap-2"> 
              <label className="text-xs font-bold text-[#344767]">Making buffer value</label>
              <input
                type="number"
                min="0"
                name="making_buffer_value"
                value={data.making_buffer_value}
                 ref={refs.making_buffer_value}
                onChange={handleChange}
                placeholder="Making buffer value"
                style={{ paddingLeft: '12px', fontSize: '11px' }}
                className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg 
                          focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
              />
              {errors.making_buffer_value && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.making_buffer_value}</span>}

            </div>

           {/* --------------- */}
     <div className="w-full flex flex-col gap-2"> 
            <label className="text-xs font-bold text-[#344767]">Stone buffer value</label>
            <input
              type="number"
              min="0"
              name="stone_buffer_value"
              ref={refs.stone_buffer_value}

              value={data.stone_buffer_value}
              onChange={handleChange}
              placeholder="     Stone buffer value"
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg 
                        focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
            />
                      {errors.stone_buffer_value && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.stone_buffer_value}</span>}

          </div>
{/* --------------- */}
         <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Stone Sale Markup</label>
          <input
            type="number"
            min="0"
            name="stone_sale_markup"
               ref={refs.stone_sale_markup}
            value={data.stone_sale_markup}
            onChange={handleChange}
            placeholder="    Stone Sale Markup"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg 
                      focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
          />
                    {errors.stone_sale_markup && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.stone_sale_markup}</span>}

        </div>
{/* --------------- */}
        <div className="w-full flex flex-col gap-2"> 
            <label className="text-xs font-bold text-[#344767]">Making Sale Markup</label>
            <input
              type="number"
              min="0"
              name="making_sale_markup"
              value={data.making_sale_markup}
              onChange={handleChange}
              placeholder="    Making Sale Markup"
              style={{ paddingLeft: '12px', fontSize: '11px' }}
             className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg
           focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>
{/* --------------- */}
         <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Buffer Consider Type</label>
          <select
            name="buffer_consider_type"
            value={data.buffer_consider_type}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option disabled value="">--------</option>
            <option className="text-sm text-gray-500" value="True">Consider</option>
            <option className="text-sm text-gray-500" value="False">Not Consider</option>
          </select>
        </div>
 {/* --------------- */}
        
            <div className="w-full flex flex-col gap-2"> 
              <label className="text-xs font-bold text-[#344767]">HSN no</label>
              <input
                type="text"
                name="hsn_code"
                ref={refs.hsn_code}
                value={data.hsn_code}
                onChange={handleChange}
                placeholder="Code"
                style={{ paddingLeft: '12px', fontSize: '11px' }}
                className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
              />
              {errors.hsn_code && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.hsn_code}</span>}
            </div>
      <div className="w-full flex flex-col gap-2"> 
              <label className="text-xs font-bold text-[#344767]">Status</label>
              <select
                name="status"
                value={data.status}
                ref={refs.status}
                onChange={handleChange}
                style={{ paddingLeft: '12px', fontSize: '11px' }}
                className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
              >
                <option disabled value="">------</option>
                <option className="text-sm text-gray-500" value="True">Active</option>
                <option className="text-sm text-gray-500" value="False">Inactive</option>
              </select>
               {errors.status && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.status}</span>}

            </div>
 {/* --------------- */}
       <div className="w-full flex flex-col gap-2"> 
            <label className="text-xs font-bold text-[#344767]">Pre Fix</label>
            <input
              type="text"
              name="prefix"
              ref={refs.prefix}
              value={data.prefix}
              onChange={handleChange}
              placeholder="Prefix"
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
                          {errors.prefix && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.prefix}</span>}

          </div>

     <div className="w-full flex flex-col gap-2"> 
              <label className="text-xs font-bold text-[#344767]">Id Length</label>
              <input
                type="number"
                name="id_length"
                value={data.id_length}
                onChange={handleChange}
                min="0"
                placeholder="Id length"
                style={{ paddingLeft: '12px', fontSize: '11px' }}
                className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg 
                          focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
              />
            </div>




        
 {/* --------------- */}
        

      </div>
      <div className="flex w-full h-[20vh] mt-4 justify-end items-end" style={{padding:'20px'}}>
        <button
          type="submit"
          onClick={handleSubmit}
          className="btn border-none bg-blue-700 text-white w-full sm:w-1/4 md:w-[10vw] rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdateItem



