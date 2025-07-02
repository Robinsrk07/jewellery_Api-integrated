import { useEffect, useState } from "react";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import  CountryModel from '../../../models/countryModel';
import { useSelector } from "react-redux";
import SuccessToast from "../../../components/SuccessToast";
import { toast } from 'react-toastify';






const Country =()=>{
   
                     const [items, setItems] = useState(10);
                     const [modal, setModal] = useState(false)   
                     const [editModal,setEditModal]= useState(false)
                     const [countryData, setCountryData] = useState([]);
                     const auth= useSelector((state) => state.auth);
                     const { login_id ,can_manage_user_types,} = auth;    
                     const[limit,setLimit]=useState(10);  
                     const[page,setPage]=useState(1);  
                     const[search,setSearch]=useState('');
                     const[status,setStatus]=useState('');
                     const [isSubmitting, setIsSubmitting] = useState(false);
                     const [editingCountry, setEditingCountry] = useState(null);
                     const [addCountryData, setaddCountryData] = useState({
                      code: '',
                      name: ''
                      });
                      const [errors, setErrors] = useState({
                          code: '',
                          name: '',
                          status: ''
                        });
                     const user_id = login_id;
                     const user_types = Object.keys(can_manage_user_types).join(','); 
                   
                        console.log(countryData)
                      const FetchCountry = async () => {
                        try {
                          const response = await CountryModel.getCountries(
                            user_id,          
                            user_types,          
                            limit,
                            page,
                            search,
                            status               
                          );

                          if (response.data && response.data.data) {
                            setCountryData(response.data.data);
                          }
                        } catch (error) {
                          console.error("Error fetching country data:", error);
                        }
                      };

                  const handleChange = (e) => {
                        const { name, value } = e.target;
                        setaddCountryData(prev => ({ ...prev, [name]: value }));
                      };

                 const handleSubmit = async () => {
                    // Validate before submission
                    if (!validateForm()) {
                      return;
                    }

                    const formData = new FormData();
                    formData.append('code', addCountryData.code);
                    formData.append('name', addCountryData.name);

                    try {
                      const response = await CountryModel.CreateCountry(formData);
                      console.log("Update response:", response);  
                      if (response.status === 201) {
                        FetchCountry(); // Refresh the list
                        handleCloseModal();    
                        toast.success('Country created successfully!');

                      }
                                        

                    } catch (error) {

                       toast.error('Failed to create country!');
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
                    const response = await CountryModel.updateCountry(
                      editingCountry.id,
                      {
                        code: editingCountry.code,
                        name: editingCountry.name,
                        status: editingCountry.status
                      }
                    );
                    if (response.status === 200) {
                      FetchCountry();
                      toast.success('Country updated successfully!');

                      handleEditCloseModal();
                    }
                  } catch (error) {
                      console.log(error);
                      
                       toast.error('Failed to update country!');
                    if (error.response?.data?.errors) {
                      setErrors(prev => ({
                        ...prev,
                        ...error.response.data.errors
                      }));
                    }
                  } finally {
                    setIsSubmitting(false);
                  }
                };

              const validateForm = () => {
              let valid = true;
              const newErrors = { code: '', name: '' };

              // Updated country code validation
              if (!addCountryData.code) {
                newErrors.code = 'Country code is required';
                valid = false;
              } else if (!/^(\+?\d{1,3}|[A-Za-z]{2,3})$/.test(addCountryData.code)) {
                newErrors.code = 'Must be 2-3 letters or valid country code (e.g. +34, +1)';
                valid = false;
              }

              // Name validation remains same
              if (!addCountryData.name) {
                newErrors.name = 'Country name is required';
                valid = false;
              } else if (addCountryData.name.length < 2) {
                newErrors.name = 'Must be at least 2 characters';
                valid = false;
              }

              setErrors(newErrors);
              return valid;
            };

            const validateEditForm = () => {
              let valid = true;
              const newErrors = { code: '', name: '', status: '' };

              // Updated country code validation
              if (!editingCountry?.code) {
                newErrors.code = 'Country code is required';
                valid = false;
              } else if (!/^(\+?\d{1,3}|[A-Za-z]{2,3})$/.test(editingCountry.code)) {
                newErrors.code = 'Must be 2-3 letters or valid country code (e.g. +34, +1)';
                valid = false;
              }

              if (!editingCountry?.name) {
                newErrors.name = 'Country name is required';
                valid = false;
              } else if (editingCountry.name.length < 2) {
                newErrors.name = 'Must be at least 2 characters';
                valid = false;
              }

              if (editingCountry?.status === undefined) {
                newErrors.status = 'Status is required';
                valid = false;
              }

              setErrors(newErrors);
              return valid;
            };

            const handleDeleteCountry = async (id) => {
              console.log("Deleting country with ID:", id);
              if (!id) return;
              
              try {
                await CountryModel.deleteCountry(id);
                
              
                setCountryData(prevData => prevData.filter(country => country.id !== id));
                
                
                document.getElementById('my_modal_8').close();
                
                
                alert('Country deleted successfully');
              } catch (error) {
                console.error("Error deleting country:", error);
                alert('Failed to delete country');
              }
            };
                   
                    // Handle close modal
                   const handleCloseModal = () => {
                      setaddCountryData({
                        code: '',
                        name: '',
                        
                      });
                      setModal(false);
                    };

                  
                    const handleEditCloseModal = () => {
                      setEditModal(false)
                    };
                  
                  
                  useEffect(() => {
                    FetchCountry(); 
                  },[])
                  
                  
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
                  buttoncontent="+ New Country"
                  onClick={() => setModal(true)}  // This will now work!
                 />                 
                 <ItemsPerPageSelector items={items} setItems={setItems} />
                  
                        
                     <table className="w-full text-sm text-left text-gray-500 border-collapse overflow-x-auto"
                        style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '800px' }}>
                      <thead className="text-xs text-gray-400 uppercase bg-white">
                        <tr>
                          <th  style={{ width: '80px', paddingLeft: '20px' }}>SL NO</th>
                          <th  style={{ width: '100px' }}>CODE</th>
                          <th  style={{ width: '130px' }}>NAME</th>
                          <th  style={{ width: '130px' }}>STATUS</th>
                          <th  style={{ width: '130px' }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {countryData.map((country,index) => (
                          console.log(country),
                          <tr key={index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                            <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>
                              {index+1}
                            </td>
                            <td className="py-4 border-b border-gray-200 text-xs">{country.code}</td>
                            <td className="py-4 border-b border-gray-200 text-xs">{country.name}</td>
                            <td className="py-4 border-b border-gray-200 text-xs">
                              {country.status ? (
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
                                    setEditingCountry(country);  // Set the country to edit
                                    setEditModal(true);
                                  }}
                                />
                              <DeleteButton
                                buttonText="Delete"
                                modalId="my_modal_8"
                                onConfirmDelete={() => handleDeleteCountry(country.id)}
                              />

                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                                        
                  
                        <Pagination/>
                  
       
       

       
       
        
                       
      </div>
       
      {modal && (
                           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[400px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Create Country                     </h3>
                                    <hr className=" border-gray-300"/>
                                    <div className="flex flex-col flex-grow gap-4"> {/* Added flex-grow */}
                                      <div>
                                      <label      
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Code:
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="Type here"
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-300 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                        style={{ paddingLeft: '12px' }}
                                        name="code"
                                        value={addCountryData.code}
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
                                       Name:
                                      </label>
                                     <input
                                      type="text"
                                      placeholder="Type here"
                                      className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-300 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                      style={{ paddingLeft: '12px' }}
                                      name="name"
                                      value={addCountryData.name}
                                      onChange={handleChange}
                                    />
                                    {errors.name && (
                                              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                            )}
                                    
                                    </div>
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
    <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[500px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>
      <h3 className="font-bold text-[22px] text-[#344767]">
        Edit Country
      </h3>
      <hr className="border-gray-300"/>
      
      <div className="flex flex-col flex-grow gap-4">
        {/* Code Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[80%]">
            Code:
          </label>
          <input
            type="text"
            placeholder="Type here"
            className={`input w-[100%] rounded-lg focus:outline-none bg-white border ${
              errors.code ? 'border-red-500' : 'border-gray-300'
            } focus:border-b-2 focus:border-blue-500`}
            style={{paddingLeft:'12px'}}
            name="code"
          value={editingCountry?.code || ''}
            onChange={(e) => {
              setEditingCountry({...editingCountry, code: e.target.value});
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
            Name:
          </label>
          <input
            type="text"
            placeholder="Type here"
            className={`input w-[100%] rounded-lg focus:outline-none bg-white border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } focus:border-b-2 focus:border-blue-500`}
            style={{paddingLeft:'12px'}}
            name="name"
           value={editingCountry?.name || ''}
            onChange={(e) => {
              setEditingCountry({...editingCountry, name: e.target.value});
              if (errors.name) setErrors({...errors, name: ''});
            }}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Status Field */}
        <div>
          <label className="font-semibold text-xs text-[#344767] w-[80%]">
            Status:
          </label>
          <select
            className={`select w-[100%] h-[35px] bg-white border ${
              errors.status ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none rounded-lg focus:border-b-2 focus:border-blue-500`}
            style={{paddingLeft:'12px'}}
            value={editingCountry?.status ? 'Active' : 'InActive'}
            onChange={(e) => {
              setEditingCountry({
                ...editingCountry, 
                status: e.target.value === 'Active'
              });
              if (errors.status) setErrors({...errors, status: ''});
            }}
          >
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
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

export default Country