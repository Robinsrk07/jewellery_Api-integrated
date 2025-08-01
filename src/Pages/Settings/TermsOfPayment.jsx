import { useEffect, useState,useRef} from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import TermsOfPaymentModel from "../../models/TermsOfPaymentModel";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import TableSkelton from "../../components/tableSkelton";
     
     const  TermsOfPayment = () => {
     
          

  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [termsData, setTermsData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);


  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
                        name: '',
                        branch: '',
   
                      });
  const [editErrors, setEditErrors] = useState({});



  const [editingTerms, setEditingTerms] = useState({
    id: null,
    name: '',
    description: '',
    branch: '',
    status: '',
  });

const createNameRef = useRef(null);
const createBranchRef = useRef(null);

// Edit Modal Refs
const editNameRef = useRef(null);
const editBranchRef = useRef(null);

  const auth = useSelector((state) => state.auth);
  const { login_id, can_manage_user_types } = auth;
  const user_id = login_id;
  const user_types = Object.keys(can_manage_user_types || {}).join(',');

                        const fetchTermsOfPayments = async () => {
                          setIsLoading(true);
                          try {
                            const response = await TermsOfPaymentModel.getTermsOfPayments(
                              user_id,
                              user_types,
                              limit,
                              page,
                              search,
                              status
                            );

                            if (response?.data?.data) {
                              setTermsData(response.data.data);
                              setTotalPages(response.data.pagination?.pages );
                            }
                          } catch (error) {
                            console.error("Error fetching state data:", error);
                            toast.error("Failed to fetch states.");
                          } finally {
                            setIsLoading(false);
                          }
                        };

  useEffect(() => {
    fetchTermsOfPayments();
  }, [limit, page, search, status]);



                      const [branches, setBranches] = useState([]);

                        useEffect(() => {
                        fetchBranches();
                      }, []);


                      const fetchBranches = async () => {
                        try {
                          const response = await TermsOfPaymentModel.getBranches(user_id);
                          if (response?.data?.data) {
                            setBranches(response.data.data);
                          } else {
                            toast.error("Failed to load branches");
                          }
                        } catch (error) {
                          console.error("Error fetching branches:", error);
                          toast.error("Error fetching branches");
                        }
                      };


                    const getBranchName = (id) => {
                    const branch = branches.find((b) => b.id === id);
                      return branch ? branch.name : "N/A";
                    };


const [addTermData, setAddTermData] = useState({
  name: '',
  description: '',
  branch: '',
  status: '',
});



const validateTerm = () => {
  const newErrors = {};

 const nameRegex = /^[a-zA-Z0-9 ]{3,50}$/; // Letters, numbers, spaces. 3-50 characters.

if (!addTermData.name.trim()) {
  newErrors.name = 'Please enter name';
} else if (!nameRegex.test(addTermData.name.trim())) {
  newErrors.name = 'Name must be 3-50 characters, letters or numbers only';
}


  if (!addTermData.branch) {
    newErrors.branch = 'Please select a branch';
  }

  return newErrors;
};


const handleAddTermChange = (e) => {
  const { name, value } = e.target;

  setAddTermData((prev) => ({
    ...prev,
    [name]: name === 'status' ? value === 'true' : value,
  }));

  // Optional: clear individual field errors while typing
  setErrors((prev) => ({
    ...prev,
    [name]: '',
  }));
};

const focusFirstCreateError = (errors) => {
  if (errors.name) createNameRef.current?.focus();
  else if (errors.branch) createBranchRef.current?.focus();
};

const focusFirstEditError = (errors) => {
  if (errors.name) editNameRef.current?.focus();
  else if (errors.branch) editBranchRef.current?.focus();
};

useEffect(() => {
}, [addTermData]);


const handleSubmitTerm = async () => {
   const validationErrors = validateTerm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    focusFirstCreateError(validationErrors); // ✅ ADD THIS
    return;
  }

  const payload = {
    name: addTermData.name.trim(),
    description: addTermData.description?.trim() || '',
    branch: parseInt(addTermData.branch),
    status: addTermData.status === true || addTermData.status === 'true',
  };

  try {
    const response = await TermsOfPaymentModel.createTerm(payload);

    if (response.status === 201 || response.status === 200) {
      fetchTermsOfPayments();        
      handleCloseModal();   
      toast.success('Terms of Payment created successfully!');
    }
  } catch (error) {
            const message =
            error?.response?.data?.errors?.name?.[0] ||
            error?.response?.data?.message ||
            "Failed to create Currency !";
            toast.error(message);
            if (error.response?.data?.errors) {
            setErrors(prev => ({
            ...prev,
            ...error.response.data.errors,
             }));
                 }
                        } 
};



