import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import { useSelector } from "react-redux";
import GoldItemModel from '../../models/GoldItem';
const  Item = () => {

const [items, setItems] = useState(10);
const auth= useSelector((state) => state.auth);
const {login_type,login_id} =auth
const [limit, setLimit] = useState(10);
const [page, setPage] = useState(1);
const [search, setSearch] = useState('');
const [status, setStatus] = useState('');
const [goldItemData, setGoldItemData] = useState([]);

const FetchGoldItemData =async()=>{
  try{
    const response = await GoldItemModel.getGoldItem(login_type,login_id,limit,page,search,status)
    setGoldItemData(response.data.data);
  }catch(error){
    console.error("Error fetching gold item data:", error);
  }
}
console.log(goldItemData);

useEffect(() => {
  FetchGoldItemData(); 
 }, [limit, page, search, status]);

// 1
const inventoryData = [
{
  id: 1,
  code: "BRD-NKL-22K-001",
  uniqueId: "BRD-NKL00001",
  name: "22K Gold Bridal Necklace",
  itemType: "Gold",
  uom: "Gram",
  category: "Bridal Jewellery",
  jewelleryType: "Necklace",
  makingCalculationOn: "gross_weight",
  status: "ACTIVE"
},
{
  id: 2,
  code: "EVD-PND-18K-002",
  uniqueId: "EVD-PND00002",
  name: "18K Gold Everyday Wear Pendant",
  itemType: "Gold",
  uom: "Gram",
  category: "Everyday Wear",
  jewelleryType: "Necklace",
  makingCalculationOn: "net_weight",
  status: "ACTIVE"
},
{
  id: 3,
  code: "LUX-RNG-14K-003",
  uniqueId: "LUX-RNG00003",
  name: "14K Gold Designer Cocktail Ring",
  itemType: "Gold",
  uom: "Gram",
  category: "Luxury & Designer Jewellery",
  jewelleryType: "Ring",
  makingCalculationOn: "gross_weight",
  status: "ACTIVE"
},
{
  id: 4,
  code: "GOLD-BAR-001",
  uniqueId: "GOLD_BAR00004",
  name: "Gold Bar",
  itemType: "Gold",
  uom: "Gram",
  category: "Gold",
  jewelleryType: "Gold Bar",
  makingCalculationOn: "gross_weight",
  status: "ACTIVE"
}
];


                 
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
                              <Link to="/dashboard/inventory/createItem">
                       <CreateButton
                        buttoncontent="+ Create New Item"
                        />                 
                      </Link>
                          </div>
                 
                        <ItemsPerPageSelector items={items} setItems={setItems} />
                 
                       
                 
                        <table 
                            className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[2200px]" 
                            style={{ borderSpacing: '0 12px', borderCollapse: 'separate' }}
                          >
                            <thead className="text-xs text-gray-400 uppercase bg-white">
                              <tr>
                                <th className="px-6 py-3" style={{paddingLeft:'20px', width:'150px'}}>SL NO</th>
                                <th className="px-6 py-3" style={{width:'130px'}}>CODE</th>
                                <th className="px-6 py-3" style={{width:'130px'}}>UNIQUE ID</th>
                                <th className="px-6 py-3" style={{width:'130px'}}>NAME</th>
                                <th className="px-6 py-3" style={{width:'130px'}}>ITEM TYPE</th>
                                <th className="px-6 py-3" style={{width:'130px'}}>UOM</th>
                                <th className="px-6 py-3" style={{width:'130px'}}>CATEGORY</th>
                                <th className="px-6 py-3" style={{width:'130px'}}>JEWELLERY TYPE</th>
                                <th className="px-6 py-3" style={{width:'200px'}}>MAKING CALCULATION ON</th>
                                <th className="px-6 py-3" style={{width:'130px'}}>STATUS</th>
                                <th className="px-6 py-3" style={{width:'130px'}}>ACTION</th>
                              </tr>
                            </thead>
                            <tbody>
                              {goldItemData.slice().reverse().map((item) => (
                                <tr key={item.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{paddingLeft:'20px'}}>
                                    {item.id}
                                  </td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.code}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.id}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.name}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.jewellery_type}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.uom}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.category}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.jewellery_type}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.making_calculation_on}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">
                                   <span
                                    className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                                      item.status
                                        ? 'bg-green-300 text-green-700'
                                        : 'bg-red-300 text-red-700'
                                    }`}
                                    style={{ padding: '2px 6px' }}
                                  >
                                    {item.status ? 'Active' : 'Inactive'}
                                  </span>

                                  </td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                      <Link to='/dashboard/inventory/gold/updateitem'>
                                        <EditButton
                              
                                        />
                                      </Link>
                                      <DeleteButton 
                                      buttonText="Delete Item" 
                                      modalId="my_modal_8" 
                                    />
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
      
      
                       <div className="modal-box bg-white text-center py-8 px-6 rounded-xl relative font-[Open_Sans]
                         w-[90vw] max-w-[400px] h-[90vh] max-h-[300px]
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
                        <h3 className="text-lg text-gray-500 font-semibold " style={{margin:'20px'}}>Are you sure?</h3>
                        <p className="text-sm text-gray-500 " style={{margin:'20px'}}>You won't be able to revert this!</p>
      
                        {/* Actions */}
                        <div className="flex justify-center gap-4">
                          <button
                            className="btn text-xs border-none bg-red-500 font-bold text-white hover:bg-red-600 px-6"
                            onClick={() => document.getElementById('my_modal_cancel').showModal()}
                            style={{width:'100px'}}
                          >
                            No, cancel!
                          </button>
                          <button
                            className="btn text-xs border-none bg-green-500 font-bold text-white hover:bg-green-600 px-6"
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
                  <div className="modal-box text-center py-10 px-8 w-[90vw] bg-white max-w-[400px] h-[90vh] max-h-[300px] relative font-[Open Sans] "
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
                      <p className="text-lg text-gray-500  font-semibold " style={{margin:'20px'}}>Your Item is safe</p>
                      <button className="btn border-none bg-blue-500 w-[50px] rounded-lg" > ok</button>
                  </div>
                      </dialog>
                      </div>
      
                     
      
                         
                    </>)
     }
     
     export default Item;