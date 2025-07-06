import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

const paymentModes = [
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
  currency: "",
  commission: "",
  tax: "",
  transaction_id: "",
  cart_master_id: "",
};
import POSModel from "../models/PosModel";
const CompletePayment = () => {
  const location = useLocation();
  const cartData = location.state?.cartData;
  console.log(cartData);

  const [payments, setPayments] = useState([{ ...defaultPayment }]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
 console.log(payments)
  const handleChange = (idx, e) => {
    const { name, value } = e.target;
    setPayments((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [name]: value } : row))
    );
  };

  const handleSubmit = async () => {
  try {
    // Step 1: Convert payments[0] to FormData
    const formData = new FormData();
    Object.entries(payments[0]).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Step 2: Optional — debug log
    console.log("FormData:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    // Step 3: Send to backend
    const response = await POSModel.CreatePayment(formData); // assuming it accepts FormData
    console.log("Payment success:", response);
  } catch (error) {
    console.error("Payment error:", error);
  }
};

  
 useEffect(() => {
  if (cartData?.data) {
    setPayments((prev) => {
      const updated = [...prev];
      updated[0].tax = cartData.data.tax || "";
      updated[0].amount = cartData.data.
      updated[0].cart_master_id = cartData.data.uuid || "";
      return updated;
    });
  }
}, [cartData]);


  return (
    <div className="bg-white w-full flex flex-col gap-6 max-h-[80vh] rounded-lg overflow-auto" style={{ padding: '20px' }}>
      <div style={{padding:'10px 0px'}}><h3 className="text-gray-400 font-bold text-[30px]">Complete Payment</h3></div>
      <hr className="text-gray-300" />

     <div className="flex flex-col md:flex-row items-center justify-center gap-4">
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-gray-500 mb-1">Payment Mode</label>
    <select
      className="w-full h-[33px] text-xs border rounded-sm border-gray-300"
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
    <input value={cartData.data.net_amount} className="w-full h-[33px] text-xs border rounded-sm border-gray-300" style={{paddingLeft:'12px'}} name="amount" placeholder="Amount" />
  </div>

  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-gray-500 mb-1">Exchange Rate</label>
    <input
      className="w-full h-[33px] text-xs border rounded-sm border-gray-300"
      style={{ paddingLeft: '12px' }}
      name="exchange_rate"
      placeholder="Exchange Rate"
      type="number"
      value={payments[0].exchange_rate}
      onChange={(e) => handleChange(0, e)}
    />
  </div>
</div>

<div className="flex flex-col  md:flex-row items-center justify-center gap-4">
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-gray-500 mb-1">Approval Code</label>
    <input
      className="w-full h-[33px] text-xs border rounded-sm border-gray-300"
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
      className="w-full h-[33px] text-xs border rounded-sm border-gray-300"
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
      className="w-full h-[33px] text-xs border rounded-sm border-gray-300"
      style={{ paddingLeft: '12px' }}
      name="card_holder"
      placeholder="Card Holder"
      value={payments[0].card_holder}
      onChange={(e) => handleChange(0, e)}
    />
  </div>
</div>

<div className="flex flex-col  md:flex-row items-center justify-center gap-4">
  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-gray-500 mb-1">Commission</label>
    <input
      type="text"
      className="w-full h-[33px] text-xs border rounded-sm border-gray-300"
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
      className="w-full h-[33px] text-xs border rounded-sm border-gray-300"
      style={{ paddingLeft: '12px' }}
      name="tax"
      placeholder="Tax"
      value={cartData?.data?.tax || ''}
      readOnly
    />
  </div>

  {/* <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-gray-500 mb-1">Transaction ID</label>
    <input
      type="text"
      className="w-full h-[33px] text-xs border rounded-sm border-gray-300"
      style={{ paddingLeft: '12px' }}
      name="transaction_id"
      placeholder="Transaction ID"
      value={payments[0].transaction_id}
      onChange={(e) => handleChange(0, e)}
    />
  </div> */}
   <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-gray-500 mb-1">Card Number</label>
    <input
      type="text"
      className="w-full h-[33px] text-xs border rounded-sm border-gray-300"
      style={{ paddingLeft: '12px' }}
      name="card_num"
      placeholder="Card Number"
      value={payments[0].card_num}
      onChange={(e) => handleChange(0, e)}
    />
  </div>
</div>

<div className="flex flex-col  md:flex-row items-center justify-center gap-4">
 

  <div className="flex flex-col gap-2 w-full">
    <label className="text-xs text-gray-500 mb-1">Currency</label>
    <input
      type="text"
      className="w-full md:w-1/3 h-[33px] text-xs border rounded-sm border-gray-300"
      style={{ paddingLeft: '12px' }}
      name="currency"
      placeholder="Currency"
      value={payments[0].currency}
      onChange={(e) => handleChange(0, e)}
    />
  </div>

  
</div>

<div className="flex justify-end gap-2">

<button className="bg-[#8392AB] w-full h-[33px] md:w-[200px]  text-white rounded-sm">Cancel</button>
<button onClick={handleSubmit} className="bg-[#6370E4] w-full h-[33px] md:w-[200px]  text-white rounded-sm">Pay Now</button>

    </div>
    </div>
  );
};

export default CompletePayment;
