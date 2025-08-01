import { useEffect, useState } from "react";
import UtilsGetModel from "../../models/Utils_getModel";
import { toast } from "react-toastify";
import GoldItemModel from "../../models/GoldItem";
import CountryModel from "../../models/countryModel";
import settingsTaxModel from "../../models/settingsTaxModel";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useRef } from "react";
import BackButton from "../../components/BackButton";
const CreateItem = () => {
  
  const navigate = useNavigate()
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

  const [UtilsData,setUtilsData] = useState([]);
  const [country,setCountry]= useState([])
  const [tax,setTax]= useState([])
  const [errors, setErrors] = useState({});

  
const FetUtilsdata = async() => {
  try {
    const response = await UtilsGetModel.getUtilsData();
    setUtilsData(response.data);
  } catch (error) {
   console.error("Error fetching utils data:", error);
  }
}


    const auth= useSelector((state) => state.auth);
    const { login_id ,can_manage_user_types,} = auth;  
    const user_id = login_id;
    const user_types = Object.keys(can_manage_user_types).join(','); 



     const refs ={
      code:useRef(null),
      name:useRef(null),
      item_type:useRef(null),
      uom:useRef(null),
      category: useRef(null),         
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

const validateForm = () => {
  const newErrors = {};
  let firstInvalidField = null;

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

  if (firstInvalidField && refs[firstInvalidField]?.current) {
    refs[firstInvalidField].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      refs[firstInvalidField].current?.focus();
    }, 0); 
  }

  return Object.keys(newErrors).length === 0;
};





 const cleanData = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== '' && value !== null
    )
  );
};

