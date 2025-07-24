import React, { useEffect, useState } from 'react';
import '@fontsource/open-sans'; // Default weight 400
import '@fontsource/open-sans/600.css'; // Semi-bold
import '@fontsource/open-sans/700.css'; // Bold
import { Link } from 'react-router-dom';
 import Pagination from '../../components/Pagination';
 import CustomScrollbar from "../../components/CustomScrollbar";
 import EditButton from '../../components/EditButton';
 import { useParams ,useLocation} from 'react-router-dom';
import DeleteButton from '../../components/DeleteButton';
import BranchModel from '../../models/branchModel';
import employeeModel from '../../models/employeeModel';
import TableSkelton from '../../components/tableSkelton';
import employeeGenderModel from '../../models/employeeGenderModel';
import employeePositionModel from '../../models/employeePositionModel';
import employeeDepartmentModel from '../../models/employeeDepartmentModel';
import countryModel from '../../models/countryModel'
import CityModel from "../../models/CityModel"
import CurrencyModel from "../../models/CurrencyModel";
import StateModel from "../../models/stateModel";
import DistrictModel from '../../models/districtModel'
import CityAreaModel from "../../models/cityAreaModel";
import CreateButton from '../../components/CreateButton';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRef } from 'react';
const BranchWiseEmployee = () => {
 const[limit,setLimit]=useState(10); 
const [modal, setModal] = useState(false)  
const[addEmployeeModal,setEmployeeModal]  = useState(false)
const [formErrors, setFormErrors] = useState([]);
const [editModal,setEditModal]= useState(false)
const [totalPages, setTotalPages] = useState(1);
 const [dropdownOpen, setDropdownOpen] = useState(false);
const[mapEmployees,setMapEmployees] = useState([])
   const [isLoading, setIsLoading] = useState(true);
const [employees,setEmployees] = useState([])
 const[page,setPage]=useState(1);  
const {id} = useParams()
const location = useLocation();
const[branch,setBranch]= useState( null)
const [assignedEmployee,setAssignedEmployee]= useState([])
const[branchEmployee,setBranchEmployee] = useState([])
const[loading,setLoading] = useState(false)
const [searchTerm, setSearchTerm] = useState('');
const auth= useSelector((state) => state.auth);
const { login_id ,can_manage_user_types,} = auth;  
const user_id = login_id;
const user_types = Object.keys(can_manage_user_types).join(',');
const [genders, setGenders] = useState([]);
const [positions, setPositions] = useState([]);
const [departments, setDepartments] = useState([]);
const [countries, setCountries] = useState([]);
const [states, setStates] = useState([]);
const [districts, setDistricts] = useState([]);
const [cities, setCities] = useState([]);
const [cityAreas, setCityAreas] = useState([]);
const [branches, setBranchesList] = useState([]);
const [currencies, setCurrencies] = useState([]);
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


console.log(branchEmployee)
console.log(assignedEmployee)
console.log(mapEmployees)
console.log(employees)

  // Dummy employee data
const handleAssignEmployee = async () => {
  try {
    let formData = new FormData();
    formData.append("branch_id", id);

    // Append each employee ID
    branchEmployee.forEach((item) => {
      formData.append("user_ids", item);
    });

    // Optional: log form data for debug
    console.log("Submitting employee assignment with:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    // Send request
    const res = await BranchModel.assignEmployee(formData);
     toast.success("succes")
     await branchEmployees();
await fetchEmployees();
     await refreshBranch(); 
     await fetchRefreshEmployees()   
      setModal(false)
     console.log("Success:", res);
    // Optionally show toast or reset state here

  } catch (error) {
    console.error("Error assigning employees:", error);
  }
};
const handleInputChange = (e) => {
                    const { name, value, type, files } = e.target;
                    setEmployeeForm((prev) => ({
                      ...prev,
                      [name]: type === "file" ? files[0] : value,
                    }));
                  };

const handleCloseModal =()=>{
      setBranchEmployee([])
      setModal(false)
      }
const allFields = Object.keys(employeeForm);


const fieldRefs = useRef(
     allFields.reduce((acc, field) => {
     acc[field] = React.createRef();
     return acc;
        }, {})
     );

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

                  // Format validations
                  if (form.pincode && !/^\d{6}$/.test(form.pincode)) {
                    errors.pincode = "Pincode must be 6 digits";
                  }

                  if (form.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(form.pan_number)) {
                    errors.pan_number = "PAN number format is invalid";
                  }

                  if (form.aadhaar_number && !/^\d{12}$/.test(form.aadhaar_number)) {
                    errors.aadhaar_number = "Aadhaar number must be 12 digits";
                  }

                  if (form.bank_account && !/^\d{9,18}$/.test(form.bank_account)) {
                    errors.bank_account = "Bank account must be 9–18 digits";
                  }

                  if (
                    form.email &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
                  ) {
                    errors.email = "Email is invalid";
                  }

                  if (
                    form.phone_number &&
                    !/^\d{10}$/.test(form.phone_number)
                  ) {
                    errors.phone_number = "Phone number must be 10 digits";
                  }

                  return errors;
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
  const handleEmployeeCloseModal =()=>{
    setEmployeeModal(false)
    setTimeout(()=>setModal(true),300)
    fetchEmployees();

  }

const handleSubmit = async (e) => {
      e.preventDefault();
      const validationErrors = validateForm(employeeForm);

      console.log(validationErrors)
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
                                 setEmployeeModal(false)
                               setModal(true);
                               await fetchEmployees()
                             } else {
                               toast.error("Unexpected response from server.");
                             }
 
                           } catch (error) {
                             console.error("Failed to create employee:", error);
 
                             toast.error(
                              
                                 "Something went wrong while submitting."
                               
                             );
                           }
                         };
 const getValueFromId = (id, field, key = 'name') => {
                  if (!Array.isArray(field)) return '—'; // Ensure it's a valid array
                  const item = field.find((entry) => entry?.id === id);
                  return item?.[key] || '—'; // Safe access
                };

