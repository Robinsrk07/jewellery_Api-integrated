import { useEffect, useRef, useState } from "react";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import TableSkelton from "../../../components/tableSkelton";
import CategoryModel from "../../../models/categoryModel";
import SubCategoryModel from "../../../models/subcategoryModel";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

const SubCategory = () => {
  // State
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [subcategoryData, setSubCategoryData] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [subcategoryToDelete, setSubCategoryToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [addSubCategoryData, setaddSubCategoryData] = useState({
    name: '',
    category: '',
    description: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    category: '',
    description: '',
    status: '',
  });
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Redux
  const auth = useSelector((state) => state.auth);
  const { login_id, can_manage_user_types } = auth;
  const user_id = login_id;
  const user_types = Object.keys(can_manage_user_types).join(',');

  // Pagination/filter
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const nameRef = useRef(null);
  const categoryRef = useRef(null);

  const nameEditRef = useRef(null);
  const categoryEditRef = useRef(null);
  

  // Fetch categories
  useEffect(() => {
    const FetchCategory = async () => {
      try {
        const response = await CategoryModel.getCategorys(user_id, user_types,1000,1,'','True');
        if (response.data && response.data.data) {
          setCategoryOptions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    FetchCategory();
    FetchSubCategory();
  }, [limit,page,status,search]);

  // Fetch subcategories
  const FetchSubCategory = async () => {
    setIsLoading(true)
    try {
      const response = await SubCategoryModel.getSubCategorys(
        user_id,
        user_types,
        limit,
        page,
        search,
        status
      );
      
        setSubCategoryData(response.data.data);
       setTotalPages(response.data.pagination.pages)
      
    } catch (error) {
      console.error("Error fetching subcategory data:", error);
    }finally {
  setIsLoading(false);
}
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setaddSubCategoryData(prev => ({ ...prev, [name]: value }));
    setErrors(prev =>({...prev, [name]:''}))
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', addSubCategoryData.name);
    formData.append('category', addSubCategoryData.category);
    formData.append('description', addSubCategoryData.description);

    try {
      const response = await SubCategoryModel.CreateSubCategory(formData);
      if (response.status === 201) {
        FetchSubCategory();
        handleCloseModal();
        toast.success('Subcategory created successfully!');
      }
    }catch (error) {
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

  const handleEditSubmit = async () => {
    if (!validateEditForm()) return;
    setIsSubmitting(true);
    try {
      const response = await SubCategoryModel.updateSubCategory(
        editingSubCategory.id,
        {
          name: editingSubCategory.name,
          category: editingSubCategory.category,
          description: editingSubCategory.description,
          status: editingSubCategory.status
        }
      );
      if (response.status === 200) {
        FetchSubCategory();
        toast.success('SubCategory updated successfully!');
        handleEditCloseModal();
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

  // Validation
  const validateForm = () => {
    let valid = true;
    const newErrors = { name: '', category: '' };

    if (!addSubCategoryData.name) {
      newErrors.name = 'Subcategory name is required';
      valid = false;
    } else if (addSubCategoryData.name.length < 2) {
      newErrors.name = 'Must be at least 2 characters';
      valid = false;
    }else if(!/^[A-Za-z\s]+$/.test(addSubCategoryData.name)) {
     newErrors.name = 'Only alphabets and spaces allowed';
     valid = false;
     }
    if (!addSubCategoryData.category) {
      newErrors.category = 'Please select a category';
      valid = false;

      
    }
    setErrors(newErrors);
    if (!valid) {
  if (newErrors.name && nameRef.current) nameRef.current.focus();
  else if (newErrors.category && categoryRef.current) categoryRef.current.focus();
}
    return valid;
  };

  const validateEditForm = () => {
    let valid = true;
    const newErrors = { name: '', category: '', description: '', status: '' };

    if (!editingSubCategory?.name) {
      newErrors.name = 'Subcategory name is required';
      valid = false;
    } else if (editingSubCategory.name.length < 2) {
      newErrors.name = 'Must be at least 2 characters';
      valid = false;
    }else if (!/^[A-Za-z\s]+$/.test(editingSubCategory.name)) {
      newErrors.name = 'Only alphabets and spaces allowed';
      valid = false;
    }

    if (!editingSubCategory?.category) {
      newErrors.category = 'Please select a category';
      valid = false;
    }
   
   
    setErrors(newErrors);

    if (!valid) {
  if (newErrors.name && nameEditRef.current) nameEditRef.current.focus();
  else if (newErrors.category && categoryEditRef.current) categoryEditRef.current.focus();
}

    return valid;
  };

  // Delete handler
  const handleDeleteSubCategory = async (id) => {
    if (!id) return toast.error("No item selected for deletion");
    try {
      setDeletingId(id);
      await SubCategoryModel.deleteSubCategory(id);
      await FetchSubCategory();
      toast.success("SubCategory deleted successfully");
    } catch (error) {
      toast.error("Failed to delete subcategory");
    } finally {
      setDeletingId(null);
      setSubCategoryToDelete(null);
    }
  };

  // Modal close handlers
  const handleCloseModal = () => {
    setaddSubCategoryData({ name: '', category: '', description: '' });
    setErrors({})
    setModal(false);
  };
  const handleEditCloseModal = () =>{
     setEditModal(false);
     setErrors({})
  }

  // Render
  return (
    <>
      <CustomScrollbar />
      <div className="bg-white w-full max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-[95vw] h-auto max-h-[80vh] rounded-xl px-4 md:px-8 lg:px-12 mx-auto overflow-auto custom-scrollbar" style={{ fontFamily: 'Open Sans', overflow: 'auto' }}>
        <CreateButton buttoncontent="+ New SubCategory" onClick={() => setModal(true)} />
        <ItemsPerPageSelector items={limit} setItems={setLimit} />

        {/* Table */}
        <table className="w-full text-sm text-left text-gray-500 border-collapse overflow-x-auto" style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '900px' }}>
          <thead className="text-xs text-gray-400 uppercase bg-white">
            <tr>
              <th style={{ width: '80px', paddingLeft: '40px' }}>SL NO</th>
              <th style={{ width: '150px' }}>NAME</th>
              <th style={{ width: '150px' }}>CATEGORY</th>
              <th style={{ width: '170px' }}>DESCRIPTION</th>
              <th style={{ width: '130px', paddingLeft:'25px' }}>STATUS</th>
              <th style={{ width: '150px',textAlign:'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            
            {isLoading ? (
  <TableSkelton />
) : subcategoryData.length === 0 ? (
  <tr><td colSpan="6" className="text-center py-4 text-gray-500">No data available</td></tr>
) : (
  subcategoryData.map((subcategory, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '50px' }}>{index + 1}</td>
                <td className="py-4 border-b border-gray-200 text-xs">{subcategory.name}</td>
                <td className="py-4 border-b border-gray-200 text-xs">{subcategory.category_name}</td>
                <td className="py-4 border-b border-gray-200 text-xs">{subcategory.description}</td>
                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft:'25px' }}>
                  {subcategory.status ? (
                    <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>Active</span>
                  ) : (
                    <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>INACTIVE</span>
                  )}
                </td>
                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                  <div className="flex gap-2.5 items-center">
                    <EditButton onClick={() => { setEditingSubCategory(subcategory); setEditModal(true); }} />
                    <DeleteButton
                      buttonText={deletingId === subcategory.id ? 'Deleting...' : 'Delete'}
                      onOpenModal={() => setSubCategoryToDelete(subcategory)}
                      onConfirmDelete={() => handleDeleteSubCategory(subcategoryToDelete?.id)}
                      disabled={deletingId === subcategory.id}
                    />
                  </div>
                </td>
              </tr>
            )))}
          </tbody>
        </table>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />   
      </div>

      {/* Create Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[400px] h-[95vh] max-h-[450px] flex flex-col gap-4 overflow-y-auto" style={{ padding: '20px' }}>
            <h3 className="font-bold text-[22px] text-[#344767]">Create SubCategory</h3>
            <hr className="border-gray-300" />
            <div className="flex flex-col flex-grow gap-4">
              {/* Name */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">Name:</label>
                <input
                  type="text"
                  ref={nameRef}
                  placeholder="Type here"
                  className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                  style={{ paddingLeft: '12px' }}
                  name="name"
                  value={addSubCategoryData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              {/* Category */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">Category: <span className="text-xs text-red-400">*</span></label>
                <select
                  name="category"
                  value={addSubCategoryData.category}
                  ref={categoryRef}
                  onChange={handleChange}
                  className="select w-[100%] bg-white border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                  style={{ paddingLeft: '12px', color: '#374151' }}
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
              {/* Description */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">Description:</label>
                <textarea
                  name="description"
                  value={addSubCategoryData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                  style={{ paddingLeft: '12px', color: '#374151' }}
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button
                type="button"
                className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                style={{ backgroundColor: '#8392ab' }}
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                style={{ backgroundColor: '#5E72E4' }}
                onClick={handleSubmit}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && editingSubCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[600px] flex flex-col gap-4 overflow-y-auto" style={{ padding: '20px' }}>
            <h3 className="font-bold text-[22px] text-[#344767]">Edit SubCategory</h3>
            <hr className="border-gray-300" />
            <div className="flex flex-col flex-grow gap-4">
              {/* Name */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">Name: <span className="text-xs text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="Type here"
                   ref={nameEditRef}
                  className={`input w-[100%] rounded-lg focus:outline-none border-gray-300 text-gray-500 bg-white border focus:border-b-2 focus:border-blue-500`}
                  style={{ paddingLeft: '12px' }}
                  name="name"
                  value={editingSubCategory.name || ''}
                  onChange={e => {
                    setEditingSubCategory({ ...editingSubCategory, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              {/* Category */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">Category: <span className="text-xs text-red-400">*</span></label>
                <select
                  name="category"
                   ref={categoryEditRef}
                  value={editingSubCategory.category || ''}
                  onChange={e => {
                    setEditingSubCategory({ ...editingSubCategory, category: e.target.value });
                    if (errors.category) setErrors({ ...errors, category: '' });
                  }}
                  className="select w-[100%] bg-white border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                  style={{ paddingLeft: '12px', color: '#374151' }}
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
              </div>
              {/* Description */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">Description:</label>
                <textarea
                  name="description"
                  value={editingSubCategory.description || ''}
                  onChange={e => {
                    setEditingSubCategory({ ...editingSubCategory, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: '' });
                  }}
                  placeholder="Description"
                  className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                  style={{ paddingLeft: '12px', color: '#374151' }}
                ></textarea>
              </div>
              {/* Status */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">Status:</label>
                <select
                  name="status"
                  value={editingSubCategory.status === true ? "Active" : editingSubCategory.status === false ? "Inactive" : ""}
                  onChange={e => {
                    setEditingSubCategory({ ...editingSubCategory, status: e.target.value === "Active" });
                  }}
                  className="select w-[100%] bg-white border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                  style={{ paddingLeft: '12px', color: '#374151' }}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button
                type="button"
                className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                style={{ backgroundColor: '#8392ab' }}
                onClick={handleEditCloseModal}
              >
                Cancel
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
        </div>
      )}
    </>
  );
};

export default SubCategory;