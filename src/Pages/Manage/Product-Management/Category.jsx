import { useEffect, useState } from "react";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import CategoryModel from "../../../models/categoryModel";
import ItemTypeModel from "../../../models/itemTypeModel";
import { useSelector } from "react-redux";
import SuccessToast from "../../../components/SuccessToast";
import TableSkelton from "../../../components/tableSkelton";
import { toast } from 'react-toastify';



const Category =()=>{
                    const [items, setItems] = useState(10);
                    const [modal, setModal] = useState(false)   
                    const [editModal,setEditModal]= useState(false)
                    const [categoryData, setCategoryData] = useState([]);
                    const [deletingId, setDeletingId] = useState(null);
                    const [categoryToDelete, setCategoryToDelete] = useState(null);     
                    const auth= useSelector((state) => state.auth);
                    const [totalPages, setTotalPages] = useState(1);
                    const { login_id ,can_manage_user_types,} = auth;    
                    const [isLoading, setIsLoading] = useState(true);
                    const[limit,setLimit]=useState(10);  
                    const[page,setPage]=useState(1);  
                    const[search,setSearch]=useState('');
                    const[status,setStatus]=useState('');
                    const [isSubmitting, setIsSubmitting] = useState(false);
                    const [editingCategory, setEditingCategory] = useState(null);
                    const [addCategoryData, setaddCategoryData] = useState({
                      code: '',
                      name: '',
                      item_type:'',
                      standard_purity:'',
                      is_default:''
                      });

                      const [errors, setErrors] = useState({
                          code: '',
                          name: '',
                          item_type:'',
                          standard_purity:'',
                          is_default:'',
                        });

                     const user_id = login_id;
                     const user_types = Object.keys(can_manage_user_types).join(',');
                     const [itemTypeOptions, setItemTypeOptions] = useState([]);

                     const FetchCategory = async () => {
                        try {
                          const response = await CategoryModel.getCategorys(
                            user_id,          
                            user_types,          
                            limit,
                            page,
                            search,
                            status               
                          );

                          if (response.data && response.data.data) {
                            setCategoryData(response.data.data);
                            setTotalPages(response.data.pagination.pages);
                          }
                        } catch (error) {
                          console.error("Error fetching category data:", error);
                        }
                      };
                  const handleChange = (e) => {
                      const { name, value } = e.target;

                      setaddCategoryData(prev => ({ ...prev, [name]: value }));

                    
                      if (name === 'code') {
                        const isDuplicate = categoryData.some(
                          (item) => item.code.toLowerCase().trim() === value.toLowerCase().trim()
                        );

                        if (isDuplicate) {
                          setErrors(prev => ({ ...prev, code: "Code already exists" }));
                        } else {
                          setErrors(prev => ({ ...prev, code: "" })); 
                        }
                      }
                    };

                    const handleSubmit = async () => {
                    // Validate before submission
                    if (!validateForm()) {
                      return;
                    }

                    const formData = new FormData();
                    formData.append('code', addCategoryData.code);
                    formData.append('name', addCategoryData.name);
                    formData.append('item_type', addCategoryData.item_type);
                    formData.append('standard_purity', addCategoryData.standard_purity);
                    formData.append('is_default', addCategoryData.is_default);

                    try {
                      const response = await CategoryModel.CreateCategory(formData);
                      console.log("Update response:", response);  
                      if (response.status === 201) {
                        FetchCategory(); // Refresh the list
                        handleCloseModal();    
                        toast.success('Category created successfully!');
                      }
                                        

                    }catch (error) {

                       toast.error('Failed to create category!');
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
                    const response = await CategoryModel.updateCategory(
                      editingCategory.id,
                      {
                        code: editingCategory.code,
                        name: editingCategory.name,
                        item_type: editingCategory.item_type,
                        standard_purity: editingCategory.standard_purity,
                        is_default: editingCategory.is_default,
                        status: editingCategory.status
                      }
                    );
                    if (response.status === 200) {
                      FetchCategory();
                      toast.success('Category updated successfully!');

                      handleEditCloseModal();
                    }
                  } catch (error) {
                      console.log(error);
                      
                       toast.error('Failed to update category!');
               
                  } finally {
                    setIsSubmitting(false);
                  }
                };

  const validateForm = () => {
  let valid = true;
  const newErrors = {
  code: '',
  name: '',
  item_type: '',
  standard_purity: '',
  is_default: ''
};

// Code validation
if (!addCategoryData.code) {
  newErrors.code = 'Category code is required';
  valid = false;
} else if (addCategoryData.code.length < 2) {
  newErrors.code = 'Must be at least 2 characters';
  valid = false;
}


// Name validation
if (!addCategoryData.name) {
  newErrors.name = 'Category name is required';
  valid = false;
} else if (addCategoryData.name.length < 2) {
  newErrors.name = 'Must be at least 2 characters';
  valid = false;
}

// Item Type validation
if (!addCategoryData.item_type) {
  newErrors.item_type = 'Please select an item type';
  valid = false;
}

// Standard Purity validation
if (
  addCategoryData.standard_purity === null ||
  addCategoryData.standard_purity === undefined ||
  addCategoryData.standard_purity === ''
) {
  newErrors.standard_purity = 'Standard Purity is required';
  valid = false;
} else if (isNaN(addCategoryData.standard_purity) || addCategoryData.standard_purity < 0) {
  newErrors.standard_purity = 'Must be a valid non-negative number';
  valid = false;
}


// Is Default validation
if (!addCategoryData.is_default && addCategoryData.is_default !== false) {
  newErrors.is_default = 'Please select if this is default or not';
  valid = false;
}


  setErrors(newErrors);
  return valid;
};

const validateEditForm = () => {
  let valid = true;

  const newErrors = {
    code: '',
    name: '',
    description: '',
    item_type: '',
    standard_purity: '',
    is_default: '',
    status: ''
  };

  // Code Validation
  if (!editingCategory?.code) {
    newErrors.code = 'Category code is required';
    valid = false;
  } else if (editingCategory.code.length < 2) {
    newErrors.code = 'Must be 2-3 letters or valid item type code';
    valid = false;
  }

  // Name Validation
  if (!editingCategory?.name) {
    newErrors.name = 'Item type name is required';
    valid = false;
  } else if (editingCategory.name.length < 2) {
    newErrors.name = 'Must be at least 2 characters';
    valid = false;
  }

  // Item Type Dropdown Validation
  if (!editingCategory?.item_type) {
    newErrors.item_type = 'Please select an item type';
    valid = false;
  }

  // Standard Purity Dropdown Validation
  if (
  editingCategory.standard_purity === null ||
  editingCategory.standard_purity === undefined ||
  editingCategory.standard_purity === ''
) {
  newErrors.standard_purity = 'Standard Purity is required';
  valid = false;
} else if (isNaN(editingCategory.standard_purity) || editingCategory.standard_purity < 0) {
  newErrors.standard_purity = 'Must be a valid non-negative number';
  valid = false;
}

  // Is Default Dropdown Validation
  if (editingCategory?.is_default === undefined || editingCategory.is_default === '') {
    newErrors.is_default = 'Please select if this is default or not';
    valid = false;
  }

  // Status Dropdown Validation
  if (editingCategory?.status === undefined || editingCategory.status === '') {
    newErrors.status = 'Status is required';
    valid = false;
  }


  setErrors(newErrors);
  return valid;
};

            const handleDeleteCategory = async (id) => {
              if (!id) return toast.error("No item selected for deletion");
              
              try {
                setDeletingId(id);
                await CategoryModel.deleteCategory(id);
                await FetchCategory(); // Refresh the list
                toast.success("Category deleted successfully");
              } catch (error) {
                console.error("Delete error:", error);
                toast.error("Failed to delete category");
              } finally {
                setDeletingId(null);
                setCategoryToDelete(null); // <-- Fix here
              }
            };
                   
                    // Handle close modal
                   const handleCloseModal = () => {
                      setaddCategoryData({
                        code: '',
                        name: '',
                        item_type:'',
                        standard_purity:'',
                        is_default:''
                        
                      });
                      setErrors({
                        code: '',
                        name: '',
                        item_type:'',
                        standard_purity:'',
                        is_default:''
                        
                      })
                      setModal(false);
                    };

                  
                    const handleEditCloseModal = () => {
                      setErrors({
                        code: '',
                        name: '',
                        item_type:'',
                        standard_purity:'',
                        is_default:''
                        
                      })
                      setEditModal(false)
                    };
                  
                  
                  useEffect(() => {
                    // Fetch categories
                    FetchCategory();

                    // Fetch item types
                    const fetchItemTypes = async () => {
                      try {
                        const response = await ItemTypeModel.getItemTypes(user_id, user_types);
                        if (response.data && response.data.data) {
                          setItemTypeOptions(response.data.data);
                        }
                      } catch (error) {
                        console.error("Error fetching item types:", error);
                      }finally{
                        setIsLoading( false)
                      }
                    };

                    fetchItemTypes();
                  },[])
                  
                  
                    return (
                      
                  <>
                  <CustomScrollbar/>
                 <div className="bg-white w-full
                                  max-w-[95vw] 
                                  xl:max-w-[90vw] 
                                  2xl:max-w-[95vw] 
                                  h-auto max-h-[80vh] 
                                  rounded-xl px-4 md:px-8 lg:px-12
                                  mx-auto overflow-auto  custom-scrollbar"
                              style={{ fontFamily: 'Open Sans',overflow:'auto'}}
                                >
                 <CreateButton
                  buttoncontent="+ New Category"
                  onClick={() => setModal(true)}  // This will now work!
                 />                 
                <ItemsPerPageSelector items={limit} setItems={setLimit} />
                  
                        
                     <table className="w-full text-sm text-left text-gray-500 border-collapse overflow-x-auto"
                        style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '1100px' }}>
                      <thead className="text-xs text-gray-400 uppercase bg-white">
                        <tr>
                          <th  style={{ width: '80px', paddingLeft: '20px' }}>SL NO</th>
                          <th  style={{ width: '150px' }}>CODE</th>
                          <th  style={{ width: '150px' }}>NAME</th>
                          <th  style={{ width: '150px' }}>ITEM TYPE</th>
                          <th  style={{ width: '150px' }}>STANDARD PURITY</th>
                          <th  style={{ width: '150px' }}>IS DEFAULT</th>
                          <th  style={{ width: '150px' }}>STATUS</th>
                          <th  style={{ width: '150px' }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <TableSkelton />
                        ) : categoryData.length === 0 ? (
                          <tr >
                            <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
                              No data available
                            </td>
                          </tr>
                        ) : categoryData.map((category,index) => (
                          console.log(category),
                          <tr key={index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                            <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>
                              {index+1}
                            </td>
                            <td className="py-4 border-b border-gray-200 text-xs">{category.code}</td>
                            <td className="py-4 border-b border-gray-200 text-xs">{category.name}</td>
                            <td className="py-4 border-b border-gray-200 text-xs">
                              {itemTypeOptions.find(item => item.id === category.item_type)?.name || category.item_type}
                            </td>
                            <td className="py-4 border-b border-gray-200 text-xs">{category.standard_purity}</td>
                            <td className="py-4 border-b border-gray-200 text-xs">{category.is_default? (
                                <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                  Yes
                                </span>
                              ) : (
                                <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                  No
                                </span>
                              )}</td>
                            <td className="py-4 border-b border-gray-200 text-xs">
                              {category.status ? (
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
                                    setEditingCategory(category);  // Set the itemType to edit
                                    setEditModal(true);
                                  }}
                                />
                              <DeleteButton 
                                buttonText={deletingId === category.id ? 'Deleting...' : 'Delete'}
                                onOpenModal={() => setCategoryToDelete(category)} // Set the correct item to delete
                                onConfirmDelete={() => handleDeleteCategory(categoryToDelete?.id)}
                                disabled={deletingId === category.id}
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
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[600px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] ">
                                         Create Category                  </h3>
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
                                        placeholder="Type here"
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                        style={{ paddingLeft: '12px' }}
                                        name="code"
                                        value={addCategoryData.code}
                                        onChange={handleChange}
                                      />
                                      {errors.code && (
                                              <p className="text-red-500 text-xs mt-1">{errors.code}</p>
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
                                      className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                      style={{ paddingLeft: '12px' }}
                                      name="name"
                                      value={addCategoryData.name}
                                      onChange={handleChange}
                                    />
                                    {errors.name && (
                                              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                            )}
                                    
                                    </div>
                                    <div>
                                       <label className="font-semibold text-xs text-[#344767] w-[100%]">
                                        Item Type: <span className="text-red-500 text-[14px]">*</span>
                                      </label>
                                      <select
                                        name="item_type"
                                        value={addCategoryData.item_type}
                                        onChange={handleChange}
                                        className="select w-[100%] bg-white border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                                        style={{ paddingLeft: '12px', color: '#374151' }}
                                      >
                                        <option value="" className="text-xs text-gray-500">--select category--</option>
                                        {itemTypeOptions.map((item) => (
                                          <option className="text-xs text-gray-400" key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                      </select>
                                      {errors.item_type && (
                                        <p className="text-red-500 text-xs mt-1">{errors.item_type}</p>
                                      )}
                                    </div>
                                    <div>
                                       <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Standard Purity: <span className="text-red-500 text-[14px]">*</span>
                                      </label>

                                      <input
                                      type="number"
                                      placeholder="Type here"
                                      className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                      style={{ paddingLeft: '12px' }}
                                      name="standard_purity"
                                      value={addCategoryData.standard_purity}
                                      onChange={handleChange}
                                    />
                                    {errors.standard_purity && (
                                              <p className="text-red-500 text-xs mt-1">{errors.standard_purity}</p>
                                            )}
                                    
                                    </div>

                                    <div>
                                      <label className="font-semibold text-xs text-[#344767] w-[100%]">
                                        Is Default: <span className="text-red-500 text-[14px]">*</span>
                                      </label>
                                      <select
                                        name="is_default"
                                        value={addCategoryData.is_default}
                                        onChange={handleChange}
                                        className="select w-[100%] bg-white border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                                        style={{ paddingLeft: '12px', color: '#374151' }}
                                      >
                                        <option value="" className="text-xs text-gray-400">-- select option --</option>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                      </select>

                                      {errors.is_default && (
                                        <p className="text-red-500 text-xs mt-1">{errors.is_default}</p>
                                      )}
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
    <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[620px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
      <h3 className="font-bold text-[22px] text-[#344767]">
        Edit Category
      </h3>
      <hr className="border-gray-300"/>
      <div className="flex flex-col flex-grow gap-4">
        {/* Code Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[80%]">
            Code:<span className="text-red-500 text-[14px]">*</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className={`input w-[100%] rounded-lg focus:outline-none text-gray-500 bg-white border ${
              errors.code ? 'border-red-500' : 'border-gray-300'
            } focus:border-b-2 focus:border-blue-500`}
            style={{paddingLeft:'12px'}}
            name="code"
            value={editingCategory?.code || ''}
            onChange={e => {
              setEditingCategory({...editingCategory, code: e.target.value});
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
            Name:<span className="text-red-500 text-[14px]">*</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            className={`input w-[100%] rounded-lg focus:outline-none text-gray-500 bg-white border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } focus:border-b-2 focus:border-blue-500`}
            style={{paddingLeft:'12px'}}
            name="name"
            value={editingCategory?.name || ''}
            onChange={e => {
              setEditingCategory({...editingCategory, name: e.target.value});
              if (errors.name) setErrors({...errors, name: ''});
            }}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        {/* Item Type Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[100%]">
            Item Type:<span className="text-red-500 text-[14px]">*</span>
          </label>
          <select
            name="item_type"
            value={editingCategory?.item_type || ''}
            onChange={e => {
              setEditingCategory({...editingCategory, item_type: e.target.value});
              if (errors.item_type) setErrors({...errors, item_type: ''});
            }}
            className="select w-[100%] bg-white border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px', color: '#374151' }}
          >
            <option value="">Select Item Type</option>
            {itemTypeOptions.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          {errors.item_type && (
            <p className="text-red-500 text-xs mt-1">{errors.item_type}</p>
          )}
        </div>
        {/* Standard Purity Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[100%]">
            Standard Purity:<span className="text-red-500 text-[14px]">*</span>
          </label>
          <input
            type="number"
            placeholder="Type here"
            className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px' }}
            name="standard_purity"
            value={editingCategory?.standard_purity || ''}
            onChange={e => {
              setEditingCategory({...editingCategory, standard_purity: e.target.value});
              if (errors.standard_purity) setErrors({...errors, standard_purity: ''});
            }}
          />
          {errors.standard_purity && (
            <p className="text-red-500 text-xs mt-1">{errors.standard_purity}</p>
          )}
        </div>
        {/* Is Default Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[100%]">
            Is Default:<span className="text-red-500 text-[14px]">*</span>
          </label>
          <select
            name="is_default"
            value={editingCategory?.is_default === true ? "true" : editingCategory?.is_default === false ? "false" : ""}
            onChange={e => {
              setEditingCategory({...editingCategory, is_default: e.target.value === "true"});
              if (errors.is_default) setErrors({...errors, is_default: ''});
            }}
            className="select w-[100%] bg-white border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px', color: '#374151' }}
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          {errors.is_default && (
            <p className="text-red-500 text-xs mt-1">{errors.is_default}</p>
          )}
        </div>
        {/* Status Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[100%]">
            Status:<span className="text-red-500 text-[14px]">*</span>
          </label>
          <select
            name="status"
            value={editingCategory?.status === true ? "Active" : editingCategory?.status === false ? "Inactive" : ""}
            onChange={e => {
              setEditingCategory({...editingCategory, status: e.target.value === "Active"});
              if (errors.status) setErrors({...errors, status: ''});
            }}
            className="select w-[100%] bg-white border border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
            style={{ paddingLeft: '12px', color: '#374151' }}
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

export default Category