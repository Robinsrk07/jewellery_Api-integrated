import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import UOMModel from "../../models/UOMModel";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
     
const  UnitOfMeasures = () => {
     
          
                        const [isHovered, setIsHovered] = useState(false);
                        const [modal, setModal] = useState(false);
                        const [editModal, setEditModal] = useState(false);

                        const [uomData, setUOMData] = useState([]);

                        const [limit, setLimit] = useState(10);
                        const [page, setPage] = useState(1);
                        const [status, setStatus] = useState('');
                        const [search, setSearch] = useState('');
                        const [isSubmitting, setIsSubmitting] = useState(false);

                        const [errors, setErrors] = useState({
                          code: '',
                          name: '',
                          conversion_factor: '',
                          usd_price: '',
                          branch: '',
                          status: ''
                        });
                        const [editErrors, setEditErrors] = useState({});

                        const [addUOMData, setAddUOMData] = useState({
                          code: '',
                          name: '',
                          conversion_factor: '',
                          usd_price: '',
                          branch: '',
                          is_default: false,
                          status: '',
                        });

                        const [editingUOM, setEditingUOM] = useState({
                          code: '',
                          name: '',
                          conversion_factor: '',
                          usd_price: '',
                          branch: '',
                          status: '',
                        });

                        const auth = useSelector((state) => state.auth);
                        const { login_id, can_manage_user_types } = auth;
                        const user_id = login_id;
                        const user_types = Object.keys(can_manage_user_types || {}).join(',');

                        const fetchUOMs = async () => {
                          try {
                            const response = await UOMModel.getUOMs(user_id, user_types, limit, page, search, status);
                            if (response?.data?.data) {
                              setUOMData(response.data.data);
                            } else {
                              toast.error("Unable to fetch UOMs");
                            }
                          } catch (error) {
                            console.error("Error fetching UOMs:", error);
                            toast.error("Failed to load UOMs");
                          }
                        };

                        useEffect(() => {
                          fetchUOMs();
                        }, [limit, page, search, status]);




                      const [branches, setBranches] = useState([]);



                        useEffect(() => {
                        fetchBranches();
                      }, []);


                      const fetchBranches = async () => {
                        try {
                          const response = await UOMModel.getBranches(user_id);
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


const validateUOM = () => {
  const newErrors = {};

  if (!addUOMData.code.trim()) {
    newErrors.code = 'Please enter UOM code';
  }

  if (!addUOMData.name.trim()) {
    newErrors.name = 'Please enter UOM name';
  }

  if (!addUOMData.conversion_factor || isNaN(addUOMData.conversion_factor)) {
    newErrors.conversion_factor = 'Please enter valid conversion factor';
  }

  if (!addUOMData.usd_price || isNaN(addUOMData.usd_price)) {
    newErrors.usd_price = 'Please enter valid USD price';
  }

  if (!addUOMData.branch) {
    newErrors.branch = 'Please select a branch';
  }


  return newErrors;
};


const handleAddUOMChange = (e) => {
  const { name, value } = e.target;
  setAddUOMData((prev) => ({
    ...prev,
    [name]: name === 'status' ? value === 'true' : value,
  }));
};


const handleSubmitUOM = async () => {
  const validationErrors = validateUOM();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const payload = {
    code: addUOMData.code.trim(),
    name: addUOMData.name.trim(),
    conversion_factor: parseFloat(addUOMData.conversion_factor),
    usd_price: parseFloat(addUOMData.usd_price),
    branch: parseInt(addUOMData.branch),
  
  };

  console.log("UOM Payload being sent:", payload);

  try {
    const response = await UOMModel.createUOM(payload);
    console.log("Create UOM response:", response);

    if (response.status === 201 || response.status === 200) {
      fetchUOMs();
      handleCloseModal();
      toast.success('UOM created successfully!');
    }
  } catch (error) {
    console.error("Create UOM error:", error);
    toast.error('Failed to create UOM!');
    handleCloseModal();

    if (error.response?.data?.errors) {
      setErrors((prev) => ({
        ...prev,
        ...error.response.data.errors,
      }));
    }
  }
};


const [editUOMErrors, setEditUOMErrors] = useState({});

const validateEditUOM = () => {
  let valid = true;
  const newErrors = {
    code: '',
    name: '',
    conversion_factor: '',
    usd_price: '',
    branch: '',
    status: ''
  };

  if (!editingUOM?.code?.trim()) {
    newErrors.code = 'Code is required';
    valid = false;
  }

  if (!editingUOM?.name?.trim()) {
    newErrors.name = 'Name is required';
    valid = false;
  }

  if (!editingUOM?.conversion_factor || isNaN(editingUOM.conversion_factor)) {
    newErrors.conversion_factor = 'Valid conversion factor is required';
    valid = false;
  }

  if (!editingUOM?.usd_price || isNaN(editingUOM.usd_price)) {
    newErrors.usd_price = 'Valid USD price is required';
    valid = false;
  }

  if (!editingUOM?.branch) {
    newErrors.branch = 'Branch is required';
    valid = false;
  }


  setEditErrors(newErrors);
  return valid;
};




const handleEditClickUOM = (uomObj) => {
  if (!uomObj || typeof uomObj !== 'object' || !uomObj.id) {
    console.warn("Invalid UOM passed to handleEditClickUOM:", uomObj);
    toast.error("Invalid UOM selected.");
    return;
  }

  console.log("Selected UOM for Edit:", uomObj);

  setEditingUOM({
    id: uomObj.id,
    code: uomObj.code,
    name: uomObj.name,
    conversion_factor: uomObj.conversion_factor,
    usd_price: uomObj.usd_price,
    branch: uomObj.branch?.toString(),
    status: uomObj.status?.toString(),
  });

  setEditModal(true);
};



const handleEditUOMChange = (e) => {
  const { name, value } = e.target;

  setEditingUOM((prev) => ({
    ...prev,
    [name]: name === 'status' ? value === 'true' : value,
  }));
};



const handleEditSubmitUOM = async () => {
  if (!editingUOM?.id) {
    toast.error("Invalid UOM selected for editing.");
    return;
  }

  if (!validateEditUOM()) return;

  setIsSubmitting(true);

  const payload = {
    code: editingUOM.code.trim(),
    name: editingUOM.name.trim(),
    conversion_factor: parseFloat(editingUOM.conversion_factor),
    usd_price: parseFloat(editingUOM.usd_price),
    branch: parseInt(editingUOM.branch),
    status: editingUOM.status === true || editingUOM.status === 'true',
  };

  try {
    const response = await UOMModel.updateUOM(editingUOM.id, payload);

    if (response.status === 200) {
      fetchUOMs();
      toast.success('UOM updated successfully!');
      setEditModal(false);
    }
  } catch (error) {
    console.error("Update UOM error:", error);
    toast.error('Failed to update UOM!');
    if (error.response?.data?.errors) {
      setEditErrors((prev) => ({
        ...prev,
        ...error.response.data.errors,
      }));
    }
  } finally {
    setIsSubmitting(false);
  }
};

                                                  const handleEditCloseModal = () => {
                                                      setEditModal(false);
                                                      setEditingUOM(null);
                                                      setEditUOMErrors({
                                                        code: '',
                                                        name: '',
                                                        conversion_factor: '',
                                                        usd_price: '',
                                                        branch: '',
                                                        status: ''
                                                      });
                                                    };




const handleDeleteUOM = async (id) => {
  if (!id) return;

  try {
    await UOMModel.deleteUOM(id);

    // Remove deleted UOM from local state
    setUOMData((prevData) => prevData.filter((item) => item.id !== id));

    // Close modal if open
    if (modal && typeof modal.close === 'function') {
      modal.close();
    }

    toast.success('UOM deleted successfully');
  } catch (error) {
    console.error("Error deleting UOM:", error);
    toast.error('Failed to delete UOM');
  }
};

                  
                   // Handle close modal
                   const handleCloseModal = () => {
                     setErrors({
                      code: '',
                      name: '',
                      conversion_factor: '',
                      usd_price: '',
                      branch: '',
                      status: ''
                     })
                     setModal(false);
                     setEditModal(false)
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
                                  <div
                              style={{
                              position: 'sticky',
                              left: 0,
                              top: 0,
                              zIndex: 10,
                              backgroundColor: 'white',
                              padding: '1.5rem',
                              boxSizing: 'border-box',
                              display: 'flex',
                              justifyContent: 'flex-end',
                              width: 'fit-content', // Changed from 100%
                              minWidth: '100%' // Ensures it matches table width
                              }}
                          >
                              <button
                              className="text-xs font-bold"
                              style={{
                                  width: '160px',
                                  height: '30px',
                                  borderRadius: '8px',
                                  backgroundColor: isHovered ? 'rgb(97, 113, 228)' : 'rgb(126, 96, 228)',
                                  color: 'white',
                                  transition: 'background-color 0.3s ease',
                                  cursor: 'pointer',
                              }}
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                              onClick={() => setModal(true)}
                              >
                              + New UOM
                              </button>
                          </div>
                 
                       <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1300px]   " style={{ borderSpacing: '0 12px', borderCollapse: 'separate'}}>
                         <thead className="text-xs text-gray-400 uppercase bg-white">
                           <tr>
                             <th className="px-6 py-3 w-[100px]" style={{width:'90px',paddingLeft:'20px'}} >SL NO</th>
                             <th className="px-6 py-3 w-[80px]"  >CODE</th>
                             <th className="px-6 py-3 w-[80px]"  >NAME </th>
                             <th className="px-6 py-3 w-[100px]" >CONVERTION FACTOR IN GRAM </th>
                             <th className="px-6 py-3 w-[100px]"  >PRICE IN USD</th>
                             <th className="px-6 py-3 w-[80px]"  >BRANCH</th>
                             <th className="px-6 py-3 w-[80px]"  >STATUS</th>
                             <th className="px-6 py-3 w-[100px]"  >ACTION</th>
                           </tr>
                         </thead>
                         <tbody>
                          {uomData.map((uom, index) => (
                            <tr key={uom.id} className="bg-white hover:bg-gray-50 h-14 text-gray-400">
                              <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '20px' }}>{index + 1}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{uom.code}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{uom.name}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{uom.conversion_factor}</td>
                              <td className="px-6 py-5 border-b border-gray-200  text-xs">{uom.usd_price}</td>
                              <td className="px-6 py-5 border-b border-gray-200  text-xs">{getBranchName(uom.branch)}</td>
                              <td className="px-4 py-4 border-b border-gray-200 text-xs">
                                {uom.status ? (
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
                                    onClick={()=>handleEditClickUOM(uom)}
                                  />
                                  <DeleteButton 
                                      buttonText="Delete UOM" 
                                      modalId={`delete_modal_${uom.id}`} 
                                      onConfirmDelete={() => handleDeleteUOM(uom.id)} 
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>

                       </table>
                       
                 
                       {/* Pagination */}
                       <Pagination/>
                       {/* <div className="flex gap-1 justify-center">
                         <button className="btn bg-gray-50 border-none rounded-full w-[40px] h-[40px] flex items-center justify-center font-bold text-gray-500">
                           {'<'}
                         </button>
                         <button className="btn rounded-full border-none w-[40px] h-[40px] flex items-center justify-center font-semibold bg-blue-500 text-white">
                           1
                         </button>
                         <button className="btn rounded-full bg-gray-50 border-none w-[40px] h-[40px] flex items-center justify-center font-bold text-gray-500">
                           {'>'}
                         </button>
                       </div> */}
                 
                       {/* Modal */}
      
                      </div>
      
                      {modal && (
                                <div className="fixed inset-0 text-black  border-gray-400  bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[90vh] max-h-[600px] flex flex-col overflow-y-auto gap-3" style={{padding:'20px'}}> 
                                                
                                                {/* Added flex-col */}
                                    <h3 className="font-bold text-[22px] text-[#344767]"
                                        >
                                         Create UOM                          </h3>
                                    <hr className="my-4 border-gray-300" />
      
                                    <div className="flex flex-col flex-grow gap-3"> {/* Added flex-grow */}
                                     <div>
                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                       code: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] text-xs rounded-lg bg-white border-gray-300 text-gray-500 focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                        style={{paddingLeft:'12px'}}
                                        value={addUOMData.code}
                                        onChange={handleAddUOMChange}
                                        name="code"
                                      />
                                      <p className="text-xs text-red-400">{errors.code}</p>
                                      
                                    </div>

                                    <div>
                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                       Name: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] text-xs rounded-lg bg-white border-gray-300 text-gray-500 focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                        style={{paddingLeft:'12px'}}
                                        value={addUOMData.name}
                                        onChange={handleAddUOMChange}
                                        name="name"
                                      />
                                      <p className="text-xs text-red-400">{errors.name}</p>
                                      
                                    </div>
                                    <div>
                            
                                            <label className="font-semibold text-xs text-[#344767] w-[100%]">
                                              Conversion Factor: <span className="text-xs text-red-400">*</span>
                                            </label>

                                            <input 
                                              type="number" 
                                              name="conversion_factor"  
                                              placeholder="Type here" 
                                              className="input w-[100%] text-xs bg-white border-gray-300 rounded-lg border border-gray-300 text-gray-500 focus:outline-none focus:border-b-2 focus:border-blue-500"
                                              style={{ paddingLeft: '12px' }}
                                              value={addUOMData.conversion_factor}
                                              onChange={handleAddUOMChange}  
                                              step="1"
                                            />
                                            <p className="text-xs text-red-400">{errors.conversion_factor}</p>
                                      
                                    </div>


                                            <div>
                                            <label 
                                            
                                            className="font-semibold text-xs text-[#344767] w-[100%]"
                                            >
                                            Usd price : <span className="text-xs text-red-400">*</span>
                                            </label>

                                            <input 
                                                type="number" 
                                                name="usd_price"  // Must match your formData key
                                                placeholder="Type here" 
                                                className="input w-[100%] text-xs rounded-lg border bg-white border-gray-300 text-gray-500 focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                                style={{ paddingLeft:'12px' }}
                                                value={addUOMData.usd_price}
                                                onChange={handleAddUOMChange}
                                                step="1"  // For decimal values if needed
                                                />
                                                <p className="text-xs text-red-400">{errors.usd_price}</p>
                                      
                                    </div>

                                                <div className="w-full flex flex-col gap-2">
                                                  <label className="text-xs font-bold text-[#344767]">
                                                    Branch <span className="text-xs text-red-400">*</span>
                                                  </label>
                                                  <select
                                                    name="branch"
                                                    value={addUOMData.branch}
                                                    onChange={handleAddUOMChange}
                                                    className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none border-gray-300"
                                                    style={{ paddingLeft: '12px', fontSize: '11px' }}
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
                                            </div> 
                                            {/* Button container positioned 10px above bottom */}
                                            <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                                >
                                            
                                            <button
                                                type="button"
                                                className="btn border-none w-[100px] h-[33px] rounded-lg text-white"
                                                style={{ backgroundColor: '#8392ab' }}
                                                onClick={handleCloseModal}
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                className="btn border-none w-[100px] h-[33px] rounded-lg text-white"
                                                style={{ backgroundColor: '#5E72e4' }}
                                                onClick={handleSubmitUOM}
                                            >
                                                Submit
                                            </button>
                                            </div>
                                        </div>
                                        </div>
                                )}      
      
      
                      {editModal && (
                                <div className="fixed inset-0 text-black  border-gray-400  bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[90vh] max-h-[600px] flex flex-col overflow-y-auto gap-3" style={{padding:'20px'}}> 
                                                
                                                {/* Added flex-col */}
                                    <h3 className="font-bold text-[22px] text-[#344767]"
                                        >
                                       Edit UOM                          </h3>
                                    <hr className="my-4 border-gray-300" />
      
                                    <div className="flex flex-col flex-grow gap-3"> {/* Added flex-grow */}
                                     <div>
                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                       code: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] text-xs rounded-lg bg-white border-gray-300 text-gray-500 focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                        style={{paddingLeft:'12px'}}
                                        value={editingUOM.code}
                                        onChange={handleEditUOMChange}
                                        name="code"
                                      />
                                      <p className="text-xs text-red-400">{editErrors.code}</p>
                                      
                                    </div>
                                    <div>

                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                       Name: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] text-xs rounded-lg bg-white border-gray-300 text-gray-500 focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                        style={{paddingLeft:'12px'}}
                                        value={editingUOM.name}
                                        onChange={handleEditUOMChange}
                                        name="name"
                                      />
                                      <p className="text-xs text-red-400">{editErrors.name}</p>
                                      
                                    </div>

                                    <div>
                            
                                            <label 
                                            
                                            className="font-semibold text-xs text-[#344767] w-[100%]"
                                            >
                                            Convertion Factor: <span className="text-xs text-red-400">*</span>
                                            </label>

                                            <input 
                                                type="number" 
                                                name="conversion_factor"  // Must match your formData key
                                                placeholder="Type here" 
                                                className="input w-[100%] text-xs bg-white border-gray-300 text-gray-500 rounded-lg border border-gray-300 focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                                style={{paddingLeft:'12px' }}
                                                value={editingUOM.conversion_factor}
                                                onChange={handleEditUOMChange}
                                                step="1"  // For decimal values if needed
                                                />
                                                <p className="text-xs text-red-400">{editErrors.conversion_factor}</p>
                                      
                                    </div>
<div>
  <label className="font-semibold text-xs text-[#344767] w-[100%]">
    Usd price : <span className="text-xs text-red-400">*</span>
  </label>

  <input 
    type="number" 
    name="usd_price" // <-- FIXED
    placeholder="Type here" 
    className="input w-[100%] text-xs rounded-lg border bg-white border-gray-300 text-gray-500 focus:outline-none focus:border-b-2 focus:border-blue-500"
    style={{ paddingLeft:'12px' }}
    value={editingUOM.usd_price || ''}
    onChange={handleEditUOMChange}
    step="0.01"
  />
  
  <p className="text-xs text-red-400">{editErrors.usd_price}</p>
</div>


                                       
                                                <div className="w-full flex flex-col gap-2">
                                                  <label className="text-xs font-bold text-[#344767]">
                                                    Branch <span className="text-xs text-red-400">*</span>
                                                  </label>
                                                  <select
                                                    name="branch"
                                                    value={editingUOM?.branch || ''}
                                                    onChange={handleEditUOMChange}
                                                    className="select select-bordered bg-white text-gray-500 text-gray-500 select-sm w-full rounded-lg focus:outline-none border-gray-300"
                                                    style={{ paddingLeft: '12px', fontSize: '11px' }}
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
                                                
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Status:
                                            </label>
                                            <select defaultValue=""
                                                className="select w-[100%] h-[35px] bg-white border-gray-300 text-gray-500 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                style={{paddingLeft:'12px'}}
                                                value={String(editingUOM.status)}
                                                onChange={handleEditUOMChange}
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
                                                onClick={handleEditSubmitUOM}
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
     
     export default UnitOfMeasures;