import { useEffect, useState } from "react";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import StateModel from "../../../models/StateModel";
import CountryModel from "../../../models/countryModel";
import DistrictModel from "../../../models/DistrictModel";
import { useSelector } from "react-redux";
import TableSkelton from "../../../components/tableSkelton";
import { toast } from 'react-toastify';






const District =()=>{


const [districtData, setDistrictData] = useState([]);
const [totalPages, setTotalPages] = useState(1);
const [limit, setLimit] = useState(10);
const [page, setPage] = useState(1);
const [search, setSearch] = useState('');
const [status, setStatus] = useState('');
const [isLoading, setIsLoading] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);
const [modal, setModal] = useState(false);
const [editModal, setEditModal] = useState(false);
const [editingDistrict, setEditingDistrict] = useState(null);
const [deletingId, setDeletingId] = useState(null);
const [itemToDelete, setItemToDelete] = useState(null);

const [addDistrictData, setAddDistrictData] = useState({
  code: '',
  name: '',
  country: '',
  state: '',

});

const [errors, setErrors] = useState({
  code: '',
  name: '',
  country: '',
  state: '',
});

const auth = useSelector((state) => state.auth);
const { login_id, can_manage_user_types } = auth;
const user_id = login_id;
const user_types = Object.keys(can_manage_user_types).join(',');

const fetchDistrictData = async () => {
  setIsLoading(true);
  try {
    const response = await DistrictModel.getDistricts(
      user_id,
      user_types,
      limit,
      page,
      search,
      status
    );

    if (response?.data?.data) {
      setDistrictData(response.data.data);
      setTotalPages(response.data.pagination?.pages || 1);
    }
  } catch (error) {
    console.error("Error fetching district data:", error);
    toast.error("Failed to fetch districts.");
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchDistrictData();
}, [limit, page, search, status]);


const [countries, setCountries] = useState([]);
const [states, setStates] = useState([]);


useEffect(() => {
  fetchCountries();
  fetchStates();
}, []);

const fetchCountries = async () => {
  try {
    const response = await CountryModel.getCountries(user_id, user_types);
    if (response?.data?.data) {
      setCountries(response.data.data);
    } else {
      toast.error("Failed to load countries");
    }
  } catch (error) {
    console.error("Error fetching countries:", error);
    toast.error("Error fetching countries");
  }
};

const fetchStates = async () => {
  try {
    const response = await StateModel.getStates(user_id, user_types); // Make sure this method exists
    if (response?.data?.data) {
      setStates(response.data.data);
    } else {
      toast.error("Failed to load states");
    }
  } catch (error) {
    console.error("Error fetching states:", error);
    toast.error("Error fetching states");
  }
};

const getCountryName = (id) => {
  const country = countries.find((c) => c.id === id);
  return country ? country.name : "N/A";
};

const getStateName = (id) => {
  const state = states.find((s) => s.id === id);
  return state ? state.name : "N/A";
};






