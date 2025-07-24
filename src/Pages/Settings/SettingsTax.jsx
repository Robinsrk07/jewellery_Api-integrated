
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import settingsTaxModel from "../../models/settingsTaxModel";
import ItemTypeModel from "../../models/itemTypeModel";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import TableSkelton from "../../components/tableSkelton";

     
const  SettingsTax = () => {
     


                      const [isHovered, setIsHovered] = useState(false);
                      const [modal, setModal] = useState(false);
                      const [editModal, setEditModal] = useState(false);
                      const [totalPages, setTotalPages] = useState(1);
                       const [isLoading, setIsLoading] = useState(true);


                      const [limit, setLimit] = useState(10);
                      const [page, setPage] = useState(1);
                      const [search, setSearch] = useState('');
                      const [status, setStatus] = useState('');


                      const auth = useSelector((state) => state.auth);
                      const { login_id, can_manage_user_types } = auth;
                      const user_id = login_id;
                      const user_types = Object.keys(can_manage_user_types || {}).join(',');

                      const [errors, setErrors] = useState({
                        item_type: '',
                        tax_type: '',
                        tax_name: '',
                        input_tax: '',
                        output_tax: '',
                        status: '',
                      });

                      const [editErrors, setEditErrors] = useState({});
                      const [isSubmitting, setIsSubmitting] = useState(false);


                      const [addTaxData, setAddTaxData] = useState({
                        item_type: '',      
                        tax_type: '',      
                        tax_name: '',
                        input_tax: '',
                        output_tax: '',
                        branch: '',         
                        status: true,
                      });


                      const [editTaxData, setEditTaxData] = useState({
                        id: '',
                        item_type: '',
                        tax_type: '',
                        tax_name: '',
                        input_tax: '',
                        output_tax: '',
                        branch: '',
                        status: true,
                      });

                                
                      const [taxData, setTaxData] = useState([]);

                      const fetchTaxes = async () => {
                          setIsLoading(true);
                          try {
                            const response = await settingsTaxModel.getTaxes(
                              user_id,
                              user_types,
                              limit,
                              page,
                              search,
                              status
                            );

                            if (response?.data?.data) {
                              setTaxData(response.data.data);
                              setTotalPages(response.data.pagination?.pages );
                            }
                          } catch (error) {
                            console.error("Error fetching state data:", error);
                            toast.error("Failed to fetch states.");
                          } finally {
                            setIsLoading(false);
                          }
                        };

                      useEffect(() => {
                        fetchTaxes();
                      }, [limit, page, search, status]);

                      const [itemTypes, setItemTypes] = useState([]);
                      useEffect(() => {
                        const fetchItemTypes = async () => {
                          try {
                            const response = await ItemTypeModel.getItemTypes(user_id, user_types); // Make sure user_id & user_types are defined
                            if (response.status === 200 && response.data?.data) {
                              setItemTypes(response.data.data);
                            } else {
                              toast.error("Failed to fetch item types");
                            }
                          } catch (error) {
                            console.error("Error fetching item types:", error);
                            toast.error("Error loading item types");
                          }
                        };

                        fetchItemTypes();
                      }, []);
                                                            

                      const [branches, setBranches] = useState([]);

                      useEffect(() => {
                        const fetchBranches = async () => {
                          try {
                            const response = await settingsTaxModel.getBranches(user_id);
                            if (response.status === 200) {
                              setBranches(response.data?.data || []);
                            }
                          } catch (error) {
                            console.error("Failed to fetch branches:", error);
                          }
                        };

                        fetchBranches();
                      }, []);


                      const getItemTypeName = (id) => {
                        const item = itemTypes.find((i) => i.id === id);
                        return item ? item.name : "N/A";
                      };

                      const getBranchName = (id) => {
                        const branch = branches.find((b) => b.id === id);
                        return branch ? branch.name : "N/A";
                      };



                        const handleAddTaxChange = (e) => {
                          const { name, value } = e.target;
                          setAddTaxData((prev) => ({
                            ...prev,
                            [name]: value,
                          }));
                        };

                      
                        const validateTax = () => {
                          const newErrors = {};

                          if (!addTaxData.item_type) {
                            newErrors.item_type = "Please select item type";
                            
                          }

                          if (!addTaxData.tax_type.trim()) {
                            newErrors.tax_type = "Please enter tax type";
                          }

                          if (!addTaxData.tax_name.trim()) {
                            newErrors.tax_name = "Please enter tax name";
                          }

                          if (!addTaxData.input_tax || isNaN(Number(addTaxData.input_tax))) {
                            newErrors.input_tax = "Please enter a valid input tax";
                          }

                          if (!addTaxData.output_tax || isNaN(Number(addTaxData.output_tax))) {
                            newErrors.output_tax = "Please enter a valid output tax";
                          }

                          if (!addTaxData.branch) {
                            newErrors.branch = "Please select a branch";
                          }

                          return newErrors;
                        };

                      
                        const handleSubmitTax = async () => {
                          const validationErrors = validateTax();
                          if (Object.keys(validationErrors).length > 0) {
                            setErrors(validationErrors);
                            return;
                          }

                          const payload = {
                            item_type: parseInt(addTaxData.item_type),
                            tax_type: addTaxData.tax_type.trim(),
                            tax_name: addTaxData.tax_name.trim(),
                            input_tax: Number(addTaxData.input_tax),
                            output_tax: Number(addTaxData.output_tax),
                            branch: addTaxData.branch ? parseInt(addTaxData.branch) : null,
                          };

                          console.log(" Tax Payload being sent:", payload);

                          try {
                            const response = await settingsTaxModel.createTax(payload);
                            console.log(" Create Tax response:", response);

                            if (response.status === 201 || response.status === 200) {
                              toast.success("Tax created successfully!");
                              fetchTaxes();
                              handleCloseModal();
                            }
                          } catch (error) {
                            console.error(" Create tax error:", error);
                            console.log("Error response:", error.response?.data);
                            console.log("Field errors:", error.response?.data?.errors);
                            toast.error("Failed to create tax!");
                            handleCloseModal();

                            if (error.response?.data?.errors) {
                              setErrors((prev) => ({
                                ...prev,
                                ...error.response.data.errors,
                              }));
                            }
                          }
                        };



                                                    const [editingTax, setEditingTax] = useState(null);
                                                    const [editTaxErrors, setEditTaxErrors] = useState({});


                                                    const validateEditTax = () => {
                                                      let valid = true;
                                                      const errors = {};

                                                      if (!editingTax?.item_type) {
                                                        errors.item_type = 'Please select item type';
                                                        valid = false;
                                                      }

                                                      if (!editingTax?.tax_type?.trim()) {
                                                        errors.tax_type = 'Tax type is required';
                                                        valid = false;
                                                      }

                                                      if (!editingTax?.tax_name?.trim()) {
                                                        errors.tax_name = 'Tax name is required';
                                                        valid = false;
                                                      }

                                                      if (!editingTax?.input_tax?.toString().trim() || isNaN(editingTax.input_tax)) {
                                                        errors.input_tax = 'Enter valid input tax';
                                                        valid = false;
                                                      }

                                                      if (!editingTax?.output_tax?.toString().trim() || isNaN(editingTax.output_tax)) {
                                                        errors.output_tax = 'Enter valid output tax';
                                                        valid = false;
                                                      }

                                                      if (!editingTax?.branch) {
                                                        errors.branch = 'Please select a branch';
                                                        valid = false;
                                                      }
                                                      setEditTaxErrors(errors);
                                                      return valid;
                                                    };



                                                    const handleEditClickTax = (taxObj) => {
                                                      if (!taxObj || typeof taxObj !== 'object' || !taxObj.id) {
                                                        console.warn("Invalid tax object passed:", taxObj);
                                                        toast.error("Invalid tax selected.");
                                                        return;
                                                      }

                                                      console.log("Editing Tax:", taxObj);

                                                      setEditingTax({
                                                        id: taxObj.id,
                                                        item_type: taxObj.item_type?.toString(),
                                                        tax_type: taxObj.tax_type,
                                                        tax_name: taxObj.tax_name,
                                                        input_tax: taxObj.input_tax,
                                                        output_tax: taxObj.output_tax,
                                                        branch: taxObj.branch?.toString(),
                                                        status: taxObj.status?.toString(),
                                                      });

                                                      setEditModal(true);
                                                    };


                                                    const handleEditTaxChange = (e) => {
                                                      const { name, value } = e.target;

                                                      setEditingTax((prev) => ({
                                                        ...prev,
                                                        [name]: name === 'status' ? (value === 'true') : value,
                                                      }));
                                                    };


                                                    const handleEditSubmitTax = async () => {
                                                      if (!editingTax?.id) {
                                                        toast.error("Invalid tax selected for editing.");
                                                        return;
                                                      }

                                                      if (!validateEditTax()) return;

                                                      setIsSubmitting(true);

                                                      const payload = {
                                                        item_type: parseInt(editingTax.item_type),
                                                        tax_type: editingTax.tax_type.trim(),
                                                        tax_name: editingTax.tax_name.trim(),
                                                        input_tax: editingTax.input_tax,
                                                        output_tax: editingTax.output_tax,
                                                        branch: editingTax.branch ? parseInt(editingTax.branch) : null,
                                                        status: editingTax.status === true || editingTax.status === 'true',
                                                      };

                                                      try {
                                                        const response = await settingsTaxModel.updateTax(editingTax.id, payload);

                                                        if (response.status === 200) {
                                                          fetchTaxes();
                                                          toast.success('Tax updated successfully!');
                                                          setEditModal(false);
                                                        }
                                                      } catch (error) {
                                                        console.error("Update tax error:", error);
                                                        toast.error('Failed to update tax!');
                                                        if (error.response?.data?.errors) {
                                                          setEditTaxErrors((prev) => ({
                                                            ...prev,
                                                            ...error.response.data.errors,
                                                          }));
                                                        }
                                                      } finally {
                                                        setIsSubmitting(false);
                                                      }
                                                    };



                                                    const handleEditCloseModal = () => {
                                                      setEditModal(false);
                                                      setEditingTax(null);
                                                      setEditTaxErrors({
                                                        item_type: '',
                                                        tax_type: '',
                                                        tax_name: '',
                                                        input_tax: '',
                                                        output_tax: '',
                                                        status: '',
                                                      });
                                                    };





                        



                        const handleDeleteTax = async (id) => {
                        if (!id) return;

                        try {
                          await settingsTaxModel.deleteTax(id);

                          setTaxData((prevData) => prevData.filter((item) => item.id !== id));

                          if (modal && typeof modal.close === 'function') {
                            modal.close();
                          }

                          toast.success('Tax deleted successfully');
                        } catch (error) {
                          console.error("Error deleting Tax:", error);
                          toast.error('Failed to delete Tax');
                        }
                      };



                   // Handle close modal
                   const handleCloseModal = () => {
                    setErrors({
                        item_type: '',
                        tax_type: '',
                        tax_name: '',
                        input_tax: '',
                        output_tax: '',
                        status: '',
                      })
                    
                     setModal(false);
                     setEditModal(false)
                   };
                 
                 
                 
                 
                 
                   return (
                     
                 <>
                 <CustomScrollbar/>
                <div className="bg-white w-full
                    max-w-[99vw] 
                    xl:max-w-[90vw] 
                    2xl:max-w-[95vw] 
                    h-auto max-h-[70vh] 
                    rounded-xl px-4 md:px-8 lg:px-12
                    mx-auto overflow-auto  custom-scrollbar"
                 style={{ fontFamily: 'Open Sans',overflow:'auto'}}
                   >
                                  <div
                              style={{
                              position: 'sticky',
                              left: 0,
                              top: 0,
                              zIndex: 10,
                              backgroundColor: 'white',
                              padding: '1.5rem',
                              boxSizing: 'border-box',
                              display: 'flex',
                              justifyContent: 'flex-end',
                              width: 'fit-content', // Changed from 100%
                              minWidth: '100%' // Ensures it matches table width
                              }}
                          >
                              <CreateButton
                                buttoncontent="+ New Tax"
                                onClick={() => setModal(true)}  
                              />                 
                              
                  
                          </div>
                          <ItemsPerPageSelector items={limit} setItems={setLimit} />
                 
                       
                 
                       <table className="table w-full  text-sm text-left text-gray-500 border-collapse min-w-[1100px]  " style={{ borderSpacing: '0 12px', borderCollapse: 'separate', }}>
                         <thead className="text-xs text-gray-400 uppercase bg-white">
                           <tr>
                             <th className="px-6 py-3 w-[100px]" style={{width:'90px',paddingLeft:'40px'}} >SL NO</th>
                             <th className="px-6 py-3 w-[100px]"  style={{ paddingLeft: '10px' }}>ITEM TYPE </th>
                             <th className="px-6 py-3 w-[100px]"  >TAX TYPE </th>
                             <th className="px-6 py-3 w-[120px]" >TAX NAME</th>
                             <th className="px-6 py-3 w-[100px]" >BRANCH</th>
                             <th className="px-6 py-3 w-[200px]"  >INPUT TAX(PURCHASE TAX)</th>
                             <th className="px-6 py-3 w-[170px]"  >OUTPUT TAX(SALE TAX)</th>
                             <th className="px-6 py-3 w-[100px]"  >STATUS</th>
                             <th className="px-6 py-3 w-[100px]"  >ACTION</th>
                           </tr>
                         </thead>
                         <tbody>
                          {isLoading ? (
                            <TableSkelton />
                        ) : taxData.length === 0 ? (
                            <tr>
                            <td className="text-center py-4 text-gray-500 text-sm" colSpan="5">
                                No data available
                            </td>
                            </tr>
                        ) : (
                          taxData.map((tax, index) => (
                            <tr key={tax.id} className="bg-white hover:bg-gray-50 h-14 text-gray-400">
                              <td className="px-4 py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '50px' }}>{index + 1}</td>
                              <td className="px-4 py-4 border-b border-gray-200 text-xs"style={{ paddingLeft: '20px' }}>{getItemTypeName(tax.item_type)}</td>
                              <td className="px-4 py-4 border-b border-gray-200 text-xs">{tax.tax_type}</td>
                              <td className="px-4 py-4 border-b border-gray-200 text-xs">{tax.tax_name}</td>
                              <td className="px-4 py-4 border-b border-gray-200 text-xs">{getBranchName(tax.branch)}</td>
                              <td className="px-4 py-4 border-b border-gray-200 text-xs">{tax.input_tax}</td>
                              <td className="px-4 py-4 border-b border-gray-200 text-xs">{tax.output_tax}</td>
                              <td className="px-4 py-4 border-b border-gray-200 text-xs">
                                {tax.status ? (
                                  <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                    Active
                                  </span>
                                ) : (
                                  <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                    INACTIVE
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200 text-xs" style={{ width: '200px', paddingLeft: '10px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                  <EditButton onClick={() => handleEditClickTax(tax)} />
                                  <DeleteButton
                                    buttonText="Delete Tax"
                                    modalId={`delete_modal_${tax.id}`}
                                    onConfirmDelete={() => handleDeleteTax(tax.id)}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                        </tbody>
                       </table>
                       
                 
                       {/* Pagination */}
                       <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                     
                 
                       {/* Modal */}
      
      
                    
                      </div>
      
                      {modal && (
                                <div className="fixed inset-0 text-gray-500 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md  w-[90vw] max-w-[500px] h-[90vh] max-h-[600px] flex flex-col overflow-y-auto gap-4"style={{padding:'20px'}}> 
                                                
                                                {/* Added flex-col */}
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                        >
                                         Create Tax                           </h3>
                                    <hr className="my-4 border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                                    <div className="w-full flex flex-col gap-2">
                                      <label className="text-xs font-bold text-[#344767]">Item Type <span className="text-xs text-red-400">*</span></label>
                                     <div> <select
                                        name="item_type"
                                        onChange={handleAddTaxChange} 
                                        value={addTaxData.item_type}  
                                        style={{ paddingLeft: '12px', fontSize: '11px' }}
                                        className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300 test-gray-500"
                                      >
                                        <option disabled value="">Select Item Type</option>
                                        {itemTypes.map((item) => (
                                          <option key={item.id} value={item.id}>
                                            {item.name}
                                          </option>
                                        ))}
                                      </select>
                                      <p className="text-xs text-red-400">{errors.item_type}</p></div>
                                      </div>



                                    <div>
                                    <label 
                                      
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Tax type: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <select defaultValue=""
                                        className="select w-[100%] text-xs h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                        style={{paddingLeft:'12px'}}
                                        value={addTaxData.tax_type}
                                        name='tax_type'
                                        onChange={handleAddTaxChange}
                                      >
                                        <option value='' className=" text-gray-600">-----</option>
                                        <option value='default' className=" text-gray-600">Default tax </option>
                                        <option value='making' className=" text-gray-600">Making tax</option>
                                        <option value='stone' className=" text-gray-600">Stone tax</option>
                                      </select>
                                      <p className="text-xs text-red-400">{errors.tax_type}</p>
                                      
                                      </div>


                                    <div>
                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                       Tax Name: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] text-xs bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                        style={{paddingLeft:'12px'}}
                                        onChange={handleAddTaxChange}
                                        value={addTaxData.tax_name}
                                        name="tax_name"
                                      />
                                      <p className="text-xs text-red-400">{errors.tax_name}</p>
                                      
                                    </div>

                                      <div className="w-full flex flex-col gap-2">
                                        <label className="text-xs font-bold text-[#344767]">Branch <span className="text-xs text-red-400">*</span></label>
                                        <select
                                          name="branch"
                                          onChange={handleAddTaxChange}
                                          value={addTaxData.branch}
                                          style={{ paddingLeft: '12px', fontSize: '11px' }}
                                          className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
                                        >
                                          <option disabled value="">Select Branch</option>
                                          {branches.map((branch) => (
                                            <option key={branch.id} value={branch.id}>
                                              {branch.name}
                                            </option>
                                          ))}
                                        </select>
                                        <p className="text-xs text-red-400">{errors.branch}</p>
                                      </div>

                                      <div>
                                            <label 
                                            
                                            className="font-semibold text-xs text-[#344767] w-[100%]"
                                            >
                                            Input Tax: <span className="text-xs text-red-400">*</span>
                                            </label>

                                            <input 
                                                type="number" 
                                                name="input_tax"  
                                                placeholder="Type here" 
                                                className="input w-[100%] text-xs bg-white text-gray-500 rounded-lg border border-gray-300 focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                                style={{paddingLeft:'12px'}}
                                                value={addTaxData.input_tax}
                                                onChange={handleAddTaxChange}
                                                step="1"  
                                                />
                                                <p className="text-xs text-red-400">{errors.input_tax}</p>
                                        </div>

                                        <div>
                                            <label 
                                            
                                            className="font-semibold text-xs text-[#344767] w-[100%]"
                                            >
                                            Output Tax: <span className="text-xs text-red-400">*</span>
                                            </label>

                                            <input 
                                                type="number" 
                                                name="output_tax"  // Must match your formData key
                                                placeholder="Type here" 
                                                className="input w-[100%] bg-white text-xs text-gray-500 rounded-lg border border-gray-300 focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                               style={{paddingLeft:'12px'}}
                                                value={addTaxData.output_tax}
                                                onChange={handleAddTaxChange}
                                                step="1"  // For decimal values if needed
                                                />

                                                <p className="text-xs text-red-400">{errors.output_tax}</p>
                                            </div>
                                      </div> 
                                            {/* Button container positioned 10px above bottom */}
                                            <div className="flex flex-col sm:flex-row justify-end items-end gap-4 " 
                                                >
                                            
                                            <button
                                                type="button"
                                                className="btn w-[100px] border-none   rounded-lg text-white"
                                                style={{ backgroundColor: '#8392ab' }}
                                                onClick={handleCloseModal}
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                className="btn w-[100px] border-none rounded-lg text-white"
                                                style={{ backgroundColor: '#5E72e4'}}
                                                onClick={handleSubmitTax}
                                            >
                                                Submit
                                            </button>
                                            </div>
                                        </div>
                                        </div>
                                )}      
      
      
                      {editModal &&  (
                                <div className="fixed inset-0 text-gray-500 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md  w-[90vw] max-w-[500px] h-[90vh] max-h-[650px] flex flex-col overflow-y-auto gap-4"style={{padding:'20px'}}> 
                                                
                                                {/* Added flex-col */}
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                        >
                                         Create Tax                           </h3>
                                    <hr className="my-4 border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                                      <div className="w-full flex flex-col gap-2">
                                        <label className="text-xs font-bold text-[#344767]">Item Type<span className="text-xs text-red-400">*</span></label>
                                        <select
                                          name="item_type"
                                          onChange={handleEditTaxChange}  
                                          value={editingTax?.item_type || ''}

                                          style={{ paddingLeft: '12px', fontSize: '11px' }}
                                          className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
                                        >
                                          <option disabled value="">Select Item Type</option>
                                          {itemTypes.map((item) => (
                                            <option key={item.id} value={item.id}>
                                              {item.name}
                                            </option>
                                          ))}
                                        </select>
                                        <p className="text-xs text-red-400">{editTaxErrors.item_type}</p>
                                    </div>


                                    
                                    <div>
                                    <label 
                                      
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                        Tax type: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <select defaultValue=""
                                        className="select w-[100%] text-xs h-[35px] bg-white border-gray-400 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                        style={{paddingLeft:'12px'}}
                                        value={editingTax?.tax_type || ''}

                                        onChange={handleEditTaxChange}
                                        name="tax_type"
                                      >
                                        <option value='' className=" text-gray-600">-----</option>
                                        <option value='default' className=" text-gray-600">Default tax </option>
                                        <option value='making' className=" text-gray-600">Making tax</option>
                                        <option value='stone' className=" text-gray-600">Stone tax</option>
                                      </select>
                                      <p className="text-xs text-red-400">{editTaxErrors.tax_type}</p>
                                      </div>

                                   <div>
                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                       Tax Name: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] text-xs bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                        style={{paddingLeft:'12px'}}
                                        value={editingTax?.tax_name|| ''}

                                        onChange={handleEditTaxChange}
                                        name="tax_name"
                                      />

                                      <p className="text-xs text-red-400">{editTaxErrors.tax_name}</p>
                                    </div>

                                      <div className="w-full flex flex-col gap-2">
                                        <label className="text-xs font-bold text-[#344767]">Branch  <span className="text-xs text-red-400">*</span>
                                        </label>
                                        <select
                                          name="branch"
                                          value={editingTax?.branch || ""}
                                          onChange={handleEditTaxChange}
                                          className="select select-bordered bg-white text-gray-500 select-sm w-full rounded-lg focus:outline-none border-gray-300"
                                          style={{ paddingLeft: '12px', fontSize: '11px' }}
                                        >
                                          <option value="">Select Branch</option>
                                          {branches.map((branch) => (
                                            <option key={branch.id} value={branch.id}>
                                              {branch.name}
                                            </option>
                                          ))}
                                        </select>
                                        <p className="text-xs text-red-400">{editTaxErrors.branch}</p>
                             
                                      </div>

                                          <div>
                                            <label 
                                            
                                            className="font-semibold text-xs text-[#344767] w-[100%]"
                                            >
                                            Input Tax: <span className="text-xs text-red-400">*</span>
                                            </label>

                                            <input 
                                                type="number" 
                                                name="input_tax"  // Must match your formData key
                                                placeholder="Type here" 
                                                className="input w-[100%] text-xs bg-white text-gray-500 rounded-lg border border-gray-300 focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                                style={{paddingLeft:'12px'}}
                                                value={editingTax?.input_tax || ''}

                                                onChange={handleEditTaxChange}
                                                step="1"  // For decimal values if needed
                                                />
                                              <p className="text-xs text-red-400">{editTaxErrors.input_tax}</p>
                                          </div>

                                        <div>
                                          <label 
                                            
                                            className="font-semibold text-xs text-[#344767] w-[100%]"
                                            >
                                            Output Tax: <span className="text-xs text-red-400">*</span>
                                            </label>

                                            <input 
                                                type="number" 
                                                name="output_tax"  // Must match your formData key
                                                placeholder="Type here" 
                                                className="input w-[100%] bg-white text-xs text-gray-500 rounded-lg border border-gray-300 focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                               style={{paddingLeft:'12px'}}
                                                value={editingTax?.output_tax || ''}

                                                onChange={handleEditTaxChange}
                                                step="1"  // For decimal values if needed
                                                />
                                                <p className="text-xs text-red-400">{editTaxErrors.output_tax}</p>
                                    </div>
                                            <label 
                                                
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Status:
                                            </label>
                                            <select defaultValue=""
                                                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                style={{paddingLeft:'12px'}}
                                                value={String(editTaxData.status)}
                                                onChange={handleEditTaxChange}
                                                name='status'
                                               
                                            >
                                                <option value="" className=" text-gray-600">Select </option>
                                                <option value={true} className=" text-gray-600"> Active</option>
                                                <option value={false} className=" text-gray-600"> InActive</option>
                                            </select>
            
                                            </div> 
                                            {/* Button container positioned 10px above bottom */}
                                            <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                                >
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px]  rounded-lg text-white border-none"
                                                style={{ backgroundColor:'#8392ab' }}
                                                onClick={handleEditCloseModal}
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#5E72E4' }}
                                                onClick={handleEditSubmitTax}
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
     
     export default SettingsTax;