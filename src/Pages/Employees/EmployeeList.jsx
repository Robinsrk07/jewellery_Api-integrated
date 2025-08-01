 import { X } from 'lucide-react';
 
     import { useEffect, useRef, useState } from "react";
     import CustomScrollbar from "../../components/CustomScrollbar";
      import EditButton from '../../components/EditButton';
      import DeleteButton from '../../components/DeleteButton';
      import CreateButton from '../../components/CreateButton';
      import Pagination from '../../components/Pagination';
      import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
      import countryModel from '../../models/countryModel'
      import CityModel from "../../models/CityModel"
      import employeePositionModel from "../../models/employeePositionModel";
      import CurrencyModel from "../../models/CurrencyModel";
      import StateModel from "../../models/stateModel";
      import DistrictModel from '../../models/districtModel'
      import CityAreaModel from "../../models/cityAreaModel";
      import BranchModel from "../../models/branchModel";
       import { useSelector } from "react-redux";
       import employeeDepartmentModel from "../../models/employeeDepartmentModel";
       import employeeGenderModel from "../../models/employeeGenderModel";
      import employeeModel from "../../models/employeeModel";
     import { toast } from "react-toastify";
     import TableSkelton from "../../components/tableSkelton";
import React from "react";
 
// issue is that files are not approved 

     const  EmployeeList = () => {

              const [isLoading, setIsLoading] = useState(true);
                  const [modal, setModal] = useState(false)   
                  const [editModal,setEditModal]= useState(false)
                  const [countries, setCountries] = useState([]);
                  const [states, setStates] = useState([]);
                  const [districts, setDistricts] = useState([]);
                  const [gender, setGender] = useState([]);
                  const [cities, setCities] = useState([]);
                  const [cityAreas, setCityAreas] = useState([]);
                  const [positions, setPositions] = useState([]);
                  const [branches, setBranchesList] = useState([]);
                  const [currencies, setCurrencies] = useState([]);
                  const [departments, setDepartments] = useState([]);
                  const [employees, setEmployees] = useState([])
                   const [totalPages, setTotalPages] = useState(1);
                  const [limit, setLimit] = useState(10);
                  const [page, setPage] = useState(1);
                  const [deletingId, setDeletingId] = useState(null);
                  const [itemToDelete, setItemToDelete] = useState(null);
                  const [status, setStatus] = useState('');
                  const [search, setSearch] = useState('');
                  const [formErrors, setFormErrors] = useState([]);
                   
                  const auth = useSelector((state) => state.auth || {});
                  const { login_id ,can_manage_user_types,} = auth;    
                  const user_id = login_id 
                  const user_types = Object.keys(can_manage_user_types).join(',');
                  const [editEmployee,setEditEmployee] = useState({})
                  const [employeeForm, setEmployeeForm] = useState({
                    name: "",
                    gender: "",
                    date_of_birth: "",
                    marital_status: "",
                    profile_picture: null,
                    email: "",
                    phone_number: "",
                    country: "",
                    state: "",
                    district: "",
                    city: "",
                    city_area: "",
                    pincode: "",
                    address: "",
                    department: "",
                    position: "",
                    joining_date: "",
                    resignation_date: "",
                    branch: "",
                    currency: "",
                    salary: "",
                    bank_account: "",
                    pan_number: "",
                    aadhaar_number: "",
                    document: null,
                    other_document: null,
                    extra_document: null,
                    emergency_contact_name: "",
                    emergency_contact_number: "",
                    blood_group: "",
                    education: "",
                    work_experience: "",
                    default_language: "",
                    time_zone: "",
                    is_probation: "",
                    is_branch: "",
                    group_id: 1,
                    probation_end_date: "",
                    status: "",
                  });

                  const allFields = Object.keys(employeeForm);

                  const fieldRefs = useRef(
                     allFields.reduce((acc, field) => {
                       acc[field] = React.createRef();
                       return acc;
                     }, {})
                  );

                 

                  const handleInputChange = (e) => {
                    const { name, value, type, files } = e.target;
                      setEmployeeForm((prev) => ({
                      ...prev,
                      [name]: type === "file" ? files[0] : value,
                      }));

                      setFormErrors((prevErrors) => {
                      const newErrors = { ...prevErrors };
                      delete newErrors[name];
                      return newErrors;
                      });

                  };
                  
                  const handleEditInputChange = (e) => {
                    const { name, value, type, files } = e.target;
                    setEditEmployee((prev) => ({
                      ...prev,
                      [name]: type === "file" ? files[0] : value,
                    }));
                  };


                 

                const buildFormData = (formObj) => {
                    const formData = new FormData();

                    Object.entries(formObj).forEach(([key, value]) => {
                      if (value === null || value === undefined || value === '') return;

                      if (value instanceof File) {
                        formData.append(key, value);
                      } else {
                        formData.append(key, value);
                      }
                    });

                    return formData;
                  };


                 const getValueFromId = (id, field, key = 'name') => {
                  if (!Array.isArray(field)) return '—'; // Ensure it's a valid array
                  const item = field.find((entry) => entry?.id === id);
                  return item?.[key] || '—'; // Safe access
                };

                const fetchEmployees = async ()=>{
                      try{
                          const res = await  employeeModel.getEmployees(user_id, user_types, limit, page, search, status)
                          setEmployees(res?.data?.data)
                          setTotalPages(res.data.pagination.pages);
                      }catch(error){ 
                        console.error("Error loading employees:", error);
                      }finally{
                        setIsLoading(false)
                      }
                    }


                  
                       const handleSubmit = async (e) => {
                          e.preventDefault();
                           const validationErrors = validateForm(employeeForm);
                          if (Object.keys(validationErrors).length > 0) {
                           setFormErrors(validationErrors);
                              
                           const firstInvalidField = Object.keys(validationErrors)[0];
                        
                           const ref = fieldRefs.current[firstInvalidField];
                            if (ref?.current) {
                              ref.current.focus();
                              ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
                            }

                      return;
                    }


                          try {
                            const formData = buildFormData(employeeForm);

                            const response = await employeeModel.createEmployee(formData);
                              
                            if (response?.status === 201 || response?.status === 200) {
                              toast.success("Employee created successfully!");
                                fetchEmployees()
                              // Optional: Reset form or close modal
                              setEmployeeForm({
                                  name: "",
                                  gender: "",
                                  date_of_birth: "",
                                  marital_status: "",
                                  profile_picture: null,
                                  email: "",
                                  phone_number: "",
                                  country: "",
                                  state: "",
                                  district: "",
                                  city: "",
                                  city_area: "",
                                  pincode: "",
                                  address: "",
                                  department: "",
                                  position: "",
                                  joining_date: "",
                                  resignation_date: "",
                                  branch: "",
                                  currency: "",
                                  salary: "",
                                  bank_account: "",
                                  pan_number: "",
                                  aadhaar_number: "",
                                  document: null,
                                  other_document: null,
                                  extra_document: null,
                                  emergency_contact_name: "",
                                  emergency_contact_number: "",
                                  blood_group: "",
                                  education: "",
                                  work_experience: "",
                                  default_language: "",
                                  time_zone: "",
                                  is_probation: "",
                                  is_branch: "",
                                  group_id: 1,
                                  probation_end_date: "",
                                  status: "",
                                });
                              setModal(false);
                            } else {
                              toast.error("Unexpected response from server.");
                            }

                          }catch (error) {
                            console.error("Failed to create employee:", error);

                            if (
                              error.response &&
                              error.response.status === 400 &&
                              typeof error.response.data === "object"
                            ) {
                              const backendErrors = error.response.data;

                              // Show each error as a toast
                              Object.entries(backendErrors).forEach(([field, messages]) => {
                                const msgArray = Array.isArray(messages) ? messages : [messages];
                                msgArray.forEach((msg) => {
                                  toast.error(`${field.replaceAll("_", " ")}: ${msg}`);
                                });
                              });
                            } else {
                              toast.error("Something went wrong while submitting.");
                            }
                          }

                        };

                        const handleEditSubmit = async (e)=>{
                          e.preventDefault();

                          try{
                             const formData = buildFormData(editEmployee);
                               const response = await employeeModel.updateEmployee(editEmployee.id,formData);
                          }catch(error){
                                console.log(error)
                          }
                        }


                        const handleDeleteEmployee = async (uuid) => {
                            if (!uuid) return toast.error("Sorry We Are Unable to Delete Item");
                            try {
                                setDeletingId(uuid);
                                await employeeModel.deleteEmployee(uuid);
                                await fetchEmployees()
                                toast.success("Diamond Item Deleted Successfully");
                            } catch {
                                toast.error("Sorry, Unable to delete Diamond Item");
                            } finally {
                                setDeletingId(null);
                            }
                        };


                    const handleCloseModal =()=>{
                      setEmployeeForm({
                                  name: "",
                                  gender: "",
                                  date_of_birth: "",
                                  marital_status: "",
                                  profile_picture: null,
                                  email: "",
                                  phone_number: "",
                                  country: "",
                                  state: "",
                                  district: "",
                                  city: "",
                                  city_area: "",
                                  pincode: "",
                                  address: "",
                                  department: "",
                                  position: "",
                                  joining_date: "",
                                  resignation_date: "",
                                  branch: "",
                                  currency: "",
                                  salary: "",
                                  bank_account: "",
                                  pan_number: "",
                                  aadhaar_number: "",
                                  document: null,
                                  other_document: null,
                                  extra_document: null,
                                  emergency_contact_name: "",
                                  emergency_contact_number: "",
                                  blood_group: "",
                                  education: "",
                                  work_experience: "",
                                  default_language: "",
                                  time_zone: "",
                                  is_probation: "",
                                  is_branch: "",
                                  group_id: 1,
                                  probation_end_date: "",
                                  status: "",
                                })

                     setModal(false)
                     setFormErrors({})
                    }

                     const handleEdit = (emp) => {
                      // console.log(emp)
                      setEditModal(true)
                      setEditEmployee({
                      name: emp.name || "",
                      gender: emp.gender || "",
                      date_of_birth: emp.date_of_birth || "",
                      marital_status: emp.marital_status || "",
                      profile_picture: emp.profile_picture || null,
                      email: emp.email || "",
                      phone_number: emp.phone_number || "",
                      country: emp.country || "",
                      state: emp.state || "",
                      district: emp.district || "",
                      city: emp.city || "",
                      city_area: emp.city_area || "",
                      pincode: emp.pincode || "",
                      address: emp.address || "",
                      department: emp.department || "",
                      position: emp.position || "",
                      joining_date: emp.joining_date || "",
                      resignation_date: emp.resignation_date || "",
                      branch: emp.branch || "",
                      currency: emp.currency || "",
                      salary: emp.salary || "",
                      bank_account: emp.bank_account || "",
                      pan_number: emp.pan_number || "",
                      aadhaar_number: emp.aadhaar_number || "",
                      document: emp.document || null,
                      other_document: emp.other_document || null,
                      extra_document: emp.extra_document || null,
                      emergency_contact_name: emp.emergency_contact_name || "",
                      emergency_contact_number: emp.emergency_contact_number || "",
                      blood_group: emp.blood_group || "",
                      education: emp.education || "",
                      work_experience: emp.work_experience || "",
                      default_language: emp.default_language || "",
                      time_zone: emp.time_zone || "",
                      is_branch: emp.is_branch === true ? "True" : emp.is_branch === false ? "False" : "",
                      is_probation: emp.is_probation === true ? "True" : emp.is_probation === false ? "False" : "",
                      group_id: emp.group_id ?? 1,  
                      probation_end_date: emp.probation_end_date || "",
                      status: emp.status === true ? "True" : emp.status === false ? "False" : "",
                    });

                     }


   const validateForm = (form) => {
    const errors = {};

  // Required fields
  const requiredFields = [
    "name",
    "gender",
    "email",
    "phone_number",
    "country",
    "state",
    "department",
    "position",
    "is_branch",
    "group_id"
  ];

  requiredFields.forEach((field) => {
    if (!form[field] || form[field].toString().trim() === "") {
      errors[field] = `${field.replaceAll("_", " ")} is required`;
    }
  });

  // Format validations only if fields are filled
  if (form.name && !/^[a-zA-Z\s]{2,50}$/.test(form.name)) {
    errors.name = "Name should be 2–50 letters only";
  }

  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Email is invalid";
  }

  if (form.phone_number && !/^\d{10}$/.test(form.phone_number)) {
    errors.phone_number = "Phone number must be 10 digits";
  }

  if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
    errors.pincode = "Pincode must be 6 digits";
  }

  if (form.bank_account && !/^\d{9,18}$/.test(form.bank_account)) {
    errors.bank_account = "Bank account must be 9–18 digits";
  }

  if (form.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(form.pan_number)) {
    errors.pan_number = "PAN number format is invalid";
  }

  if (form.aadhaar_number && !/^\d{12}$/.test(form.aadhaar_number)) {
    errors.aadhaar_number = "Aadhaar number must be 12 digits";
  }

  if (form.emergency_contact_name && !/^[a-zA-Z\s]{2,50}$/.test(form.emergency_contact_name)) {
    errors.emergency_contact_name = "Emergency contact name must be letters only";
  }

  if (form.emergency_contact_number && !/^\d{10}$/.test(form.emergency_contact_number)) {
    errors.emergency_contact_number = "Emergency contact number must be 10 digits";
  }

  return errors;
};




                  useEffect(()=>{
                    
                    fetchEmployees()
                  },[])
                
               
                    useEffect(() => {
                        const fetchCountries = async () => {
                          try {
                            const res = await countryModel.getCountries(user_id, user_types, limit, page, search, status);
                            setCountries(res?.data?.data || res?.data || []);
                          } catch (err) {
                            console.error("Error loading countries:", err);
                          }
                        };
                        fetchCountries();
                       }, []);

                    useEffect(() => {
                      const fetchStates = async () => {
                        try {
                          const res = await StateModel.getStates(user_id, user_types, limit, page, search, status);
                          setStates(res?.data?.data || res?.data || []);
                        } catch (err) {
                          console.error("Error loading states:", err);
                        }
                      };
                      fetchStates();
                    }, []);

                    useEffect(() => {
                      const fetchDistricts = async () => {
                        try {
                          const res = await DistrictModel.getDistricts(user_id, user_types, limit, page, search, status);
                          setDistricts(res?.data?.data || res?.data || []);
                        } catch (err) {
                          console.error("Error loading districts:", err);
                        }
                      };
                      fetchDistricts();
                    }, []);
                    useEffect(() => {
                      const fetchGender = async () => {
                        try {
                          const res = await employeeGenderModel.getGenders(user_id, user_types, limit, page, search, status);
                          setGender(res?.data?.data || res?.data || []);
                        } catch (err) {
                          console.error("Error loading districts:", err);
                        }
                      };
                      fetchGender();
                    }, []);

                    useEffect(() => {
                      const fetchCities = async () => {
                        try {
                          const res = await CityModel.getCities(user_id, user_types, limit, page, search, status);
                          setCities(res?.data?.data || res?.data || []);
                        } catch (err) {
                          console.error("Error loading cities:", err);
                        }
                      };
                      fetchCities();
                    }, []);

                    useEffect(() => {
                      const fetchCityAreas = async () => {
                        try {
                          const res = await CityAreaModel.getCityAreas(user_id, user_types, limit, page, search, status);
                          setCityAreas(res?.data?.data || res?.data || []);
                        } catch (err) {
                          console.error("Error loading city areas:", err);
                        }
                      };
                      fetchCityAreas();
                    }, []);

                    useEffect(() => {
                      const fetchPositions = async () => {
                        try {
                          const res = await employeePositionModel.getPositions(user_id, user_types, limit, page, search, status);
                          setPositions(res?.data?.data || res?.data || []);
                        } catch (err) {
                          console.error("Error loading positions:", err);
                        }
                      };
                      fetchPositions();
                    }, []);

                    useEffect(() => {
                      const fetchBranches = async () => {
                        try {
                          const res = await BranchModel.getBranches(user_id, user_types, limit, page, search, status);
                          setBranchesList(res?.data?.data || res?.data || []);
                        } catch (err) {
                          console.error("Error loading branches:", err);
                        }
                      };
                      fetchBranches();
                    }, []);

                    useEffect(() => {
                      const fetchCurrencies = async () => {
                        try {
                          const res = await CurrencyModel.getCurrency(user_id, user_types, limit, page, search, status);
                          setCurrencies(res?.data?.data || res?.data || []);
                        } catch (err) {
                          console.error("Error loading currencies:", err);
                        }
                      };
                      fetchCurrencies();
                    }, []);

                    useEffect(() => {
                      const fetchDepartments = async () => {
                        try {
                          const res = await employeeDepartmentModel.getDepartments(user_id, user_types, limit, page, search, status);
                          setDepartments(res?.data?.data || res?.data || []);
                        } catch (err) {
                          console.error("Error loading departments:", err);
                        }
                      };
                      fetchDepartments();
                    }, []);

     
                    // useEffect(() => {
                    //   console.log("Updated Countries:", countries);
                    // }, [countries]);

                    // useEffect(() => {
                    //   console.log("Updated States:", states);
                    // }, [states]);


                 
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
                      <div
                        className="bg-white w-full max-w-[99vw] xl:max-w-[90vw] 2xl:max-w-[95vw] h-auto max-h-[70vh] rounded-xl px-4 md:px-8 lg:px-12 mx-auto overflow-auto  custom-scrollbar"
                        style={{ fontFamily: 'Open Sans', overflow: 'auto' }}
                      >
                        <CreateButton buttoncontent="+ New Employee" onClick={() => setModal(true)} />
                       <ItemsPerPageSelector items={limit} setItems={setLimit} />
                        <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1220px]" style={{ borderSpacing: '0 12px', borderCollapse: 'separate' }}>
                          <thead className="text-xs text-[#AFB9C9] uppercase bg-white">
                            <tr>
                              <th className="px-6 py-3" style={{ width: '90px', paddingLeft: '20px' }}>SL NO</th>
                              <th className="px-6 py-3" style={{ width: '100px' }}>NAME </th>
                              <th className="px-6 py-3" style={{ width: '100px' }}>GENDER </th>
                              <th className="px-6 py-3" style={{ width: '90px' }}>DEPARTMENT</th>
                              <th className="px-6 py-3" style={{ width: '90px' }}>POSITION</th>
                              <th className="px-6 py-3" style={{ width: '90px' }}>SALARY</th>
                              <th className="px-6 py-3" style={{ width: '100px' }}>BANK ACCOUNT</th>
                              <th className="px-6 py-3" style={{ width: '100px' }}>STATUS</th>
                              <th className="px-6 py-3" style={{ width: '90px' }}>ACTION</th>
                            </tr>
                          </thead>
                         <tbody>
                            {isLoading ? (
                          <TableSkelton />
                        ) : employees.length === 0 ? (
                          <tr >
                            <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
                              No data available
                            </td>
                          </tr>
                        ) : employees.map((emp, index) => (
                                                      <tr
                                key={emp.id}
                                className="bg-white hover:bg-gray-50 h-[44px] text-gray-400"
                              >
                                <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>
                                  {index + 1}
                                </td>
                                <td className="px-6 py-5 border-b border-gray-200 text-xs">{emp.name || '-'}</td>
                                <td className="px-6 py-5 border-b border-gray-200 text-xs">                                
                                  {getValueFromId(emp.gender,gender)}
                                </td>
                                <td className="px-6 py-5 border-b border-gray-200 text-xs">
                                  {getValueFromId(emp.department,departments)}
                                </td>
                                
                                <td className="px-6 py-5 border-b border-gray-200 text-xs">{getValueFromId(emp.position, positions)}</td>
                                <td className="px-6 py-5 border-b border-gray-200 text-xs">{emp.salary || '-'}</td>
                                <td className="px-6 py-5 border-b border-gray-200 text-xs">{emp.bank_account || '-'}</td>
                                <td className="px-6 py-5 border-b border-gray-200 text-xs">
                                  <span
                                    className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                                      emp.status ? 'bg-green-300 text-green-700' : 'bg-gray-200 text-gray-400'
                                    }`}
                                  >
                                    {emp.status ? 'ACTIVE' : 'INACTIVE'}
                                  </span>
                                </td>
                                <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                                  <div className="flex gap-2 items-center">
                                    <EditButton onClick={() => handleEdit(emp)} />
                                    <DeleteButton 
                                      buttonText={deletingId === emp.uuid ? 'Deleting...' : 'Delete'}
                                      item="Employee"
                                      onOpenModal={() => setItemToDelete(emp.uuid)}
                                      onConfirmDelete={() => handleDeleteEmployee(itemToDelete)}
                                      disabled={deletingId === emp.uuid}
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>

                        </table>
                        {/* Pagination */}
                         <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                        
                      
                      </div>
                      {/* CREATE MODAL */}
                      {modal && (
                        <div className="fixed text-gray-400 inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[700px] h-[95vh] max-h-[90vh] flex flex-col overflow-y-auto gap-3 p-6" style={{ padding: '20px' }}>
                           
                            <div className='flex justify-between'>
                                  <h3 className="font-bold text-[22px] text-[#344767]">Create Employee</h3> 
                                 <button onClick={handleCloseModal}>
                                <X className="w-6 h-6 text-[#344767] cursor-pointer" />
                                  </button>
                            
                                </div>
                            <hr className="my-4 border-gray-300" />
                            {/* BASIC INFO */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-[#5E72E4] mb-2 text-[16px]">Basic Info</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs text-gray-600" > Name:<span className="text-red-500 text-[14px]">*</span></label>
                                  <input type="text" 
                                  style={{ paddingLeft: '12px' }}
                                   ref={fieldRefs.current.name}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  name="name"
                                  value={employeeForm.name}
                                  onChange={handleInputChange}
                                  placeholder="Full Name" />
                                  <p className="text-xs text-red-400">{formErrors.name}</p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-600" >Gender:<span className="text-red-500 text-[14px]">*</span></label>
                                  <select style={{ paddingLeft: '12px' }}
                                   className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                   name="gender"
                                    ref={fieldRefs.current.gender}
                                   value={employeeForm.gender}
                                   onChange={handleInputChange}
                                   > 
                                          
                                   <option value="">--Select Gender--</option>

                                       {gender.map((country) => (
                                      <option key={country.id} value={country.id}>
                                        {country.name}
                                      </option>
                                    ))}
                                   
                                  </select>
                                  <p className="text-xs text-red-400">{formErrors.gender}</p>   
                                </div>
                                <div>
                                  <label className="text-xs text-gray-600" >Date of Birth:</label>
                                  <input type="date" style={{ paddingLeft: '12px' }} value={employeeForm.date_of_birth}
                                  onChange={handleInputChange} className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500" name="date_of_birth" />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-600" >Marital Status:</label>
                                  <select style={{ paddingLeft: '12px' }} value={employeeForm.marital_status} onChange={handleInputChange} className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500" name="marital_status">
                                    <option value="">Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                  </select>
                                </div>
                                <div>
                                      <label className="text-xs text-gray-600" >
                                        Profile Picture:
                                      </label>
                                      <input
                                        type="file"
                                        name="profile_picture"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                        style={{ padding: '12px' }}
                                        className="input bg-white border border-gray-200 w-full text-xs"
                                      />
                                    </div>

                              </div>
                            </div>
                            {/* CONTACT INFO */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-[#5E72E4] mb-2 text-[16px]">Contact Info</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                <label className="text-xs text-gray-600" >
                                  Email:<span className="text-red-500 text-[14px]">*</span>
                                </label>
                                <input
                                  type="email"
                                  name="email"
                                   ref={fieldRefs.current.email}
                                  placeholder="Email"
                                  value={employeeForm.email}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                                <p className="text-xs text-red-400">{formErrors.email}</p>   
                              </div>

                               <div>
                                    <label className="text-xs text-gray-600" >
                                      Phone Number:<span className="text-red-500 text-[14px]">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="phone_number"
                                      placeholder="Phone Number"
                                        ref={fieldRefs.current.phone_number}
                                      value={employeeForm.phone_number}
                                      onChange={handleInputChange}
                                      style={{ paddingLeft: '12px' }}
                                      className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                    />
                                    <p className="text-xs text-red-400">{formErrors.phone_number}</p>   
                                  </div>

                                <div>
                                        <label className="text-xs text-gray-600" >
                                          Country:<span className="text-red-500 text-[14px]">*</span>
                                        </label>
                                        <select
                                          name="country"
                                          value={employeeForm.country}
                                          onChange={handleInputChange}
                                            ref={fieldRefs.current.country}
                                          style={{ paddingLeft: '12px' }}
                                          className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                        >
                                          <option value="">Select Country</option>
                                          {countries.map((country) => (
                                            <option key={country.id} value={country.id}>
                                              {country.name}
                                            </option>
                                          ))}
                                        </select>
                                        <p className="text-xs text-red-400">{formErrors.country}</p>   
                                      </div>

                               <div>
                                    <label className="text-xs text-gray-600" >
                                      State:<span className="text-red-500 text-[14px]">*</span>
                                    </label>
                                    <select
                                      name="state"
                                      value={employeeForm.state}
                                      onChange={handleInputChange}
                                        ref={fieldRefs.current.state}
                                      style={{ paddingLeft: '12px' }}
                                      className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                    >
                                      <option value="">Select State</option>
                                      {states.map((state) => (
                                        <option key={state.id} value={state.id}>
                                          {state.name}
                                        </option>
                                      ))}
                                    </select>
                                    <p className="text-xs text-red-400">{formErrors.state}</p>   
                                  </div>

                               <div>
                                <label className="text-xs text-gray-600" >
                                  District:
                                </label>
                                <select
                                  name="district"
                                  value={employeeForm.district}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                >
                                  <option value="">Select District</option>
                                  {districts.map((district) => (
                                    <option key={district.id} value={district.id}>
                                      {district.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                                <div>
                                    <label className="text-xs text-gray-600" >
                                      City:
                                    </label>
                                    <select
                                      name="city"
                                      value={employeeForm.city}
                                      onChange={handleInputChange}
                                      style={{ paddingLeft: '12px' }}
                                      className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                    >
                                      <option value="">Select City</option>
                                      {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                          {city.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                               <div>
                                    <label className="text-xs text-gray-600" >
                                      City Area:
                                    </label>
                                    <select
                                      name="city_area"
                                      value={employeeForm.city_area}
                                      onChange={handleInputChange}
                                      style={{ paddingLeft: '12px' }}
                                      className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                    >
                                      <option value="">Select City Area</option>
                                      {cityAreas.map((cityArea) => (
                                        <option key={cityArea.id} value={cityArea.id}>
                                          {cityArea.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                               <div>
                                      <label className="text-xs text-gray-600">
                                        Pincode:
                                      </label>
                                      <input
                                        type="text"
                                        name="pincode"
                                        placeholder="Pincode"
                                          ref={fieldRefs.current.pincode}
                                        value={employeeForm.pincode}
                                        onChange={handleInputChange}
                                        style={{ paddingLeft: '12px' }}
                                        className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                      />
                                    <p className="text-xs text-red-400">{formErrors.pincode}</p>   

                                    </div>

                               <div className="md:col-span-2">
                                    <label className="text-xs text-gray-600" >
                                      Address:
                                    </label>
                                    <textarea
                                      name="address"
                                      placeholder="Address"
                                      value={employeeForm.address}
                                      onChange={handleInputChange}
                                      style={{ paddingLeft: '12px' }}
                                      className="textarea w-full text-xs bg-white border-gray-200 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                                    />
                                  </div>

                              </div>
                            </div>
                            {/* JOB DETAILS */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-[#5E72E4] mb-2 text-[16px]">Job Details</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                <label className="text-xs text-gray-600" >
                                  Department:<span className="text-red-500 text-[14px]">*</span>
                                </label>
                                <select
                                  name="department"
                                  value={employeeForm.department}
                                  onChange={handleInputChange}
                                    ref={fieldRefs.current.department}
                                  style={{ paddingLeft: '12px' }}
                                  className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                >
                                  <option value="">Select Department</option>
                                  {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                      {department.name}
                                    </option>
                                  ))}
                                </select>
                                 <p className="text-xs text-red-400">{formErrors.department}</p> 
                              </div>

                               <div>
                                <label className="text-xs text-gray-600" >
                                  Position:<span className="text-red-500 text-[14px]">*</span>
                                </label>
                                <select
                                  name="position"
                                  value={employeeForm.position}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                    ref={fieldRefs.current.position}
                                  className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                >
                                  <option value="">Select Position</option>
                                  {positions.map((position) => (
                                    <option key={position.id} value={position.id}>
                                      {position.name}
                                    </option>
                                  ))}
                                </select>
                                <p className="text-xs text-red-400">{formErrors.position}</p>   
                              </div>

                                <div>
                                <label className="text-xs text-gray-600">
                                  Joining Date:
                                </label>
                                <input
                                  type="date"
                                  name="joining_date"
                                  value={employeeForm.joining_date}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                                <div>
                                  <label className="text-xs text-gray-600" >
                                    Resignation Date:
                                  </label>
                                  <input
                                    type="date"
                                    name="resignation_date"
                                    value={employeeForm.resignation_date}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  />
                                </div>

                               <div>
                                  <label className="text-xs text-gray-600">
                                    Branch:
                                  </label>
                                  <select
                                    name="branch"
                                    value={employeeForm.branch}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                  >
                                    <option value="">Select Branch</option>
                                    {branches.map((branch) => (
                                      <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                        <label className="text-xs text-gray-600" >
                                          Currency:
                                        </label>
                                        <select
                                          name="currency"
                                          value={employeeForm.currency}
                                          onChange={handleInputChange}
                                          style={{ paddingLeft: '12px' }}
                                          className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                        >
                                          <option value="">Select Currency</option>
                                          {currencies.map((currency) => (
                                            <option key={currency.id} value={currency.id}>
                                              {currency.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                <div>
                                <label className="text-xs text-gray-600" >
                                  Salary:
                                </label>
                                <input
                                  type="number"
                                  name="salary"
                                  placeholder="Salary"
                                  value={employeeForm.salary}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                              </div>
                            </div>
                            {/* BANK & ID */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-[#5E72E4] mb-2 text-[16px]">Bank & ID</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                <label className="text-xs text-gray-600" >
                                  Bank Account:
                                </label>
                                <input
                                  type="text"
                                  name="bank_account"
                                  placeholder="Bank Account"
                                  value={employeeForm.bank_account}
                                    ref={fieldRefs.current.bank_account}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                                   <p className="text-xs text-red-400">{formErrors.bank_account}</p>   
                              </div>

                                <div>
                                  <label className="text-xs text-gray-600" >PAN Number:</label>
                                  <input
                                    type="text"
                                    name="pan_number"
                                    placeholder="PAN Number"
                                      ref={fieldRefs.current.pan_number}
                                    value={employeeForm.pan_number}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  />
                                   <p className="text-xs text-red-400">{formErrors.pan_number}</p>   

                                </div>

                                <div>
                                  <label className="text-xs text-gray-600" >Aadhaar Number:</label>
                                  <input
                                    type="text"
                                    name="aadhaar_number"
                                    placeholder="Aadhaar Number"
                                    value={employeeForm.aadhaar_number}
                                     ref={fieldRefs.current.aadhaar_number}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  />
                                   <p className="text-xs text-red-400">{formErrors.aadhaar_number}</p>   

                                </div>

                                <div>
                                  <label className="text-xs text-gray-600">Document:</label>
                                  <input
                                    type="file"
                                    name="document"
                                    accept="*/*"
                                    onChange={handleInputChange}
                                    style={{ padding: '12px' }}
                                    className="input w-full bg-white border-gray-200 text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs text-gray-600" >Other Document:</label>
                                  <input
                                    type="file"
                                    name="other_document"
                                    accept="*/*"
                                    onChange={handleInputChange}
                                    style={{ padding: '12px' }}
                                    className="input w-full bg-white border-gray-200 text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs text-gray-600" >Extra Document:</label>
                                  <input
                                    type="file"
                                    name="extra_document"
                                    onChange={handleInputChange}
                                    style={{ padding: '12px' }}
                                    className="input w-full bg-white border-gray-200 text-xs"
                                  />
                                </div>

                              </div>
                            </div>
                            {/* EMERGENCY */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-[#5E72E4] mb-2 text-[16px]">Emergency</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                  <label className="text-xs text-gray-600" >
                                    Emergency Contact Name:
                                  </label>
                                  <input
                                    type="text"
                                    name="emergency_contact_name"
                                    placeholder="Contact Name"
                                    value={employeeForm.emergency_contact_name}
                                      ref={fieldRefs.current.emergency_contact_name}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  />
                                  <p className="text-xs text-red-400">{formErrors.emergency_contact_name}</p> 
                                </div>

                                <div>
                                  <label className="text-xs text-gray-600" >
                                    Emergency Contact Number:
                                  </label>
                                  <input
                                    type="text"
                                    name="emergency_contact_number"
                                    placeholder="Contact Number"
                                      ref={fieldRefs.current.emergency_contact_name}

                                    value={employeeForm.emergency_contact_number}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  />
                              <p className="text-xs text-red-400">{formErrors.emergency_contact_number}</p> 

                                </div>

                                <div>
                                  <label className="text-xs text-gray-600" >
                                    Blood Group:
                                  </label>
                                  <input
                                    type="text"
                                    name="blood_group"
                                    placeholder="Blood Group"
                                    value={employeeForm.blood_group}
                                    onChange={handleInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  />
                                </div>

                              </div>
                            </div>
                            {/* OTHER */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-[#5E72E4] mb-2 text-[16px]">Other</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                <label className="text-xs text-gray-600" >Education:</label>
                                <textarea
                                  name="education"
                                  placeholder="Education"
                                  value={employeeForm.education}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="textarea w-full text-xs bg-white border-gray-200 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                              <div>
                                <label className="text-xs text-gray-600" >Work Experience:</label>
                                <textarea
                                  name="work_experience"
                                  placeholder="Work Experience"
                                  value={employeeForm.work_experience}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="textarea w-full text-xs bg-white border-gray-200 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                              <div>
                                <label className="text-xs text-gray-600" >Default Language:</label>
                                <input
                                  type="text"
                                  name="default_language"
                                  placeholder="Default Language"
                                  value={employeeForm.default_language}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                              <div>
                                <label className="text-xs text-gray-600" >Time Zone:</label>
                                <input
                                  type="text"
                                  name="time_zone"
                                  placeholder="Time Zone"
                                  value={employeeForm.time_zone}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                              <div>
                                <label className="text-xs text-gray-600" >Is Probation?</label>
                                <select
                                  name="is_probation"
                                  value={employeeForm.is_probation}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                >
                                  <option value="">Select Probation</option>
                                  <option value="True">Yes</option>
                                  <option value="False">No</option>
                                </select>
                              </div>

                             <div>
                                <label className="text-xs text-gray-600" >Is Branch</label>
                                <select
                                  name="is_branch"
                                  value={employeeForm.is_branch}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                >
                                
                               
                                  <option value="">Select Branch</option>
                                  <option value="True">Yes</option>
                                  <option value="False">No</option>
                                </select>
                              </div>


                              <div>
                                <label className="text-xs text-gray-600" >Group ID</label>
                                <select
                                  name="group_id"
                                  value={employeeForm.group_id}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                >
                                  <option value="">Select Group</option>
                                  <option value={1}>1</option>
                                  <option value={2}>2</option>
                                  <option value={3}>3</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-xs text-gray-600">Probation End Date:</label>
                                <input
                                  type="date"
                                  name="probation_end_date"
                                  value={employeeForm.probation_end_date}
                                  onChange={handleInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                              </div>
                            </div>
                            {/* STATUS */}
                            <div className="mb-4">
                              <label className="text-xs text-gray-600" >Status:</label>
                              <select style={{ paddingLeft: '12px' }}  onChange={handleInputChange} value={employeeForm.status} className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500" name="status">
                                <option value="">Select Status</option>
                                <option value="True">Active</option>
                                <option value="False">Inactive</option>
                              </select>
                            </div>
                            {/* BUTTONS */}
                            <div className="flex flex-col sm:flex-row justify-end items-end gap-3">
                              <button type="button" className="btn border-none w-[100px] rounded-lg text-white" style={{ backgroundColor: '#8392ab' }} onClick={handleCloseModal}>
                                Close
                              </button>
                             <button
                                type="button"
                                className="w-[100px] btn border-none rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
                                onClick={handleSubmit}
                              >
                                Submit
                              </button>

                            </div>
                          </div>
                        </div>
                      )}
                      {/* EDIT MODAL */}
                      {editModal && (
                        <div className="fixed text-gray-400 inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[700px] h-[95vh] max-h-[90vh] flex flex-col overflow-y-auto gap-3 p-6" style={{ padding: '20px' }}>
                            <h3 className="font-bold text-[22px] text-[#344767]">Create Employee</h3>
                            <hr className="my-4 border-gray-300" />
                            {/* BASIC INFO */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-[#5E72E4] mb-2 text-[16px]">Basic Info</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-xs text-gray-600" > Name:<span className="text-red-500 text-[14px]">*</span></label>
                                  <input type="text" 
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  name="name"
                                  value={editEmployee.name}
                                  onChange={handleEditInputChange}
                                  placeholder="Full Name" />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-600" >Gender:<span className="text-red-500 text-[14px]">*</span></label>
                                  <select style={{ paddingLeft: '12px' }}
                                   className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                   name="gender"
                                   value={editEmployee.gender}
                                   onChange={handleEditInputChange}
                                   >          
                                   <option value="">--Select Gender--</option>

                                       {gender.map((country) => (
                                      <option key={country.id} value={country.id}>
                                        {country.name}
                                      </option>
                                    ))}
                                   
                                  </select>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-600" >Date of Birth:</label>
                                  <input type="date" style={{ paddingLeft: '12px' }} value={editEmployee.date_of_birth}
                                  onChange={handleEditInputChange} className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500" name="date_of_birth" />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-600" >Marital Status:</label>
                                  <select style={{ paddingLeft: '12px' }} value={editEmployee.marital_status} onChange={handleEditInputChange} className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500" name="marital_status">
                                    <option value="">Select</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                  </select>
                                </div>
                                <div>
                                      <label className="text-xs text-gray-600" >
                                        Profile Picture:
                                      </label>
                                      <input
                                        type="file"
                                        name="profile_picture"
                                        accept="image/*"
                                        onChange={handleEditInputChange}
                                        style={{ padding: '12px' }}
                                        className="input bg-white border border-gray-200 w-full text-xs"
                                      />
                                    </div>

                              </div>
                            </div>
                            {/* CONTACT INFO */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-[#5E72E4] mb-2 text-[16px]">Contact Info</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                <label className="text-xs text-gray-600" >
                                  Email:<span className="text-red-500 text-[14px]">*</span>
                                </label>
                                <input
                                  type="email"
                                  name="email"
                                  placeholder="Email"
                                  value={editEmployee.email}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                               <div>
                                    <label className="text-xs text-gray-600" >
                                      Phone Number:<span className="text-red-500 text-[14px]">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="phone_number"
                                      placeholder="Phone Number"
                                      value={editEmployee.phone_number}
                                      onChange={handleEditInputChange}
                                      style={{ paddingLeft: '12px' }}
                                      className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                    />
                                  </div>

                                <div>
                                        <label className="text-xs text-gray-600" >
                                          Country:<span className="text-red-500 text-[14px]">*</span>
                                        </label>
                                        <select
                                          name="country"
                                          value={editEmployee.country}
                                          onChange={handleEditInputChange}
                                          style={{ paddingLeft: '12px' }}
                                          className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                        >
                                          <option value="">Select Country</option>
                                          {countries.map((country) => (
                                            <option key={country.id} value={country.id}>
                                              {country.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                               <div>
                                    <label className="text-xs text-gray-600" >
                                      State:<span className="text-red-500 text-[14px]">*</span>
                                    </label>
                                    <select
                                      name="state"
                                      value={editEmployee.state}
                                      onChange={handleEditInputChange}
                                      style={{ paddingLeft: '12px' }}
                                      className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                    >
                                      <option value="">Select State</option>
                                      {states.map((state) => (
                                        <option key={state.id} value={state.id}>
                                          {state.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                               <div>
                                <label className="text-xs text-gray-600" >
                                  District:
                                </label>
                                <select
                                  name="district"
                                  value={editEmployee.district}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                >
                                  <option value="">Select District</option>
                                  {districts.map((district) => (
                                    <option key={district.id} value={district.id}>
                                      {district.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                                <div>
                                    <label className="text-xs text-gray-600" >
                                      City:
                                    </label>
                                    <select
                                      name="city"
                                      value={editEmployee.city}
                                      onChange={handleEditInputChange}
                                      style={{ paddingLeft: '12px' }}
                                      className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                    >
                                      <option value="">Select City</option>
                                      {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                          {city.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                               <div>
                                    <label className="text-xs text-gray-600" >
                                      City Area:
                                    </label>
                                    <select
                                      name="city_area"
                                      value={editEmployee.city_area}
                                      onChange={handleEditInputChange}
                                      style={{ paddingLeft: '12px' }}
                                      className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                    >
                                      <option value="">Select City Area</option>
                                      {cityAreas.map((cityArea) => (
                                        <option key={cityArea.id} value={cityArea.id}>
                                          {cityArea.name}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                               <div>
                                      <label className="text-xs text-gray-600">
                                        Pincode:
                                      </label>
                                      <input
                                        type="text"
                                        name="pincode"
                                        placeholder="Pincode"
                                        value={editEmployee.pincode}
                                        onChange={handleEditInputChange}
                                        style={{ paddingLeft: '12px' }}
                                        className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                      />
                                    </div>

                               <div className="md:col-span-2">
                                    <label className="text-xs text-gray-600" >
                                      Address:
                                    </label>
                                    <textarea
                                      name="address"
                                      placeholder="Address"
                                      value={editEmployee.address}
                                      onChange={handleEditInputChange}
                                      style={{ paddingLeft: '12px' }}
                                      className="textarea w-full text-xs bg-white border-gray-200 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                                    />
                                  </div>

                              </div>
                            </div>
                            {/* JOB DETAILS */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-[#5E72E4] mb-2 text-[16px]">Job Details</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                <label className="text-xs text-gray-600" >
                                  Department:
                                </label>
                                <select
                                  name="department"
                                  value={editEmployee.department}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                >
                                  <option value="">Select Department</option>
                                  {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                      {department.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                               <div>
                                <label className="text-xs text-gray-600" >
                                  Position:<span className="text-red-500 text-[14px]">*</span>
                                </label>
                                <select
                                  name="position"
                                  value={editEmployee.position}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                >
                                  <option value="">Select Position</option>
                                  {positions.map((position) => (
                                    <option key={position.id} value={position.id}>
                                      {position.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                                <div>
                                <label className="text-xs text-gray-600">
                                  Joining Date:
                                </label>
                                <input
                                  type="date"
                                  name="joining_date"
                                  value={editEmployee.joining_date}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                                <div>
                                  <label className="text-xs text-gray-600" >
                                    Resignation Date:
                                  </label>
                                  <input
                                    type="date"
                                    name="resignation_date"
                                    value={editEmployee.resignation_date}
                                    onChange={handleEditInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  />
                                </div>

                               <div>
                                  <label className="text-xs text-gray-600">
                                    Branch:
                                  </label>
                                  <select
                                    name="branch"
                                    value={editEmployee.branch}
                                    onChange={handleEditInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                  >
                                    <option value="">Select Branch</option>
                                    {branches.map((branch) => (
                                      <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                        <label className="text-xs text-gray-600" >
                                          Currency:
                                        </label>
                                        <select
                                          name="currency"
                                          value={editEmployee.currency}
                                          onChange={handleEditInputChange}
                                          style={{ paddingLeft: '12px' }}
                                          className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                        >
                                          <option value="">Select Currency</option>
                                          {currencies.map((currency) => (
                                            <option key={currency.id} value={currency.id}>
                                              {currency.name}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                <div>
                                <label className="text-xs text-gray-600" >
                                  Salary:
                                </label>
                                <input
                                  type="number"
                                  name="salary"
                                  placeholder="Salary"
                                  value={editEmployee.salary}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                              </div>
                            </div>
                            {/* BANK & ID */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-[#5E72E4] mb-2 text-[16px]">Bank & ID</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                <label className="text-xs text-gray-600" >
                                  Bank Account:
                                </label>
                                <input
                                  type="text"
                                  name="bank_account"
                                  placeholder="Bank Account"
                                  value={editEmployee.bank_account}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                                <div>
                                  <label className="text-xs text-gray-600" >PAN Number:</label>
                                  <input
                                    type="text"
                                    name="pan_number"
                                    placeholder="PAN Number"
                                    value={editEmployee.pan_number}
                                    onChange={handleEditInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs text-gray-600" >Aadhaar Number:</label>
                                  <input
                                    type="text"
                                    name="aadhaar_number"
                                    placeholder="Aadhaar Number"
                                    value={editEmployee.aadhaar_number}
                                    onChange={handleEditInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs text-gray-600">Document:</label>
                                  <input
                                    type="file"
                                    name="document"
                                    accept="*/*"
                                    onChange={handleEditInputChange}
                                    style={{ padding: '12px' }}
                                    className="input w-full bg-white border-gray-200 text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs text-gray-600" >Other Document:</label>
                                  <input
                                    type="file"
                                    name="other_document"
                                    accept="*/*"
                                    onChange={handleEditInputChange}
                                    style={{ padding: '12px' }}
                                    className="input w-full bg-white border-gray-200 text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs text-gray-600" >Extra Document:</label>
                                  <input
                                    type="file"
                                    name="extra_document"
                                    onChange={handleEditInputChange}
                                    style={{ padding: '12px' }}
                                    className="input w-full bg-white border-gray-200 text-xs"
                                  />
                                </div>

                              </div>
                            </div>
                            {/* EMERGENCY */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-[#5E72E4] mb-2 text-[16px]">Emergency</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                  <label className="text-xs text-gray-600" >
                                    Emergency Contact Name:
                                  </label>
                                  <input
                                    type="text"
                                    name="emergency_contact_name"
                                    placeholder="Contact Name"
                                    value={editEmployee.emergency_contact_name}
                                    onChange={handleEditInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs text-gray-600" >
                                    Emergency Contact Number:
                                  </label>
                                  <input
                                    type="text"
                                    name="emergency_contact_number"
                                    placeholder="Contact Number"
                                    value={editEmployee.emergency_contact_number}
                                    onChange={handleEditInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="text-xs text-gray-600" >
                                    Blood Group:
                                  </label>
                                  <input
                                    type="text"
                                    name="blood_group"
                                    placeholder="Blood Group"
                                    value={editEmployee.blood_group}
                                    onChange={handleEditInputChange}
                                    style={{ paddingLeft: '12px' }}
                                    className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                  />
                                </div>

                              </div>
                            </div>
                            {/* OTHER */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-[#5E72E4] mb-2 text-[16px]">Other</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div>
                                <label className="text-xs text-gray-600" >Education:</label>
                                <textarea
                                  name="education"
                                  placeholder="Education"
                                  value={editEmployee.education}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="textarea w-full text-xs bg-white border-gray-200 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                              <div>
                                <label className="text-xs text-gray-600" >Work Experience:</label>
                                <textarea
                                  name="work_experience"
                                  placeholder="Work Experience"
                                  value={editEmployee.work_experience}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="textarea w-full text-xs bg-white border-gray-200 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                              <div>
                                <label className="text-xs text-gray-600" >Default Language:</label>
                                <input
                                  type="text"
                                  name="default_language"
                                  placeholder="Default Language"
                                  value={editEmployee.default_language}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                              <div>
                                <label className="text-xs text-gray-600" >Time Zone:</label>
                                <input
                                  type="text"
                                  name="time_zone"
                                  placeholder="Time Zone"
                                  value={editEmployee.time_zone}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                              <div>
                                <label className="text-xs text-gray-600" >Is Probation?</label>
                                <select
                                  name="is_probation"
                                  value={editEmployee.is_probation}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                >
                                  <option value="">Select Probation</option>
                                  <option value="True">Yes</option>
                                  <option value="False">No</option>
                                </select>
                              </div>

                             <div>
                                <label className="text-xs text-gray-600" >Is Branch</label>
                                <select
                                  name="is_branch"
                                  value={editEmployee.is_branch}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                >
                                
                               
                                  <option value="">Select Branch</option>
                                  <option value="True">Yes</option>
                                  <option value="False">No</option>
                                </select>
                              </div>


                              <div>
                                <label className="text-xs text-gray-600" >Group ID</label>
                                <select
                                  name="group_id"
                                  value={editEmployee.group_id}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500"
                                >
                                  <option value="">Select Group</option>
                                  <option value={1}>1</option>
                                  <option value={2}>2</option>
                                  <option value={3}>3</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-xs text-gray-600">Probation End Date:</label>
                                <input
                                  type="date"
                                  name="probation_end_date"
                                  value={editEmployee.probation_end_date}
                                  onChange={handleEditInputChange}
                                  style={{ paddingLeft: '12px' }}
                                  className="input w-full text-xs rounded-lg bg-white border-gray-200 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                />
                              </div>

                              </div>
                            </div>
                            {/* STATUS */}
                            <div className="mb-4">
                              <label className="text-xs text-gray-600" >Status:</label>
                              <select style={{ paddingLeft: '12px' }}  onChange={handleEditInputChange} value={editEmployee.status} className="select w-full text-xs bg-white border-gray-200 focus:outline-none text-gray-400 focus:border-b-2 focus:border-blue-500" name="status">
                                <option value="">Select Status</option>
                                <option value="True">Active</option>
                                <option value="False">Inactive</option>
                              </select>
                            </div>
                            {/* BUTTONS */}
                            <div className="flex flex-col sm:flex-row justify-end items-end gap-3">
                              <button type="button" className="btn border-none w-[100px] rounded-lg text-white" style={{ backgroundColor: '#8392ab' }} onClick={handleCloseModal}>
                                Close
                              </button>
                             <button
                                type="button"
                                className="w-[100px] rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
                                onClick={handleEditSubmit}
                              >
                                Submit
                              </button>

                            </div>
                          </div>
                        </div>
                      )}
      
                         
                    </>)
     }
     
     export default EmployeeList;