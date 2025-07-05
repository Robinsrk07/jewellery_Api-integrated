import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import designModel from "../../../models/designModel"; 
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';


const Design= ()=>{

                  const [modal, setModal] = useState(false);
                  const [editModal, setEditModal] = useState(false);
                  const [designs, setDesigns] = useState([]);
                  const [limit, setLimit] = useState(10);
                  const [page, setPage] = useState(1);
                  const [search, setSearch] = useState('');
                  const [status, setStatus] = useState('');
                  const [editingDesign, setEditingDesign] = useState(null);
                  const [editErrors, setEditErrors] = useState({});
                  const [isSubmitting, setIsSubmitting] = useState(false);
                  const auth = useSelector((state) => state.auth);
                  const { login_id, can_manage_user_types } = auth;

                  const user_id = login_id;
                  const user_types = Object.keys(can_manage_user_types || {}).join(',');

                   const [addDesignData, setAddDesignData] = useState({
                    name: '',
                    description: '',
                    status: ''
                  });

                  const [errors, setErrors] = useState({
                    name: '',
                    description: '',
                    status: '',
                  });
    

                        // Fetch designs
                        const fetchDesigns = async () => {
                          try {
                            const response = await designModel.getDesigns(
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
                              setDesigns(response.data.data);
                            } else {
                              toast.error("Unable to fetch designs");
                            }
                          } catch (error) {
                            console.error("Error fetching designs:", error);
                            toast.error("Failed to load designs");
                          }
                        };

                        useEffect(() => {
                          fetchDesigns();
                        }, [limit, page, search, status]);



                      // Validation function
                      const validateDesign = () => {
                        const newErrors = {};
                        if (!addDesignData.name.trim()) newErrors.name = 'Please enter name';
                        if (!addDesignData.description.trim()) newErrors.description = 'Please enter description';
                        if (addDesignData.status === '') newErrors.status = 'Please select status';
                        return newErrors;
                      };

                      // Input change handler
                      const handleAddDesignChange = (e) => {
                        const { name, value } = e.target;
                        setAddDesignData((prev) => ({
                          ...prev,
                          [name]: value,
                        }));
                      };

                      // Debug useEffect
                      useEffect(() => {
                        console.log("Updated Design form state:", addDesignData);
                      }, [addDesignData]);

                      // Submit handler
                      const handleSubmitDesign = async () => {
                        const validationErrors = validateDesign();
                        if (Object.keys(validationErrors).length > 0) {
                          setErrors(validationErrors);
                          return;
                        }

                        const payload = {
                          name: addDesignData.name,
                          description: addDesignData.description,
                          status: addDesignData.status === 'true',
                          created_by: user_id,
                          created_by_type: user_types,
                        };

                        console.log("Payload being sent:", payload);

                        try {
                          const response = await designModel.createDesign(payload);
                          console.log("Create Design response:", response);

                          if (response.status === 201 || response.status === 200) {
                            fetchDesigns();
                            handleCloseModal();
                            toast.success('Design created successfully!');
                          }
                        } catch (error) {
                          console.error("Create design error:", error);
                          toast.error('Failed to create design!');
                          handleCloseModal();

                          if (error.response?.data?.errors) {
                            setErrors((prev) => ({
                              ...prev,
                              ...error.response.data.errors,
                            }));
                          }
                        }
                      };



                          const handleEditClick = (designObj) => {
                            console.log("Selected for Edit:", designObj);
                            setEditingDesign({ ...designObj });
                            setEditModal(true);
                          };
                          const handleEditDesignChange = (e) => {
                            const { name, value } = e.target;
                            setEditingDesign((prev) => ({
                              ...prev,
                              [name]: name === 'status' ? value === 'true' : value,
                            }));
                          };
                          const validateEditDesign = () => {
                            let valid = true;
                            const newErrors = { name: '', description: '', status: '' };

                            if (!editingDesign?.name?.trim()) {
                              newErrors.name = 'Design name is required';
                              valid = false;
                            }

                            if (!editingDesign?.description?.trim()) {
                              newErrors.description = 'Description is required';
                              valid = false;
                            }

                            if (editingDesign?.status === undefined || editingDesign.status === '') {
                              newErrors.status = 'Status is required';
                              valid = false;
                            }

                            setEditErrors(newErrors);
                            return valid;
                          };
                          const handleEditSubmitDesign = async () => {
                            console.log("Editing Design:", editingDesign);

                            if (!editingDesign?.id) {
                              toast.error("Invalid design selected for editing.");
                              return;
                            }

                            if (!validateEditDesign()) return;

                            setIsSubmitting(true);
                            try {
                              const response = await designModel.updateDesign(
                                editingDesign.id,
                                {
                                  name: editingDesign.name,
                                  description: editingDesign.description,
                                  status: editingDesign.status === true || editingDesign.status === 'true',
                                }
                              );

                              if (response.status === 200) {
                                fetchDesigns(); // Refresh list
                                toast.success('Design updated successfully!');
                                setEditModal(false);
                              }
                            } catch (error) {
                              console.error("Update error:", error);
                              toast.error('Failed to update design!');
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


                        const handleDeleteDesign = async (id) => {
                          console.log("Deleting design with ID:", id);
                          if (!id) return;

                          try {
                            await designModel.deleteDesign(id); 

                            setDesigns((prevData) => prevData.filter((item) => item.id !== id)); 

                            
                            const modal = document.getElementById('my_modal_8');
                            if (modal && typeof modal.close === 'function') {
                              modal.close();
                            }

                            toast.success('Design deleted successfully');
                          } catch (error) {
                            console.error("Error deleting design:", error);
                            toast.error('Failed to delete design');
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
                    buttoncontent="+ New Design"
                    onClick={() => setModal(true)}  
                    />                 
                  {/* <ItemsPerPageSelector items={items} setItems={setItems} /> */}

                        <table className="w-full text-sm text-left text-gray-500 border-collapse overflow-x-auto"
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
                  {designs.map((design, index) => (
                    <tr key={design.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                      <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '20px' }}>
                        {/* {design.id} */}
                        {index+1}
                      </td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">{design.name}</td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">{design.description}</td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">
                          {design.status ? (
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
                         onClick={()=>handleEditClick(design)}
                         />
                          <DeleteButton 
                             buttonText="Delete Design" 
                             modalId={`delete_modal_${design.id}`} 
                             onConfirmDelete={() => handleDeleteDesign(design.id)} 
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
                                         Create Design                     </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-4"> {/* Added flex-grow */}
                                   
                                      
                                      <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name:
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        value={addDesignData.name}
                                        onChange={handleAddDesignChange}
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
                                       value={addDesignData.description}
                                       onChange={handleAddDesignChange}
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
                                                // value={addDesignData.status}
                                                onChange={handleAddDesignChange}
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
                                               onClick={handleSubmitDesign}
                                            >
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px]  rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#8392ab' }}
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
                                        Edit Design      
                                                     </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-4"> {/* Added flex-grow */}
                                   
                                      
                                      <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name:
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        value={editingDesign.name}
                                        onChange={(e)=>handleEditDesignChange(e)}
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
                                        value={editingDesign.description}
                                        onChange={(e)=>handleEditDesignChange(e)}
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
                                                value={String(editingDesign?.status)}
                                                onChange={handleEditDesignChange}
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
                                                style={{ backgroundColor: '#8392ab'}}
                                                onClick={handleEditCloseModal}
                                            >
                                                Close
                                            </button>
                                            <button
                                              type="button"
                                              className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                              style={{ backgroundColor: '#5E72E4' }}
                                              onClick={handleEditSubmitDesign}
                                              disabled={isSubmitting}
                                            >
                                              {isSubmitting ? 'Updating...' : 'Update'}
                                            </button>
                                            </div>
                                        </div>
                        </div>)}
       
                          
                     </>)
}

export default Design