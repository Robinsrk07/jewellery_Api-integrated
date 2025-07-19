import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import employeeDepartmentModel from "../../models/employeeDepartmentModel";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import TableSkelton from "../../components/tableSkelton";

const Departments = () => {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  

  const [addDepartmentData, setAddDepartmentData] = useState({
    name: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    status: '',
  });

  // Get user_id and user_types from redux if available, else fallback
  const auth = useSelector((state) => state.auth || {});
  const { login_id ,can_manage_user_types,} = auth;    
  const user_id = login_id 
  const user_types = Object.keys(can_manage_user_types).join(',');

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const response = await employeeDepartmentModel.getDepartments(user_id, user_types, limit, page, search, status);
      if (response.data && response.data.data) {
        setDepartments(response.data.data);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }
      } else {
        toast.error("Unable to fetch departments");
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [limit, page, search, status]);

  const validateDepartment = () => {
    const newErrors = {};
    if (!addDepartmentData.name.trim()) newErrors.name = 'Please enter name';
    return newErrors;
  };

  const handleAddDepartmentChange = (e) => {
    const { name, value } = e.target;
    setAddDepartmentData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmitDepartment = async () => {
    const validationErrors = validateDepartment();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const payload = {
      name: addDepartmentData.name,
    };
    try {
      const response = await employeeDepartmentModel.createDepartment(payload);
      if (response.status === 201 || response.status === 200) {
        fetchDepartments();
        handleCloseModal();
        toast.success('Department created successfully!');
      }
    } catch (error) {
      console.error("Create department error:", error);
      toast.error('Failed to create department!');
      if (error.response?.data?.errors) {
        setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
      }
    }
  };

  const validateEditDepartment = () => {
    const newErrors = { name: '', status: '' };
    let valid = true;
    if (!editingDepartment?.name?.trim()) {
      newErrors.name = 'Department name is required';
      valid = false;
    }
    if (editingDepartment?.status === undefined || editingDepartment.status === '') {
      newErrors.status = 'Status is required';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleEditClickDepartment = (deptObj) => {
    if (!deptObj || typeof deptObj !== 'object' || !deptObj.id) {
      toast.error("Invalid department selected.");
      return;
    }
    setEditingDepartment({ ...deptObj });
    setEditModal(true);
  };

  const handleEditDepartmentChange = (e) => {
    const { name, value } = e.target;
    setEditingDepartment((prev) => ({
      ...prev,
      [name]: name === 'status' ? value : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEditSubmitDepartment = async () => {
    if (!editingDepartment?.id) {
      toast.error("Invalid department selected for editing.");
      return;
    }
    if (!validateEditDepartment()) return;
    setIsSubmitting(true);
    try {
      const response = await employeeDepartmentModel.updateDepartment(
        editingDepartment.id,
        {
          name: editingDepartment.name,
          status: editingDepartment.status
        }
      );
      if (response.status === 200) {
        fetchDepartments();
        toast.success('Department updated successfully!');
        setEditModal(false);
      }
    } catch (error) {
      console.error("Update department error:", error);
      toast.error('Failed to update department!');
      if (error.response?.data?.errors) {
        setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!id) return toast.error("No item selected for deletion");
    try {
      setDeletingId(id);
      await employeeDepartmentModel.deleteDepartment(id);
      await fetchDepartments();
      toast.success("Department deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete department");
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setAddDepartmentData({
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
      <div className="bg-white w-full max-w-[99vw] xl:max-w-[90vw] 2xl:max-w-[95vw] h-auto max-h-[80vh] rounded-xl px-4 md:px-8 lg:px-12 mx-auto overflow-auto custom-scrollbar" style={{ fontFamily: 'Open Sans',overflow:'auto'}}>
        <CreateButton buttoncontent="+ New Department" onClick={() => setModal(true)} />
        <ItemsPerPageSelector items={limit} setItems={setLimit} />
        <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1000px]" style={{ borderSpacing: '0 12px', borderCollapse: 'separate' }}>
          <thead className="text-xs text-gray-400 uppercase bg-white">
            <tr>
              <th  style={{ width: '90px', paddingLeft: '20px',paddingBottom:'10px' }}>SL NO</th>
              <th style={{ width: '100px',paddingBottom:'10px' }}>DEPARTMENTS</th>
              <th  style={{ width: '90px',paddingBottom:'10px' }}>STATUS</th>
              <th  style={{ width: '90px',paddingBottom:'10px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkelton />
            ) : departments.length === 0 ? (
              <tr >
                <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
                  No data available
                </td>
              </tr>
            ) :  departments.map((dept, index) => (
              <tr key={dept.id} className="bg-white hover:bg-gray-50 h-10 text-gray-400">
                <td className=" text-xs border-b border-gray-200" style={{paddingLeft: '30px' }}>{index + 1}</td>
                <td className=" text-xs border-b border-gray-200" style={{paddingLeft: '10px' }}>{dept.name}</td>
                <td className=" text-xs border-b border-gray-200" style={{ }}>
                  {dept.status === true || dept.status === 'true' || dept.status === 'ACTIVE' ? (
                    <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>Active</span>
                  ) : (
                    <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>INACTIVE</span>
                  )}
                </td>
                <td className="border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <EditButton onClick={() => handleEditClickDepartment(dept)} />
                    <DeleteButton
                      buttonText={deletingId === dept.id ? 'Deleting...' : 'Delete'}
                      onOpenModal={() => setItemToDelete(dept)}
                      onConfirmDelete={() => handleDeleteDepartment(itemToDelete?.id)}
                      disabled={deletingId === dept.id}
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
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[320px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
            <h3 className="font-bold text-[22px] text-[#344767]">Create Department</h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-4">
              <label className="font-semibold text-xs text-[#344767] w-[80%]">Name:</label>
              <div>
              <input type="text" placeholder="Type here" className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} value={addDepartmentData.name} onChange={handleAddDepartmentChange} name="name" />
              {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleCloseModal}>Close</button>
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72e4' }} onClick={handleSubmitDepartment}>Create</button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[320px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
            <h3 className="font-bold text-[22px] text-[#344767]">Edit Department</h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-4">
              <label className="font-semibold text-xs text-[#344767] w-[80%]">Name:</label>
              <input type="text" placeholder="Type here" className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} value={editingDepartment?.name || ''} onChange={handleEditDepartmentChange} name="name" />
              {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
              <label className="font-semibold text-xs text-[#344767] w-[80%]">Status:</label>
                <select
                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500"
                style={{paddingLeft:'12px'}}
                value={
                  editingDepartment?.status === true || editingDepartment?.status === "true" || editingDepartment?.status === "True" || editingDepartment?.status === "ACTIVE"
                    ? "True"
                    : editingDepartment?.status === false || editingDepartment?.status === "false" || editingDepartment?.status === "False" || editingDepartment?.status === "INACTIVE"
                    ? "False"
                    : ""
                }
                onChange={handleEditDepartmentChange}
                name='status'
              >
                <option value="" className=" text-gray-600 text-xs">--select status--</option>
                <option value="True" className=" text-gray-600 text-xs">Active</option>
                <option value="False" className=" text-gray-600 text-xs">InActive</option>
              </select>
              {errors.status && (<p className="text-red-500 text-xs mt-1">{errors.status}</p>)}
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleEditCloseModal}>Cancel</button>
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72E4' }} onClick={handleEditSubmitDepartment} disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Departments;