import { useEffect, useState } from "react"
import Default from "../../../assets/images/stock-CfGxyh0i.jpg"
import PurchaseUtils from "../../../models/PurchaseUtils";
import UtilsGetModel from "../../../models/Utils_getModel";
import DiamondModel from "../../../models/DiamondModel";
import { toast } from "react-toastify";
import { useParams } from "react-router";
const ItemDetails = () => {
   
          const [preview, setPreview] = useState(null);
          const [purchaseUtils,setPurchaseUtils] =useState([])
          const [goldUtils,setGoldUtils] =useState([])
          const [items, setItems] = useState([{}]);
          console.log(items)
          const newArray = [items]
          const{id}  = useParams()
          console.log(newArray)
          const [data, setData] = useState({
            uom: '',
            jewellery_type: '',
            brand: '',
            item_type:14,
            size: '',
            metal_color: '',
            made_in: '',
            design: '',
            gender: '',
            occasion: '',
            category: '',
            subcategory: '',
            style: '',
            diamond_item:'', //hard coded because not present in api
            diamond_image:'',
            is_gift_item:'',
            consider_profit_margin:"",
            description:"",
            gold_weight:'',
            pearl_weight:'',
            ruby_weight:"",
            emerald_weight:'',
            sapphire_weight:'',
            other_stone_weight:'',
            status:'True',
            cost_price:'',
            additional_charge:"",
            mark_up:'',
            tag_price:'',
            branch:'',
            discount:'',
            supplier:'',
            total_amount:'',
            net_amount:"",
            items :'',
            total:'',
            total_pieces:''


          });
          console.log(data)
          const [count,setCount] = useState(1)
          const [rows, setRows] = useState([{ id: 1, type: 'Main' }]);
          const [totalCarat, setTotalCarat] = useState(0);
          const [totalPieces, setTotalPieces] = useState(0);
          console.log(totalCarat)
          console.log(totalPieces)
          
          const [allUtils,setAllUtils]=useState([])
          console.log(data)
          console.log(purchaseUtils)
          console.log(goldUtils)
          console.log(allUtils)
          const uomArray = goldUtils.find(item => item.uom)?.uom || [];
          
          const JewelleryType = goldUtils.find(item => item.jewelley_type)?.jewelley_type || [];
          const Brand = purchaseUtils.find(item => item.product_brand)?.product_brand || [];
          const Category = goldUtils.find(item=>item.categories)?.categories||[]
          const occasion = purchaseUtils.find(item=>item.occasion)?.occasion || []
          const design  = purchaseUtils.find(item=>item.product_design)?.product_design || []
          const made_in =  purchaseUtils.find(item=>item.product_country)?.product_country || []
          const size =  purchaseUtils.find(item=>item.product_size)?.product_size || []
          const style =  purchaseUtils.find(item=>item.product_style)?.product_style || []
          const gender =  purchaseUtils.find(item=>item.product_gender)?.product_gender || []
          const color =  purchaseUtils.find(item=>item.product_color)?.product_color || []
          const item_type =  goldUtils.find(item=>item.item_type)?.item_type || []
          const supplier =  allUtils.find(item=>item.supplier_list)?.supplier_list || []
          
          const handleImageChange = (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setPreview(reader.result);
              };
              reader.readAsDataURL(file);
            }
          };

          const handleChange = (e) => {
            const { name, value } = e.target;
            setData(prev => ({
              ...prev,
              [name]: value
            }));
          };


          const fetchPurchaseUtils = async()=>{
            try{
              const response = await PurchaseUtils.getPurchaseUtils()
              if(response){
                setPurchaseUtils(response?.data?.data)
              }
            }catch(error){
               console.error(error)
            }
          }
          const fetchGoldUtils =async ()=>{
            try{
               const response = await UtilsGetModel.getUtilsData()
               if(response){
                setGoldUtils(response?.data?.data)
                 }
            }catch(error){
               console.error(error)
            }
          }


         const cleanData = (data) => {
              const cleanedData = {};

              for (const key in data) {
                const value = data[key];
                if (
                  value !== '' &&
                  value !== null &&
                  value !== undefined
                ) {
                  cleanedData[key] = value;
                }
              }

              return cleanedData;
            };

         
     const getSubCategories = () => {
        if (!data.category) return [];
        const selectedCategory = Category.find(
          cat => cat.category_id.toString() === data.category
        );
        return selectedCategory?.sub_cat || [];
      };

      const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setData(prev => ({
          ...prev,
          category: categoryId,
          subcategory: '' // Reset subcategory when category changes
        }));
      };

    const handleSubCategoryChange = (e) => {
      setData(prev => ({
        ...prev,
        subcategory: e.target.value
      }));
    };
        
       
          
    const handleCellChange = (rowIndex, field, value) => {
      setItems(prev => {
        const newItems = [...prev];
        if (!newItems[rowIndex]) newItems[rowIndex] = {};
        newItems[rowIndex][field] = value;
        return newItems;
      });
    };

    const objectToFormData = (obj) => {
  const formData = new FormData();
  for (const key in obj) {
    formData.append(key, obj[key]);
  }
  return formData;
};

 const handleSubmit = async () => {
  const cleaned = cleanData(data);        // remove empty/null fields
   if(items.length>0) cleaned.items =items 
   if (totalCarat > 0) {
    cleaned.total = totalCarat;
  }
   if (totalPieces > 0) {
    cleaned.total_pieces = totalPieces;
  }
  console.log(cleaned)
  const formData = objectToFormData(cleaned); // convert to FormData

  try {
    const response = await DiamondModel.CreateDiamond(formData);
    if (response) {
      toast.success("Diamond Created Successfully");
    }
  } catch (error) {
    toast.error("Please try again, failed to create Diamond");
  }
};


   const addRow = () => {
    setCount(prev => prev + 1);
    setRows(prev => [
      ...prev,
      { id: Date.now() }
    ]);
  };

  const removeRow = (id) => {
    if (rows.length > 1) { 
      setCount(prev => prev - 1);
      setRows(prev => prev.filter(row => row.id !== id));
    }
  };

  useEffect(() => {
  if (id) {
    setData((prev) => ({
      ...prev,
      diamond_item: Number(id) // ensures it's a number if required
    }));
  }
}, [id]);


    useEffect(()=>{

      fetchGoldUtils()
      fetchPurchaseUtils()
      
    },[])

      useEffect(() => {
      if (purchaseUtils.length && goldUtils.length) {
        setAllUtils([...purchaseUtils, ...goldUtils]);
      }
      }, [purchaseUtils, goldUtils]);

      useEffect(() => {
  const cost = parseFloat(data.cost_price) || 0;
  const additional = parseFloat(data.additional_charge) || 0;
  const discount = parseFloat(data.discount) || 0;

  let tag = cost + additional;

  if (data.consider_profit_margin === 'True' || data.consider_profit_margin === true) {
    tag -= discount;
  }

  setData(prev => ({
    ...prev,
    tag_price: tag.toFixed(2),
  }));
          }, [data.cost_price, data.additional_charge, data.discount, data.consider_profit_margin]);


              useEffect(() => {
            const caratSum = items.reduce((sum, item) => sum + (parseFloat(item.carat) || 0), 0);
            const piecesSum = items.reduce((sum, item) => sum + (parseInt(item.no_of_pieces) || 0), 0);

            setTotalCarat(caratSum.toFixed(2));
            setTotalPieces(piecesSum);
          }, [items]);


    return (
        <div className="w-full h-[84%] bg-white rounded-lg overflow-y-auto rounded-lg flex flex-col gap-4" style={{padding:'20px'}}>
            <div className="border text-gray-600 border-gray-300 rounded-lg flex gap-4 relative" style={{padding:'20px'}}>
                <h3 className="absolute -top-3 left-4 bg-white px-2 text-gray-500 font-semibold text-sm">Tag Information</h3>
                <div className="overflow-x-auto">
                <div className="flex flex-row gap-10 items-center">
                <div className="flex flex-col gap-2">
                        <label className="text-gray-400 font-semibold text-[11px] ">
                            Supplier Ref no : <span className="text-red-500 text-[14px]">*</span>
                        </label>

                      <select
                        name="supplier"
                        onChange={handleChange}
                        value={data.supplier}
                        className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">- Select Jewellery Type -</option>
                        {supplier.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-gray-400 font-semibold text-[11px]">
                        Tagging Line
                    </label>
                    <input 
                        type="text" 
                        value={"Diamond"}
                        style={{paddingLeft:'12px'}}
                        className="border w-[200px] text-xs rounded-sm h-[30px] bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-gray-400 font-semibold text-[11px] mb-1 sm:mb-0 sm:w-48">
                        Consider Profit Margin<span className="text-red-500 text-[14px]">*</span>
                    </label>
                    <select
                        onChange={handleChange}
                        value={data.consider_profit_margin}
                         className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
                        name="consider_profit_margin"
                    >
                        <option value="">Select</option>
                        <option value="True">Yes</option>
                        <option value="False">No</option>
                    </select>
                </div>

                <div className="w-[100px] h-[120px] mx-auto border border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center overflow-hidden">
          <img
            src={preview || Default}
            alt="Preview"
            className="w-[100px] h-[120px] object-contain"
          />
           <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
        </div>
       
                <div>
                    {/* <button className=" w-[70px] h-[35px] rounded-lg bg-[#7B62E4] text-white" onClick={() => setAddMore(true)}>Add+</button> */}
                </div>
                </div>
                </div>
            </div>

          
                <div className="border w-full rounded-lg border-gray-200 relative" style={{padding:'20px'}}>
                <h3 className="absolute -top-3 left-4 bg-white px-2 text-gray-400 font-semibold text-sm">Tag Specification and Weight Detials</h3>
                <div className="overflow-x-auto ">
                    <div className="flex flex-row gap-10 items-center">
                    <div className="flex flex-col gap-2 ">
                        <label className="text-gray-400 font-semibold text-[11px] mb-1">
                          UOM:
                        </label>
                        <select
                          name="uom"
                          onChange={handleChange}
                          value={data.uom}
                          className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
                        >
                          <option value="">-- Select UOM --</option>
                          {uomArray.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>


                        <label className="text-gray-400 font-semibold text-[12px] mb-1">
                          Category:
                        </label>
                        <select
                          name="category"
                          onChange={handleCategoryChange}
                          value={data.category}
                          className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
                        >
                          <option value="">-- Select Category --</option>
                          {Category.map((category) => (
                            <option key={category.category_id} value={category.category_id}>
                              {category.category_name}
                            </option>
                          ))}
                        </select>
                      
                        <label className="text-gray-400 font-semibold text-[11px] mb-1">
                           gold  weight</label>
                        <input 
                            type="number" 
                            value={data.gold_weight}
                            onChange={handleChange}
                            step='.1'
                            min='0'
                           name="gold_weight"

                            style={{paddingLeft:'12px'}}
                            className="border w-[200px] h-[30px] rounded-sm bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                        <label className="text-gray-400 font-semibold text-[11px] mb-1">
                          saphire weight</label>
                         <input 
                            type="number" 
                            value={data.sapphire_weight}
                            onChange={handleChange}
                            step='.1'
                            min='0'
                            name="sapphire_weight"
                            style={{paddingLeft:'12px'}}
                            className="border w-[200px] h-[30px] rounded-sm bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                         <label className="text-gray-400 font-semibold text-[11px] mb-1">
                            Design:
                        </label>
                        <select
                        name="design"
                        onChange={handleChange}
                        value={data.design}
                        className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">-- Select Design Type --</option>
                        {design.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                        
                    </div>
                     <div className="flex flex-col gap-2">
                       <label className="text-gray-400 font-semibold text-[11px] mb-1">
                        Jewellery Type:
                      </label>
                      <select
                        name="jewellery_type"
                        onChange={handleChange}
                        value={data.jewelleryType}
                        className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">-- Select Jewellery Type --</option>
                        {JewelleryType.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                        
                    <label className="text-gray-400 font-semibold text-[11px] mb-1">
                      Sub Category:
                    </label>
                    <select
                      name="subcategory"
                      onChange={handleSubCategoryChange}
                      value={data.subcategory}
                      disabled={!data.category}
                      className="border text-xs w-[200px] text-gray-500 h-[30px] px-3 rounded-sm bg-white border-gray-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Select Sub Category --</option>
                      {getSubCategories().map((subCat) => (
                        <option key={subCat.id} value={subCat.id}>
                          {subCat.name}
                        </option>
                      ))}
                    </select>
                        <label className="text-gray-400 font-semibold text-[11px] mb-1">
                            Design Group:
                        </label>
                        <input 
                            type="text" 
                            className="border w-[200px] h-[30px] rounded-sm bg-white border-gray-200 focus:outline-none focus:border-blue-500"
                        />
                        <label className="text-gray-400 font-semibold text-[11px] mb-1">
                           Pearl weight</label>
                          <input 
                            type="number" 
                            value={data.pearl_weight}
                            onChange={handleChange}
                            step='.1'
                            min='0'
                             name="pearl_weight"

                            style={{paddingLeft:'12px'}}
                            className="border w-[200px] h-[30px] rounded-sm bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                         <label className="text-gray-400 font-semibold text-[11px] mb-1">
                            Other Store Weight:
                        </label>
                        <input 
                            type="number" 
                            value={data.other_stone_weight}
                            onChange={handleChange}
                            step='.1'
                            min='0'
                            name="other_stone_weight"
                            style={{paddingLeft:'12px'}}
                            className="border w-[200px] h-[30px] rounded-sm bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    
                     <div className="flex flex-col gap-2">
                        <label className="text-gray-400 font-semibold text-[11px] mb-1">
  Brand:
</label>
<select
  name="brand"
  onChange={handleChange}
  value={data.brand}
  className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
>
  <option value="">-- Select Brand --</option>
  {Brand.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>

<label className="text-gray-400 font-semibold text-[11px] mb-1">
  Occasion:
</label>
<select
  name="occasion"
  onChange={handleChange}
  value={data.occasion}
  className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
>
  <option value="">-- Select Occasion --</option>
  {occasion.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>
                        <label className="text-gray-400 font-semibold text-[11px] mb-1">
  Made in:
</label>
<select
  name="made_in"
  onChange={handleChange}
  value={data.made_in}
  className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
>
  <option value="">-- Select Country --</option>
  {made_in.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>
           <label className="text-gray-400 font-semibold text-[11px] mb-1">
            Ruby  weight</label>
           <input 
                            type="number" 
                            value={data.ruby_weight}
                            onChange={handleChange}
                            step='.1'
                            min='0'
                            name="ruby_weight"
                            style={{paddingLeft:'12px'}}
                            className="border w-[200px] h-[30px] rounded-sm bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
 <label className="text-gray-400 font-semibold text-[11px] mb-1">
      Size:
    </label>
    <select
      name="size"
      onChange={handleChange}
      value={data.size}
      className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500 appearance-none" // appearance-none removes default select styling
    >
      <option value="">-- Select Size --</option>
      {size.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
    </div>
 <div className="flex flex-col  gap-2">




 <label className="text-gray-400 font-semibold text-[11px] mb-1">
  Style:
</label>
<select
  name="style"
  onChange={handleChange}
  value={data.style}
  className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
>
  <option value="">-- Select Style --</option>
  {style.map((item) => (
    <option key={item.id} value={ item.id}>
      {item.name}
    </option>
  ))}
</select>
 <label className="text-gray-400 font-semibold text-[11px] mb-1">
  Item Type <span className="text-red-500 text-[14px]">*</span>
</label>
<select
  name="item_type"
  onChange={handleChange}
  value={data.item_type}
  className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
>
  <option value="">-- Select Item Type --</option>
  {item_type.map((item) => (
    <option key={item.id} value={item.id}>
      {item.name}
    </option>
  ))}
</select>
                         
   <label className="text-gray-400 font-semibold text-[11px] mb-1">
  Gender:
</label>
<select
  name="gender"
  onChange={handleChange}
  value={data.gender}
  className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
>
  <option value="">-- Select Gender --</option>
  {gender.map((item) => (
    <option key={item.id} value={item.code || item.id}>
      {item.name}
    </option>
  ))}
</select>
                         
                  <label className="text-gray-400 font-semibold text-[11px] mb-1">
                        Metal Color:
                      </label>
                      <select
                        name="metal_color"
                        onChange={handleChange}
                        value={data.metal_color}
                        className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500 appearance-none"
                      >
                        <option value="">-- Select Color --</option>
                        {color.map((item) => (
                          <option key={item.id} value={item.code || item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                        <label className="text-gray-400 font-semibold text-[11px] mb-1">
                            Emerald Weight</label>
                        <input 
                            type="number" 
                            value={data.emerald_weight}
                            onChange={handleChange}
                            step='.1'
                            min='0'
                            name="emerald_weight"
                            style={{paddingLeft:'12px'}}
                            className="border w-[200px] h-[30px] rounded-sm bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                         
                    </div>
                    <div className="flex flex-col gap-3 ">
             <div className="flex flex-col gap-2">
                    <label className="text-gray-400 font-semibold text-[11px] mb-1 sm:mb-0 sm:w-48">
                        Is Gift Item<span className="text-red-500 text-[14px]">*</span>
                    </label>
                    <select
                        onChange={handleChange}
                        value={data.is_gift_item}
                         className="border text-xs w-[200px] text-gray-500 h-[30px] rounded-sm bg-white border-gray-200 px-3 focus:outline-none focus:border-blue-500"
                        name="is_gift_item"
                    >
                        <option value="">Select</option>
                        <option value="True">Yes</option>
                        <option value="False">No</option>
                    </select>
                </div>
             {/* <div className="flex flex-col gap-2">
                    <label className="text-gray-400 font-semibold text-[11px] mb-1">
                          Net Amount</label>
                          <input 
                            type="number" 
                            value={data.net_amount}
                            onChange={handleChange}

                            min='0'
                             name="net_amount"
                            style={{paddingLeft:'12px'}}
                            className="border w-[200px] h-[30px] rounded-sm bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                </div>
             <div className="flex flex-col gap-2">
                    <label className="text-gray-400 font-semibold text-[11px] mb-1">
                          Total Amount</label>
                          <input 
                            type="number" 
                            value={data.total_amount}
                            onChange={handleChange}

                            min='0'
                             name="total_amount"
                            style={{paddingLeft:'12px'}}
                            className="border w-[200px] h-[30px] rounded-sm bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                </div> */}
             <div className="flex flex-col gap-2">
                    <label className="text-gray-400 font-semibold text-[11px] mb-1">
                          Consider Mark Up</label>
                          <input 
                            type="number" 
                            value={data.mark_up}
                            onChange={handleChange}
                            min='0'
                            step='.1'
                             name="mark_up"
                            style={{paddingLeft:'12px'}}
                            className="border w-[200px] h-[30px] rounded-sm bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                </div>

                    </div>

                    
                    </div>
                    
              </div>
                </div>
            
  <div className="border border-gray-200 min-h-[200px] rounded-lg relative" style={{ padding: '20px' }}>
    <h3 className="absolute -top-3 left-4 bg-white  text-gray-400 font-semibold text-sm">
      Diamond Break Up
    </h3>
  <div className="overflow-auto  ">
  <div className="w-[1000px] h-[150px] mt-6">
   <table className="w-full text-sm  text-left border-separate border-spacing-x-2 border-spacing-y-1 min-w-[1400px]" >
        <thead className="bg-gray-200 text-gray-500 font-semibold">
          <tr>
            <th className=" bg-white py-2 text-center align-middle" style={{width:'80px'}}></th>
            <th className="   text-center align-middle" style={{width:'200px'}}>Carat</th>
            <th className=" text-center align-middle" style={{width:'200px'}}>PCS</th>
            <th className=" text-center align-middle" style={{width:'200px'}}>Clarity</th>
            <th className=" text-center align-middle" style={{width:'200px'}}>Purchase</th>
            <th className=" text-center align-middle" style={{width:'200px'}}>Cut</th>
            <th className=" text-center align-middle" style={{width:'200px'}}>Type</th>
            <th className=" text-center align-middle" style={{width:'200px'}}>Branch</th>
            <th className=" text-center align-middle" style={{width:'200px'}}>color</th>
            <th className=" text-center align-middle" style={{width:'200px'}}>Cert.No</th>
          </tr>
        </thead>
       {rows.map((row, rowIndex) => (
  <tbody key={row.id} className="bg-white border border-gray-200">
    <tr>
      <td className="bg-blue-100 flex justify-end text-blue-600 font-semibold">
        {rowIndex + 1}
      </td>
      
      {/* Carat */}
      <td className="rounded-sm border border-gray-200">
        <input
          type="number"
          min='0'
          step='.1'
          style={{paddingLeft:'12px'}}
          value={items[rowIndex]?.carat || ''}
          onChange={(e) => handleCellChange(rowIndex, 'carat', e.target.value)}
          className="w-full px-2 py-1 border-none focus:outline-none"
        />
      </td>
      
      {/* PCS */}
      <td className="rounded-sm border border-gray-200">
        <input
          type="number"
           style={{paddingLeft:'12px'}}

          value={items[rowIndex]?.no_of_pieces || ''}
          onChange={(e) => handleCellChange(rowIndex, 'no_of_pieces', e.target.value)}
          className="w-full px-2 py-1 border-none focus:outline-none"
        />
      </td>
      
      {/* Clarity */}
      <td className="rounded-sm border border-gray-200">
        <input
          type="number"
                     style={{paddingLeft:'12px'}}

          value={items[rowIndex]?.item_clarity || ''}
          onChange={(e) => handleCellChange(rowIndex, 'item_clarity', e.target.value)}
          className="w-full px-2 py-1 border-none focus:outline-none"
        />
      </td>
      <td className="rounded-sm border border-gray-200">
        <input
          type="text"
                     style={{paddingLeft:'12px'}}

          value={items[rowIndex]?.diamond_purchase || ''}
          onChange={(e) => handleCellChange(rowIndex, 'diamond_purchase', e.target.value)}
          className="w-full px-2 py-1 border-none focus:outline-none"
        />
      </td>
      <td className="rounded-sm border border-gray-200">
        <input
          type="number"
                     style={{paddingLeft:'12px'}}

          value={items[rowIndex]?.item_cut || ''}
          onChange={(e) => handleCellChange(rowIndex, 'item_cut', e.target.value)}
          className="w-full px-2 py-1 border-none focus:outline-none"
        />
      </td>
      
      <td className="rounded-sm border border-gray-200">
        <select
          value={items[rowIndex]?.item_type || ''}
          onChange={(e) => handleCellChange(rowIndex, 'item_type', e.target.value)}
          style={{paddingLeft:'12px'}}
          className="w-full py-1 pl-[12px] border-none focus:outline-none text-gray-400 text-xs bg-white"
        >
          <option value="">Select Item Type</option>
          {item_type.map((option) => (
            <option key={option.id} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      </td>

      <td className="rounded-sm border border-gray-200">
        <input
          type="text"
                     style={{paddingLeft:'12px'}}

          value={items[rowIndex]?.branch || ''}
          onChange={(e) => handleCellChange(rowIndex, 'branch', e.target.value)}
          className="w-full px-2 py-1 border-none focus:outline-none"
        />
      </td>
      <td className="rounded-sm border border-gray-200">
  <select
    value={items[rowIndex]?.item_color || ''}
    onChange={(e) => handleCellChange(rowIndex, 'item_color', e.target.value)}
    style={{paddingLeft:'12px'}}
    className="w-full py-1 pl-[12px] border-none focus:outline-none text-xs text-gray-500 bg-white"
  >
    <option value="">--Select Color--</option>
    {color.map((option) => (
      <option key={option.id} value={option.name}>
        {option.name}
      </option>
    ))}
  </select>
</td>

      <td className="rounded-sm border border-gray-200">
        <input
          type="text"
                     style={{paddingLeft:'12px'}}

          value={items[rowIndex]?.cert_no || ''}
          onChange={(e) => handleCellChange(rowIndex, 'cert_no', e.target.value)}
          className="w-full px-2 py-1 border-none focus:outline-none"
        />
      </td>
      
                <td className="rounded-sm  border border-gray-200">
                  <button 
                    onClick={addRow}
                    className="w-6 h-6 bg-green-500 text-white rounded flex items-center justify-center"
                  >
                    +
                  </button>
                </td>
                <td className="rounded-sm  border border-gray-200">
                  {row.type !== 'Main' && (
                    <button 
                      onClick={() => removeRow(row.id)}
                      className="w-6 h-6 bg-red-500 text-white rounded flex items-center justify-center"
                    >
                      -
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          ))}
       
        
       
        <tbody className="bg-white border border-gray-200">
          <tr>
            <td className=" bg-blue-100 flex justify-end text-blue-600 font-semibold"> Total</td>
            <td className=" rounded-sm  border border-gray-200 h-[0px]"                      style={{paddingLeft:'12px'}}
>{totalCarat}</td>
            <td className=" rounded-sm  border border-gray-200"                      style={{paddingLeft:'12px'}}
>{totalPieces}</td>
            
            
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </div>



          
<div className="flex flex-row gap-4 border border-gray-200 rounded-lg min-h-[200px] items-center justify-between relative" style={{padding:'20px'}}>
 <h3 className="absolute -top-3 left-4 bg-white px-2 text-gray-400 font-semibold text-sm">Tag Cost Detials</h3>

                    
  {/* Column 1 */}
  <div className="flex flex-col gap-2">
    <label className="text-gray-400 font-semibold text-[12px] mb-1">
      Cost Price :<span className="text-red-500 text-[14px]">*</span>
    </label>
    <input 
      type="number" 
      name="cost_price"
      value={data.cost_price}
      min='0'
      onChange={handleChange}
     placeholder="0.00"
     style={{paddingLeft:'12px'}}
      className="border w-full h-[30px] text-xs  rounded-sm  bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
    />
    <label className="text-gray-400 font-semibold text-[12px] mb-1">
      Additional Charge :<span className="text-red-500 text-[14px]">*</span>
    </label>
     <input 
      type="number" 
      name="additional_charge"
      value={data.additional_charge}
      min='0'
      onChange={handleChange}
     placeholder="0.00"
     style={{paddingLeft:'12px'}}
      className="border w-full h-[30px] text-xs  rounded-sm  bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
    />
  </div>

  {/* Column 2 */}
  <div className="flex flex-col gap-2">
    <label className="text-gray-400 font-semibold text-[11px] mb-1">
      Max Discount:
    </label>
     <input 
      type="number" 
      name="mark_up"
      value={data.discount}
      min='0'
      onChange={handleChange}
     placeholder="0%"
     style={{paddingLeft:'12px'}}
      className="border w-full h-[30px] text-xs  rounded-sm  bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
    />
    {/* <label className="text-gray-400 font-semibold text-[11px] mb-1">
      Mark up:
    </label>
    <input 
      type="number" 
      className="border w-full rounded-sm h-[30px] bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
    /> */}
  </div>

  {/* Column 3 */}
  <div className="flex flex-col gap-2">
    <label className="text-gray-400 font-semibold text-[11px] mb-1 sm:mb-0 sm:w-48">
     Tag Price
    </label>
    <input 
      type="number" 
      name="tag_price"
      value={data.tag_price}
      min='0'
      onChange={handleChange}
     placeholder="0"
     style={{paddingLeft:'12px'}}
      className="border w-full h-[30px] text-xs  rounded-sm  bg-white border-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
    />
  </div>

  
  
</div>
<div className="flex  w-full justify-end " style={{padding:'20px'}}>  {/* Container div */}
        <button onClick={handleSubmit} className="btn border-none bg-[#666DE4] text-white font-semibold   w-full lg:w-[150px]  rounded-lg">
          Save
        </button>
         </div>

          
        </div>
    ) 
}

export default ItemDetails