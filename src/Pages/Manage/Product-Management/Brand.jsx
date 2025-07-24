import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import '@fontsource/open-sans'; // Default weight 400
import '@fontsource/open-sans/600.css'; // Semi-bold
import '@fontsource/open-sans/700.css'; // Bold
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import CustomScrollbar from "../../../components/CustomScrollbar";
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import BrandModel from "../../../models/brandModel"; 
import TableSkelton from "../../../components/tableSkelton";
     const  Brand = () => {


              const auth = useSelector((state) => state.auth);
              const { login_id, can_manage_user_types } = auth;

              const user_id = login_id;
              const user_types = Object.keys(can_manage_user_types || {}).join(',');
    
       
                    const [modal, setModal] = useState(false)   
                    const [totalPages, setTotalPages] = useState(1);

                    const [editModal,setEditModal]= useState(false)
                    const [deletingId, setDeletingId] = useState(null);
                    const [itemToDelete, setItemToDelete] = useState(null);
                    const [brandData, setBrandData] = useState([]); 
                    const [editingBrand, setEditingBrand] = useState(null); 
                     const [isLoading, setIsLoading] = useState(true);
                    const [limit, setLimit] = useState(10);
                    const [page, setPage] = useState(1);
                    const [search, setSearch] = useState('');
                    const [status, setStatus] = useState(''); // "true" | "false" | ""
                    const [isSubmitting, setIsSubmitting] = useState(false);

                    
                    const [addBrandData, setAddBrandData] = useState({
                      name: '',
                      code: '',
                      description: '',
                      
                    });

                    
                    const [errors, setErrors] = useState({
                      name: '',
                      code: '',
                      description: '',
                      status: '',
                    });



                    const fetchBrands = async () => {
                      try {
                        const response = await BrandModel.getBrands(
                          user_id,
                          user_types,
                          limit,
                          page,
                          search,
                          status
                        );

                        console.log("Response from API:", response);

                        if (response.data && response.data.data) {
                         
                          setBrandData(response.data.data); 
                           setTotalPages(response.data.pagination.pages);
                        } else {
                          toast.error("Unable to fetch brands");
                        }
                      } catch (error) {
                        console.error("Error fetching brands:", error);
                        toast.error("Failed to load brands");
                      }finally{
                        setIsLoading(false)
                      }
                    };

                    useEffect(() => {
                      fetchBrands();
                    }, [limit, page, search, status]);
   


                  const validateBrand = () => {
                  const newErrors = {};
                  if (!addBrandData.name.trim()) newErrors.name = 'Please enter name';
                  if (!addBrandData.code.trim()) newErrors.code = 'Please enter code';
                  if (!addBrandData.description.trim()) newErrors.description = 'Please Enter the Description';
                  if (addBrandData.status === '') newErrors.status = 'Please select status';
                  return newErrors;
                };

                  const handleAddBrandChange = (e) => {
                    const { name, value } = e.target;
                    setAddBrandData((prev) => ({
                      ...prev,
                      [name]: value,
                    }));
                  };

                  useEffect(() => {
                    console.log("Updated Brand form state:", addBrandData);
                  }, [addBrandData]);


                  const handleSubmitBrand = async () => {
                    const validationErrors = validateBrand();
                    if (Object.keys(validationErrors).length > 0) {
                      setErrors(validationErrors);
                      return;
                    }

                    const payload = {
                      name: addBrandData.name,
                      code: addBrandData.code,
                      description: addBrandData.description,
                      status: addBrandData.status === 'true '
                    };



                    try {
                      const response = await BrandModel.createBrand(payload);
                      console.log("Create Brand response:", response);

                      if (response.status === 201 || response.status === 200) {
                        fetchBrands();
                        handleCloseModal(); 
                        toast.success('Brand created successfully!');
                      }
                    } catch (error) {
                      console.error("Create brand error:", error);
                      toast.error('Failed to create brand!');
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
                      code: '',
                      description: '',
                      status: '',
                    });


                                      
                    const handleEditClick = (brandObj) => {
                      console.log("Selected for Edit:", brandObj);
                      setEditingBrand({ ...brandObj });
                      setEditModal(true);
                    };

                    const handleEditBrandChange = (e) => {
                      const { name, value } = e.target;
                      setEditingBrand((prev) => ({
                        ...prev,
                        [name]: name === 'status' ? value === 'true' : value,
                      }));
                    };

                    const validateEditBrand = () => {
                      let valid = true;
                      const newErrors = { name: '', code: '', description: '', status: '' };

                      if (!editingBrand?.name?.trim()) {
                        newErrors.name = 'Brand name is required';
                        valid = false;
                      }

                      if (!editingBrand?.code?.trim()) {
                        newErrors.code = 'Brand code is required';
                        valid = false;
                      }

                     

                      

                      setEditErrors(newErrors);
                      return valid;
                    };

                    const handleEditSubmitBrand = async () => {
                      console.log("Editing Brand:", editingBrand);

                      if (!editingBrand?.id) {
                        toast.error("Invalid brand selected for editing.");
                        return;
                      }

                      if (!validateEditBrand()) return;

                      setIsSubmitting(true);
                      try {
                        const response = await BrandModel.updateBrand(
                          editingBrand.id,
                          {
                            name: editingBrand.name,
                            code: editingBrand.code,
                            description: editingBrand.description,
                            status: editingBrand.status === true || editingBrand.status === 'true',
                          }
                        );

                        if (response.status === 200) {
                          fetchBrands(); // Refresh list
                          toast.success('Brand updated successfully!');
                          setEditModal(false);
                        }
                      } catch (error) {
                        console.error("Update error:", error);
                        toast.error('Failed to update brand!');
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

                    
                    const handleDeleteBrand = async (id) => {
                      
                      if (!id) toast.error("Please Try Again Failed to Delete")

                      try {
                        await BrandModel.deleteBrand(id); // Call the delete API

                        await fetchBrands()

                        toast.success('Brand deleted successfully');
                      } catch (error) {
                        console.error("Error deleting brand:", error);
                        toast.error('Failed to delete brand');
                      }finally {
                            setDeletingId(null);
                        }
                    };
                                        
                  


                 
                  
                   // Handle close modal
                   const handleCloseModal = () => {
                      setErrors({name: '',
                      code: '',
                      description: '',
                      status: '',})
                      setAddBrandData({
                      name: '',
                      code: '',
                      description: '',
                      status: '',
                      })
                      setEditErrors({
                      name: '',
                      code: '',
                      description: '',
                      status: '',
                    })

                     setModal(false);
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
                          buttoncontent="+ New Brand"
                            onClick={() => setModal(true)}  // This will now work!
                      />                 
                      <ItemsPerPageSelector items={limit} setItems={setLimit} />
                 
                       
                 
                       <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1600px]" 
                              style={{ borderSpacing: '0 12px', borderCollapse: 'separate' }}>
                          <thead className="text-xs text-gray-400 uppercase bg-white">
                            <tr>
                              <th className="px-6 py-3" style={{ minWidth: '100px', paddingLeft: '20px' }}>SL NO</th>
                              <th className="px-6 py-3" style={{ minWidth: '150px' }}>CODE</th>
                              <th className="px-6 py-3" style={{ minWidth: '150px' }}>NAME</th>
                              <th className="px-6 py-3" style={{ minWidth: '300px' }}>DESCRIPTION</th>
                              <th className="px-6 py-3" style={{ minWidth: '100px' }}>STATUS</th>
                              <th className="px-6 py-3" style={{ minWidth: '200px' }}>ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading ? (
                          <TableSkelton />
                        ) : brandData.length === 0 ? (
                          <tr >
                            <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
                              No data available
                            </td>
                          </tr>
                        ) : brandData.map((brand, index) => (
                              <tr key={brand.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                                <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '20px' }}>{index+1}</td>
                                <td className="px-6 py-5 border-b border-gray-200 text-xs">{brand.code}</td>
                                <td className="px-6 py-5 border-b border-gray-200 text-xs">{brand.name}</td>
                                <td className="px-6 py-5 border-b border-gray-200 text-xs">{brand.description}</td>
                                <td className="px-6 py-5 border-b border-gray-200 text-xs">
                                 {brand.status ? (
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
                                        onClick={()=>handleEditClick(brand)}
                                        />

                                       
                                        <DeleteButton 
                                          buttonText={deletingId === brand.id ? 'Deleting...' : 'Delete'}
                                          item="Diamond Item"
                                          onOpenModal={() => setItemToDelete(brand.id)}
                                          onConfirmDelete={() => handleDeleteBrand(itemToDelete)}
                                          disabled={deletingId === brand.id}
                                        />
                                  </div>
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
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[550px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Create Brand                        </h3>
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
                                        onChange={(e)=>handleAddBrandChange(e)}
                                        name="name"
                                      />
                                       <p className="text-xs text-red-400">{errors.name}</p>
                                       </div>
                                      <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Code:<span className="text-red-500 text-[14px]">*</span>
                                      </label>
                                      <div>
                                     <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        value={addBrandData.code}
                                        onChange={handleAddBrandChange}
                                        name="code"
                                      />
                                       <p className="text-xs text-red-400">{errors.code}</p>
                                      </div>
                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Description:
                                      </label>

                                      <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                        placeholder="Description" 
                                        style={{paddingLeft:'12px',}}
                                        value={addBrandData.description}
                                        onChange={handleAddBrandChange}
                                        name="description"
                                      ></textarea>
                            
                                           
                                            {/* <label 
                                                
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Status:
                                            </label>
                                            <select defaultValue=""
                                                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                style={{paddingLeft:'12px'}}
                                                value={addBrandData.status}
                                                onChange={handleAddBrandChange}
                                                name='status'
                                                // onChange={(e)=>handleAddBrandChange(e)}
                                            >
                                                <option value="" className="text-gray-600">Select</option>
                                                <option value="true" className="text-gray-600">Active</option>
                                                <option value="false" className="text-gray-600">InActive</option>
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
                                                onClick={handleSubmitBrand}
                                            >
                                                Submit
                                            </button>
                                            </div>
                                        </div>
                                        </div>
                                )}      
      
      
                      {editModal &&  (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[550px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Edit Brand                        </h3>
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
                                        value={editingBrand.name}
                                        onChange={(e)=>handleEditBrandChange(e)}
                                        name="name"
                                      />
                                      <p className="text-xs text-red-400">{editErrors.name}</p>
                                      </div>
                                      <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Code: <span className="text-red-500 text-[14px]">*</span>
                                      </label>
                                      <div>
                                    <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        value={editingBrand.code}
                                        onChange={handleEditBrandChange}
                                        name="code"
                                      />
                                      <p className="text-xs text-red-400">{editErrors.code}</p>
                                      </div>

                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Description:
                                      </label>

                                      <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                        placeholder="Description" 
                                        style={{paddingLeft:'12px',}}
                                        value={editingBrand.description}
                                        onChange={handleEditBrandChange}
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
                                                value={String(editingBrand?.status)}
                                                onChange={handleEditBrandChange}
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
                                                onClick={handleCloseModal}
                                            >
                                                Close
                                            </button>
                                            <button
                                              type="button"
                                              className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                              style={{ backgroundColor: '#5E72E4' }}
                                              onClick={handleEditSubmitBrand}
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
     
     export default Brand;
     