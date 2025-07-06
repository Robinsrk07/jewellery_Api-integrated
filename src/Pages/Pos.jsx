import React, { useState, useEffect } from "react";
import {useDispatch,useSelector} from 'react-redux'
import POSModel from "../models/PosModel";
import { addCustomer } from "../StateManagement/CustomerSlice";
import Loader from "./../components/Loader";
import { toast } from "react-toastify";


import { addItemToCart ,removeItemFromCart ,clearItemData  } from "../StateManagement/posItemSlice";
import { useNavigate } from "react-router";

  const Pos = () => {
    
  const [mobileSearch, setMobileSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddNewOpen, setIsAddNewOpen] = useState(false);
  const [isViewMoreOpen, setIsViewMoreOpen] = useState(false);
  const [isNewCustomer, setNewCustomer] = useState(false);
  const [Loading,setLoading] =useState(false)
  const [itemData,setItemsData] = useState([])
  const [cart,setCart] =useState([])
  const [selectedField, setSelectedField] = useState('');
  const cartItems = useSelector((state) => state.posItem?.itemData || []);
  console.log(cart)
  const navigate = useNavigate()
  const [customerDetails, setCustomerDetails] = useState({
      name: '',
      phoneNumber: '',
      email: '',
      address: ''
    });

    const fields = [
  "making_rate",
  "stone_rate",
  "multi_stone_rate",
  "wastage_rate",
  "other_charges",
  "gross_weight",
  "net_weight",
  "gross_amount",
  "net_amount",
  "taxable_amount",
  "tax",
  "total_with_tax",
  "round_off",
  "total_discount",
  "final_amount",
  "grand_total",
  "gold_value",
  "diamond_value",
  "stone_value",
  "silver_value",
  "platinum_value",
  "labour_charge",
  "setting_charge",
  "engraving_charge",
  "shipping_charge"
];

     const [params,setParams]=useState({
      code:'3366090',
      type:''
     })

     const handleItemChange = (e) => {
      const { name, value } = e.target;
      setParams(prev => ({
        ...prev,
        [name]: value
      }));
    };


const CreateCart = (cart) => {
  const grouped = {};

  cart.forEach((item) => {
    if (!item.uuid) return;

    const selling_price = Number(item.Net_Amount || item.tag_price || 0);
    const discount = Number(item.discount || 0);

    if (grouped[item.uuid]) {
      grouped[item.uuid].quantity += 1;
      grouped[item.uuid].final_amount = grouped[item.uuid].quantity * grouped[item.uuid].selling_price;
      grouped[item.uuid].final_discount = grouped[item.uuid].quantity * grouped[item.uuid].discount;
    } else {
      const baseData = {
        item_type: item.item_type || "",
        quantity: 1,
        selling_price,
        discount,
        message: item.description || "",
        discount_on: item.discount_on || "",
        final_discount: discount, // initial = discount * 1
        final_amount: selling_price, // initial = price * 1
      };

      if (item.item_type === "Gold") {
        grouped[item.uuid] = {
          gold_item: item.uuid,
          ...baseData
        };
      } else if (item.item_type === "Diamond") {
        grouped[item.uuid] = {
          diamond_item: item.uuid,
          ...baseData
        };
      }
    }
  });

  return Object.values(grouped);
};


    const handleCheckout = async () => {
      const payload = CreateCart(cart); 
      console.log(payload)
      const formData = new FormData();
      formData.append("customer", 1);  
      payload.forEach((item) => {
        Object.entries(item).forEach(([key, value]) => {
          formData.append(key, value);
        });
      });
      try {
        const response = await POSModel.CreateCart(formData);
           setLoading(true)

           const cartResponseData = response.data; 

           setTimeout(() => {
            navigate('/dashboard/completePayment', { state: { cartData: cartResponseData } });
           }, 1000);
           console.log("Cart created successfully", response.data);
      } catch (error) {
        toast.error("Please Try Again")
      }
    };


     const handleGetData =async()=>{
        try{
           const response = await POSModel.getItemDetails(params.code,params.type)
           setItemsData(response.data.data)
           
        }catch(error){
            console.error(error)
        }
     }
     const dispatch = useDispatch()

    const handleChange = (e) => {
    const { name, value } = e.target;
     setCustomerDetails(prev => ({
     ...prev,
     [name]: value
    }));
    };

   const handleSaveCustomer = () => {
      dispatch(addCustomer(customerDetails));
      setLoading(true);

      setTimeout(() => {
        setCustomerDetails({
          name: '',
          phoneNumber: '',
          email: '',
          address: ''
        });
        setNewCustomer(false);
        setLoading(false);
      }, 3000);
    };

    const handleAddToCart = (item) => {
      setLoading(true);
    setTimeout(()=>{
    const newItem = { ...item }; 
      if (selectedField) newItem.discount_on = selectedField;
      dispatch(addItemToCart(newItem));
      setLoading(false);

    },1000)
  

  setIsAddNewOpen(false);
};

const handleRemove = (uuid) => {
  dispatch(removeItemFromCart(uuid));
};
const handleClearCart = () => {
  dispatch(clearItemData());
};

const handleRemoveItem = (removeIndex) => {
  const updatedCart = cart.filter((_, index) => index !== removeIndex);
  setCart(updatedCart);
};

const groupedCart = cart.reduce((acc, item) => {
  if (!item.uuid) return acc;

  const existing = acc.find((i) => i.uuid === item.uuid);
  if (existing) {
    existing.quantity += 1;
  } else {
    acc.push({ ...item, quantity: 1 });
  }
  return acc;
}, []);


  const handleViewMoreClick = () => {
    setIsViewMoreOpen(!isViewMoreOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

 const total = cartItems.reduce((sum, item) => {
  const value = item.Total_Amount ?? item.tag_price ?? 0;
  return sum + parseFloat(value);
}, 0);

  const totalsData = [
    { label: "Totals", value: total},
    { label: "Sales", value: "Value" },
    { label: "Gross Wt.", value: "Value" },
    { label: "Pcs", value: "Value" },
    { label: "Amount", value: "Value" },
    { label: "Discount", value: "Value" },
    { label: "Rounding", value: "Value" },
    { label: "Total Discount", value: "Value" },
    { label: "Collection", value: "Value" },
    { label: "Currency", value: "Value" },
    { label: "FC", value: "Value" },
    { label: "Amount", value: "Value" },
    { label: "Tax", value: "Value" },
    { label: "Net Amount", value: "Value" },
  ];
// useEffect(()=>{
// handleClearCart()
// },[])




  useEffect(() => {
    setCart(cartItems);
  }, [cartItems]);

  return (
    <div className="bg-[#F8F9FA] w-full h-full flex flex-col lg:flex-row">
      {/* Sidebar Menu */}
      {isMenuOpen && (
        <div className="w-full lg:w-[20%] h-full bg-[#5E72E4] transition-all overflow-auto duration-300 fixed lg:static z-40 top-0 left-0 lg:relative" >
          <div className="p-4">
            <h2 className="text-xs text-white font-bold mb-4" style={{padding:'30px'}}>Manage</h2>
            <h2 className="text-xs font-semibold text-white font-bold mb-4" style={{padding:'30px'}}>Customers</h2>
           <button className="bg-white w-[80%] text-sm font-semibold text-blue-500 rounded-xs" style={{marginLeft:'30px'}} >Add  Customer</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${isMenuOpen ? 'lg:w-[80%] w-full' : 'w-full'}  bg-[#F8F9FA] min-h-screen`} style={{fontFamily: 'Open Sans'}} >
        <div className="w-full min-h-[100px] bg-[#F8F9FA]" style={{ padding: '20px', fontFamily: 'Open Sans' }}>
          {/* Top Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4" style={{marginBottom:'10px'}} >
            <button
              className="flex items-center w-[80px] h-[30px] bg-gray-800 text-white text-sm rounded-sm shadow hover:bg-gray-700"
              style={{ padding: '5px 10px' }}
              onClick={toggleMenu}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {isMenuOpen ? 'Close' : 'Menu'}
            </button>

            <div className="flex flex-col sm:flex-row items-start gap-4 flex-nowrap w-full sm:max-w-[400px] max-w-full">
              <label
                htmlFor="search-mobile"
                className="font-semibold text-sm text-gray-900 whitespace-nowrap"
              >
                Search Mobile:
              </label>
              <input
                type="text"
                id="search-mobile"
                placeholder=" Enter Mobile No"
                className="border input input-sm bg-white text-black border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-300 w-full max-w-[150px] sm:w-[200px]"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
              />
              <button
                className="text-white w-full sm:w-[130px] h-[35px] text-[12px] bg-[#5E72E4] rounded hover:bg-blue-700"
                onClick={() => setNewCustomer(true)} // Open Add New Customer modal
              >
                + New Customer
              </button>
            </div>
          <div className="flex flex-col md:flex-row gap-2"> <button
              className="text-white w-full sm:w-[120px] h-[35px] text-[12px] bg-[#5E72E4] rounded hover:bg-blue-700 mt-2 sm:mt-0"
              onClick={() => setIsAddNewOpen(true)} // Open Item Details modal
            >
              Add New +
            </button>
            <button
              className="text-white w-full sm:w-[120px] h-[35px] text-[12px] bg-[#5E72E4] rounded hover:bg-blue-700 mt-2 sm:mt-0"
              onClick={handleClearCart} // Open Item Details modal
            >
              Clear Cart
            </button></div>
           
          </div>

          {/* Blue Header Bar */}
          <div className="bg-[#5E72E4] w-full h-auto sm:h-[40px] rounded-lg mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between py-3 sm:py-0 px-2 sm:px-8">
              <h3 className="text-[12px] font-bold text-white text-center sm:text-left w-full sm:w-auto" style={{ paddingLeft: '0', paddingRight: '0' }}>
                Salesman & Customer Details
              </h3>
              <h3
                onClick={handleViewMoreClick}
                className="text-[12px] font-bold text-white flex items-center gap-1 cursor-pointer mt-2 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end"
                style={{ paddingRight: '0' }}
              >
                View More
                {isViewMoreOpen ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 9l7 7 7-7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                    viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </h3>
            </div>
          </div>

          {/* Form Fields - Only visible when View More is expanded */}
          {isViewMoreOpen && (
            <div className="w-full min-h-[150px] bg-[#FFFFFF] border border-gray-300 rounded-lg mt-4 p-4 overflow-x-auto">
              <div className="flex flex-col md:flex-row gap-4 items-center text-gray-700" style={{ padding: '30px' }}>
                <div className="flex flex-col w-full md:w-1/4">
                  <label className="text-sm font-medium text-gray-700 mb-1">Salesman name</label>
                  <input
                    type="text"
                    className="border input input-sm border-gray-300 bg-white  rounded w-full"
                  />
                </div>
                <div className="flex flex-col w-full md:w-1/4">
                  <label className="text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    className="border input  input-sm bg-white border-gray-300 rounded w-full"
                  />
                </div>
                <div className="flex flex-col w-full md:w-2/4" style={{ marginTop: '10px' }}>
                  <label className="text-sm font-medium text-gray-700 mb-1">Description/Notes</label>
                  <textarea
                  className="w-full border border-gray-300 rounded-xs bg-white h-[50px] min-h-0 p-2 resize-none"
                />

                </div>
              </div>
            </div>
          )}

          {/* Products Table */}
         <div
      className="w-full min-h-[150px] border border-gray-300 bg-[#FFFFFF] rounded-lg overflow-x-auto"
      style={{ marginTop: "30px", padding: "30px" }}
    >
      <div className="w-full overflow-x-auto">
        <table className="table w-full text-sm border border-collapse bg-[#FFFFFF] min-w-[600px]">
          <thead className="h-[30px]">
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-2 border text-center">#</th>
              <th className="px-4 py-2 border text-center">Item Type</th>
              <th className="px-4 py-2 border text-center">Code</th>
              <th className="px-4 py-2 border text-center">Description</th>
              <th className="px-4 py-2 border text-center">Gross Weight</th>
              <th className="px-4 py-2 border text-center">UOM</th>
              <th className="px-4 py-2 border text-center">Rate</th>
              <th className="px-4 py-2 border text-center">Amount</th>
              <th className="px-4 py-2 border text-center">Quantity</th>
              <th className="px-4 py-2 border text-center">Remove</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-700 text-xs">
            {groupedCart.length > 0 ? (
                groupedCart.map((item, index) => (
                  <tr key={item.uuid || index} className="border-t h-[30px]">
                    <td className="px-4 py-2 border text-center">{index + 1}</td>
                    <td className="px-4 py-2 border text-center">{item.item_type || '-'}</td>
                    <td className="px-4 py-2 border text-center">{item.serial_no || item.item_code}</td>
                    <td className="px-4 py-2 border text-center">{item.description || '-'}</td>
                    <td className="px-4 py-2 border text-center">{item.gold_weight || item.Gross_Weight || '0.00'}</td>
                    <td className="px-4 py-2 border text-center">{item.uom || '-'}</td>
                    <td className="px-4 py-2 border text-center">{item.cost_price || '0.00'}</td>
                    <td className="px-4 py-2 border text-center">{item.tag_price || item.Total_Amount || '0.00'}</td>
                    <td className="px-4 py-2 border text-center">
                      {item.quantity}
                    
                    </td>
                    <td  className="flex items-center justify-center " style={{padding:'10px'}}>
                      
                       <button onClick={() => handleRemove(item.uuid)} title="Remove Item">
                     <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      strokeWidth={1.5} 
                      stroke="currentColor" 
                      className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg></button>

                    
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-2 text-sm text-gray-500">
                    No items in cart
                  </td>
                </tr>
              )}

          </tbody>
        </table>
      </div>
    </div>

          {/* Totals Section */}
          <div className="w-full bg-[#FFFFFF] min-h-[150px] border border-gray-300 rounded-lg flex flex-col gap-4" style={{ marginTop: '30px', padding: '30px' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {totalsData.map((item, index) => (
                <div key={index} className="flex justify-start items-center p-2 gap-2 rounded-lg bg-white">
                  <span className="text-sm font-medium text-gray-700">{item.label}:</span>
                  <span className="text-sm font-bold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
           <div className="flex flex-row justify-end">
  <button 
    onClick={handleCheckout} 
    className="text-white text-sm rounded-sm w-[180px] h-[30px] bg-[#5E72E4] hover:bg-blue-700"
  >
    Proceed To CheckOut
  </button>
</div>

                
          </div>
        </div>
      </div>

      {/* Add New Customer Modal */}
      {isNewCustomer && !Loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto px-2" onClick={()=>setIsAddNewOpen(false)}>
          <div className="bg-white rounded-xl shadow-md w-full max-w-lg sm:w-[85vw] sm:h-[55vh] sm:p-6 md:w-[65vw] md:h-[65vh] md:p-8 lg:w-[55vw] lg:h-[65vh] lg:p-10 xl:w-[35vw] xl:h-[65vh] xl:p-12 2xl:w-[25vw] 2xl:h-[60vh] 2xl:p-14 p-4 sm:p-6 md:p-8 flex flex-col overflow-y-auto max-h-[95vh]"
                          onClick={(e) => e.stopPropagation()} >
            <h3 className="font-bold text-[15px] text-[#344767] pl-4 pt-2 sm:pl-6 sm:pt-4 md:pl-8 md:pt-6"
                style={{ paddingLeft: '20px', paddingTop: "20px" }}>
              Add New Customer
            </h3>
            <hr className="my-4 border-gray-300" style={{ marginTop: '10px' }} />

           <div className="flex flex-col flex-grow gap-4 text-gray-400" style={{ padding: '10px' }}>
            <input
              type="text"
              name="name"
              value={customerDetails.name}
              onChange={handleChange}
              placeholder="  Customer Name"
              className="input w-[90%] rounded-xs focus:outline-none input-sm bg-white border-gray-300 focus:border-b-2 focus:border-blue-500"
              style={{ marginLeft: '25px' }}
            />

            <input
              type="text"
              name="phoneNumber"
              value={customerDetails.phoneNumber}
              onChange={handleChange}
              placeholder="   Mobile Number"
              className="input w-[90%] rounded-xs focus:outline-none input-sm bg-white border-gray-300 focus:border-b-2 focus:border-blue-500"
              style={{ marginLeft: '25px' }}
            />

            <input
              type="text"
              name="email"
              value={customerDetails.email}
              onChange={handleChange}
              placeholder="  Email"
              className="input w-[90%] rounded-xs focus:outline-none input-sm bg-white border-gray-300 focus:border-b-2 focus:border-blue-500"
              style={{ marginLeft: '25px' }}
            />

            <textarea
              name="address"
              value={customerDetails.address}
              onChange={handleChange}
              placeholder="Address"
              className="textarea w-[90%] bg-gray-100 rounded-xs input-sm bg-white border-gray-300 focus:outline-none focus:border-b-2 focus:border-blue-500"
              style={{ marginLeft: '25px' }}
            ></textarea>
          </div>


            <div className="flex flex-col sm:flex-row justify-center items-center gap-4"
                style={{ marginTop: '20px', marginBottom: '10px' }}>
              <button
                type="button"
                className="btn w-[80%] rounded-lg text-white border-none"
                style={{ backgroundColor: '#5E72E4' }}
                 onClick={handleSaveCustomer}
               >
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
      {Loading && (<Loader></Loader>)}

      {/* Add New Item Modal (Matching the Image) */}
      {isAddNewOpen && (
       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto px-2" style={{fontFamily:'Open Sans'}}>
          <div className="bg-white rounded-lg shadow-md w-full md:w-[90%] md:h-[90vh]  lg:w-[60%] " style={{padding:'20px'}}>
               <h3 className="font-semibold text-[13px] text-[#344767] "
                style={{marginBottom:'20px'}} >
                 Item Detials
               </h3>
                <hr className="my-4 border-gray-300" />

                <div className="flex flex-col  text-gray-400" >
                      <div className="flex flex-col gap-7 md:flex-row  justify-between" style={{paddingTop:'20px'}} >
                      <h3 className="text-[13px] text-gray-700">Barcode:</h3>
                      <input placeholder="Enter Your  Serial Number/UniqueId" name="code" value={params.code} onChange={handleItemChange} style={{paddingLeft:'12px'}} className="w-full text-xs text-black  h-[30px] rounded-sm border border-gray-300 "/>
                     </div>
                     <div className="flex flex-col gap-6 md:flex-row" style={{paddingTop:'20px'}} >
                        <h3 className="text-[13px] text-gray-700">Item Type:</h3>
                          <select value={params.type} name="type" onChange={handleItemChange} style={{paddingLeft:'12px'}} className="w-full  text-xs h-[30px] rounded-sm border border-gray-300 text-sm">
                            <option value="">Select Item Type</option>
                            <option value="Diamond">Diamond</option>
                            <option value="Gold">Gold</option>
                          </select>
                        {/* <button className="bg-[#5E72E4] w-full h-[30px] md:w-[150px] rounded-sm text-white" onClick={handleGetData}>Search</button> */}

                     </div>
                     <div className="flex justify-end">  <button className="bg-[#5E72E4] w-full h-[30px] md:w-[150px] rounded-sm text-white" onClick={handleGetData}>Search</button>
                           </div>

                        <div className="flex flex-col  gap-3 md:flex-row" style={{paddingTop:'20px'}} >
                        <h3 className="text-[13px] text-gray-700">Discount On:</h3>
                        <select
                          value={selectedField}
                          onChange={(e) => setSelectedField(e.target.value)}
                          className=" w-full text-xs text-gray-500 h-[30px]  rounded-sm border border-gray-300"
                          style={{ paddingLeft: '12px' }}
                        >
                          <option value="">Select Field</option>
                          {fields.map((field) => (
                            <option key={field} value={field}>
                              {field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                            </option>
                          ))}
                        </select>
                     </div>
                        
                        {/* <div className="flex flex-col gap-10 md:flex-row" style={{paddingTop:'20px'}} >
                        <h3 className="text-[13px] text-gray-700">Item:</h3>
                        <input value={itemData.diamond_item} style={{paddingLeft:'12px'}} className="w-[40%] h-[30px] text-xs rounded-sm border border-gray-300"/>
                        <input className="w-[40%] h-[30px] rounded-sm border border-gray-300"/>

                     </div> */}
                     

             </div>




           <div className="overflow-y-auto h-[220px]" style={{marginTop:'20px'}} >
         <table className="w-full bg-white overflow-auto border-collapse border border-gray-300 my-5" style={{minWidth:'900px',minHeight:'100px'}}>
          <thead>
          <tr className="bg-white"style={{height:"30px"}} >
            <th className="border border-gray-300  bg-white text-black text-sm text-center font-semibold"  >Weight / Quantity</th>
            <th className="border border-gray-300  bg-white text-black text-sm text-center font-semibold"  >Rate</th>
            <th className="border border-gray-300  bg-white text-black text-sm text-center font-semibold"  >Amount</th>
            <th className="border border-gray-300  bg-white text-black text-sm text-center font-semibold"  >Tax</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            
          <td className="border border-gray-300 p-4 text-black align-top " style={{padding:'3px'}}>
            <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
              {params.type === 'Gold' ? 'Gross Weight (GMS)' : 'Gold Weight (GMS)'}
            </h3>
            <input 
              type="text" 
              className="w-full  p-2 border border-gray-300 rounded focus:outline-none text-gray-400 text-xs focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.gold_weight || itemData.Gross_Weight}
            />
            <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
             
                            {params.type === 'Gold' ? 'Stone Weight (GMS):' : ' Pearl Weight (GMS)'}

            </h3>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 text-xs text-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.pearl_weight || itemData.Stone_Weight}

            />
             <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
              
              {params.type === 'Gold' ? 'Multi stone weight (GMS)' : 'Ruby Weight (GMS)'}
            </h3>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 text-gray-400 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.ruby_weight || itemData.m_s_weight}

            /> 
            {params.type ==='Diamond' && (
                  <>
                    <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2"
                        style={{ height: "20px", marginBottom: '5px' }}>
                      Emerald Weight (GMS):
                    </h3>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 text-gray-400 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      style={{ height: "30px", marginBottom: '5px', paddingLeft: '12px' }}
                      value={itemData.emerald_weight}
                    />
                  </>
                )}

            {params.type ==='Diamond'&&(<><h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
              sapphire Weight (GMS):
:
            </h3>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 text-gray-300 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.sapphire_weight}
            /></>)}


            {params.type ==='Diamond'&&(<><h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
              other stone Weight (GMS):
:
            </h3>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 text-gray-300 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.other_stone_weight}
            /></>)}
          </td>
             <td className="border border-gray-300 p-4 text-black align-top " style={{padding:'3px'}}>
            <h3 className="text-[12px] bg-gray-100 flex justify-center items-start p-2 " style={{height:"20px",marginBottom:'5px'}}>
             Rate :
            </h3>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px'}}
            />
            <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
             Stone Rate :
            </h3>
            <input 
             className="w-full p-2 border border-gray-300 text-gray-300 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.Stone_Rate}
            />
             <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
              Making Rate :
            </h3>
            <input 
               className="w-full p-2 border border-gray-300 text-gray-300 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.Making_Rate}
            /> 
          </td>


             <td className="border border-gray-300 p-4 text-black align-top " style={{padding:'3px'}}>
            <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
              
               {params.type === 'Gold' ? 'Total Amount' : 'Cost Price :'}
            </h3>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 text-gray-400 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.cost_price || itemData.Total_Amount}
            />
            <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
           
             {params.type === 'Gold' ? 'Stone Value' : 'additional Charge  :'}
            </h3>
            <input 
              type="text" 
               className="w-full p-2 border border-gray-300 text-gray-400 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.additional_charge || itemData.Stone_Value}
            />
             <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
             
              {params.type === 'Gold' ? 'Making Value' : 'Tag Price : '}
            </h3>
            <input 
              type="text" 
               className="w-full p-2 border border-gray-300 text-gray-400 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.tag_price || itemData.Making_Value }
            /> 
            <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
           
             {params.type === 'Gold' ? 'Matel Value' : 'Discount'}
            </h3>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 text-gray-400 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.discount || itemData.Metal_Value}
            />
          </td>
             <td className="border border-gray-300 p-4 text-black align-top " style={{padding:'3px'}}>
           {params.type === 'Diamond'&&(<><h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
            Tax Amount :
            </h3>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 text-gray-400 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.tax_amt}
            /></>) }

            {params.type === 'Gold'&&(<>
            <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
           Stone Tax:
            </h3>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 text-gray-400 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.stone_tax}
            />
            <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
           Making Tax:
            </h3>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 text-gray-400 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.stone_tax}
            />
            <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
          Default Tax :
            </h3>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 text-gray-400 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.default_tax}
            />
            <h3 className="text-[12px] bg-gray-100 flex justify-center items-center p-2 " style={{height:"20px",marginBottom:'5px'}}>
            Net Amount :
            </h3>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 text-gray-400 text-xs rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{height:"30px",marginBottom:'5px',paddingLeft:'12px'}}
              value={itemData.Net_Amount}
            />
            </>) }
            
          </td>
          </tr>
        </tbody>
      </table>
    </div>
            
 
            <div className="flex flex-col gap-2 md:flex-row justify-between" style={{padding:'20px'}} >

             <div className="flex flex-col gap-2 md:flex-row">
              <button className="text-white text-sm rounded-sm w-full  md:w-[180px] h-[30px] bg-blue-600 text-[13px]" >Consider Buffer :Yes</button>
              <button className="text-white text-sm rounded-sm w-full  md:w-[200px] h-[30px] bg-blue-600 text-[13px]" >Making Calculations:netWeight</button>
              </div>
             <div className="flex flex-col gap-2 md:flex-row">
              <button className="text-white text-sm rounded-sm w-full md:w-[80px] h-[30px] bg-gray-600 text-[13px]" onClick={()=>setIsAddNewOpen(false)} >close</button>
              <button onClick={() => handleAddToCart(itemData)} className="text-white w-full md:w-[80px]  text-sm rounded-sm w-[80px] h-[30px] bg-blue-600 text-[13px]" >Add</button>
             </div>
         
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default Pos;