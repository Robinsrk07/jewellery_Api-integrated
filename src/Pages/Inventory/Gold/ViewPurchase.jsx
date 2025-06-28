import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import PurchaseModel from "../../../models/PurchaseModel";
import { useSelector } from "react-redux";

const ViewPurchase = () => {

  const [items, setItems] = useState(10);

  const [modal, setModal] = useState(false)   
  const [editModal,setEditModal]= useState(false)
  const auth= useSelector((state) => state.auth);
  const {login_type,login_id} =auth
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const {id}= useParams()
  const [purchaseData,setPurchaseData] =useState([])
  console.log(purchaseData);
  
  const FetchPurchaseData =async()=>{
   try{
   const response = await PurchaseModel.getPurchaseList(login_id,login_type,limit,page,search,status,id)
    setPurchaseData(response.data.data);
    }catch(error){
    console.error("Error fetching purchase data:", error);
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
   <div className="bg-white w-full
       max-w-[99vw] 
       xl:max-w-[90vw] 
       2xl:max-w-[95vw] 
       h-auto max-h-[70vh] 
       rounded-xl px-4 md:px-8 lg:px-12
       mx-auto overflow-auto  custom-scrollbar"
    style={{ fontFamily: 'Open Sans',overflow:'auto'}}
      >
       
                 
               <Link to={`/dashboard/createnewpurchase/${id}`}>
                            <CreateButton buttoncontent="+ Purchase" />
                          </Link>
             

             <ItemsPerPageSelector items={items} setItems={setItems} />

            

           

           <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[5000px]
           " style={{ borderSpacing: '0 12px', borderCollapse: 'separate', }}>
             <thead className="text-xs text-gray-400 uppercase bg-white">
               <tr>
                 <th className="px-6 py-3 " style={{paddingLeft:'20px'}} >SL NO</th>
                 <th className="px-6 py-3 "  >ITEMS </th>
                 <th className="px-6 py-3  "  >DESIGN</th>
                 <th className="px-6 py-3   "  >BRAND</th>
                 <th className="px-6 py-3  " >MADE IN</th>
                 <th className="px-6 py-3 "  >SIZE</th>
                 <th className="px-6 py-3 "  >STYLE</th>
                 <th className="px-6 py-3 "  > OCCASION</th>
                 <th className="px-6 py-3 "  >  METAL COLOR</th>
                 <th className="px-6 py-3 "  >GENDER</th>
                 <th className="px-6 py-3 "  >STONE TYPE</th>
                 <th className="px-6 py-3 " >PURCHASE  DATE</th>
                 <th className="px-6 py-3 " >MAKING DATE</th>
                 <th className="px-6 py-3 " >STONE  RATE</th>
                 <th className="px-6 py-3 " >STONE  WEIGHT</th>
                 <th className="px-6 py-3 " >STONE SALE MARKUP</th>
                 <th className="px-6 py-3 " >STONE BUFFER VALUE</th>
                 <th className="px-6 py-3 " >MULTI STONE RATE</th>
                 <th className="px-6 py-3 " >MULTI STONE WEIGHT</th>
                 <th className="px-6 py-3 " >GROSS WEIGHT</th>
                 <th className="px-6 py-3 " >ACTUAL PURITY</th>
                 <th className="px-6 py-3 " >GROSS PRICE</th>
                 <th className="px-6 py-3 " >NET PRICE</th>
                 <th className="px-6 py-3 " >TOTAL VALUE</th>
                 <th className="px-6 py-3 " >TAX AMOUNT</th>
                 <th className="px-6 py-3 " >DEFAULT TAX</th>
                 <th className="px-6 py-3 " >DISCOUNT</th>
                 <th className="px-6 py-3 " >TOTAL STONE VALUE</th>
                 <th className="px-6 py-3 " >BARCODE</th>
                 <th className="px-6 py-3 " >TAGLINE1</th>
                 <th className="px-6 py-3 " >TAGLINE2</th>
                 <th className="px-6 py-3 " >TAGLINE3</th>
                 <th className="px-6 py-3 " >TAGLINE4</th>
                 <th className="px-6 py-3 " >TAG DEFENITION</th>
                 <th className="px-6 py-3 " >DESCRIPTION</th>
                 <th className="px-6 py-3 " >ALIAS</th>
                 <th className="px-6 py-3 " >STATUS</th>
                 <th className="px-6 py-3 " >ACTION</th>
               </tr>
             </thead>
             <tbody>
               
                {purchaseData && purchaseData.map((purchase, index) => (
                  <tr key={purchase.id || index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                    <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{paddingLeft:'20px'}}>
                      {index + 1}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.items || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.design || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.brand || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.made_in || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.size || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.style || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.occasion || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.metal_color || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.gender || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.stone_type || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.purchase_date || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.making_date || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.adjusted_stone_rate || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.stone_weight || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.adjusted_stone_sale_markup || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.stone_buffer_value || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.multi_stone_rate || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.multi_stone_weight || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.gross_weight || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.actual_purity || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.adjusted_gross_price || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.adjusted_net_price || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.adjusted_total_value || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.adjusted_tax_amount || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.default_tax || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.discount || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.adjusted_total_stone_value || 'none'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.barcode || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.tagline1 || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.tagline2 || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.tagline3 || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.tagline4 || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.tag_defenition || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.description || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {purchase.alias || 'N/A'}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      <span
                        className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                          purchase.status === 'True'
                            ? 'bg-green-300 text-green-700'
                            : 'bg-red-300 text-red-700'
                        }`}
                        style={{ padding: '2px 6px' }}
                      >
                        {purchase.status === 'True'  ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Link to={`/dashboard/updatepurchase/${purchase.id}/${id}`}>
                          <EditButton />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
               
               
                
                
                
                
               
              
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
 
 export default ViewPurchase;