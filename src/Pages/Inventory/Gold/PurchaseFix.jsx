import { useEffect, useState } from "react";
import PurchaseFixModel from "../../../models/PurchaseFixModel";
import { toast } from "react-toastify";

const PurchaseFix = () => {

 const [utils, setUtils] = useState({
  uom: [],
  terms_of_payment: [],
  supplier: [],
  
});

const [data,setData]=useState({
  supplier:'',//id
  terms_of_payment:'',//id
  selling_unit:'',//id
  reference_no:'',
  payment_type:'',
  notes:'',
  settlement_weight:''
})

const [balanceWeight, setBalanceWeight] = useState('');




const findIdByName = (key, name) => {
  const data = utils[key] || [];
  const item = data.find(item => item.name === name);
  console.log(`Finding ID for ${key}: "${name}" in:`, data);
  console.log(`Found item:`, item);
  return item ? item.id : null;
};

const getDisplayValue = (key, value) => {
  if (!value) return '';
  if (!isNaN(value)) {
    console.log(`${key}: Value "${value}" is already an ID, using directly`);
    return value;
  }
  const id = findIdByName(key, value);
  console.log(`${key}: Converting name "${value}" to ID "${id}"`);
  return id;
};

const handleChange = (e) => {
  const { name, value } = e.target;
  console.log(`Field "${name}" changed to: "${value}"`);
  
  setData(prev => ({
    ...prev,
    [name]: value
  }));
  
  if (name === 'supplier') {
    console.log('Supplier changed, will trigger balance weight fetch');
  }
};

const handleSubmit = async () => {
  
  const submitData = {
    ...data,
    supplier: data.supplier ? parseInt(data.supplier) : null,
    terms_of_payment: data.terms_of_payment ? parseInt(data.terms_of_payment) : null,
    selling_unit: data.selling_unit ? parseInt(data.selling_unit) : null,
  };
  
  
  try {
    const response = await PurchaseFixModel.createPurchseFix(submitData)
    toast.success('Purchase fix created successfully!');
    } 
  catch (error) {
    toast.error('Failed to create purchase fix');
  }
};

const fetchPurchaseUtils = async () => {
  try {
    const response = await PurchaseFixModel.getPurchaseFixUtils();
    
    if (response.data && response.data.data && typeof response.data.data === 'object') {
     
      setUtils(prev => ({
        ...prev, 
        ...response.data.data 
      }));
    } else {
      console.error("Unexpected API response format");
      
      setUtils({
        uom: [],
        terms_of_payment: [],
        supplier: [],
      });
    }
  } catch (error) {
    console.error("Error fetching purchase utils:", error);
    
    setUtils({
      uom: [],
      terms_of_payment: [],
      supplier: [],
    });
    toast.error("Failed to load form options");
  }
};

const fetchPurchaseBalanceWeight = async() => {
  try {
    if(!data.supplier) {
      setBalanceWeight(''); 
      return;
    }
    const response = await PurchaseFixModel.getBalancedGoldWeight(data.supplier);
    if (response.data && response.data.balance_weight) {
      setBalanceWeight(response.data.balance_weight);
    } else {
      setBalanceWeight('0'); 
    }
    
  } catch(error) {
    toast.error('Failed to fetch balance weight');
    setBalanceWeight('');
  }
};


useEffect(() => {
  fetchPurchaseUtils();
}, []);

useEffect(() => {
  fetchPurchaseBalanceWeight();
}, [data.supplier]); 

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

      
     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7" style={{padding:"20px"}} >
          {/* code */}
         
          <div className="w-full ">
          <label className="text-xs font-bold  text-[#344767]"> Supplier</label>
          <select 
            name="supplier" 
            value={getDisplayValue('supplier', data.supplier)}
            onChange={handleChange}
            style={{paddingLeft:'12px'}}
            className="select bg-white select-bordered select-sm w-full  text-gray-400  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
               <option value="" disabled>select supplier</option>
               {utils.supplier.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
               ))}
           </select>
          </div>
          <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Balance Gold Weight</label>
          <input
              type="text"
              value={balanceWeight}
              readOnly
              style={{paddingLeft:'12px'}}

              className="input  input-bordered bg-gray-200 input-xs w-full text-gray-500 rounded-lg 
                      focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
                      [&::-webkit-calendar-picker-indicator]:opacity-50"
              placeholder="Balance weight "
          />
          </div>

      
        <div className="w-full">
          {/* name */}
        <label className="text-xs font-bold  text-[#344767]">Payment Type</label>
        <select 
          name="payment_type"
          value={data.payment_type}
          onChange={handleChange}
          style={{paddingLeft:"12px"}}
          className="select bg-white  select-bordered select-sm w-full  text-gray-400  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
        >
               <option value="" disabled>Select Payment Type</option>
               <option value="Cash">Cash</option>
               <option value="Bank">Bank</option>
           </select>
        </div>
        {/* item type */}
        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Selling Unit</label>
        <select 
          name="selling_unit"
          value={getDisplayValue('uom', data.selling_unit)}
          onChange={handleChange}
          style={{paddingLeft:"12px"}}

          className="select bg-white select-bordered select-sm w-full  text-gray-400  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
        >
          <option value="" disabled>Select Selling Unit</option>
          {utils.uom.map((unit) => (
            <option key={unit.id} value={unit.id}>{unit.name}</option>
          ))}
        </select>
        </div>
        {/* uom */}
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Supplier Currency</label>
          <input
              type="text"
              className="input input-bordered bg-gray-200 input-sm w-full text-gray-500 rounded-lg 
                      focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
                      [&::-webkit-calendar-picker-indicator]:opacity-50"
              placeholder=" "
          />
          </div>

        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Terms of Payment</label>
          <select
            name="terms_of_payment"
            value={getDisplayValue('terms_of_payment', data.terms_of_payment)}
            onChange={handleChange}
            style={{paddingLeft:"12px"}}

            className="select bg-white select-bordered select-sm w-full text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option value="" disabled>Select Terms of Payment</option>
            {utils.terms_of_payment.map((term) => (
              <option key={term.id} value={term.id}>{term.name}</option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Settelment Weight</label>
          <input
              type="text"
              name="settlement_weight"
              value={data.settlement_weight}
              onChange={handleChange}
              className="input input-bordered  bg-white  input-sm w-full text-gray-500 rounded-lg 
                      focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
                      [&::-webkit-calendar-picker-indicator]:opacity-50"
              placeholder="Settelment Weight "
              style={{paddingLeft:'12px'}}
          />
          </div>
          <div className="w-full">
      <label className="text-xs font-bold  text-[#344767]">Notes</label>
      <textarea 
        name="notes"
        value={data.notes}
        onChange={handleChange}
        className="textarea bg-white border-gray-300 textarea-gray text-xs rounded-lg " 
        placeholder="notes"
          style={{padding:"12px"}}

      ></textarea>   
     </div>
     <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Reference Number</label>
          <input
              type="text"
              name="reference_no"
              value={data.reference_no}
              onChange={handleChange}
              style={{paddingLeft:'12px'}}
              className="input bg-white input-bordered  input-sm w-full text-gray-500 rounded-lg 
                      focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
                      [&::-webkit-calendar-picker-indicator]:opacity-50"
              placeholder="  Reference Number"
          />
          </div>
          

      </div>
      {/* ---------------------------------------------------- */}

      <div className="flex justify-center items-center h-[50px]" style={{padding:'20px'}}>
      <hr className="w-full border-gray-300" />
      </div>   

      {/* ---------------------------------------------------- */}

      
      <div className="flex  w-full h-[20vh]  mt-4 justify-end text-white " style={{padding:"20px"}}>  
          <button className="btn border-none text-white text-xs  bg-blue-700  w-full  sm:w-1/4 md:w-[10vw] rounded-lg" onClick={handleSubmit}>
            Save
          </button>
          
       </div>
   
      <div className="overflow-auto custom-scrollbar" style={{ maxHeight: '10vh'  ,padding:'20px'}}>
       <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1000px]
                       " style={{ borderSpacing: '0 12px', borderCollapse: 'separate', }}>
                         <thead className="text-xs text-gray-400 uppercase bg-white">
                           <tr>
                             <th className="px-6 py-3" style={{width:'60PX'}} >SL NO</th>
                             <th className="px-6 py-3 " style={{width:'120px'}} >PAYMENT TYPE</th>
                             <th className="px-6 py-3 "  style={{width:'120px'}}>METAL RATE PER GRAM USD</th>
                             <th className="px-6 py-3   " style={{width:'120px'}} >CASH AMOUNT ($)</th>
                             <th className="px-6 py-3 "  style={{width:'120px'}}>NOTES</th>
                             <th className="px-6 py-3 " style={{width:'120px'}} >TERMS OF PAYMENT</th>
                             <th className="px-6 py-3 "  style={{width:'120px'}}>REFERENCE NUMBER</th>
                           </tr>
                         </thead>
                         <tbody>
                           
                         
                            
                            
                             
                             
                             
                             
                            
                          
                         </tbody>
                       </table>
                       </div>
    </div>
  );
};

export default PurchaseFix








