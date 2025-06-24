

    
    
     import { useState } from "react";
     import { Link } from "react-router";
     import CustomScrollbar from "../../../components/CustomScrollbar";
      import EditButton from '../../../components/EditButton';
      import DeleteButton from '../../../components/DeleteButton';
      import CreateButton from '../../../components/CreateButton';
      import Pagination from '../../../components/Pagination';
      import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
     const  Purchase = () => {
     
          
      const  [isHovered, setIsHovered] = useState(false);
                   const [items, setItems] = useState(10);
                   const [formData, setFormData] = useState({
                     name: '',
                     email:'',
                     status:'',
                     phone:'',
                     address:'',
                     gender:''
                   });
                   const [errors, setErrors] = useState({});
                 
                       const handleChange = (e) => {
                         const { name, value } = e.target;
                         setFormData((prev) => ({ ...prev, [name]: value }));
                         setErrors((prev) => ({ ...prev, [name]: '' })); 
                       };
      
                    
                 
                   //validation 
                   
                   const validate = () => {
                     const newErrors = {};
                     if (!formData.gender.trim()) newErrors.gender = 'Please Enter Name';
                     if (!formData.phone.trim()) newErrors.phone = 'Please Enter Name';
                     if (!formData.name.trim()) newErrors.name = 'Please Enter Name';
                     if (!formData.address.trim()) newErrors.address = 'Please Enter Name';
                     if (!formData.description.trim()) newErrors.description = 'Enter the Description';
                     if (!formData.status.trim()) newErrors.status = 'Enter Status';
                     return newErrors;
                   };    
                 
                   //handle submit
                 
                   const handleSubmit = (e) => {
                     e.preventDefault();
                     const validationErrors = validate();
                     if (Object.keys(validationErrors).length > 0) {
                       setErrors(validationErrors);
                       return;
                     }
                 
                     // Submit form
                     console.log('Form submitted:', formData);
                 
                     // Reset form and close modal - Fixed to include all fields
                     setFormData({
                      name: '',
                      email:'',
                      status:'',
                      phone:'',
                      address:'',
                      gender:''
                     });
                     setErrors({});
                   };
                  
                   
                 
                 
                 
                 
                 
                   return (
                     
                 <>
                 <style jsx global>{`
                   .custom-scrollbar::-webkit-scrollbar {
                     width: 6px;  /* Slightly wider for better visibility */
                     height: 6px; /* For horizontal scroll */
                   }
                   
                   .custom-scrollbar::-webkit-scrollbar-track {
                     background: #f1f1f1; /* Light gray track */
                     border-radius: 3px;
                   }
                   
                   .custom-scrollbar::-webkit-scrollbar-thumb {
                     background:rgb(218, 216, 216); /* Rich red color */
                     border-radius: 3px;
                     border: 1px solidrgb(206, 198, 198); /* Darker red border */
                   }
                   
                   .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                     background:rgb(202, 190, 190); /* Darker red on hover */
                   }
                   
                   /* For Firefox */
                   .custom-scrollbar {
                     scrollbar-width: thin;
                     scrollbar-color:rgb(226, 215, 215) #f1f1f1; /* red thumb on gray track */
                   }
                 `}</style>
                <div className="bg-white w-full
                    max-w-[99vw] 
                    xl:max-w-[90vw] 
                    2xl:max-w-[95vw] 
                    h-auto max-h-[70vh] 
                    rounded-xl px-4 md:px-8 lg:px-12
                    mx-auto overflow-auto  custom-scrollbar"
                 style={{ fontFamily: 'Open Sans',overflow:'auto'}}
                   >
                    
                                 
                              <Link to="/dashboard/creategoldpurchase">
                              <CreateButton
                                buttoncontent="+ Purchase"
                  
                                  />
                              </Link>
                         
                 
                       <ItemsPerPageSelector items={items} setItems={setItems} />
                 
                       
                 
                       <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[2500px]
                       " style={{ borderSpacing: '0 12px', borderCollapse: 'separate', }}>
                         <thead className="text-xs text-gray-400 uppercase bg-white">
                           <tr>
                             <th className="px-6 py-3 " style={{paddingLeft:'20px'}} >SL NO</th>
                             <th className="px-6 py-3 "  >INVOICE NO </th>
                             <th className="px-6 py-3  "  > SUPPLIER</th>
                             <th className="px-6 py-3   "  >TOTAL STONE WEIGHT</th>
                             <th className="px-6 py-3  " >TOTAL GROSS WEIGHT</th>
                             <th className="px-6 py-3 "  >TOTAL ACTUAL PURITY</th>
                             <th className="px-6 py-3 "  >TOTAL MAKING RATE</th>
                             <th className="px-6 py-3 "  > TOTAL STONE RATE</th>
                             <th className="px-6 py-3 "  >  TOTAL TAX AMOUNT</th>
                             <th className="px-6 py-3 "  >BALANCE AMOUNT</th>
                             <th className="px-6 py-3 "  >TOTAL ITEM PURCHASED</th>
                             <th className="px-6 py-3 " >CREATED  DATE</th>
                             <th className="px-6 py-3 " >ACTION</th>
                           </tr>
                         </thead>
                         <tbody>
                           
                             <tr  className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                               <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{paddingLeft:'20px'}}>1</td>
                               <td className="px-6 py-5 border-b border-gray-200 text-xs">INV-000001 </td>
                               <td className="px-6 py-5 border-b border-gray-200 text-xs">GOLD_SUPPLIER_DUBAI </td>
                               <td className="px-6 py-5 border-b border-gray-200 text-xs">20.000 </td>
                               <td className="px-6 py-5 border-b border-gray-200 text-xs">50.00 </td>
                               <td className="px-6 py-5 border-b border-gray-200 text-xs">916.00 </td>
                               <td className="px-6 py-5 border-b border-gray-200 text-xs">None %</td>
                               <td className="px-6 py-5 border-b border-gray-200 text-xs">$ 200.000000000 </td>
                               <td className="px-6 py-5 border-b border-gray-200 text-xs">$ 180.00 </td>
                               <td className="px-6 py-5 border-b border-gray-200 text-xs">$ 1800.00</td>
                                 <td className="px-6 py-5 border-b border-gray-200 text-xs">1</td>
                                 <td className="px-6 py-5 border-b border-gray-200 text-xs">April 9, 2025, 12:35 p.m.</td>
      
                                <td className=" border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                                  <div className="flex flex-row ">
                                      <Link to="/dashboard/inventory/gold/createnewpurchase">
                                      <CreateButton
                                        buttoncontent=" New Purchase"
                                        
                                        /> </Link>
                                      <Link to="/dashboard/inventory/gold/viewpurchase">
                                       <CreateButton
                                        buttoncontent="View Purchase"
                                        
                                        /> </Link>
                                  </div>
                                  </td>
                             </tr>
                            
                            
                             
                             
                             
                             
                            
                          
                         </tbody>
                       </table>
                       
                 
                       {/* Pagination */}
                        <Pagination/>
                 
                       {/* Modal */}
      
      
                       <dialog id="my_modal_8" className="modal">
      
      
                       <div className="modal-box text-center py-8 px-6 rounded-xl relative font-[Open_Sans]
                          w-[90vw] h-[50vh]             /* base (mobile) */
                          sm:w-[70vw] sm:h-[30vh]       /* ≥ 640px */
                          md:w-[50vw] md:h-[30vh]       /* ≥ 768px */
                          lg:w-[35vw] lg:h-[30vh]       /* ≥ 1024px */
                          xl:w-[30vw] xl:h-[50vh]       /* ≥ 1280px */
                          2xl:w-[25vw] 2xl:h-[20vh]     /* ≥ 1536px */
                        "
      
                       onClick={()=>document.getElementById('my_modal_8').close()}
                       >
                       
                        {/* Icon */}
                        <div className="flex justify-center mb-4" style={{opacity:'.5'}}>
                          <div className="text-orange-400 text-6xl">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth=".7"
                              stroke="currentColor"
                              className="w-30 h-30"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM12 3.75c4.556 0 8.25 3.694 8.25 8.25s-3.694 8.25-8.25 8.25S3.75 16.556 3.75 12 7.444 3.75 12 3.75z" />
                            </svg>
                          </div>
                        </div>
      
                        {/* Title & Message */}
                        <h3 className="text-lg font-semibold " style={{margin:'20px'}}>Are you sure?</h3>
                        <p className="text-sm text-gray-500 " style={{margin:'20px'}}>You won't be able to revert this!</p>
      
                        {/* Actions */}
                        <div className="flex justify-center gap-4">
                          <button
                            className="btn text-xs bg-red-500 font-bold text-white hover:bg-red-600 px-6"
                            onClick={() => document.getElementById('my_modal_cancel').showModal()}
                            style={{width:'100px'}}
                          >
                            No, cancel!
                          </button>
                          <button
                            className="btn text-xs bg-green-500 font-bold text-white hover:bg-green-600 px-6"
                            onClick={() => {
                              document.getElementById('my_modal_8').close();
                            }}
                            style={{width:'100px'}}
                          >
                            Yes, delete it!
                          </button>
                        </div>
                      </div>
                    </dialog>
      
      
                  <dialog id="my_modal_cancel" className="modal">
                  <div className="modal-box text-center py-10 px-8 relative font-[Open Sans] "
                      onClick={() => {
                      document.getElementById('my_modal_cancel').close();
                      }}>
                      <div className="flex justify-center mb-4" style={{opacity:'.5'}}>
                      <div className="text-blue-400 text-6xl">
                          <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth=".7"
                          stroke="currentColor"
                          className="w-30 h-30"
                          >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM12 3.75c4.556 0 8.25 3.694 8.25 8.25s-3.694 8.25-8.25 8.25S3.75 16.556 3.75 12 7.444 3.75 12 3.75z" />
                          </svg>
                      </div>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-500 " style={{margin:'20px'}}>Cancelled</h3>
                      <p className="text-lg text-gray-500  font-semibold " style={{margin:'20px'}}>Your Jewellery Type is safe</p>
                      <button className="btn bg-blue-500 w-[50px] rounded-lg" > ok</button>
                  </div>
                  </dialog>
                  </div>     
                    </>)
     }
     
     export default Purchase;