const handleAddDistrictChange = (e) => {
  const { name, value } = e.target;
  setAddDistrictData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


const validateDistrict = () => {
  const newErrors = {};

  if (!addDistrictData.code.trim()) {
    newErrors.code = "Please enter district code";
  }

  if (!addDistrictData.name.trim()) {
    newErrors.name = "Please enter district name";
  }

  if (!addDistrictData.country) {
    newErrors.country = "Please select a country";
  }

  if (!addDistrictData.state) {
    newErrors.state = "Please select a state";
  }

  return newErrors;
};


const handleSubmitDistrict = async () => {
  const validationErrors = validateDistrict();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const payload = {
    code: addDistrictData.code.trim(),
    name: addDistrictData.name.trim(),
    country: addDistrictData.country,
    state: addDistrictData.state,
    status: Boolean(addDistrictData.status),
  };

  console.log("District Payload being sent:", payload);

  try {
    const response = await DistrictModel.createDistrict(payload);
    console.log("Create District response:", response);

    if (response.status === 201 || response.status === 200) {
      toast.success("District created successfully!");
      fetchDistrictData(); // refresh table
      handleCloseModal();

      setAddDistrictData({
        code: '',
        name: '',
        country: '',
        state: '',
        status: false,
      });

      setErrors({});
    }
  } catch (error) {
    console.error("Create District error:", error);
    console.log("Error response:", error.response?.data);
    toast.error("Failed to create district!");

    handleCloseModal();

    if (error.response?.data?.errors) {
      setErrors((prev) => ({
        ...prev,
        ...error.response.data.errors,
      }));
    }
  }
};


const [editDistrictErrors, setEditDistrictErrors] = useState({});
const validateEditDistrict = () => {
  let valid = true;
  const errors = {};

  if (!editingDistrict?.country) {
    errors.country = 'Country is required';
    valid = false;
  }

  if (!editingDistrict?.state) {
    errors.state = 'State is required';
    valid = false;
  }

  if (!editingDistrict?.code?.trim()) {
    errors.code = 'Code is required';
    valid = false;
  }

  if (!editingDistrict?.name?.trim()) {
    errors.name = 'Name is required';
    valid = false;
  }

  setEditDistrictErrors(errors);
  return valid;
};


const handleEditClickDistrict = (districtObj) => {
  if (!districtObj || typeof districtObj !== 'object' || !districtObj.id) {
    toast.error("Invalid district selected.");
    return;
  }

  setEditingDistrict({
    id: districtObj.id,
    country: districtObj.country?.id || '',
    state: districtObj.state?.id || '',
    code: districtObj.code,
    name: districtObj.name,
    status: districtObj.status?.toString(),
  });

  setEditModal(true);
};

const handleEditDistrictChange = (e) => {
  const { name, value } = e.target;

  setEditingDistrict((prev) => ({
    ...prev,
    [name]: name === 'status' ? (value === 'true') : value,
  }));
};

const handleEditSubmitDistrict = async () => {
  if (!editingDistrict?.id) {
    toast.error("Invalid district selected for editing.");
    return;
  }

  if (!validateEditDistrict()) return;

  setIsSubmitting(true);

  const payload = {
    country: editingDistrict.country,
    state: editingDistrict.state,
    code: editingDistrict.code.trim(),
    name: editingDistrict.name.trim(),
    status: editingDistrict.status === true || editingDistrict.status === 'true',
  };

  try {
    const response = await DistrictModel.updateDistrict(editingDistrict.id, payload);

    if (response.status === 200) {
      fetchDistrictData();
      toast.success('District updated successfully!');
      setEditModal(false);
    }
  } catch (error) {
    console.error("Update district error:", error);
    toast.error('Failed to update district!');
    if (error.response?.data?.errors) { 
      setEditDistrictErrors((prev) => ({
        ...prev,
        ...error.response.data.errors,
      }));
    }
  } finally {
    setIsSubmitting(false);
  }
};

  
const handleEditCloseDistrictModal = () => {
  setEditModal(false);
  setEditingDistrict(null);
  setEditDistrictErrors({
    code: '',
    name: '',
    countries:'',
    states:'',
    
  });
};



           
const handleDeleteDistrict = async (id) => {
  if (!id) return;

  try {
    await DistrictModel.deleteDistrict(id);

    setDistrictData((prevData) => prevData.filter((item) => item.id !== id));

    const modal = document.getElementById(`delete_modal_${id}`);
    if (modal && typeof modal.close === 'function') {
      modal.close();
    }

    toast.success('District deleted successfully');
  } catch (error) {
    console.error("Error deleting District:", error);
    toast.error('Failed to delete District');
  }
};



    const handleCloseModal = () => {
    setErrors({
        code: '',
        name: '',
        status: ''
    });
    setModal(false);
    setEditModal(false);
    };
              
                    return (
                      
                  <>
                  <CustomScrollbar/>
                 <div className="bg-white w-full
                                  max-w-[95vw] 
                                  xl:max-w-[90vw] 
                                  2xl:max-w-[95vw] 
                                  h-auto max-h-[70vh] 
                                  rounded-xl px-4 md:px-8 lg:px-12
                                  mx-auto overflow-auto  custom-scrollbar"
                              style={{ fontFamily: 'Open Sans',overflow:'auto'}}
                                >
                 <CreateButton
                  buttoncontent="+ New District"
                  onClick={() => setModal(true)}  
                 />                 
                 <ItemsPerPageSelector items={limit} setItems={setLimit} />
                  
                        
                     <table className="w-full text-sm text-left text-gray-500 border-collapse overflow-x-auto"
                        style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '800px' }}>
                      <thead className="text-xs text-gray-400 uppercase bg-white">
                        <tr>
                          <th  style={{ width: '80px', paddingLeft: '20px' }}>SL NO</th>
                          <th  style={{ width: '100px' }}>CODE</th>
                          <th  style={{ width: '130px' }}>NAME</th>
                          <th  style={{ width: '130px' }}>COUNTRY</th>
                          <th  style={{ width: '130px' }}>STATE</th>
                          <th  style={{ width: '130px' }}>STATUS</th>
                          <th  style={{ width: '130px' }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                            <TableSkelton />
                        ) : districtData.length === 0 ? (
                            <tr>
                            <td className="text-center py-4 text-gray-500 text-sm" colSpan="5">
                                No data available
                            </td>
                            </tr>
                        ) : (
                            districtData.map((district, index) => (
                            <tr key={index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>
                                {index + 1}
                                </td>
                                <td className="py-4 border-b border-gray-200 text-xs">{district.code}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">{district.name}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">{getCountryName(district.country)}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">{getStateName(district.state)}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">
                                {district.status ? (
                                    <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                    Active
                                    </span>
                                ) : (
                                    <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                    INACTIVE
                                    </span>
                                )}
                                </td>
                                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                                <div className="flex gap-2.5 items-center">
                                    <EditButton
                                    onClick={() => {
                                        setEditingDistrict(district); 
                                        setEditModal(true);
                                    }}
                                    />
                                    <DeleteButton
                                    buttonText="Delete District"
                                    modalId={`delete_modal_${district.id}`}
                                    onConfirmDelete={() => handleDeleteDistrict(district.id)}
                                  />

                                </div>
                                </td>
                            </tr>
                            ))
                        )}
                        </tbody>

                    </table>
                                        
                  
                     <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                       
      </div>
       
      {modal && (
                           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50  overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[480px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Create District                  </h3>
                                    <hr className=" border-gray-300"/>
                                    <div className="flex flex-col flex-grow gap-4"> {/* Added flex-grow */}
                                      <div>
                                      <label      
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Code:<span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="Type here"
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                        style={{ paddingLeft: '12px' }}
                                        name="code"
                                        value={addDistrictData.code}
                                        onChange={handleAddDistrictChange}
                                        
                                      />
                                      {errors.code && (
                                              <p className="text-red-500 text-xs mt-1">{errors.code}</p>
                                            )}
                                      
                                      
                                      </div>
                                      <div>
                                       <label                                      
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name:<span className="text-xs text-red-400">*</span>
                                      </label>
                                     <input
                                      type="text"
                                      placeholder="Type here"
                                      className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                      style={{ paddingLeft: '12px' }}
                                      name="name"
                                      value={addDistrictData.name}
                                      onChange={handleAddDistrictChange}
                                      
                                    />
                                    
                                    {errors.name && (
                                              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                            )}
                                    
                                    </div>
                                   </div> 
                                   <div className="w-full flex flex-col gap-2">
                                    <label className="text-xs font-bold text-[#344767]">
                                        Country <span className="text-xs text-red-400">*</span>
                                    </label>
                                    <select
                                        name="country"
                                        value={addDistrictData.country}
                                        onChange={handleAddDistrictChange}
                                        className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none border-gray-300"
                                        style={{ paddingLeft: '12px', fontSize: '11px' }}
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((country) => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-red-400">{errors.country}</p>
                                    </div>



                                    <div className="w-full flex flex-col gap-2">
                                    <label className="text-xs font-bold text-[#344767]">
                                        State <span className="text-xs text-red-400">*</span>
                                    </label>
                                    <select
                                        name="state"
                                        value={addDistrictData.state}
                                        onChange={handleAddDistrictChange}
                                        className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none border-gray-300"
                                        style={{ paddingLeft: '12px', fontSize: '11px' }}
                                    >
                                        <option value="">Select State</option>
                                        {states.map((state) => (
                                        <option key={state.id} value={state.id}>
                                            {state.name}
                                        </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-red-400">{errors.state}</p>
                                    </div>

                                   <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                        >
                                     <button
                                       type="button"
                                       className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                       style={{ backgroundColor: '#8392ab' }}
                                               onClick={handleCloseModal}
                                      >
                                             close
                                      </button>
                                         <button
                                           type="button"
                                           className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                           style={{ backgroundColor: '#5E72E4' }}
                                           
                                           onClick={handleSubmitDistrict}
                                          >
                                          Create
                                           </button>

                                          </div>
                                    </div>
                                 </div>
       )}
       
     {editModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
    <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[550px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
      <h3 className="font-bold text-[22px] text-[#344767]">
        Edit District
      </h3>
      <hr className="border-gray-300"/>
      
      <div className="flex flex-col flex-grow gap-4">
        {/* Code Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[80%]">
            Code: <span className="text-xs text-red-400">*</span>
          </label>
          <input
            type="text"
            name="code"
            placeholder="Type here"
            className="input w-[100%] bg-white text-xs text-gray-500 rounded-lg border border-gray-300 focus:outline-none  focus:border-b-2 focus:border-blue-500"
            style={{paddingLeft:'12px'}}
            value={editingDistrict?.code || ''}
            onChange={handleEditDistrictChange}
          />
          {editDistrictErrors.code && (
            <p className="text-red-500 text-xs mt-1">{editDistrictErrors.code}</p>
          )}
        </div>

        {/* Name Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[80%]">
            Name: <span className="text-xs text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            name="name"
            className="input w-[100%] bg-white text-xs text-gray-500 rounded-lg border border-gray-300 focus:outline-none  focus:border-b-2 focus:border-blue-500"
            style={{paddingLeft:'12px'}}
            value={editingDistrict?.name || ''}
            onChange={handleEditDistrictChange}
          />
          {editDistrictErrors.name && (
            <p className="text-red-500 text-xs mt-1">{editDistrictErrors.name}</p>
          )}
                    </div>

            <div className="w-full flex flex-col gap-2">
            <label className="text-xs font-bold text-[#344767]">
                Country <span className="text-xs text-red-400">*</span>
            </label>
            <select
                name="country"
                value={editingDistrict.country}
                onChange={handleEditDistrictChange}
                className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none border-gray-300"
                style={{ paddingLeft: '12px', fontSize: '11px' }}
            >
                <option value="">Select Country</option>
                {countries.map((country) => (
                <option key={country.id} value={country.id}>
                    {country.name}
                </option>
                ))}
            </select>
            <p className="text-xs text-red-400">{editDistrictErrors.country}</p>
            </div>

            {/* State - Edit */}
            <div className="w-full flex flex-col gap-2">
            <label className="text-xs font-bold text-[#344767]">
                State <span className="text-xs text-red-400">*</span>
            </label>
            <select
                name="state"
                value={editingDistrict.state}
                onChange={handleEditDistrictChange}
                className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none border-gray-300"
                style={{ paddingLeft: '12px', fontSize: '11px' }}
            >
                <option value="">Select State</option>
                {states.map((state) => (
                <option key={state.id} value={state.id}>
                    {state.name}
                </option>
                ))}
            </select>
            <p className="text-xs text-red-400">{editDistrictErrors.state}</p>
            </div>


        {/* Status Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[80%]">
            Status:
          </label>
          <select
            className={`select w-[100%] h-[35px] text-gray-500 bg-white border ${
              errors.status ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none rounded-lg focus:border-b-2 focus:border-blue-500`}
            style={{paddingLeft:'12px'}}
            value={editingDistrict?.status ? 'Active' : 'InActive'}
            onChange={(e) => {
              setEditingDistrict({
                ...editingDistrict, 
                status: e.target.value === 'Active'
              });
              
            }}
          >
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
        <button
          type="button"
          className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
          style={{ backgroundColor: '#8392ab' }}
          onClick={handleEditCloseDistrictModal}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
          style={{ backgroundColor: '#5E72E4' }}
          onClick={handleEditSubmitDistrict}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update'}
        </button>
      </div>
    </div>
  </div>
)}
       
                          
                     </>)
}

export default District