const [editingTerm, setEditingTerm] = useState({
  id: '',
  name: '',
  description: '',
  branch: '',
  status: ''
});



  const validateEditTerm = () => {
  let valid = true;
  const newErrors = {
    name: '',
    description: '',
    branch: '',
    status: ''
  };

  
const nameRegex = /^[a-zA-Z0-9 ]{3,50}$/; // Letters, numbers, spaces. 3-50 characters.

if (!editingTerm.name.trim()) {
  newErrors.name = 'Please enter name';
} else if (!nameRegex.test(editingTerm.name.trim())) {
  newErrors.name = 'Name must be 3-50 characters, letters or numbers only';
}



  if (!editingTerm?.branch) {
    newErrors.branch = 'Branch is required';
    valid = false;
  }


  setEditErrors(newErrors);
  return valid;
};


const handleEditClickTerm = (termObj) => {
  if (!termObj || typeof termObj !== 'object' || !termObj.id) {
    toast.error("Invalid term selected.");
    return;
  }

  setEditingTerm({
    id: termObj.id,
    name: termObj.name,
    description: termObj.description,
    branch: termObj.branch?.toString(),
    status: termObj.status?.toString(),
  });

  setEditModal(true);
};


const handleEditTermChange = (e) => {
  const { name, value } = e.target;

  setEditingTerm((prev) => ({
    ...prev,
    [name]: name === 'status' ? value === 'true' : value,
  }));
};


const handleEditSubmitTerm = async () => {
  if (!editingTerm?.id) {
    toast.error("Invalid term selected for editing.");
    return;
  }

  const newErrors = {
    name: '',
    description: '',
    branch: '',
    status: ''
  };

  let valid = true;
  const nameRegex = /^[a-zA-Z0-9 ]{3,50}$/;

  if (!editingTerm.name.trim()) {
    newErrors.name = 'Please enter name';
    valid = false;
  } else if (!nameRegex.test(editingTerm.name.trim())) {
    newErrors.name = 'Name must be 3-50 characters, letters or numbers only';
    valid = false;
  }

  if (!editingTerm?.branch) {
    newErrors.branch = 'Branch is required';
    valid = false;
  }

  setEditErrors(newErrors);

  if (!valid) {
    focusFirstEditError(newErrors); // ✅ ADD THIS
    return;
  }

  setIsSubmitting(true);

  const payload = {
    name: editingTerm.name.trim(),
    description: editingTerm.description.trim(),
    branch: parseInt(editingTerm.branch),
    status: editingTerm.status === true || editingTerm.status === 'true',
  };

  try {
    const response = await TermsOfPaymentModel.updateTerm(editingTerm.id, payload);

    if (response.status === 200) {
      fetchTermsOfPayments();
      toast.success('Term of Payment updated successfully!');
      setEditModal(false);
    }
  } catch (error) {
            const message =
            error?.response?.data?.errors?.name?.[0] ||
            error?.response?.data?.message ||
            "Failed to create Currency !";
            toast.error(message);
            if (error.response?.data?.errors) {
            setErrors(prev => ({
            ...prev,
            ...error.response.data.errors,
             }));
                 }
                        }  finally {
    setIsSubmitting(false);
  }
};









