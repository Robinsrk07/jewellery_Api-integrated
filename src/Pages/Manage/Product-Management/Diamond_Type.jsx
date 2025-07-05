import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import diamondTypeModel from "../../../models/diamondTypeModel";         
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import CustomScrollbar from "../../../components/CustomScrollbar";
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';


const Diamond_Type = ()=>{
   
                const  [isHovered, setIsHovered] = useState(false);
                const [modal, setModal] = useState(false);
                const [editModal, setEditModal] = useState(false);

                const [diamondTypes, setDiamondTypes] = useState([]);

                const [limit, setLimit] = useState(10);
                const [page, setPage] = useState(1);
                const [search, setSearch] = useState('');
                const [status, setStatus] = useState('');

                const [editingDiamondType, setEditingDiamondType] = useState(null);
                const [editErrors, setEditErrors] = useState({});
                const [isSubmitting, setIsSubmitting] = useState(false);

                const auth = useSelector((state) => state.auth);
                const { login_id, can_manage_user_types } = auth;

                const user_id = login_id;
                const user_types = Object.keys(can_manage_user_types || {}).join(',');

                const [addDiamondTypeData, setAddDiamondTypeData] = useState({
                  name: '',
                  description: '',
                  status: '',
                });

                const [errors, setErrors] = useState({
                  name: '',
                  description: '',
                  status: '',
                });

              const [diamondTypeData, setDiamondTypeData] = useState([]);



                      const fetchDiamondTypes = async () => {
                        try {
                          const response = await diamondTypeModel.getDiamondTypes(
                            user_id,
                            user_types,
                            limit,
                            page,
                            search,
                            status
                          );

                          console.log("Response from API:", response);

                          if (response.data && response.data.data) {
                            console.log("Diamond Types Received:", response.data.data);
                            setDiamondTypes(response.data.data);  
                          } else {
                            toast.error("Unable to fetch diamond types");
                          }
                        } catch (error) {
                          console.error("Error fetching diamond types:", error);
                          toast.error("Failed to load diamond types");
                        }
                      };

                      useEffect(() => {
                        fetchDiamondTypes();
                      }, [limit, page, search, status]);


                
                  const validateDiamondType = () => {
                    const newErrors = {};
                    if (!addDiamondTypeData.name.trim()) newErrors.name = 'Please enter name';
                    if (!addDiamondTypeData.description.trim()) newErrors.description = 'Please enter description';
                    if (addDiamondTypeData.status === '') newErrors.status = 'Please select status';
                    return newErrors;
                  };


                  const handleAddDiamondTypeChange = (e) => {
                    const { name, value } = e.target;
                    setAddDiamondTypeData((prev) => ({
                      ...prev,
                      [name]: value,
                    }));
                  };

        
                  useEffect(() => {
                    console.log("Updated Diamond Type form state:", addDiamondTypeData);
                  }, [addDiamondTypeData]);

                  
                  const handleSubmitDiamondType = async () => {
                    const validationErrors = validateDiamondType();
                    if (Object.keys(validationErrors).length > 0) {
                      setErrors(validationErrors);
                      return;
                    }

                    const payload = {
                      name: addDiamondTypeData.name,
                      description: addDiamondTypeData.description,
                      status: addDiamondTypeData.status === 'true',
                      created_by: user_id,
                      created_by_type: user_types,
                    };

                    console.log("Diamond Type Payload being sent:", payload);

                    try {
                      const response = await diamondTypeModel.createDiamondType(payload);
                      console.log("Create Diamond Type response:", response);

                      if (response.status === 201 || response.status === 200) {
                        fetchDiamondTypes();          
                        handleCloseModal();           
                        toast.success('Diamond type created successfully!');
                      }
                    } catch (error) {
                      console.error("Create diamond type error:", error);
                      toast.error('Failed to create diamond type!');
                      handleCloseModal();

                      if (error.response?.data?.errors) {
                        setErrors((prev) => ({
                          ...prev,
                          ...error.response.data.errors,
                        }));
                      }
                    }
                  };

                  
                                            
                          const validateEditDiamondType = () => {
                            let valid = true;
                            const newErrors = { name: '', description: '', status: '' };

                            if (!editingDiamondType?.name?.trim()) {
                              newErrors.name = 'Diamond type name is required';
                              valid = false;
                            }

                            if (!editingDiamondType?.description?.trim()) {
                              newErrors.description = 'Description is required';
                              valid = false;
                            }

                            if (editingDiamondType?.status === undefined || editingDiamondType.status === '') {
                              newErrors.status = 'Status is required';
                              valid = false;
                            }

                            setEditErrors(newErrors);
                            return valid;
                          };

                          const handleEditClickDiamondType = (typeObj) => {
                            if (!typeObj || typeof typeObj !== 'object' || !typeObj.id) {
                              console.warn("Invalid object passed to handleEditClickDiamondType:", typeObj);
                              toast.error("Invalid diamond type selected.");
                              return;
                            }

                            console.log("Selected for Edit:", typeObj);
                            setEditingDiamondType({ ...typeObj });
                            setEditModal(true);
                          };

                          const handleEditDiamondTypeChange= (e) => {
                          const { name, value } = e.target;
                            setEditingDiamondType((prev) => ({
                            ...prev,
                            [name]: name === 'status' ? value === 'true' : value,
                            }));
                            };

                          const handleEditSubmitDiamondType = async () => {
                            console.log("Editing Diamond Type:", editingDiamondType);

                            if (!editingDiamondType?.id) {
                              toast.error("Invalid diamond type selected for editing.");
                              return;
                            }

                            if (!validateEditDiamondType()) return;

                            setIsSubmitting(true);

                            try {
                              const response = await diamondTypeModel.updateDiamondType(
                                editingDiamondType.id,
                                {
                                  name: editingDiamondType.name,
                                  description: editingDiamondType.description,
                                  status:
                                    editingDiamondType.status === true ||
                                    editingDiamondType.status === 'true',
                                }
                              );

                              if (response.status === 200) {
                                fetchDiamondTypes(); // Reload table
                                toast.success('Diamond type updated successfully!');
                                setEditModal(false);
                              }
                            } catch (error) {
                              console.error("Update error:", error);
                              toast.error('Failed to update diamond type!');
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


                          
                          const handleDeleteDiamondType = async (id) => {
                          console.log("Deleting diamond type with ID:", id);
                          if (!id) return;

                          try {
                            await diamondTypeModel.deleteDiamondType(id); 

                            setDiamondTypes((prevData) => prevData.filter((item) => item.id !== id)); 

                            const modal = document.getElementById('my_modal_8'); 
                            if (modal && typeof modal.close === 'function') {
                              modal.close();
                            }

                            toast.success('Diamond type deleted successfully');
                          } catch (error) {
                            console.error("Error deleting diamond type:", error);
                            toast.error('Failed to delete diamond type');
                          }
                        };

       
       
                          // Handle close modal
                          const handleCloseModal = () => {
                            setModal(false);
                          };
                          const handleEditCloseModal = () => {
                            setEditModal(false)
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
                    buttoncontent="+ New Diamond Type"
                    onClick={() => setModal(true)}  // This will now work!
                    />                 
                    {/* <ItemsPerPageSelector items={items} setItems={setItems} /> */}
              
                    
              
                      <table className="table w-full text-sm text-left text-gray-500" 
                        style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '1200px' }}>
                        <thead className="text-xs text-gray-400 uppercase bg-white">
                          <tr>
                            <th className="px-6 py-3" style={{ width: '70px', paddingLeft: '20px' }}>SL NO</th>
                            <th className="px-6 py-3" style={{ width: '130px' }}>NAME</th>
                            <th className="px-6 py-3" style={{ width: '500px' }}>DESCRIPTION</th>
                            <th className="px-6 py-3" style={{ width: '90px' }}>STATUS</th>
                            <th className="px-6 py-3" style={{ width: '90px' }}>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {diamondTypes.map((diamond, index) => (
                            <tr key={diamond.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                              <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '20px' }}>
                                {index+1}
                              </td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{diamond.name}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{diamond.description}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">
                               {diamond.status ? (
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
                                    onClick={()=>handleEditClickDiamondType(diamond)}
                                      />
                                  <DeleteButton 
                                    buttonText="Delete Diamond Type" 
                                    modalId={`delete_modal_${diamond.id}`} 
                                    onConfirmDelete={() => handleDeleteDiamondType(diamond.id)} 
                                  />
                                </div>
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
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[500px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Create Diamond Type                      
                                    </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                                      <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name:
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        value={addDiamondTypeData.name}
                                        onChange={handleAddDiamondTypeChange}
                                        name="name"
                                      />
                                      
                                      

                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Description:
                                      </label>

                                      <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                        placeholder="Description" 
                                        style={{paddingLeft:'12px',}}
                                        value={addDiamondTypeData.description}
                                        onChange={handleAddDiamondTypeChange}
                                        name="description"
                                      ></textarea>
                            
                                           
                                            <label 
                                                
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Status:
                                            </label>
                                            <select 
                                                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                style={{paddingLeft:'12px'}}
                                                value={addDiamondTypeData.status}
                                                onChange={handleAddDiamondTypeChange}
                                                name='status'
                                               
                                            >
                                                <option value="" className="text-gray-300">Select</option>
                                                <option value="true" className="text-gray-500">Active</option>
                                                <option value="false" className="text-gray-500">InActive</option>
                                            </select>
            
                                            </div> 
                                            {/* Button container positioned 10px above bottom */}
                                            <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                                >
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#8392ab' }}
                                               onClick={handleSubmitDiamondType}
                                            >
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px]  rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#5E72e4' }}
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
                                                <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[500px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                                  <h3 className="font-bold text-[22px] text-[#344767] "
                                                    >
                                                      Edit Diamond Type                     </h3>
                                                  <hr className=" border-gray-300"/>
                    
                                                  <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                                                
                                                    
                                                    <label 
                                                    
                                                      className="font-semibold text-xs text-[#344767] w-[80%]"
                                                    >
                                                    Name:
                                                    </label>
                                                    <input type="text" 
                                                      placeholder="Type here" 
                                                      className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                                      style={{paddingLeft:'12px'}}
                                                      value={editingDiamondType.name}
                                                      onChange={handleEditDiamondTypeChange}
                                                      name="name"
                                                    />
                                                    
                                                    

                                                    <label 
                                                      
                                                      className="font-semibold text-xs text-[#344767] w-[100%]"
                                                    >
                                                      Description:
                                                    </label>

                                                    <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                                      placeholder="Description" 
                                                      style={{paddingLeft:'12px',}}
                                                      value={editingDiamondType.description}
                                                      onChange={handleEditDiamondTypeChange}
                                                      name="description"
                                                    ></textarea>
                                          
                                                        
                                                          <label 
                                                              
                                                              className="font-semibold text-xs text-[#344767] w-[80%]"
                                                          >
                                                              Status:
                                                          </label>
                                                          <select defaultValue=""
                                                              className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                              style={{paddingLeft:'12px'}}
                                                              value={String(editingDiamondType?.status)}
                                                              onChange={handleEditDiamondTypeChange}
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
                                                            onClick={handleEditSubmitDiamondType}
                                                            disabled={isSubmitting}
                                                          >
                                                            {isSubmitting ? 'Updating...' : 'Update'}
                                                          </button>
                                                          </div>
                                                      </div>
                                      </div>)}
 
            </>)
}
export default Diamond_Type