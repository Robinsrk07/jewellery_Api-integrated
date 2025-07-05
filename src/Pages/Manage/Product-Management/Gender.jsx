import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import productGenderModel from "../../../models/productGenderModel";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import CustomScrollbar from "../../../components/CustomScrollbar";
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';


const Gender =()=>{


              const auth = useSelector((state) => state.auth);
              const { login_id, can_manage_user_types } = auth;

              const user_id = login_id;
              const user_types = Object.keys(can_manage_user_types || {}).join(',');

              const [modal, setModal] = useState(false);   
              const [editModal, setEditModal] = useState(false);
              const [items, setItems] = useState(10);
              const [productGenderData, setProductGenderData] = useState([]); 
              const [editingProductGender, setEditingProductGender] = useState(null); 
              const [limit, setLimit] = useState(10);
              const [page, setPage] = useState(1);
              const [search, setSearch] = useState('');
              const [status, setStatus] = useState(''); // "true" | "false" | ""
              const [isSubmitting, setIsSubmitting] = useState(false);

              
              const [addProductGenderData, setAddProductGenderData] = useState({
                name: '',
                description: '',
                status: 'true',
              });

              
              const [errors, setErrors] = useState({
                name: '',
                description: '',
                status: '',
              });


              const fetchProductGenders = async () => {
                try {
                  const response = await productGenderModel.getProductGenders(
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
                    setProductGenderData(response.data.data); // Sets your table/list data
                  } else {
                    toast.error("Unable to fetch product genders");
                  }
                } catch (error) {
                  console.error("Error fetching product genders:", error);
                  toast.error("Failed to load product genders");
                }
              };

              useEffect(() => {
                fetchProductGenders();
              }, [limit, page, search, status]);




            const validateProductGender = () => {
              const newErrors = {};
              if (!addProductGenderData.name.trim()) newErrors.name = 'Please enter name';
              if (!addProductGenderData.description.trim()) newErrors.description = 'Please enter description';
              if (addProductGenderData.status === '') newErrors.status = 'Please select status';
              return newErrors;
            };


            const handleAddProductGenderChange = (e) => {
              const { name, value } = e.target;
              setAddProductGenderData((prev) => ({
                ...prev,
                [name]: value,
              }));
            };

            useEffect(() => {
              console.log("Updated Product Gender form state:", addProductGenderData);
            }, [addProductGenderData]);


            const handleSubmitProductGender = async () => {
              const validationErrors = validateProductGender();
              if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
              }

              const payload = {
                name: addProductGenderData.name,
                description: addProductGenderData.description,
                status: addProductGenderData.status === 'true',
                created_by: user_id,
                created_by_type: user_types,
              };

              console.log("Payload being sent:", payload);

              try {
                const response = await productGenderModel.createProductGender(payload);
                console.log("Create Product Gender response:", response);

                if (response.status === 201 || response.status === 200) {
                  fetchProductGenders();     // reload list
                  handleCloseModal();        // close modal
                  toast.success('Product gender created successfully!');
                }
              } catch (error) {
                console.error("Create product gender error:", error);
                toast.error('Failed to create product gender!');
                handleCloseModal();

                if (error.response?.data?.errors) {
                  setErrors((prev) => ({
                    ...prev,
                    ...error.response.data.errors,
                  }));
                }
              }
            }; 

                const [editErrors, setEditErrors] = useState({
                  name: '',
                  description: '',
                  status: ''
                });
      

                const handleEditClick = (genderObj) => {
                  console.log("Selected for Edit:", genderObj);
                  setEditingProductGender({ ...genderObj });
                  setEditModal(true);
                };

                const handleEditProductGenderChange = (e) => {
                  const { name, value } = e.target;
                  setEditingProductGender((prev) => ({
                    ...prev,
                    [name]: name === 'status' ? value === 'true' : value,
                  }));
                };

                const validateEditProductGender = () => {
                  let valid = true;
                  const newErrors = { name: '', description: '', status: '' };

                  if (!editingProductGender?.name?.trim()) {
                    newErrors.name = 'Product gender name is required';
                    valid = false;
                  }

                  if (!editingProductGender?.description?.trim()) {
                    newErrors.description = 'Description is required';
                    valid = false;
                  }

                  if (editingProductGender?.status === undefined || editingProductGender.status === '') {
                    newErrors.status = 'Status is required';
                    valid = false;
                  }

                  setEditErrors(newErrors);
                  return valid;
                };

                const handleEditSubmitProductGender = async () => {
                  console.log("Editing Product Gender:", editingProductGender);

                  if (!editingProductGender?.id) {
                    toast.error("Invalid product gender selected for editing.");
                    return;
                  }

                  if (!validateEditProductGender()) return;

                  setIsSubmitting(true);
                  try {
                    const response = await productGenderModel.updateProductGender(
                      editingProductGender.id,
                      {
                        name: editingProductGender.name,
                        description: editingProductGender.description,
                        status: editingProductGender.status === true || editingProductGender.status === 'true',
                      }
                    );

                    if (response.status === 200) {
                      fetchProductGenders(); // Refresh list
                      toast.success('Product gender updated successfully!');
                      setEditModal(false);
                    }
                  } catch (error) {
                    console.error("Update error:", error);
                    toast.error('Failed to update product gender!');
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
              

                const handleDeleteProductGender = async (id) => {
                  console.log("Deleting Product Gender with ID:", id);
                  if (!id) return;

                  try {
                    await productGenderModel.deleteProductGender(id); // Call the delete API

                    setProductGenderData((prevData) => prevData.filter((item) => item.id !== id));

                
                    const modal = document.getElementById('my_modal_8');
                    if (modal && typeof modal.close === 'function') {
                      modal.close();
                    }

                    toast.success('Product Gender deleted successfully');
                  } catch (error) {
                    console.error("Error deleting Product Gender:", error);
                    toast.error('Failed to delete Product Gender');
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
            buttoncontent="+ New Gender"
            onClick={() => setModal(true)}  // This will now work!
             />                 
            <ItemsPerPageSelector items={items} setItems={setItems} />
   
         
   
         <table className="table w-full text-sm text-left text-gray-500" 
      style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '1200px' }}>
      <thead className="text-xs text-gray-400 uppercase bg-white">
        <tr>
          <th className="px-6 py-3" style={{ paddingLeft: '10px' }}>SL NO</th>
          <th className="px-6 py-3">NAME</th>
          <th className="px-6 py-3">DESCRIPTION</th>
          <th className="px-6 py-3">STATUS</th>
          <th className="px-6 py-3">ACTION</th>
        </tr>
      </thead>
      <tbody>
        {productGenderData.map((gender, index) => (
          <tr key={gender.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
            <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
              {index+1}
            </td>
            <td className="px-6 py-5 border-b border-gray-200 text-xs">{gender.name}</td>
            <td className="px-6 py-5 border-b border-gray-200 text-xs">{gender.description}</td>
            <td className="px-6 py-5 border-b border-gray-200 text-xs">
              {gender.status ? (
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
                onClick={()=>handleEditClick(gender)}
               />
                <DeleteButton 
                buttonText="Delete Product Gender" 
                modalId={`delete_modal_${gender.id}`} 
                 onConfirmDelete={() => handleDeleteProductGender(gender.id)}
               />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
         
   
         {/* Pagination */}
          <Pagination/>
   

        </div>
        {modal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
              <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[400px] h-[95vh] max-h-[500px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}>                                                 
                  <h3 className="font-bold text-[22px] text-[#344767] ">
                        Create Product Gender                       
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
                          value={addProductGenderData.name}
                          onChange={handleAddProductGenderChange}
                          name="name"
                      />
                                      
                      <label 
                        className="font-semibold text-xs text-[#344767] w-[100%]">
                          Description:
                      </label>

                      <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                          placeholder="Description" 
                          style={{paddingLeft:'12px',color: '#374151',}}
                          value={addProductGenderData.description}
                          onChange={handleAddProductGenderChange}
                          name="description"
                      ></textarea>
                      <label 
                          className="font-semibold text-xs text-[#344767] w-[80%]">
                            Status:
                      </label>
                      <select defaultValue=""
                          className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                          style={{paddingLeft:'12px'}}
                          onClick={handleAddProductGenderChange}
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
                       style={{ backgroundColor: '#8392ab' }}
                       onClick={handleSubmitProductGender}
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
              <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[400px] h-[95vh] max-h-[500px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}>                                                 
                  <h3 className="font-bold text-[22px] text-[#344767] ">
                        Edit Product Gender                      
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
                            value={editingProductGender.name}
                            onChange={(e)=>handleEditProductGenderChange(e)}
                            name="name"
                        />
                        <label 
                            className="font-semibold text-xs text-[#344767] w-[100%]">
                              Description:
                        </label>
                         <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                              placeholder="Description" 
                              tyle={{paddingLeft:'12px',color: '#374151',}}
                              value={editingProductGender.description}
                              onChange={(e)=>handleEditProductGenderChange(e)}
                              name="description"
                          ></textarea>
                          <label 
                            className="font-semibold text-xs text-[#344767] w-[80%]">
                                  Status:
                          </label>
                          <select defaultValue=""
                                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                style={{paddingLeft:'12px'}}
                                value={editingProductGender.status}
                                onChange={(e)=>handleEditProductGenderChange(e)}
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
                      onClick={handleEditCloseModal}
                  >
                      Close
                  </button>
                  <button
                      type="button"
                      className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                      style={{ backgroundColor: '#5E72E4' }}
                      onClick={handleEditSubmitProductGender}
                      disabled={isSubmitting}
                  >
                      {isSubmitting ? 'Updating...' : 'Update'}
                  </button>
                  </div>
              </div>
          </div>)}



        </>)}

export default Gender