const handleDeleteTerm = async (id) => {
  if (!id) return;

  try {
    await TermsOfPaymentModel.deleteTerm(id);

    // Remove deleted term from local state
    setTermsData((prevData) => prevData.filter((item) => item.id !== id));

    // Close modal if open
    if (modal && typeof modal.close === 'function') {
      modal.close();
    }

    toast.success('Terms of Payment deleted successfully');
  } catch (error) {
    console.error("Error deleting Terms of Payment:", error);
    toast.error('Failed to delete Terms of Payment');
  }
};

                  
                   // Handle close modal
                 
                   const handleEditCloseModal = () => {
                     setEditModal(false)
                     setEditingTerm(null)
                     setEditErrors({
                      name:'',
                      branch:''

                    })
                   };
                 
                  const handleCloseModal = () => {
                    setErrors({
                        name:'',
                        branch:''
                    })
                     setModal(false);
                     setEditModal(false)
                     setAddTermData({
                      name:'',
                      branch:''
                     })
                   };         
                 
                 
                 
                   return (
                     
                 <>
                 <CustomScrollbar/>
                <div className="bg-white w-full
                    max-w-[99vw] 
                    xl:max-w-[90vw] 
                    2xl:max-w-[95vw] 
                    h-auto max-h-[70vh] 
                    rounded-xl px-4 md:px-8 lg:px-12
                    mx-auto overflow-auto  custom-scrollbar"
                 style={{ fontFamily: 'Open Sans',overflow:'auto'}}
                   >
                                 
                              <CreateButton
                                buttoncontent="+ New Terms"
                                onClick={() => setModal(true)}  
                              />  
                         
                          <ItemsPerPageSelector items={limit} setItems={setLimit} />
                 
                 
                      <table
                        className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1000px] flex items-justify"
                        style={{ borderSpacing: '0 12px', borderCollapse: 'separate', tableLayout: 'fixed' }}
                      >
                        <thead className="text-xs text-gray-400 uppercase bg-white">
                          <tr>
                            <th style={{ width: '80px', paddingLeft: '40px' }}>SL NO</th>
                            <th style={{ width: '80px' }}>NAME</th>
                            <th style={{ width: '80px'}}>BRANCH</th>
                            <th style={{ width: '80px' }}>DESCRIPTION</th>
                            <th style={{ width: '80px'}}>STATUS</th>
                            <th style={{ width: '80px' }}>ACTION</th>
                          </tr>
                        </thead>

                       <tbody>
                        {isLoading ? (
                          <TableSkelton />
                         ) : termsData.length === 0 ? (
                        <tr>
                          <td className="text-center py-4 text-gray-500 text-sm" colSpan="5">
                            No data available
                        </td>
                      </tr>
                      ) : (
                        termsData.length > 0 ? (
                          termsData.map((term, index) => (
                            <tr key={term.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                              <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '50px' }}>
                                {index + 1}
                              </td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{term.name}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{getBranchName(term.branch)}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{term.description}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">
                                {term.status ? (
                                  <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                      Active
                                  </span>
                                  ) : (
                                  <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                    INACTIVE
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                  <EditButton
                                    onClick={()=>handleEditClickTerm(term)}
                                  />
                                  <DeleteButton 
                                      buttonText="Delete " 
                                      modalId={`delete_modal_${term.id}`} 
                                      onConfirmDelete={() => handleDeleteTerm(term.id)} 
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-4 text-gray-400 text-sm">
                              No Terms of Payment found.
                            </td>
                          </tr>
                        )
                      )}
                      </tbody>

                       </table>
                       
                 
                       {/* Pagination */}
                         <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

                 
                       {/* Modal */}
                      </div>
      
                      {modal && (
                           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[480px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Create Terms Of Payment                    </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-4"> {/* Added flex-grow */}
                                   
                                      <div>
                                      <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                         ref={createNameRef}
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        value={addTermData.name}
                                        onChange={handleAddTermChange}
                                        name="name"
                                      />
                                      <p className="text-xs text-red-400">{errors.name}</p>
                                      
                                      </div>

                                      
                                      <div className="w-full flex flex-col gap-2">
                                                  <label className="text-xs font-bold text-[#344767]">
                                                    Branch <span className="text-xs text-red-400">*</span>
                                                  </label>
                                                  <select
                                                    name="branch"
                                                      ref={createBranchRef}
                                                    value={addTermData.branch}
                                                    onChange={handleAddTermChange}
                                                    className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                                    style={{ paddingLeft: '12px' ,fontSize: '14px'}}
                                                  >
                                                    <option value="">Select Branch</option>
                                                    {branches.map((branch) => (
                                                      <option key={branch.id} value={branch.id}>
                                                        {branch.name}
                                                      </option>
                                                    ))}
                                                  </select>
                                                  {errors.branch && (
                                                    <span className="text-red-500 text-xs mt-1">{errors.branch}</span>
                                                  )}
                                                </div>

                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Description:
                                      </label>

                                      <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                        placeholder="Description" 
                                        style={{paddingLeft:'12px',color: '#374151',}}
                                       value={addTermData.description}
                                       onChange={handleAddTermChange}
                                        name="description"
                                      ></textarea>
                            
                                           
                                            {/* <label 
                                                
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Status:
                                            </label>
                                            <select defaultValue=""
                                                className="select w-[100%] h-[35px] bg-white border-gray-300 text-gray-500 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                style={{paddingLeft:'12px'}}
                                                value={addTermData.status}
                                                onChange={handleAddTermChange}
                                                name='status'
                                               
                                            >
                                                <option value="" className=" text-gray-600">Select </option>
                                                <option value={true} className=" text-gray-600"> Active</option>
                                                <option value={false} className=" text-gray-600"> InActive</option>
                                            </select> */}
            
                                            </div> 
                                            {/* Button container positioned 10px above bottom */}
                                            <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                                >
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px]  rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#8392ab' }}
                                                onClick={handleCloseModal}
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#5E72e4' }}
                                                onClick={handleSubmitTerm}
                                            >
                                                Submit
                                            </button>
                                            </div>
                                        </div>
                                        </div>
                         )}
       
                       {editModal &&(
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[500px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                        Edit Terms Of Payment      
                                                     </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-4"> {/* Added flex-grow */}
                                   
                                      <div>
                                      <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                         ref={editNameRef}
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        value={editingTerm.name}
                                        onChange={handleEditTermChange}
                                        name="name"
                                      />
                                      <p className="text-xs text-red-400">{editErrors.name}</p>
                                      
                                      </div>
                                      
                                      <div className="w-full flex flex-col gap-2">
                                                  <label className="text-xs font-bold text-[#344767]">
                                                    Branch <span className="text-xs text-red-400">*</span>
                                                  </label>
                                                  <select
                                                    name="branch"
                                                     ref={editBranchRef}
                                                    value={editingTerm?.branch || ''}
                                                    onChange={handleEditTermChange}
                                                    className="select select-bordered bg-white text-gray-500  select-sm w-full rounded-lg focus:outline-none border-gray-300"
                                                    style={{ paddingLeft: '12px', fontSize: '14px' }}
                                                  >
                                                    <option value="">Select Branch</option>
                                                    {branches.map((branch) => (
                                                      <option key={branch.id} value={branch.id}>
                                                        {branch.name}
                                                      </option>
                                                    ))}
                                                  </select>
                                                  {editErrors.branch && (
                                                    <span className="text-red-500 text-xs mt-1">{editErrors.branch}</span>
                                                  )}
                                                </div>
                                      

                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Description:
                                      </label>

                                      <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                        placeholder="Description" 
                                        style={{paddingLeft:'12px'}}
                                        value={editingTerm.description}
                                        onChange={handleEditTermChange}
                                        name="description"
                                      ></textarea>
                            
                                           
                                            <label 
                                                
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Status:
                                            </label>
                                            <select defaultValue=""
                                                className="select w-[100%] h-[35px] bg-white border-gray-300 text-gray-500 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                style={{paddingLeft:'12px'}}
                                                value={String(editingTerm.status)}
                                                onChange={handleEditTermChange}
                                                name='status'
                                               
                                            >
                                                <option value="" className=" text-gray-600">Select </option>
                                                <option value={true} className=" text-gray-600"> Active</option>
                                                <option value={false} className=" text-gray-600"> InActive</option>
                                            </select>
            
                                            </div> 
                                            {/* Button container positioned 10px above bottom */}
                                            <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                                >
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px]  rounded-lg text-white border-none"
                                                style={{ backgroundColor:'#8392ab' }}
                                                onClick={handleEditCloseModal}
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#5E72E4' }}
                                                onClick={handleEditSubmitTerm}
                                                disabled={isSubmitting}
                                          >
                                                {isSubmitting ? 'Updating...' : 'Update'}
                                          </button>
                                            </div>
                                        </div>
                        </div>)}
      
                         
                    </>)
     }
     
     export default TermsOfPayment;