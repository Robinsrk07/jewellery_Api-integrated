import { useEffect, useState,useRef} from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import employeeGenderModel from "../../models/employeeGenderModel";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import TableSkelton from "../../components/tableSkelton";

const Genders = () => {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [genders, setGenders] = useState([]);
  const [editingGender, setEditingGender] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [status] = useState('');
  const [search] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addGenderData, setAddGenderData] = useState({
    name: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    status: '',
  });
 const nameRef = useRef(null)
 const EditNameREf = useRef(null)
  // Get user_id and user_types from redux if available, else fallback
  const auth = useSelector((state) => state.auth || {});
  const user_id = auth.login_id || 1;
  const user_types = auth.can_manage_user_types ? Object.keys(auth.can_manage_user_types).join(',') : 'Admin,Head Office';

  const fetchGenders = async () => {
    try {
      setIsLoading(true);
      const response = await employeeGenderModel.getGenders(user_id, user_types, limit, page, search, status);
      if (response.data && response.data.data) {
        setGenders(response.data.data);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }
      } else {
        toast.error("Unable to fetch genders");
      }
    } catch (error) {
      console.error("Error fetching genders:", error);
      toast.error("Failed to load genders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGenders();
  }, [limit, page, search, status]);

const validateGender = () => {
  const newErrors = {};
  let firstInvalidRef = null;

  const nameRegex = /^[A-Za-z\s-]{2,}$/; // Optional: validate name format

  if (!addGenderData.name.trim()) {
    newErrors.name = 'Please enter name';
    firstInvalidRef = nameRef;
  } else if (!nameRegex.test(addGenderData.name.trim())) {
    newErrors.name = 'Only letters, spaces, and hyphens allowed';
    firstInvalidRef = nameRef;
  }

  setErrors(newErrors);

  // Focus the field
  if (firstInvalidRef?.current) {
    firstInvalidRef.current.focus();
    firstInvalidRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return Object.keys(newErrors).length === 0;
};


  const handleAddGenderChange = (e) => {
    const { name, value } = e.target;
    setAddGenderData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmitGender = async () => {
    const isValid = validateGender();
  if (!isValid) return; 

    const payload = {
      name: addGenderData.name,
    };
    try {
      const response = await employeeGenderModel.createGender(payload);
      if (response.status === 201 || response.status === 200) {
        fetchGenders();
        handleCloseModal();
        toast.success('Gender created successfully!');
      }
    } catch (error) {
                    const message =
                    error?.response?.data?.errors?.name?.[0] ||
                    error?.response?.data?.message ||
                    "Failed to create Gender!";
                     toast.error(message);
                    if (error.response?.data?.errors) {
                     setErrors(prev => ({
                     ...prev,
                    ...error.response.data.errors,
                        }));
                   }
               }
  };

 const validateEditGender = () => {
  const newErrors = {};
  let firstInvalidRef = null;

  const nameRegex = /^[A-Za-z\s-]{2,}$/;

  if (!editingGender?.name?.trim()) {
    newErrors.name = 'Gender name is required';
    firstInvalidRef = EditNameREf;
  } else if (!nameRegex.test(editingGender.name.trim())) {
    newErrors.name = 'Only letters, spaces, and hyphens allowed';
    firstInvalidRef = EditNameREf;
  }

  if (editingGender?.status === undefined || editingGender.status === '') {
    newErrors.status = 'Status is required';
    if (!firstInvalidRef) {
      const statusElement = document.querySelector('select[name="status"]');
      if (statusElement) firstInvalidRef = { current: statusElement };
    }
  }

  setErrors(newErrors);

  if (firstInvalidRef?.current) {
    firstInvalidRef.current.focus();
    firstInvalidRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return Object.keys(newErrors).length === 0;
};


  const handleEditClickGender = (genderObj) => {
    if (!genderObj || typeof genderObj !== 'object' || !genderObj.id) {
      toast.error("Invalid gender selected.");
      return;
    }
    setEditingGender({ ...genderObj });
    setEditModal(true);
  };

  const handleEditGenderChange = (e) => {
    const { name, value } = e.target;
    setEditingGender((prev) => ({
      ...prev,
      [name]: name === 'status' ? value : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEditSubmitGender = async () => {
    if (!editingGender?.id) {
      toast.error("Invalid gender selected for editing.");
      return;
    }
    const isValid = validateEditGender();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const response = await employeeGenderModel.updateGender(
        editingGender.id,
        {
          name: editingGender.name,
          status: editingGender.status
        }
      );
      if (response.status === 200) {
        fetchGenders();
        toast.success('Gender updated successfully!');
        setEditModal(false);
      }
    } catch (error) {
             const message =
            error?.response?.data?.errors?.name?.[0] ||
            error?.response?.data?.message ||
            "Failed to create Gender!";
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

  const handleDeleteGender = async (id) => {
    if (!id) return toast.error("No item selected for deletion");
    try {
      setDeletingId(id);
      await employeeGenderModel.deleteGender(id);
      await fetchGenders();
      toast.success("Gender deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete gender");
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setAddGenderData({
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
        <CreateButton buttoncontent="+ New Gender" onClick={() => setModal(true)} />
        <ItemsPerPageSelector items={limit} setItems={setLimit} />
        <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1000px]" style={{ borderSpacing: '0 12px', borderCollapse: 'separate' }}>
          <thead className="text-xs text-gray-400 uppercase bg-white">
            <tr>
              <th className="px-6 py-3" style={{ width: '90px', paddingLeft: '20px' }}>SL NO</th>
              <th className="px-6 py-3" style={{ width: '100px' }}>GENDER</th>
              <th className="px-6 py-3" style={{ width: '90px' }}>STATUS</th>
              <th className="px-6 py-3" style={{ width: '90px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkelton />
            ) : genders.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500 text-sm">No data available</td>
              </tr>
            ) : genders.map((gender, index) => (
              <tr key={gender.id} className="bg-white hover:bg-gray-50 h-12 text-gray-400">
                <td className="px-6 py-5 text-xs border-b border-gray-200" style={{ paddingLeft: '30px', }}>{index + 1}</td>
                <td className="px-6 py-5 text-xs border-b border-gray-200">{gender.name}</td>
                <td className="px-6 py-5 text-xs border-b border-gray-200">
                  {gender.status === true || gender.status === 'true' || gender.status === 'True' || gender.status === 'ACTIVE' ? (
                    <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>Active</span>
                  ) : (
                    <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>INACTIVE</span>
                  )}
                </td>
                <td className="px-6 py-5 text-xs border-b border-gray-200" style={{ paddingLeft: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <EditButton onClick={() => handleEditClickGender(gender)} />
                    <DeleteButton buttonText={deletingId === gender.id ? 'Deleting...' : 'Delete'} onOpenModal={() => setItemToDelete(gender)} onConfirmDelete={() => handleDeleteGender(itemToDelete?.id)} disabled={deletingId === gender.id} />
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
            <h3 className="font-bold text-[22px] text-[#344767]">Create Gender</h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-4">
              <label className="font-semibold text-xs text-[#344767] w-[80%]">Gender:</label>
            <div>  <input type="text" placeholder="Type here" ref={nameRef} className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} value={addGenderData.name} onChange={handleAddGenderChange} name="name" />
              {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleCloseModal}>Close</button>
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72e4' }} onClick={handleSubmitGender}>Create</button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[320px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
            <h3 className="font-bold text-[22px] text-[#344767]">Edit Gender</h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-4">
              <label className="font-semibold text-xs text-[#344767] w-[80%]">Gender:</label>
              <div><input type="text" placeholder="Type here" ref={EditNameREf} className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} value={editingGender?.name || ''} onChange={handleEditGenderChange} name="name" />
              {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
              </div>
              <label className="font-semibold text-xs text-[#344767] w-[80%]">Status:</label>
              <select
                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500"
                style={{paddingLeft:'12px'}}
                value={
                  editingGender?.status === true || editingGender?.status === "true" || editingGender?.status === "True" || editingGender?.status === "ACTIVE"
                    ? "True"
                    : editingGender?.status === false || editingGender?.status === "false" || editingGender?.status === "False" || editingGender?.status === "INACTIVE"
                    ? "False"
                    : ""
                }
                onChange={handleEditGenderChange}
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
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72E4' }} onClick={handleEditSubmitGender} disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Genders;