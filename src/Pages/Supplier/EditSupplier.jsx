import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import createSupplierModel from "../../models/createSuppliersModel";
import supplierModel from "../../models/supplierModel";
import CurrencyModel from "../../models/currencyModel";
import PurchaseUtils from "../../models/PurchaseUtils";

const EditSupplier = () => {


              const auth = useSelector((state) => state.auth);
              const user_id = auth?.login_id;
              const user_types = Object.keys(auth?.can_manage_user_types || {}).join(",");

              const [editSupplierData, setEditSupplierData] = useState({
                id: null, code: '',name: '',currency: '',control_account: '',supplier_group: '',tax_category: '',
                tax_in_no: '',tin_no: '',terms_of_payment: '',eun: '',supplier_image: '',address_type: '',address: '',
                language: '', country: '',city: '',zip_code: '',gsm_no: '',phone_no: '',fax_no: '',email: '',website: '',
                note: '',bank_name: '',bank_address: '',account_holder_name: '',account_number: '',account_code: '',
                IBAN: '',status: true,
              });


              const [errors, setErrors] = useState({});
              const [supplierGroups, setSupplierGroups] = useState([]);
              const [controlAccounts, setControlAccounts] = useState([]);
              const [taxCategories, setTaxCategories] = useState([]);
              const [addressTypes, setAddressTypes] = useState([]);
              const [countries, setCountries] = useState([]);
              const [cities, setCities] = useState([]);
              const [currencies, setCurrencies] = useState([]);
              const [termsOfPayment, setTermsOfPayment] = useState([]);
              const [isSubmitting, setIsSubmitting] = useState(false);
              const [editingSupplier, setEditingSupplier] = useState(null);
              const [editModal, setEditModal] = useState(false);

              
              


              const location = useLocation();
              const supplier = location.state?.supplier;
              // console.log(supplier)

              useEffect(() => {
                const fetchData = async () => {
                  try {
                    const [supplierGroupRes, controlAccountRes, taxCategoryRes, addressTypeRes, countryRes, cityRes, currencyRes, purchaseUtilsRes] = await Promise.all([
                      createSupplierModel.getSupplierGroups(user_id),
                      createSupplierModel.getControlAccounts(user_id, user_types),
                      createSupplierModel.getTaxCategories(user_id, user_types),
                      createSupplierModel.getAddressTypes(user_id, user_types),
                      createSupplierModel.getCountries(user_id, user_types),
                      createSupplierModel.getCities(user_id, user_types),
                      CurrencyModel.getCurrency(user_id, user_types),
                      PurchaseUtils.getPurchaseUtils(),
                    ]);

                    setSupplierGroups(supplierGroupRes.data.data || []);
                    setControlAccounts(controlAccountRes.data.data || []);
                    setTaxCategories(taxCategoryRes.data.data || []);
                    setAddressTypes(addressTypeRes.data.data || []);
                    setCountries(countryRes.data.data || []);
                    setCities(cityRes.data.data || []);
                    setCurrencies(currencyRes.data.data || []);

                    const termsData = purchaseUtilsRes.data.data.find(item => item.terms_of_payment);
                    setTermsOfPayment(termsData?.terms_of_payment || []);
                  } catch (error) {
                    toast.error("Failed to fetch supplier metadata");
                    console.error("Fetch error:", error);
                  }
                };

                fetchData();
                }, [user_id, user_types]);

                useEffect(() => {
                if (supplier) {
                setEditSupplierData((prev) => ({ ...prev, ...supplier }));
                setEditingSupplier(supplier);
                } else {
                toast.error("No supplier data provided for editing.");
                }
                }, [supplier]);

                const handleEditSupplierChange = (e) => {
                  const { name, value } = e.target;
                  setEditSupplierData((prev) => ({ ...prev, [name]: value }));
                };

                const validateEditSupplier = () => {
                  const newErrors = {};
                  if (!editSupplierData.name) newErrors.name = 'Name is required';
                  if (!editSupplierData.code) newErrors.code = 'Code is required';
                  if (!editSupplierData.currency) newErrors.currency = 'Currency is required';
                  if (!editSupplierData.address_type) newErrors.address_type = 'Adress_type is required';
                  if (!editSupplierData.country) newErrors.country = 'country is required';
                  setErrors(newErrors);
                  return Object.keys(newErrors).length === 0;
                };


              const handleEditSubmitSupplier = async () => {
                if (!editSupplierData?.id) {
                  toast.error("Invalid supplier selected for editing.");
                  return;
                }

                if (!validateEditSupplier()) return;
                setIsSubmitting(true);

                try {
                  const dataToSend = {
                    ...editSupplierData,
                    status: editSupplierData.status === true || editSupplierData.status === "true" || editSupplierData.status === "Active",
                    updated_by: user_id,
                    updated_by_type: user_types,
                  };

                  const response = await supplierModel.updateSupplier(editSupplierData.id, dataToSend);

                  if (response.status === 200) {
                    toast.success("Supplier updated successfully!");
                  }
                } catch (error) {
                  console.error("Update supplier error:", error);

                  if (error.response?.data?.errors) {
                    setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
                    toast.error("Validation errors occurred.");
                  } else {
                    toast.error("Failed to update supplier!");
                  }
                } finally {
                  setIsSubmitting(false);
                }
              };



        const handleEditCloseModal = () => {
              setEditModal(false);
              setEditingSupplier(null);
              setEditSupplierData({});
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
          <label className="text-xs font-bold text-[#344767]">Code <span className="text-red-500 text-[14px]">*</span></label>
          <input
            type="text"
            name="code"
            value={editSupplierData.code}
            onChange={handleEditSupplierChange}
            placeholder="Type here"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="input input-bordered bg-white input-sm w-full text-gray-500 rounded-lg 
                    focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

      
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Name <span className="text-red-500 text-[14px]">*</span></label>
          <input
            type="text"
            name="name"
            value={editSupplierData.name}
            onChange={handleEditSupplierChange}
            placeholder="Type here"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="input input-bordered bg-white input-sm w-full text-gray-500 rounded-lg 
                    focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          />
        </div>

         
        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Currency <span className="text-red-500 text-[14px]">*</span></label>
          <select
            name="currency"
            onChange={handleEditSupplierChange}
            value={editSupplierData.currency}
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
          onChange={handleEditSupplierChange}
          value={editSupplierData.control_account}
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
        {errors.control_account && (
          <span className="text-red-500 text-xs mt-1">{errors.control_account}</span>
        )}
      </div>


      <div className="w-full flex flex-col gap-2">
        <label className="text-xs font-bold text-[#344767]">Supplier Group</label>
        <select
          name="supplier_group"
          onChange={handleEditSupplierChange}
          value={editSupplierData.supplier_group}
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
        {errors.supplier_group && (
          <span className="text-red-500 text-xs mt-1">{errors.supplier_group}</span>
        )}
      </div>



       <div className="w-full flex flex-col gap-2">
        <label className="text-xs font-bold text-[#344767]">Tax Category</label>
        <select
          name="tax_category"
          onChange={handleEditSupplierChange}
          value={editSupplierData.tax_category}
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
        {errors.tax_category && (
          <span className="text-red-500 text-xs mt-1">{errors.tax_category}</span>
        )}
      </div>



       <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Tax in no</label>
          <input
            type="text"
            placeholder="      Tax Identification Number"
            className="input bg-white text-gray-500 input-bordered input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={editSupplierData.tax_in_no}
            onChange={handleEditSupplierChange}
            name="tax_in_no"
          />
          {errors.tax_in_no && (
            <span className="text-red-500 text-xs mt-1">{errors.tax_in_no}</span>
          )}
        </div>

        
        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">Tin no</label>
          <input
            type="text"
            placeholder="     TIN number"
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            value={editSupplierData.tin_no}
            onChange={handleEditSupplierChange}
            name="tin_no"
          />
          {errors.tin_no && (
            <span className="text-red-500 text-xs mt-1">{errors.tin_no}</span>
          )}
        </div>



        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Terms of Payment</label>
          <select
            name="terms_of_payment"
            onChange={handleEditSupplierChange}
            value={editSupplierData.terms_of_payment}
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
          {errors.terms_of_payment && (
            <span className="text-red-500 text-xs mt-1">{errors.terms_of_payment}</span>
          )}
        </div>


        <div className="w-full">
          <label className="text-xs font-bold text-[#344767]">EUN</label>
          <input
            type="text"
            placeholder="    EUN"
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            value={editSupplierData.eun}
            onChange={handleEditSupplierChange}
            name="eun"
          />
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
                setEditSupplierData((prev) => ({
                  ...prev,
                  supplier_image: file,
                }));
              }
            }}
            style={{ paddingLeft: '10px' }}
            className="file-input bg-white text-gray-500 border-gray-300 rounded-lg file-input-sm w-full"
          />
          {editSupplierData.supplier_image && typeof editSupplierData.supplier_image === "object" && (
            <p className="text-xs mt-1 text-gray-500">
              Selected: {editSupplierData.supplier_image.name}
            </p>
          )}
        </div>



        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Address Type <span className="text-red-500 text-[14px]">*</span></label>
          <select
            name="address_type"
            onChange={handleEditSupplierChange}
            value={editSupplierData.address_type}
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


        <div className="w-full flex flex-col gap-2">
          <label className="text-xs font-bold text-[#344767]">Address</label>
          <textarea
            name="address"
            value={editSupplierData.address}
            onChange={handleEditSupplierChange}
            style={{ paddingLeft: '12px', fontSize: '11px' }}
            className="textarea bg-white text-gray-500 border border-gray-200 textarea-gray rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0"
            placeholder="  Address"
          ></textarea>
        </div>


       <div className="w-full flex flex-col gap-2">
        <label className="text-xs font-bold text-[#344767]">Language</label>
        <select
          name="language"
          value={editSupplierData.language}
          onChange={handleEditSupplierChange}
          style={{ paddingLeft: '12px', fontSize: '11px' }}
          className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
        >
          <option disabled value="">------</option>
          <option className="text-sm text-gray-500" value="en">English</option>
          <option className="text-sm text-gray-500" value="fr">French</option>
          <option className="text-sm text-gray-500" value="ar">Arabic</option>
          {/* <option className="text-sm text-gray-500" value="English">English</option>
          <option className="text-sm text-gray-500" value="French">French</option>
          <option className="text-sm text-gray-500" value="Arabic">Arabic</option> */}
        </select>
      </div>



       <div className="w-full flex flex-col gap-2">
        <label className="text-xs font-bold text-[#344767]">Country <span className="text-red-500 text-[14px]">*</span></label>
        <select
          name="country"
          onChange={handleEditSupplierChange}
          value={editSupplierData.country}
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
            onChange={handleEditSupplierChange}
            value={editSupplierData.city}
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
          {errors.city && (
            <span className="text-red-500 text-xs mt-1">{errors.city}</span>
          )}
        </div>


      
          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">Zip Code</label>
            <input
              type="text"
              name="zip_code"
              value={editSupplierData.zip_code}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              placeholder="  Zip Code"
              className="input input-bordered bg-white text-gray-500 input-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>


          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">GSM NUMBER</label>
            <input
              type="text"
              name="gsm_number"
              value={editSupplierData.gsm_no}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              placeholder="    GSM NUMBER"
              className="input input-bordered input-sm bg-white text-gray-500 w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>

          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">Phone no</label>
            <input
              type="text"
              name="phone_no"
              value={editSupplierData.phone_no}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              placeholder="    Phone no"
              className="input input-bordered input-sm bg-white text-gray-500 w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>


          <div className="w-[90%]">
              <label className="text-xs font-bold text-[#344767]">Fax no</label>
              <input
                type="text"
                name="fax_no"
                value={editSupplierData.fax_no}
                onChange={handleEditSupplierChange}
                style={{ paddingLeft: '12px', fontSize: '11px' }}
                placeholder="   Fax no"
                className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
              />
          </div>


          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">Email</label>
            <input
              type="text"
              name="email"
              value={editSupplierData.email}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              placeholder="   Email"
              className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>


          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">Website</label>
            <input
              type="text"
              name="website"
              value={editSupplierData.website}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              placeholder="  Website"
              className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>


          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">Note</label>
            <textarea
              name="note"
              value={editSupplierData.note}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              className="textarea textarea-gray rounded-lg bg-white text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
              placeholder="   Note"
            ></textarea>
          </div>


          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">Bank Name</label>
            <input
              type="text"
              name="bank_name"
              value={editSupplierData.bank_name}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              placeholder="  Bank Name"
              className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>


          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">Bank Address</label>
            <input
              type="text"
              name="bank_address"
              value={editSupplierData.bank_address}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              placeholder="  Bank Address"
              className="input input-bordered input-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>

   
          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">Account Holder Name</label>
            <input
              type="text"
              name="account_holder_name"
              value={editSupplierData.account_holder_name}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              placeholder="   Account Holder Name"
              className="input input-bordered input-sm w-full rounded-lg bg-white text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>


          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">Account number</label>
            <input
              type="text"
              name="account_number"
              value={editSupplierData.account_number}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              placeholder="  Account number"
              className="input input-bordered input-sm w-full rounded-lg bg-white text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>


          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">Account Code</label>
            <input
              type="text"
              name="account_code"
              value={editSupplierData.account_code}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              placeholder="  Account Code"
              className="input input-bordered input-sm w-full rounded-lg bg-white text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>


          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">I ban</label>
            <input
              type="text"
              name="IBAN"
              value={editSupplierData.IBAN}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              placeholder="  International Bank Account Number"
              className="input input-bordered input-sm w-full rounded-lg bg-white text-gray-500 focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            />
          </div>


          <div className="w-[90%]">
            <label className="text-xs font-bold text-[#344767]">Status</label>
            <select
              name="status"
              value={editSupplierData.status}
              onChange={handleEditSupplierChange}
              style={{ paddingLeft: '12px', fontSize: '11px' }}
              className="select select-bordered select-sm w-full bg-white text-gray-500 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
            >
              <option value="" className=" text-gray-600">Select </option>
              <option value={true} className=" text-gray-600"> Active</option>
              <option value={false} className=" text-gray-600"> InActive</option>
            </select>
          </div>


         

      </div>
          <div className="flex flex-col sm:flex-row justify-end items-end gap-4 " style={{padding:'80px'}} > 
            <Link to="/dashboard/supplier">
                <button
                  type="button"
                  className="btn w-[100px] h-[35px]  rounded-lg text-white border-none"
                  style={{ backgroundColor: '#8392ab' }}
                  onClick={handleEditCloseModal}
                >
                  Close
                </button>
                </Link>
              <button
                type="button"
                className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                style={{ backgroundColor: '#5E72E4' }}
                
                onClick={handleEditSubmitSupplier}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
          </div>
     
    </div>
  );
};

export default EditSupplier