const cleanedData = cleanData(data);


 const getUtilsData = (key) => {
  if (!UtilsData?.data) return [];
  
  const item = UtilsData.data.find(item => item[key] !== undefined);
  return item ? item[key] : [];
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

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error("Please Fill All Required Fields");
    return;
  }

  try {
    const formData = new FormData();
    Object.entries(cleanedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      }
    });

    const response = await GoldItemModel.CreateGoldItem(formData);
     navigate('/dashboard/item')
    if (response.data) {
      toast.success(response.data.message || "Item created successfully!");
    } else {
      toast.success("Item created ");
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


  const getSubcategories = () => {
    if (!data.category) return [];
    const categories = getUtilsData('categories');
    const selectedCategory = categories.find(cat => 
      cat.category_name === data.category || cat.category_id.toString() === data.category
    );
    return selectedCategory ? selectedCategory.sub_cat : [];
  };

  useEffect(() => {
    FetUtilsdata()
  },[])


  useEffect(()=>{
 const fetchCounty = async()=>{
  try{
  const res = await CountryModel.getCountries(user_id,user_types,1000,1,"",'True')
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
  const res = await settingsTaxModel.getTaxes(user_id,user_types,1000,1,'',"True")
  setTax(res?.data?.data)
  }catch(error){
  console.error(error)
  }
 }
 fetchTax()
  },[])



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
    <div style={{paddingTop:'20px',paddingRight:'20px'}} >  <BackButton to="/dashboard/item" />
</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10" style={{padding:'30px'}}>
        {/* code */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Code    <span className="text-red-500 text-[14px]">*</span>
</label> 
<div className="flex flex-col">
          <input
            type="text"
            name='code'
            required
             ref={refs.code}
            value={data.code}
            placeholder="Type here"
            style={{ paddingLeft: '10px' }}
            onChange={handleChange}
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
          {errors.code && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.code}</span>}
</div>
        </div>

        {/* name */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Name</label>
          <div>
          <input
            type="text"
            name='name'
             ref={refs.name}
            required
            value={data.name}
            onChange={handleChange}
            placeholder="Type here"
            style={{ paddingLeft: '10px' }}
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
           {errors.name && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.name}</span>}
           </div>
        </div>

        {/* item type */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Item Type    <span className="text-red-500 text-[14px]">*</span>
</label>
<div>
          <select  
            name="item_type"
             ref={refs.item_type}

            onChange={handleChange}
            value={data.item_type}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option  className="text-xs text-gray-400" value="">-- Select Item Type --</option>
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
        </div>

        {/* uom */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">UOM    <span className="text-red-500 text-[14px]">*</span>
</label>
<div>
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
        </div>

        {/* category */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Category    <span className="text-red-500 text-[14px]">*</span>
</label>
<div>
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
        </div>

        {/* sub Category */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Sub Category    <span className="text-red-500 text-[14px]">*</span>
</label>
          <select
            name="subcategory"
            value={data.subcategory}
            ref={refs.subcategory}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Subcategory</option>
            {getSubcategories().map(subCat => (
              <option key={subCat.id} value={subCat.id} className="text-sm text-gray-500">
                {subCat.name}
              </option>
            ))}
          </select>
           {errors.subcategory && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.subcategory}</span>}
        </div>

        {/* jewellery type */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Jewellery Type    <span className="text-red-500 text-[14px]">*</span>
</label>
          <select
            name="jewellery_type"
            value={data.jewellery_type}
            onChange={handleChange}
            ref={refs.jewellery_type}
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

        {/* making calculation on */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Making Calculation On    <span className="text-red-500 text-[14px]">*</span></label>
          <select
            name="making_calculation_on"
            ref={refs.making_calculation_on}
            value={data.making_calculation_on}
            onChange={handleChange}
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

        {/* is scrap item */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Is Scrap Item</label>
          <select
            name="is_scrap_item"
            value={data.is_scrap_item}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Option</option>
            <option value="True" className="text-sm text-gray-500">Yes</option>
            <option value="False" className="text-sm text-gray-500">No</option>
          </select>
        </div>

        {/* is serialized */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Is Serialized    <span className="text-red-500 text-[14px]">*</span>
</label>
          <select
            name="is_serialized"
            ref={refs.is_serialized}
            value={data.is_serialized}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Option</option>
            <option value="True" className="text-sm text-gray-500">Yes</option>
            <option value="False" className="text-sm text-gray-500">No</option>
          </select>
                    {errors.is_serialized && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.is_serialized}</span>}

        </div>

        {/* is gift item */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Is Gift Item</label>
          <select
            name="is_gift_item"
            value={data.is_gift_item}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Option</option>
            <option value="True" className="text-sm text-gray-500">Yes</option>
            <option value="False" className="text-sm text-gray-500">No</option>
          </select>
        </div>

        {/* return as */}
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

        {/* is repair item */}
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

        {/* item image */}
       
        {/* item image */}
        <div className="w-full flex flex-col gap-2"> 
  <label className="text-xs font-bold text-[#344767]">Item Image</label>
  <input
    type="file"
    name="item_image"
    onChange={handleChange}
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
              <option className="text-xs text-gray-500" value=""> -- Default Input Tax --</option>
              {/* TODO: Replace with mapped tax IDs when API provides them */}
             
              {tax.map((c) => (
                <option key={c.id} value={c.id} className="text-xs text-gray-500">
                  {c.tax_name}
                </option>
              ))}
            </select>
          </div>



 
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

  
        
  
            <div className="w-full flex flex-col gap-2"> 
              <label className="text-xs font-bold text-[#344767]">Making buffer value</label>
              <input
                type="number"
                min="0"
                name="making_buffer_value"
                ref={refs.making_buffer_value}
                value={data.making_buffer_value}
                onChange={handleChange}
                placeholder="0.00"
                style={{ paddingLeft: '12px', fontSize: '11px' }}
                className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg 
                          focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
              />
               {errors.making_buffer_value && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.making_buffer_value}</span>}

            </div>


      
           <div className="w-full flex flex-col gap-2"> 
            <label className="text-xs font-bold text-[#344767]">Stone buffer value</label>
            <input
              type="number"
              min="0"
              name="stone_buffer_value"
              value={data.stone_buffer_value}
              ref={refs.stone_buffer_value}

              onChange={handleChange}
              placeholder="0.00"
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg 
                        focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
            />
          {errors.stone_buffer_value && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.stone_buffer_value}</span>}

          </div>


           <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Stone Sale Markup</label>
          <input
            type="number"
            min="0"
            name="stone_sale_markup"
            ref={refs.stone_sale_markup}
            value={data.stone_sale_markup}
            onChange={handleChange}
            placeholder="0.00"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg 
                      focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
          />
          {errors.stone_sale_markup && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.stone_sale_markup}</span>}

        </div>


           <div className="w-full flex flex-col gap-2"> 
            <label className="text-xs font-bold text-[#344767]">Making Sale Markup</label>
            <input
              type="number"
              min="0"
              name="making_sale_markup"
              placeholder="0.00"
              value={data.making_sale_markup}
              onChange={handleChange}
        
              style={{ paddingLeft: '12px', fontSize: '11px' }}
             className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg
           focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>


           <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Buffer Consider Type</label>
          <select
            name="buffer_consider_type"
            value={data.buffer_consider_type}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option className="text-xs-400" value="">-- Select an option --</option>
            <option className="text-sm text-gray-500" value="True">Consider</option>
            <option className="text-sm text-gray-500" value="False">Not Consider</option>
          </select>
        </div>


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
              <label className="text-xs font-bold text-[#344767]">Status  <span className="text-red-500 text-[14px]">*</span></label>
              <select
                name="status"
                value={data.status}
              ref={refs.status}

                onChange={handleChange}
                style={{ paddingLeft: '12px', fontSize: '11px' }}
                className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
              >
                <option disabled value=""> -- Select status --</option>
                <option className="text-sm text-gray-500" value="True">Active</option>
                <option className="text-sm text-gray-500" value="False">Inactive</option>
              </select>
                 {errors.status && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.status}</span>}

            </div>

 
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
                ref={refs.id_length}
                value={data.id_length}
                onChange={handleChange}
                min="0"
                placeholder="Id length"
                style={{ paddingLeft: '12px', fontSize: '11px' }}
                className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg 
                focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
              />
               {errors.id_length && <span className="text-red-400 text-xs" style={{paddingLeft:'5px'}}>{errors.id_length}</span>}

            </div>

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

export default CreateItem;