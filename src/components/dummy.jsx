import { useState } from "react";

const CreateItem = () => {
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

  const [errors, setErrors] = useState({});

  // This would come from your API response
  const utilsData = {
    "status": true,
    "message": "utils retrieved successfully.",
    "data": [
      {
        "uom": []
      },
      {
        "item_type": {
          "id": 1,
          "name": "Gold",
          "code": "Gold"
        }
      },
      {
        "jewelley_type": []
      },
      {
        "categories": [
          {
            "category_name": "Luxury & Designer Jewellery",
            "category_id": 3,
            "sub_cat": [
              {
                "id": 7,
                "name": "Statement Necklaces"
              },
              {
                "id": 8,
                "name": "Cocktail Rings"
              },
              {
                "id": 9,
                "name": "Designer Cuffs & Bracelets"
              }
            ]
          },
          {
            "category_name": "Bridal Jewellery",
            "category_id": 1,
            "sub_cat": [
              {
                "id": 1,
                "name": "Wedding Sets"
              },
              {
                "id": 2,
                "name": "Mangalsutra"
              },
              {
                "id": 3,
                "name": "Matha Patti & Maang Tikka"
              }
            ]
          },
          {
            "category_name": "Everyday Wear",
            "category_id": 2,
            "sub_cat": [
              {
                "id": 4,
                "name": "Stud Earrings"
              },
              {
                "id": 5,
                "name": "Simple Chains & Pendants"
              },
              {
                "id": 6,
                "name": "Bangles & Bracelets"
              }
            ]
          },
          {
            "category_name": "Gold",
            "category_id": 4,
            "sub_cat": [
              {
                "id": 10,
                "name": "Bar"
              }
            ]
          }
        ]
      },
      {
        "product_brand": [
          {
            "id": 1,
            "name": "Tanishq"
          },
          {
            "id": 2,
            "name": "Cartier"
          },
          {
            "id": 3,
            "name": "Harry Winston"
          }
        ]
      },
      {
        "return_type": [
          {
            "id": 1,
            "name": "Full Refund"
          },
          {
            "id": 2,
            "name": "Exchange"
          },
          {
            "id": 3,
            "name": "Store Credit"
          }
        ]
      },
      {
        "making_calculation": [
          {
            "gross_weight": "Gross Weight",
            "net_weight": "Net Weight"
          }
        ]
      }
    ]
  };

  // Helper function to extract specific data from the utils
  const getUtilsData = (key) => {
    const item = utilsData.data.find(item => item[key] !== undefined);
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
  };

  const handleSubmit = () => {
    console.log("Form submitted with data:", data);
  };

  // Get subcategories based on selected category
  const getSubcategories = () => {
    if (!data.category) return [];
    const categories = getUtilsData('categories');
    const selectedCategory = categories.find(cat => 
      cat.category_name === data.category || cat.category_id.toString() === data.category
    );
    return selectedCategory ? selectedCategory.sub_cat : [];
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10" style={{padding:'30px'}}>
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

        {/* name */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Name</label>
          <input
            type="text"
            name='name'
            required
            value={data.name}
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
            {getUtilsData('item_type') && (
              <option value={getUtilsData('item_type').code}>
                {getUtilsData('item_type').name}
              </option>
            )}
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
            {getUtilsData('uom').length > 0 ? (
              getUtilsData('uom').map(uom => (
                <option key={uom.id} value={uom.name} className="text-sm text-gray-500">
                  {uom.name}
                </option>
              ))
            ) : (
              <option value="Gram" className="text-sm text-gray-500">Gram</option>
            )}
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
                value={category.category_name}
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
              <option key={subCat.id} value={subCat.name} className="text-sm text-gray-500">
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
            {getUtilsData('jewelley_type').length > 0 ? (
              getUtilsData('jewelley_type').map(type => (
                <option key={type.id} value={type.name} className="text-sm text-gray-500">
                  {type.name}
                </option>
              ))
            ) : (
              <>
                <option value="Necklaces" className="text-sm text-gray-500">Necklaces</option>
                <option value="Ear Rings" className="text-sm text-gray-500">Ear Rings</option>
                <option value="Gold Bar" className="text-sm text-gray-500">Gold Bar</option>
              </>
            )}
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
              <option key={brand.id} value={brand.name} className="text-sm text-gray-500">
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* making calculation on */}
        <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Making Calculation On</label>
          <select
            name="making_calculation_on"
            value={data.making_calculation_on}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Calculation</option>
            {getUtilsData('making_calculation').map((calc, index) => (
              <>
                <option key={`gross-${index}`} value={calc.gross_weight} className="text-sm text-gray-500">
                  {calc.gross_weight}
                </option>
                <option key={`net-${index}`} value={calc.net_weight} className="text-sm text-gray-500">
                  {calc.net_weight}
                </option>
              </>
            ))}
          </select>
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
            <option value="Yes" className="text-sm text-gray-500">Yes</option>
            <option value="No" className="text-sm text-gray-500">No</option>
          </select>
        </div>

        {/* is serialized */}
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
            <option value="Yes" className="text-sm text-gray-500">Yes</option>
            <option value="No" className="text-sm text-gray-500">No</option>
          </select>
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
            <option value="Yes" className="text-sm text-gray-500">Yes</option>
            <option value="No" className="text-sm text-gray-500">No</option>
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
              <option key={returnType.id} value={returnType.name} className="text-sm text-gray-500">
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
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        {/* item image */}
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
                <option value="" disabled>select jewellery type</option>
                <option value="Necklaces" className="text-sm text-gray-500">Necklaces</option>
                <option value="Ear Rings" className="text-sm text-gray-500">Ear Rings</option>
                <option value="Gold Bar" className="text-sm text-gray-500">Gold Bar</option>
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
              <option value="" disabled>select jewellery type</option>
              <option value="Thanisq" className="text-sm text-gray-500">Thanisq</option>
              <option value="Cartier" className="text-sm text-gray-500">Cartier</option>
              <option value="Harry Wintston" className="text-sm text-gray-500">Harry Wintston</option>
            </select>
          </div>

  
  
          {/* --------------- */}
  
            <div className="w-full flex flex-col gap-2"> 
            <label className="text-xs font-bold text-[#344767]">Making Calculation On</label>
            <select
              name="making_calculation_on"
              value={data.making_calculation_on}
              onChange={handleChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            >
              <option value="" disabled>------</option>
              <option value="Gross Weight" className="text-sm text-gray-500">Gross Weight</option>
              <option value="Net Weight" className="text-sm text-gray-500">Net Weight</option>
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
              <option value="" disabled>------</option>
              <option value="Yes" className="text-sm text-gray-500">Yes</option>
              <option value="No" className="text-sm text-gray-500">No</option>
            </select>
          </div>


          <div className="w-full flex flex-col gap-2"> 
          <label className="text-xs font-bold text-[#344767]">Is Serialized</label>
          <select
            name="is_serialized"
            value={data.is_serialized}
            onChange={handleChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}

            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>------</option>
            <option value="Yes" className="text-sm text-gray-500">Yes</option>
            <option value="No" className="text-sm text-gray-500">No</option>
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
              <option value="" disabled>------</option>
              <option value="Yes" className="text-sm text-gray-500">Yes</option>
              <option value="No" className="text-sm text-gray-500">No</option>
            </select>
          </div>


  
          
  
  
         
   {/* --------------- */}
  
            

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
              <option value="" disabled>------</option>
              <option className="text-sm text-gray-500" value="Full Exchange">Full Exchange</option>
              <option className="text-sm text-gray-500" value="Exchange">Exchange</option>
              <option className="text-sm text-gray-500" value="Store Credit">Store Credit</option>
            </select>
          </div>

           {/* --------------- */}
  
            {/* Is Repair Item */}
         <div className="w-full flex flex-col gap-2">
  <label className="text-xs font-bold text-[#344767]">Is Repair Item</label>
  <select
    name="is_repair_item"
    style={{ paddingLeft: '12px', fontSize: '11px' }}
    onChange={handleChange}
    value={data.is_repair_item || ''} // fallback to empty string
    className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
  >
    <option disabled value="">------</option>
    <option>Yes</option>
    <option>No</option>
  </select>
</div>


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
              <option className="text-sm text-gray-500">
                Gold- default-Input-Tax:1.000000% -output_tax:1.00000%
              </option>
              <option className="text-sm text-gray-500">
                Gold- Making-Input-Tax:1.000000% -output_tax:1.00000%
              </option>
              <option className="text-sm text-gray-500">
                Gold- Stone-Input-Tax:1.000000% -output_tax:1.00000%
              </option>
              <option className="text-sm text-gray-500">
                Diamond- default-Input-Tax:1.000000% -output_tax:1.00000%
              </option>
              <option className="text-sm text-gray-500">
                Diamond- Making-Input-Tax:1.000000% -output_tax:1.00000%
              </option>
              <option className="text-sm text-gray-500">
                Diamond- Stone-Input-Tax:1.000000% -output_tax:1.00000%
              </option>
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
              <option disabled value="">-----------</option>
              <option className="text-sm text-gray-500">United Arab Emirates</option>
              <option className="text-sm text-gray-500">India</option>
            </select>
          </div>

  
        
  
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
                        focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
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
            <option disabled value="">--------</option>
            <option className="text-sm text-gray-500" value="Consider">Consider</option>
            <option className="text-sm text-gray-500" value="Not Consider">Not Consider</option>
          </select>
        </div>


            <div className="w-full flex flex-col gap-2"> 
              <label className="text-xs font-bold text-[#344767]">HSN no</label>
              <input
                type="text"
                name="hsn_code"
                value={data.hsn_code}
                onChange={handleChange}
                placeholder="    Code"
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
                <option className="text-sm text-gray-500" value="Active">Active</option>
                <option className="text-sm text-gray-500" value="Inactive">Inactive</option>
              </select>
            </div>

 
            <div className="w-full flex flex-col gap-2"> 
            <label className="text-xs font-bold text-[#344767]">Pre Fix</label>
            <input
              type="text"
              name="prefix"
              value={data.prefix}
              onChange={handleChange}
              placeholder="    Prefix"
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
                placeholder="     Id length"
                style={{ paddingLeft: '12px', fontSize: '11px' }}
                className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg 
                          focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 appearance-auto"
              />
            </div>

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

export default CreateItem;