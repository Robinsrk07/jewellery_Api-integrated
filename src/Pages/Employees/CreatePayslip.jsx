import { useState, useCallback, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Save, X, Upload, Eye, Calculator, ArrowLeft } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomScrollbar from "../../components/CustomScrollbar";
import TableSkelton from "../../components/tableSkelton";
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import { Link, useNavigate } from "react-router";
import { useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import PayslipModel from "../../models/PayslipModel";
import PaymentMethodes from "./PaymentMethodes";
import employeePositionModel from "../../models/employeePositionModel";
import { useSelector } from "react-redux";
import employeePaymentMethodModel from "../../models/employeePaymentMethodModel";
const CreatePayslip = () => {

 const navigate = useNavigate()   
const auth = useSelector((state) => state.auth || {});
  const user_id = auth.login_id || 1;
 // const user_types = auth.can_manage_user_types ? Object.keys(auth.can_manage_user_types).join(',') : 'Admin,Head Office';
 const [formErrors, setFormErrors] = useState({});
 const [paymentMode,setPaymentMode] = useState([])  
 const location = useLocation();
 const { id, name, department,departmentId, position,positionId} = location.state || {};
const [formData, setFormData] = useState({
  employee: id,
  department: departmentId,
  position: positionId,

  salary_month: '',
  payment_date: '',

  // Earnings (all initialized to string '0.00')
  basic_salary: '0.00',
  hra: '0.00',
  conveyance_allowance: '0.00',
  medical_allowance: '0.00',
  special_allowance: '0.00',
  other_allowance: '0.00',
  bonus: '0.00',
  overtime_pay: '0.00',
  other_earnings: '0.00',

  // Deductions
  provident_fund: '0.00',
  esi: '0.00',
  professional_tax: '0.00',
  income_tax: '0.00',
  loan_recovery: '0.00',
  other_deductions: '0.00',

  // Summary (can be number since computed)
  gross_earnings: '0.00',
  total_deductions: '0.00',
  net_salary: '0.00',
  gross_salary: '0.00',

  // Payment Info
  payment_mode: null,
  bank_account: '',
  upi_id: '',

  // File upload
  supporting_documents: null,

  remarks: '',
  is_paid: false,
});

const validateForm = () => {
  const errors = {};
  const requiredFields = [
    'employee',
    'department',
    'position',
    'salary_month',
    'payment_date',
    'basic_salary',
    'hra',
    'conveyance_allowance',
    'medical_allowance',
    'special_allowance',
    'other_allowance',
    'bonus',
    'overtime_pay',
    'other_earnings',
    'esi',
    'professional_tax',
    'income_tax',
    'loan_recovery',
    'other_deductions',
    'payment_mode',
  ];

  // Check required fields
  requiredFields.forEach((key) => {
    if (
      formData[key] === null ||
      formData[key] === '' ||
      (typeof formData[key] === 'string' && formData[key].trim() === '')
    ) {
      errors[key] = 'This field is required';
    }
  });

  // Check date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (formData.salary_month && !dateRegex.test(formData.salary_month)) {
    errors.salary_month = 'Invalid date format (YYYY-MM-DD)';
  }
  if (formData.payment_date && !dateRegex.test(formData.payment_date)) {
    errors.payment_date = 'Invalid date format (YYYY-MM-DD)';
  }

  setFormErrors(errors);

  return Object.keys(errors).length === 0;
};

const handleSubmit = async() => {
  const isValid = validateForm();

  if (!isValid) {
   toast.error("please Fill all Required Feilds")
    return;
  }

const formDataToSend = convertToFormData(formData);
  try{
    const res = await PayslipModel.createPayslip(formDataToSend)
    navigate(`/dashboard/paysliplist/${formData.employee}`)
    if(res) toast.success("Payslip created Succesfully")
  }catch(error){
  toast.error(" Please try again ,payslip creation failed ")
  }

  // proceed to submit
  console.log('Submit formData:', formData);
};
const handleClear = ()=>{
    setFormErrors({})
    setFormData({
  employee: null, //mandetory
  department: null, //mandetory
  position: null, //mandetory

  salary_month: '',          // format: 'YYYY-MM-DD' mandetory
  payment_date: '',          // format: 'YYYY-MM-DD' mandetory

  // /
  basic_salary: '', //mandetory
  hra: '',  //mandetory
  conveyance_allowance: '', //mandetory
  medical_allowance: '', //mandetory
  special_allowance: '', //mandetory
  other_allowance: '', //mandetory
  bonus: '', //mandetory
  overtime_pay: '', //mandetory
  other_earnings: '', //mandetory

  // Deductions
  provident_fund: '',
  esi: '', //mandetory
  professional_tax: '', //mandetory
  income_tax: '', //mandetory
  loan_recovery: '', //mandetory
  other_deductions: '', //mandetory

  // Summary
  gross_earnings: '',
  total_deductions: '',
  net_salary: '',
  gross_salary: '',

  // Payment Info
  payment_mode: 1, //mandetory
  bank_account: '',
  upi_id: '',
  // File upload
  supporting_documents: null,  // you can set this with a File object

  remarks: '',
  is_paid: false,
})
}

// const fetchPaymentMethod =async()=>{
//     try{
//     const res = await employeePaymentMethodModel.getPaymentMethods(user_id,)
//     setPaymentMode(res?.data?.data)
//     }catch(error){
//       console.error(error)
//     }
// }

const handleChange = (field, value) => {
  setFormData((prev) => ({
    ...prev,
    [field]: value,
  }));
};
const convertToFormData = (data) => {
  const formDataObj = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    // Keep valid values:
    // - Non-empty strings
    // - Booleans
    // - Numbers (except NaN)
    // - Files (like FileList or File)
    if (
      value !== null &&
      value !== undefined &&
      (typeof value === 'boolean' ||
        typeof value === 'number' ||
        (typeof value === 'string' && value.trim() !== '') ||
        value instanceof File ||
        (value instanceof FileList && value.length > 0))
    ) {
      // Special handling for file uploads
      if (value instanceof FileList) {
        Array.from(value).forEach((file) => {
          formDataObj.append(key, file);
        });
      } else {
        formDataObj.append(key, value);
      }
    }
  });

  return formDataObj;
};


