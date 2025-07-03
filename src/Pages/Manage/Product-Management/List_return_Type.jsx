import React, { useEffect, useState } from "react";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import returnTypeModel from "../../../models/returnTypeModel";



const List_return_Type =()=>{



                  const [isHovered, setIsHovered] = useState(false);
                  const [items, setItems] = useState(10);
                  const [modal, setModal] = useState(false)   
                  const [editModal,setEditModal]= useState(false)
                  const [returnPolicies, setReturnPolicies] = useState([]);
                  const [limit, setLimit] = useState(10);
                  const [page, setPage] = useState(1);
                  const [search, setSearch] = useState('');
                  const [status, setStatus] = useState('');  
                  const auth = useSelector((state) => state.auth);
                  const { login_id, can_manage_user_types } = auth;
                  const [editingReturnType, setEditingReturnType] = useState(null);
                  const [editErrors, setEditErrors] = useState({});
                  const [isSubmitting, setIsSubmitting] = useState(false);

                  
                  const user_id = login_id;
                  const user_types = Object.keys(can_manage_user_types || {}).join(',');



                  const [addReturnTypeData, setAddReturnTypeData] = useState({
                    name: '',
                    description: '',
                    status: ''
                  });

                  const [errors, setErrors] = useState({
                    name: '',
                    description: '',
                    status: '',
                  });

                              



              const fetchReturnTypes = async () => {
                try {
                  const response = await returnTypeModel.getReturnTypes(
                    user_id,
                    user_types,
                    limit,
                    page,
                    search,
                    status
                  );
                  console.log("Response from API:", response);

                  if (response.data && response.data.data) {
                    console.log("Data Received:", response.data.data);
                    setReturnPolicies(response.data.data);
                  } else {
                    toast.error("Unable to fetch return types");
                  }
                } catch (error) {
                  console.error("Error fetching return types:", error);
                  toast.error("Failed to load return types");
                }
              };

              useEffect(() => {
                fetchReturnTypes();
              }, [limit, page, search, status]);



              const validateReturnType = () => {
                const newErrors = {};
                if (!addReturnTypeData.name.trim()) newErrors.name = 'Please enter name';
                if (!addReturnTypeData.description.trim()) newErrors.description = 'Please enter description';
                if (addReturnTypeData.status === '') newErrors.status = 'Please select status';
                return newErrors;
              };

              const handleAddReturnTypeChange = (e) => {
                const { name, value } = e.target;
                setAddReturnTypeData((prev) => ({
                  ...prev,
                  [name]: value,
                }));
              };

              useEffect(() => {
                console.log("Updated ReturnType form state:", addReturnTypeData);
              }, [addReturnTypeData]);


              const handleSubmitReturnType = async () => {
                const validationErrors = validateReturnType();
                if (Object.keys(validationErrors).length > 0) {
                  setErrors(validationErrors);
                  return;
                }

                const payload = {
                  name: addReturnTypeData.name,
                  description: addReturnTypeData.description,
                  status: addReturnTypeData.status === 'true', // boolean
                  created_by: user_id,
                  created_by_type: user_types,
                };

                try {
                  const response = await returnTypeModel.createReturnType(payload);
                  console.log("Create response:", response);

                  if (response.status === 201 || response.status === 200) {
                    fetchReturnTypes();
                    handleCloseModal();
                    toast.success('Return Type created successfully!');
                  }
                } catch (error) {
                  console.error("Create error:", error);
                  toast.error('Failed to create return type!');
                  handleCloseModal();

                  if (error.response?.data?.errors) {
                    setErrors((prev) => ({
                      ...prev,
                      ...error.response.data.errors,
                    }));
                  }
                }
              };


              const handleEditClick = (returnTypeObj) => {
                console.log("Selected for Edit:", returnTypeObj);
                setEditingReturnType({ ...returnTypeObj }); 
                console.log("Editing Stock Point ID:", returnTypeObj.id, "Name:", returnTypeObj.name);
                setEditModal(true);
              };


              const handleEditReturnTypeChange = (e) => {
                const { name, value } = e.target;
                setEditingReturnType((prev) => ({
                  ...prev,
                  [name]: name === 'status' ? (value === 'true') : value,
                }));
              };




                const validateEditReturnType = () => {
                  let valid = true;
                  const newErrors = { name: '', description: '', status: '' };

                  if (!editingReturnType?.name?.trim()) {
                    newErrors.name = 'Return Type name is required';
                    valid = false;
                  }

                  if (!editingReturnType?.description?.trim()) {
                    newErrors.description = 'Description is required';
                    valid = false;
                  }

                  if (editingReturnType?.status === undefined || editingReturnType.status === '') {
                    newErrors.status = 'Status is required';
                    valid = false;
                  }

                  setEditErrors(newErrors);
                  return valid;
                };

                const handleEditSubmit = async () => {
                  console.log("Editing Return Type:", editingReturnType);


                  if (!editingReturnType?.id) {
                    toast.error("Invalid return type selected for editing.");
                    return;
                  }

                  if (!validateEditReturnType()) return;

                  setIsSubmitting(true);
                  try {
                    const response = await returnTypeModel.updateReturnType(
                      editingReturnType.id,
                      {
                        name: editingReturnType.name,
                        description: editingReturnType.description,
                        status: editingReturnType.status,
                      }
                    );

                    if (response.status === 200) {
                      fetchReturnTypes(); 
                      toast.success('Return Type updated successfully!');
                      setEditModal(false);
                    }
                  } catch (error) {
                    console.error("Update error:", error);
                    toast.error('Failed to update return type!');
                    if (error.response?.data?.errors) {
                      setEditErrors(prev => ({
                        ...prev,
                        ...error.response.data.errors,
                      }));
                    }
                  } finally {
                    setIsSubmitting(false);
                  }
                };


              const handleDeleteReturnType = async (id) => {
                console.log("Deleting return type with ID:", id);
                if (!id) return;

                try {
                  await returnTypeModel.deleteReturnType(id); // call delete API

                  setReturnPolicies(prevData => prevData.filter(item => item.id !== id));

                  const modal = document.getElementById('my_modal_8');
                  if (modal && typeof modal.close === 'function') {
                    modal.close();
                  }

                  toast.success('Return type deleted successfully');
                } catch (error) {
                  console.error("Error deleting return type:", error);
                  toast.error('Failed to delete return type');
                }
              };



  const handleCloseModal =()=>{
    setModal(false)
  }
  const handleEditCloseModal =()=>{
    setEditModal(false)
  }

  return (
   <>
   <style jsx global>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;  /* Slightly wider for better visibility */
    height: 6px; /* For horizontal scroll */
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1; /* Light gray track */
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background:rgb(218, 216, 216); /* Rich red color */
    border-radius: 3px;
    border: 1px solidrgb(206, 198, 198); /* Darker red border */
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background:rgb(202, 190, 190); /* Darker red on hover */
  }
  
  /* For Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color:rgb(226, 215, 215) #f1f1f1; /* red thumb on gray track */
  }
