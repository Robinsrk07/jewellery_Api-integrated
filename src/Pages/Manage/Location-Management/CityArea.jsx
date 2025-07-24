import { useEffect, useState } from "react";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import CountryModel from "../../../models/countryModel";
import StateModel from "../../../models/stateModel";
import CityModel from "../../../models/CityModel";
import DistrictModel from "../../../models/districtModel";
import { useSelector } from "react-redux";
import TableSkelton from "../../../components/tableSkelton";
import { toast } from 'react-toastify';
import CityAreaModel from "../../../models/cityAreaModel";





const City_Area =()=>{

const [cityAreaData, setCityAreaData] = useState([]);
const [totalPages, setTotalPages] = useState(1);
const [limit, setLimit] = useState(10);
const [page, setPage] = useState(1);
const [search, setSearch] = useState('');
const [status, setStatus] = useState('');
const [isLoading, setIsLoading] = useState(true);
const [isSubmitting, setIsSubmitting] = useState(false);
const [modal, setModal] = useState(false);
const [editModal, setEditModal] = useState(false);
const [editingCityArea, setEditingCityArea] = useState(null);
const [deletingId, setDeletingId] = useState(null);
const [itemToDelete, setItemToDelete] = useState(null);

const [addCityAreaData, setAddCityAreaData] = useState({
  code: '',
  name: '',
  country: '',
  state: '',
  district: '',  
});

const [errors, setErrors] = useState({
  code: '',
  name: '',
  country: '',
  state: '',
  district: '',
});

const auth = useSelector((state) => state.auth);
const { login_id, can_manage_user_types } = auth;
const user_id = login_id;
const user_types = Object.keys(can_manage_user_types).join(',');

const fetchCityAreaData = async () => {
  setIsLoading(true);
  try {
    const response = await CityAreaModel.getCityAreas(
      user_id,
      user_types,
      limit,
      page,
      search,
      status
    );

    if (response?.data?.data) {
      setCityAreaData(response.data.data);
      setTotalPages(response.data.pagination?.pages || 1);
    }
  } catch (error) {
    console.error("Error fetching city area data:", error);
    toast.error("Failed to fetch city areas.");
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchCityAreaData();
}, [limit, page, search, status]);


const [countries, setCountries] = useState([]);
const [states, setStates] = useState([]);
const [districts, setDistricts] = useState([]);
const [cities, setCities] = useState([]);


useEffect(() => {
  fetchCityAreaData();
  fetchCountries();
  fetchStates();
  fetchDistricts();
  fetchCities();
}, [limit, page, search, status]);


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


const fetchDistricts = async () => {
  try {
    const response = await DistrictModel.getDistricts(user_id, user_types);
    if (response?.data?.data) {
      setDistricts(response.data.data);
    } else {
      toast.error("Failed to load districts");
    }
  } catch (error) {
    console.error("Error fetching districts:", error);
    toast.error("Error fetching districts");
  }
};

const fetchCities = async () => {
  try {
    const response = await CityModel.getCities(user_id, user_types);
    if (response?.data?.data) {
      setCities(response.data.data);
    } else {
      toast.error("Failed to load cities");
    }
  } catch (error) {
    console.error("Error fetching cities:", error);
    toast.error("Error fetching cities");
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

const getDistrictName = (id) => {
  const district = districts.find((d) => d.id === id);
  return district ? district.name : "N/A";
};

const getCityName = (id) => {
  const city = cities.find((c) => c.id === id);
  return city ? city.name : "N/A";
};


const handleAddCityAreaChange = (e) => {
  const { name, value } = e.target;
  setAddCityAreaData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


const validateCityArea = () => {
  const newErrors = {};

  if (!addCityAreaData.code.trim()) {
    newErrors.code = "Please enter area code";
  }

  if (!addCityAreaData.name.trim()) {
    newErrors.name = "Please enter area name";
  }

  if (!addCityAreaData.country) {
    newErrors.country = "Please select a country";
  }

  if (!addCityAreaData.state) {
    newErrors.state = "Please select a state";
  }

  if (!addCityAreaData.district) {
    newErrors.district = "Please select a district";
  }

  if (!addCityAreaData.city) {
    newErrors.city = "Please select a city";
  }

  return newErrors;
};


const handleSubmitCityArea = async () => {
  const validationErrors = validateCityArea();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const payload = {
    code: addCityAreaData.code.trim(),
    name: addCityAreaData.name.trim(),
    country: addCityAreaData.country,
    state: addCityAreaData.state,
    district: addCityAreaData.district,
    city: addCityAreaData.city,
    status: Boolean(addCityAreaData.status),
  };

  console.log("City Area Payload being sent:", payload);

  try {
    const response = await CityAreaModel.createCityArea(payload);
    console.log("Create City Area response:", response);

    if (response.status === 201 || response.status === 200) {
      toast.success("City Area created successfully!");
      fetchCityAreaData(); // refresh table
      handleCloseModal();

      setAddCityAreaData({
        code: '',
        name: '',
        country: '',
        state: '',
        district: '',
        city: '',
        status: false,
      });

      setErrors({});
    }
  } catch (error) {
    console.error("Create City Area error:", error);
    console.log("Error response:", error.response?.data);
    toast.error("Failed to create city area!");

    handleCloseModal();

    if (error.response?.data?.errors) {
      setErrors((prev) => ({
        ...prev,
        ...error.response.data.errors,
      }));
    }
  }
};



const [editCityAreaErrors, setEditCityAreaErrors] = useState({});

const validateEditCityArea = () => {
  let valid = true;
  const errors = {};

  if (!editingCityArea?.country) {
    errors.country = 'Country is required';
    valid = false;
  }
  if (!editingCityArea?.city) {
    errors.city = 'City is required';
    valid = false;
  }

  if (!editingCityArea?.state) {
    errors.state = 'State is required';
    valid = false;
  }

  if (!editingCityArea?.district) {
    errors.district = 'District is required';
    valid = false;
  }

  if (!editingCityArea?.code?.trim()) {
    errors.code = 'Code is required';
    valid = false;
  }

  if (!editingCityArea?.name?.trim()) {
    errors.name = 'Name is required';
    valid = false;
  }

  setEditCityAreaErrors(errors);
  return valid;
};


const handleEditClickCityArea = (areaObj) => {
  if (!areaObj || typeof areaObj !== 'object' || !areaObj.id) {
    toast.error("Invalid city area selected.");
    return;
  }

  setEditingCityArea({
    id: areaObj.id,
    country: areaObj.country?.id || '',
    state: areaObj.state?.id || '',
    district: areaObj.district?.id || '',
    code: areaObj.code,
    name: areaObj.name,
    status: areaObj.status?.toString(),
  });

  setEditModal(true);
};


const handleEditCityAreaChange = (e) => {
  const { name, value } = e.target;

  setEditingCityArea((prev) => ({
    ...prev,
    [name]: name === 'status' ? (value === 'true') : value,
  }));
};

const handleEditSubmitCityArea = async () => {
  if (!editingCityArea?.id) {
    toast.error("Invalid city area selected for editing.");
    return;
  }

  if (!validateEditCityArea()) return;

  setIsSubmitting(true);

  const payload = {
    country: editingCityArea.country,
    state: editingCityArea.state,
    district: editingCityArea.district,
    code: editingCityArea.code.trim(),
    name: editingCityArea.name.trim(),
    status: editingCityArea.status === true || editingCityArea.status === 'true',
  };

  try {
    const response = await CityAreaModel.updateCityArea(editingCityArea.id, payload);

    if (response.status === 200) {
      fetchCityAreaData();
      toast.success('City area updated successfully!');
      setEditModal(false);
    }
  } catch (error) {
    console.error("Update city area error:", error);
    toast.error('Failed to update city area!');
    if (error.response?.data?.errors) {
      setEditCityAreaErrors((prev) => ({
        ...prev,
        ...error.response.data.errors,
      }));
    }
  } finally {
    setIsSubmitting(false);
  }
};


const handleDeleteCityArea = async (id) => {
  if (!id) return;

  try {
    await CityAreaModel.deleteCityArea(id);

    setCityAreaData((prevData) => prevData.filter((item) => item.id !== id));

    const modal = document.getElementById(`delete_modal_${id}`);
    if (modal && typeof modal.close === 'function') {
      modal.close();
    }

    toast.success('City area deleted successfully');
  } catch (error) {
    console.error("Error deleting city area:", error);
    toast.error('Failed to delete city area');
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
                  buttoncontent="+ New City Area"
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
                          <th  style={{ width: '130px' }}>DISTRICT</th>
                          <th  style={{ width: '130px' }}>CITY</th>
                          <th  style={{ width: '130px' }}>STATUS</th>
                          <th  style={{ width: '130px' }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                            <TableSkelton />
                        ) : cityAreaData.length === 0 ? (
                            <tr>
                            <td className="text-center py-4 text-gray-500 text-sm" colSpan="5">
                                No data available
                            </td>
                            </tr>
                        ) : (
                            cityAreaData.map((area, index) => (
                            <tr key={index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>
                                {index + 1}
                                </td>
                                <td className="py-4 border-b border-gray-200 text-xs">{area.code}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">{area.name}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">{getCountryName(area.country)}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">{getStateName(area.state)}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">{getDistrictName(area.district)}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">{getCityName(area.city)}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">
                                {area.status ? (
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
                                        setEditingCityArea(area); 
                                        setEditModal(true);
                                    }}
                                    />
                                    <DeleteButton
                                    buttonText="Delete City Area"
                                    modalId={`delete_modal_${area.id}`}
                                    onConfirmDelete={() => handleDeleteCityArea(area.id)}
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
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[650px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Create City Area                  </h3>
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
                                        value={addCityAreaData.code}
                                        onChange={handleAddCityAreaChange}
                                        
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
                                      value={addCityAreaData.name}
                                      onChange={handleAddCityAreaChange}
                                      
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
                                        value={addCityAreaData.country}
                                        onChange={handleAddCityAreaChange}
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
                                        value={addCityAreaData.state}
                                        onChange={handleAddCityAreaChange}
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
                                    <div className="w-full flex flex-col gap-2">
                                        <label className="text-xs font-bold text-[#344767]">
                                            District <span className="text-xs text-red-400">*</span>
                                        </label>
                                        <select
                                            name="district"
                                            value={addCityAreaData.district}
                                            onChange={handleAddCityAreaChange}
                                            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none border-gray-300"
                                            style={{ paddingLeft: '12px', fontSize: '11px' }}
                                        >
                                            <option value="">Select District</option>
                                            {districts.map((district) => (
                                            <option key={district.id} value={district.id}>
                                                {district.name}
                                            </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-red-400">{errors.district}</p>
                                    </div>


                                    <div className="w-full flex flex-col gap-2">
                                        <label className="text-xs font-bold text-[#344767]">
                                            City <span className="text-xs text-red-400">*</span>
                                        </label>
                                        <select
                                            name="city"
                                            value={addCityAreaData.city}
                                            onChange={handleAddCityAreaChange}
                                            className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none border-gray-300"
                                            style={{ paddingLeft: '12px', fontSize: '11px' }}
                                        >
                                            <option value="">Select City</option>
                                            {cities.map((city) => (
                                            <option key={city.id} value={city.id}>
                                                {city.name}
                                            </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-red-400">{errors.city}</p>
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
                                           
                                           onClick={handleSubmitCityArea}
                                          >
                                          Create
                                           </button>

                                          </div>
                                    </div>
                                 </div>
       )}
       
     {editModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                    <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[780px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
                    <h3 className="font-bold text-[22px] text-[#344767]">
                        Edit City Area
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
                            value={editingCityArea?.code || ''}
                            onChange={handleEditCityAreaChange}
                        />
                        {editCityAreaErrors.code && (
                            <p className="text-red-500 text-xs mt-1">{editCityAreaErrors.code}</p>
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
                            value={editingCityArea?.name || ''}
                            onChange={handleEditCityAreaChange}
                        />
                        {editCityAreaErrors.name && (
                            <p className="text-red-500 text-xs mt-1">{editCityAreaErrors.name}</p>
                        )}
                                    </div>

                            <div className="w-full flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#344767]">
                                Country <span className="text-xs text-red-400">*</span>
                            </label>
                            <select
                                name="country"
                                value={editingCityArea.country}
                                onChange={handleEditCityAreaChange}
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
                            <p className="text-xs text-red-400">{editCityAreaErrors.country}</p>
                            </div>

                            {/* State - Edit */}
                            <div className="w-full flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#344767]">
                                State <span className="text-xs text-red-400">*</span>
                            </label>
                            <select
                                name="state"
                                value={editingCityArea.state}
                                onChange={handleEditCityAreaChange}
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
                            <p className="text-xs text-red-400">{editCityAreaErrors.state}</p>
                            </div>

                            <div className="w-full flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#344767]">
                                District <span className="text-xs text-red-400">*</span>
                            </label>
                            <select
                                name="state"
                                value={editingCityArea.district}
                                onChange={handleEditCityAreaChange}
                                className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none border-gray-300"
                                style={{ paddingLeft: '12px', fontSize: '11px' }}
                            >
                                <option value="">Select State</option>
                                {districts.map((district) => (
                                <option key={district.id} value={district.id}>
                                    {district.name}
                                </option>
                                ))}
                            </select>
                            <p className="text-xs text-red-400">{editCityAreaErrors.district}</p>
                            </div>

                            <div className="w-full flex flex-col gap-2">
                            <label className="text-xs font-bold text-[#344767]">
                                City <span className="text-xs text-red-400">*</span>
                            </label>
                            <select
                                name="state"
                                value={editingCityArea.city}
                                onChange={handleEditCityAreaChange}
                                className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none border-gray-300"
                                style={{ paddingLeft: '12px', fontSize: '11px' }}
                            >
                                <option value="">Select State</option>
                                {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                                ))}
                            </select>
                            <p className="text-xs text-red-400">{editCityAreaErrors.city}</p>
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
                            value={editingCityArea?.status ? 'Active' : 'InActive'}
                            onChange={(e) => {
                            setEditingCityArea({
                                ...editingCityArea, 
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
                        onClick={handleCloseModal}
                        >
                        Cancel
                        </button>
                        <button
                        type="button"
                        className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                        style={{ backgroundColor: '#5E72E4' }}
                        onClick={handleEditSubmitCityArea}
                        disabled={isSubmitting}
                        >
                        {isSubmitting ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                    </div>
  </div>
)}
       
                          
                     </>
                     
                    )
}

export default City_Area