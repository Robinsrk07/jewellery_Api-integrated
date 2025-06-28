import { Link } from "react-router";
import { useEffect, useState } from "react";
import UtilsGetModel from "../../models/Utils_getModel";
import { toast } from "react-toastify";
import GoldItemModel from "../../models/GoldItem";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

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
    
      const auth= useSelector((state) => state.auth);
      const {login_type,login_id} =auth
      const [limit, setLimit] = useState(10);
      const [page, setPage] = useState(1);
      const [search, setSearch] = useState('');
      const [status, setStatus] = useState('');
      const [goldItemData, setGoldItemData] = useState([]);
      const [selectedItem,setItem]=useState([])

       const [UtilsData,setUtilsData] = useState([]);
       console.log("UtilsData", UtilsData);
       console.log("goldItemData", goldItemData);
       const { id } = useParams();
       console.log("id", id);
       console.log("selectedItem", selectedItem);
       console.log("selectedItem", selectedItem.code);

      const FetchItemToEdit = (id) => {
        console.log("FetchItemToEdit called with id:", id);
        console.log("goldItemData length:", goldItemData.length);

        if (!id) {
          toast.error("Cannot update: ID missing");
          return;
        }

        if (goldItemData.length === 0) {
          console.log("goldItemData is empty, waiting for data to load...");
          return;
        }

        const itemTobeUpdate = goldItemData.find(item => item.id.toString() === id.toString());

        if (!itemTobeUpdate) {
          toast.error("Please select a valid item to update");
          return;
        }

       setItem(itemTobeUpdate)
        console.log("Item to update:", itemTobeUpdate);
      };
     

      const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        console.log(data)
        if (!validateForm()) {
          toast.error("Please fix form errors");
          return;
        }
      
      
        try {
          const response = await GoldItemModel.updateGoldItem(data,id);
          
          if (response.data) {
            toast.success(response.data.message || "Item created successfully!");
          } else {
            console.warn("Unexpected response structure:", response);
            toast.success(response.data.message || "Item created (check console for details)");
          }
        } catch (error) {
      
        if (error.response) {
          const { message, errors } = error.response.data;
      
          // Show field-specific errors (like code already exists)
          if (errors && typeof errors === 'object') {
            Object.entries(errors).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                messages.forEach(msg => toast.error(` ${msg}`));
              } else {
                toast.error(`${field}: ${messages}`);
              }
            });
          }
        } else {
          toast.error(error.message || "Creation failed");
        }
      }
      
      };

      const FetUtilsdata = async() => {
        try {
          const response = await UtilsGetModel.getUtilsData();
          setUtilsData(response.data);
        } catch (error) {
        console.error("Error fetching utils data:", error);
        }
      }

      // Fix: Wait for both id and goldItemData to be available
      useEffect(()=>{
        if (id && goldItemData.length > 0) {
          FetchItemToEdit(id);
        }
      },[id, goldItemData])

      const validateForm = () => {
            const newErrors = {};

            const requiredFields = [
              'code',
              'item_type',
              'uom',
              'category',
              'subcategory',
              'jewellery_type',
              'making_calculation_on',
              'is_serialized'
            ];

            requiredFields.forEach(field => {
              if (!data[field]?.toString().trim()) {
                newErrors[field] = 'This field is required';
              }
            });

            

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
                cat.category_name === data.category || cat.category_id.toString() === data.category
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
              };
           

          const FetchGoldItemData =async()=>{
            try{
              const response = await GoldItemModel.getGoldItem(login_type,login_id,limit,page,search,status)
              setGoldItemData(response.data.data);
            }catch(error){
              console.error("Error fetching gold item data:", error);
            }
          }
           useEffect(() => {
              FetUtilsdata()
            },[])

          useEffect(() => {
            FetchGoldItemData(); 
          }, [limit, page, search, status]);

         

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
          <label className="text-xs font-bold text-[#344767]">Code</label>
          <input
            type="text"
            name='code'
            required
            value={data.code}
            placeholder="Type here"
            style={{ paddingLeft: '10px' }}
            onChange={handleChange}
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>
      
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Name</label>
          <input
            type="text"
            name='name'
            required
            value={data.name }
            onChange={handleChange}
            placeholder="Type here"
            style={{ paddingLeft: '10px' }}
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>


        {/* item type */}
           <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Item Type</label>
          <select  
            name="item_type"
            onChange={handleChange}
            value={data.item_type}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option disabled value="">Item Type</option>
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
        </div>
        {/* uom */}

        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">UOM</label>
          <select
            name="uom"
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
        </div>

        {/* category */}
         <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Category</label>
          <select
            name="category"
            onChange={handleChange}
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
        </div>
  
       {/* sub Category */}
         <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Sub Category</label>
          <select
            name="subcategory"
            value={data.subcategory}
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
        </div>
            {/* jewellery type */}
         <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Jewellery Type</label>
          <select
            name="jewellery_type"
            value={data.jewellery_type}
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
          <label className="text-xs font-bold text-[#344767]">Making Calculation On</label>
          <select
            name="making_calculation_on"
            value={selectedItem.making_calculation_on}
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
</div>
    {/* --------------- */}
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
{/* --------------- */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Is Serialized</label>
          <select
            name="is_serialized"
            value={data.is_serialized}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Option</option>
            <option value="True" className="text-sm text-gray-500">Yes</option>
            <option value="False" className="text-sm text-gray-500">No</option>
          </select>
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
            <option value="" disabled>Select Option</option>
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
            className="file-input bg-white text-gray-500 border-gray-300 rounded-lg file-input-sm w-full"
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
              <option disabled value="">Default Input Tax</option>
              {/* TODO: Replace with mapped tax IDs when API provides them */}
              <option className="text-sm text-gray-500" value="1">
                Gold- default-Input-Tax:1.000000% -output_tax:1.00000%
              </option>
              <option className="text-sm text-gray-500" value="2">
                Gold- Making-Input-Tax:1.000000% -output_tax:1.00000%
              </option>
              <option className="text-sm text-gray-500" value="3">
                Gold- Stone-Input-Tax:1.000000% -output_tax:1.00000%
              </option>
              <option className="text-sm text-gray-500" value="4">
                Diamond- default-Input-Tax:1.000000% -output_tax:1.00000%
              </option>
              <option className="text-sm text-gray-500" value="5">
                Diamond- Making-Input-Tax:1.000000% -output_tax:1.00000%
              </option>
              <option className="text-sm text-gray-500" value="6">
                Diamond- Stone-Input-Tax:1.000000% -output_tax:1.00000%
              </option>
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
              <option disabled value="">-----------</option>
              {/* TODO: Replace with mapped country IDs when API provides them */}
              <option className="text-sm text-gray-500" value="17">Bolivia</option>
              <option className="text-sm text-gray-500" value="18">Brazil</option>
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
                onChange={handleChange}
                placeholder="Making buffer value"
                style={{ paddingLeft: '12px', fontSize: '11px' }}
                className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg 
                          focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
              />
            </div>

           {/* --------------- */}
     <div className="w-full flex flex-col gap-2"> 
            <label className="text-xs font-bold text-[#344767]">Stone buffer value</label>
            <input
              type="number"
              min="0"
              name="stone_buffer_value"
              value={data.stone_buffer_value}
              onChange={handleChange}
              placeholder="     Stone buffer value"
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg 
                        focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
            />
          </div>
{/* --------------- */}
         <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Stone Sale Markup</label>
          <input
            type="number"
            min="0"
            name="stone_sale_markup"
            value={data.stone_sale_markup}
            onChange={handleChange}
            placeholder="    Stone Sale Markup"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg 
                      focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
          />
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
                value={data.hsn_code}
                onChange={handleChange}
                placeholder="Code"
                style={{ paddingLeft: '12px', fontSize: '11px' }}
                className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
              />
            </div>
      <div className="w-full flex flex-col gap-2"> 
              <label className="text-xs font-bold text-[#344767]">Status</label>
              <select
                name="status"
                value={data.status}
                onChange={handleChange}
                style={{ paddingLeft: '12px', fontSize: '11px' }}
                className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
              >
                <option disabled value="">------</option>
                <option className="text-sm text-gray-500" value="True">Active</option>
                <option className="text-sm text-gray-500" value="False">Inactive</option>
              </select>
            </div>
 {/* --------------- */}
       <div className="w-full flex flex-col gap-2"> 
            <label className="text-xs font-bold text-[#344767]">Pre Fix</label>
            <input
              type="text"
              name="prefix"
              value={data.prefix}
              onChange={handleChange}
              placeholder="Prefix"
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
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
      <div className="flex w-full h-[20vh] mt-4 justify-center items-center">
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



