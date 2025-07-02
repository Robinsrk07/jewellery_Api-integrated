

import { useState } from "react";
import DiamondModel from "../../../models/DiamondModel";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
const CreateDiamond = () => {
const navigate = useNavigate()
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
            'stock_point':[{'id':1,'name':"Reserved Stock"},{'id':22,'name':'Back room/reverse stock'},{'id':18,'name':'Warehouse Stock'},{'id':19,'name':'In-Store Stock'},{'id':20,'name':'Transit Stock'},]
            },{
           ' branch':[{'id':1,'name':'Dubai'},{'id':2,'name':'AbhuDhabi'}]
            }
            ]

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

           const handleChange = (e) => {
              const { name, value } = e.target;
              setData(prevData => ({
                ...prevData,
                [name]: value
              }));
            };
           const handleSubmit = async() => {
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

            }catch(error){
                toast.error('Please Try Again,failed to Create Diamond Item')
            }
            


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
  <label className="text-xs font-bold text-[#344767]">Supplier <span className="text-red-500 text-[14px]">*</span></label>
  <select
    style={{ paddingLeft: '12px' }}
     onChange={handleChange}
     name="supplier" value={data.supplier}
    className="select select-bordered bg-white select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
  >
    <option disabled selected>------</option>
    {
      (utils.find(item => item.supplier)?.supplier || []).map(option => (
        <option key={option.id} value={option.id} className="text-xs text-gray-500">
          {option.name}
        </option>
      ))
    }
  </select>
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
        
       
        
         

         <div className="full">
          <label className="text-xs font-bold  text-[#344767]"> Branch</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>

         <div className="full">
          <label className="text-xs font-bold  text-[#344767]"> Diamond Item</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>


          <div className="w-full">
            <label className="text-xs font-bold text-[#344767]"> Diamond Image </label>
            <input
            type="file"
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
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> Is Gift Item </label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> Consider Profit Margin</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> UOM</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> Jewellery Type</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> Style</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> category</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> Subcategory</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> occasion</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> gender</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> design</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> Made in</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> Color</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>
        <div className="flex  flex-col gap-2">
          <label className="text-xs font-bold  text-[#344767]"> Size</label>
          <select style={{paddingLeft:'12px'}} className="select select-bordered bg-white select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
          <option disabled selected>------</option>
          <option className="text-sm text-gray-500">Active</option>
          <option  className="text-sm text-gray-500">Inactive</option>
          </select>
          </div>

           <div className="w-full">
            <label className="text-xs font-bold text-[#344767]">Gold Weight</label>
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
            <label className="text-xs font-bold text-[#344767]">Ruby Weight</label>
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
            <label className="text-xs font-bold text-[#344767]">Emerald Weight</label>
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
            <label className="text-xs font-bold text-[#344767]">Saphire Weight</label>
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
            <label className="text-xs font-bold text-[#344767]">Other Stone Weight</label>
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
  
  export default CreateDiamond