const calculateSummary = (data) => {
  // Earnings fields
  const earningsFields = [
    'basic_salary',
    'hra',
    'conveyance_allowance',
    'medical_allowance',
    'special_allowance',
    'other_allowance',
    'bonus',
    'overtime_pay',
    'other_earnings',
  ];
  // Deductions fields
  const deductionFields = [
    'provident_fund',
    'esi',
    'professional_tax',
    'income_tax',
    'loan_recovery',
    'other_deductions',
  ];

  const gross_earnings = earningsFields.reduce(
    (sum, key) => sum + (parseFloat(data[key]) || 0),
    0
  );
  const total_deductions = deductionFields.reduce(
    (sum, key) => sum + (parseFloat(data[key]) || 0),
    0
  );
  const net_salary = gross_earnings - total_deductions;

  return { gross_earnings, total_deductions, net_salary };
};

useEffect(() => {
  const { gross_earnings, total_deductions, net_salary } = calculateSummary(formData);
  setFormData((prev) => ({
    ...prev,
    gross_earnings,
    total_deductions,
    net_salary,
  }));
  // eslint-disable-next-line
}, [
  formData.basic_salary,
  formData.hra,
  formData.conveyance_allowance,
  formData.medical_allowance,
  formData.special_allowance,
  formData.other_allowance,
  formData.bonus,
  formData.overtime_pay,
  formData.other_earnings,
  formData.provident_fund,
  formData.esi,
  formData.professional_tax,
  formData.income_tax,
  formData.loan_recovery,
  formData.other_deductions,
]);

