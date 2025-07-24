import { useEffect, useState } from "react";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import JewelleryTypeModel from "../../models/jewelleryTypeModel";
import ItemTypeModel from "../../models/itemTypeModel";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

  const JewelleryType = () => {
  // State
  const [items, setItems] = useState(10);
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [jewelleryTypeData, setJewelleryTypeData] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [jewelleryTypeToDelete, setJewelleryTypeToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingjewelleryType, setEditingJewelleryType] = useState(null);
  const [addJewelleryTypeData, setaddJewelleryTypeData] = useState({
    code: '',
    name: '',
    item_type: '',
  });
  const [errors, setErrors] = useState({
    code: '',
    name: '',
    item_type: '',
    status: ''
  });
  const [itemTypeOptions, setItemTypeOptions] = useState([]);

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

  // Fetch jewellery types
  const FetchJewelleryType = async () => {
    try {
      const response = await JewelleryTypeModel.getJewelleryType(
        user_id,
        user_types,
        limit,
        page,
        search,
        status
      );
      if (response.data && response.data.data) {
        setJewelleryTypeData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching jewellery type data:", error);
    }
  };

  // Fetch item types
  useEffect(() => {
    FetchJewelleryType();
    const fetchItemTypes = async () => {
      try {
        const response = await ItemTypeModel.getItemTypes(user_id, user_types);
        if (response.data && response.data.data) {
          setItemTypeOptions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching item types:", error);
      }
    };
    fetchItemTypes();
  }, []);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setaddJewelleryTypeData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append('code', addJewelleryTypeData.code);
    formData.append('name', addJewelleryTypeData.name);
    formData.append('item_type', addJewelleryTypeData.item_type);

    try {
      const response = await JewelleryTypeModel.CreateJewelleryType(formData);
      if (response.status === 201) {
        FetchJewelleryType();
        handleCloseModal();
        toast.success('Jewellery type created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create jewellery type!');
      handleCloseModal();
      if (error.response?.data?.errors) {
        setErrors(prev => ({
          ...prev,
          ...error.response.data.errors
        }));
      }
    }
  };

  const handleEditSubmit = async () => {
    if (!validateEditForm()) return;
    setIsSubmitting(true);
    try {
      const response = await JewelleryTypeModel.updateJewelleryType(
        editingjewelleryType.id,
        {
          code: editingjewelleryType.code,
          name: editingjewelleryType.name,
          item_type: editingjewelleryType.item_type,
          status: editingjewelleryType.status
        }
      );
      if (response.status === 200) {
        FetchJewelleryType();
        toast.success('Jewellery type updated successfully!');
        handleEditCloseModal();
      }
    } catch (error) {
      toast.error('Failed to update jewellery type!');
      if (error.response?.data?.errors) {
        setErrors(prev => ({
          ...prev,
          ...error.response.data.errors
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation
  const validateForm = () => {
    let valid = true;
    const newErrors = { code: '', name: '', item_type: '' };

    if (!addJewelleryTypeData.code) {
      newErrors.code = 'Jewellery type code is required';
      valid = false;
    } else if (addJewelleryTypeData.code.length < 2) {
      newErrors.code = 'Must be at least 2 characters';
      valid = false;
    }
    if (!addJewelleryTypeData.name) {
      newErrors.name = 'Jewellery type name is required';
      valid = false;
    } else if (addJewelleryTypeData.name.length < 2) {
      newErrors.name = 'Must be at least 2 characters';
      valid = false;
    }
    if (!addJewelleryTypeData.item_type) {
      newErrors.item_type = 'Please select an item type';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const validateEditForm = () => {
    let valid = true;
    const newErrors = { code: '', name: '', item_type: '', status: '' };

    if (!editingjewelleryType?.code) {
      newErrors.code = 'Jewellery type code is required';
      valid = false;
    } else if (editingjewelleryType.code.length < 2) {
      newErrors.code = 'Must be 2-3 letters or valid item type code';
      valid = false;
    }
    if (!editingjewelleryType?.name) {
      newErrors.name = 'Item type name is required';
      valid = false;
    } else if (editingjewelleryType.name.length < 2) {
      newErrors.name = 'Must be at least 2 characters';
      valid = false;
    }
    if (!editingjewelleryType?.item_type) {
      newErrors.item_type = 'Please select an item type';
      valid = false;
    }
    if (editingjewelleryType?.status === undefined || editingjewelleryType.status === '') {
      newErrors.status = 'Status is required';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  // Delete handler
  const handleDeleteJewelleryType = async (id) => {
    if (!id) return toast.error("No item selected for deletion");
    try {
      setDeletingId(id);
      await JewelleryTypeModel.deleteJewelleryType(id);
      await FetchJewelleryType();
      toast.success("Jewellery type deleted successfully");
    } catch (error) {
      toast.error("Failed to delete jewellery type");
    } finally {
      setDeletingId(null);
      setJewelleryTypeToDelete(null);
    }
  };

  // Modal close handlers
  const handleCloseModal = () => {
    setaddJewelleryTypeData({ code: '', name: '', item_type: '' });
    setModal(false);
  };
  const handleEditCloseModal = () => setEditModal(false);

  // Render
  return (
    <>
      <CustomScrollbar />
      <div className="bg-white w-full max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-[95vw] h-auto max-h-[80vh] rounded-xl px-4 md:px-8 lg:px-12 mx-auto overflow-auto custom-scrollbar" style={{ fontFamily: 'Open Sans', overflow: 'auto' }}>
        <CreateButton buttoncontent="+ New Jewellery Type" onClick={() => setModal(true)} />
        <ItemsPerPageSelector items={items} setItems={setItems} />

        {/* Table */}
        <table className="w-full text-sm text-left text-gray-500 border-collapse overflow-x-auto" style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '700px' }}>
          <thead className="text-xs text-gray-400 uppercase bg-white">
            <tr>
              <th style={{ width: '80px', paddingLeft: '20px' }}>SL NO</th>
              <th style={{ width: '120px' }}>CODE</th>
              <th style={{ width: '120px' }}>NAME</th>
              <th style={{ width: '120px' }}>ITEM TYPE</th>
              <th style={{ width: '120px' }}>STATUS</th>
              <th style={{ width: '150px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {jewelleryTypeData.map((jewellerytype, index) => (
              <tr key={index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>{index + 1}</td>
                <td className="py-4 border-b border-gray-200 text-xs">{jewellerytype.code}</td>
                <td className="py-4 border-b border-gray-200 text-xs">{jewellerytype.name}</td>
                <td className="py-4 border-b border-gray-200 text-xs">
                  {itemTypeOptions.find(item => String(item.id) === String(jewellerytype.item_type))?.name || jewellerytype.item_type}
                </td>
                <td className="py-4 border-b border-gray-200 text-xs">
                  {jewellerytype.status ? (
                    <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>Active</span>
                  ) : (
                    <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>INACTIVE</span>
                  )}
                </td>
                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                  <div className="flex gap-2.5 items-center">
                    <EditButton
                      onClick={() => {
                        setEditingJewelleryType(jewellerytype);
                        setEditModal(true);
                      }}
                    />
                    <DeleteButton
                      buttonText={deletingId === jewellerytype.id ? 'Deleting...' : 'Delete'}
                      onOpenModal={() => setJewelleryTypeToDelete(jewellerytype)}
                      onConfirmDelete={() => handleDeleteJewelleryType(jewelleryTypeToDelete?.id)}
                      disabled={deletingId === jewellerytype.id}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination />
      </div>

      {/* Create Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[400px] h-[95vh] max-h-[450px] flex flex-col gap-4 overflow-y-auto" style={{ padding: '20px' }}>
            <h3 className="font-bold text-[22px] text-[#344767]">Create Jewellery Type</h3>
            <hr className="border-gray-300" />
            <div className="flex flex-col flex-grow gap-4">
              {/* Code */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">
                  Code:<span className="text-red-500 text-[14px]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                  style={{ paddingLeft: '12px' }}
                  name="code"
                  value={addJewelleryTypeData.code}
                  onChange={handleChange}
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
              </div>
              {/* Name */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">
                  Name:  <span className="text-red-500 text-[14px]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                  style={{ paddingLeft: '12px' }}
                  name="name"
                  value={addJewelleryTypeData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              {/* Item Type */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">
                  Item Type:<span className="text-red-500 text-[14px]">*</span>
                </label>
                <select
                  name="item_type"
                  value={addJewelleryTypeData.item_type}
                  onChange={handleChange}
                  className="select w-[100%] bg-white border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                  style={{ paddingLeft: '12px', color: '#374151' }}
                >
                  <option value="">Select Item Type</option>
                  {itemTypeOptions.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                {errors.item_type && <p className="text-red-500 text-xs mt-1">{errors.item_type}</p>}
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
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[550px] flex flex-col gap-4 overflow-y-auto" style={{ padding: '20px' }}>
            <h3 className="font-bold text-[22px] text-[#344767]">Edit Jewellery Type</h3>
            <hr className="border-gray-300" />
            <div className="flex flex-col flex-grow gap-4">
              {/* Code */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">
                  Code:  <span className="text-red-500 text-[14px]">*</span>
                  </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className={`input w-[100%] rounded-lg focus:outline-none text-gray-500 bg-white border ${errors.code ? 'border-red-500' : 'border-gray-300'} focus:border-b-2 focus:border-blue-500`}
                  style={{ paddingLeft: '12px' }}
                  name="code"
                  value={editingjewelleryType?.code || ''}
                  onChange={e => {
                    setEditingJewelleryType({ ...editingjewelleryType, code: e.target.value });
                    if (errors.code) setErrors({ ...errors, code: '' });
                  }}
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
              </div>
              {/* Name */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">
                  Name: <span className="text-red-500 text-[14px]">*</span>
                  </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className={`input w-[100%] rounded-lg focus:outline-none text-gray-500 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-b-2 focus:border-blue-500`}
                  style={{ paddingLeft: '12px' }}
                  name="name"
                  value={editingjewelleryType?.name || ''}
                  onChange={e => {
                    setEditingJewelleryType({ ...editingjewelleryType, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              {/* Item Type */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">
                  Item Type: <span className="text-red-500 text-[14px]">*</span>
                  </label>
                <select
                  name="item_type"
                  value={editingjewelleryType?.item_type || ''}
                  onChange={e => {
                    setEditingJewelleryType({ ...editingjewelleryType, item_type: e.target.value });
                    if (errors.item_type) setErrors({ ...errors, item_type: '' });
                  }}
                  className="select w-[100%] bg-white border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                  style={{ paddingLeft: '12px', color: '#374151' }}
                >
                  <option value="">Select Item Type</option>
                  {itemTypeOptions.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                {errors.item_type && <p className="text-red-500 text-xs mt-1">{errors.item_type}</p>}
              </div>
              {/* Status */}
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">Status:</label>
                <select
                  name="status"
                  value={editingjewelleryType?.status === true ? "Active" : editingjewelleryType?.status === false ? "Inactive" : ""}
                  onChange={e => {
                    setEditingJewelleryType({ ...editingjewelleryType, status: e.target.value === "Active" });
                    if (errors.status) setErrors({ ...errors, status: '' });
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

export default JewelleryType;