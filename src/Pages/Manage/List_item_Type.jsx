import { useEffect, useRef, useState } from "react";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import ItemTypeModel from "../../models/itemTypeModel";
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import TableSkelton from "../../components/tableSkelton";



const ItemType =()=>{
                    const [modal, setModal] = useState(false)   
                    const [editModal,setEditModal]= useState(false)
                    const [itemTypeData, setItemTypeData] = useState([]);
                    const [isLoading, setIsLoading] = useState(true);

                    const [deletingId, setDeletingId] = useState(null);
                    const [itemToDelete, setItemToDelete] = useState(null);     
                    const auth= useSelector((state) => state.auth);
                    const { login_id ,can_manage_user_types,} = auth;    
                     const [totalPages, setTotalPages] = useState(1);
                    const[limit,setLimit]=useState(10);  
                    const[page,setPage]=useState(1);  
                    const[search,setSearch]=useState('');
                    const[status,setStatus]=useState('');
                    const [isSubmitting, setIsSubmitting] = useState(false);
                    const [editingItemType, setEditingItemType] = useState(null);
                    const [addItemTypeData, setaddItemTypeData] = useState({
                      code: '',
                      name: ''
                      });
                      const [errors, setErrors] = useState({
                            code: '',
                            name: '',
                        });
                     const user_id = login_id;
                     const user_types = Object.keys(can_manage_user_types).join(',');

                     
                      const nameRef = useRef(null);        // For Create modal
                      const nameEditRef = useRef(null);    // For Edit modal
                      const codeRef = useRef(null);         // For Create modal - Code field
                      const codeEditRef = useRef(null); 

                     const FetchItemType = async () => {
                       setIsLoading(true)
                        try {
                          const response = await ItemTypeModel.getItemTypes(
                            user_id,          
                            user_types,          
                            limit,
                            page,
                            search,
                            status               
                          );

                          if (response.data && response.data.data) {
                            setItemTypeData(response.data.data);
                            setTotalPages(response.data.pagination.pages);
                          }
                        } catch (error) {
                          console.error("Error fetching item type data:", error);
                        }finally{
                          setIsLoading(false)
                        }


                      };
                    const handleChange = (e) => {
                        const { name, value } = e.target;
                        setaddItemTypeData(prev => ({ ...prev, [name]: value }));
                        setErrors(prev => ({...prev,[name]:''}))
                      };


                    const handleSubmit = async () => {
                    // Validate before submission
                    if (!validateForm()) {
                      return;
                    }

                    const formData = new FormData();
                    formData.append('code', addItemTypeData.code);
                    formData.append('name', addItemTypeData.name);
                    formData.append('description', addItemTypeData.description);

                    try {
                      const response = await ItemTypeModel.CreateItemType(formData);
                      console.log("Update response:", response);  
                      if (response.status === 201) {
                        FetchItemType(); // Refresh the list
                        handleCloseModal();    
                        toast.success('Item type created successfully!');
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
                    const response = await ItemTypeModel.updateItemType(
                      editingItemType.id,
                      {
                        code: editingItemType.code,
                        name: editingItemType.name,
                        description: editingItemType.description,
                        status: editingItemType.status
                      }
                    );
                    if (response.status === 200) {
                      FetchItemType();
                      toast.success('Item type updated successfully!');

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

            const validateForm = () => {
            let valid = true;
            const newErrors = { code: '', name: '' };

            const name = addItemTypeData.name.trim();
            const code = addItemTypeData.code.trim();

            if (!code) {
              newErrors.code = 'Item type code is required';
              valid = false;
            } else if (code.length < 2) {
              newErrors.code = 'Must be 2–3 characters';
              valid = false;
            }

            if (!name) {
              newErrors.name = 'Item type name is required';
              valid = false;
            } else {
              const nameRegex = /^[A-Za-z\s]+$/;
              if (!nameRegex.test(name)) {
                newErrors.name = 'Name must contain only letters and spaces';
                valid = false;
              } else if (name.length < 2) {
                newErrors.name = 'Must be at least 2 characters';
                valid = false;
              } else if (name.length > 50) {
                newErrors.name = 'Must not exceed 50 characters';
                valid = false;
              }
            }

            setErrors(newErrors);

            // Focus if error
            if (!valid) {
              if (newErrors.code && codeRef.current) {
                codeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                codeRef.current.focus();
              } else if (newErrors.name && nameRef.current) {
                nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                nameRef.current.focus();
              }
            }

            return valid;
          };


          const validateEditForm = () => {
  let valid = true;
  const newErrors = { code: '', name: '', description: '', status: '' };

  const name = editingItemType?.name?.trim();
  const code = editingItemType?.code?.trim();

  if (!code) {
    newErrors.code = 'Item type code is required';
    valid = false;
  } else if (code.length < 2) {
    newErrors.code = 'Must be 2–3 characters';
    valid = false;
  }

  if (!name) {
    newErrors.name = 'Item type name is required';
    valid = false;
  } else {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      newErrors.name = 'Name must contain only letters and spaces';
      valid = false;
    } else if (name.length < 2) {
      newErrors.name = 'Must be at least 2 characters';
      valid = false;
    } else if (name.length > 50) {
      newErrors.name = 'Must not exceed 50 characters';
      valid = false;
    }
  }

  if (!editingItemType?.description || editingItemType.description.length < 2) {
    newErrors.description = 'Description must be at least 2 characters';
    valid = false;
  }

  if (editingItemType?.status === undefined) {
    newErrors.status = 'Status is required';
    valid = false;
  }

  setErrors(newErrors);

  // Focus if error
  if (!valid) {
  if (newErrors.code && codeEditRef.current) {
    codeEditRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    codeEditRef.current.focus();
  } else if (newErrors.name && nameEditRef.current) {
    nameEditRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    nameEditRef.current.focus();
  }
}

  return valid;
};


            const handleDeleteItemType = async (id) => {
              if (!id) return toast.error("No item selected for deletion");
              
              try {
                setDeletingId(id);
                await ItemTypeModel.deleteItemType(id);
                await FetchItemType(); // Refresh the list
                toast.success("Item type deleted successfully");
              } catch (error) {
                console.error("Delete error:", error);
                toast.error("Failed to delete item type");
              } finally {
                setDeletingId(null);
                setItemToDelete(null);
              }
            };
                   
                    // Handle close modal
                   const handleCloseModal = () => {
                      setaddItemTypeData({
                        code: '',
                        name: '',
                        
                      });
                      setErrors(
                        {
                        code: '',
                        name: '',
                        
                      }
                      )
                      setModal(false);
                    };

                  
                    const handleEditCloseModal = () => {
                      setEditModal(false)
                      setErrors( {
                        code: '',
                        name: '',
                        
                      })
                    };
                  
                  
                  useEffect(() => {
                    FetchItemType(); 
                  },[limit,page,search,status])
                  
                  
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
                  buttoncontent="+ New Item Type"
                  onClick={() => setModal(true)}  // This will now work!
                 />                 
                <ItemsPerPageSelector items={limit} setItems={setLimit} />
                  
                        
                     <table className="w-full text-sm text-left text-gray-500 border-collapse overflow-x-auto"
                        style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '800px' }}>
                      <thead className="text-xs text-gray-400 uppercase bg-white">
                        <tr>
                          <th  style={{ width: '80px', paddingLeft: '20px' }}>SL NO</th>
                          <th  style={{ width: '100px' }}>CODE</th>
                          <th  style={{ width: '130px' }}>NAME</th>
                          <th  style={{ width: '130px' }}>DESCRIPTION</th>
                          <th  style={{ width: '130px' }}>STATUS</th>
                          <th  style={{ width: '130px' }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                        isLoading ? (
                          <TableSkelton />
                        ) : itemTypeData.length === 0 ? (
                          <tr >
                            <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
                              No data available
                            </td>
                          </tr>
                        ) :
                        
                        itemTypeData.map((itemType,index) => (
                          console.log(itemType),
                          <tr key={index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                            <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>
                              {index+1}
                            </td>
                            <td className="py-4 border-b border-gray-200 text-xs">{itemType.code}</td>
                            <td className="py-4 border-b border-gray-200 text-xs">{itemType.name}</td>
                            <td className="py-4 border-b border-gray-200 text-xs">{itemType.description}</td>
                            <td className="py-4 border-b border-gray-200 text-xs">
                              {itemType.status ? (
                                <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                  Active
                                </span>
                              ) : (
                                <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                  INACTIVE
                                </span>
                              )}
                            </td>
                            <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                              <div className="flex gap-2.5 items-center">
                                 <EditButton 
                                  onClick={() => {
                                    setEditingItemType(itemType);  // Set the itemType to edit
                                    setEditModal(true);
                                  }}
                                />
                              <DeleteButton 
                                buttonText={deletingId === itemType.id ? 'Deleting...' : 'Delete'}
                                onOpenModal={() => setItemToDelete(itemType)} // Set the correct item to delete
                                onConfirmDelete={() => handleDeleteItemType(itemToDelete?.id)}
                                disabled={deletingId === itemType.id}
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
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[480px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Create Item Type                     </h3>
                                    <hr className=" border-gray-300"/>
                                    <div className="flex flex-col flex-grow gap-4"> {/* Added flex-grow */}
                                      <div>
                                      <label      
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Code: <span className="text-red-500 text-[14px]">*</span>
                                      </label>
                                      <input
                                        type="text"
                                          ref={codeRef}
                                        placeholder="Type here"
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                        style={{ paddingLeft: '12px' }}
                                        name="code"
                                        value={addItemTypeData.code}
                                        onChange={handleChange}
                                      />
                                      {errors.code && (
                                              <p className="text-red-500 text-xs ">{errors.code}</p>
                                            )}
                                      
                                      
                                      </div>
                                      <div>
                                       <label                                      
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name: <span className="text-red-500 text-[14px]">*</span>
                                      </label>
                                     <input
                                      type="text"
                                      placeholder="Type here"
                                         ref={nameRef}
                                      className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                      style={{ paddingLeft: '12px' }}
                                      name="name"
                                      value={addItemTypeData.name}
                                      onChange={handleChange}
                                    />
                                    {errors.name && (
                                              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                            )}
                                    
                                    </div>
                                    <div>
                                       <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Description:
                                      </label>

                                      <textarea
                                        name="description"
                                      
                                        value={addItemTypeData.description}
                                        onChange={handleChange}
                                        placeholder="Description"
                                        className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                                        style={{ padding: '12px', color: '#374151' }}
                                      ></textarea>

                                    
                                    
                                    </div>
                                    {/* <div>
                                      <label className="font-semibold text-xs text-[#344767] w-[100%]">
                                        Status:
                                      </label>
                                      <select
                                        className={`select w-[100%] h-[35px] bg-white border ${
                                          errors.status ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none rounded-lg focus:border-b-2 focus:border-blue-500`}
                                        style={{paddingLeft:'12px'}}
                                        value={editingItemType?.status ? 'Active' : 'Inactive'}  // Fixed from editingCountry to editingItemType
                                        onChange={(e) => {
                                          setEditingItemType({
                                            ...editingItemType, 
                                            status: e.target.value === 'Active'  // Convert back to boolean
                                          });
                                          if (errors.status) setErrors({...errors, status: ''});
                                        }}
                                      >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                      </select>
                                      {errors.status && (
                                        <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                                      )}
                                    </div> */}


                                   </div> 
                                   <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                        >
                                     <button
                                       type="button"
                                       className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                       style={{ backgroundColor: '#8392ab' }}
                                               onClick={handleCloseModal}
                                      >
                                             close
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
       
     {editModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
    <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[520px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
      <h3 className="font-bold text-[22px] text-[#344767]">
        Edit Item Type
      </h3>
      <hr className="border-gray-300"/>
      
      <div className="flex flex-col flex-grow gap-4">
        {/* Code Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[80%]">
            Code: <span className="text-red-500 text-[14px]">*</span>
          </label>
          <input
            type="text"
            placeholder="Type here"

            ref={codeEditRef}
            className={`input w-[100%] rounded-lg focus:outline-none border-gray-300 text-gray-500 bg-white border focus:border-b-2 focus:border-blue-500`}
            style={{paddingLeft:'12px'}}
            name="code"
          value={editingItemType?.code || ''}
            onChange={(e) => {
              setEditingItemType({...editingItemType, code: e.target.value});
              if (errors.code) setErrors({...errors, code: ''});
            }}
          />
          {errors.code && (
            <p className="text-red-500 text-xs mt-1">{errors.code}</p>
          )}
        </div>

        {/* Name Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[80%]">
            Name: <span className="text-red-500 text-[14px]">*</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            ref={nameEditRef}
            className={`input w-[100%] rounded-lg focus:outline-none border-gray-300 text-gray-500 bg-white border focus:border-b-2 focus:border-blue-500`}
            style={{paddingLeft:'12px'}}
            name="name"
           value={editingItemType?.name || ''}
            onChange={(e) => {
              setEditingItemType({...editingItemType, name: e.target.value});
              if (errors.name) setErrors({...errors, name: ''});
            }}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label 
                                        
          className="font-semibold text-xs text-[#344767] w-[100%]">
            Description:
            </label>
            <textarea
                name="description"
                placeholder="Description"
                className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                style={{ paddingLeft: '12px', }}
                value={editingItemType?.description || ''}
            onChange={(e) => {
              setEditingItemType({...editingItemType, description: e.target.value});
              
            }}
            ></textarea>
             
                                    
        </div>

        {/* Status Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[80%]">
            Status:
          </label>
          <select
            className={`select w-[100%] h-[35px] text-gray-500 bg-white border ${
              errors.status ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none rounded-lg focus:border-b-2 focus:border-blue-500`}
            style={{paddingLeft:'12px'}}
            value={editingItemType?.status === true ? 'Active' : 
                  editingItemType?.status === false ? 'Inactive' : ''}
            onChange={(e) => {
              setEditingItemType({
                ...editingItemType, 
                status: e.target.value === 'Active'  // Convert back to boolean
              });
              if (errors.status) setErrors({...errors, status: ''});
            }}
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-xs mt-1">{errors.status}</p>
          )}
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
       
                          
                     </>)
}

export default ItemType