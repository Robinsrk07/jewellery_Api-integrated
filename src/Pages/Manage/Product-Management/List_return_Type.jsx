import React, { useEffect, useState } from "react";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import CustomScrollbar from "../../../components/CustomScrollbar";
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import returnTypeModel from "../../../models/returnTypeModel";
import TableSkelton from "../../../components/tableSkelton";



const List_return_Type =()=>{



         
                 
                  const [modal, setModal] = useState(false)   
                  const [editModal,setEditModal]= useState(false)
                  const [returnPolicies, setReturnPolicies] = useState([]);
                  const[limit,setLimit]=useState(10);  
                  const [deletingId, setDeletingId] = useState(null);
                  const [itemToDelete, setItemToDelete] = useState(null);
                  const [page, setPage] = useState(1);
                  const [search, setSearch] = useState('');
                  const [status, setStatus] = useState('');  
                  const [totalPages, setTotalPages] = useState(1);
                  const auth = useSelector((state) => state.auth);
                  const { login_id, can_manage_user_types } = auth;
                  const [editingReturnType, setEditingReturnType] = useState(null);
                   const [isLoading, setIsLoading] = useState(true);
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

                  if (response?.data && response?.data?.data) {
                      setReturnPolicies(response?.data?.data);
                      setTotalPages(response?.data?.pagination?.pages);
                  } else {
                    toast.error("Unable to fetch return types");
                  }
                } catch (error) {
                  console.error("Error fetching return types:", error);
                  toast.error("Failed to load return types");
                } finally {
                     setIsLoading(false)
        }
              };

              useEffect(() => {
                fetchReturnTypes();
              }, [limit, page, search, status]);



              const validateReturnType = () => {
                const newErrors = {};
                if (!addReturnTypeData.name.trim()) newErrors.name = 'Please enter name';
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
                  status: addReturnTypeData.status === 'true',
                };

                try {
                  const response = await returnTypeModel.createReturnType(payload);

                  if (response.status === 201 || response.status === 200) {
                     fetchReturnTypes();
                     handleCloseModal();
                     toast.success('Return Type created successfully!');
                  }
                } catch (error) {
                  toast.error('Failed to create return type!');
                  handleCloseModal();
                     console.log("test",error)
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

                  setEditErrors(newErrors);
                  return valid;
                };

                const handleEditSubmit = async () => {



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
                if (!id) return;
                try {
                  await returnTypeModel.deleteReturnType(id);
                  await fetchReturnTypes()
                  toast.success('Return type deleted successfully');
                } catch (error) {               
                  toast.error(' Please Try Again ,Failed to delete return type');
                }finally {
                    setDeletingId(null);
                }
              };



        const handleCloseModal =()=>{
          setModal(false)
          setErrors({
                    name: '',
                    description: '',
                    status: '',
                  })
        }
        const handleEditCloseModal =()=>{
          setEditModal(false)
          setEditErrors({
                    name: '',
                    description: '',
                    status: '',
                  })
        }

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
               ><CreateButton
            buttoncontent="+ New Return Type"
            onClick={() => setModal(true)}  // This will now work!
             />

            <ItemsPerPageSelector items={limit} setItems={setLimit} />

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
        {isLoading ? (
          <TableSkelton />
        ) : returnPolicies.length === 0 ? (
          <tr >
            <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
              No data available
            </td>
          </tr>
        ) : returnPolicies.map((policy,index) => (
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
                buttonText={deletingId === policy.id ? 'Deleting...' : 'Delete'}
                item="Diamond Item"
                onOpenModal={() => setItemToDelete(policy.id)}
                onConfirmDelete={() =>handleDeleteReturnType(itemToDelete)}
                disabled={deletingId ===policy.id}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>

      {/* Pagination */}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Modal */}

      
    </div>
      
                      
       
                       {modal && (
                           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[400px] h-[95vh] max-h-[380px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Create Return Type                       </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                                   
                                      
                                      <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name: <span className="text-red-500 text-[14px]">*</span>
                                      </label>
                                      <div>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        // onChange={(e)=>handleAddReturnTypeChange(e)}
                                        value={addReturnTypeData.name}
                                        onChange={handleAddReturnTypeChange}
                                        name="name"
                                      />
                                      <p className="text-xs text-red-500">{errors.name}</p>
                                      </div>
                                      
                                      

                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Description: 
                                      </label>
                                       <div >
                                      <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                        placeholder="Description" 
                                        style={{paddingLeft:'12px'}}
                                        value={addReturnTypeData.description}
                                        onChange={handleAddReturnTypeChange}
                                        name="description"
                                      ></textarea>
                                      </div>
                                      {/* <label 
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                        Status: 
                                      </label>
                                      <div>
                                      <select defaultValue=""
                                          className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                          style={{paddingLeft:'12px'}}
                                          value={addReturnTypeData.status}
                                          onChange={handleAddReturnTypeChange}
                                          name='status'
                                      >
                                                <option value="" className="text-gray-600">Select</option>
                                                <option value="true" className="text-gray-600">Active</option>
                                                <option value="false" className="text-gray-600">InActive</option>
        
                                            </select>
                                            </div> */}
            
                                            </div> 
                                            {/* Button container positioned 10px above bottom */}
                                            <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                                >
                                           
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px]  rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#8392ab'}}
                                                onClick={handleCloseModal}
                                            >
                                                Close
                                            </button>
                                             <button
                                                type="button"
                                                className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#5E72e4' }}
                                               onClick={(e) => handleSubmitReturnType(e)}
                                            >
                                                Submit
                                            </button>
                                            </div>
                                        </div>
                                        </div>
                         )}
       
                       {editModal &&(
                           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[400px] h-[95vh] max-h-[420px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                        Edit Return Type                       </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                                      <label 
                                       className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name:<span className="text-red-500 text-[14px]">*</span>
                                      </label>
                                      <div>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        value={editingReturnType?.name || ''} 
                                        onChange={(e)=>handleEditReturnTypeChange(e)}
                                        name="name"
                                      />
                                      <p className="text-xs text-red-300">{editErrors.name}</p>
                                      </div>
                                      

                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Description:
                                      </label>
                                      <div>
                                      <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                        placeholder="Description" 
                                        style={{paddingLeft:'12px',}}
                                        value={editingReturnType?.description || ''} 
                                        onChange={(e)=>handleEditReturnTypeChange(e)}
                                        name="description"
                                      ></textarea>
                                      </div>
                                         <label 
                                            className="font-semibold text-xs text-[#344767] w-[80%]"
                                          >
                                                Status:
                                            </label>

                                            <div>
                                            <select defaultValue=""
                                                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
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