useEffect(() => {
  let isMounted = true;

  const fetchPaymentMethod = async () => {
    try {
      const res = await employeePaymentMethodModel.getPaymentMethods(user_id);
      if (isMounted) {
        setPaymentMode(res?.data?.data || []);
      }
    } catch (error) {
      if (isMounted) {
        console.error("Error fetching payment methods:", error);
      }
    }
  };

  fetchPaymentMethod();

  return () => {
    isMounted = false;
  };
}, [user_id]); // ✅ Add dependency if `user_id` might change


    return (
        <>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgb(218, 216, 216);
                    border-radius: 3px;
                    border: 1px solid rgb(206, 198, 198);
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgb(202, 190, 190);
                }
                
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgb(226, 215, 215) #f1f1f1;
                }
            `}</style>
            <style jsx global>{`
    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
  `}</style>

            <div className="bg-white w-full
                max-w-[99vw] 
                xl:max-w-[90vw] 
                2xl:max-w-[95vw] 
                h-auto max-h-[80vh] 
                rounded-xl px-4 md:px-8 lg:px-12
                mx-auto overflow-auto custom-scrollbar text-gray-500"
                style={{ fontFamily: 'Open Sans', overflow: 'auto' }}
            >
                

              
                    <div className="flex  flex-col gap-2 " style={{ padding: '20px' }}>
                        <div className="flex items-center gap-8 " >
                           <Link to={"/dashboard/payslip"}> <button
                               
                                className="flex items-center gap-4 text-[16px] font-semibold text-gray-500 rounded-md hover:bg-gray-300"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Employee List
                            </button></Link>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border text-gray-500 text-[12px] border-gray-100" style={{ padding: '20px', marginBottom: '10px' }}>
                            <h2 className="text-xl font-semibold text-gray-500" style={{ marginBottom: '5px' }}>Employee Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-500">Employee Name</label>
                                    <input type="text"  value={name} readOnly className="w-full input input-xs border border-gray-300 rounded-sm bg-gray-50" style={{ padding: '5px' }} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-500">Department</label>
                                    <input type="text"  value={department} readOnly className="w-full border border-gray-300 input input-xs rounded-sm bg-gray-50" style={{ padding: '5px' }} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-500 mb-1">Designation</label>
                                    <input type="text" value={position }  readOnly className="w-full input input-xs rounded-sm border border-gray-300 rounded-sm bg-gray-50" style={{ padding: '5px' }} />
                                </div>
                             <div>
                                    <label className="block text-[11px] font-medium text-gray-500 mb-1">
                                    Pay Period <span className="text-red-500">*</span>
                                    </label>
                                    <DatePicker
                                    selected={formData.salary_month ? new Date(formData.salary_month) : null}
                                    onChange={(date) =>
                                        handleChange(
                                        'salary_month',
                                        date ? date.toISOString().split('T')[0] : ''
                                        )
                                    }
                                    dateFormat="MMMM yyyy"
                                    showMonthYearPicker
                                    className={`w-full bg-white input input-xs border rounded-sm text-xs border-gray-300
                                     focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    style={{ padding: '5px', width: '100%' }}
                                    required
                                    />
                                    {formErrors.salary_month && (
                                    <p className="text-[10px] text-red-500 mt-1">{formErrors.salary_month}</p>
                                    )}
                                </div>

                                {/* Payment Date */}
                               <div>
                                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                                    Payment Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.payment_date || ''} // must be 'YYYY-MM-DD'
                                    onChange={(e) => handleChange('payment_date', e.target.value)} // gives 'YYYY-MM-DD'
                                    className={`w-full bg-white input input-xs border rounded-sm text-xs ${
                                    formErrors.payment_date ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    required
                                />
                                {formErrors.payment_date && (
                                    <p className="text-[10px] text-red-500 mt-1">{formErrors.payment_date}</p>
                                )}
                                </div>

                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm text-gray-500 border border-gray-100" style={{ padding: '20px', marginBottom: '10px' }}>
                            <h2 className="text-xl font-semibold text-gray-500" style={{ marginBottom: '5px' }}>Earnings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {[
                                                    'basic_salary',
                                                    'hra',
                                                    'conveyance_allowance',
                                                    'medical_allowance',
                                                    'special_allowance',
                                                    'other_allowance',
                                                    'bonus',
                                                    'overtime_pay',
                                                    'other_earnings',
                                                ].map((key) => {
                                                    const requiredFields = new Set([
                                                    'basic_salary',
                                                    'hra',
                                                    'conveyance_allowance',
                                                    'medical_allowance',
                                                    'special_allowance',
                                                    'other_allowance',
                                                    'bonus',
                                                    'overtime_pay',
                                                    'other_earnings',
                                                    ]);

                                                    const isRequired = requiredFields.has(key);

                                                    return (
                                                    <div key={key}>
                                                        <label className="capitalize text-[10px]">
                                                        {key.replace(/_/g, ' ')}
                                                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                                                        </label>
                                                        <input
                                                        type="number"
                                                        min="0"
                                                        value={formData[key]}
                                                        onChange={(e) => handleChange(key, e.target.value)}
                                                        className="border h-[33px] text-xs rounded-sm border-gray-300 w-full focus:border-blue-300"
                                                        required={isRequired}
                                                        style={{
                                                            paddingLeft: '12px',
                                                            MozAppearance: 'textfield',
                                                            WebkitAppearance: 'none',
                                                            appearance: 'none',
                                                        }}
                                                        />{formErrors[key] && (
                                                            <p className="text-[10px] text-red-500 mt-1">{formErrors[key]}</p>
                                                            )}
                                                    </div>
                                                    );
                                                })}
                                                </div>

                        </div>

                        <div className="bg-white rounded-lg shadow-sm text-gray-500 border border-gray-100" style={{ padding: '20px', marginBottom: '10px' }}>
                            <h2 className="text-xl font-semibold mb-4 text-gray-500">Deductions</h2>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        'provident_fund',
                                        'esi',
                                        'professional_tax',
                                        'income_tax',
                                        'loan_recovery',
                                        'other_deductions',
                                    ].map((key) => {
                                        const requiredFields = new Set([
                                        'esi',
                                        'professional_tax',
                                        'income_tax',
                                        'loan_recovery',
                                        'other_deductions',
                                        ]);

                                        const isRequired = requiredFields.has(key);

                                        return (
                                        <div key={key}>
                                            <label className="capitalize text-[10px]">
                                            {key.replace(/_/g, ' ')}
                                            {isRequired && <span className="text-red-500 ml-1">*</span>}
                                            </label>
                                            <input
                                            type="number"
                                            min="0"
                                            value={formData[key]} // ✅ dynamic value
                                            onChange={(e) => handleChange(key, e.target.value)} // ✅ dynamic update
                                            className="border h-[33px] text-xs rounded-sm border-gray-300 w-full focus:border-blue-300"
                                            required={isRequired}
                                            style={{
                                                paddingLeft: '12px',
                                                MozAppearance: 'textfield',
                                                WebkitAppearance: 'none',
                                                appearance: 'none',
                                            }}
                                            />{formErrors[key] && (
                                                    <p className="text-[10px] text-red-500 mt-1">{formErrors[key]}</p>
                                                    )}
                                        </div>
                                        );
                                    })}
                                    </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 rounded-lg shadow-sm  border border-gray-100" style={{padding:'20px'}}>
                            <div className="bg-white p-4 rounded-lg">
                                <div className="text-xs text-gray-500 font-medium">Gross Earnings</div>
                                <div className="text-2xl font-bold text-gray-700">₹{formData.gross_earnings || 0}</div>
                            </div>

                            <div className="bg-white p-4 rounded-lg">
                                <div className="text-xs text-gray-500 font-medium">Total Deductions</div>
                                <div className="text-2xl font-bold text-gray-500">₹{formData.total_deductions|| 0}</div>
                            </div>

                            <div className="bg-white p-4 rounded-lg">
                                <div className="text-xs text-gray-500 font-medium">Net Salary</div>
                                <div className="text-2xl font-bold text-gray-500">₹{formData.net_salary ||0}</div>
                            </div>

                            <div className="bg-white p-4 rounded-lg">
                           <label className="text-xs font-medium text-gray-600">
                                    Payment Mode <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                    className="border h-[33px] text-xs rounded-sm border-gray-300 w-full focus:border-blue-300 outline-none"
                                    value={formData.payment_mode || ''}
                                    onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                                    >
                                    <option className="text-xs " value="">--select mode--</option>
                                  
                                    
                                    {paymentMode.map((mode, index) => (
                                        <option key={index} value={mode.id}>
                                        {mode.name}
                                        </option>
                                    ))}
                                    </select>
                                    <div>
                                            <label className="text-xs font-medium text-gray-600">Bank Account</label>
                                            <input
                                            type="text"
                                            className="border h-[33px] text-xs rounded-sm border-gray-300 w-full focus:border-blue-300 outline-none"
                                            value={formData.bank_account}
                                            onChange={(e) =>
                                                setFormData({ ...formData, bank_account: e.target.value })
                                            }
                                            />
                                        </div>

                                        {/* UPI ID Input */}
                                        <div>
                                            <label className="text-xs font-medium text-gray-600">UPI ID</label>
                                            <input
                                            type="text"
                                            className="border h-[33px] text-xs rounded-sm border-gray-300 w-full focus:border-blue-300 outline-none"
                                            value={formData.upi_id}
                                            onChange={(e) =>
                                                setFormData({ ...formData, upi_id: e.target.value })
                                            }
                                            />
                                        </div>
                            </div>

                            </div>


                       <div className="bg-white  shadow-lg border border-gray-200 rounded-lg p-4 space-y-4" style={{padding:'20px'}}>
  {/* File Upload */}
                            <div className="text-center">
                                <p className="text-gray-500 text-sm">Upload supporting documents (PDF/Images)</p>
                                <input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="block mx-auto text-sm border border-gray-200  rounded-xs text-xs h-[20px]"
                                onChange={(e) =>
                                    setFormData({ ...formData, supporting_documents: e.target.files })
                                }
                                />
                            </div>

                            {/* Remarks */}
                            <div>
                                <label className="text-xs font-medium text-gray-600">Remarks</label>
                                <textarea
                                className="border rounded-sm border-gray-300 w-full text-sm p-2 mt-1"
                                rows={3}
                                value={formData.remarks}
                                onChange={(e) =>
                                    setFormData({ ...formData, remarks: e.target.value })
                                }
                                />
                            </div>

                            {/* Is Paid */}
                           <div className="flex gap-2 items-center space-x-3 text-sm text-gray-700">
 
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                type="checkbox"
                                checked={formData.is_paid}
                                onChange={(e) => setFormData({ ...formData, is_paid: e.target.checked })}
                                className="sr-only peer"
                                />
                                <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-500 transition duration-300 ease-in-out"></div>
                                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 transform duration-300 ease-in-out"></div>
                            </label>
                            <span className="text-xs font-medium text-gray-600">Is Paid?</span>
                            </div>

                            </div>


                        <div className="flex justify-end gap-4" style={{ margin: '30px' }}>
                                        <button type="button" onClick={handleClear} className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#8392ab' }} >Clear</button>
              <button type="button" onClick={handleSubmit} className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72e4' }} >Create</button>

                        </div>
                    </div>
                    
                

                

               
            </div>
        </>
    );
}

export default CreatePayslip;