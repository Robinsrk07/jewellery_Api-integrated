import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import productSizeModel from "../../../models/productSizeModel";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import CustomScrollbar from "../../../components/CustomScrollbar";
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import TableSkelton from "../../../components/tableSkelton";

const Product_Size = () => {
  const auth = useSelector((state) => state.auth);
  const { login_id, can_manage_user_types } = auth;

  const user_id = login_id;
  const user_types = Object.keys(can_manage_user_types || {}).join(',');

  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [sizeData, setSizeData] = useState([]);
  const [editingProductSize, setEditingProductSize] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  const [addProductSizeData, setAddProductSizeData] = useState({
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

  const fetchProductSizes = async () => {
    try {
      setIsLoading(true);
      const response = await productSizeModel.getProductSizes(
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
        setSizeData(response.data.data);
        setTotalPages(response.data.pagination.pages);
      } else {
        toast.error("Unable to fetch product sizes");
      }
    } catch (error) {
      console.error("Error fetching product sizes:", error);
      toast.error("Failed to load product sizes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductSizes();
  }, [limit, page, search, status]);

  const validateProductSize = () => {
    const newErrors = {};
    if (!addProductSizeData.name.trim()) newErrors.name = 'Please enter name';
    if (!addProductSizeData.description.trim()) newErrors.description = 'Please enter description';
    if (addProductSizeData.status === '') newErrors.status = 'Please select status';
    return newErrors;
  };

  const handleAddProductSizeChange = (e) => {
    const { name, value } = e.target;
    setAddProductSizeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitProductSize = async () => {
    const validationErrors = validateProductSize();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      name: addProductSizeData.name,
      description: addProductSizeData.description,
      status: addProductSizeData.status === 'true',
      created_by: user_id,
      created_by_type: user_types,
    };

    console.log("Payload being sent:", payload);

    try {
      const response = await productSizeModel.createProductSize(payload);
      console.log("Create Product Size response:", response);

      if (response.status === 201 || response.status === 200) {
        fetchProductSizes();     
        handleCloseModal();     
        toast.success('Product size created successfully!');
      }
    } catch (error) {
      console.error("Create product size error:", error);
      toast.error('Failed to create product size!');
      handleCloseModal();

      if (error.response?.data?.errors) {
        setErrors((prev) => ({
          ...prev,
          ...error.response.data.errors,
        }));
      }
    }
  };

  const handleEditClickProductSize = (sizeObj) => {
    if (!sizeObj || typeof sizeObj !== 'object' || !sizeObj.id) {
      console.warn("Invalid object passed to handleEditClickProductSize:", sizeObj);
      toast.error("Invalid product size selected.");
      return;
    }

    console.log("Selected for Edit:", sizeObj);
    setEditingProductSize({ ...sizeObj });
    setEditModal(true);
  };

  const handleEditProductSizeChange = (e) => {
    const { name, value } = e.target;
    setEditingProductSize((prev) => ({
      ...prev,
      [name]: name === 'status' ? value === 'true' : value,
    }));
  };

  const validateEditProductSize = () => {
    let valid = true;
    const newErrors = { name: '', description: '', status: '' };

    if (!editingProductSize?.name?.trim()) {
      newErrors.name = 'Product size name is required';
      valid = false;
    }

    if (!editingProductSize?.description?.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    }

    if (editingProductSize?.status === undefined || editingProductSize.status === '') {
      newErrors.status = 'Status is required';
      valid = false;
    }

    setEditErrors(newErrors);
    return valid;
  };

  const handleEditSubmitProductSize = async () => {
    console.log("Editing Product Size:", editingProductSize);

    if (!editingProductSize?.id) {
      toast.error("Invalid product size selected for editing.");
      return;
    }

    if (!validateEditProductSize()) return;

    setIsSubmitting(true);
    try {
      const response = await productSizeModel.updateProductSize(
        editingProductSize.id,
        {
          name: editingProductSize.name,
          description: editingProductSize.description,
          status: editingProductSize.status === true || editingProductSize.status === 'true',
        }
      );

      if (response.status === 200) {
        fetchProductSizes();
        toast.success('Product size updated successfully!');
        setEditModal(false);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error('Failed to update product size!');
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

  const handleDeleteProductSize = async (id) => {
    if (!id) return toast.error("No item selected for deletion");
    
    try {
      setDeletingId(id);
      await productSizeModel.deleteProductSize(id);
      await fetchProductSizes();
      toast.success("Product size deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product size");
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
    setAddProductSizeData({
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
          buttoncontent="+ New Product Size"
          onClick={() => setModal(true)}
        />                 
        <ItemsPerPageSelector items={limit} setItems={setLimit} />
   
        <table className="table w-full text-sm text-left text-gray-500" 
          style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '1200px' }}>
          <thead className="text-xs text-gray-400 uppercase bg-white">
            <tr>
              <th style={{ width: '100px', paddingLeft: '30px' }}>SL NO</th>
              <th style={{ width: '150px' }}>NAME</th>
              <th style={{ width: '565px' }}>DESCRIPTION</th>
              <th style={{ width: '94px' }}>STATUS</th>
              <th style={{ width: '245px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkelton />
            ) : sizeData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500 text-sm">
                  No data available
                </td>
              </tr>
            ) : sizeData.map((size, index) => (
              <tr key={size.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                <td className="border-b border-gray-200 text-xs" style={{ paddingLeft: '35px' }}>{index+1}</td>
                <td className="border-b border-gray-200 text-xs">{size.name}</td>
                <td className="border-b border-gray-200 text-xs">{size.description}</td>
                <td className="px-6 py-5 border-b border-gray-200 text-xs">
                  {size.status ? (
                    <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                       Active
                    </span>
                    ) : (
                    <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                       INACTIVE
                    </span>
                  )}
                </td>
                <td className="border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <EditButton
                      onClick={() => handleEditClickProductSize(size)}
                    />
                    <DeleteButton 
                      buttonText={deletingId === size.id ? 'Deleting...' : 'Delete'}
                      item="Product Size"
                      onOpenModal={() => setItemToDelete(size.id)}
                      onConfirmDelete={() => handleDeleteProductSize(itemToDelete)}
                      disabled={deletingId === size.id}
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
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[400px] h-[95vh] max-h-[500px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}>                                                 
            <h3 className="font-bold text-[22px] text-[#344767] ">
              Create Product Size                      
            </h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-2">
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">
                  Name: <span className="text-red-500 text-[14px]">*</span>
                </label>
                <input type="text" 
                  placeholder="Type here" 
                  className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                  style={{paddingLeft:'12px'}}
                  value={addProductSizeData.name}
                  onChange={handleAddProductSizeChange}
                  name="name"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
                                      
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">
                  Description: <span className="text-red-500 text-[14px]">*</span>
                </label>
                <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                  placeholder="Description" 
                  style={{paddingLeft:'12px'}}
                  value={addProductSizeData.description}
                  onChange={handleAddProductSizeChange}
                  name="description"
                ></textarea>
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>
                            
              {/* <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">
                  Status: <span className="text-red-500 text-[14px]">*</span>
                </label>
                <select 
                  className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                  style={{paddingLeft:'12px'}}
                  value={addProductSizeData.status}
                  onChange={handleAddProductSizeChange}
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
                onClick={handleSubmitProductSize}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
       
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[400px] h-[95vh] max-h-[500px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}>                                                 
            <h3 className="font-bold text-[22px] text-[#344767] ">
              Edit Product Size                      
            </h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-2">
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">
                  Name: <span className="text-red-500 text-[14px]">*</span>
                </label>
                <input type="text" 
                  placeholder="Type here" 
                  className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                  style={{paddingLeft:'12px'}}
                  value={editingProductSize?.name || ''}
                  onChange={handleEditProductSizeChange}
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
                  style={{paddingLeft:'12px'}}
                  value={editingProductSize?.description || ''}
                  onChange={handleEditProductSizeChange}
                  name="description"
                ></textarea>
                {editErrors.description && (
                  <p className="text-red-500 text-xs mt-1">{editErrors.description}</p>
                )}
              </div>
                            
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">
                  Status: <span className="text-red-500 text-[14px]">*</span>
                </label>
                <select
                  className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                  style={{paddingLeft:'12px'}}
                  value={String(editingProductSize?.status)}
                  onChange={handleEditProductSizeChange}
                  name='status'
                >
                  <option value="" className=" text-gray-600">Select </option>
                  <option value={true} className=" text-gray-600"> Active</option>
                  <option value={false} className=" text-gray-600"> InActive</option>
                </select>
                {editErrors.status && (
                  <p className="text-red-500 text-xs mt-1">{editErrors.status}</p>
                )}
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
                onClick={handleEditSubmitProductSize}
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

export default Product_Size; 