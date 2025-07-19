
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import employeePositionModel from "../../models/employeePositionModel";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import TableSkelton from "../../components/TableSkelton";

const Positions = () => {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [positions, setPositions] = useState([]);
  const [editingPosition, setEditingPosition] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addPositionData, setAddPositionData] = useState({
    name: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    status: '',
  });

  // Get user_id and user_types from redux if available, else fallback
  const auth = useSelector((state) => state.auth || {});
  const user_id = auth.login_id || 1;
  const user_types = auth.can_manage_user_types ? Object.keys(auth.can_manage_user_types).join(',') : 'Admin,Head Office';

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      const response = await employeePositionModel.getPositions(user_id, user_types, limit, page, search, status);
      if (response.data && response.data.data) {
        setPositions(response.data.data);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }
      } else {
        toast.error("Unable to fetch positions");
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
      toast.error("Failed to load positions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [limit, page, search, status]);

  const validatePosition = () => {
    const newErrors = {};
    if (!addPositionData.name.trim()) newErrors.name = 'Please enter name';
    return newErrors;
  };

  const handleAddPositionChange = (e) => {
    const { name, value } = e.target;
    setAddPositionData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmitPosition = async () => {
    const validationErrors = validatePosition();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = {
      name: addPositionData.name,
    };
    try {
      const response = await employeePositionModel.createPosition(payload);
      if (response.status === 201 || response.status === 200) {
        fetchPositions();
        handleCloseModal();
        toast.success('Position created successfully!');
      }
    } catch (error) {
      console.error("Create position error:", error);
      toast.error('Failed to create position!');
      if (error.response?.data?.errors) {
        setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
      }
    }
  };

  const validateEditPosition = () => {
    const newErrors = { name: '', status: '' };
    let valid = true;
    if (!editingPosition?.name?.trim()) {
      newErrors.name = 'Position name is required';
      valid = false;
    }
    if (editingPosition?.status === undefined || editingPosition.status === '') {
      newErrors.status = 'Status is required';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleEditClickPosition = (posObj) => {
    if (!posObj || typeof posObj !== 'object' || !posObj.id) {
      toast.error("Invalid position selected.");
      return;
    }
    setEditingPosition({ ...posObj });
    setEditModal(true);
  };

  const handleEditPositionChange = (e) => {
    const { name, value } = e.target;
    setEditingPosition((prev) => ({
      ...prev,
      [name]: name === 'status' ? value : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEditSubmitPosition = async () => {
    if (!editingPosition?.id) {
      toast.error("Invalid position selected for editing.");
      return;
    }
    if (!validateEditPosition()) return;
    setIsSubmitting(true);
    try {
      const response = await employeePositionModel.updatePosition(
        editingPosition.id,
        {
          name: editingPosition.name,
          status: editingPosition.status
        }
      );
      if (response.status === 200) {
        fetchPositions();
        toast.success('Position updated successfully!');
        setEditModal(false);
      }
    } catch (error) {
      console.error("Update position error:", error);
      toast.error('Failed to update position!');
      if (error.response?.data?.errors) {
        setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePosition = async (id) => {
    if (!id) return toast.error("No item selected for deletion");
    try {
      setDeletingId(id);
      await employeePositionModel.deletePosition(id);
      await fetchPositions();
      toast.success("Position deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete position");
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setAddPositionData({
      name: '',
    });
    setErrors({
      name: '',
      status: '',
    });
    setModal(false);
  };
  const handleEditCloseModal = () => {
    setErrors({
      name: '',
      status: '',
    });
    setEditModal(false);
  };

  return (
    <>
      <CustomScrollbar/>
      <div className="bg-white w-full max-w-[99vw] xl:max-w-[90vw] 2xl:max-w-[95vw] h-auto max-h-[70vh] rounded-xl px-4 md:px-8 lg:px-12 mx-auto overflow-auto custom-scrollbar" style={{ fontFamily: 'Open Sans',overflow:'auto'}}>
        <CreateButton buttoncontent="+ New Position" onClick={() => setModal(true)} />
        <ItemsPerPageSelector items={limit} setItems={setLimit} />
        <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1000px]" style={{ borderSpacing: '0 12px', borderCollapse: 'separate' }}>
          <thead className="text-xs text-gray-400 uppercase bg-white">
            <tr>
              <th className="px-6 py-3" style={{ width: '90px', paddingLeft: '20px' }}>SL NO</th>
              <th className="px-6 py-3" style={{ width: '100px' }}>POSITIONS</th>
              <th className="px-6 py-3" style={{ width: '90px' }}>STATUS</th>
              <th className="px-6 py-3" style={{ width: '90px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkelton />
            ) : positions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500 text-sm">No data available</td>
              </tr>
            ) : positions.map((pos, index) => (
              <tr key={pos.id} className="bg-white hover:bg-gray-50 h-12 text-gray-400">
                <td className="px-6 py-5 text-xs border-b border-gray-200" style={{ paddingLeft: '30px', }}>{index + 1}</td>
                <td className="px-6 py-5 text-xs border-b border-gray-200" >{pos.name}</td>
                <td className="px-6 py-5 text-xs border-b border-gray-200" >
                  {pos.status === true || pos.status === 'true' || pos.status === 'ACTIVE' ? (
                    <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>Active</span>
                  ) : (
                    <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>INACTIVE</span>
                  )}
                </td>
                <td className="px-6 py-5 text-xs border-b border-gray-200" style={{ paddingLeft: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <EditButton onClick={() => handleEditClickPosition(pos)} />
                    <DeleteButton buttonText={deletingId === pos.id ? 'Deleting...' : 'Delete'} onOpenModal={() => setItemToDelete(pos)} onConfirmDelete={() => handleDeletePosition(itemToDelete?.id)} disabled={deletingId === pos.id} />
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
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[320px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
            <h3 className="font-bold text-[22px] text-[#344767]">Create Position</h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-4">
              <label className="font-semibold text-xs text-[#344767] w-[80%]">Name:</label>
              <input type="text" placeholder="Type here" className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} value={addPositionData.name} onChange={handleAddPositionChange} name="name" />
              {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleCloseModal}>Close</button>
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72e4' }} onClick={handleSubmitPosition}>Create</button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[320px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
            <h3 className="font-bold text-[22px] text-[#344767]">Edit Position</h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-4">
              <label className="font-semibold text-xs text-[#344767] w-[80%]">Name:</label>
              <input type="text" placeholder="Type here" className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} value={editingPosition?.name || ''} onChange={handleEditPositionChange} name="name" />
              {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
              <label className="font-semibold text-xs text-[#344767] w-[80%]">Status:</label>
             
              <select
                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500"
                style={{paddingLeft:'12px'}}
                value={
                  editingPosition?.status === true || editingPosition?.status === "true" || editingPosition?.status === "True" || editingPosition?.status === "ACTIVE"
                    ? "True"
                    : editingPosition?.status === false || editingPosition?.status === "false" || editingPosition?.status === "False" || editingPosition?.status === "INACTIVE"
                    ? "False"
                    : ""
                }
                onChange={handleEditPositionChange}
                name='status'
              >

                <option value="" className=" text-gray-600">Select</option>
                <option value="True" className=" text-gray-600">Active</option>
                <option value="False" className=" text-gray-600">InActive</option>

              </select>
              {errors.status && (<p className="text-red-500 text-xs mt-1">{errors.status}</p>)}
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleEditCloseModal}>Cancel</button>
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72E4' }} onClick={handleEditSubmitPosition} disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Positions;