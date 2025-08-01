import { useEffect, useState,useRef  } from "react";
import DiamondModel from "../../../models/DiamondModel";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import BranchModel from "../../../models/branchModel";
import PurchaseUtils from "../../../models/PurchaseUtils";
import UtilsGetModel from "../../../models/Utils_getModel";
import TaxModel from "../../../models/TaxModel";
import BackButton from "../../../components/BackButton";
import { useSelector } from "react-redux";
const CreateDiamondPurchase = () => {
const navigate = useNavigate()

             const [purchaseUtils,setPurchaseUtils] =useState([])
             const [goldUtils,setGoldUtils] =useState([])
             const [allUtils,setAllUtils]=useState([])
             const [errors, setErrors] = useState({});
             const [branch,setBranch] = useState([])
             const [DiamondUtils,setDiamondUtils] = useState([])
             const[tax,setTax] = useState([])
             const auth = useSelector((state) => state.auth);
             const { login_id  } = auth
             const user_id = login_id;
             const user_types=''
          


            // ItemType,supplier , no of picesce, sale markup,name,total amount,net amount , prefix,item code
              const itemTypeRef = useRef(null);
              const supplierRef = useRef(null);
              const noOfPiecesRef = useRef(null);
              const saleMarkupRef = useRef(null);
              const itemNameRef = useRef(null);
              const totalAmountRef = useRef(null);
              const netAmountRef = useRef(null);
              const prefixRef = useRef(null);
              const itemCodeRef = useRef(null);

            const[data,setData]=useState({
              item_type:'',
              supplier:'',
              terms_of_payment:'',
              stock_point:'',
              default_tax:'',
              item_name:'',
              sale_markup:'',
              reference_no:'',
              reference_date:'',
              no_of_pieces:'',
              total_amount:'',
              net_amount:'',
              notes:'',
              prefix:'',
              id_start_from:'',
              id_length:'',
              branch:'',
              item_code:''

            })     
             const item_type =  DiamondUtils.find(item=>item.item_type)?.item_type || []
             
             
             const supplier =  allUtils.find(item=>item.supplier_list)?.supplier_list || []
             const terms_of_payment =  DiamondUtils.find(item=>item.terms_of_payment)?.terms_of_payment || []
             const stock_point =  DiamondUtils.find(item=>item.stock_point)?.stock_point || []
           

           const handleChange = (e) => {
              const { name, value } = e.target;
              setData(prevData => ({
                ...prevData,
                [name]: value
              }));
               setErrors(prevErrors => {
    const newErrors = { ...prevErrors };
    delete newErrors[name];
    return newErrors;
  });
            };

            
const requiredFields = [
  'item_type',
  'supplier',
  'no_of_pieces',
  'sale_markup',
  'item_name',
  'total_amount',
  'net_amount',
  'prefix',
  'item_code'
];

const validateForm = () => {
  const newErrors = {};

  requiredFields.forEach(field => {
    const value = data[field];
    if (!value || value.toString().trim() === '') {
      newErrors[field] = 'This field is required';
    }
  });

  // Format validations
  if (data.prefix && !/^[A-Z]{2,5}$/.test(data.prefix)) {
    newErrors.prefix = 'Prefix must be 2-5 uppercase letters';
  }

  if (data.item_name && !/^[a-zA-Z0-9\s]{3,50}$/.test(data.item_name)) {
    newErrors.item_name = 'Item name must be 3-50 characters, letters/numbers only';
  }

  if (data.item_code && !/^[A-Z0-9-]{3,20}$/.test(data.item_code)) {
    newErrors.item_code = 'Item code must be 3-20 characters, A-Z, 0-9, or -';
  }

  setErrors(newErrors);

  // 🔧 Focus on the first error field using hardcoded refs
  if (newErrors.item_type) return itemTypeRef.current?.focus(), false;
  if (newErrors.supplier) return supplierRef.current?.focus(), false;
  if (newErrors.no_of_pieces) return noOfPiecesRef.current?.focus(), false;
  if (newErrors.sale_markup) return saleMarkupRef.current?.focus(), false;
  if (newErrors.item_name) return itemNameRef.current?.focus(), false;
  if (newErrors.total_amount) return totalAmountRef.current?.focus(), false;
  if (newErrors.net_amount) return netAmountRef.current?.focus(), false;
  if (newErrors.prefix) return prefixRef.current?.focus(), false;
  if (newErrors.item_code) return itemCodeRef.current?.focus(), false;

  return Object.keys(newErrors).length === 0;
};




           const handleSubmit = async() => {
            if (!validateForm()) {
              toast.error("Please fill all required fields.");
              return;
  }
            // Filter out empty strings, null, and undefined values
            const validData = Object.fromEntries(
              Object.entries(data).filter(([key, value]) => 
                value !== '' && value !== null && value !== undefined
              )
            );
            try{
            const response = await DiamondModel.CreateDiamondItems(validData)
            toast.success("Diamond Item Created Succesfully")
            navigate('/dashboard/diamond-items')

          } catch (error) {


  let message = "Please try again, failed to create Diamond Item.";

  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;

    if (typeof errors === 'object') {
      message = Object.entries(errors)
        .map(([field, msgs]) => {
          // Format field: replace _ with space and capitalize first letter
          const formattedField = field.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
          const text = Array.isArray(msgs) ? msgs.join(', ') : msgs;
          return `${formattedField}: ${text}`;
        })
        .join('\n');
    }
  } else if (error.response?.data?.message) {
    message = error.response.data.message;
  }

  toast.error(message);
}


            


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
          
                        const fetchTax = async()=>{
          
                        try{
                        const response = await TaxModel.getTax(user_id)
                          if(response){
                            setTax(response?.data?.data)
                          }
                        }catch(error){
                         console.error(error)
                        }
          
          
                     }    
                     
                     const fetchDiamondUtils =async () =>{
                      try{
                       const response = await DiamondModel.GetDiamondUtils()
                     
                       setDiamondUtils(response?.data?.data)
                      }catch(error){
                          console.log(error)
                      }
                     }

                 useEffect(()=>{
                       fetchTax()
                       fetchGoldUtils()
                       fetchPurchaseUtils()
                       fetchDiamondUtils()
                                    
                       },[])
          
                   useEffect(() => {
                    if (purchaseUtils.length && goldUtils.length) {
                      setAllUtils([...purchaseUtils, ...goldUtils]);
                       }
                    }, [purchaseUtils, goldUtils]);

                    useEffect(()=>{
                        const fetchBranch  = async ()=>{
                          try{
                            const res = await BranchModel.getBranches(user_id,user_types,1000)
                            setBranch(res?.data?.data)
                          }catch(error){
                            console.error(error)
                          }
                        }
                        fetchBranch()
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
          mx-auto overflow-auto custom-scrollbar text-gray-500"
        style={{ fontFamily: 'Open Sans' }}
      >
        <div style={{paddingTop:'20px',paddingRight:'20px'}}><BackButton to='/dashboard/diamond-items'/></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4" style={{padding:'20px'}}>
        {/* code */}
        
        
          
          {/* item type */}
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]">Item Type <span className="text-red-500 text-[14px]">*</span></label>
            <select name="item_type" value={data.item_type}   ref={itemTypeRef} style={{paddingLeft:'12px'}} onChange={handleChange}  className="select select-bordered select-sm w-full bg-white text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
              <option value =''>--select option --</option>
              <option value={item_type.id} className="text-black">
                {item_type.name}
              </option>
                        

              {/* <option value ={14}>Diamond</option> */}
            </select>
            {errors.item_type && <p className="text-red-500 text-xs mt-1">{errors.item_type}</p>}
          </div>

          

              <div className="w-full">
              <label className="text-xs font-bold text-[#344767]">Default Tax</label>
              <select style={{paddingLeft:'10px'}} name="default_tax" value={data.default_tax}  onChange={handleChange} className="select select-bordered bg-white select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
              <option value =''>--select option --</option>

                {tax.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.tax_name}
                          </option>
                        ))}
              </select>
            </div>



      
         
          
          <div className="w-full">
  <label className="text-xs font-bold text-[#344767]">Supplier <span className="text-red-500 text-[14px]">*</span></label>
  <select
    style={{ paddingLeft: '12px' }}
     onChange={handleChange}
     name="supplier" value={data.supplier}
      ref={supplierRef}
    className="select select-bordered bg-white select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
  >
              <option value =''>--select option --</option>
     {supplier.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
  </select>
  {errors.supplier && <p className="text-red-500 text-xs mt-1">{errors.supplier}</p>}
</div>
<div className="w-full">
  <label className="text-xs font-bold text-[#344767]">Terms Of Payment</label>
  <select style={{paddingLeft:'12px'}} name="terms_of_payment" value={data.terms_of_payment}  onChange={handleChange} className="select select-bordered bg-white select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
              <option value =''>--select option --</option>
    {terms_of_payment.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
  </select>
</div>

       {/* --------------- */}
         

        <div className="w-full">
      <label className="text-xs font-bold text-[#344767]">Stock Point </label>
      <select style={{paddingLeft:'12px'}} name="stock_point"  value={data.stock_point} onChange={handleChange} className="select text-xs select-bordered bg-white select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
              <option value =''>--select option --</option>
       {stock_point.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
      </select>
    </div>

          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]">No of Pieces <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="number"
             ref={noOfPiecesRef }
            min="0"
            name='no_of_pieces'
            value={data.no_of_pieces}
            
            placeholder="no of piece"
             onChange={handleChange}
            style={{paddingLeft:'12px'}}
            className="input  input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
        {errors.no_of_pieces && <p className="text-red-500 text-xs mt-1">{errors.no_of_pieces}</p>}
        </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]">Sale Mark up <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="number"
            min="0"
            name="sale_markup"
             ref={saleMarkupRef}
            value={data.sale_markup}
             style={{paddingLeft:'12px'}}
              onChange={handleChange}
            placeholder="mark up"
            className="input input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
          {errors.sale_markup && <p className="text-red-500 text-xs mt-1">{errors.sale_markup}</p>}
        </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]">name  <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="text"
            placeholder="name"
             ref={itemNameRef }
             onChange={handleChange}
                 name="item_name"
            value={data.item_name}
            style={{paddingLeft:'12px'}}
            className="input input-bordered input-sm w-full rounded-lg 
            focus:outline-none bg-white focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
         {errors.item_name && <p className="text-red-500 text-xs mt-1">{errors.item_name}</p>}
        </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]">Total Amount <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="number"
            min="0"
            placeholder="total amount"
             onChange={handleChange}
                ref={totalAmountRef}
             name="total_amount"
             value={data.total_amount}
            style={{paddingLeft:'12px'}}
            className="input input-bordered input-sm w-full rounded-lg 
            focus:outline-none bg-white focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
         {errors.total_amount && <p className="text-red-500 text-xs mt-1">{errors.total_amount}</p>}
        </div>
          
         
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> net amount <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="number"
            min="0"
            placeholder="Net amount"
            name='net_amount'
            ref={netAmountRef}
            value={data.net_amount}
             onChange={handleChange}
            style={{paddingLeft:'12px'}}
            className="input input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
         {errors.net_amount && <p className="text-red-500 text-xs mt-1">{errors.net_amount}</p>}
        </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> Pre Fix <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="text"
            placeholder="prefix"
             ref={prefixRef}
             name='prefix'
            value={data.prefix}
             onChange={handleChange}
            style={{paddingLeft:'12px'}}
            className="input input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
         {errors.prefix && <p className="text-red-500 text-xs mt-1">{errors.prefix}</p>}
        </div>
       
         <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> Id Start From</label>
            <input
            type="number"
            min="0"
            placeholder="id start from"
             onChange={handleChange}
             name='id_start_from'
             value={data.id_start_from}
            style={{paddingLeft:'12px'}}
            className="input input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
        </div>
         <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> Id length</label>
            <input
            type="number"
            min="0"
            name='id_length'
            value={data.id_length}
            placeholder="id_length"
             onChange={handleChange}
             style={{paddingLeft:'12px'}}
            className="input input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
        </div>

         <div className="full">
          <label className="text-xs font-bold  text-[#344767]"> Branch</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
              <option value =''>--select option --</option>


              {branch.map((item)=>
              <option className="text-sm text-gray-500" value={item.id}>{item.name}</option>
              )}
      
          </select>
          </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> Item code <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="text"
            placeholder="Item code"
             ref={itemCodeRef}
            style={{paddingLeft:'12px'}}
             onChange={handleChange}
             name='item_code'
             value={data.item_code}
            className="input input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
         {errors.item_code && <p className="text-red-500 text-xs mt-1">{errors.item_code}</p>}
        </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> Reference Number</label>
            <input
            type="number"
            min="0"
             onChange={handleChange}
             name='reference_no'
             value={data.reference_no}
            placeholder="Reference Number"
            style={{paddingLeft:'12px'}}
            className="input input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
        </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> Reference Date</label>
            <input
            type="date"
            name="reference_date"
            value={data.reference_date}
            onChange={handleChange}
            placeholder="total amount"
            style={{paddingLeft:'12px'}}
            className="input input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
        </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> notes</label>
            <textarea name="notes"             onChange={handleChange} placeholder="notes"
  value={data.notes} className="w-full text-xs  border border-gray-200 rounded-lg" style={{padding:'12px'}}></textarea>
        </div>
           




          
       {/* --------------- */}
          
      
        </div>
        <div className="flex  w-full justify-end " style={{padding:'20px'}}>  {/* Container div */}
        <button onClick={handleSubmit} className="btn border-none bg-[#666DE4] text-white font-semibold   w-full lg:w-[150px]  rounded-lg">
          Save
        </button>
         </div>
      </div>
        );
  };
  
  export default CreateDiamondPurchase



