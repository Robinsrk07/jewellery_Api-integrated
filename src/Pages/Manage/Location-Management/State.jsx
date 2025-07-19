import { useEffect, useState } from "react";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import StateModel from "../../../models/StateModel";
import { useSelector } from "react-redux";
import TableSkelton from "../../../components/tableSkelton";
import { toast } from 'react-toastify';






const State =()=>{
   
                          const [stateData, setStateData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingState, setEditingState] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

 
  const [addStateData, setAddStateData] = useState({
    code: '',
    name: '',
  });


  const [errors, setErrors] = useState({
    code: '',
    name: '',
   
  });


  const auth = useSelector((state) => state.auth);
  const { login_id, can_manage_user_types } = auth;
  const user_id = login_id;
  const user_types = Object.keys(can_manage_user_types).join(',');

  const fetchStateData = async () => {
    setIsLoading(true);
    try {
      const response = await StateModel.getStates(
        user_id,
        user_types,
        limit,
        page,
        search,
        status
      );

      if (response?.data?.data) {
        setStateData(response.data.data);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching state data:", error);
      toast.error("Failed to fetch states.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStateData();
  }, [limit, page, search, status]);

  
const handleAddStateChange = (e) => {
  const { name, value } = e.target;
  setAddStateData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const validateState = () => {
  const newErrors = {};

  if (!addStateData.code.trim()) {
    newErrors.code = "Please enter state code";
  }

  if (!addStateData.name.trim()) {
    newErrors.name = "Please enter state name";
  }

  return newErrors;
};



const handleSubmitState = async () => {
  const validationErrors = validateState();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  const payload = {
    code: addStateData.code.trim(),
    name: addStateData.name.trim(),
    status: Boolean(addStateData.status),
  };

  console.log("State Payload being sent:", payload);

  try {
    const response = await StateModel.createState(payload);
    console.log("Create State response:", response);

    if (response.status === 201 || response.status === 200) {
      toast.success("State created successfully!");
      fetchStateData(); 
      handleCloseModal();

      
      setAddStateData({
        code: '',
        name: '',
        status: false,
      });

      setErrors({});
    }
  } catch (error) {
    console.error("Create State error:", error);
    console.log("Error response:", error.response?.data);
    console.log("Field errors:", error.response?.data?.errors);
    toast.error("Failed to create state!");
    handleCloseModal();

    if (error.response?.data?.errors) {
      setErrors((prev) => ({
        ...prev,
        ...error.response.data.errors,
      }));
    }
  }
};


const [editStateErrors, setEditStateErrors] = useState({});

const validateEditState = () => {
  let valid = true;
  const errors = {};

  if (!editingState?.code?.trim()) {
    errors.code = 'Code is required';
    valid = false;
  }

  if (!editingState?.name?.trim()) {
    errors.name = 'Name is required';
    valid = false;
  }

  setEditStateErrors(errors);
  return valid;
};


const handleEditClickState = (stateObj) => {
  if (!stateObj || typeof stateObj !== 'object' || !stateObj.id) {
    console.warn("Invalid state object passed:", stateObj);
    toast.error("Invalid state selected.");
    return;
  }

  console.log("Editing State:", stateObj);

  setEditingState({
    id: stateObj.id,
    code: stateObj.code,
    name: stateObj.name,
    status: stateObj.status?.toString(),
  });

  setEditModal(true);
};


const handleEditStateChange = (e) => {
  const { name, value } = e.target;

  setEditingState((prev) => ({
    ...prev,
    [name]: name === 'status' ? (value === 'true') : value,
  }));
};


const handleEditSubmitState = async () => {
  if (!editingState?.id) {
    toast.error("Invalid state selected for editing.");
    return;
  }

  if (!validateEditState()) return;

  setIsSubmitting(true);

  const payload = {
    code: editingState.code.trim(),
    name: editingState.name.trim(),
    status: editingState.status === true || editingState.status === 'true',
  };

  try {
    const response = await StateModel.updateState(editingState.id, payload);

    if (response.status === 200) {
      fetchStateData();
      toast.success('State updated successfully!');
      setEditModal(false);
    }
  } catch (error) {
    console.error("Update state error:", error);
    toast.error('Failed to update state!');
    if (error.response?.data?.errors) {
      setEditStateErrors((prev) => ({
        ...prev,
        ...error.response.data.errors,
      }));
    }
  } finally {
    setIsSubmitting(false);
  }
};


const handleEditCloseStateModal = () => {
  setEditModal(false);
  setEditingState(null);
  setEditStateErrors({
    code: '',
    name: '',
    status: '',
  });
};

           
const handleDeleteState = async (id) => {
  if (!id) return;

  try {
    await StateModel.deleteState(id);

    setStateData((prevData) => prevData.filter((item) => item.id !== id));

    const modal = document.getElementById(`delete_modal_${id}`);
    if (modal && typeof modal.close === 'function') {
      modal.close();
    }

    toast.success('State deleted successfully');
  } catch (error) {
    console.error("Error deleting State:", error);
    toast.error('Failed to delete State');
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
                  buttoncontent="+ New State"
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
                          <th  style={{ width: '130px' }}>STATUS</th>
                          <th  style={{ width: '130px' }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                            <TableSkelton />
                        ) : stateData.length === 0 ? (
                            <tr>
                            <td className="text-center py-4 text-gray-500 text-sm" colSpan="5">
                                No data available
                            </td>
                            </tr>
                        ) : (
                            stateData.map((state, index) => (
                            <tr key={index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>
                                {index + 1}
                                </td>
                                <td className="py-4 border-b border-gray-200 text-xs">{state.code}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">{state.name}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">
                                {state.status ? (
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
                                        setEditingState(state); // Replace with your state editing logic
                                        setEditModal(true);
                                    }}
                                    />
                                    <DeleteButton
                                    buttonText="Delete State"
                                    modalId={`delete_modal_${state.id}`}
                                    onConfirmDelete={() => handleDeleteState(state.id)}
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
                                         Create State                    </h3>
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
                                        value={addStateData.code}
                                        onChange={handleAddStateChange}
                                        
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
                                      value={addStateData.name}
                                      onChange={handleAddStateChange}
                                      
                                    />
                                    
                                    {errors.name && (
                                              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                            )}
                                    
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
                                           
                                           onClick={handleSubmitState}
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
        Edit State
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
            value={editingState?.code || ''}
            onChange={handleEditStateChange}
          />
          {editStateErrors.code && (
            <p className="text-red-500 text-xs mt-1">{editStateErrors.code}</p>
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
            value={editingState?.name || ''}
            onChange={handleEditStateChange}
          />
          {editStateErrors.name && (
            <p className="text-red-500 text-xs mt-1">{editStateErrors.name}</p>
          )}
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
            value={editingState?.status ? 'Active' : 'InActive'}
            onChange={(e) => {
              setEditingState({
                ...editingState, 
                status: e.target.value === 'Active'
              });
              
            }}
          >
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-xs mt-1">{errors.status}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
        <button
          type="button"
          className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
          style={{ backgroundColor: '#8392ab' }}
          onClick={handleEditCloseStateModal}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
          style={{ backgroundColor: '#5E72E4' }}
          onClick={handleEditSubmitState}
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

export default State