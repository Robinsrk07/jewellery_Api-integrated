
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import '@fontsource/open-sans'; // Default weight 400
import '@fontsource/open-sans/600.css'; // Semi-bold
import '@fontsource/open-sans/700.css'; // Bold
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import CustomScrollbar from '../../components/CustomScrollbar';
import Pagination from '../../components/Pagination';
import BranchModel from '../../models/branchModel';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import CityAreaModel from '../../models/cityAreaModel'
import CityModel from "../../models/CityModel"
import DistrictModel from "../../models/districtModel"
import StateModel from '../../models/stateModel';
import CountryModel from "../../models/countryModel";
import employeeModel from "../../models/employeeModel"
import TableSkelton from '../../components/tableSkelton';
import CurrencyModel  from "../../models/CurrencyModel"
import { toast } from 'react-toastify';
import { useRef } from 'react';

     const  Branches = () => {
     
            const[limit,setLimit]=useState(10);      
             const [modal, setModal] = useState(false)   
             const [editModal,setEditModal]= useState(false)
             const [totalPages, setTotalPages] = useState(1);
             const [branches, setBranches] = useState([]);
             const [loading, setLoading] = useState(true);
             const [selectedBranch, setSelectedBranch] = useState(null); // to hold branch data
             const[page,setPage]=useState(1);  
             const[search,setSearch]=useState('');
             const[status,setStatus]=useState();
             const [deletingId, setDeletingId] = useState(null);
             const [itemToDelete, setItemToDelete] = useState(null);
             const auth= useSelector((state) => state.auth);
             const { login_id ,can_manage_user_types,} = auth;  
                   const user_id = login_id;
                   const user_types = Object.keys(can_manage_user_types).join(','); 
                   const[country,setCountry]= useState([])
                   const[state,setState] = useState([])
                   const[district,setDistrict] = useState([])
                   const[city,setCity] = useState([])
                   const[cityArea,setCityArea] = useState([])
                   const[employees,setEmployees] = useState([])
                   const [currency,setCurrency] = useState([])
                   const [dropdownOpen, setDropdownOpen] = useState(false);
                   const [searchTerm, setSearchTerm] = useState('');
                    const nameRef = useRef(null);
                    const codeRef = useRef(null);
                    const countryRef = useRef(null);
                    const stateRef = useRef(null);
                    const pincodeRef = useRef(null);
                    const currencyRef = useRef(null);
                    const primaryPhoneRef = useRef(null);
                    const emailRef = useRef(null);
                    const taxIdRef = useRef(null);
                    const openingDateRef = useRef(null);
                    const workingHoursRef = useRef(null);
                    const isHeadOfficeRef = useRef(null);
                    const latitudeRef = useRef(null);
                    const longitudeRef = useRef(null);
                    const hrEmailRef = useRef(null);
                    const hrContactRef = useRef(null);
                    const secondaryPhoneRef = useRef(null);
                    const gstNumberRef = useRef(null);

                   
            // Filter employees based on search
                  const filteredEmployees = employees.filter(emp => 
                    (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase())
                  );
      
                   
                  // console.log(branches)
                 

                   const [branch, setBranch] = useState({
                      name: '', //mandatory
                      code: '', //mandatory
                      country: null, //mandatory
                      state: null, //mandatory
                      district: null,
                      city: null,
                      city_area: null,
                      address: '',
                      pincode: '', //mandatory
                      currency: null, //mandatory
                      primary_phone: '', //mandatory
                      secondary_phone: '',
                      fax: '',
                      email: '', //mandatory
                      gst_number: '',
                      tax_id: '', //mandatory
                      opening_date: '', // Format: 'YYYY-MM-DD' //mandatory
                      manager_name: '',
                      hr_contact: '',
                      hr_email: '',
                      max_employee_capacity: null,
                      working_hours: '', //mandatory
                      has_biometric_attendance: false,
                      is_head_office: false, //mandatory
                      logo: null, // File or URL depending on usage
                      users: [], // Array of user IDs
                      latitude: '', //mandatory
                      longitude: '' //mandatory
                    });

                      const [errors,setErrors] = useState({
                       name: '', //mandatory
                       code: '', //mandatory
                       country: '', //mandatory
                       state: '', //mandatory
                       district: '',
                       city: '',
                       city_area: '',
                       address: '',
                       pincode: '', //mandatory
                       currency: '', //mandatory
                       primary_phone: '', //mandatory
                       secondary_phone: '',
                       fax: '',
                       email: '', //mandatory
                       gst_number: '',
                       tax_id: '', //mandatory
                       opening_date: '', // Format: 'YYYY-MM-DD' //mandatory
                       manager_name: '',
                       hr_contact: '',
                       hr_email: '',
                       max_employee_capacity: '',
                       working_hours: '', //mandatory
                       has_biometric_attendance: '',
                       is_head_office: '', //mandatory
                       logo: '', // File or URL depending on usage
                       users: '', // Array of user IDs
                       latitude: '', //mandatory
                       longitude: '' //mandatory
                     })

                 

                  
                const fieldRefs = {
                  name: nameRef,
                  code: codeRef,
                  country: countryRef,
                  state: stateRef,
                  pincode: pincodeRef,
                  currency: currencyRef,
                  primary_phone: primaryPhoneRef,
                  email: emailRef,
                  tax_id: taxIdRef,
                  opening_date: openingDateRef,
                  working_hours: workingHoursRef,
                  is_head_office: isHeadOfficeRef,
                  latitude: latitudeRef,
                  longitude: longitudeRef,
                  hr_email: hrEmailRef,
                  hr_contact:hrContactRef,
                  secondary_phone: secondaryPhoneRef,
                  gst_number: gstNumberRef,
                };



                const validate = () => {
                const newErrors = {};

                // ✅ Helper functions
                const isValidEmail = (email) =>
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

                const isValidPhone = (phone) =>
                  /^[0-9]{6,15}$/.test(phone); // Allows digits only, 6 to 15 chars

                const isValidPincode = (pin) =>
                  /^[0-9]{4,10}$/.test(pin); // Customize range for your region

                const isValidGST = (gst) =>
                  /^[0-9A-Z]{15}$/.test(gst); // Typical Indian GST format

                const isValidLatLng = (val, type) => {
                  const num = parseFloat(val);
                  if (isNaN(num)) return false;
                  return type === 'lat'
                    ? num >= -90 && num <= 90
                    : num >= -180 && num <= 180;
                };

                // ✅ Mandatory fields check
                if (!branch.name.trim()) newErrors.name = 'Please enter branch name';
                if (!branch.code.trim()) newErrors.code = 'Please enter branch code';
                if (!branch.country) newErrors.country = 'Please select country';
                if (!branch.state) newErrors.state = 'Please select state';
                if (!branch.pincode.trim()) newErrors.pincode = 'Please enter pincode';
                if (!branch.latitude.trim()) newErrors.latitude = 'Please enter latitude';
                if (!branch.longitude.trim()) newErrors.longitude = 'Please enter longitude';
                if (!branch.primary_phone.trim()) newErrors.primary_phone = 'Please enter primary phone';
                 if (!branch.email.trim()) newErrors.email = 'Please enter email';
               
                if (!branch.working_hours.trim()) newErrors.working_hours = 'Please enter working hours';
                   if (branch.is_head_office === null || branch.is_head_office === undefined)
                  newErrors.is_head_office = 'Please specify if it is head office';
               
                if (!branch.currency) newErrors.currency = 'Please select currency';
                if (!branch.tax_id.trim()) newErrors.tax_id = 'Please enter tax ID';
                if (!branch.opening_date.trim()) newErrors.opening_date = 'Please select opening date';
           
             

                // ✅ Format validation for both required and optional fields (if filled)

                if (branch.email && !isValidEmail(branch.email)) {
                  newErrors.email = 'Invalid email format';
                }

                if (branch.hr_email && !isValidEmail(branch.hr_email)) {
                  newErrors.hr_email = 'Invalid HR email format';
                }
                if (branch.hr_contact && !isValidPhone(branch.hr_contact)) {
                  newErrors.hr_contact = 'Invalid HR contact format';
                }

                if (branch.primary_phone && !isValidPhone(branch.primary_phone)) {
                  newErrors.primary_phone = 'Invalid primary phone number';
                }

                if (branch.secondary_phone && branch.secondary_phone.trim() && !isValidPhone(branch.secondary_phone)) {
                  newErrors.secondary_phone = 'Invalid secondary phone number';
                }

                if (branch.pincode && !isValidPincode(branch.pincode)) {
                  newErrors.pincode = 'Invalid pincode';
                }

                if (branch.gst_number && branch.gst_number.trim() && !isValidGST(branch.gst_number)) {
                  newErrors.gst_number = 'Invalid GST number';
                }

                if (branch.latitude && !isValidLatLng(branch.latitude, 'lat')) {
                  newErrors.latitude = 'Latitude must be between -90 and 90';
                }

                if (branch.longitude && !isValidLatLng(branch.longitude, 'lng')) {
                  newErrors.longitude = 'Longitude must be between -180 and 180';
                }

                return newErrors;
              };
  

            const handleBranchChange = (e) => {
                      const { name, type, value, checked, files } = e.target;

                      setBranch(prev => ({
                        ...prev,
                        [name]:
                          type === 'checkbox'
                            ? checked
                            : type === 'file'
                            ? files[0]
                            : value,
                      }));
                   };                 
            const handleSubmit = async (e) => {
                e.preventDefault();

                const validationErrors = validate();
                setErrors(validationErrors);

                const fieldOrder = [
                  'name',
                  'code',
                  'country',
                  'state',
                  'pincode',
                  'latitude',
                  'longitude',
                  'primary_phone',
                  'secondary_phone',
                  'email',
                  'hr_contact',
                  'hr_email',
                  
                  'working_hours',
                  'is_head_office',
                  'currency',
                  'tax_id',
                  'opening_date',
                  'gst_number'
                ];

                for (const field of fieldOrder) {
                  if (validationErrors[field]) {
                    const ref = fieldRefs[field];
                    if (ref && ref.current?.focus) {
                      ref.current.focus();
                      break;
                    }
                  }
                }

                if (Object.keys(validationErrors).length > 0) return;

                const formData = new FormData();

                Object.entries(branch).forEach(([key, value]) => {
                  if (key === 'users') return;
                  if (value !== null && value !== undefined) {
                    formData.append(key, value);
                  }
                });

                branch.users.forEach((userId) => {
                  formData.append('users', userId);
                });

                try {
                  const response = await BranchModel.createBranch(formData);
                  toast.success('Branch Created Successfully');
                  fetchBranch()
                  handleCloseModal();
                } catch (error) {
                  console.error('Submit failed:', error);
                  toast.error('Please Try Again, Failed To Create Branch');
                }
              };
           const getValueFromId = (id, field, key = 'name') => {
                  if (!Array.isArray(field)) return '—'; // Ensure it's a valid array
                  const item = field.find((entry) => entry?.id === id);
                  return item?.[key] || '—'; // Safe access
                };

            const handleEditSubmit = async (e) => {
                e.preventDefault();

                const validationErrors = validate();
                setErrors(validationErrors);

                const fieldOrder = [
                  'name',
                  'code',
                  'country',
                  'state',
                  'pincode',
                  'latitude',
                  'longitude',
                  'primary_phone',
                  'secondary_phone',
                  'email',
                  'hr_contact',
                  'hr_email',
                  
                  'working_hours',
                  'is_head_office',
                  'currency',
                  'tax_id',
                  'opening_date',
                  'gst_number'
                ];

                for (const field of fieldOrder) {
                  if (validationErrors[field]) {
                    const ref = fieldRefs[field];
                    if (ref && ref.current?.focus) {
                      ref.current.focus();
                      break;
                    }
                  }
                }

                if (Object.keys(validationErrors).length > 0) return;

                const formData = new FormData();

                Object.entries(branch).forEach(([key, value]) => {
                  if (key === 'users') return;
                  if (value !== null && value !== undefined) {
                    formData.append(key, value);
                  }
                });

                branch.users.forEach((userId) => {
                  formData.append('users', userId);
                });

                try {
                  const response = await BranchModel.updateBranch(selectedBranch?.id,formData);
                  toast.success('Branch Created Successfully');
                  fetchBranch()
                  handleCloseModal();
                } catch (error) {
                  console.error('Submit failed:', error);
                  toast.error('Please Try Again, Failed To Create Branch');
                }
              };

              const handleDeleteBranch = async (id) => {
        if (!id) return toast.error("Sorry We Are Unable to Delete Item");
        try {
            setDeletingId(id);
            await BranchModel.deleteBranch(id);
            await fetchBranch();
            toast.success("Diamond Item Deleted Successfully");
        } catch {
            toast.error("Sorry, Unable to delete Diamond Item");
        } finally {
            setDeletingId(null);
        }
    };
            
                   // Handle close modal
             const handleCloseModal = () => {
                    setErrors({
                      name: '', //mandatory
                      code: '', //mandatory
                      country: '', //mandatory
                      state: '', //mandatory
                      district: '',
                      city: '',
                      city_area: '',
                      address: '',
                      pincode: '', //mandatory
                      currency: '', //mandatory
                      primary_phone: '', //mandatory
                      secondary_phone: '',
                      fax: '',
                      email: '', //mandatory
                      gst_number: '',
                      tax_id: '', //mandatory
                      opening_date: '', // Format: 'YYYY-MM-DD' //mandatory
                      manager_name: '',
                      hr_contact: '',
                      hr_email: '',
                      max_employee_capacity: '',
                      working_hours: '', //mandatory
                      has_biometric_attendance: '',
                      is_head_office: '', //mandatory
                      logo: '', // File or URL depending on usage
                      users: '', // Array of user IDs
                      latitude: '', //mandatory
                      longitude: '' //mandatory
                    })
                    
                    setBranch({
                      name: '', //mandatory
                      code: '', //mandatory
                      country: null, //mandatory
                      state: null, //mandatory
                      district: null,
                      city: null,
                      city_area: null,
                      address: '',
                      pincode: '', //mandatory
                      currency: null, //mandatory
                      primary_phone: '', //mandatory
                      secondary_phone: '',
                      fax: '',
                      email: '', //mandatory
                      gst_number: '',
                      tax_id: '', //mandatory
                      opening_date: '', // Format: 'YYYY-MM-DD' //mandatory
                      manager_name: '',
                      hr_contact: '',
                      hr_email: '',
                      max_employee_capacity: null,
                      working_hours: '', //mandatory
                      has_biometric_attendance: false,
                      is_head_office: false, //mandatory
                      logo: null, // File or URL depending on usage
                      users: [], // Array of user IDs
                      latitude: '', //mandatory
                      longitude: '' //mandatory
                    })
                     setModal(false);
                     setEditModal(false)
                 };
            const fetchBranch = async()=>{
                      setLoading(true)
                      try{
                          const res = await BranchModel.getBranches(user_id,user_types,limit,page,search,status)
                          setBranches(res?.data?.data)
                          setTotalPages(res?.data?.pagination?.pages);
                      }catch(error){
                          toast.error("Something went wrong. Please try again.");

                      }finally{
                           setLoading(false)
                      }
                     }
                 
                 useEffect(()=>{
                     let isMount = true 
                     const fetchBranch = async()=>{
                      setLoading(true)
                      try{
                         const res = await BranchModel.getBranches(user_id,user_types,limit,page,search,status)
                         if(isMount){
                          setBranches(res?.data?.data)
                          setTotalPages(res?.data?.pagination?.pages);
                         }
                      }catch(error){
                         if(isMount){
                           console.log(error)
                         }
                      }finally{
                        setLoading(false)
                      }
                     }

                     fetchBranch()
                     return ()=>{
                      isMount = false 
                     }
                 },[user_id, user_types, limit, page, search, status])

                useEffect(() => {
                    let isMounted = true;

                    const fetchAllData = async () => {
                      try {
                        const [
                          countryRes,
                          stateRes,
                          districtRes,
                          cityRes,
                          cityAreaRes,
                          employeesRes,
                          currencyRes
                        ] = await Promise.all([
                          CountryModel.getCountries(user_id, user_types, 1000,1,"",'True'),
                          StateModel.getStates(user_id, user_types, 1000,1,"",'True'),
                          DistrictModel.getDistricts(user_id, user_types, 1000,1,"",'True'),
                          CityModel.getCities(user_id, user_types, 1000,1,"",'True'),
                          CityAreaModel.getCityAreas(user_id, user_types, 1000,1,"",'True'),
                          employeeModel.getEmployees(user_id, user_types, 1000,1,"",'True'),
                          CurrencyModel.getCurrency(user_id, user_types, 1000,1,"",'True')
                        ]);

                        if (isMounted) {
                          setCountry(countryRes?.data?.data || []);
                          setState(stateRes?.data?.data || []);
                          setDistrict(districtRes?.data?.data || []);
                          setCity(cityRes?.data?.data || []);
                          setCityArea(cityAreaRes?.data?.data || []);
                          setEmployees(employeesRes?.data?.data || []);
                          setCurrency(currencyRes?.data?.data || [])
                        }
                      } catch (error) {
                        if (isMounted) {
                          console.error('Error fetching data:', error);
                        }
                      }
                    };

                    fetchAllData();

                    return () => {
                      isMounted = false;
                    };
                  }, [user_id, user_types]);

            useEffect(() => {
              if (selectedBranch) {
                setBranch(selectedBranch); // this clones the values for editing
              }
            }, [selectedBranch]);

                 
                   return (
                     
                 <>
               <CustomScrollbar/>
                <div className="bg-white w-full
                    max-w-[99vw] 
                    xl:max-w-[90vw] 
                    2xl:max-w-[95vw] 
                    h-auto max-h-[80vh] 
                    rounded-xl px-4 md:px-8 lg:px-12
                    mx-auto overflow-auto  custom-scrollbar"
                 style={{ fontFamily: 'Open Sans',overflow:'auto'}}
                   >
                      <CreateButton
                         buttoncontent="+ New Branch"
                         onClick={() => setModal(true)}  
                      />                 
                    <ItemsPerPageSelector items={limit} setItems={setLimit} />
                       
                 
                       
                 
                       <table className="table w-full text-sm  text-[#A8B2C4] border-collapse min-w-[1300px]  " style={{ borderSpacing: '0 12px', borderCollapse: 'separate', }}>
                         <thead className="text-xs text-[#A8B2C4]  uppercase bg-white">
                           <tr>
                             <th className='min-w-[100px]'  style={{paddingLeft:'20px'}} >SL NO</th>
                             <th  className='min-w-[150px] ' >Branch Name </th>
                             <th  className='min-w-[150px] ' >Branch Code </th>
                             <th  className='min-w-[150px] ' >Location/City </th>
                             <th  className='min-w-[200px] ' >Address </th>
                             <th  className='min-w-[150px] ' >Phone</th>
                             <th className='min-w-[150px] '  >Email</th>
                             <th className='min-w-[150px] '  >Country</th>
                             <th className='min-w-[150px] '  >State/Province</th>
                             <th className='min-w-[150px] '  >Status </th>
                             <th className='min-w-[150px] '  >Actions </th>
                           </tr>
                         </thead>
                         <tbody>
                          {loading ? (
                          <TableSkelton />
                        ) : branches.length === 0 ? (
                          <tr >
                            <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
                              No data available
                            </td>
                          </tr>
                        ) :branches.map((branch, index) => (
                            <tr key={branch.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                              <td className="px-6 py-5 border-b border-gray-200 text-sm" style={{ paddingLeft: '20px' }}>
                                {index + 1}
                              </td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{branch.name || '-'}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{branch.code || '-'}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{ getValueFromId(branch.city,city) }</td>
                              <td className="border-b border-gray-200 text-xs text-gray-400">
                                <div className="max-w-[200px] break-words">{branch.address || '-'}</div>
                              </td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{branch.primary_phone || '-'}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{branch.email || '-'}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{getValueFromId(branch.country,country)}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{getValueFromId(branch.state,state)}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">
                                <span
                                  className={`${
                                    branch.status ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-400'
                                  } font-bold text-[10px] px-2 py-0.5 rounded`}
                                  style={{ padding: '2px 6px' }}
                                >
                                  {branch.status ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                              </td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                  <EditButton onClick={() => {
                                    setSelectedBranch(branch); // store branch data
                                    setEditModal(true);        // open modal
                                   }}></EditButton>
                                 

                                   <DeleteButton 
                                    buttonText={deletingId === branch.id ? 'Deleting...' : 'Delete'}
                                      onOpenModal={() => setItemToDelete     (branch)} 
                                      item={'Branch'}
                                      onConfirmDelete={() => handleDeleteBranch(itemToDelete?.id)}
                                      disabled={deletingId === branch.id}
                                          />

                                  <Link to={`/dashboard/branch/branch_wise_employee/${branch?.id}`} state ={{branch}}>
                                    <button
                                      className="text-white font-bold text-xs rounded-lg"
                                      style={{
                                        width: '120px',
                                        padding: '5px',
                                        background: 'linear-gradient(to right, #A1B1D1, #697C9B)',
                                        height: '35px',
                                      }}
                                    >
                                      View Employees
                                    </button>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>

                       </table>
                       
                   <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                 
                       {/* Modal */}
      
      
                    
      
      
                
                      </div>
      
 {modal && (
  <div className="fixed text-black inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
    <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[600px] h-[95vh] max-h-[95vh] flex flex-col overflow-y-auto gap-3" style={{padding:'20px'}}> 
     <div className='flex justify-between'>
      <h3 className="font-bold text-[22px] text-[#344767]">Create New Branch</h3> 
     <button onClick={handleCloseModal}>
    <X className="w-6 h-6 text-[#344767] cursor-pointer" />
      </button>

    </div>
      <hr className="my-4 border-gray-200" />
      <div className="flex flex-col flex-grow text-gray-600 gap-4 justify-center items-center w-full" >
        {/* Basic Info */}
        <div className="w-full flex flex-col gap-4">
          <h4 className="font-semibold text-md mb-2 text-[#344767]">Basic Info</h4>
          <div>
          <label className="font-semibold text-gray-500 text-xs w-full">Branch Name<span className="text-red-500 ml-1">*</span></label>
          <input name="name" value={branch.name} 
          ref={nameRef}
           onChange={handleBranchChange}
           type="text" placeholder="Branch Name"
           className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
           style={{paddingLeft:'12px'}} />
         <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          </div>
         <div>
          <label className="font-semibold text-gray-500 text-xs w-full">Branch Code<span className="text-red-500 ml-1">*</span></label>
          <input name="code"
           value={branch.code} 
           ref={codeRef }
           onChange={handleBranchChange} 
           type="text" placeholder="Branch Code" 
           className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" 
           style={{paddingLeft:'12px'}} />
           <p className="text-red-500 text-xs mt-1">{errors.code}</p>
           </div> 
           {/* <div>
          <label className="font-semibold text-gray-500 text-xs w-full">Status</label>
          <select  name="status" value={branch.status ? 'active' : 'inactive'} onChange={e => setBranch(prev => ({...prev, status: e.target.value === 'active'}))} style={{paddingLeft:'12px'}} className="select w-full h-[35px] border-gray-200 bg-white focus:outline-none text-gray-400 rounded-sm focus:border-b-2 focus:border-blue-500">

            <option value="">--select Status --</option>
            <option value="True">Active</option>
            <option value="False">Inactive</option>
          </select>
        </div> */}

         <div>
          <label className="font-semibold   text-gray-500 text-xs text-[#344767] w-[100%]">
          Upload Logo:
          </label>
          <input
           type="file"
           name="logo"
           accept="image/*"
           style={{padding:'8px'}}
           className="input w-full  bg-white border text-gray-400 border-gray-300 rounded-sm focus:outline-none"
          onChange={handleBranchChange}
         />
          </div>
        </div>
        {/* Location */}
        <div className="w-full flex flex-col gap-4">
          <h4 className="font-semibold text-md mb-2 text-gray-500">Location</h4>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">Country<span className="text-red-500 ml-1">*</span></label>
          <select
            name="country"
            value={branch.country || ''}
            ref={countryRef }
            onChange={handleBranchChange}
            className="input w-full rounded-sm text-xs text-gray-400 border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
          >
            <option value="">Select Country</option>
            {country.map((item) => (
              <option key={item.id} value={item.id}>
                { item.name}
              </option>
            ))}
          </select>
             <p className="text-red-500 text-xs mt-1">{errors.country}</p>
      </div>
       <div>
          <label className="font-semibold text-gray-500  text-xs w-full">State<span className="text-red-500 ml-1">*</span></label>
          <select
            name="state"
            value={branch.state || ''}
            onChange={handleBranchChange}
            ref={stateRef }
            className="input w-full rounded-sm border-gray-300 text-gray-400 text-xs bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
          >
            <option value="">Select State</option>
            {state.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
     <p className="text-red-500 text-xs mt-1">{errors.state}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">District</label>
          <select
            name="district"
            value={branch.district || ''}
            onChange={handleBranchChange}
            className="input w-full rounded-sm border-gray-300 text-gray-400 text-xs bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
          >
            <option value="">Select District</option>
            {district.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
 <p className="text-red-500 text-xs mt-1">{errors.district}</p>

</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">City</label>
          <select
            name="city"
            value={branch.city || ''}
            onChange={handleBranchChange}
            className="input w-full rounded-sm text-xs border-gray-300 text-gray-400 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
          >

            <option value="">Select City</option>
            {city.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
</div>
<div>

          <label className="font-semibold text-gray-500 text-xs w-full">City Area</label>
          <select
            name="city_area"
            value={branch.city_area || ''}
            onChange={handleBranchChange}
            className="input w-full rounded-sm text-xs border-gray-300 text-gray-400 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
          >
            <option value="">Select City Area</option>
            {cityArea.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
     <p className="text-red-500 text-xs mt-1">{errors.city_area}</p>

</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Address</label>
          <textarea name="address" value={branch.address} onChange={handleBranchChange} placeholder="Address" className="textarea w-full border-gray-200 bg-white rounded-sm focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Pincode<span className="text-red-500 ml-1">*</span></label>
          <input name="pincode" ref={pincodeRef } value={branch.pincode} onChange={handleBranchChange} type="text" placeholder="Pincode" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
 <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
</div> 
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Latitude<span className="text-red-500 ml-1">*</span></label>
          <input name="latitude" ref={latitudeRef } value={branch.latitude} onChange={handleBranchChange} type="text" placeholder="Latitude" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
         <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Longitude<span className="text-red-500 ml-1">*</span></label>    
          <input name="longitude" ref={longitudeRef } value={branch.longitude} onChange={handleBranchChange} type="text" placeholder="Longitude" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
       <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
</div>
        </div>
        {/* Contact */}
        <div className="w-full flex flex-col gap-4">
          <h4 className="font-semibold text-md mb-2 text-gray-500">Contact</h4>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">Primary Phone<span className="text-red-500 ml-1">*</span></label>
          <input name="primary_phone" ref={primaryPhoneRef } value={branch.primary_phone} onChange={handleBranchChange} type="text" placeholder="Primary Phone" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          <p className="text-red-500 text-xs mt-1">{errors.primary_phone}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Secondary Phone</label>
          <input name="secondary_phone" value={branch.secondary_phone} ref={secondaryPhoneRef} onChange={handleBranchChange} type="text" placeholder="Secondary Phone" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
        <p className="text-red-500 text-xs mt-1">{errors.secondary_phone}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Fax</label>
          <input name="fax" value={branch.fax} onChange={handleBranchChange} type="text" placeholder="Fax" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          <p className="text-red-500 text-xs mt-1">{errors.fax}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Email<span className="text-red-500 ml-1">*</span></label>
          <input name="email" value={branch.email} ref={emailRef} onChange={handleBranchChange} type="email" placeholder="Email" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
</div>
        </div>
        {/* HR/Management */}
        <div className="w-full  flex flex-col gap-4">
          <h4 className="font-semibold text-md mb-2 text-gray-500">HR / Management</h4>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">Manager Name</label>
         
          <input name="manager_name" value={branch.manager_name} onChange={handleBranchChange} type="text" placeholder="Manager Name" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          </div>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">HR Contact</label>
          <input name="hr_contact" value={branch.hr_contact} ref={hrContactRef} onChange={handleBranchChange} type="text" placeholder="HR Contact" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          <p className="text-red-500 text-xs mt-1">{errors.hr_contact}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">HR Email</label>
          <input name="hr_email" value={branch.hr_email} ref={hrEmailRef }  onChange={handleBranchChange} type="email" placeholder="HR Email" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          <p className="text-red-500 text-xs mt-1">{errors.hr_email}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Max Employee Capacity</label>
          <input name="max_employee_capacity" value={branch.max_employee_capacity || ''} onChange={handleBranchChange} type="number" placeholder="Max Employee Capacity" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
         <p className="text-red-500 text-xs mt-1">{errors.max_employee_capacity}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Working Hours<span className="text-red-500 ml-1">*</span></label>
          <input name="working_hours" ref={workingHoursRef } value={branch.working_hours} onChange={handleBranchChange} type="text" placeholder="Working Hours" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          <p className="text-red-500 text-xs mt-1">{errors.working_hours}</p>
</div>
          <div className="flex gap-6 mt-4">
  {/* Biometric Attendance Toggle */}
        <label className="flex items-center gap-3 text-sm font-medium text-gray-500 cursor-pointer">
          <span>Biometric Attendance</span>
          <span className="relative inline-block w-10 align-middle select-none">
            <input
              type="checkbox"
              name="has_biometric_attendance"
              checked={branch.has_biometric_attendance}
              onChange={handleBranchChange}
              className="sr-only peer"
            />
            <span
              className="block h-5 w-10 rounded-full bg-gray-300 peer-checked:bg-blue-500 transition-colors duration-300"
            ></span>
            <span
              className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"
            ></span>
          </span>
        </label>

        {/* Head Office Toggle */}
        <label className="flex items-center gap-3 text-sm font-medium text-gray-500 cursor-pointer">
          <span>Head Office<span className="text-red-500 ml-1">*</span></span>
          <span className="relative inline-block w-10 align-middle select-none">
            <input
              type="checkbox"
              name="is_head_office"
              checked={branch.is_head_office}
              onChange={handleBranchChange}
              className="sr-only peer"
            />
            <span
              className="block h-5 w-10 rounded-full bg-gray-300 peer-checked:bg-blue-500 transition-colors duration-300"
            ></span>
            <span
              className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"
            ></span>
          </span>
        </label>
      </div>


        </div>
        {/* Legal/Tax */}
        <div className="w-full flex flex-col gap-4">
          <h4 className="font-semibold text-md mb-2 text-gray-500">Legal / Tax</h4>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">GST Number</label>
          <input name="gst_number" value={branch.gst_number} ref={gstNumberRef } onChange={handleBranchChange} type="text" placeholder="GST Number" className="input w-full text-xs rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          <p className="text-red-500 text-xs mt-1">{errors.gst_number}</p>
          </div>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">Tax ID<span className="text-red-500 ml-1">*</span></label>
          <input name="tax_id" value={branch.tax_id} ref={taxIdRef } onChange={handleBranchChange} type="text" placeholder="Tax ID" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
           <p className="text-red-500 text-xs mt-1">{errors.tax_id}</p>
           </div>
           <div>
          <label className="font-semibold text-xs text-gray-500 w-full">Currency<span className="text-red-500 ml-1">*</span></label>    
                <select
            name="currency"
            ref={currencyRef }
            value={branch.currency || ''}
            onChange={handleBranchChange}
            className="input w-full rounded-sm text-xs border-gray-300 text-gray-400 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
          >
            <option value="">Select Currency</option>
            {currency.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          </div>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">Opening Date<span className="text-red-500 ml-1">*</span></label>
          
          
          <input name="opening_date" value={branch.opening_date} ref={openingDateRef } onChange={handleBranchChange} type="date" placeholder="Opening Date" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
 <p className="text-red-500 text-xs mt-1">{errors.opening_date}</p>
</div>
        </div>


<div className="w-full" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
      <h4 className="text-lg font-semibold text-gray-500">Employees<span className="text-red-500 ml-1">*</span></h4>
    </div>
    <label className="block text-sm font-medium text-gray-500">
      Select Employees
    </label>
  </div>
  
  <div className="relative">
    <button
      type="button"
      onClick={() => setDropdownOpen((prev) => !prev)}
      className={`
        relative w-full flex items-center justify-between bg-white border rounded-lg shadow-sm transition-all duration-200
        ${dropdownOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-300 hover:border-slate-400'}
        ${errors.users ? 'border-red-300' : ''}
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
      `}
      style={{padding: '12px 16px', textAlign: 'left'}}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          {branch.users.length > 0 ? (
            <>
              <div className="bg-blue-500 rounded-full" style={{width: '8px', height: '8px'}}></div>
              <span className="text-sm font-medium text-slate-700">
                {branch.users.length} employee{branch.users.length !== 1 ? 's' : ''} selected
              </span>
            </>
          ) : (
            <>
              <div className="bg-slate-300 rounded-full" style={{width: '8px', height: '8px'}}></div>
              <span className="text-sm text-slate-500">Select employees...</span>
            </>
          )}
        </div>
      </div>
      <svg 
        className={`text-slate-400 transition-transform duration-200 ${
          dropdownOpen ? 'rotate-180' : ''
        }`} 
        style={{width: '20px', height: '20px'}}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {dropdownOpen && (
      <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-lg" style={{marginTop: '8px'}}>
        <div style={{padding: '12px', borderBottom: '1px solid #e2e8f0'}}>
          <div className="relative">
            <svg 
              className="absolute text-slate-400" 
              style={{left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px'}}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              style={{paddingLeft: '40px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px'}}
            />
          </div>
        </div>
        
        <div className="overflow-y-auto" style={{maxHeight: '256px'}}>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => {
              const isSelected = branch.users.includes(String(emp.id));
              return (
                <label
                  key={emp.id}
                  className="flex items-center cursor-pointer hover:bg-slate-50 transition-colors duration-150"
                  style={{padding: '12px 16px', gap: '12px'}}
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      value={emp.id}
                      checked={isSelected}
                      onChange={(e) => {
                        const userId = e.target.value;
                        setBranch((prev) => ({
                          ...prev,
                          users: e.target.checked
                            ? [...prev.users, userId]
                            : prev.users.filter((id) => id !== userId),
                        }));
                      }}
                      className="sr-only"
                    />
                    <div 
                      className={`
                        rounded border-2 flex items-center justify-center transition-all duration-200
                        ${isSelected 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-slate-300 hover:border-slate-400'
                        }
                      `}
                      style={{width: '20px', height: '20px'}}
                    >
                      {isSelected && (
                        <svg className="text-white" style={{width: '12px', height: '12px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {emp.name || emp.email || `User ${emp.id}`}
                    </p>
                    {emp.email && emp.name && (
                      <p className="text-xs text-slate-500 truncate" style={{marginTop: '2px'}}>{emp.email}</p>
                    )}
                  </div>
                </label>
              );
            })
          ) : (
            <div className="text-center" style={{padding: '24px 16px'}}>
              <p className="text-sm text-slate-500">No employees found</p>
            </div>
          )}
        </div>
      </div>
    )}
  </div>

  {errors.users && (
    <p className="text-sm text-red-600 flex items-center" style={{gap: '4px'}}>
      <span className="text-red-500">⚠</span>
      {errors.users}
    </p>
  )}

  {branch.users.length > 0 && (
    <div className="bg-slate-50 rounded-lg border border-slate-200" style={{padding: '16px'}}>
      <div className="flex items-center justify-between" style={{marginBottom: '12px'}}>
        <h5 className="text-sm font-medium text-slate-700">Selected Employees</h5>
        <span className="text-xs text-slate-500 bg-slate-200 rounded-full" style={{padding: '4px 8px'}}>
          {branch.users.length}
        </span>
      </div>
      
      <div className="flex flex-wrap" style={{gap: '8px'}}>
        {branch.users.map((userId) => {
          const emp = employees.find((e) => e.id == userId);
          return (
            <div
              key={userId}
              className="flex items-center bg-white border border-slate-200 rounded-md shadow-sm group hover:shadow-md transition-all duration-200"
              style={{padding: '8px 12px', gap: '8px'}}
            >
              <div className="flex items-center flex-1 min-w-0" style={{gap: '8px'}}>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0" style={{width: '32px', height: '32px'}}>
                  <span className="text-xs font-medium text-white">
                    {(emp?.name || emp?.email || '').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {emp?.name || emp?.email || `User ${userId}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setBranch((prev) => ({
                    ...prev,
                    users: prev.users.filter((id) => id != userId),
                  }))
                }
                className="flex-shrink-0 flex items-center justify-center rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors duration-200"
                style={{width: '24px', height: '24px'}}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  )}
</div>


        {/* Button container */}
        <div className="flex flex-col sm:flex-row justify-end items-end gap-4 w-full">
          
          <button type="button" className="w-[120px] h-[35px] rounded-lg text-white font-bold text-xs border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleCloseModal}>
            Close
          </button>
          <button type="submit" onClick={handleSubmit} className="w-[120px] h-[35px] font-bold text-xs rounded-lg text-white border-none" style={{ backgroundColor:'#5E72e4' }}>
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
)}      
      
      
 {editModal &&  (
   <div className="fixed text-black inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
    <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[600px] h-[95vh] max-h-[95vh] flex flex-col overflow-y-auto gap-3" style={{padding:'20px'}}> 
      <div className='flex justify-between'>
      <h3 className="font-bold text-[22px] text-[#344767]">Edit Branch</h3> 
     <button onClick={handleCloseModal}>
    <X className="w-6 h-6 text-[#344767] cursor-pointer" />
      </button>

    </div>
      <hr className="my-4 border-gray-200" />
      <div className="flex flex-col flex-grow text-gray-600 gap-4 justify-center items-center w-full" >
        {/* Basic Info */}
        <div className="w-full flex flex-col gap-4">
          <h4 className="font-semibold text-md mb-2 text-[#344767]">Basic Info</h4>
          <div>
          <label className="font-semibold text-gray-500 text-xs w-full">Branch Name<span className="text-red-500 ml-1">*</span></label>
          <input name="name" value={branch.name} 
          ref={nameRef}
           onChange={handleBranchChange}
           type="text" placeholder="Branch Name"
           className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
           style={{paddingLeft:'12px'}} />
         <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          </div>
         <div>
          <label className="font-semibold text-gray-500 text-xs w-full">Branch Code<span className="text-red-500 ml-1">*</span></label>
          <input name="code"
           value={branch.code} 
           ref={codeRef }
           onChange={handleBranchChange} 
           type="text" placeholder="Branch Code" 
           className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" 
           style={{paddingLeft:'12px'}} />
           <p className="text-red-500 text-xs mt-1">{errors.code}</p>
           </div> 
           <div>
  <label className="font-semibold text-gray-500 text-xs w-full">Status</label>
  <select
    name="status"
    value={branch.status === true ? 'True' : branch.status === false ? 'False' : ''}
    onChange={(e) =>
      setBranch((prev) => ({
        ...prev,
        status: e.target.value === 'True',
      }))
    }
    style={{ paddingLeft: '12px' }}
    className="select w-full h-[35px] border-gray-200 bg-white focus:outline-none text-gray-400 rounded-sm focus:border-b-2 focus:border-blue-500"
  >
    <option value="">--select Status --</option>
    <option value="True">Active</option>
    <option value="False">Inactive</option>
  </select>
</div>


         <div>
          <label className="font-semibold   text-gray-500 text-xs text-[#344767] w-[100%]">
          Upload Logo:
          </label>
          <input
           type="file"
           name="logo"
           accept="image/*"
           style={{padding:'8px'}}
           className="input w-full  bg-white border text-gray-400 border-gray-300 rounded-sm focus:outline-none"
          onChange={handleBranchChange}
         />
          </div>
        </div>
        {/* Location */}
        <div className="w-full flex flex-col gap-4">
          <h4 className="font-semibold text-md mb-2 text-gray-500">Location</h4>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">Country<span className="text-red-500 ml-1">*</span></label>
          <select
            name="country"
            value={branch.country || ''}
            ref={countryRef }
            onChange={handleBranchChange}
            className="input w-full rounded-sm text-xs text-gray-400 border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
          >
            <option value="">Select Country</option>
            {country.map((item) => (
              <option key={item.id} value={item.id}>
                { item.name}
              </option>
            ))}
          </select>
             <p className="text-red-500 text-xs mt-1">{errors.country}</p>
      </div>
       <div>
          <label className="font-semibold text-gray-500  text-xs w-full">State<span className="text-red-500 ml-1">*</span></label>
          <select
            name="state"
            value={branch.state || ''}
            onChange={handleBranchChange}
            ref={stateRef }
            className="input w-full rounded-sm border-gray-300 text-gray-400 text-xs bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
          >
            <option value="">Select State</option>
            {state.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
     <p className="text-red-500 text-xs mt-1">{errors.state}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">District</label>
          <select
            name="district"
            value={branch.district || ''}
            onChange={handleBranchChange}
            className="input w-full rounded-sm border-gray-300 text-gray-400 text-xs bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
          >
            <option value="">Select District</option>
            {district.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
 <p className="text-red-500 text-xs mt-1">{errors.district}</p>

</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">City</label>
          <select
            name="city"
            value={branch.city || ''}
            onChange={handleBranchChange}
            className="input w-full rounded-sm text-xs border-gray-300 text-gray-400 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
          >

            <option value="">Select City</option>
            {city.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
</div>
<div>

          <label className="font-semibold text-gray-500 text-xs w-full">City Area</label>
          <select
            name="city_area"
            value={branch.city_area || ''}
            onChange={handleBranchChange}
            className="input w-full rounded-sm text-xs border-gray-300 text-gray-400 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
          >
            <option value="">Select City Area</option>
            {cityArea.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
     <p className="text-red-500 text-xs mt-1">{errors.city_area}</p>

</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Address</label>
          <textarea name="address" value={branch.address} onChange={handleBranchChange} placeholder="Address" className="textarea w-full border-gray-200 bg-white rounded-sm focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Pincode<span className="text-red-500 ml-1">*</span></label>
          <input name="pincode" ref={pincodeRef } value={branch.pincode} onChange={handleBranchChange} type="text" placeholder="Pincode" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
 <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
</div> 
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Latitude<span className="text-red-500 ml-1">*</span></label>
          <input name="latitude" ref={latitudeRef } value={branch.latitude} onChange={handleBranchChange} type="text" placeholder="Latitude" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
         <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Longitude<span className="text-red-500 ml-1">*</span></label>    
          <input name="longitude" ref={longitudeRef } value={branch.longitude} onChange={handleBranchChange} type="text" placeholder="Longitude" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
       <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>
</div>
        </div>
        {/* Contact */}
        <div className="w-full flex flex-col gap-4">
          <h4 className="font-semibold text-md mb-2 text-gray-500">Contact</h4>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">Primary Phone<span className="text-red-500 ml-1">*</span></label>
          <input name="primary_phone" ref={primaryPhoneRef } value={branch.primary_phone} onChange={handleBranchChange} type="text" placeholder="Primary Phone" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          <p className="text-red-500 text-xs mt-1">{errors.primary_phone}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Secondary Phone</label>
          <input name="secondary_phone" value={branch.secondary_phone} ref={secondaryPhoneRef} onChange={handleBranchChange} type="text" placeholder="Secondary Phone" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
        <p className="text-red-500 text-xs mt-1">{errors.secondary_phone}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Fax</label>
          <input name="fax" value={branch.fax} onChange={handleBranchChange} type="text" placeholder="Fax" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          <p className="text-red-500 text-xs mt-1">{errors.fax}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Email<span className="text-red-500 ml-1">*</span></label>
          <input name="email" value={branch.email} ref={emailRef} onChange={handleBranchChange} type="email" placeholder="Email" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
</div>
        </div>
        {/* HR/Management */}
        <div className="w-full  flex flex-col gap-4">
          <h4 className="font-semibold text-md mb-2 text-gray-500">HR / Management</h4>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">Manager Name</label>
         
          <input name="manager_name" value={branch.manager_name} onChange={handleBranchChange} type="text" placeholder="Manager Name" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          </div>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">HR Contact</label>
          <input name="hr_contact" value={branch.hr_contact} ref={hrContactRef} onChange={handleBranchChange} type="text" placeholder="HR Contact" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          <p className="text-red-500 text-xs mt-1">{errors.hr_contact}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">HR Email</label>
          <input name="hr_email" value={branch.hr_email} ref={hrEmailRef }  onChange={handleBranchChange} type="email" placeholder="HR Email" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          <p className="text-red-500 text-xs mt-1">{errors.hr_email}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Max Employee Capacity</label>
          <input name="max_employee_capacity" value={branch.max_employee_capacity || ''} onChange={handleBranchChange} type="number" placeholder="Max Employee Capacity" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
         <p className="text-red-500 text-xs mt-1">{errors.max_employee_capacity}</p>
</div>
<div>
          <label className="font-semibold text-xs text-gray-500 w-full">Working Hours<span className="text-red-500 ml-1">*</span></label>
          <input name="working_hours" ref={workingHoursRef } value={branch.working_hours} onChange={handleBranchChange} type="text" placeholder="Working Hours" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          <p className="text-red-500 text-xs mt-1">{errors.working_hours}</p>
</div>
          <div className="flex gap-6 mt-4">
  {/* Biometric Attendance Toggle */}
        <label className="flex items-center gap-3 text-sm font-medium text-gray-500 cursor-pointer">
          <span>Biometric Attendance</span>
          <span className="relative inline-block w-10 align-middle select-none">
            <input
              type="checkbox"
              name="has_biometric_attendance"
            
              checked={branch.has_biometric_attendance}
              onChange={handleBranchChange}
              className="sr-only peer"
            />
            <span
              className="block h-5 w-10 rounded-full bg-gray-300 peer-checked:bg-blue-500 transition-colors duration-300"
            ></span>
            <span
              className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"
            ></span>
          </span>
        </label>

        {/* Head Office Toggle */}
        <label className="flex items-center gap-3 text-sm font-medium text-gray-500 cursor-pointer">
          <span>Head Office<span className="text-red-500 ml-1">*</span></span>
          <span className="relative inline-block w-10 align-middle select-none">
            <input
              type="checkbox"
              name="is_head_office"
            
              checked={branch.is_head_office}
              onChange={handleBranchChange}
              className="sr-only peer"
            />
            <span
              className="block h-5 w-10 rounded-full bg-gray-300 peer-checked:bg-blue-500 transition-colors duration-300"
            ></span>
            <span
              className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"
            ></span>
          </span>
        </label>
      </div>


        </div>
        {/* Legal/Tax */}
        <div className="w-full flex flex-col gap-4">
          <h4 className="font-semibold text-md mb-2 text-gray-500">Legal / Tax</h4>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">GST Number</label>
          <input name="gst_number" value={branch.gst_number} ref={gstNumberRef } onChange={handleBranchChange} type="text" placeholder="GST Number" className="input w-full text-xs rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
          <p className="text-red-500 text-xs mt-1">{errors.gst_number}</p>
          </div>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">Tax ID<span className="text-red-500 ml-1">*</span></label>
          <input name="tax_id" value={branch.tax_id} ref={taxIdRef } onChange={handleBranchChange} type="text" placeholder="Tax ID" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
           <p className="text-red-500 text-xs mt-1">{errors.tax_id}</p>
           </div>
           <div>
          <label className="font-semibold text-xs text-gray-500 w-full">Currency<span className="text-red-500 ml-1">*</span></label>    
                <select
            name="currency"
            ref={currencyRef }
            value={branch.currency || ''}
            onChange={handleBranchChange}
            className="input w-full rounded-sm text-xs border-gray-300 text-gray-400 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
          >
            <option value="">Select Currency</option>
            {currency.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          </div>
          <div>
          <label className="font-semibold text-xs text-gray-500 w-full">Opening Date<span className="text-red-500 ml-1">*</span></label>
          
          
          <input name="opening_date" value={branch.opening_date} ref={openingDateRef } onChange={handleBranchChange} type="date" placeholder="Opening Date" className="input w-full rounded-sm border-gray-300 bg-white focus:outline-none focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} />
 <p className="text-red-500 text-xs mt-1">{errors.opening_date}</p>
</div>
        </div>


<div className="w-full" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
  <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
      <h4 className="text-lg font-semibold text-gray-500">Employees<span className="text-red-500 ml-1">*</span></h4>
    </div>
    <label className="block text-sm font-medium text-gray-500">
      Select Employees
    </label>
  </div>
  
  <div className="relative">
    <button
      type="button"
      onClick={() => setDropdownOpen((prev) => !prev)}
      className={`
        relative w-full flex items-center justify-between bg-white border rounded-lg shadow-sm transition-all duration-200
        ${dropdownOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-300 hover:border-slate-400'}
        ${errors.users ? 'border-red-300' : ''}
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
      `}
      style={{padding: '12px 16px', textAlign: 'left'}}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          {branch.users.length > 0 ? (
            <>
              <div className="bg-blue-500 rounded-full" style={{width: '8px', height: '8px'}}></div>
              <span className="text-sm font-medium text-slate-700">
                {branch.users.length} employee{branch.users.length !== 1 ? 's' : ''} selected
              </span>
            </>
          ) : (
            <>
              <div className="bg-slate-300 rounded-full" style={{width: '8px', height: '8px'}}></div>
              <span className="text-sm text-slate-500">Select employees...</span>
            </>
          )}
        </div>
      </div>
      <svg 
        className={`text-slate-400 transition-transform duration-200 ${
          dropdownOpen ? 'rotate-180' : ''
        }`} 
        style={{width: '20px', height: '20px'}}
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {dropdownOpen && (
      <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-lg shadow-lg" style={{marginTop: '8px'}}>
        <div style={{padding: '12px', borderBottom: '1px solid #e2e8f0'}}>
          <div className="relative">
            <svg 
              className="absolute text-slate-400" 
              style={{left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px'}}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
              style={{paddingLeft: '40px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px'}}
            />
          </div>
        </div>
        
        <div className="overflow-y-auto" style={{maxHeight: '256px'}}>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => {
              const isSelected = branch.users.includes(String(emp.id));
              return (
                <label
                  key={emp.id}
                  className="flex items-center cursor-pointer hover:bg-slate-50 transition-colors duration-150"
                  style={{padding: '12px 16px', gap: '12px'}}
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      value={emp.id}
                      checked={isSelected}
                      onChange={(e) => {
                        const userId = e.target.value;
                        setBranch((prev) => ({
                          ...prev,
                          users: e.target.checked
                            ? [...prev.users, userId]
                            : prev.users.filter((id) => id !== userId),
                        }));
                      }}
                      className="sr-only"
                    />
                    <div 
                      className={`
                        rounded border-2 flex items-center justify-center transition-all duration-200
                        ${isSelected 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-slate-300 hover:border-slate-400'
                        }
                      `}
                      style={{width: '20px', height: '20px'}}
                    >
                      {isSelected && (
                        <svg className="text-white" style={{width: '12px', height: '12px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {emp.name || emp.email || `User ${emp.id}`}
                    </p>
                    {emp.email && emp.name && (
                      <p className="text-xs text-slate-500 truncate" style={{marginTop: '2px'}}>{emp.email}</p>
                    )}
                  </div>
                </label>
              );
            })
          ) : (
            <div className="text-center" style={{padding: '24px 16px'}}>
              <p className="text-sm text-slate-500">No employees found</p>
            </div>
          )}
        </div>
      </div>
    )}
  </div>

  {errors.users && (
    <p className="text-sm text-red-600 flex items-center" style={{gap: '4px'}}>
      <span className="text-red-500">⚠</span>
      {errors.users}
    </p>
  )}

  {branch.users.length > 0 && (
    <div className="bg-slate-50 rounded-lg border border-slate-200" style={{padding: '16px'}}>
      <div className="flex items-center justify-between" style={{marginBottom: '12px'}}>
        <h5 className="text-sm font-medium text-slate-700">Selected Employees</h5>
        <span className="text-xs text-slate-500 bg-slate-200 rounded-full" style={{padding: '4px 8px'}}>
          {branch.users.length}
        </span>
      </div>
      
      <div className="flex flex-wrap" style={{gap: '8px'}}>
        {branch.users.map((userId) => {
          const emp = employees.find((e) => e.id == userId);
          return (
            <div
              key={userId}
              className="flex items-center bg-white border border-slate-200 rounded-md shadow-sm group hover:shadow-md transition-all duration-200"
              style={{padding: '8px 12px', gap: '8px'}}
            >
              <div className="flex items-center flex-1 min-w-0" style={{gap: '8px'}}>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0" style={{width: '32px', height: '32px'}}>
                  <span className="text-xs font-medium text-white">
                    {(emp?.name || emp?.email || '').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {emp?.name || emp?.email || `User ${userId}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setBranch((prev) => ({
                    ...prev,
                    users: prev.users.filter((id) => id != userId),
                  }))
                }
                className="flex-shrink-0 flex items-center justify-center rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors duration-200"
                style={{width: '24px', height: '24px'}}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  )}
</div>


        {/* Button container */}
        <div className="flex flex-col sm:flex-row justify-end items-end gap-4 w-full">
          
          <button type="button" className="w-[120px] h-[35px] rounded-lg text-white font-bold text-xs border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleCloseModal}>
            Close
          </button>
          <button type="submit" onClick={handleEditSubmit} className="w-[120px] h-[35px] font-bold text-xs rounded-lg text-white border-none" style={{ backgroundColor:'#5E72e4' }}>
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
                                )}
      
                         
                    </>)
     }
     
     export default Branches;