const filteredEmployees = mapEmployees.filter(emp => 
                    (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase())
                  );


console.log(filteredEmployees)

const branchEmployees = async () =>{
  try{
     const res = await BranchModel.getEmployeeAssign()
     const allBranchData = res?.data?.data
     console.log(allBranchData)
     const filteredData = allBranchData.filter((item)=>item.branch_id == id)
     setAssignedEmployee(filteredData)
  }catch(error){
   console.error(error)
  }
}   

const handleAddEmployee=()=>{
    setEmployeeModal(true)
    setModal(false)
}

const fetchGenericData = async () => {
  try {
    const [genderRes, positionRes, departmentRes] = await Promise.all([
      employeeGenderModel.getGenders(user_id, user_types, 1000),
      employeePositionModel.getPositions(user_id, user_types, 1000),
      employeeDepartmentModel.getDepartments(user_id, user_types, 1000)
    ]);

    setGenders(genderRes?.data?.data || []);
    setPositions(positionRes?.data?.data || []);
    setDepartments(departmentRes?.data?.data || []);
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
  }
};

      
const fetchEmployees = async () => {
  setIsLoading(true); // Start loading
  try {
    const res = await employeeModel.getEmployees(user_id, user_types, 1000);
    const allEmployees = res?.data?.data || [];

 
    

  
    const assignedUserIds = assignedEmployee.flatMap(branch => (branch.user_ids || []).map(Number));

    
    const unassignedEmployees = allEmployees.filter(employee =>
      !assignedUserIds.includes(Number(employee.id))
    );

    console.log('Unassigned employees:', unassignedEmployees);

 
    setMapEmployees(unassignedEmployees);

  } catch (error) {
    console.error('Error fetching employees:', error);
    setMapEmployees([]); 
  } finally {
    setIsLoading(false); // End loading
  }
};

