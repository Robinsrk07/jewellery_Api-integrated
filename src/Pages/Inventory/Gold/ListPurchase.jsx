import { useEffect, useState } from "react";
import { Link } from "react-router";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import PurchaseFixModel from "../../../models/PurchaseFixModel";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import TableSkelton from "../../../components/tableSkelton";
     
     const  ListPurchase = () => {
     
          
                   const [items, setItems] = useState(10); 
                  //  const validate = () => {
                  //    const newErrors = {};
                  //    if (!formData.gender.trim()) newErrors.gender = 'Please Enter Name';
                  //    if (!formData.phone.trim()) newErrors.phone = 'Please Enter Name';
                  //    if (!formData.name.trim()) newErrors.name = 'Please Enter Name';
                  //    if (!formData.address.trim()) newErrors.address = 'Please Enter Name';
                  //    if (!formData.description.trim()) newErrors.description = 'Enter the Description';
                  //    if (!formData.status.trim()) newErrors.status = 'Enter Status';
                  //    return newErrors;
                  //  }; 
                    const auth= useSelector((state) => state.auth);
                    const {login_type,login_id} =auth
                    const [limit, setLimit] = useState(10);
                    const [page, setPage] = useState(1);
                    const [search, setSearch] = useState('');
                    const [status, setStatus] = useState('');  
                     const [totalPages, setTotalPages] = useState(1);
                     const [isLoading, setIsLoading] = useState(true); 
                    const [purchaseData,setPurchaseData] =useState([])
                  const [utils, setUtils] = useState({
                    uom: [],
                    terms_of_payment: [],
                    supplier: [],
                    
                  });
                   const[data,setData] =useState({
                    supplier:''
                   })
                    const supplier_id = data.supplier
                   console.log(data);
                   
                   
                  const findIdByName = (key, name) => {
                      const data = utils[key] || [];
                      const item = data.find(item => item.name === name);
                      console.log(`Finding ID for ${key}: "${name}" in:`, data);
                      console.log(`Found item:`, item);
                      return item ? item.id : null;
                    };
                    const handleChange = (e) => {
                        const { name, value } = e.target;
                        console.log(`Field "${name}" changed to: "${value}"`);
                        
                        setData(prev => ({
                          ...prev,
                          [name]: value
                        }));
                        
                        if (name === 'supplier') {
                          console.log('Supplier changed, will trigger balance weight fetch');
                        }
                      };
                  const getDisplayValue = (key, value) => {
                    if (!value) return '';
                    if (!isNaN(value)) {
                      console.log(`${key}: Value "${value}" is already an ID, using directly`);
                      return value;
                    }
                    const id = findIdByName(key, value);
                    console.log(`${key}: Converting name "${value}" to ID "${id}"`);
                    return id;
                  };
                  
               const fetchPurchaseUtils = async () => {
                  try {
                    const response = await PurchaseFixModel.getPurchaseFixUtils();
                    
                    if (response.data && response.data.data && typeof response.data.data === 'object') {
                    
                      setUtils(prev => ({
                        ...prev, 
                        ...response.data.data 
                      }));
                    } else {
                      console.error("Unexpected API response format");
                      
                      setUtils({
                        uom: [],
                        terms_of_payment: [],
                        supplier: [],
                      });
                    }
                  } catch (error) {
                    console.error("Error fetching purchase utils:", error);
                    
                    setUtils({
                      uom: [],
                      terms_of_payment: [],
                      supplier: [],
                    });
                    toast.error("Failed to load form options");
                  }
                };  

                const fetchPurchaseFix =async()=>{

                
                  try{
                    if(!supplier_id) toast.error("supplier id not recived")
                     
                      const response = await PurchaseFixModel.getListPurchseFix(login_id,login_type,limit,page,search,status,supplier_id)
                      console.log(response);
                      
                      if(response.data.data){
                        setPurchaseData(response.data.data)

                      }
                       setTotalPages(response.data.pagination.pages)
                        toast.success("data retrived ")
                      
                  }catch(error){
                                          console.log(error);

                       toast.error(" faild to load data")
                  }finally{
                    setIsLoading(false)
                  }

                }
                
                  useEffect(() => {
                    fetchPurchaseUtils();
                  }, []);
  
                 useEffect(() => {
                  if (!supplier_id) return;
                  fetchPurchaseFix();
                }, [supplier_id]); // 👈 now runs whenever supplier_id changes

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
                    <div className="flex flex-row justify-between items-center" style={{padding: '20px'}}>
  
                  <div className="flex flex-row gap-4"> {/* Changed from justify-between to gap */}
               <select 
            name="supplier" 
            value={getDisplayValue('supplier', data.supplier)}
            onChange={handleChange}
            style={{paddingLeft:'12px'}}
            className="select bg-white select-bordered select-sm w-full  text-gray-400  rounded-lg focus:outline-none focus:border-blue-500 focus:ring-0 border-gray-300"
          >
               <option value="" disabled>select supplier</option>
               {utils.supplier.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
               ))}
           </select>                     
            <button style={{
                        width: '130px',
                        height: '33px',
                        borderRadius: '8px',
                        background: 'linear-gradient(to right, #7F60E4, #6170E4)',
                        color: 'white',
                        transition: 'background-color 0.3s ease',
                        cursor: 'pointer',
                      }} className="w-[110px] h-[30px] bg-red-200 text-sm  rounded-lg">Search</button>

                  </div>  
                  <Link to={'/dashboard/ListPurchase'}>
                     <button style={{
                        width: '180px',
                        height: '33px',
                        borderRadius: '8px',
                        background: 'linear-gradient(to right, #7F60E4, #6170E4)',
                        color: 'white',
                        transition: 'background-color 0.3s ease',
                        cursor: 'pointer',
                      }}  className="w-[110px] h-[30px] text-xs font-semibold bg-red-200 rounded-lg">Create New Purchse Fix</button></Link>
                </div>
                 
                     <ItemsPerPageSelector items={items} setItems={setItems} />
                       
                 
                       <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1000px]
                       " style={{ borderSpacing: '0 12px', borderCollapse: 'separate', }}>
                         <thead className="text-xs text-gray-400 uppercase bg-white">
                           <tr>
                             <th className="px-6 py-3" style={{paddingLeft:'20px'}} >SL NO</th>
                             <th className="px-6 py-3 "  >PAYMENT TYPE </th>
                             <th className="px-6 py-3 "  >SETTLED WEIGHT </th>
                             <th className="px-6 py-3   "  >UOM USED</th>
                             <th className="px-6 py-3 "  >METAL RATE(USD)</th>
                             <th className="px-6 py-3 "  >NOTES</th>
                             <th className="px-6 py-3 "  >REFERENCE NUMBER</th>
                           </tr>
                         </thead>
                       <tbody>
                            {isLoading ? (
                        <TableSkelton />
                      ) : purchaseData.length === 0 ? (
                        <tr>
                          <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
                            No data available
                          </td>
                        </tr>
                      ) : (
                              purchaseData.map((item, index) => (
                                <tr key={index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '20px' }}>
                                    {index + 1}
                                  </td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.payment_type}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.gold_weight_gram} GRAM</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.uom}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">${item.metal_rate}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.notes}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">#{item.reference_no}</td>
                                </tr>
                              ))
                            ) }
                          </tbody>

                       </table>
                       
                 
                       {/* Pagination */}
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                 
                       {/* Modal */}
      
      
                      
                      </div>
      
                     
      
                         
                    </>)
     }
     
     export default ListPurchase;