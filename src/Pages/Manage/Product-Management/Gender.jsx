import { useEffect, useState,useRef} from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import productGenderModel from "../../../models/productGenderModel";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import CustomScrollbar from "../../../components/CustomScrollbar";
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import TableSkelton from "../../../components/tableSkelton";

const Gender = () => {
  const auth = useSelector((state) => state.auth);
  const { login_id, can_manage_user_types } = auth;

  const user_id = login_id;
  const user_types = Object.keys(can_manage_user_types || {}).join(',');
  const nameRef = useRef(null);
  const nameEditRef = useRef(null);

  const [modal, setModal] = useState(false);   
  const [editModal, setEditModal] = useState(false);
  const [productGenderData, setProductGenderData] = useState([]); 
  const [editingProductGender, setEditingProductGender] = useState(null); 
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  
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

  const [editErrors, setEditErrors] = useState({
    name: '',
    description: '',
    status: ''
  });

  const fetchProductGenders = async () => {
    try {
      setIsLoading(true);
      const response = await productGenderModel.getProductGenders(
        user_id,
        user_types,
        limit,
        page,
        search,
        status
      );

     

      if (response.data && response.data.data) {
      
        setProductGenderData(response.data.data);
        setTotalPages(response.data.pagination.pages);
      } else {
        toast.error("Unable to fetch product genders");
      }
    } catch (error) {
      console.error("Error fetching product genders:", error);
      toast.error("Failed to load product genders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductGenders();
  }, [limit, page, search, status]);

  const validateProductGender = () => {
    const newErrors = {};
    if (!addProductGenderData.name.trim()) newErrors.name = 'Please enter name';
    return newErrors;
  };

 const handleAddProductGenderChange = (e) => {
  const { name, value } = e.target;

  setAddProductGenderData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prev) => ({
    ...prev,
    [name]: '',
  }));
};


  const handleSubmitProductGender = async () => {
    const validationErrors = validateProductGender();
    if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);

    if (validationErrors.name && nameRef.current) {
      nameRef.current.focus();
    }

    return;
  }

    const payload = {
      name: addProductGenderData.name,
      description: addProductGenderData.description,
     // status: addProductGenderData.status === 'true',
      
    };


    try {
      const response = await productGenderModel.createProductGender(payload);
    

      if (response.status === 201 || response.status === 200) {
        fetchProductGenders();
        handleCloseModal();
        toast.success('Product gender created successfully!');
      }
    } catch (error) {
                            const message =
                            error?.response?.data?.errors?.name?.[0] ||
                            error?.response?.data?.message ||
                            "Failed to create Adress Type!";
                            toast.error(message);
                            if (error.response?.data?.errors) {
                              setErrors(prev => ({
                              ...prev,
                              ...error.response.data.errors,
                            }));
                          }
                    }
  }; 

  const handleEditClick = (genderObj) => {
   
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
  const newErrors = {};
  if (!editingProductGender?.name?.trim()) {
    newErrors.name = 'Product gender name is required';
  }

  setEditErrors(newErrors);
  return newErrors;
};


  const handleEditSubmitProductGender = async () => {
   

    if (!editingProductGender?.id) {
      toast.error("Invalid product gender selected for editing.");
      return;
    }

   const validationErrors = validateEditProductGender();
if (Object.keys(validationErrors).length > 0) {
  if (validationErrors.name && nameEditRef.current) {
    nameEditRef.current.focus();
  }
  return;
}


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
        fetchProductGenders();
        toast.success('Product gender updated successfully!');
        setEditModal(false);
      }
    } catch (error) {
                            const message =
                            error?.response?.data?.errors?.name?.[0] ||
                            error?.response?.data?.message ||
                            "Failed to create Adress Type!";
                            toast.error(message);
                            if (error.response?.data?.errors) {
                              setErrors(prev => ({
                              ...prev,
                              ...error.response.data.errors,
                            }));
                          }
                    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProductGender = async (id) => {
    if (!id) return toast.error("No item selected for deletion");
    
    try {
      setDeletingId(id);
      await productGenderModel.deleteProductGender(id);
      await fetchProductGenders();
      toast.success("Product Gender deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete Product Gender");
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setModal(false);
    setErrors({
      name: '',
      description: '',
      status: '',
    });
    setAddProductGenderData({
      name: '',
      description: '',
      status: 'true',
    });
  };

  const handleEditCloseModal = () => {
    setEditModal(false);
    setEditErrors({
      name: '',
      description: '',
      status: ''
    });
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
          onClick={() => setModal(true)}
        />                 
        <ItemsPerPageSelector items={limit} setItems={setLimit} />
   
        <table className="table w-full text-sm text-left text-gray-500" 
          style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '1200px' }}>
          <thead className="text-xs text-gray-400 uppercase bg-white">
            <tr>
              <th style={{ paddingLeft: '10px',width:'100px' }}>SL NO</th>
              <th style={{width:'150px'}}>NAME</th>
              <th  >DESCRIPTION</th>
              <th >STATUS</th>
              <th >ACTION</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkelton />
            ) : productGenderData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500 text-sm">
                  No data available
                </td>
              </tr>
            ) : productGenderData.map((gender, index) => (
              <tr key={gender.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                  {index+1}
                </td>
                <td className="px-6 py-5 border-b border-gray-200 text-xs">{gender.name}</td>
                <td className="px-6 py-5 border-b border-gray-200 text-xs  ">{gender.description}</td>
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
                      buttonText={deletingId === gender.id ? 'Deleting...' : 'Delete'}
                      item="Product Gender"
                      onOpenModal={() => setItemToDelete(gender.id)}
                      onConfirmDelete={() => handleDeleteProductGender(itemToDelete)}
                      disabled={deletingId === gender.id}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[400px] h-[95vh] max-h-[400px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}>                                                 
            <h3 className="font-bold text-[22px] text-[#344767] ">
              Create Product Gender                       
            </h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-2">
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">
                  Name: <span className="text-red-500 text-[14px]">*</span>
                </label>
                <input type="text" 
                  placeholder="Type here" 
                    ref={nameRef}
                  className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                  style={{paddingLeft:'12px'}}
                  value={addProductGenderData.name}
                  onChange={handleAddProductGenderChange}
                  name="name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
                                      
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">
                  Description: 
                </label>
                <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                  placeholder="Description" 
                  style={{paddingLeft:'12px',color: '#374151',}}
                  value={addProductGenderData.description}
                  onChange={handleAddProductGenderChange}
                  name="description"
                ></textarea>
              </div>

              {/* <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">
                  Status: <span className="text-red-500 text-[14px]">*</span>
                </label>
                <select
                  className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                  style={{paddingLeft:'12px'}}
                  value={addProductGenderData.status}
                  onChange={handleAddProductGenderChange}
                  name='status'
                >
                  <option value="" className="text-gray-600">Select</option>
                  <option value="true" className="text-gray-600">Active</option>
                  <option value="false" className="text-gray-600">InActive</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                )}
              </div> */}
            </div> 
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
                style={{ backgroundColor: '#5E72e4' }}
                onClick={handleSubmitProductGender}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
       
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[400px] h-[95vh] max-h-[430px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}>                                                 
            <h3 className="font-bold text-[22px] text-[#344767] ">
              Edit Product Gender                      
            </h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-2">
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">
                  Name: <span className="text-red-500 text-[14px]">*</span>
                </label>
                <input type="text" 
                  placeholder="Type here" 
                    ref={nameEditRef}
                  className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                  style={{paddingLeft:'12px'}}
                  value={editingProductGender?.name || ''}
                  onChange={handleEditProductGenderChange}
                  name="name"
                />
                {editErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{editErrors.name}</p>
                )}
              </div>

              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">
                  Description: <span className="text-red-500 text-[14px]">*</span>
                </label>
                <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                  placeholder="Description" 
                  style={{paddingLeft:'12px',color: '#374151',}}
                  value={editingProductGender?.description || ''}
                  onChange={handleEditProductGenderChange}
                  name="description"
                ></textarea>
              </div>

              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">
                  Status: <span className="text-red-500 text-[14px]">*</span>
                </label>
                <select
                  className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                  style={{paddingLeft:'12px'}}
                  value={String(editingProductGender?.status)}
                  onChange={handleEditProductGenderChange}
                  name='status'
                >
                  <option value="" className=" text-gray-600">Select </option>
                  <option value={true} className=" text-gray-600"> Active</option>
                  <option value={false} className=" text-gray-600"> InActive</option>
                </select>
              </div>
            </div> 
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
        </div>
      )}
    </>
  );
};

export default Gender;