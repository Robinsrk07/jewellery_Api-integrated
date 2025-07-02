import { useEffect, useState } from "react";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import { useSelector } from "react-redux";
import CityModel from "../../../models/CityModel";
import CountryModel from "../../../models/countryModel";
import { toast } from "react-toastify";
const City=()=>{
   
                    const [items, setItems] = useState(10);
                    const [modal, setModal] = useState(false)   
                    const [editModal,setEditModal]= useState(false)
                    const auth= useSelector((state) => state.auth);
                    const { login_id ,can_manage_user_types,} = auth;    
                    const[limit,setLimit]=useState(10);  
                    const[page,setPage]=useState(1);  
                    const[search,setSearch]=useState('');
                    const[status,setStatus]=useState();
                    const[country,setCountryData]=useState([])
                    const [isSubmitting, setIsSubmitting] = useState(false);

                    const user_id = login_id;
                    const user_types = Object.keys(can_manage_user_types).join(','); 
                    const [city,setCity]= useState([])
                    const [data,setData] =useState({
                      name:'',
                      code:'',
                      country:''
                    })
                    const[editData,setEditData]= useState([])
                     console.log(editData)
                    

              

                const getIdOfCountry = (countryName) => {
                    const countryObj = country.find((c) => c.name === countryName);
                    return countryObj ? countryObj.id : null;
                  };

                 if (data.country) {
                    const countryId = getIdOfCountry(data.country);
                    console.log("Country ID:", countryId);
                  }

               const getCountryOfId = (couontryCode)=>{
                    const counrtyObj = country.find((c)=>c.id == couontryCode)
                    return counrtyObj ? counrtyObj.name :null
               }

                const handleSubmit = async (e) => {
                  e.preventDefault();

                  const submitData = {
                    name: data.name,
                    code: data.code,
                    country: getIdOfCountry(data.country),
                  };

                  try {
                    const response = await CityModel.CreateCity(submitData); 
                    toast.success("City created successfully!");
                    // Optionally reset form
                    setData({ name: '', code: '', country: '' });
                    FetchCountry()
                    handleCloseModal(); // Close modal after success
                  } catch (error) {
                    toast.error("Failed to create city. Please try again.");
                  }
                };
                
                 const handleEditSubmit = async () => {
                  
                  setIsSubmitting(true);
                  try {
                    const response = await CityModel.EditCity(
                      
                      {
                        code: editData.code,
                        name: editData.name,
                        status: editData.status
                      },editData.id
                    );
                    if (response.status === 200) {
                      FetchCountry();
                      toast.success('City updated successfully!');

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
                 const handleDeleteCity = async (id) => {
                             
                              if (!id) return;
                              
                              try {
                                await CityModel.DeleteCity(id);
                                
                              
                                setCity(prevData => prevData.filter(city => city.id !== id));
                                
                                
                                document.getElementById('my_modal_8').close();
                                
                                
                                alert('Country deleted successfully');
                              } catch (error) {
                                console.error("Error deleting country:", error);
                                alert('Failed to delete country');
                              }
                     };




                      const handleChange = (e) => {
                        const { name, value } = e.target;
                        setData(prev => ({ ...prev, [name]: value }));
                      };
                      const fetchCityData =async()=>{
                      try{
                            const response = await CityModel.getCities(
                            user_id,          
                            user_types,          
                            limit,
                            page,
                            search,
                            status  )

                            if(response){
                              setCity(response?.data?.data)
                            }
                      }catch(error){
                         console.error(error)
                      }
                      }
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

                          if (response.data && response?.data?.data) {
                            setCountryData(response?.data?.data);
                          }
                        } catch (error) {
                          console.error("Error fetching country data:", error);
                        }
                      };
                    
  
           const countryMap = new Map(country.map(c => [c.id, c.name]));


             const handleCloseModal = () => {
                setModal(false);
                setEditModal(false)
               };
              const handleEditCloseModal =()=>{
                setEditModal(false)
              }
                  
           useEffect(()=>{
               FetchCountry()
               },[])

           useEffect(()=>{
                fetchCityData()
           },[country])

                  
                  
                  
                    return (
                      
                  <>
                  <CustomScrollbar/>

                    <div className="bg-white w-full
                                  max-w-[95vw] 
                                  xl:max-w-[90vw] 
                                  2xl:max-w-[85vw] 
                                  h-auto max-h-[70vh] 
                                  rounded-xl px-4 md:px-8 lg:px-12
                                  mx-auto overflow-auto  custom-scrollbar"
                              style={{ fontFamily: 'Open Sans',overflow:'auto'}}
                                >
                   <CreateButton
                      buttoncontent="+ New City"
                      onClick={() => setModal(true)}  // This will now work!
                   />                 
                      <ItemsPerPageSelector items={items} setItems={setItems} />
                  
                        
                            
                  <table className="w-full text-sm text-left text-gray-500 border-collapse overflow-x-auto"
                  style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '800px' }}>
                                <thead className="text-xs text-gray-400 uppercase bg-white">
                                  <tr>
                                    <th style={{ width: '100px', paddingLeft: '20px', paddingTop: '12px', paddingBottom: '12px' }}>SL NO</th>
                                    <th style={{ width: '100px', padding: '12px 24px' }}>CODE</th>
                                    <th style={{ width: '120px', padding: '12px 24px' }}>NAME</th>
                                    <th style={{ width: '150px', padding: '12px 24px' }}>COUNTRY</th>
                                    <th style={{ width: '100px', padding: '12px 24px' }}>STATUS</th>
                                    <th style={{ width: '210px', padding: '12px 24px' }}>ACTION</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {city
                                  .filter(location => countryMap.has(location.country))
                                  .map((location,index) => (
                                    <tr key={location.id} className="bg-white hover:bg-gray-50 h-[30px] text-gray-400" >
                                      <td className="border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }} >
                                        {index+1}
                                      </td>
                                      <td className="border-b border-gray-200 text-xs"style={{ paddingLeft: '30px',paddingBottom:'30px' }} >{location.code}</td>
                                      <td className="border-b border-gray-200 text-xs"style={{ paddingLeft: '30px',paddingBottom:'30px'}} >{location.name}</td>
                                      <td className="border-b border-gray-200 text-xs" style={{ paddingLeft: '30px',paddingBottom:'30px' }}> {countryMap.get(location.country)}</td>
                                       <td className="py-4 border-b border-gray-200 text-xs" >
                               {location.status ? (
                                <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" >
                                  Active
                                </span>
                              ) : (
                                <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded">
                                  INACTIVE
                                </span>
                              )}
                            </td>                                     
                             <td className="border-b border-gray-200 text-xs" >
                                        <div className="flex gap-2.5 items-center">
                                          <EditButton
                                          onClick={()=>{setEditModal(true);setEditData(location)}}
                                         />
                                            <DeleteButton 
                                           buttonText="Delete " 
                                           modalId="my_modal_8" 
                                           item={"city"}
                                           onConfirmDelete={() => handleDeleteCity(location.id)}
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
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[500px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                         Create City                     </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-4"> {/* Added flex-grow */}
                                   
                                      
                                      <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Code:
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        value={data.code}
                                        onChange={handleChange}
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-300 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        name="code"
                                      />

                                       <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name:
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here"
                                        value={data.name} 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-300 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        onChange={handleChange}
                                        name="name"
                                      />
                                      
                                      

                                   
                            
                                           
                                            <label 
      
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Country:
                                            </label>
                                            <select defaultValue=""
                                                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-400 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                style={{paddingLeft:'12px'}}
                                                
                                                name='country'
                                                 onChange={handleChange}

                                            >
                                                <option className=" text-gray-600"disabled>Select Counrty </option>
                                               {country.filter((con)=>con.status ==true).map((con)=><option value={con.name} className=" text-gray-600">{con.name}</option>)} 
                                               
                                            </select>
                                           
                                            </div> 
                                            {/* Button container positioned 10px above bottom */}
                                            <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                                >
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#8392ab' }}
                                                onClick={ handleSubmit}
                                            >
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px]  rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#5E72e4' }}
                                                onClick={handleCloseModal}
                                            >
                                                Close
                                            </button>
                                            </div>
                                        </div>
                                        </div>
                         )}
       
                       {editModal &&(
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                  <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[500px] flex flex-col gap-4 overflow-y-auto" style={{padding:'20px'}}>                                                 
                                    <h3 className="font-bold text-[22px] text-[#344767] "
                                       >
                                       Edit City                     </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-4"> {/* Added flex-grow */}
                                   
                                      
                                      <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Code:
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-300 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                         value={editData?.code || ''}
                                        onChange={(e) => {
                                          setEditData({...editData, code: e.target.value});
                                          
                                        }}
                                        name="code"
                                      />

                                       <label 
                                       
                                        className="font-semibold text-xs text-[#344767] w-[80%]"
                                      >
                                       Name:
                                      </label>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-300 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                       value={editData?.name || ''}
                                        onChange={(e) => {
                                          setEditData({...editData, name: e.target.value});
                                          
                                        }}
                                        name="name"
                                      />
                                      
                                      

                                   
                            
                                           
                                            <label 
                                                
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Country:
                                            </label>
                                            <input type="text" 
                                                placeholder="Type here" 
                                                className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-300 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                                style={{paddingLeft:'12px'}}
                                                //onChange={(e)=>handleChange(e)}
                                                name="name"
                                                value={getCountryOfId(editData.country)}
                                              />
                                                
                                            <label 
                                                
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Status:
                                            </label>
                                            <select
                                          className={`select w-[100%] h-[35px] bg-white border  focus:outline-none rounded-lg focus:border-b-2 focus:border-blue-500`}
                                          style={{paddingLeft:'12px'}}
                                          value={editData?.status ? 'Active' : 'InActive'}
                                          onChange={(e) => {
                                            setEditData({
                                              ...editData, 
                                              status: e.target.value === 'Active'
                                            });
                                          
                                          }}
                                        >
                                          <option value="Active">Active</option>
                                          <option value="InActive">InActive</option>
                                        </select>
            
                                            </div> 
                                            {/* Button container positioned 10px above bottom */}
                                            <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                                >
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#8392ab' }}
                                                onClick={handleEditSubmit}
                                            >
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px]  rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#5E72e4' }}
                                                onClick={handleEditCloseModal}
                                            >
                                                Close
                                            </button>
                                            </div>
                                        </div>
                                        </div>)}

                     </>)
}

export default City