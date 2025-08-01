
import { useEffect, useState, useRef} from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import controlAccountModel from "../../models/controlAccountModel";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import TableSkelton from "../../components/tableSkelton";

const ControllAccount = () => {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [controlAccountData, setControlAccountData] = useState([]);
  const [editingControlAccount, setEditingControlAccount] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addControlAccountData, setAddControlAccountData] = useState({
    name: '',
    description: '',
    status: 'true',
  });
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    status: '',
  });

  const auth = useSelector((state) => state.auth);
  const { login_id, can_manage_user_types } = auth;
  const user_id = login_id;
  const user_types = Object.keys(can_manage_user_types || {}).join(',');

  const nameRef = useRef(null)
  const EditnameRef = useRef(null)
  
  const fetchControlAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await controlAccountModel.getControlAccounts(user_id, user_types, limit, page, search, status);
      if (response.data && response.data.data) {
        setControlAccountData(response.data.data);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }
      } else {
        toast.error("Unable to fetch control accounts");
      }
    } catch (error) {
      console.error("Error fetching control accounts:", error);
      toast.error("Failed to load control accounts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchControlAccounts();
  }, [limit, page, search, status]);

 const validateControlAccount = () => {
  const newErrors = {};
  let firstInvalidRef = null;

  if (!addControlAccountData.name.trim()) {
    newErrors.name = 'Please enter name';
    firstInvalidRef = nameRef;
  }

  setErrors(newErrors);
  if (firstInvalidRef?.current) firstInvalidRef.current.focus();

  return Object.keys(newErrors).length === 0;
};


  const handleAddControlAccountChange = (e) => {
    const { name, value } = e.target;
    setAddControlAccountData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmitControlAccount = async () => {
   if (!validateControlAccount()) return;

    const payload = {
      name: addControlAccountData.name,
      description: addControlAccountData.description,
    };
    try {
      const response = await controlAccountModel.createControlAccount(payload);
      if (response.status === 201 || response.status === 200) {
        fetchControlAccounts();
        handleCloseModal();
        toast.success('Control account created successfully!');
      }
    }catch (error) {
                        const message =
                        error?.response?.data?.errors?.name?.[0] ||
                        error?.response?.data?.message ||
                        "Failed to create Control Account!";
                        toast.error(message);
                        if (error.response?.data?.errors) {
                          setErrors(prev => ({
                          ...prev,
                          ...error.response.data.errors,
                        }));
                      }
                              }
  };

 const validateEditControlAccount = () => {
  const newErrors = {};
  let firstInvalidRef = null;

  if (!editingControlAccount?.name?.trim()) {
    newErrors.name = 'Control account name is required';
    firstInvalidRef = EditnameRef;
  }

  setErrors(newErrors);
  if (firstInvalidRef?.current) firstInvalidRef.current.focus();

  return Object.keys(newErrors).length === 0;
};


  const handleEditClickControlAccount = (accountObj) => {
    if (!accountObj || typeof accountObj !== 'object' || !accountObj.id) {
      toast.error("Invalid control account selected.");
      return;
    }
    setEditingControlAccount({ ...accountObj });
    setEditModal(true);
  };

  const handleEditControlAccountChange = (e) => {
    const { name, value } = e.target;
    setEditingControlAccount((prev) => ({
      ...prev,
      [name]: name === 'status' ? value === 'true' : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEditSubmitControlAccount = async () => {
    if (!editingControlAccount?.id) {
      toast.error("Invalid control account selected for editing.");
      return;
    }
    if (!validateEditControlAccount()) return;
         setIsSubmitting(true);
    try {
      const response = await controlAccountModel.updateControlAccount(
        editingControlAccount.id,
        {
          name: editingControlAccount.name,
          description: editingControlAccount.description,
          status: editingControlAccount.status === true || editingControlAccount.status === 'true',
        }
      );
      if (response.status === 200) {
        fetchControlAccounts();
        toast.success('Control account updated successfully!');
        setEditModal(false);
      }
    } catch (error) {
                    const message =
                    error?.response?.data?.errors?.name?.[0] ||
                    error?.response?.data?.message ||
                    "Failed to create Control Account!";
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

  const handleDeleteControlAccount = async (id) => {
    if (!id) return toast.error("No item selected for deletion");
    try {
      setDeletingId(id);
      await controlAccountModel.deleteControlAccount(id);
      await fetchControlAccounts();
      toast.success("Control Account deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete Control Account");
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setAddControlAccountData({
      name: '',
      description: '',
      status: 'true',
    });
    setErrors({
      name: '',
      description: '',
      status: '',
    });
    setModal(false);
  };
  const handleEditCloseModal = () => {
    setErrors({
      name: '',
      description: '',
      status: '',
    });
    setEditModal(false);
  };

  return (
    <>
      <CustomScrollbar/>
      <div className="bg-white w-full max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-[95vw] h-auto max-h-[80vh] rounded-xl px-4 md:px-8 lg:px-12 mx-auto overflow-auto custom-scrollbar" style={{ fontFamily: 'Open Sans',overflow:'auto'}}>
        <CreateButton buttoncontent="+ New control Account" onClick={() => setModal(true)} />
        <ItemsPerPageSelector items={limit} setItems={setLimit} />
        <table className="w-full text-sm text-left text-gray-500 border-collapse overflow-x-auto" style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '1100px' }}>
          <thead className="text-xs text-gray-400 uppercase bg-white">
            <tr>
              <th style={{ width: '80px', paddingLeft: '40px' }}>SL NO</th>
              <th style={{ width: '300px',paddingLeft: '30px'  }}>NAME</th>
              <th style={{ width: '900px' }}>DESCRIPTION</th>
              <th style={{ width: '150px' }}>STATUS</th>
              <th style={{ width: '150px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkelton />
            ) : controlAccountData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500 text-sm">No data available</td>
              </tr>
            ) : controlAccountData.map((account, index) => (
              <tr key={account.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '50px' }}>{index+1}</td>
                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>{account.name}</td>
                <td className="py-4 border-b border-gray-200 text-xs">{account.description}</td>
                <td className="py-4 border-b border-gray-200 text-xs">
                  {account.status ? (
                    <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>Active</span>
                  ) : (
                    <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>INACTIVE</span>
                  )}
                </td>
                <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                  <div className="flex gap-2.5 items-center">
                    <EditButton onClick={() => handleEditClickControlAccount(account)} />
                    <DeleteButton buttonText={deletingId === account.id ? 'Deleting...' : 'Delete'} onOpenModal={() => setItemToDelete(account)} onConfirmDelete={() => handleDeleteControlAccount(itemToDelete?.id)} disabled={deletingId === account.id} />
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
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[400px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
            <h3 className="font-bold text-[22px] text-[#344767]">Create Control Account</h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col gap-4 flex-grow">
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">Name: <span className="text-red-500 text-[14px]">*</span></label>
                <input type="text" placeholder="Type here" ref={nameRef} className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} value={addControlAccountData.name} onChange={handleAddControlAccountChange} name="name" />
                {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
              </div>
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">Description: </label>
                <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500" placeholder="Description" style={{paddingLeft:'12px'}} value={addControlAccountData.description} onChange={handleAddControlAccountChange} name="description"></textarea>

              </div>
              {/* <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">Status: <span className="text-red-500 text-[14px]">*</span></label>
                <select className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} value={addControlAccountData.status} onChange={handleAddControlAccountChange} name='status'>
                  <option value='' className=" text-gray-600">Select</option>
                  <option value='true' className=" text-gray-600">Active</option>
                  <option value='false' className=" text-gray-600">InActive</option>
                </select>
                {errors.status && (<p className="text-red-500 text-xs mt-1">{errors.status}</p>)}
              </div> */}
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleCloseModal}>close</button>
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72e4' }} onClick={handleSubmitControlAccount}>Create</button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[480px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
            <h3 className="font-bold text-[22px] text-[#344767]">Edit Control Account</h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col gap-4 flex-grow">
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">Name: <span className="text-red-500 text-[14px]">*</span></label>
                <input type="text" placeholder="Type here" ref ={EditnameRef} className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} value={editingControlAccount?.name || ''} onChange={handleEditControlAccountChange} name="name" />
                {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
              </div>
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[100%]">Description: </label>
                <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500" placeholder="Description" style={{paddingLeft:'12px'}} value={editingControlAccount?.description || ''} onChange={handleEditControlAccountChange} name="description"></textarea>
              </div>
              <div>
                <label className="font-semibold text-xs text-[#344767] w-[80%]">Status: </label>
                <select className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} value={String(editingControlAccount?.status)} onChange={handleEditControlAccountChange} name='status'>
                  <option value="" className=" text-gray-600">Select</option>
                  <option value="true" className=" text-gray-600">Active</option>
                  <option value="false" className=" text-gray-600">InActive</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleEditCloseModal}>Cancel</button>
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72E4' }} onClick={handleEditSubmitControlAccount} disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ControllAccount;