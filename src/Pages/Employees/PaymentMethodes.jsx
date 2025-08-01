

import { useEffect, useState,useRef} from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import employeePaymentMethodModel from "../../models/employeePaymentMethodModel";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import TableSkelton from "../../components/tableSkelton";

const PaymentMethodes = () => {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [status] = useState('');
  const [search] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addPaymentMethodData, setAddPaymentMethodData] = useState({
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
  const nameRef = useRef(null)
  const EditNameRef = useRef(null)

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const response = await employeePaymentMethodModel.getPaymentMethods(user_id, user_types, limit, page, search, status);
      if (response.data && response.data.data) {
        setPaymentMethods(response.data.data);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages);
        }
      } else {
        toast.error("Unable to fetch payment methods");
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("Failed to load payment methods");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [limit, page, search, status]);

const validatePaymentMethod = () => {
  const newErrors = {};
  let firstInvalidRef = null;

  const nameRegex = /^[A-Za-z\s-]{2,}$/;

  if (!addPaymentMethodData.name.trim()) {
    newErrors.name = 'Please enter name';
    firstInvalidRef = nameRef;
  } else if (!nameRegex.test(addPaymentMethodData.name.trim())) {
    newErrors.name = 'Name can only contain letters, spaces, and hyphens';
    firstInvalidRef = nameRef;
  }

  setErrors(newErrors);

  if (firstInvalidRef?.current) {
    firstInvalidRef.current.focus();
    firstInvalidRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return Object.keys(newErrors).length === 0;
};



  const handleAddPaymentMethodChange = (e) => {
    const { name, value } = e.target;
    setAddPaymentMethodData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmitPaymentMethod = async () => {
     if (!validatePaymentMethod()) return;
    const payload = {
      name: addPaymentMethodData.name,
    };
    try {
      const response = await employeePaymentMethodModel.createPaymentMethod(payload);
      if (response.status === 201 || response.status === 200) {
        fetchPaymentMethods();
        handleCloseModal();
        toast.success('Payment method created successfully!');
      }
    } catch (error) {
                    const message =
                    error?.response?.data?.errors?.name?.[0] ||
                    error?.response?.data?.message ||
                    "Failed to create Payment Methode!";
                     toast.error(message);
                    if (error.response?.data?.errors) {
                     setErrors(prev => ({
                     ...prev,
                    ...error.response.data.errors,
                        }));
                   }
               }
  };

const validateEditPaymentMethod = () => {
  const newErrors = {};
  let firstInvalidRef = null;

  const nameRegex = /^[A-Za-z\s-]{2,}$/;

  if (!editingPaymentMethod?.name?.trim()) {
    newErrors.name = 'Payment method name is required';
    firstInvalidRef = EditNameRef;
  } else if (!nameRegex.test(editingPaymentMethod.name.trim())) {
    newErrors.name = 'Name can only contain letters, spaces, and hyphens';
    firstInvalidRef = EditNameRef;
  }

  if (
    editingPaymentMethod?.status === undefined ||
    editingPaymentMethod.status === ''
  ) {
    newErrors.status = 'Status is required';
    if (!firstInvalidRef) {
      const statusInput = document.querySelector('select[name="status"]');
      if (statusInput) {
        firstInvalidRef = { current: statusInput };
      }
    }
  }

  setErrors(newErrors);

  if (firstInvalidRef?.current) {
    firstInvalidRef.current.focus();
    firstInvalidRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return Object.keys(newErrors).length === 0;
};


  const handleEditClickPaymentMethod = (pmObj) => {
    if (!pmObj || typeof pmObj !== 'object' || !pmObj.id) {
      toast.error("Invalid payment method selected.");
      return;
    }
    setEditingPaymentMethod({ ...pmObj });
    setEditModal(true);
  };

  const handleEditPaymentMethodChange = (e) => {
    const { name, value } = e.target;
    setEditingPaymentMethod((prev) => ({
      ...prev,
      [name]: name === 'status' ? value : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleEditSubmitPaymentMethod = async () => {
    if (!editingPaymentMethod?.id) {
      toast.error("Invalid payment method selected for editing.");
      return;
    }
    if (!validateEditPaymentMethod()) return;
    setIsSubmitting(true);
    try {
      const response = await employeePaymentMethodModel.updatePaymentMethod(
        editingPaymentMethod.id,
        {
          name: editingPaymentMethod.name,
          status: editingPaymentMethod.status
        }
      );
      if (response.status === 200) {
        fetchPaymentMethods();
        toast.success('Payment method updated successfully!');
        setEditModal(false);
      }
    }catch (error) {
                    const message =
                    error?.response?.data?.errors?.name?.[0] ||
                    error?.response?.data?.message ||
                    "Failed to create Payment Methode!";
                     toast.error(message);
                    if (error.response?.data?.errors) {
                     setErrors(prev => ({
                     ...prev,
                    ...error.response.data.errors,
                        }));
                   }
               }finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePaymentMethod = async (id) => {
    if (!id) return toast.error("No item selected for deletion");
    try {
      setDeletingId(id);
      await employeePaymentMethodModel.deletePaymentMethod(id);
      await fetchPaymentMethods();
      toast.success("Payment method deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete payment method");
    } finally {
      setDeletingId(null);
      setItemToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setAddPaymentMethodData({
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
        <CreateButton buttoncontent="+ New Payment Methode" onClick={() => setModal(true)} />
        <ItemsPerPageSelector items={limit} setItems={setLimit} />
        <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1000px]" style={{ borderSpacing: '0 12px', borderCollapse: 'separate' }}>
          <thead className="text-xs text-gray-400 uppercase bg-white">
            <tr>
              <th className="px-6 py-3" style={{ width: '90px', paddingLeft: '20px' }}>SL NO</th>
              <th className="px-6 py-3" style={{ width: '100px' }}>PAYMENT METHODE</th>
              <th className="px-6 py-3" style={{ width: '90px' }}>STATUS</th>
              <th className="px-6 py-3" style={{ width: '90px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkelton />
            ) : paymentMethods.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500 text-sm">No data available</td>
              </tr>
            ) : paymentMethods.map((pm, index) => (
              <tr key={pm.id} className="bg-white hover:bg-gray-50 h-12 text-gray-400">
                <td className="px-6 py-5 text-xs border-b border-gray-200" style={{ paddingLeft: '30px', }}>{index + 1}</td>
                <td className="px-6 py-5 text-xs border-b border-gray-200">{pm.name}</td>
                <td className="px-6 py-5 text-xs border-b border-gray-200">
                  {pm.status === true || pm.status === 'true' || pm.status === 'ACTIVE' ? (
                    <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>Active</span>
                  ) : (
                    <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>INACTIVE</span>
                  )}
                </td>
                <td className="px-6 py-5 text-xs border-b border-gray-200" style={{ paddingLeft: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <EditButton onClick={() => handleEditClickPaymentMethod(pm)} />
                    <DeleteButton buttonText={deletingId === pm.id ? 'Deleting...' : 'Delete'} onOpenModal={() => setItemToDelete(pm)} onConfirmDelete={() => handleDeletePaymentMethod(itemToDelete?.id)} disabled={deletingId === pm.id} />
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
            <h3 className="font-bold text-[22px] text-[#344767]">Create Payment Methode</h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-4">
              <label className="font-semibold text-xs text-[#344767] w-[80%]">Name:</label>
              <div><input type="text" placeholder="Type here" ref={nameRef} className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} value={addPaymentMethodData.name} onChange={handleAddPaymentMethodChange} name="name" />
              {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleCloseModal}>Close</button>
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72e4' }} onClick={handleSubmitPaymentMethod}>Create</button>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[320px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
            <h3 className="font-bold text-[22px] text-[#344767]">Edit Payment Methode</h3>
            <hr className=" border-gray-300"/>
            <div className="flex flex-col flex-grow gap-4">
              <label className="font-semibold text-xs text-[#344767] w-[80%]">Name:</label>
              <div>
              <input type="text" placeholder="Type here" ref={EditNameRef} className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500" style={{paddingLeft:'12px'}} value={editingPaymentMethod?.name || ''} onChange={handleEditPaymentMethodChange} name="name" />
              {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name}</p>)}
              </div>
              <label className="font-semibold text-xs text-[#344767] w-[80%]">Status:</label>
              <div>
              <select
                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500"
                style={{paddingLeft:'12px'}}
                value={
                  editingPaymentMethod?.status === true || editingPaymentMethod?.status === "true" || editingPaymentMethod?.status === "True" || editingPaymentMethod?.status === "ACTIVE"
                    ? "True"
                    : editingPaymentMethod?.status === false || editingPaymentMethod?.status === "false" || editingPaymentMethod?.status === "False" || editingPaymentMethod?.status === "INACTIVE"
                    ? "False"
                    : ""
                }
                onChange={handleEditPaymentMethodChange}
                name='status'
              >
                <option value="" className=" text-gray-600">Select</option>
                <option value="True" className=" text-gray-600">Active</option>
                <option value="False" className=" text-gray-600">InActive</option>
              </select>
              {errors.status && (<p className="text-red-500 text-xs mt-1">{errors.status}</p>)}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#8392ab' }} onClick={handleEditCloseModal}>Cancel</button>
              <button type="button" className="btn w-[100px] h-[35px] rounded-lg text-white border-none" style={{ backgroundColor: '#5E72E4' }} onClick={handleEditSubmitPaymentMethod} disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentMethodes;