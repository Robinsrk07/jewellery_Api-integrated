import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, Mail, ArrowRight, Copy, Check } from 'lucide-react';

const PaymentSuccessPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const paymentDetails = {
    transactionId: "TXN-2025-001234",
    amount: "$129.99",
    date: "July 7, 2025",
    time: "2:34 PM",
    method: "•••• •••• •••• 4242",
    recipient: "Premium Plan Subscription",
    status: "Completed"
  };

  const handleCopyTransaction = () => {
    navigator.clipboard.writeText(paymentDetails.transactionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    console.log('Downloading receipt...');
  };

  const handleEmailReceipt = () => {
    console.log('Emailing receipt...');
  };

  const handleContinue = () => {
    console.log('Continuing to dashboard...');
  };

  return (
    <div className=" bg-white flex items-center justify-center rounded-lg h-[70vh]">
      {/* Background Pattern */}
      

     
  
        <div className="flex justify-center gap-8 " style={{marginBottom: '24px'}}>
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
            <div className="relative bg-white rounded-full shadow-lg" style={{padding: '16px'}}>
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
              

          </div>


        <div className='text-lg font-semibold text-gray-400'>Payment Succesfully Completed</div>
       
      </div>
   
  );
};

export default PaymentSuccessPage;