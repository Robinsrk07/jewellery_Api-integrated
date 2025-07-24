import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import POSModel from "../models/PosModel";
import { toast } from "react-toastify";
import PurchaseUtils from "../models/PurchaseUtils";
import { useSelector } from "react-redux";
import CurrencyModel from "../models/CurrencyModel";

const paymentModes = [
  { value: "1", label: "Cash" },
  { value: "2", label: "Debit Card" },
  { value: "3", label: "Credit Card" },
  { value: "4", label: "UPI" },
];
const paymentModesSecond = [
    { value: "1", label: "Cash" },
  { value: "2", label: "Debit Card" },
  { value: "3", label: "Credit Card" },
  { value: "4", label: "UPI" },
];

const defaultPayment = {
  payment_mode: "",
  amount: "",
  exchange_rate: "",
  card_num: "",
  approval_code: "",
  exp_date: "",
  card_holder: "",
  currency: 2,
  commission: "",
  tax: "",
  transaction_id: "",
  upi_id :''
};

const CompletePayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartData = location.state?.cartData;
  const [payments, setPayments] = useState([{ ...defaultPayment }]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [splitPayment, setSplitPayment] = useState(false);
  const [utils, setUtils] = useState([]);
  const auth = useSelector((state) => state.auth);
  const user_id = auth?.login_id;
  const user_types = Object.keys(auth?.can_manage_user_types || {}).join(',');
console.log(payments)
console.log(utils)
  const totalAmount = Number(cartData?.data?.net_amount || 0);
  const totalTax = Number(cartData?.data?.tax || 0);

  const handleChange = (idx, e) => {
    const { name, value } = e.target;
    setPayments((prev) => {
      const updated = prev.map((row, i) =>
        i === idx ? { ...row, [name]: value } : row
      );

      if (name === "amount" && splitPayment) {
        const amount1 = Number(updated[0].amount || 0);
        const amount2 = Number(updated[1]?.amount || 0);
        const totalEntered = amount1 + amount2;

        if (totalEntered > 0) {
          updated[0].tax = ((amount1 / totalEntered) * totalTax).toFixed(2);
          if (updated[1]) {
            updated[1].tax = ((amount2 / totalEntered) * totalTax).toFixed(2);
          }
        }
      }

      return updated;
    });
  };

  const handleSplitPayment = () => {
    setSplitPayment(true);
    setPayments((prev) => [...prev, { ...defaultPayment }]);
  };

  const handleSinglePayment = () => {
    setSplitPayment(false);
    setPayments([{ ...defaultPayment }]);
  };


  const fetchCurrency = async()=>{
    try{
   const response = await CurrencyModel.getCurrency(user_id,user_types)
   setUtils(response?.data?.data);

    }catch(error){
    console.log(error)
    }
  }

  const handleSubmit = async () => {
    const cartMasterId = cartData?.data?.uuid
   console.log(payments);
   
    try {
          

     const formData = new FormData();
      formData.append("cart_master_id", cartMasterId);

      // Append each field from each payment
      payments.forEach((payment) => {
        Object.entries(payment).forEach(([key, value]) => {
          // If it's a split payment, use index to make field names unique (e.g., amount_0, amount_1)
          formData.append(key, value);
        });
      });

      console.log("FormData:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

       const response = await POSModel.CreatePayment(formData);
      navigate("/dashboard/paymentSucces");
      toast.success("Payment completed successfully");
    } catch (error) {
      toast.error("Please try again");
    }
  };

 

  useEffect(() => {
    fetchCurrency();
  }, []);

  const isCashPayment = payments[0].payment_mode === "1" 
  const isUpiPayment = payments[0]?.payment_mode === '4' 
 const isCashPayment1 = payments.length > 1 && payments[1]?.payment_mode === "1";
const isUpiPayment1 = payments.length > 1 && payments[1]?.payment_mode === "4";

  
                       
    
  return (
    <div className="bg-white w-full flex flex-col gap-6 max-h-[80vh] rounded-lg overflow-auto" style={{ padding: '20px' }}>
     <div className="py-2">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <h3 className="text-gray-400 font-bold text-[24px] md:text-[30px]">Complete Payment</h3>
    
    <h5 className="font-semibold text-gray-400" > Total Amount : {cartData?.data?.net_amount || 0}</h5>
    <div className="flex flex-row gap-4">
      <button 
        onClick={handleSplitPayment} 
        className="  rounded text-white text-sm font-semibold"
         style={{
          width: '160px',
          height: '40px',
          borderRadius: '8px',
          background: 'linear-gradient(to right, #7F60E4, #6170E4)',
          color: 'white',
          transition: 'background-color 0.3s ease',
          cursor: 'pointer',
        }}
      >
        Split Payment
      </button>
      {splitPayment &&<button 
        onClick={handleSinglePayment} 
        className="w-[150px] bg-[#5e72e4] rounded text-sm text-white font-semibold py-2"
         style={{
          width: '160px',
          height: '40px',
          borderRadius: '8px',
          background: 'linear-gradient(to right, #7F60E4, #6170E4)',
          color: 'white',
          transition: 'background-color 0.3s ease',
          cursor: 'pointer',
        }}
      >
        Single Payment
      </button>}
    </div>
  </div>
</div>

      <hr className="text-gray-300" />
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500 mb-1">Payment Mode</label>
          <select
            className="w-full h-[33px] text-xs text-gray-500 border rounded-sm border-gray-300"
            style={{ paddingLeft: '12px' }}
            name="payment_mode"
            value={payments[0].payment_mode}
            onChange={(e) => handleChange(0, e)}
          >
            <option className="text-gray-400" value="">Select Payment Mode</option>
            {paymentModes.map((mode) => (
              <option className="text-gray-400" key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500 mb-1">Amount</label>
          <input value={payments[0].amount} name='amount' onChange={(e) => handleChange(0, e)} className="w-full h-[33px] text-gray-600 text-xs border rounded-sm border-gray-300" style={{ paddingLeft: '12px' }}  placeholder="Amount" />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500 mb-1">Exchange Rate</label>
          <input
            className="w-full h-[33px] text-xs text-gray-500 border rounded-sm border-gray-300"
            style={{ paddingLeft: '12px' }}
            name="exchange_rate"
            placeholder="Exchange Rate"
            type="number"
            value={payments[0].exchange_rate}
            onChange={(e) => handleChange(0, e)}
          />
        </div>
      </div>

     
        { (!isCashPayment && !isUpiPayment) &&(<div className="flex flex-col  md:flex-row items-center justify-center gap-4">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500 mb-1">Approval Code</label>
            <input
              className="w-full h-[33px] text-xs text-gray-500 border rounded-sm border-gray-300"
              style={{ paddingLeft: '12px' }}
              name="approval_code"
              placeholder="Approval Code"
              value={payments[0].approval_code}
              onChange={(e) => handleChange(0, e)}
            />
          </div>

         <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500 mb-1">Expiry Date</label>
            <input
              type="date"
              className="w-full h-[33px] text-xs border text-gray-500 rounded-sm border-gray-300"
              style={{ paddingLeft: '12px' }}
              name="exp_date"
              placeholder="Expiry Date"
              value={payments[0].exp_date}
              onChange={(e) => handleChange(0, e)}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500 mb-1">Card Holder</label>
            <input
              type="text"
              className="w-full h-[33px] text-xs border text-gray-500 rounded-sm border-gray-300"
              style={{ paddingLeft: '12px' }}
              name="card_holder"
              placeholder="Card Holder"
              value={payments[0].card_holder}
              onChange={(e) => handleChange(0, e)}
            />
          </div>
           </div>)}
     

      <div className="flex flex-col  md:flex-row items-center justify-center gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500 mb-1">Commission</label>
          <input
            type="text"
            className="w-full h-[33px] text-xs  text-gray-500 border rounded-sm border-gray-300"
            style={{ paddingLeft: '12px' }}
            name="commission"
            placeholder="Commission"
            value={payments[0].commission}
            onChange={(e) => handleChange(0, e)}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500 mb-1">Tax</label>
          <input
            type="text"
            className="w-full h-[33px] text-xs border text-gray-500 rounded-sm border-gray-300"
            style={{ paddingLeft: '12px' }}
            name="tax"
            placeholder="Tax"
            value={cartData?.data?.tax || ''}
            readOnly
          />
        </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500 mb-1">Currency</label>
            <select style={{paddingLeft:'10px'}} name="currency" value={payments[0].currency}  onChange={(e) => handleChange(1, e)} className="select select-bordered text-gray-500 bg-white select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
              <option value =''>--select option --</option>

               {utils.map((item) => (
                         <option key={item.id} value={item.id}>
                            {item.name}
                         </option>
                       ))}
             </select> 
             {/* <select style={{paddingLeft:'10px'}} name="default_tax" value={payments[0].currency}  onChange={handleChange} className="select select-bordered bg-white select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
              <option value =''>--select option --</option>

               {currency.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.tax_name}
                          </option>
                        ))}
              </select> */}
               {/* <option value={currency.id} className="text-black">
                {currency.name}
              </option> */}
          </div>

        
      </div>
     <div className="flex flex-col  md:flex-row items-start justify-start gap-4">
         
         { (!isCashPayment && !isUpiPayment) && (
            <div className="flex flex-col gap-2 w-1/3">
              <label className="text-xs text-gray-500 mb-1">Card Number</label>
              <input
                type="text"
                className="w-full h-[33px] text-xs border text-gray-500 rounded-sm border-gray-300"
                style={{ paddingLeft: '12px' }}
                name="card_num"
                placeholder="Card Number"
                value={payments[0].card_num}
                onChange={(e) => handleChange(0, e)}
              />
            </div>
          )}


        { isUpiPayment && (<div className="flex flex-col gap-2 w-1/3">
            <label className="text-xs text-gray-500 mb-1">UPI ID</label>
            <input
              type="text"
              className="w-full h-[33px] text-xs text-gray-500 border rounded-sm border-gray-300"
              style={{ paddingLeft: '12px' }}
              name="upi_id"
              placeholder="Enter Your UPI ID "
              value={payments[0].upi_id}
              onChange={(e) => handleChange(0, e)}
            />
          </div>)}
       
       </div>
       <hr className="text-gray-200"></hr>
       {splitPayment &&(<><div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500 mb-1">Payment Mode</label>
          <select
            className="w-full h-[33px] text-xs border text-gray-500 rounded-sm border-gray-300"
            style={{ paddingLeft: '12px' }}
            name="payment_mode"
            value={payments[1].payment_mode}
            onChange={(e) => handleChange(1, e)}
          >
            <option className="text-gray-400" value="">Select Payment Mode</option>
            {paymentModesSecond.map((mode) => (
              <option className="text-gray-400" key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500 mb-1">Amount</label>
          <input name='amount' onChange={(e) => handleChange(1, e)} value={payments[1].amount} className="w-full text-gray-500 h-[33px] text-xs border rounded-sm border-gray-300" style={{ paddingLeft: '12px' }} name="amount" placeholder="Amount" />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500 mb-1">Exchange Rate</label>
          <input
            className="w-full h-[33px] text-xs border text-gray-500 rounded-sm border-gray-300"
            style={{ paddingLeft: '12px' }}
            name="exchange_rate"
            placeholder="Exchange Rate"
            type="number"
            value={payments[1].exchange_rate}
            onChange={(e) => handleChange(1, e)}
          />
        </div>
      </div>

     
       {( !isCashPayment1 && !isUpiPayment1  ) &&(<div className="flex flex-col  text-gray-500 md:flex-row items-center justify-center gap-4">
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500 mb-1">Approval Code</label>
            <input
              className="w-full h-[33px] text-xs border  text-gray-500 rounded-sm border-gray-300"
              style={{ paddingLeft: '12px' }}
              name="approval_code"
              placeholder="Approval Code"
              value={payments[1].approval_code}
              onChange={(e) => handleChange(1, e)}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500 mb-1">Expiry Date</label>
            <input
              type="date"
              className="w-full h-[33px] text-xs border text-gray-500 rounded-sm border-gray-300"
              style={{ paddingLeft: '12px' }}
              name="exp_date"
              placeholder="Expiry Date"
              value={payments[1].exp_date}
              onChange={(e) => handleChange(1, e)}
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500 mb-1">Card Holder</label>
            <input
              type="text"
              className="w-full h-[33px] text-xs border text-gray-500 rounded-sm border-gray-300"
              style={{ paddingLeft: '12px' }}
              name="card_holder"
              placeholder="Card Holder"
              value={payments[1].card_holder}
              onChange={(e) => handleChange(1, e)}
            />
          </div>
        </div>)}
      

      <div className="flex flex-col  md:flex-row items-center justify-center gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500 mb-1">Commission</label>
          <input
            type="text"
            className="w-full h-[33px] text-xs text-gray-500 border rounded-sm border-gray-300"
            style={{ paddingLeft: '12px' }}
            name="commission"
            placeholder="Commission"
            value={payments[1].commission}
            onChange={(e) => handleChange(1, e)}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500 mb-1">Tax</label>
          <input
            type="text"
            className="w-full h-[33px] text-xs text-gray-500 border rounded-sm border-gray-300"
            style={{ paddingLeft: '12px' }}
            name="tax"
            placeholder="Tax"
            value={cartData?.data?.tax || ''}
            readOnly
          />
        </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs text-gray-500 mb-1">Currency</label>
            {/* <input
              type="text"
              className="w-full  h-[33px] text-xs border rounded-sm border-gray-300"
              style={{ paddingLeft: '12px' }}
              name="currency"
              placeholder="Currency"
              value={payments[1].currency}
              onChange={(e) => handleChange(1, e)}
            /> */}
            <select style={{paddingLeft:'10px'}} name="currency" value={payments[1].currency}  onChange={(e) => handleChange(1, e)} className="select select-bordered text-gray-500 bg-white select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300">
              <option value =''>--select option --</option>

               {utils.map((item) => (
                         <option key={item.id} value={item.id}>
                            {item.name}
                         </option>
                       ))}
             </select> 
               
          </div>

        
      </div>
       <div className="flex flex-col  md:flex-row items-start justify-start gap-4">
         
          { (!isCashPayment1 && !isUpiPayment1) && (
            <div className="flex flex-col gap-2 w-1/3">
              <label className="text-xs text-gray-500 mb-1">Card Number</label>
              <input
                type="text"
                className="w-full h-[33px] text-gray-500 text-xs border rounded-sm border-gray-300"
                style={{ paddingLeft: '12px' }}
                name="card_num"
                placeholder="Card Number"
                value={payments[1].card_num}
                onChange={(e) => handleChange(1, e)}
              />
            </div>
          )}

           { isUpiPayment1 && (<div className="flex flex-col gap-2 w-1/3">
            <label className="text-xs text-gray-500 mb-1">UPI ID</label>
            <input
              type="text"
              className="w-full h-[33px] text-xs border text-gray-500 rounded-sm border-gray-300"
              style={{ paddingLeft: '12px' }}
              name="upi_id"
              placeholder="Enter Your UPI ID "
              value={payments[1].upi_id}
              onChange={(e) => handleChange(1, e)}
            />
          </div>)}
      
       </div>
       </>)}

     

      <div className="flex justify-end gap-2">
        <button className="bg-[#8392AB] w-[160px] h-[40px] md:w-[200px]  text-white rounded-sm">Cancel</button>
        <button
          onClick={() => setShowConfirmModal(true)}
          className=" w-full  md:w-[200px] text-white rounded-sm"
          style={{
          width: '160px',
          height: '40px',
          borderRadius: '8px',
          background: 'linear-gradient(to right, #7F60E4, #6170E4)',
          color: 'white',
          transition: 'background-color 0.3s ease',
          cursor: 'pointer',
        }}
        >
          Pay Now
        </button>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div
            className="bg-white rounded-lg shadow-md max-h-[500px] h-[50vh] w-[90vw] max-w-[500px] flex flex-col justify-between"
            style={{ padding: '20px' }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex justify-center">
                <ExclamationCircleOutlined style={{ fontSize: '30px', color: '#6370E4' }} />
              </div>
              <h2 className="text-[30px] font-bold text-gray-400 mb-2 text-center">
                Confirm Payment
              </h2>
              <hr className="text-gray-200 mb-2" />
              <p className="text-gray-500 font-semibold text-center">
                Are you sure you want to proceed with payment?
              </p>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-sm bg-gray-300 rounded w-[150px] h-[33px] hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  handleSubmit();
                }}
                className="w-[150px] h-[33px] text-sm bg-[#6370E4] text-white rounded hover:bg-[#4f5ed1]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletePayment;
