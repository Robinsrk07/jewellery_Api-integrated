import { useEffect, useState } from "react";
import DiamondModel from "../../../models/DiamondModel";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import PurchaseUtils from "../../../models/PurchaseUtils";
import UtilsGetModel from "../../../models/Utils_getModel";
import TaxModel from "../../../models/TaxModel";
const EditDiamondItem = () => {

    const location = useLocation();
    const {item}= location.state || {}


    const [data, setData] = useState({
        item_type: item?.item_type || '',
        supplier: item?.supplier || '',
        terms_of_payment: item?.terms_of_payment || '',
        stock_point: item?.stock_point || '',
        default_tax: item?.default_tax || '',
        item_name: item?.item_name || '',
        sale_markup: item?.sale_markup || '',
        reference_no: item?.reference_no || '',
        reference_date: item?.reference_date || '',
        no_of_pieces: item?.no_of_pieces || '',
        total_amount: item?.total_amount || '',
        net_amount: item?.net_amount || '',
        notes: item?.notes || '',
        prefix: item?.prefix || '',
        id_start_from: item?.id_start_from || '',
        id_length: item?.id_length || '',
        branch: item?.branch || '',
        item_code: item?.item_code || ''
    });

    
    
    
const utils = [
            {
            'item_type':[{'id':12,'name':'Gold'},{'id':14,'name':'Diamond'}]
            },{
            'default_tax':[{'id':1,'name':'Gold- default-Input-Tax:1.000000% -output_tax:1.00000%'},{'id':2,'name':'Gold- default-Input-Tax:1.000000% -output_tax:1.00000%'}]
            },{
            'supplier':[{'id':1,'name':'GOLD_SUPPLIER_DUBAI'},{'id':2,'name':'GOLD_SUPPLIER_DUBAI_001'}]
            },{
            'terms_of_payment':[{'id':1,'name':'bhjbhj'},{'id':2,'name':'FGSGS'}]
            },{
            'stock_point':[{'id':18,'name':"Reserved Stock"},{'id':19,'name':'Low Stock Alert'},{'id':20,'name':'Warehouse Stock'},{'id':21,'name':'In-Store Stock'},{'id':22,'name':'Transit Stock'},]
            },{
           ' branch':[{'id':1,'name':'Dubai'},{'id':2,'name':'AbhuDhabi'}]
            }
            ]
          const [purchaseUtils,setPurchaseUtils] =useState([])
             const [goldUtils,setGoldUtils] =useState([])
             const [allUtils,setAllUtils]=useState([])
             const[tax,setTax] = useState([])
             const auth = useSelector((state) => state.auth);
             const { login_id  } = auth
             const user_id = login_id;
             console.log(tax)
             console.log(allUtils)
            const item_type =  allUtils.find(item=>item.item_type)?.item_type || []
             console.log(item_type)
             const supplier =  allUtils.find(item=>item.supplier_list)?.supplier_list || []
             const terms_of_payment =  allUtils.find(item=>item.terms_of_payment)?.terms_of_payment || []
             const stock_point =  allUtils.find(item=>item.stock_point)?.stock_point || []
             console.log(supplier)
             console.log(terms_of_payment)
             console.log(stock_point)

           const handleChange = (e) => {
              const { name, value } = e.target;
              setData(prevData => ({
                ...prevData,
                [name]: value
              }));
            };
           const handleSubmit = async() => {
            console.log(data)
            // Filter out empty strings, null, and undefined values
            const validData = Object.fromEntries(
              Object.entries(data).filter(([key, value]) => 
                value !== '' && value !== null && value !== undefined
              )
            );
            try{
            const response = await DiamondModel.EditDiamondItem(validData,item.uuid)
            toast.success("Diamond Updated  Succesfully")

            }catch(error){
                toast.error('Please Try Again,failed to Create Diamond Item')
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
                                      setTax(response.data.data)
                                    }
                                  }catch(error){
                                   console.error(error)
                                  }
                    
                    
                               }         
                           useEffect(()=>{
                                 fetchTax()
                                 fetchGoldUtils()
                                 fetchPurchaseUtils()
                                              
                                 },[])
                    
                             useEffect(() => {
                              if (purchaseUtils.length && goldUtils.length) {
                                setAllUtils([...purchaseUtils, ...goldUtils]);
                                 }
                              }, [purchaseUtils, goldUtils]);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4" style={{padding:'20px'}}>
        {/* code */}
        
        
          
          {/* item type */}
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]">Item Type <span className="text-red-500 text-[14px]">*</span></label>
            <select name="item_type" value={data.item_type} style={{paddingLeft:'12px'}} onChange={handleChange}  className="select select-bordered select-sm w-full bg-white text-gray-400 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
              <option className="text-gray-300" disabled >
                Select ItemType
              </option>
              {
                // Find the 'item_type' object in utils and map over it
                (utils.find(item => item.item_type)?.item_type || []).map(option => (
                  <option key={option.id} value={option.id} className="text-black">
                    {option.name}
                  </option>
                ))
              }
            </select>
          </div>

          

              <div className="w-full">
              <label className="text-xs font-bold text-[#344767]">Default Tax</label>
              <select style={{paddingLeft:'10px'}} name="default_tax" value={data.default_tax}  onChange={handleChange} className="select select-bordered bg-white select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
                <option disabled selected>Default Input Tax</option>

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
    className="select select-bordered bg-white select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
  >
    <option disabled selected>------</option>
     {supplier.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
  </select>
</div>
<div className="w-full">
  <label className="text-xs font-bold text-[#344767]">Terms Of Payment</label>
  <select style={{paddingLeft:'12px'}} name="terms_of_payment" value={data.terms_of_payment}  onChange={handleChange} className="select select-bordered bg-white select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
    <option disabled selected>------</option>
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
        <option disabled selected>------</option>
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
        </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]">Sale Mark up <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="number"
            min="0"
            name="sale_markup"
            value={data.sale_markup}
             style={{paddingLeft:'12px'}}
              onChange={handleChange}
            placeholder="mark up"
            className="input input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
        </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]">name  <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="text"
            placeholder="name"
             onChange={handleChange}
                 name="item_name"
            value={data.item_name}
            style={{paddingLeft:'12px'}}
            className="input input-bordered input-sm w-full rounded-lg 
            focus:outline-none bg-white focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
        </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]">Total Amount <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="number"
            min="0"
            placeholder="total amount"
             onChange={handleChange}
             name="total_amount"
             value={data.total_amount}
            style={{paddingLeft:'12px'}}
            className="input input-bordered input-sm w-full rounded-lg 
            focus:outline-none bg-white focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
        </div>
          
         
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> net amount <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="number"
            min="0"
            placeholder="Net amount"
            name='net_amount'
            value={data.net_amount}
             onChange={handleChange}
            style={{paddingLeft:'12px'}}
            className="input input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
        </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> Pre Fix <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="text"
            placeholder="total amount"
             name='prefix'
            value={data.prefix}
             onChange={handleChange}
            style={{paddingLeft:'12px'}}
            className="input input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
        </div>
       
         <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> Id Start From</label>
            <input
            type="number"
            min="0"
            placeholder="total amount"
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
          <select className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> Item code <span className="text-red-500 text-[14px]">*</span></label>
            <input
            type="text"
            placeholder="total amount"
            style={{paddingLeft:'12px'}}
             onChange={handleChange}
             name='item_code'
             value={data.item_code}
            className="input input-bordered bg-white input-sm w-full rounded-lg 
            focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300
            appearance-auto"
        />
        </div>
          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> Reference Number</label>
            <input
            type="number"
            min="0"
             onChange={handleChange}
             name=''
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
            <textarea name="notes" value={data.notes} className="w-full border border-gray-200 rounded-lg"></textarea>
        </div>
           




          
       {/* --------------- */}
          
      
        </div>
        <div className="flex  w-full justify-end " style={{padding:'20px'}}>  {/* Container div */}
        <button onClick={handleSubmit} className="btn border-none bg-[#666DE4] text-white font-semibold   w-full lg:w-[150px]  rounded-lg">
        Update Changes
        </button>
         </div>
      </div>
        );
  };
  
  export default EditDiamondItem



