import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import supplierModel from "../../models/supplierModel";
import CurrencyModel from "../../models/currencyModel";
import controlAccountModel from "../../models/controlAccountModel";
import supplierGroupModel from "../../models/supplierGroupModel";
import taxCategoryModel from "../../models/taxCategoryModel";
import TermsOfPayment from "../Settings/TermsOfPayment";
import addressTypeModel from "../../models/addressTypeModel";
import CountryModel from "../../models/countryModel";
import CityModel from "../../models/CityModel";
import PurchaseUtils from "../../models/PurchaseUtils";
import TermsOfPaymentModel from "../../models/TermsOfPaymentModel";

const CreateSupplier = () => {
  const auth = useSelector((state) => state.auth);
  const user_id = auth?.login_id;
  const user_types = Object.keys(auth?.can_manage_user_types || {}).join(",");

  const [addSupplierData, setAddSupplierData] = useState({
    code: "",
    name: "",
    currency: "",
    control_account: "",
    supplier_group: "",
    tax_category: "",
    tax_in_no: "",
    tin_no: "",
    terms_of_payment: "",
    eun: "",
    supplier_image: null,
    address_type: "",
    address: "",
    language: "",
    country: "",
    city: "",
    zip_code: "",
    gsm_no: "",
    phone_no: "",
    fax_no: "",
    email: "",
    website: "",
    note: "",
    bank_name: "",
    bank_address: "",
    account_holder_name: "",
    account_number: "",
    account_code: "",
    IBAN: "",
    status: "",
  });

  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const handleCloseModal = () => {
    setModal(false);
    setEditModal(false);
  };



const [currencies, setCurrencies] = useState([]);

useEffect(() => {
  const fetchCurrencies = async () => {
    try {
      const response = await CurrencyModel.getCurrency(user_id, user_types);
      if (response.status === 200) {
        setCurrencies(response.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
    }
  };

  fetchCurrencies();
}, []);


const [countries, setCountries] = useState([]);

useEffect(() => {
  const fetchCountries = async () => {
    try {
      const response = await CountryModel.getCountries(user_id, user_types);
      if (response.status === 200) {
        setCountries(response.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    }
  };

  fetchCountries();
}, []);

const [controlAccounts, setControlAccounts] = useState([]);

useEffect(() => {
  const fetchControlAccounts = async () => {
    try {
      const response = await controlAccountModel.getControlAccounts(user_id, user_types);
      if (response.status === 200) {
        setControlAccounts(response.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch control accounts:", error);
    }
  };

  fetchControlAccounts();
}, []);

const [supplierGroups, setSupplierGroups] = useState([]);

useEffect(() => {

  const fetchSupplierGroups = async () => {
    try {
      const response = await supplierGroupModel.getSupplierGroups(user_id, user_types);
      if (response.status === 200) {
        setSupplierGroups(response.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch supplier groups:", error);
    }
  };

  fetchSupplierGroups();
}, []);


const [taxCategories, setTaxCategories] = useState([]);

useEffect(() => {
  const fetchTaxCategories = async () => {
    try {
      const response = await taxCategoryModel.getTaxCategories(user_id, user_types);
      if (response.status === 200) {
        setTaxCategories(response.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch tax categories:", error);
    }
  };

  fetchTaxCategories();
}, []);

const [termsOfPayment, setTermsOfPayment] = useState([]);

useEffect(() => {
  const fetchTermsOfPayment = async () => {
    try {
      const response = await TermsOfPaymentModel.getTermsOfPayments(user_id, user_types);
      if (response.status === 200) {
        setTermsOfPayment(response.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch terms of payment:", error);
    }
  };

  fetchTermsOfPayment();
}, []);

const [addressTypes, setAddressTypes] = useState([]);

useEffect(() => {
  const fetchAddressTypes = async () => {
    try {
      const response = await addressTypeModel.getAddressTypes(user_id, user_types);
      if (response.status === 200) {
        setAddressTypes(response.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch address types:", error);
    }
  };

  fetchAddressTypes();
}, []);

const [cities, setCities] = useState([]);

useEffect(() => {
  const fetchCities = async () => {
    try {
      const response = await CityModel.getCities(user_id, user_types);
      if (response.status === 200) {
        setCities(response.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  };

  fetchCities();
}, []);




const handleAddSupplierChange = (e) => {
  const { name, value } = e.target;
  setAddSupplierData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

// Validation 
const validateSupplier = () => {
  const newErrors = {};

  if (!addSupplierData.code?.trim()) {
    newErrors.code = "Supplier code is required";
  }

  if (!addSupplierData.name?.trim()) {
    newErrors.name = "Supplier name is required";
  }

  if (!addSupplierData.currency) {
    newErrors.currency = "Currency is required";
  }


  if (!addSupplierData.country) {
    newErrors.country = "Country is required";
  }

  if (!addSupplierData.address_type) {
    newErrors.address_type = "Address type is required";
  }

  

  return newErrors;
};

const handleSubmitSupplier = async () => {
  const validationErrors = validateSupplier();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const payload = {
    code: addSupplierData.code.trim(),
    name: addSupplierData.name.trim(),
    currency: parseInt(addSupplierData.currency),
    address_type: parseInt(addSupplierData.address_type),
    country: parseInt(addSupplierData.country),
    
  };

  console.log("Supplier Payload being sent:", payload);

  try {
    const response = await supplierModel.createSupplier(payload);
    console.log("Create Supplier response:", response);

    if (response.status === 201 || response.status === 200) {
      toast.success("Supplier created successfully!");
      fetchSuppliers(); // optional refresh method
      handleCloseModal(); // close modal after success
    }
  } catch (error) {
    console.error("Create supplier error:", error);
    toast.error("Failed to create supplier!");
    handleCloseModal();

    if (error.response?.data?.errors) {
      setErrors((prev) => ({
        ...prev,
        ...error.response.data.errors,
      }));
    }
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
        mx-auto overflow-auto custom-scrollbar "
      style={{ fontFamily: 'Open Sans' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7  justify-center items-center" style={{padding:'20px'}}>

        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Code<span className="text-red-500 text-[14px]">*</span></label>
          <input
            type="text"
            placeholder="Type here"
            className="input bg-white text-gray-500 input-bordered input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.code}
            onChange={handleAddSupplierChange}
            name="code"
            />
            {errors.code && (
            <span className="text-red-500 text-xs mt-1">{errors.code}</span>
          )}
        </div>
      
        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Name<span className="text-red-500 text-[14px]">*</span></label>
          <input
            type="text"
            placeholder="Type here"
            className="input  bg-white text-gray-500 input-bordered input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.name}
            onChange={handleAddSupplierChange}
            name="name"/>

            {errors.name && (
            <span className="text-red-500 text-xs mt-1">{errors.name}</span>
          )}
            
        </div>
        

       <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Currency<span className="text-red-500 text-[14px]">*</span></label>
          <select
            name="currency"
            onChange={handleAddSupplierChange}
            value={addSupplierData.currency}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option disabled value="">Select Currency</option>
            {currencies.map((cur) => (
              <option key={cur.id} value={cur.id}>
                {cur.name} ({cur.symbol})
              </option>
            ))}
          </select>
          {errors.currency && (
            <span className="text-red-500 text-xs mt-1">{errors.currency}</span>
          )}
        </div>



        
       <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Control Account</label>
          <select
            name="control_account"
            onChange={handleAddSupplierChange}
            value={addSupplierData.control_account}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option disabled value="">Select Control Account</option>
            {controlAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>



        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Supplier Group</label>
          <select
            name="supplier_group"
            onChange={handleAddSupplierChange}
            value={addSupplierData.supplier_group}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option disabled value="">Select Supplier Group</option>
            {supplierGroups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>





        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Tax Category</label>
          <select
            name="tax_category"
            onChange={handleAddSupplierChange}
            value={addSupplierData.tax_category}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option disabled value="">Select Tax Category</option>
            {taxCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>



        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Tax in no</label>

          <input
            type="text"
            placeholder="      Tax Identification Number"
            className="input  bg-white text-gray-500 input-bordered input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.tax_in_no}
            onChange={handleAddSupplierChange}
            name="tax_in_no"/>
        </div> 
        

        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Tin no</label>

          <input
            type="text"
            placeholder="     TIN number"
            className="input input-bordered  bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.tin_no}
            onChange={handleAddSupplierChange}
            name="tin_no" />
        </div>


        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Terms of Payment</label>
          <select
            name="terms_of_payment"
            onChange={handleAddSupplierChange}
            value={addSupplierData.terms_of_payment}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option disabled value="">Select Terms of Payment</option>
            {termsOfPayment.map(term => (
              <option key={term.id} value={term.id}>
                {term.name}
              </option>
            ))}
          </select>
        </div>


        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">EUN </label>
          <input
            type="text"
            placeholder="    EUN"
            style={{ paddingLeft: '10px', fontSize: '11px' }}
            className="input input-bordered  bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            value={addSupplierData.eun}
            onChange={handleAddSupplierChange}
            name="eun"/>
        </div>


        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Supplier Image</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,image/*"
            name="supplier_image"
            onChange={(e) => {
              const file = e.target.files?.[0]; 
              if (file) {
                setAddSupplierData((prev) => ({
                  ...prev,
                  supplier_image: file,
                }));
              }
            }}
            style={{ paddingLeft: '10px' }}
            className="file-input bg-white text-gray-500 border-gray-300 rounded-lg file-input-sm w-full"
          />
          {addSupplierData.supplier_image && typeof addSupplierData.supplier_image=== "object" && (
            <p className="text-xs mt-1 text-gray-500">Selected: {addSupplierData.supplier_image.name}</p>
          )}
        </div>

       <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Address Type<span className="text-red-500 text-[14px]">*</span></label>
          <select
            name="address_type"
            onChange={handleAddSupplierChange}
            value={addSupplierData.address_type}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option disabled value="">Select Address Type</option>
            {addressTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.address_type && (
            <span className="text-red-500 text-xs mt-1">{errors.address_type}</span>
          )}
        </div>



 



        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Address</label>
        <textarea className="textarea  bg-white text-gray-500 border border-gray-200 textarea-gray rounded-lg " placeholder=" Address"
          value={addSupplierData.address}
          onChange={handleAddSupplierChange}
          name="address">
        </textarea>   
       </div>

       <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]"> Language</label>
        <select
          className="select select-bordered bg-white text-gray-500 select-sm w-full  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          style={{ paddingLeft: '12px', fontSize: '11px' }}
          value={addSupplierData.language}
          onChange={handleAddSupplierChange}
          name="language">
        <option value="" disabled>------</option>
        <option className="text-sm text-gray-500" value="en">English</option>
        <option className="text-sm text-gray-500" value="fr">French</option>
        <option className="text-sm text-gray-500" value="ar">Arabic</option>

          {/* <option value="en" className="text-sm text-gray-500">English</option>
          <option value="fr" className="text-sm text-gray-500">French</option>
          <option value="ar" className="text-sm text-gray-500">Arabic</option> */}
        </select>
        </div>



        <div className="w-full flex flex-col gap-2">
            <label className="text-xs font-bold text-[#344767]">Country<span className="text-red-500 text-[14px]">*</span></label>
            <select
              name="country"
              onChange={handleAddSupplierChange}
              value={addSupplierData.country}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            >
              <option disabled value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
            <span className="text-red-500 text-xs mt-1">{errors.country}</span>
          )}
        </div>



       <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">City</label>
          <select
            name="city"
            onChange={handleAddSupplierChange}
            value={addSupplierData.city}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
            <option disabled value="">Select City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>


        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Zip Code </label>
          <input
            type="text"
            placeholder="    Zip Code"
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            value={addSupplierData.zip_code}
            onChange={handleAddSupplierChange}
            name="zip_code"/>
        </div>

        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">GSM NUMBER </label>
          <input
            type="text"
            placeholder="    GSM NUMBER"
            className="input input-bordered input-sm bg-white text-gray-500 w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.gsm_no}
            onChange={handleAddSupplierChange}
            name="gsm_no"/>
        </div>

        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Phone no </label>
          <input
            type="text"
            placeholder="    Phone no"
            className="input input-bordered input-sm bg-white text-gray-500 w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.phone_no}
            onChange={handleAddSupplierChange}
            name="phone_no"/>
        </div>

        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Fax no </label>
          <input
            type="text"
            placeholder="   Fax no"
            className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.fax_no}
            onChange={handleAddSupplierChange}
            name="fax_no"/>
        </div>
        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Email </label>
          <input
            type="text"
            placeholder="   Email"
            className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.email}
            onChange={handleAddSupplierChange}
            name="email"/>
        </div>
        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Website</label>
          <input
            type="text"
            placeholder="  Website"
            className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
             value={addSupplierData.website}
             onChange={handleAddSupplierChange}
             name="website"/>
        </div>
        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Note</label>
        <textarea className="textarea textarea-gray rounded-lg bg-white text-gray-500  focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" placeholder="   Note"
        style={{ paddingLeft: '12px', fontSize: '11px' }}
        value={addSupplierData.note}
        onChange={handleAddSupplierChange}
        name="note"></textarea>   
       </div>

       <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Bank Name</label>
          <input
            type="text"
            placeholder="  Bank Name"
            className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.bank_name}
            onChange={handleAddSupplierChange}
            name="bank_name"/>
        </div>
       <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Bank Address</label>
          <input
            type="text"
            placeholder="  Bank Address"
            className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.bank_address}
            onChange={handleAddSupplierChange}
            name="bank_address" />
        </div>
       <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Account Holder Name</label>
          <input
            type="text"
            placeholder="   Account Holder Name"
            className="input input-bordered input-sm w-full rounded-lg bg-white text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.account_holder_name}
            onChange={handleAddSupplierChange}
            name="account_holder_name"/>
        </div>
       <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Account number</label>
          <input
            type="text"
            placeholder="  Account number"
            style={{paddingLeft:'12px'}}
            className="input input-bordered input-sm w-full rounded-lg bg-white text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            value={addSupplierData.account_number}
            onChange={handleAddSupplierChange}
            name="account_number"/>
        </div>
       <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Account Code</label>
          <input
            type="text"
            placeholder="  Account Code"
            className="input input-bordered input-sm w-full rounded-lg bg-white text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.account_code}
            onChange={handleAddSupplierChange}
            name="account_code" />
        </div>
       <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">I ban</label>
          <input
            type="text"
            placeholder="  International Bank Account Number"
            className="input input-bordered input-sm w-full rounded-lg bg-white text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.IBAN}
            onChange={handleAddSupplierChange}
            name="IBAN"/>
        </div>
        {/* <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]"> Status</label>
        <select defaultValue=""
          className="select select-bordered select-sm w-full bg-white text-gray-500  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          style={{ paddingLeft: '12px', fontSize: '11px' }}
          value={String(addSupplierData.status)}
          onChange={handleAddSupplierChange}
          name="status">
        <option value='' disabled selected>------</option>
          <option value='true' className="text-sm text-gray-500">Active </option>
          <option value='false' className="text-sm text-gray-500">Inactive</option>
        </select>
        </div> */}

         

      </div>
      <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " style={{padding:'20px'}}>
        {/* <Link to="/dashboard/supplier"> */}
            <button
              type="button"
              className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
              style={{ backgroundColor: '#5E72e4' }}
              onClick={handleSubmitSupplier}
            >
                Submit
            </button>
            {/* </Link> */}
            <Link to="/dashboard/supplier">
            <button
              type="button"
              className="btn w-[100px] h-[35px]  rounded-lg text-white border-none"
              style={{ backgroundColor: '#8392ab' }}
              onClick={handleCloseModal}
            >
              Close
            </button>
            </Link>
            </div>
    </div>
  );
};


export default CreateSupplier