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
import TableSkelton from "../../components/tableSkelton";

const  Item = () => {

const [isLoading, setIsLoading] = useState(true);
const auth= useSelector((state) => state.auth);
const {login_type,login_id} =auth
const [limit, setLimit] = useState(10);
const [page, setPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
const [search, setSearch] = useState('');
const [status, setStatus] = useState('');
const [goldItemData, setGoldItemData] = useState([]);

const FetchGoldItemData =async()=>{
  try{
    const response = await GoldItemModel.getGoldItem(login_type,login_id,limit,page,search,status)
    setGoldItemData(response.data.data);
    setTotalPages(response.data.pagination.pages);
  }catch(error){
    console.error("Error fetching gold item data:", error);
  }finally {
    setIsLoading(false);
  }
}

useEffect(() => {
  FetchGoldItemData(); 
 }, [limit, page, search, status]);




                 
                   return (
                     
                 <>
                < CustomScrollbar/>
                <div className="bg-white w-full
                    max-w-[99vw] 
                    xl:max-w-[90vw] 
                    2xl:max-w-[95vw] 
                    h-auto max-h-[80vh] 
                    rounded-xl px-4 md:px-8 lg:px-12
                    mx-auto overflow-auto  custom-scrollbar"
                 style={{ fontFamily: 'Open Sans',overflow:'auto'}}
                   >
                    
                                  
                              <Link to="/dashboard/inventory/create_gold_item">
                       <CreateButton
                        buttoncontent="+ Create New Item"
                        />                 
                      </Link>
                          
                 
                        <ItemsPerPageSelector items={limit} setItems={setLimit} />
                 
                       
                 
                          <table 
                              className="table w-full text-sm text-left text-gray-500 border-collapse"
                              style={{ tableLayout: 'fixed' }}
                            >

                            <thead className="text-xs text-gray-400 uppercase bg-white h-[50px]">
                              <tr>
                                <th  style={{width:'70px ', padding:'0px 20px'}} >SL NO</th>
                                <th style={{width:'130px ', padding:'0px 20px' }}>CODE</th>
                                <th style={{width:'200px ', padding:'0px 20px' }}>UNIQUE ID</th>
                                <th style={{width:'210px ', padding:'0px 0px' }}>NAME</th>
                                <th style={{width:'100px ', padding:'0px 0px' }}>ITEM TYPE</th>
                                <th style={{width:'80px ', padding:'0px 0px' }}>UOM</th>
                                <th style={{width:'120px ', padding:'0px 0px' }}>CATEGORY</th>
                                <th style={{width:'130px ', padding:'0px 0px' }}>JEWELLERY TYPE</th>
                                <th style={{width:'180px ', padding:'0px 0px' }}>MAKING CALCULATION ON</th>
                                <th style={{width:'130px ', padding:'0px 0px' }}>STATUS</th>
                                <th style={{width:'130px ', padding:'0px 0px' }}>ACTION</th>
                              </tr>
                            </thead>
                            <tbody>
                              {isLoading ? (
                          <TableSkelton />
                        ) : goldItemData.length === 0 ? (
                          <tr>
                            <td colSpan={11} className="text-center py-4 text-gray-500 text-sm">
                              No data available
                            </td>
                          </tr>
                        ) : (
                          goldItemData.map((item, index) => (
                            <tr key={index} className="bg-white hover:bg-gray-50 h-[50px] text-gray-400">
                              <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>
                                {index + 1}
                              </td>
                              <td className="border-b border-gray-200 text-xs" style={{ paddingLeft: '20px' }}>
                                {item.code}
                              </td>
                             <td
                                className="px-6 py-5 border-b border-gray-200 text-xs text-blue-500 cursor-pointer hover:underline hover:text-blue-600 transition-all duration-200"
                                style={{ paddingLeft: '30px' }}
                              >
                                {item.unique_id}
                              </td>

                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.name}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.jewellery_type}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.uom}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.category}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.jewellery_type}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">{item.making_calculation_on}</td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs">
                                <span
                                  className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                                    item.status ? 'bg-green-300 text-green-700' : 'bg-red-300 text-red-700'
                                  }`}
                                  style={{ padding: '2px 6px' }}
                                >
                                  {item.status ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                  <Link to={`/dashboard/update_item/${item.id}`}>
                                    <EditButton />
                                  </Link>
                                  <DeleteButton buttonText="Delete Item" modalId="my_modal_8" />
                                  
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