const refreshBranch = async () => {
  try {
    const res = await BranchModel.getBranches(user_id, user_types, 1000);
    const branches = res?.data?.data || [];
    const found = branches.find((b) => String(b.id) === String(id));
    setBranch(found || null);
  } catch (error) {
    console.error('Error refreshing branch:', error);
  }
};


 const fetchRefreshEmployees = async () => {
      try {
        const res = await employeeModel.getEmployees(user_id, user_types, 1000);
        const allEmployees = res?.data?.data || [];
        setTotalPages(res.data.pagination.pages);

        if (branch && branch.users?.length) {
          const filtered = allEmployees.filter((emp) =>
            branch.users.includes(emp.id)
          );
         setEmployees(filtered);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
      finally{
        setLoading(false)
      }
    };


 useEffect(() => {
    let isMounted = true;

    const fetchEmployees = async () => {
      try {
        const res = await employeeModel.getEmployees(user_id, user_types, 1000);
        const allEmployees = res?.data?.data || [];

        if (branch && branch.users?.length) {
          const filtered = allEmployees.filter((emp) =>
            branch.users.includes(emp.id)
          );
          if (isMounted) setEmployees(filtered);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    if (branch) {
      fetchEmployees();
    }

    return () => {
      isMounted = false;
    };
  }, [branch, user_id, user_types]);

  useEffect(() => {
    let isMounted = true;

    const fetchBranch = async () => {
      // if (location?.state?.branch) {
      //   setBranch(location.state.branch);
      //   return;
      // }

      try {
        setLoading(true);
        const res = await BranchModel.getBranches(user_id, user_types, 1000);
        const branches = res?.data?.data || [];
        const found = branches.find((b) => String(b.id) === String(id));
        if (isMounted) setBranch(found || null);
      } catch (error) {
        console.error('Error fetching branch:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBranch();

    return () => {
      isMounted = false;
    };
  }, [location, user_id, user_types, id]);

useEffect(()=>{
fetchGenericData()
},[])

// 1. Fetch assigned employees on mount
useEffect(() => {
  branchEmployees();
}, []);

// 2. When assignedEmployee changes, fetch unassigned employees
useEffect(() => {
  if (assignedEmployee.length > 0) {
    fetchEmployees();
  }
}, [assignedEmployee]);
 
   useEffect(() => {
      const fetchCountries = async () => {
         try {
             const res = await countryModel.getCountries(user_id, user_types, 1000);
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
                 const res = await StateModel.getStates(user_id, user_types, 1000);
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
                          const res = await DistrictModel.getDistricts(user_id, user_types, 1000);
                          setDistricts(res?.data?.data || res?.data || []);
                        } catch (err) {
                          console.error("Error loading districts:", err);
                        }
                      };
                      fetchDistricts();
                    }, []);
                    

                    useEffect(() => {
                      const fetchCities = async () => {
                        try {
                          const res = await CityModel.getCities(user_id, user_types, 1000);
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
                          const res = await CityAreaModel.getCityAreas(user_id, user_types, 1000);
                          setCityAreas(res?.data?.data || res?.data || []);
                        } catch (err) {
                          console.error("Error loading city areas:", err);
                        }
                      };
                      fetchCityAreas();
                    }, []);

        useEffect(() => {
               const fetchCurrencies = async () => {
                 try {
                  const res = await CurrencyModel.getCurrency(user_id, user_types, 1000);
                   setCurrencies(res?.data?.data || res?.data || []);
                  } catch (err) {
                   console.error("Error loading currencies:", err);
                 }
              };
                fetchCurrencies();
           }, []);

  return (
    <>
      <CustomScrollbar/>
      
      <div 
        className="bg-white w-full
          max-w-[99vw] 
          xl:max-w-[90vw] 
          2xl:max-w-[95vw] 
          h-auto max-h-[70vh] 
          rounded-xl px-4 md:px-8 lg:px-12
          mx-auto overflow-auto custom-scrollbar"
        style={{ fontFamily: 'Open Sans', overflow: 'auto' }}
      >
        <CreateButton
            buttoncontent="Assign Employee"
            onClick={() => setModal(true)}  // This will now work!
             />                 
         <ItemsPerPageSelector items={limit} setItems={setLimit} />

        <table className="table w-full text-sm text-[#A8B2C4] border-collapse min-w-[1300px]" 
          style={{ borderSpacing: '0 12px', borderCollapse: 'separate' }}>
          <thead className="text-xs text-[#A8B2C4] uppercase bg-white">
            <tr>
              <th className='min-w-[100px]' style={{paddingLeft:'20px'}}>SL NO</th>
              <th className='min-w-[200px]'>Name</th>
              <th className='min-w-[200px]'>Gender</th>
              <th className='min-w-[150px]'>Position</th>
              <th className='min-w-[150px]'>Department</th>
              <th className='min-w-[150px]'>Salary</th>
              <th className='min-w-[150px]'>Bank Account </th>
              <th className='min-w-[150px]'>Status</th>
             
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
) :employees.map((employee, index) => (
              <tr key={employee.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                <td className="px-6 py-5 border-b border-gray-200 text-sm" style={{paddingLeft:'20px'}}>{index + 1}</td>
                <td className="px-6 py-5 border-b border-gray-200 text-xs">{employee.name}</td>
                <td className="px-6 py-5 border-b border-gray-200 text-xs">{getValueFromId(employee.gender,genders) }</td>
                <td className="px-6 py-5 border-b border-gray-200 text-xs">{getValueFromId(employee.position,positions)}</td>
                <td className="px-6 py-5 border-b border-gray-200 text-xs">{ getValueFromId( employee.department,departments)}</td>
                <td className="px-6 py-5 border-b border-gray-200 text-xs">{employee.salary}</td>
                <td className="px-6 py-5 border-b border-gray-200 text-xs">{employee.bank_account}</td>
                 <td className="px-6 py-5 border-b border-gray-200 text-xs">
                          <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{padding: '2px 6px'}}>ACTIVE</span>
                          </td>                
                <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />      </div>
 {modal && (
   <div className="fixed text-gray-400 inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
   <div className="bg-white rounded-xl shadow-md  w-[90vw] max-w-[500px] h-[95vh] max-h-[550px] flex flex-col overflow-y-auto gap-3" style={{padding:'20px'}}> 
   <div className="w-full" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
   <div  className='flex flex-row justify-between'>
    <h4 className="text-lg font-semibold text-gray-500">Employees<span className="text-red-500 ml-1">*</span></h4>
   <button
   onClick={handleAddEmployee}
        className="text-xs font-bold"
        style={{
          width: '130px',
          height: '25px',
          borderRadius: '8px',
          background: 'linear-gradient(to right, #7F60E4, #6170E4)',
          color: 'white',
          transition: 'background-color 0.3s ease',
          cursor: 'pointer',
        }}
       
      >
        Add New Employee
      </button>
    </div>
    <label className="block text-sm font-medium text-gray-500">
      Select Employees
    </label>
    
  
   <div className="relative">
    <button
      type="button"
      onClick={() => setDropdownOpen((prev) => !prev)}
      className={`
        relative w-full flex items-center justify-between bg-white border rounded-lg shadow-sm transition-all duration-200
        ${dropdownOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-300 hover:border-slate-400'}
       
        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
      `}
      style={{padding: '12px 16px', textAlign: 'left'}}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
          {branchEmployee.length > 0 ? (
            <>
              <div className="bg-blue-500 rounded-full" style={{width: '8px', height: '8px'}}></div>
              <span className="text-sm font-medium text-slate-700">
                {branchEmployee.length} employee{branchEmployee.length !== 1 ? 's' : ''} selected
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
              const isSelected = branchEmployee.includes(String(emp.id));
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
                      setBranchEmployee((prev) =>
                        e.target.checked
                          ? [...prev, userId] // Add if checked
                          : prev.filter((id) => id !== userId) // Remove if unchecked
                      );
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

  {/* {errors.users && (
    <p className="text-sm text-red-600 flex items-center" style={{gap: '4px'}}>
      <span className="text-red-500">⚠</span>
      {errors.users}
    </p>
  )} */}

  {branch.users.length > 0 && (
    <div className="bg-slate-50 rounded-lg border border-slate-200" style={{padding: '16px'}}>
      <div className="flex items-center justify-between" style={{marginBottom: '12px'}}>
        <h5 className="text-sm font-medium text-slate-700">Selected Employees</h5>
        <span className="text-xs text-slate-500 bg-slate-200 rounded-full" style={{padding: '4px 8px'}}>
          {branchEmployee.length}
        </span>
      </div>
      
     <div className="flex flex-wrap" style={{ gap: '8px' }}>
  {branchEmployee.map((userId) => {
    const numericId = Number(userId?.toString().trim());
    const emp = mapEmployees.find((e) => e.id === numericId);
    
    console.log(' Employee:', employees); // 👈 This logs each matched employee
    console.log('Mapped Employee:', emp); // 👈 This logs each matched employee

    return (
      <div
        key={userId}
        className="flex items-center bg-white border border-slate-200 rounded-md shadow-sm group hover:shadow-md transition-all duration-200"
        style={{ padding: '8px 12px', gap: '8px' }}
      >
        <div className="flex items-center flex-1 min-w-0" style={{ gap: '8px' }}>
          <div
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: '32px', height: '32px' }}
          >
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
              users: prev.users.filter((id) => id !== userId),
            }))
          }
          className="flex-shrink-0 flex items-center justify-center rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors duration-200"
          style={{ width: '24px', height: '24px' }}
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
<div className=' flex flex-row justify-end items-end gap-4 h-[60%]'>
    <button  className="btn border-none text-white font-bold text-xs rounded-lg"
        style={{
          width: '80px',
          padding: '5px',
          height: '35px',
          background: 'linear-gradient(to right, #A1B1D1, #697C9B)',
          cursor: 'pointer',
        }} onClick={handleCloseModal}> close </button>

  <button
      type="button"
      className="btn border-none text-white font-bold text-xs rounded-lg"
      style={{
        width: '80px',
        height: '35px',
        padding: '5px',
        background:'linear-gradient(to right, #6170E4, #7F60E4)'
         ,
        transition: 'background 0.3s ease',
        cursor: 'pointer',
      }}
      onClick={handleAssignEmployee}
     
    >
     Submit
    </button>
  
  </div>

</div>
</div>
     )}

      {addEmployeeModal && (
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
                                   value={employeeForm.gender}
                                   onChange={handleInputChange}
                                   > 
                                          
                                   <option value="">--Select Gender--</option>

                                       {genders.map((gender) => (
                                      <option key={gender.id} value={gender.id}>
                                        {gender.name}
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
                                    onChange={handleInputChange}
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
                                    value={employeeForm.emergency_contact_number}
                                    onChange={handleInputChange}
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
                                <label className="text-xs text-gray-600" >Is Branch <span className="text-red-500 text-[14px]">*</span>
                               </label>
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
                              <button type="button" className="btn border-none w-[100px] rounded-lg text-white" style={{ backgroundColor: '#8392ab' }} onClick={handleEmployeeCloseModal}>
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
                        
    </>
  );
};

export default BranchWiseEmployee;