`}</style>
<div className="bg-white text-gray-500 w-full max-w-6xl h-auto max-h-[65vh] rounded-xl px-4 md:px-8 lg:px-12 mx-auto overflow-auto  custom-scrollbar" style={{ fontFamily: 'Open Sans',overflow:'auto'}}>
            <CreateButton
            buttoncontent="+ New Return Type"
            onClick={() => setModal(true)}  // This will now work!
             />

           <ItemsPerPageSelector items={items} setItems={setItems} />

       <table className="table w-full text-sm text-left text-gray-500" 
      style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '1300px' }}>
      <thead className="text-xs text-gray-400 uppercase bg-white">
        <tr>
          <th style={{ width: '100px', paddingLeft: '30px' }}>SL NO</th>
          <th style={{ width: '200px' }}>NAME</th>
          <th style={{ width: '2500px' }}>DESCRIPTION</th>
          <th style={{ width: '130px' }}>STATUS</th>
          <th style={{ width: '170px' }}>ACTION</th>
          <th style={{ width: '200px' }}></th>
        </tr>
      </thead>
      <tbody>
        {returnPolicies.map((policy,index) => (
          <tr key={index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
            <td className="border-b border-gray-200 text-xs" style={{ paddingLeft: '40px' }}>{index+1}</td>
              
            <td className="border-b border-gray-200 text-xs">{policy.name}</td>
            <td className="border-b border-gray-200 text-xs">{policy.description}</td>
            <td className="py-4 border-b border-gray-200 text-xs">
                              {policy.status ? (
                                <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                  Active
                                </span>
                              ) : (
                                <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                  INACTIVE
                                </span>
                              )}
                            </td>
            <td className="border-b border-gray-200 text-blue-600">
              <button 
                className="border-none text-white font-bold text-xs rounded-lg" 
                style={{ width: '100px', height: '35px', padding: '5px', backgroundColor: '#696BE4' }}
                onClick={() => handleEditClick(policy)}
              >
                Edit
              </button>
            </td>
            <td className="border-b border-gray-200 text-blue-600">
              <DeleteButton 
              buttonText="Delete Type" 
              modalId={`delete_modal_${policy.id}`} 
              onConfirmDelete={() => handleDeleteReturnType(policy.id)} 
             />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

      {/* Pagination */}
           <Pagination/>

      {/* Modal */}

      
    </div>
      
                      
       
                       {modal && (
                           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[400px] h-[95vh] max-h-[500px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Create Return Type                       </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                                   
                                      
                                      <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name:
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-300 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        // onChange={(e)=>handleAddReturnTypeChange(e)}
                                        value={addReturnTypeData.name}
                                        onChange={handleAddReturnTypeChange}
                                        name="name"
                                      />
                                      
                                      

                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Description:
                                      </label>

                                      <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-200 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                        placeholder="Description" 
                                        style={{paddingLeft:'12px',color: '#374151',}}
                                      //  onChange={(e)=>handleAddReturnTypeChange(e)}
                                        value={addReturnTypeData.description}
                                        onChange={handleAddReturnTypeChange}
                                        name="description"
                                      ></textarea>
                            
                                           
                                            <label 
                                                
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Status:
                                            </label>
                                            <select defaultValue=""
                                                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-400 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                style={{paddingLeft:'12px'}}
                                                value={addReturnTypeData.status}
                                                onChange={handleAddReturnTypeChange}
                                                name='status'
                                             
                                              
                                            >
                                                <option value="" className="text-gray-600">Select</option>
                                                <option value="true" className="text-gray-600">Active</option>
                                                <option value="false" className="text-gray-600">InActive</option>
        
                                            </select>
            
                                            </div> 
                                            {/* Button container positioned 10px above bottom */}
                                            <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                                >
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#5E72e4' }}
                                               onClick={(e) => handleSubmitReturnType(e)}
                                            >
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px]  rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#8392ab'}}
                                                onClick={handleCloseModal}
                                            >
                                                Close
                                            </button>
                                            </div>
                                        </div>
                                        </div>
                         )}
       
                       {editModal &&(
                           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[400px] h-[95vh] max-h-[500px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                        Edit Return Type                       </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                                   
                                      
                                      <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name:
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-300 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        value={editingReturnType?.name || ''} 
                                        onChange={(e)=>handleEditReturnTypeChange(e)}
                                        name="name"
                                      />
                                      
                                      

                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Description:
                                      </label>

                                      <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-300 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                        placeholder="Description" 
                                        style={{paddingLeft:'12px',color: '#374151',}}
                                        value={editingReturnType?.description || ''} 
                                        onChange={(e)=>handleEditReturnTypeChange(e)}
                                        name="description"
                                      ></textarea>
                            
                                           
                                            <label 
                                                
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Status:
                                            </label>
                                            <select defaultValue=""
                                                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-400 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                style={{paddingLeft:'12px'}}
                                                value={String(editingReturnType?.status)}
                                                onChange={handleEditReturnTypeChange}
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
                                                style={{ backgroundColor: '#8392ab' }}
                                                onClick={handleEditCloseModal}
                                            >
                                                Close
                                            </button>
                                            <button
                                              type="button"
                                              className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                              style={{ backgroundColor: '#5E72E4' }}
                                              onClick={handleEditSubmit}
                                              disabled={isSubmitting}
                                            >
                                              {isSubmitting ? 'Updating...' : 'Update'}
                                            </button>
                                            </div>
                                        </div>
                                        </div>)}

    
    </>


  );

}
export default List_return_Type