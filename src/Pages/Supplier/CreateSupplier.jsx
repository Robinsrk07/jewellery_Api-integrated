import { useEffect, useState ,useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import supplierModel from "../../models/supplierModel";
import CurrencyModel from "../../models/currencyModel";
import controlAccountModel from "../../models/controlAccountModel";
import supplierGroupModel from "../../models/supplierGroupModel";
import taxCategoryModel from "../../models/taxCategoryModel";
import TermsOfPayment from "../Settings/TermsOfPayment";
import addressTypeModel from "../../models/addressTypeModel";
import CountryModel from "../../models/countryModel";
import CityModel from "../../models/CityModel";
import BackButton from "../../components/BackButton";
import PurchaseUtils from "../../models/PurchaseUtils";
import TermsOfPaymentModel from "../../models/TermsOfPaymentModel";

const CreateSupplier = () => {
  const auth = useSelector((state) => state.auth);
  const user_id = auth?.login_id;
  const user_types = Object.keys(auth?.can_manage_user_types || {}).join(",");
  const navigate = useNavigate()
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
  const [filteredCities, setFilteredCities] = useState([]);

  const handleCloseModal = () => {
    setModal(false);
    setEditModal(false);
  };


  const fieldRefs = {
  code: useRef(null),
  name: useRef(null),
  currency: useRef(null),
  control_account: useRef(null),
  supplier_group: useRef(null),
  tax_category: useRef(null),
  tax_in_no: useRef(null),
  tin_no: useRef(null),
  terms_of_payment: useRef(null),
  eun: useRef(null),
  supplier_image: useRef(null),
  address_type: useRef(null),
  address: useRef(null),
  language: useRef(null),
  country: useRef(null),
  city: useRef(null),
  zip_code: useRef(null),
  gsm_no: useRef(null),
  phone_no: useRef(null),
  fax_no: useRef(null),
  email: useRef(null),
  website: useRef(null),
  note: useRef(null),
  bank_name: useRef(null),
  bank_address: useRef(null),
  account_holder_name: useRef(null),
  account_number: useRef(null),
  account_code: useRef(null),
  IBAN: useRef(null),
  status: useRef(null),
};

const [currencies, setCurrencies] = useState([]);

useEffect(() => {
  const fetchCurrencies = async () => {
    try {
      const response = await CurrencyModel.getCurrency(user_id,user_types,1000, 1, '','True');
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
console.log(countries)

useEffect(() => {
  const fetchCountries = async () => {
    try {
      const response = await CountryModel.getCountries(user_id,user_types,1000, 1, '','True');
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
      const response = await controlAccountModel.getControlAccounts(user_id,user_types,1000, 1, '','True');
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
      const response = await supplierGroupModel.getSupplierGroups(user_id,user_types,1000, 1, '','True');
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
      const response = await taxCategoryModel.getTaxCategories(user_id,user_types,1000, 1, '','True');
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
      const response = await TermsOfPaymentModel.getTermsOfPayments(user_id,user_types,1000, 1, '','True');
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
      const response = await addressTypeModel.getAddressTypes(user_id,user_types,1000, 1, '','True');
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
console.log(cities)


useEffect(() => {
  const fetchCities = async () => {
    try {
      const response = await CityModel.getCities(user_id,user_types,1000, 1, '','True');
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
    ...(name === "country" && { city: "" }), 
  }));

   setErrors((prevErrors) => {
    const updatedErrors = { ...prevErrors };
    delete updatedErrors[name];
    return updatedErrors;
  });
  if (name === "country") {
    const selectedCountryId = parseInt(value);
    const matchedCities = cities.filter(
      (city) => city.country === selectedCountryId
    );
    setFilteredCities(matchedCities);
  }
};

// Validation 
const validateSupplier = () => {
  const newErrors = {};

  // Regex patterns
  const alphanumericPattern = /^[a-zA-Z0-9-_]+$/;
  const namePattern = /^[a-zA-Z\s.'-]{2,}$/;
  const taxPattern = /^[A-Z0-9]{5,20}$/;
  const zipCodePattern = /^[A-Za-z0-9\s-]{3,10}$/;
  const phonePattern = /^\+?[0-9\s().-]{7,20}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const ibanPattern = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/;
  const accountCodePattern = /^[A-Z0-9-_]{3,20}$/;

  // Required field validations
  if (!addSupplierData.code?.trim()) {
    newErrors.code = "Supplier code is required";
  } else if (!alphanumericPattern.test(addSupplierData.code)) {
    newErrors.code = "Code must be alphanumeric (A-Z, 0-9) and may include '-' or '_'";
  }

  if (!addSupplierData.name?.trim()) {
    newErrors.name = "Supplier name is required";
  } else if (!namePattern.test(addSupplierData.name)) {
    newErrors.name = "Name must contain only letters, spaces, apostrophes, or hyphens";
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

  // Optional format validations
  if (addSupplierData.tax_in_no && !taxPattern.test(addSupplierData.tax_in_no)) {
    newErrors.tax_in_no = "Tax Identification Number must be 5–20 uppercase letters or numbers";
  }

  if (addSupplierData.tin_no && !taxPattern.test(addSupplierData.tin_no)) {
    newErrors.tin_no = "TIN must be 5–20 uppercase letters or numbers";
  }

  if (addSupplierData.eun && !alphanumericPattern.test(addSupplierData.eun)) {
    newErrors.eun = "EUN must be alphanumeric and may include '-' or '_'";
  }

  if (addSupplierData.zip_code && !zipCodePattern.test(addSupplierData.zip_code)) {
    newErrors.zip_code = "ZIP Code must be 3–10 characters (letters, digits, spaces, or hyphens)";
  }

  if (addSupplierData.gsm_no && !phonePattern.test(addSupplierData.gsm_no)) {
    newErrors.gsm_no = "GSM number must be 7–20 digits and may include '+', '(', ')', or dashes";
  }

  if (addSupplierData.phone_no && !phonePattern.test(addSupplierData.phone_no)) {
    newErrors.phone_no = "Phone number must be 7–20 digits and may include '+', '(', ')', or dashes";
  }

  if (addSupplierData.fax_no && !phonePattern.test(addSupplierData.fax_no)) {
    newErrors.fax_no = "Fax number must be 7–20 digits and may include '+', '(', ')', or dashes";
  }

  if (addSupplierData.email && !emailPattern.test(addSupplierData.email)) {
    newErrors.email = "Email must be a valid format (e.g., example@domain.com)";
  }

  if (addSupplierData.bank_name && !namePattern.test(addSupplierData.bank_name)) {
    newErrors.bank_name = "Bank name must contain only letters, spaces, apostrophes, or hyphens";
  }

  if (addSupplierData.account_holder_name && !namePattern.test(addSupplierData.account_holder_name)) {
    newErrors.account_holder_name = "Account holder name must contain only letters, spaces, apostrophes, or hyphens";
  }

  if (addSupplierData.account_number && !/^[0-9]{6,20}$/.test(addSupplierData.account_number)) {
    newErrors.account_number = "Account number must be 6–20 digits";
  }
   if (addSupplierData.account_code && !accountCodePattern.test(addSupplierData.account_code)) {
    newErrors.account_code = "Account code must be 3–20 characters (uppercase letters, numbers, '-' or '_')";
  }

  if (addSupplierData.IBAN && !ibanPattern.test(addSupplierData.IBAN)) {
    newErrors.IBAN = "IBAN must be in standard format (e.g., GB33BUKB20201555555555)";
  }

 

  return newErrors;
};


const sanitizeData = (data) => {
  const sanitized = {};

  for (const key in data) {
    const value = data[key];

    if (
      value !== undefined &&
      value !== null &&
      !(typeof value === "string" && value.trim() === "")
    ) {
      sanitized[key] = value;
    }
  }

  return sanitized;
};




const handleSubmitSupplier = async () => {
  const validationErrors = validateSupplier();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);

    const firstErrorKey = Object.keys(validationErrors)[0];
    if (fieldRefs[firstErrorKey]?.current) {
      fieldRefs[firstErrorKey].current.scrollIntoView({ behavior: "smooth", block: "center" });
      fieldRefs[firstErrorKey].current.focus();
    }

    return;
  }


  const cleanData = sanitizeData(addSupplierData)



  try {
    const response = await supplierModel.createSupplier(cleanData);
    console.log("Create Supplier response:", response);

    if (response.status === 201 || response.status === 200) {
      toast.success("Supplier created successfully!");
       navigate("/dashboard/supplier")
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
      <div style={{paddingTop:'20px' ,paddingRight:'20px'}}><BackButton to='/dashboard/supplier'/></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7  justify-center items-center" style={{padding:'20px'}}>

        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Code<span className="text-red-500 text-[14px]">*</span></label>
          <input
            type="text"
            placeholder="Type here"
            className="input bg-white text-gray-500 input-bordered input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.code}
            ref={fieldRefs.code}
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
            ref={fieldRefs.name}
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
            ref={fieldRefs.currency}
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
            ref={fieldRefs.tax_in_no}
            name="tax_in_no"/>
             {errors.tax_in_no && (
            <span className="text-red-500 text-xs mt-1">{errors.tax_in_no}</span>
          )}
        </div> 
        

        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Tin no</label>

          <input
            type="text"
            placeholder="     TIN number"
            className="input input-bordered  bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.tin_no}
            ref={fieldRefs.tin_no}
            onChange={handleAddSupplierChange}
            name="tin_no" />
            {errors.tin_no && (
            <span className="text-red-500 text-xs mt-1">{errors.tin_no}</span>
          )}
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
            ref={fieldRefs.eun}
            onChange={handleAddSupplierChange}
            name="eun"/>
             {errors.eun && (
            <span className="text-red-500 text-xs mt-1">{errors.eun}</span>
          )}
            
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
            className="border h-[33px] bg-white text-gray-500 border-gray-300 rounded-lg file-input-sm w-full"
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
            ref={fieldRefs.address_type}
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
              ref={fieldRefs.country}
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
            {filteredCities.map((city) => (
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
            ref={fieldRefs.zip_code}
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            value={addSupplierData.zip_code}
            onChange={handleAddSupplierChange}
            name="zip_code"/>
              {errors.zip_code && (
            <span className="text-red-500 text-xs mt-1">{errors.zip_code}</span>
          )}
        </div>

        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">GSM NUMBER </label>
          <input
            type="text"
            placeholder="    GSM NUMBER"
            className="input input-bordered input-sm bg-white text-gray-500 w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.gsm_no}
              ref={fieldRefs.gsm_no}
            onChange={handleAddSupplierChange}
            name="gsm_no"/>
             {errors.gsm_no && (
            <span className="text-red-500 text-xs mt-1">{errors.gsm_no}</span>
          )}
            
        </div>

        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Phone no </label>
          <input
            type="text"
            placeholder="    Phone no"
            ref={fieldRefs.phone_no}
            className="input input-bordered input-sm bg-white text-gray-500 w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.phone_no}
            onChange={handleAddSupplierChange}
            name="phone_no"/>
             {errors.phone_no && (
            <span className="text-red-500 text-xs mt-1">{errors.phone_no}</span>
          )}
        </div>

        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Fax no </label>
          <input
            type="text"
            placeholder="   Fax no"
            ref={fieldRefs.fax_no}
            className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.fax_no}
            onChange={handleAddSupplierChange}
            name="fax_no"/>
            {errors.fax_no && (
            <span className="text-red-500 text-xs mt-1">{errors.fax_no}</span>
          )}
        </div>
        <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Email </label>
          <input
            type="text"
            placeholder="   Email"
            ref={fieldRefs.email}
            className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.email}
            onChange={handleAddSupplierChange}
            name="email"/>
            {errors.email && (
            <span className="text-red-500 text-xs mt-1">{errors.email}</span>
          )}
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
            ref={fieldRefs.bank_name}
            onChange={handleAddSupplierChange}
            name="bank_name"/>
            {errors.phone_no && (
            <span className="text-red-500 text-xs mt-1">{errors.bank_name}</span>
          )}
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
            ref={fieldRefs.account_holder_name}
            onChange={handleAddSupplierChange}
            name="account_holder_name"/>
            {errors.account_holder_name && (
            <span className="text-red-500 text-xs mt-1">{errors.account_holder_name}</span>
          )}
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
            ref={fieldRefs.account_number}
            name="account_number"/>
            {errors.account_number && (
            <span className="text-red-500 text-xs mt-1">{errors.account_number}</span>
          )}
        </div>
       <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">Account Code</label>
          <input
            type="text"
            placeholder="  Account Code"
            ref={fieldRefs.account_code}
            className="input input-bordered input-sm w-full rounded-lg bg-white text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.account_code}
            onChange={handleAddSupplierChange}
            name="account_code" />
            {errors.account_code && (
            <span className="text-red-500 text-xs mt-1">{errors.account_code}</span>
          )}
        </div>
       <div className="w-full">
        <label className="text-xs font-bold  text-[#344767]">I ban</label>
          <input
            type="text"
            placeholder="  International Bank Account Number"
            ref={fieldRefs.IBAN}
            className="input input-bordered input-sm w-full rounded-lg bg-white text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300" 
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={addSupplierData.IBAN}
            onChange={handleAddSupplierChange}
            name="IBAN"/>
            {errors.IBAN && (
            <span className="text-red-500 text-xs mt-1">{errors.IBAN}</span>
          )}
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
             <button
              type="button"
              className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
              style={{ backgroundColor: '#5E72e4' }}
              onClick={handleSubmitSupplier}
            >
                Submit
            </button>
            </div>
    </div>
  );
};


export default CreateSupplier