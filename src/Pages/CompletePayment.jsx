import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import POSModel from "../models/PosModel";
import { toast } from "react-toastify";

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
  currency: 2,
  commission: "",
  tax: "",
  transaction_id: "",
  cart_master_id: "",
};

const CompletePayment = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const cartData = location.state?.cartData;
  const [payments, setPayments] = useState([{ ...defaultPayment }]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (idx, e) => {
    const { name, value } = e.target;
    setPayments((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [name]: value } : row))
    );
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(payments[0]).forEach(([key, value]) => {
        formData.append(key, value);
      });

      console.log("FormData:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await POSModel.CreatePayment(formData);
      navigate('/dashboard/paymentSucces')
      toast.success("payment Completed SuccesFully")
    } catch (error) {
      toast.Error("Please Try  Again")
    }
  };

  useEffect(() => {
    if (cartData?.data) {
      setPayments((prev) => {
        const updated = [...prev];
        updated[0].tax = cartData.data.tax || "";
        updated[0].amount = cartData.data.total_amount;
        updated[0].cart_master_id = cartData.data.uuid || "";
        return updated;
      });
    }
  }, [cartData]);

  const isCashPayment = payments[0].payment_mode === "1";

  return (
    <div className="bg-white w-full flex flex-col gap-6 max-h-[80vh] rounded-lg overflow-auto" style={{ padding: '20px' }}>
      <div style={{ padding: '10px 0px' }}><h3 className="text-gray-400 font-bold text-[30px]">Complete Payment</h3></div>
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
          <input value={cartData.data.net_amount} className="w-full h-[33px] text-xs border rounded-sm border-gray-300" style={{ paddingLeft: '12px' }} name="amount" placeholder="Amount" />
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

      {!isCashPayment && (
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
      )}

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

        {!isCashPayment && (
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
        )}
      </div>

     

      <div className="flex justify-end gap-2">
        <button className="bg-[#8392AB] w-full h-[33px] md:w-[200px]  text-white rounded-sm">Cancel</button>
        <button
          onClick={() => setShowConfirmModal(true)}
          className="bg-[#6370E4] w-full h-[33px] md:w-[200px] text-white rounded-sm"
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
