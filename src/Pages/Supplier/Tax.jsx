import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import taxCategoryModel from "../../models/taxCategoryModel";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import TableSkelton from "../../components/tableSkelton";

const Tax = () => {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [taxCategoryData, setTaxCategoryData] = useState([]);
  const [editingTaxCategory, setEditingTaxCategory] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addTaxCategoryData, setAddTaxCategoryData] = useState({
    name: '',
    tax: '',
    description: '',
    status: 'true',
  });
  const [errors, setErrors] = useState({
    name: '',
    tax: '',
    description: '',
    status: '',
  });

  const auth = useSelector((state) => state.auth);
  const { login_id, can_manage_user_types } = auth;
  const user_id = login_id;
  const user_types = Object.keys(can_manage_user_types || {}).join(',');

  const fetchTaxCategories = async () => {
    try {
      setIsLoading(true);
      const response = await taxCategoryModel.getTaxCategories(user_id, user_types, limit, page);
      if (response.data && response.data.data) {
        setTaxCategoryData(response.data.data);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }
      } else {
        toast.error("Unable to fetch tax categories");
      }
    } catch (error) {
      toast.error("Failed to load tax categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxCategories();
  }, [limit, page]);

  const validateTaxCategory = () => {
    const newErrors = {};
    if (!addTaxCategoryData.name.trim()) newErrors.name = 'Please enter name';
    if (!addTaxCategoryData.tax || isNaN(addTaxCategoryData.tax)) newErrors.tax = 'Please enter a valid tax rate';
    return newErrors;
  };

  const handleAddTaxCategoryChange = (e) => {
    const { name, value } = e.target;
    setAddTaxCategoryData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmitTaxCategory = async () => {
    const validationErrors = validateTaxCategory();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = {
      name: addTaxCategoryData.name,
      tax: addTaxCategoryData.tax,
      description: addTaxCategoryData.description,
      status: addTaxCategoryData.status === 'true',
    };
    try {
      const response = await taxCategoryModel.createTaxCategory(payload);
      if (response.status === 201 || response.status === 200) {
        fetchTaxCategories();
        handleCloseModal();
        toast.success('Tax category created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create tax category!');
      if (error.response?.data?.errors) {
        setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
      }
    }
  };

  const validateEditTaxCategory = () => {
    const newErrors = { name: '', tax: '', description: '', status: '' };
    let valid = true;
    if (!editingTaxCategory?.name?.trim()) {
      newErrors.name = 'Tax category name is required';
      valid = false;
    }
    if (!editingTaxCategory?.tax || isNaN(editingTaxCategory.tax)) {
      newErrors.tax = 'A valid tax rate is required';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleEditClickTaxCategory = (taxObj) => {
    if (!taxObj || typeof taxObj !== 'object' || !taxObj.id) {
      toast.error("Invalid tax category selected.");
      return;
    }
    setEditingTaxCategory({ ...taxObj, status: String(taxObj.status) });
    setEditModal(true);
  };

  const handleEditTaxCategoryChange = (e) => {
    const { name, value } = e.target;
    setEditingTaxCategory((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEditSubmitTaxCategory = async () => {
    if (!editingTaxCategory?.id) {
      toast.error("Invalid tax category selected for editing.");
      return;
    }
    if (!validateEditTaxCategory()) return;
    setIsSubmitting(true);
    try {
      const response = await taxCategoryModel.updateTaxCategory(
        editingTaxCategory.id,
        {
          name: editingTaxCategory.name,
          tax: editingTaxCategory.tax,
          description: editingTaxCategory.description,
          status: editingTaxCategory.status === 'true',
        }
      );
      if (response.status === 200) {
        fetchTaxCategories();
        toast.success('Tax category updated successfully!');
        setEditModal(false);
      }
    } catch (error) {
      toast.error('Failed to update tax category!');
      if (error.response?.data?.errors) {
        setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTaxCategory = async (id) => {
    if (!id) return toast.error("No item selected for deletion");
    try {
      setDeletingId(id);
      await taxCategoryModel.deleteTaxCategory(id);
      await fetchTaxCategories();
      toast.success("Tax category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete tax category");
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setAddTaxCategoryData({
      name: '',
      tax: '',
      description: '',
      status: 'true',
    });
    setErrors({
      name: '',
      tax: '',
      description: '',
      status: '',
    });
    setModal(false);
  };
  const handleEditCloseModal = () => {
    setErrors({
      name: '',
      tax: '',
      description: '',
      status: '',
    });
    setEditModal(false);
  };

  return (
    <>
      <CustomScrollbar />
      <div className="bg-white w-full max-w-[99vw] xl:max-w-[90vw] 2xl:max-w-[95vw] h-auto max-h-[80vh] rounded-xl px-4 md:px-8 lg:px-12 mx-auto overflow-auto custom-scrollbar" style={{ fontFamily: 'Open Sans', overflow: 'auto' }}>
        <CreateButton buttoncontent="+ New Tax Category" onClick={() => setModal(true)} />
        <ItemsPerPageSelector items={limit} setItems={setLimit} />
        <table className="w-full text-sm text-left text-gray-500 border-collapse overflow-x-auto" style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '1100px' }}>
          <thead className="text-xs text-gray-400 uppercase bg-white">
            <tr>
              <th style={{ width: '80px', paddingLeft: '40px' }}>SL NO</th>
              <th style={{ width: '300px', paddingLeft: '20px' }}>NAME</th>
              <th style={{ width: '100px' }}>TAX</th>
              <th style={{ width: '900px' }}>DESCRIPTION</th>
              <th style={{ width: '150px' }}>STATUS</th>
              <th style={{ width: '150px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkelton />
            ) : taxCategoryData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500 text-sm">No data available</td>
              </tr>
            ) : taxCategoryData.map((tax, index) => (
              <tr key={tax.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '50px' }}>{index + 1}</td>
                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '20px' }}>{tax.name}</td>
                <td className="py-4 border-b border-gray-200 text-xs">{tax.tax}</td>
                <td className="py-4 border-b border-gray-200 text-xs">{tax.description}</td>
                <td className="py-4 border-b border-gray-200 text-xs">
                  {tax.status ? (
                    <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>Active</span>
                  ) : (
                    <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>INACTIVE</span>
                  )}
                </td>
                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                  <div className="flex gap-2.5 items-center">
                    <EditButton onClick={() => handleEditClickTaxCategory(tax)} />
                    <DeleteButton buttonText={deletingId === tax.id ? 'Deleting...' : 'Delete'} onOpenModal={() => setItemToDelete(tax)} onConfirmDelete={() => handleDeleteTaxCategory(itemToDelete?.id)} disabled={deletingId === tax.id} />
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
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[450px] flex flex-col gap-4 overflow-y-auto" style={{ padding: '20px' }}>
            <h3 className="font-bold text-[22px] text-[#344767]">Create Tax Category</h3>
            <hr className=" border-gray-300" />
            <div className="flex flex-col gap-4 flex-grow">
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">Name: <span className="text-red-500 text-[14px]">*</span></label>
                <input type="text" placeholder="Type here" className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{ paddingLeft: '12px' }} value={addTaxCategoryData.name} onChange={handleAddTaxCategoryChange} name="name" />
                {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
              </div>
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">Tax: <span className="text-red-500 text-[14px]">*</span></label>
                <input type="text" placeholder="Type here" className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{ paddingLeft: '12px' }} value={addTaxCategoryData.tax} onChange={handleAddTaxCategoryChange} name="tax" />
                {errors.tax && (<p className="text-red-500 text-xs mt-1">{errors.tax}</p>)}
              </div>
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">Description: </label>
                <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500" placeholder="Description" style={{ paddingLeft: '12px' }} value={addTaxCategoryData.description} onChange={handleAddTaxCategoryChange} name="description"></textarea>
              </div>
              {/* <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">Status: </label>
                <select className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" style={{ paddingLeft: '12px' }} value={addTaxCategoryData.status} onChange={handleAddTaxCategoryChange} name='status'>
                  <option value='' className=" text-gray-600">Select</option>
                  <option value='true' className=" text-gray-600">Active</option>
                  <option value='false' className=" text-gray-600">InActive</option>
                </select>
              </div> */}
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleCloseModal}>close</button>
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72e4' }} onClick={handleSubmitTaxCategory}>Create</button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[500px] flex flex-col gap-4 overflow-y-auto" style={{ padding: '20px' }}>
            <h3 className="font-bold text-[22px] text-[#344767]">Edit Tax Category</h3>
            <hr className=" border-gray-300" />
            <div className="flex flex-col gap-4 flex-grow">
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">Name: <span className="text-red-500 text-[14px]">*</span></label>
                <input type="text" placeholder="Type here" className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{ paddingLeft: '12px' }} value={editingTaxCategory?.name || ''} onChange={handleEditTaxCategoryChange} name="name" />
                {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
              </div>
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">Tax: <span className="text-red-500 text-[14px]">*</span></label>
                <input type="text" placeholder="Type here" className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{ paddingLeft: '12px' }} value={editingTaxCategory?.tax || ''} onChange={handleEditTaxCategoryChange} name="tax" />
                {errors.tax && (<p className="text-red-500 text-xs mt-1">{errors.tax}</p>)}
              </div>
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">Description: </label>
                <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500" placeholder="Description" style={{ paddingLeft: '12px' }} value={editingTaxCategory?.description || ''} onChange={handleEditTaxCategoryChange} name="description"></textarea>
              </div>
              
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">Status: </label>
                <select className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" style={{ paddingLeft: '12px' }} value={editingTaxCategory?.status || ''} onChange={handleEditTaxCategoryChange} name='status'>
                  <option value='' className=" text-gray-600">Select</option>
                  <option value='true' className=" text-gray-600">Active</option>
                  <option value='false' className=" text-gray-600">InActive</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleEditCloseModal}>Cancel</button>
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72E4' }} onClick={handleEditSubmitTaxCategory} disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Tax;