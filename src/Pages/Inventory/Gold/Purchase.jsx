import { useEffect, useState } from "react";
import { Link } from "react-router";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import PurchaseModel from '../../../models/PurchaseModel';
import { useSelector } from "react-redux";
import TableSkelton from "../../../components/tableSkelton";


const  Purchase = () => {
     
                   const [items, setItems] = useState(10);
                   const auth= useSelector((state) => state.auth);
                   const {login_type,login_id} =auth
                   const [limit, setLimit] = useState(10);
                   const [page, setPage] = useState(1);
                   const [search, setSearch] = useState('');
                   const [status, setStatus] = useState('');
                   const [purchaseData, setPurchaseData] = useState([]);
                   const [totalPages, setTotalPages] = useState(1);
                   const [isLoading, setIsLoading] = useState(true);
                   console.log(purchaseData);
                      
                  const FetchPurchaseData =async()=>{
                    try{
                      const response = await PurchaseModel.getPurchases(login_id,login_type,limit,page,search,status)
                      setPurchaseData(response.data.data);
                      setTotalPages(response.data.pagination.pages);
                    }catch(error){
                      console.error("Error fetching purchase data:", error);
                    }finally {
                          setIsLoading(false); // stop loading
                        }
                  }

                  useEffect(() => {
                    FetchPurchaseData(); 
                  }, [limit, page, search, status]);

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

                 {/* Sticky buttons container - outside scrollable area */}
                

                <div className="bg-white w-full
                    max-w-[99vw] 
                    xl:max-w-[90vw] 
                    2xl:max-w-[95vw] 
                    h-auto max-h-[80vh] 
                    rounded-xl px-4 md:px-8 lg:px-12
                    mx-auto overflow-auto  custom-scrollbar"
                 style={{ fontFamily: 'Open Sans',overflow:'auto'}}
                   >
                     
{/*                                
                              <Link to="/dashboard/creategoldpurchase">
                              <CreateButton
                                buttoncontent="+ Purchase"
                                
                                  />
                              </Link>  */}

                               <div
      style={{
        position: 'sticky',
        left: 0,
        top: 0,
        zIndex: 10,
        backgroundColor: 'white',
        padding: '1rem',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'flex-end',
        width: 'fit-content',
        minWidth: '100%',
        gap:'10px'
      }}
    >

                              <Link to="/dashboard/creategoldpurchase">
<button
        className="text-xs font-bold"
        style={{
          width: '160px',
          height: '33px',
          borderRadius: '8px',
          background: 'linear-gradient(to right, #7F60E4, #6170E4)',
          color: 'white',
          transition: 'background-color 0.3s ease',
          cursor: 'pointer',
            zIndex: 1, // ✅ Correct camelCase
        }}
          
      >
      +  Purchase 
      </button>
                              </Link> 

      <Link to="/dashboard/ListPurchase">
      <button
        className="text-xs font-bold"
        style={{
          width: '160px',
          height: '33px',
          borderRadius: '8px',
          background: 'linear-gradient(to right, #7F60E4, #6170E4)',
          color: 'white',
          transition: 'background-color 0.3s ease',
          cursor: 'pointer',
        }}
          
      >
        Purchase Fix
      </button></Link>
    </div> 
                            
                         
                 
                       <ItemsPerPageSelector items={items} setItems={setItems} />
                 
                       
                 
                       <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[2500px]
                       " >
                         <thead className="text-xs text-gray-400 uppercase bg-white">
                           <tr>
                             <th className="" style={{paddingLeft:'20px'}} >SL NO</th>
                             <th className=" "  >INVOICE NO </th>
                             <th className="  "  > SUPPLIER</th>
                             <th className="   "  >TOTAL STONE WEIGHT</th>
                             <th className="  " >TOTAL GROSS WEIGHT</th>
                             <th className=" "  >TOTAL ACTUAL PURITY</th>
                             <th className=" "  >TOTAL MAKING RATE</th>
                             <th className=" "  > TOTAL STONE RATE</th>
                             <th className=" "  >  TOTAL TAX AMOUNT</th>
                             <th className=" "  >BALANCE AMOUNT</th>
                             <th className=" "  >TOTAL ITEM PURCHASED</th>
                             <th className=" " >CREATED  DATE</th>
                             <th className=" " >ACTION</th>
                           </tr>
                         </thead>
                      <tbody>
                  {/* {purchaseData.map((item, index) => ( */}
                    {isLoading ? (
                      <TableSkelton />
                    ) : purchaseData.length === 0 ? (
                      <tr>
                        <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
                          No data available
                        </td>
                      </tr>
                    ) : purchaseData.map((item, index) => (

                    <tr key={item.id} className="bg-white hover:bg-gray-50 h-[30px] text-gray-400">
                      <td className=" border-b border-gray-200 text-xs" style={{ paddingLeft: '20px' }}>{index + 1}</td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs hover:text-blue-300"> <Link to={`/dashboard/viewpurchase/${item.id}`}>{item.invoice_no}</Link></td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.supplier_name}</td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.total_stone_weight}</td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.total_gross_weight}</td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.total_actual_purity}</td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.adjusted_total_making_rate} </td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.adjusted_total_stone_rate}</td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.adjusted_total_tax_amount}</td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.adjusted_total_price}</td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.total_items_purchased}</td>
                      <td className="px-6 py-5 border-b border-gray-200 text-xs">{new Date(item.created_at).toLocaleString()}</td>

                      <td
  className="border-b border-gray-200 text-xs"
  style={{ paddingLeft: '10px', position: 'relative', zIndex: 0 }} // ✅ added position & zIndex
>
  <div className="flex flex-row gap-2">
    <Link to={`/dashboard/viewpurchase/${item.id}`}>
      <CreateButton buttoncontent="View Purchase" />
    </Link>
  </div>
</td>

                    </tr>
                  ))}
                </tbody>

                       </table>
                       
                 
                       {/* Pagination */}
                       <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                 
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