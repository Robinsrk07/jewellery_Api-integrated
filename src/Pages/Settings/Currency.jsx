
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CurrencyModel from "../../models/currencyModel";
import BranchModel from "../../models/branchModel";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import TableSkelton from "../../components/tableSkelton";
     
const  Currency = () => {
     
          
                        const [isHovered, setIsHovered] = useState(false);
                        const [modal, setModal] = useState(false);
                        const [editModal, setEditModal] = useState(false);
                        const [totalPages, setTotalPages] = useState(1);
                        const [isLoading, setIsLoading] = useState(true);

                        const [currencyData, setCurrencyData] = useState([]);

                        const [limit, setLimit] = useState(10);
                        const [page, setPage] = useState(1);
                        const [status, setStatus] = useState('');
                        const [search, setSearch] = useState('');
                        const [isSubmitting, setIsSubmitting] = useState(false);

                        const [errors, setErrors] = useState({
                          code: '',
                        name: '',
                        exchange_rate: '',
                        symbol: '',
                        branch: '',
                        status: '',
                        });
                        const [editErrors, setEditErrors] = useState({});

                        const [addCurrencyData, setAddCurrencyData] = useState({
                        code: '',
                        name: '',
                        exchange_rate: '',
                        symbol: '',
                        branch: '',
                        status: '',
                      });


                        const [editingCurrency, setEditingCurrency] = useState(null);

                        const auth = useSelector((state) => state.auth);
                        const { login_id, can_manage_user_types } = auth;
                        const user_id = login_id;
                        const user_types = Object.keys(can_manage_user_types || {}).join(',');

                         const fetchCurrencies = async () => {
                          setIsLoading(true);
                          try {
                            const response = await CurrencyModel.getCurrency(
                              user_id,
                              user_types,
                              limit,
                              page,
                              search,
                              status
                            );

                            if (response?.data?.data) {
                              setCurrencyData(response.data.data);
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
                          fetchCurrencies();
                        }, [limit, page, search, status]);
                                      
                          
                        

                        const [branches, setBranches] = useState([]);



                   


                      const fetchBranches = async () => {
                        try {
                          const response = await BranchModel.getBranches(user_id, user_types);
                          if (response?.data?.data) {
                            setBranches(response.data.data);
                          } else {
                            toast.error("Failed to load branches");
                          }
                        } catch (error) {
                          console.error("Error fetching branches:", error);
                          toast.error("Error fetching branches");
                        }
                      };


                                            const getBranchName = (id) => {
                                              const branch = branches.find((b) => b.id === id);
                                              return branch ? branch.name : "N/A";
                                            };


                      const validateCurrency = () => {
                        const newErrors = {};

                        if (!addCurrencyData.code.trim()) {
                          newErrors.code = 'Please enter currency code';
                        }

                        if (!addCurrencyData.name.trim()) {
                          newErrors.name = 'Please enter currency name';
                        }

                        if (!addCurrencyData.exchange_rate || isNaN(addCurrencyData.exchange_rate)) {
                          newErrors.exchange_rate = 'Please enter valid exchange rate';
                        }

                        if (!addCurrencyData.symbol.trim()) {
                          newErrors.symbol = 'Please enter symbol';
                        }

                        if (!addCurrencyData.branch) {
                          newErrors.branch = 'Please select branch';
                        }

                       

                        return newErrors;
                      };



                      const handleAddCurrencyChange = (e) => {
                        const { name, value } = e.target;
                        setAddCurrencyData((prev) => ({
                          ...prev,
                          [name]: name === 'status' ? value === 'true' : value,
                        }));
                      };


                      const handleSubmitCurrency = async () => {
                        const validationErrors = validateCurrency();

                        if (Object.keys(validationErrors).length > 0) {
                          setErrors(validationErrors);
                          return;
                        }

                        const payload = {
                          code: addCurrencyData.code.trim(),
                          name: addCurrencyData.name.trim(),
                          exchange_rate: parseFloat(addCurrencyData.exchange_rate),
                          symbol: addCurrencyData.symbol.trim(),
                          branch: parseInt(addCurrencyData.branch),
                          status: addCurrencyData.status === true || addCurrencyData.status === 'true',
                        };

                        console.log("Currency Payload being sent:", payload);

                        try {
                          const response = await CurrencyModel.createCurrency(payload);
                          console.log("Create Currency response:", response);

                          if (response.status === 201 || response.status === 200) {
                            fetchCurrencies();
                            handleCloseModal();
                            toast.success('Currency created successfully!');
                          }
                        } catch (error) {
                          console.error("Create currency error:", error);
                          toast.error('Failed to create currency!');
                          handleCloseModal();

                          if (error.response?.data?.errors) {
                            setErrors((prev) => ({
                              ...prev,
                              ...error.response.data.errors,
                            }));
                          }
                        }
                      };



                        
  
 const validateEditCurrency = () => {
  let valid = true;
  const errors = {};

  if (!editingCurrency?.code?.trim()) {
    errors.code = 'Currency code is required';
    valid = false;
  }

  if (!editingCurrency?.name?.trim()) {
    errors.name = 'Currency name is required';
    valid = false;
  }

  if (!editingCurrency?.exchange_rate?.toString().trim() || isNaN(editingCurrency.exchange_rate)) {
    errors.exchange_rate = 'Valid exchange rate is required';
    valid = false;
  }

  if (!editingCurrency?.symbol?.trim()) {
    errors.symbol = 'Currency symbol is required';
    valid = false;
  }

  if (!editingCurrency?.branch) {
    errors.branch = 'Please select a branch';
    valid = false;
  }
  setEditErrors(errors);
  return valid;
};


const handleEditClickCurrency = (currencyObj) => {
  if (!currencyObj || typeof currencyObj !== 'object' || !currencyObj.id) {
    toast.error("Invalid currency selected.");
    return;
  }

  setEditingCurrency({
    id: currencyObj.id,
    code: currencyObj.code,
    name: currencyObj.name,
    exchange_rate: currencyObj.exchange_rate,
    symbol: currencyObj.symbol,
    branch: currencyObj.branch?.toString(),
    status: currencyObj.status?.toString(),
  });

  setEditModal(true);
};


const handleEditCurrencyChange = (e) => {
  const { name, value } = e.target;

  setEditingCurrency((prev) => ({
    ...prev,
    [name]: name === 'status' ? value === 'true' : value,
  }));
};


const handleEditSubmitCurrency = async () => {
  if (!editingCurrency?.id) {
    toast.error("Invalid currency selected for editing.");
    return;
  }

  if (!validateEditCurrency()) return;

  setIsSubmitting(true);

  const payload = {
    code: editingCurrency.code.trim(),
    name: editingCurrency.name.trim(),
    exchange_rate: parseFloat(editingCurrency.exchange_rate),
    symbol: editingCurrency.symbol.trim(),
    branch: parseInt(editingCurrency.branch),
    status: editingCurrency.status === true || editingCurrency.status === 'true',
  };

  try {
    const response = await CurrencyModel.updateCurrency(editingCurrency.id, payload);

    if (response.status === 200 || response.status === 201) {
      fetchCurrencies();
      toast.success('Currency updated successfully!');
      setEditModal(false);
    }
  } catch (error) {
    console.error("Update currency error:", error);
    toast.error('Failed to update currency!');
    if (error.response?.data?.errors) {
      setEditErrors((prev) => ({
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
                                                      setEditingCurrency(null);
                                                      setEditErrors({
                                                        code: '',
                                                        name: '',
                                                        exchange_rate: '',
                                                        symbol: '',
                                                        branch: '',
                                                        status: '',
                                                      });
                                                    };



const handleDeleteCurrency = async (id) => {
  if (!id) return;

  try {
    await CurrencyModel.deleteCurrency(id);

    setCurrencyData((prevData) => prevData.filter((item) => item.id !== id));

    if (modal && typeof modal.close === 'function') {
      modal.close();
    }

    toast.success('Currency deleted successfully');
  } catch (error) {
    console.error("Error deleting Currency:", error);
    toast.error('Failed to delete Currency');
  }
};

                  
                   // Handle close modal
                   const handleCloseModal = () => {
                    setErrors({
                        code: '',
                        name: '',
                        exchange_rate: '',
                        symbol: '',
                        branch: '',
                        status: '',
                    })
                     setModal(false);
                     setEditModal(false)
                   };
              useEffect(() => {
                        fetchBranches();
                      }, []);       
                 
                 
                 
                 
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
                              width: 'fit-content', 
                              minWidth: '100%' 
                              }}
                          >
                              <CreateButton
                                buttoncontent="+ New Currency"
                                onClick={() => setModal(true)}  
                              />  
                          </div>
                          <ItemsPerPageSelector items={limit} setItems={setLimit} />
                 
                      
                 
                       
                 
                       <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1100px]  " style={{ borderSpacing: '0 12px', borderCollapse: 'separate', }}>
                         <thead className="text-xs text-gray-400 uppercase bg-white">
                           <tr>
                             <th className="px-6 py-3 w-[100px]" style={{width:'90px',paddingLeft:'40px'}} >SL NO</th>
                             <th className="px-6 py-3 w-[80px]"  >CODE</th>
                             <th className="px-6 py-3 w-[120px]"  >NAME </th>
                             <th className="px-6 py-3 w-[120px]" >EXCHANGE RATE </th>
                             <th className="px-6 py-3 w-[80px]"  >SYMBOL</th>
                             <th className="px-6 py-3 w-[100px]"  >BRANCH</th>
                             <th className="px-6 py-3 w-[100px]"  >STATUS</th>
                             <th className="px-6 py-3 w-[100px]"  >ACTION</th>
                           </tr>
                         </thead>
                         <tbody> 
                          
                          {isLoading ? (
                            <TableSkelton />
                        ) : currencyData.length === 0 ? (
                            <tr>
                            <td className="text-center py-4 text-gray-500 text-sm" colSpan="5">
                                No data available
                            </td>
                            </tr>
                        ) : (
                          currencyData.map((currency, index) => (
                              <tr key={currency.id} className="bg-white hover:bg-gray-50 h-14 text-gray-400">
                                <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '50px' }}>
                                  {index + 1}
                                </td>

                                <td className="px-6 py-5 border-b border-gray-200 text-xs">{currency.code}</td>

                                <td className="px-6 py-5 border-b border-gray-200 text-xs">{currency.name}</td>

                                <td className="px-6 py-5 border-b border-gray-200 text-xs">{currency.exchange_rate || '1.0000'}</td>

                                <td className="px-6 py-5 border-b border-gray-200 text-xs ">{currency.symbol}</td>
                                <td className="px-6 py-5 border-b border-gray-200 text-xs ">{getBranchName(currency.branch)}</td>

                                <td className="px-6 py-5 border-b border-gray-200 text-xs">
                                  {currency.status ? (
                                    <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                      ACTIVE
                                    </span>
                                  ) : (
                                    <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                      INACTIVE
                                    </span>
                                  )}
                                </td>

                                <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <EditButton onClick={() => handleEditClickCurrency(currency)} />
                                    <DeleteButton
                                      buttonText="Delete "
                                      modalId={`delete_currency_modal_${currency.id}`}
                                      onConfirmDelete={() => handleDeleteCurrency(currency.id)}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )) )
                          }
                          </tbody>

                       </table>
                       
                 
                       {/* Pagination */}
                         <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                       
                       {/* Modal */}
      
      
                      </div>
      
                      {modal && (
                                <div className="fixed text-gray-400 inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md  w-[90vw] max-w-[500px] h-[90vh] max-h-[600px] flex flex-col overflow-y-auto gap-4" style={{padding:"20px"}}> 
                                                
                                                {/* Added flex-col */}
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                        >
                                         Create Currency                           </h3>
                                    <hr className="my-4 border-gray-300" />
      
                                 <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                                    <div>
                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                       code:<span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%]  text-xs border-gray-300 text-gray-500 bg-white rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                        style={{paddingLeft:'12px'}}
                                        value={addCurrencyData.code}
                                        onChange={handleAddCurrencyChange}
                                        name="code"
                                      />
                                      <p className="text-xs text-red-400">{errors.code}</p>
                                    </div>

                                    <div>
                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                       Name: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-full text-xs border-gray-300 text-gray-500 bg-white rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                        style={{paddingLeft:'12px'}}
                                        value={addCurrencyData.name}
                                        onChange={handleAddCurrencyChange}
                                        name="name"
                                      />
                                       <p className="text-xs text-red-400">{errors.name}</p>
                                    </div>  


                                    <div>
                                            <label 
                                            
                                            className="font-semibold text-xs text-[#344767] w-[100%]"
                                            >
                                            Exchange rate: <span className="text-xs text-red-400">*</span>
                                            </label>

                                            <input 
                                                type="number" 
                                                name="exchange_rate"  
                                                placeholder="Type here" 
                                                className="input border-gray-300 text-xs bg-white w-full rounded-lg border text-gray-500 border-gray-300 focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                                 style={{paddingLeft:'12px'}}

                                                value={addCurrencyData.exchange_rate}
                                                onChange={handleAddCurrencyChange}
                                                
                                                step="1"  
                                                />
                                                <p className="text-xs text-red-400">{errors.exchange_rate}</p>
                                    </div>

                                    <div>

                                        <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                      Symbol: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-full text-xs border-gray-300 text-gray-500 bg-white rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                        style={{paddingLeft:'12px'}}
                                       value={addCurrencyData.symbol}
                                       onChange={handleAddCurrencyChange}
                                        name="symbol"
                                      />
                                      <p className="text-xs text-red-400">{errors.symbol}</p>
                                    </div>

                                
                                      <div className="w-full flex flex-col gap-2">
                                        <label className="text-xs font-bold text-[#344767]">Branch <span className="text-xs text-red-400">*</span></label>
                                        <select
                                          name="branch"
                                          value={addCurrencyData.branch}
                                          onChange={handleAddCurrencyChange}
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
                                       <p className="text-xs text-red-400">{errors.branch}</p>
                                    
                                      </div>

                                           
            
                                            </div> 
                                            {/* Button container positioned 10px above bottom */}
                                            <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                               >
                                                <button
                                                type="button"
                                                className="btn w-[100px] h-[33px] border-none  rounded-lg text-white"
                                                style={{ backgroundColor: '#8392ab' }}
                                                onClick={handleCloseModal}
                                            >
                                                Close
                                            </button>
                                            <button
                                                type="button"
                                                className="btn border-none w-[100px] h-[33px] rounded-lg text-white"
                                                style={{ backgroundColor:'#5E72e4' }}
                                                onClick={handleSubmitCurrency}
                                            >
                                                Submit
                                            </button>
                                            
                                            </div>
                                        </div>
                                        </div>
                                )}      
      
      
                      {editModal &&  (
                                <div className="fixed text-gray-400 inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md  w-[90vw] max-w-[500px] h-[90vh] max-h-[600px] flex flex-col overflow-y-auto gap-4" style={{padding:"20px"}}> 
                                                
                                                {/* Added flex-col */}
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                        >
                                        Edit Currency                           </h3>
                                    <hr className="my-4 border-gray-300" />
      
                                    <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                                     <div>
                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                       code:<span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%]  text-xs border-gray-300 text-gray-500 bg-white rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                        style={{paddingLeft:'12px'}}
                                        value={editingCurrency.code || ''}
                                        onChange={handleEditCurrencyChange}
                                        name="code"
                                      />
                                       <p className="text-xs text-red-400">{editErrors.code}</p>
                                    </div>

                                    <div>
                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                       Name: <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-full text-xs border-gray-300 text-gray-500 bg-white rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                        style={{paddingLeft:'12px'}}
                                        value={editingCurrency.name || ''}
                                        name="name"
                                        onChange={handleEditCurrencyChange}
                                      />
                                      <p className="text-xs text-red-400">{editErrors.name}</p>
                                    </div>


                                     <div>
                                            <label 
                                            
                                            className="font-semibold text-xs text-[#344767] w-[100%]"
                                            >
                                            Exchange rate:<span className="text-xs text-red-400">*</span>
                                            </label>

                                            <input 
                                                type="number" 
                                                name="exchange_rate"  // Must match your formData key
                                                placeholder="Type here" 
                                                className="input text-gray-500 text-xs bg-white w-full rounded-lg border border-gray-300 focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                                 style={{paddingLeft:'12px'}}

                                                value={editingCurrency.exchange_rate || ''}
                                                onChange={handleEditCurrencyChange}
                                                step="1"  // For decimal values if needed
                                                />
                                                <p className="text-xs text-red-400">{editErrors.exchange_rate}</p>
                                      </div> 

                                      <div>
                                        <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                      >
                                      Symbol:  <span className="text-xs text-red-400">*</span>
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-full text-xs tex-gray-500 border-gray-300 bg-white rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500"
                                        style={{paddingLeft:'12px'}}
                                        value={editingCurrency.symbol || ''}
                                        name="symbol"
                                        onChange={handleEditCurrencyChange}
                                        
                                      />
                                      <p className="text-xs text-red-400">{editErrors.symbol}</p>
                                    </div>
                                      


                                      <div className="w-full flex flex-col gap-2">
                                        <label className="text-xs font-bold text-[#344767]">Branch  <span className="text-xs text-red-400">*</span>
                                        </label>
                                        <select
                                          name="branch"
                                          value={editingCurrency?.branch || ""}
                                          onChange={handleEditCurrencyChange}
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
                                        {editErrors.branch && (
                                          <span className="text-red-500 text-xs mt-1">{editErrors.branch}</span>
                                        )}
                                      </div>

                                           
                                           <label 
                                                
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Status:
                                            </label>
                                            <select defaultValue=""
                                                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                style={{paddingLeft:'12px'}}
                                                value={String(editingCurrency.status)}
                                                onChange={handleEditCurrencyChange}
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
                                                onClick={handleEditSubmitCurrency}
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
     
     export default Currency;