
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import occasionModel from "../../../models/occasionModel";         
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import CustomScrollbar from "../../../components/CustomScrollbar";
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';



const Occasion=()=>{



                  const [isHovered, setIsHovered] = useState(false);
                  const [modal, setModal] = useState(false);
                  const [editModal, setEditModal] = useState(false);

                  const [occasions, setOccasions] = useState([]);

                  const [limit, setLimit] = useState(10);
                  const [page, setPage] = useState(1);
                  const [search, setSearch] = useState('');
                  const [status, setStatus] = useState('');

                  const [editingOccasion, setEditingOccasion] = useState(null);
                  const [editErrors, setEditErrors] = useState({});
                  const [isSubmitting, setIsSubmitting] = useState(false);

                  const auth = useSelector((state) => state.auth);
                  const { login_id, can_manage_user_types } = auth;

                  const user_id = login_id;
                  const user_types = Object.keys(can_manage_user_types || {}).join(',');

                  const [addOccasionData, setAddOccasionData] = useState({
                    name: '',
                    description: '',
                    status: '',
                  });

                  const [errors, setErrors] = useState({
                    name: '',
                    description: '',
                    status: '',
                  });

                  const [occasionData, setOccasionData] = useState([]);


                  const fetchOccasions = async () => {
                    try {
                      const response = await occasionModel.getOccasions(
                        user_id,
                        user_types,
                        limit,
                        page,
                        search,
                        status
                      );

                      console.log("Response from API:", response);

                      if (response.data && response.data.data) {
                        console.log("Occasions Received:", response.data.data);
                        setOccasionData(response.data.data);
                      } else {
                        toast.error("Unable to fetch occasions");
                      }
                    } catch (error) {
                      console.error("Error fetching occasions:", error);
                      toast.error("Failed to load occasions");
                    }
                  };

                  useEffect(() => {
                    fetchOccasions();
                  }, [limit, page, search, status]);

                            
                
                  const validateOccasion = () => {
                    const newErrors = {};
                    if (!addOccasionData.name.trim()) newErrors.name = 'Please enter name';
                    if (!addOccasionData.description.trim()) newErrors.description = 'Please enter description';
                    if (addOccasionData.status === '') newErrors.status = 'Please select status';
                    return newErrors;
                  };

                
                  const handleAddOccasionChange = (e) => {
                    const { name, value } = e.target;
                    setAddOccasionData((prev) => ({
                      ...prev,
                      [name]: value,
                    }));
                  };

                 
                  useEffect(() => {
                    console.log("Updated Occasion form state:", addOccasionData);
                  }, [addOccasionData]);

                
                  const handleSubmitOccasion = async () => {
                    const validationErrors = validateOccasion();
                    if (Object.keys(validationErrors).length > 0) {
                      setErrors(validationErrors);
                      return;
                    }

                    const payload = {
                      name: addOccasionData.name,
                      description: addOccasionData.description,
                      status: addOccasionData.status === 'true',
                      created_by: user_id,
                      created_by_type: user_types,
                    };

                    console.log("Occasion Payload being sent:", payload);

                    try {
                      const response = await occasionModel.createOccasion(payload);
                      console.log("Create Occasion response:", response);

                      if (response.status === 201 || response.status === 200) {
                        fetchOccasions();      
                        handleCloseModal();    
                        toast.success('Occasion created successfully!');
                      }
                    } catch (error) {
                      console.error("Create occasion error:", error);
                      toast.error('Failed to create occasion!');
                      handleCloseModal();

                      if (error.response?.data?.errors) {
                        setErrors((prev) => ({
                          ...prev,
                          ...error.response.data.errors,
                        }));
                      }
                    }
                  };
    
                      const validateEditOccasion = () => {
                        let valid = true;
                        const newErrors = { name: '', description: '', status: '' };

                        if (!editingOccasion?.name?.trim()) {
                          newErrors.name = 'Occasion name is required';
                          valid = false;
                        }

                        if (!editingOccasion?.description?.trim()) {
                          newErrors.description = 'Description is required';
                          valid = false;
                        }

                        if (editingOccasion?.status === undefined || editingOccasion.status === '') {
                          newErrors.status = 'Status is required';
                          valid = false;
                        }

                        setEditErrors(newErrors);
                        return valid;
                      };

                      const handleEditClickOccasion = (occasionObj) => {
                        if (!occasionObj || typeof occasionObj !== 'object' || !occasionObj.id) {
                          console.warn("Invalid object passed to handleEditClickOccasion:", occasionObj);
                          toast.error("Invalid occasion selected.");
                          return;
                        }

                        console.log("Selected Occasion for Edit:", occasionObj);
                        setEditingOccasion({ ...occasionObj });
                        setEditModal(true);
                      };

                      const handleEditOccasionChange = (e) => {
                        const { name, value } = e.target;
                        setEditingOccasion((prev) => ({
                          ...prev,
                          [name]: name === 'status' ? value === 'true' : value,
                        }));
                      };

                      const handleEditSubmitOccasion = async () => {
                        console.log("Editing Occasion:", editingOccasion);

                        if (!editingOccasion?.id) {
                          toast.error("Invalid occasion selected for editing.");
                          return;
                        }

                        if (!validateEditOccasion()) return;

                        setIsSubmitting(true);

                        try {
                          const response = await occasionModel.updateOccasion(
                            editingOccasion.id,
                            {
                              name: editingOccasion.name,
                              description: editingOccasion.description,
                              status:
                                editingOccasion.status === true ||
                                editingOccasion.status === 'true',
                            }
                          );

                          if (response.status === 200) {
                            fetchOccasions(); 
                            toast.success('Occasion updated successfully!');
                            setEditModal(false);
                          }
                        } catch (error) {
                          console.error("Update occasion error:", error);
                          toast.error('Failed to update occasion!');
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


                      const handleDeleteOccasion = async (id) => {
                      if (!id) return;

                      try {
                      await occasionModel.deleteOccasion(id); 

                      setOccasionData((prevData) => prevData.filter((item) => item.id !== id)); 
                      const modal = document.getElementById('my_modal_8'); 
                      if (modal && typeof modal.close === 'function') {
                        modal.close();
                      }

                      toast.success('Occasion deleted successfully');
                      } catch (error) {
                      console.error("Error deleting Occasion:", error);
                      toast.error('Failed to delete Occasion');
                      }
                      };


           
             // Handle close modal
             const handleCloseModal = () => {
               setModal(false);
               setEditModal(false)
             };
           

           
             return (
               
      <>
        <CustomScrollbar/>
          <div  className="bg-white w-full
                  max-w-[95vw] 
                  xl:max-w-[90vw] 
                  2xl:max-w-[95vw] 
                  h-auto max-h-[70vh] 
                  rounded-xl px-4 md:px-8 lg:px-12
                  mx-auto overflow-auto  custom-scrollbar"
                style={{ fontFamily: 'Open Sans',overflow:'auto'}}
                                                      >
        <CreateButton
            buttoncontent="+ New Occasion"
            onClick={() => setModal(true)}  
        />                 
        {/* <ItemsPerPageSelector items={items} setItems={setItems} /> */}
                                    
                                          
                                    
        <table className="table w-full text-sm text-left text-gray-500 border-collapse" 
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
            {occasionData.map((category, index) => (
              <tr key={category.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
              <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '20px' }}>
                {index+1}
              </td>
              <td className="px-6 py-5 border-b border-gray-200 text-xs">{category.name}</td>
              <td className="px-6 py-5 border-b border-gray-200 text-xs">{category.description}</td>
              <td className="px-6 py-5 border-b border-gray-200 text-xs">
                {category.status ? (
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
                    onClick={()=>handleEditClickOccasion(category)}/>
                  <DeleteButton 
                    buttonText="Delete Occasion" 
                    modalId={`delete_modal_${category.id}`} 
                    onConfirmDelete={() => handleDeleteOccasion(category.id)}
                  />
                </div>
              </td>
              </tr>
            ))}
        </tbody>
        </table>
                                          
                                    
         <Pagination/>
                                          
          </div>

 {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[500px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
            <h3 className="font-bold text-[22px] text-[#344767] ">
                Create Occasion                      
            </h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                <label 
                    className="font-semibold text-xs text-[#344767] w-[80%]">
                      Name:
                </label>
                <input type="text" 
                    placeholder="Type here" 
                    className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-300 text-gray-500 focus:border-b-2 focus:border-blue-500"                                       
                    style={{paddingLeft:'12px'}}
                    value={addOccasionData.name}
                    onChange={handleAddOccasionChange}
                    name="name"
                />
                                                
                <label 
                  className="font-semibold text-xs text-[#344767] w-[100%]">
                      Description:
                </label>
                <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                    placeholder="Description" 
                    style={{paddingLeft:'12px',}}
                    value={addOccasionData.description}
                    onChange={handleAddOccasionChange}
                    name="description"
                ></textarea>               
                <label 
                  className="font-semibold text-xs text-[#344767] w-[80%]">
                      Status:
                </label>
                <select defaultValue=""
                  className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                  style={{paddingLeft:'12px'}}
                  value={addOccasionData.status}
                  onChange={handleAddOccasionChange}
                  name='status'
                >
                    <option value="" className="text-gray-600">Select</option>
                    <option value="true" className="text-gray-600">Active</option>
                    <option value="false" className="text-gray-600">InActive</option>
                </select>
            
            </div> 
          {/* Button container positioned 10px above bottom */}
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4  ">
            <button
              type="button"
              className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
              style={{ backgroundColor: '#5E72e4' }}
              onClick={handleSubmitOccasion}
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
                <h3 className="font-bold text-[22px] text-[#344767] ">
                  Edit Occasion                     
                </h3>
                <hr className=" border-gray-300"/>
                  <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                      <label 
                        className="font-semibold text-xs text-[#344767] w-[80%]">
                          Name:
                      </label>
                    <input type="text" 
                      placeholder="Type here" 
                      className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                      style={{paddingLeft:'12px'}}
                      value={editingOccasion.name}
                      onChange={handleEditOccasionChange}
                      name="name"
                    />
                                              
                    <label 
                        className="font-semibold text-xs text-[#344767] w-[100%]">
                          Description:
                    </label>
                    <textarea 
                      className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                      placeholder="Description" 
                      style={{paddingLeft:'12px',}}
                      value={editingOccasion.description}
                      onChange={handleEditOccasionChange}
                      name="description"
                    ></textarea>
                              
                    <label 
                        className="font-semibold text-xs text-[#344767] w-[80%]">
                          Status:
                    </label>
                    <select defaultValue=""
                        className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                        style={{paddingLeft:'12px'}}
                        value={String(editingOccasion?.Status)}
                        onChange={handleEditOccasionChange}
                        name='status'
                    >
                        <option value="" className=" text-gray-600">Select </option>
                        <option value={true} className=" text-gray-600"> Active</option>
                        <option value={false} className=" text-gray-600"> InActive</option>
                    </select>
              
                  </div> 
                {/* Button container positioned 10px above bottom */}
                  <div className="flex flex-col sm:flex-row justify-end items-end gap-4  ">
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
                            style={{ backgroundColor: '#5E72E4' }}
                            onClick={handleEditSubmitOccasion}
                            disabled={isSubmitting}
                      >
                            {isSubmitting ? 'Updating...' : 'Update'}
                      </button>
                  </div>
            </div>
        </div>)}

                   
       </>)}

export default  Occasion