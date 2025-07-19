import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import stoneTypeModel from "../../../models/stoneTypeModel";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import TableSkelton from "../../../components/tableSkelton";

const StoneType=()=>{
  
                      const [modal, setModal] = useState(false);
                      const [editModal, setEditModal] = useState(false);

                      const [stoneTypes, setStoneTypes] = useState([]);
                      const [isLoading, setIsLoading] = useState(true);
                      const [totalPages, setTotalPages] = useState(1);
                      const [deletingId, setDeletingId] = useState(null);
                      const [itemToDelete, setItemToDelete] = useState(null);

                      const [limit, setLimit] = useState(10);
                      const [page, setPage] = useState(1);
                      const [search, setSearch] = useState('');
                      const [status, setStatus] = useState('');
                      const [isSubmitting, setIsSubmitting] = useState(false);
                      const [editingStoneType, setEditingStoneType] = useState(null);

                      const auth = useSelector((state) => state.auth);
                      const { login_id, can_manage_user_types } = auth;

                      const user_id = login_id;
                      const user_types = Object.keys(can_manage_user_types || {}).join(',');

                      const [addStoneTypeData, setAddStoneTypeData] = useState({
                        name: '',
                        description: '',
                        status: 'true',
                      });

                      const [errors, setErrors] = useState({
                        name: '',
                        description: '',
                        status: '',
                      });

                      const fetchStoneTypes = async () => {
                        try {
                          setIsLoading(true);
                          const response = await stoneTypeModel.getStoneTypes(
                            user_id,
                            user_types,
                            limit,
                            page,
                            search,
                            status
                          );

                          console.log("Response from API:", response);

                          if (response.data && response.data.data) {
                            console.log("Stone Types Received:", response.data.data);
                            setStoneTypes(response.data.data);
                            if (response.data.pagination) {
                              setTotalPages(response.data.pagination.pages);
                            }
                          } else {
                            toast.error("Unable to fetch stone types");
                          }
                        } catch (error) {
                          console.error("Error fetching stone types:", error);
                          toast.error("Failed to load stone types");
                        } finally {
                          setIsLoading(false);
                        }
                      };

                      useEffect(() => {
                        fetchStoneTypes();
                      }, [limit, page, search, status]);

                      const validateStoneType = () => {
                        const newErrors = {};
                        if (!addStoneTypeData.name.trim()) newErrors.name = 'Please enter name';
                        if (!addStoneTypeData.description.trim()) newErrors.description = 'Please enter description';
                        if (addStoneTypeData.status === '') newErrors.status = 'Please select status';
                        return newErrors;
                      };

                      const handleAddStoneTypeChange = (e) => {
                        const { name, value } = e.target;
                        setAddStoneTypeData((prev) => ({
                          ...prev,
                          [name]: value,
                        }));
                        // Clear error when user starts typing
                        if (errors[name]) {
                          setErrors(prev => ({ ...prev, [name]: '' }));
                        }
                      };

                      useEffect(() => {
                        console.log("Updated Stone Type form state:", addStoneTypeData);
                      }, [addStoneTypeData]);

                      const handleSubmitStoneType = async () => {
                        const validationErrors = validateStoneType();
                        if (Object.keys(validationErrors).length > 0) {
                          setErrors(validationErrors);
                          return;
                        }

                        const payload = {
                          name: addStoneTypeData.name,
                          description: addStoneTypeData.description,
                          status: addStoneTypeData.status === 'true',
                          created_by: user_id,
                          created_by_type: user_types,
                        };

                        console.log("Stone Type Payload being sent:", payload);

                        try {
                          const response = await stoneTypeModel.createStoneType(payload);
                          console.log("Create Stone Type response:", response);

                          if (response.status === 201 || response.status === 200) {
                            fetchStoneTypes();        
                            handleCloseModal();       
                            toast.success('Stone type created successfully!');
                          }
                        } catch (error) {
                          console.error("Create stone type error:", error);
                          toast.error('Failed to create stone type!');
                          handleCloseModal();

                          if (error.response?.data?.errors) {
                            setErrors((prev) => ({
                              ...prev,
                              ...error.response.data.errors,
                            }));
                          }
                        }
                      };

                      const validateEditStoneType = () => {
                        let valid = true;
                        const newErrors = { name: '', description: '', status: '' };

                        if (!editingStoneType?.name?.trim()) {
                          newErrors.name = 'Stone type name is required';
                          valid = false;
                        }

                        if (!editingStoneType?.description?.trim()) {
                          newErrors.description = 'Description is required';
                          valid = false;
                        }

                        if (editingStoneType?.status === undefined || editingStoneType.status === '') {
                          newErrors.status = 'Status is required';
                          valid = false;
                        }

                        setErrors(newErrors);
                        return valid;
                      };

                      const handleEditStoneTypeChange = (e) => {
                        const { name, value } = e.target;
                        setEditingStoneType((prev) => ({
                          ...prev,
                          [name]: name === 'status' ? value === 'true' : value,
                        }));
                        // Clear error when user starts typing
                        if (errors[name]) {
                          setErrors(prev => ({ ...prev, [name]: '' }));
                        }
                      };

                      const handleEditClickStoneType = (typeObj) => {
                        if (!typeObj || typeof typeObj !== 'object' || !typeObj.id) {
                          console.warn("Invalid object passed to handleEditClickStoneType:", typeObj);
                          toast.error("Invalid stone type selected.");
                          return;
                        }

                        console.log("Selected for Edit:", typeObj);
                        setEditingStoneType({ ...typeObj });
                        setEditModal(true);
                      };

                      const handleEditSubmitStoneType = async () => {
                        console.log("Editing Stone Type:", editingStoneType);

                        if (!editingStoneType?.id) {
                          toast.error("Invalid stone type selected for editing.");
                          return;
                        }

                        if (!validateEditStoneType()) return;

                        setIsSubmitting(true);

                        try {
                          const response = await stoneTypeModel.updateStoneType(
                            editingStoneType.id,
                            {
                              name: editingStoneType.name,
                              description: editingStoneType.description,
                              status:
                                editingStoneType.status === true || editingStoneType.status === 'true',
                            }
                          );

                          if (response.status === 200) {
                            fetchStoneTypes(); // Reload list
                            toast.success('Stone type updated successfully!');
                            setEditModal(false);
                          }
                        } catch (error) {
                          console.error("Update error:", error);
                          toast.error('Failed to update stone type!');
                          if (error.response?.data?.errors) {
                            setErrors((prev) => ({
                              ...prev,
                              ...error.response.data.errors,
                            }));
                          }
                        } finally {
                          setIsSubmitting(false);
                        }
                      };

                      const handleDeleteStoneType = async (id) => {
                        if (!id) return toast.error("No item selected for deletion");
                        
                        try {
                          setDeletingId(id);
                          await stoneTypeModel.deleteStoneType(id);
                          await fetchStoneTypes(); // Refresh the list
                          toast.success("Stone type deleted successfully");
                        } catch (error) {
                          console.error("Delete error:", error);
                          toast.error("Failed to delete stone type");
                        } finally {
                          setDeletingId(null);
                          setItemToDelete(null);
                        }
                      };

                      // Handle close modal
                      const handleCloseModal = () => {
                        setAddStoneTypeData({
                          name: '',
                          description: '',
                          status: 'true',
                        });
                        setErrors({
                          name: '',
                          description: '',
                          status: '',
                        });
                        setModal(false);
                      };
                      const handleEditCloseModal = () => {
                        setErrors({
                          name: '',
                          description: '',
                          status: '',
                        });
                        setEditModal(false);
                      };
           
           
             return (
               
           <>
           <CustomScrollbar/>
                <div className="bg-white w-full
                max-w-[95vw] 
                xl:max-w-[90vw] 
                2xl:max-w-[95vw] 
                h-auto max-h-[80vh] 
                rounded-xl px-4 md:px-8 lg:px-12
                mx-auto overflow-auto  custom-scrollbar"
                style={{ fontFamily: 'Open Sans',overflow:'auto'}}
               >
                <CreateButton
                buttoncontent="+ New Stone Type"
                onClick={() => setModal(true)}  
                />                 
                <ItemsPerPageSelector items={limit} setItems={setLimit} />

                 
                        
                              <table className="w-full text-sm text-left text-gray-500 border-collapse overflow-x-auto"
                              style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '1100px' }}>
                              <thead className="text-xs text-gray-400 uppercase bg-white">
                                <tr>
                                  <th style={{ width: '80px', paddingLeft: '20px' }}>SL NO</th>
                                  <th style={{ width: '150px' }}>NAME</th>
                                  <th style={{ width: '500px' }}>DESCRIPTION</th>
                                  <th style={{ width: '150px' }}>STATUS</th>
                                  <th style={{ width: '150px' }}>ACTION</th>
                                </tr>
                              </thead>
                              <tbody>
                                {isLoading ? (
                                  <TableSkelton />
                                ) : stoneTypes.length === 0 ? (
                                  <tr >
                                    <td colSpan={5} className="text-center py-4 text-gray-500 text-sm">
                                      No data available
                                    </td>
                                  </tr>
                                ) : stoneTypes.map((stone, index)  => (
                                  <tr key={stone.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                                    <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>
                                      {index+1}
                                    </td>
                                    <td className="py-4 border-b border-gray-200 text-xs">{stone.name}</td>
                                    <td className="py-4 border-b border-gray-200 text-xs">{stone.description}</td>
                                    <td className="py-4 border-b border-gray-200 text-xs">
                                      {stone.status ? (
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
                                        setEditingStoneType(stone);
                                        setEditModal(true);
                                      }}
                                      />
                                        <DeleteButton 
                                        buttonText={deletingId === stone.id ? 'Deleting...' : 'Delete'}
                                        onOpenModal={() => setItemToDelete(stone)}
                                        onConfirmDelete={() => handleDeleteStoneType(itemToDelete?.id)}
                                        disabled={deletingId === stone.id}
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              </table>
                 
           
             
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage}/>
           
               
           
                 
                </div>

                 {modal && (
                           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[600px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Create Stone Type                      </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-4"> {/* Added flex-grow */}
                                   
                                      <div>
                                        <label 
                                       
                                          className="font-semibold text-xs text-[#344767] w-[80%]"
                                        >
                                         Name: <span className="text-red-500 text-[14px]">*</span>
                                        </label>
                                        <input type="text" 
                                          placeholder="Type here" 
                                          className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                          style={{paddingLeft:'12px'}}
                                          value={addStoneTypeData.name}
                                          onChange={handleAddStoneTypeChange}
                                          name="name"
                                        />
                                        {errors.name && (
                                          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                        )}
                                      </div>
                                      
                                      <div>
                                        <label 
                                        
                                          className="font-semibold text-xs text-[#344767] w-[100%]"
                                        >
                                          Description: <span className="text-red-500 text-[14px]">*</span>
                                        </label>

                                        <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                          placeholder="Description" 
                                          style={{paddingLeft:'12px',}}
                                          value={addStoneTypeData.description}
                                          onChange={handleAddStoneTypeChange}
                                          name="description"
                                        ></textarea>
                                        {errors.description && (
                                          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                        )}
                                      </div>
                            
                                           
                                            {/* <div>
                                                <label 
                                                    
                                                    className="font-semibold text-xs text-[#344767] w-[80%]"
                                                >
                                                    Status: <span className="text-red-500 text-[14px]">*</span>
                                                </label>
                                                <select 
                                                    className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                    style={{paddingLeft:'12px'}}
                                                    value={addStoneTypeData.status}
                                                    onChange={handleAddStoneTypeChange}
                                                    name='status'
                                                   
                                                >
                                                    <option value="" className="text-gray-300">Select</option>
                                                    <option value="true" className="text-gray-500">Active</option>
                                                    <option value="false" className="text-gray-500">InActive</option>
                                                </select>
                                                {errors.status && (
                                                  <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                                                )}
                                            </div> */}
            
                                            </div> 
                                            {/* Button container positioned 10px above bottom */}
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
                                                style={{ backgroundColor:'#5E72e4' }}
                                               onClick={handleSubmitStoneType}
                                            >
                                                Create
                                            </button>
                                            </div>
                                        </div>
                                        </div>
                         )}
       
                        {editModal &&(
                                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                            <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[600px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                              <h3 className="font-bold text-[22px] text-[#344767] "
                                                >
                                                  Edit Stone Type                     </h3>
                                              <hr className=" border-gray-300"/>
                
                                              <div className="flex flex-col flex-grow gap-4"> {/* Added flex-grow */}
                                            
                                                  <div>
                                                    <label 
                                                    
                                                      className="font-semibold text-xs text-[#344767] w-[80%]"
                                                    >
                                                    Name: <span className="text-red-500 text-[14px]">*</span>
                                                    </label>
                                                    <input type="text" 
                                                      placeholder="Type here" 
                                                      className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                                      style={{paddingLeft:'12px'}}
                                                      value={editingStoneType?.name || ''}
                                                      onChange={handleEditStoneTypeChange}
                                                      name="name"
                                                    />
                                                    {errors.name && (
                                                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                                    )}
                                                  </div>
                                                  
                                                  <div>
                                                    <label 
                                                      
                                                      className="font-semibold text-xs text-[#344767] w-[100%]"
                                                    >
                                                      Description: <span className="text-red-500 text-[14px]">*</span>
                                                    </label>

                                                    <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                                      placeholder="Description" 
                                                      style={{paddingLeft:'12px',}}
                                                      value={editingStoneType?.description || ''}
                                                      onChange={handleEditStoneTypeChange}
                                                      name="description"
                                                    ></textarea>
                                                    {errors.description && (
                                                      <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                                                    )}
                                                  </div>
                                      
                                                    
                                                      <div>
                                                          <label 
                                                              
                                                              className="font-semibold text-xs text-[#344767] w-[80%]"
                                                          >
                                                              Status: <span className="text-red-500 text-[14px]">*</span>
                                                          </label>
                                                          <select 
                                                              className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                              style={{paddingLeft:'12px'}}
                                                              value={String(editingStoneType?.status)}
                                                              onChange={handleEditStoneTypeChange}
                                                              name='status'
                                                            
                                                          >
                                                              <option value="" className=" text-gray-600">Select </option>
                                                              <option value={true} className=" text-gray-600"> Active</option>
                                                              <option value={false} className=" text-gray-600"> InActive</option>
                                                          </select>
                                                          {errors.status && (
                                                            <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                                                          )}
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
                                                          Cancel
                                                      </button>
                                                      <button
                                                        type="button"
                                                        className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                                        style={{ backgroundColor: '#5E72E4' }}
                                                        onClick={handleEditSubmitStoneType}
                                                        disabled={isSubmitting}
                                                      >
                                                        {isSubmitting ? 'Updating...' : 'Update'}
                                                      </button>
                                                      </div>
                                                  </div>
                        </div>)}

 
                </>)
}

export default StoneType