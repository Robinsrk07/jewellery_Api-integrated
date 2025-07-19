import { useEffect, useState } from "react";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import TableSkelton from "../../../components/tableSkelton";
import addressTypeModel from "../../../models/addressTypeModel";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from "../../../Data/server/axiosinstance";

const Adress_Type = () => {
  const auth = useSelector((store) => store.auth);
  const { login_id, can_manage_user_types } = auth;

  const user_id = login_id;
  const user_types = Object.keys(can_manage_user_types || {}).join(',');

  console.log(user_id);
  console.log(user_types)

  const [items, setItems] = useState(10);
  const [data, setData] = useState({
    name: '',
    description: '',
    status: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressTypes, setAddressTypes] = useState([]);
  const [editingAddressType, setEditingAddresss] = useState(null);
  const [limit, setLimit] = useState(10);
  console.log(limit)
      const [deletingId, setDeletingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [modal, setModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  console.log(addressTypes);
  console.log("test",editingAddressType)
  const fetchAddressTypes = async () => {
    try {
      const response = await addressTypeModel.getAddressTypes(
        user_id,
        user_types,
        limit,
        page,
        search,
        status,
      )

       if(!response){
        toast.error("unable to fetch Address")
       }
        setAddressTypes(response?.data?.data)
         setTotalPages(response.data.pagination.pages);
    } catch (err) {
      toast.error("Failed to load address types");
    }finally {
    setIsLoading(false); // stop loading
  }
  };


 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };


  const validateForm = () => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = 'Please enter name';
    if (!data.description.trim()) newErrors.description = 'Please enter description';
    if (data.status === '') newErrors.status = 'Please select status';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {

    console.log(data);
    
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('status', data.status)

    try {
      const response = await axiosInstance.post('/manage-address-type/', formData);

      console.log("Created Address Type:", response);

      if (response.data.status === 201) {
        console.log("test")
        fetchAddressTypes();
        handleCloseModal();
        toast.success('Address type created successfully!');
      }
            else {
                toast.error('Failed to create address type!');
              }

    } catch (error) {
      console.error(error);
      toast.error('Failed to create address type!');
      handleCloseModal();
      if (error.response?.data?.errors) {
        setErrors(prev => ({
          ...prev,
          ...error.response.data.errors
        }));
      }
    }
  };



 
            const handleCloseModal = () => {
              setModal(false);

              setData({
                name: '',
                description: '',
                status: 'True',
              });
              setErrors({});
            };

          

            const handleEditCloseModal = () => {
              setEditModal(false);
              setEditingAddresss(null); 
            };

      

            const handleEditClick = (addressObj) => {
                setEditingAddresss({ ...addressObj }); 
                console.log("Editing ID:", addressObj.id, "Name:", addressObj.name);  
                setEditModal(true);
              };



                const handleEditSubmit = async () => {
                                   

                if (!editingAddressType?.id) {
                  toast.error("Invalid address type selected for editing.");
                  return;
  }
                if (!validateEditForm()) return;

                setIsSubmitting(true);
                try {
                  const response = await addressTypeModel.updateAddressTypes(
                    editingAddressType.id,
                    {
                      name: editingAddressType.name,
                      description: editingAddressType.description,
                      status: editingAddressType.status,
                    }
                  );
                  console.log("Editing Address Type:", editingAddressType);


                  if (response.status === 200) {
                    fetchAddressTypes();
                    toast.success('Address type updated successfully!');
                    handleEditCloseModal();
                  }
                } catch (error) {
                  console.error(error);
                  toast.error('Failed to update address type!');
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


              const validateEditForm = () => {
                let valid = true;
                const newErrors = { name: '', description: '', status: '' };

                if (!editingAddressType?.name?.trim()) {
                  newErrors.name = 'Address type name is required';
                  valid = false;
                } else if (editingAddressType.name.length < 2) {
                  newErrors.name = 'Must be at least 2 characters';
                  valid = false;
                }

                if (!editingAddressType?.description?.trim()) {
                  newErrors.description = 'Description is required';
                  valid = false;
                }

                if (editingAddressType?.status === undefined || editingAddressType.status === '') {
                  newErrors.status = 'Status is required';
                  valid = false;
                }

            setErrors(newErrors);
            return valid;
           };

           
          const handleDeleteAddressType = async (id) => {
          console.log(id)
          if (!id) toast.error("Please Try Again , Failed to Delete Adress Type")

          try {
            await addressTypeModel.deleteAddress(id);
            await fetchAddressTypes()
            toast.success('Address type deleted successfully');
          } catch (error) {
          
            toast.error('Failed to delete address type');
          }finally {
            setDeletingId(null);
           }
        };


  useEffect(() => {
    fetchAddressTypes()
  }, [])

  return (
    <>
      <CustomScrollbar/>
          <div  className="bg-white w-full
                  max-w-[95vw] 
                  xl:max-w-[90vw] 
                  2xl:max-w-[95vw] 
                  h-auto max-h-[70vh] 
                  rounded-xl px-4 md:px-8 lg:px-12
                  mx-auto overflow-auto  custom-scrollbar"
                style={{ fontFamily: 'Open Sans',overflow:'auto'}}
                                                      >
        <CreateButton
          buttoncontent="+ New Address Type"
          onClick={() => setModal(true)}
        />
       <ItemsPerPageSelector items={limit} setItems={setLimit} />

        <table
          className="table w-full text-sm text-left text-gray-500 border-collapse"
          style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '1200px' }}
        >
          <thead className="text-xs text-gray-400 uppercase bg-white">
            <tr>
              <th className="px-6 py-3" style={{ width: '70px', paddingLeft: '20px' }}>SL NO</th>
              <th className="px-6 py-3" style={{ width: '130px' }}>NAME</th>
              <th className="px-6 py-3" style={{ width: '600px' }}>DESCRIPTION</th>
              <th className="px-6 py-3" style={{ width: '90px' }}>STATUS</th>
              <th className="px-6 py-3" style={{ width: '90px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
  <TableSkelton />
) : addressTypes.length === 0 ? (
  <tr >
    <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
      No data available
    </td>
  </tr>
) : addressTypes.map((address,index) => (
              <tr key={address.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '20px' }}>
                  {index+1}
                </td>
                <td className="px-6 py-5 border-b border-gray-200 text-xs">{address.name}</td>
                <td className="px-6 py-5 border-b border-gray-200 text-xs">{address.description}</td>
                <td className="py-4 border-b border-gray-200 text-xs">
                  {address.status ? (
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
                    onClick={() => handleEditClick(address)} 
                    />

                     <DeleteButton 
                               buttonText={deletingId === address.id ? 'Deleting...' : 'Delete'}
                                item="Addres Type"
                                onOpenModal={() => setItemToDelete(address.id)}
                                onConfirmDelete={() => handleDeleteAddressType(itemToDelete)}
                                disabled={deletingId === address.id}
                           />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
  <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[500px] flex flex-col gap-4 overflow-y-auto" style={{ padding: '20px' }}>
            <h3 className="font-bold text-[22px] text-[#344767]">
              Create Address Type
            </h3>
            <hr className=" border-gray-300" />

            <div className="flex flex-col flex-grow gap-4">
              <label className="font-semibold text-xs text-[#344767] w-[80%]">
                Name:
              </label>
              <div>
              <input type="text"
                placeholder="Type here"
                value={data.name}
                className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                style={{ paddingLeft: '12px' }}
                onChange={(e) => handleChange(e)}
                name="name"
              />
               <p className="text-xs text-red-400">{errors.name}</p>
               </div>
              <label className="font-semibold text-xs text-[#344767] w-[100%]">
                Description:
              </label>
              <div>
              <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500"
                placeholder="Description"
                style={{ paddingLeft: '12px',}}
                onChange={(e) => handleChange(e)}
                name="description"
                value={data.description}
              ></textarea>
              <p className="text-xs text-red-400">{errors.description}</p>
              </div>

              {/* <label className="font-semibold text-xs text-[#344767] w-[80%]">
                Status:
              </label>
              <select
                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500"
                style={{ paddingLeft: '12px' }}
                value={data.status}
                name='status'
                onChange={(e) => handleChange(e)}
              >
                <option value=""  className=" text-gray-600">Select </option>
                <option value={true} className=" text-gray-600"> Active</option>
                <option value={false} className=" text-gray-600"> InActive</option>
              </select> */}
            </div>

            {/* Button container positioned 10px above bottom */}
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
            
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
                onClick={() =>handleSubmit()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[500px] flex flex-col gap-4 overflow-y-auto" style={{ padding: '20px' }}>
            <h3 className="font-bold text-[22px] text-[#344767]">
              Edit Address Type
            </h3>
            <hr className=" border-gray-300" />

            <div className="flex flex-col flex-grow gap-4">
              <label className="font-semibold text-xs text-[#344767] w-[80%]">
                Name:
              </label>

              <div>
              <input type="text"
                placeholder="Type here"
                className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                style={{ paddingLeft: '12px' }}
                name="name"
                value={editingAddressType?.name || ''}
                onChange={(e) => {
                setEditingAddresss({...editingAddressType, name: e.target.value});
              if (errors.name) setErrors({...errors, name: ''});
            }}
              />
                  <p className="text-xs text-red-400">{errors.name}</p>
              </div>

              <label className="font-semibold text-xs text-[#344767] w-[100%]">
                Description:
              </label>
              <div>
              <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500"
                placeholder="Description"
                style={{ paddingLeft: '12px',}}
                name="description"
                value={editingAddressType?.description || ''}
                onChange={(e) => {
              setEditingAddresss({...editingAddressType, description: e.target.value});
              if (errors.description) setErrors({...errors, description: ''});
            }}
              
              ></textarea>
                <p className="text-xs text-red-400">{errors.description}</p>
                      </div>
              <label className="font-semibold text-xs text-[#344767] w-[80%]">
                Status:
              </label>
              <select
                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500"
                style={{ paddingLeft: '12px' }}
                name='status'
                value={editingAddressType?.status ? 'true' : 'false'}
                onChange={(e) => {
                setEditingAddresss({
                ...editingAddressType, 
                status: e.target.value === 'true'
              });
              if (errors.status) setErrors({...errors, status: ''});
            }}
              >
                <option value="" className=" text-gray-600 text-xs">--Select-- </option>
                <option value={true} className=" text-gray-600 text-xs"> Active</option>
                <option value={false} className=" text-gray-600 text-xs"> InActive</option>
              </select>
            </div>

            {/* Button container positioned 10px above bottom */}
            <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
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
  )
}

export default Adress_Type