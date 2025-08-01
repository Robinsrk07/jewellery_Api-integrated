import { useEffect, useState,useRef } from "react";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import CityModel from "../../../models/CityModel";
import CountryModel from "../../../models/countryModel";
import { useSelector } from "react-redux";
import TableSkelton from "../../../components/tableSkelton";
import { toast } from 'react-toastify';






const City =()=>{
   
  const [cityData, setCityData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [addCityData, setAddCityData] = useState({
    code: '',
    name: '',
    country: '',
  });

  const [errors, setErrors] = useState({
    code: '',
    name: '',
    country: '',
  });

const codeRef = useRef(null)
const nameRef = useRef(null)
const countryRef = useRef(null)

const refFeilds = {
  code: codeRef,
  name: nameRef,
  country: countryRef,
};

const codeEditRef = useRef(null)
const nameEditRef = useRef(null)
const countryEditRef = useRef(null)

const refEditFeilds = {
  code: codeEditRef,
  name: nameEditRef,
  country: countryEditRef,
};



  const auth = useSelector((state) => state.auth);
  const { login_id, can_manage_user_types } = auth;
  const user_id = login_id;
  const user_types = Object.keys(can_manage_user_types).join(',');

  const fetchCityData = async () => {
    setIsLoading(true);
    try {
      const response = await CityModel.getCities(
        user_id,
        user_types,
        limit,
        page,
        search,
        status
      );

      if (response?.data?.data) {
        setCityData(response.data.data);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
      toast.error('Failed to fetch cities.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCityData();
  }, [limit, page, search, status]);



  const [countries, setCountries] = useState([]);

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


  const getCountryName = (id) => {
  const country = countries.find((c) => c.id === id);
  return country ? country.name : "N/A";
};
  




const handleAddCityChange = (e) => {
  const { name, value } = e.target;
  setAddCityData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prev)=>({
    ...prev,
    [name]:''
  }))
};

const validateCity = () => {
  const newErrors = {};

  if (!addCityData.code.trim()) {
    newErrors.code = "Please enter city code";
  }

  if (!addCityData.name.trim()) {
    newErrors.name = "Please enter city name";
  }

  if (!addCityData.country) {
    newErrors.country = "Please select a country";
  }

  return newErrors;
};


const handleSubmitCity = async () => {
  const validationErrors = validateCity();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
     const firstErrorKey = Object.keys(validationErrors)[0];
if (refFeilds[firstErrorKey]?.current) {
  refFeilds[firstErrorKey].current.scrollIntoView({ behavior: "smooth", block: "center" });
  refFeilds[firstErrorKey].current.focus();
}

    return;
  }

 const payload = {
  code: addCityData.code.trim(),
  name: addCityData.name.trim(),
  country: addCityData.country,   
};


 

  try {
    const response = await CityModel.CreateCity(payload);
 

    if (response.status === 201 || response.status === 200) {
      toast.success("City created successfully!");
      fetchCityData();
      handleCloseModal();

      setAddCityData({
        code: '',
        name: '',
        status: false,
      });

      setErrors({});
    }
  } catch (error) {
    console.log(error)
  const message =
    error?.response?.data?.errors?.code?.[0] ||
    error?.response?.data?.errors?.name?.[0] ||
    error?.response?.data?.errors ||
    "Failed to create city!";

  toast.error(message);
}
};


const [editCityErrors, setEditCityErrors] = useState({});


const validateEditCity = () => {
  const errors = {};

  if (!editingCity?.code?.trim()) {
    errors.code = 'City code is required';
  } else if (!/^[A-Za-z0-9]{2,5}$/.test(editingCity.code.trim())) {
    errors.code = 'Code must be 2–5 letters or numbers';
  }

  if (!editingCity?.name?.trim()) {
    errors.name = 'City name is required';
  } else if (editingCity.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!editingCity?.country) {
    errors.country = 'Country selection is required';
  }

  return errors; 
};



// const handleEditClickCity = (cityObj) => {
//   if (!cityObj || typeof cityObj !== 'object' || !cityObj.id) {
//     console.warn("Invalid city object passed:", cityObj);
//     toast.error("Invalid city selected.");
//     return;
//   }

//   console.log("Editing City:", cityObj);

//   setEditingCity({
//     id: cityObj.id,
//     code: cityObj.code,
//     name: cityObj.name,
//     country: cityObj.country,
//     status: cityObj.status?.toString(),
//   });

//   setEditModal(true);
// };


const handleEditCityChange = (e) => {
  const { name, value } = e.target;

  setEditingCity((prev) => ({
    ...prev,
    [name]: name === 'status' ? (value === 'true') : value,
  }));

  setEditCityErrors((prev) => ({
    ...prev,
    [name]: ''
  }));
};



const handleEditSubmitCity = async () => {
  if (!editingCity?.id) {
    toast.error("Invalid city selected for editing.");
    return;
  }
  const validationErrors = validateEditCity()
  if (Object.keys(validationErrors).length > 0) {
    setEditCityErrors(validationErrors);
     const firstErrorKey = Object.keys(validationErrors)[0];
 if (refEditFeilds[firstErrorKey]?.current) {
  refEditFeilds[firstErrorKey].current.scrollIntoView({ behavior: "smooth", block: "center" });
  refEditFeilds[firstErrorKey].current.focus();
 }

    return;
  }

  setIsSubmitting(true);

  const payload = {
    code: editingCity.code.trim(),
    name: editingCity.name.trim(),
    country: editingCity.country,
    status: editingCity.status === true || editingCity.status === 'true',
  };

  try {
    const response = await CityModel.EditCity(editingCity.id, payload);

    if (response.status === 200) {
      fetchCityData();
      toast.success('City updated successfully!');
      setEditModal(false);
    }
  } catch (error) {
    console.log(error)
  const message =
    error?.response?.data?.errors?.code?.[0] ||
    error?.response?.data?.errors?.name?.[0] ||
    error?.response?.data?.errors ||
    "Failed to Update city!";

  toast.error(message);
}
 finally {
    setIsSubmitting(false);
  }
};


const handleEditCloseCityModal = () => {
  setEditModal(false);
  setEditingCity(null);
  setEditCityErrors({
    code: '',
    name: '',
    country: '',
    status: '',
  });
};


           
const handleDeleteCity = async (id) => {
  if (!id) return;

  try {
    await CityModel.DeleteCity(id); 

    const modal = document.getElementById(`delete_modal_${id}`);
    if (modal && typeof modal.close === 'function') {
      modal.close();
    }

    toast.success('City deleted successfully');
    fetchCityData(); 
  } catch (error) {
    console.error("Error deleting City:", error);
    toast.error('Failed to delete City');
  }
};



    const handleCloseModal = () => {
  setErrors({
    code: '',
    name: '',
    country: '',
    status: ''
  });

  setAddCityData({
    code: '',
    name: '',
    country: ''
  });

  setModal(false);
  setEditModal(false);
};


    useEffect(() => {
  fetchCityData();
  fetchCountries();

}, [limit, page, search, status]);

 const firstErrorKey = Object.keys(errors)[0];
 const firstEditErrorkey = Object.keys(editCityErrors)[0]             
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
                  buttoncontent="+ New City"
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
                          <th  style={{ width: '130px' }}>STATUS</th>
                          <th  style={{ width: '130px' }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                            <TableSkelton />
                        ) : cityData.length === 0 ? (
                            <tr>
                            <td className="text-center py-4 text-gray-500 text-sm" colSpan="5">
                                No data available
                            </td>
                            </tr>
                        ) : (
                            cityData.map((city, index) => (
                            <tr key={index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>
                                {index + 1}
                                </td>
                                <td className="py-4 border-b border-gray-200 text-xs">{city.code}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">{city.name}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">{getCountryName(city.country)}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">
                                {city.status ? (
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
                                        setEditingCity(city); 
                                        setEditModal(true);
                                    }}
                                    />
                                    <DeleteButton
                                    buttonText="Delete City"
                                    modalId={`delete_modal_${city.id}`}
                                    onConfirmDelete={() => handleDeleteCity(city.id)}
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
                           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[400px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Create City                   </h3>
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
                                         ref={codeRef}
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                        style={{ paddingLeft: '12px' }}
                                        name="code"
                                        value={addCityData.code}
                                        onChange={handleAddCityChange}
                                        
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
                                      ref={nameRef}
                                      placeholder="Type here"
                                      className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                      style={{ paddingLeft: '12px' }}
                                      name="name"
                                      value={addCityData.name}
                                      onChange={handleAddCityChange}
                                      
                                    />
                                    
                                    {errors.name && (
                                              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                            )}
                                    
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                    <label className="text-xs font-bold text-[#344767]">
                                        Country <span className="text-xs text-red-400">*</span>
                                    </label>
                                    <select
                                        name="country"
                                        value={addCityData.country}
                                         ref={countryRef}
                                        onChange={handleAddCityChange}
                                      className={`select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none ${
                                          firstErrorKey === 'country' ? 'border-blue-500' : 'border-gray-300'
                                        }`}
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
                                           
                                           onClick={handleSubmitCity}
                                          >
                                          Create
                                           </button>

                                          </div>
                                    </div>
                                 </div>
       )}
       
     {editModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
    <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[500px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
      <h3 className="font-bold text-[22px] text-[#344767]">
        Edit City
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
              ref={codeEditRef}
            name="code"
            placeholder="Type here"
            className="input w-[100%] bg-white text-xs text-gray-500 rounded-lg border border-gray-300 focus:outline-none  focus:border-b-2 focus:border-blue-500"
            style={{paddingLeft:'12px'}}
            value={editingCity?.code || ''}
            onChange={handleEditCityChange}
          />
          {editCityErrors.code && (
            <p className="text-red-500 text-xs mt-1">{editCityErrors.code}</p>
          )}
        </div>

        {/* Name Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[80%]">
            Name: <span className="text-xs text-red-400">*</span>
          </label>
          <input
            type="text"
            ref={nameEditRef}
            placeholder="Type here"
            name="name"
            className="input w-[100%] bg-white text-xs text-gray-500 rounded-lg border border-gray-300 focus:outline-none  focus:border-b-2 focus:border-blue-500"
            style={{paddingLeft:'12px'}}
            value={editingCity?.name || ''}
            onChange={handleEditCityChange}
          />
          {editCityErrors.name && (
            <p className="text-red-500 text-xs mt-1">{editCityErrors.name}</p>
          )}
        </div>

        <div className="w-full flex flex-col gap-2">
                                    <label className="text-xs font-bold text-[#344767]">
                                        Country <span className="text-xs text-red-400">*</span>
                                    </label>
                                    <select
                                        name="country"
                                        value={editingCity.country}
                                        ref={countryEditRef}
                                        onChange={handleEditCityChange}
                                       className={`select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none ${
                                          firstEditErrorkey === 'country' ? 'border-blue-500' : 'border-gray-300'
                                        }`}
                                        style={{ paddingLeft: '12px', fontSize: '11px' }}
                                      >
                                        <option value="">Select Country</option>
                                        {countries.map((country) => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-red-400">{editCityErrors.country}</p>
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
            value={editingCity?.status ? 'Active' : 'InActive'}
            onChange={(e) => {
              setEditingCity({
                ...editingCity, 
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
          onClick={handleEditCloseCityModal}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
          style={{ backgroundColor: '#5E72E4' }}
          onClick={handleEditSubmitCity}
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

export default City