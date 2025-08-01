import { useEffect, useState } from "react"
import GoldItemModel from "../../../models/GoldItem"
import { useSelector } from "react-redux";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import  CountryModel from '../../../models/countryModel';
import TableSkelton from "../../../components/tableSkelton";
import { toast } from 'react-toastify';

const UnfixPurchase =()=>{

  const auth = useSelector((state) => state.auth);
  const { login_id, can_manage_user_types } = auth;
  const user_id = login_id;
  const user_types = Object.keys(can_manage_user_types).join(',');
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
   const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [data,setData]=useState([])

useEffect(() => {
  if (!user_id) return;

  const fetchUnfixed = async () => {
    setIsLoading(true)
    try {
      const res = await GoldItemModel.getUnfixGold( user_id,          
                            user_types,          
                            limit,
                            page,
                            search,
                            status );
      setData(res?.data?.data);
      setTotalPages(res?.data?.pagination?.pages || 1);

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUnfixed();
}, [user_id, user_types, limit,page, search, status]);

    return(
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
                         {/* <CreateButton
                          buttoncontent="+ New Items"
                        //   onClick={() => setModal(true)}  
                         />                  */}
                         <div className="w-full h-[50px]"></div>
                         <ItemsPerPageSelector items={limit} setItems={setLimit} />
                          
                                
                             <table className="w-full text-sm text-left text-gray-500 border-collapse overflow-x-auto"
                                style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '800px' }}>
                              <thead className="text-xs text-gray-400 uppercase bg-white">
                                <tr>
                                  <th  style={{ width: '80px', paddingLeft: '20px' }}>SL NO</th>
                                  <th  style={{ width: '100px' }}>ITEMS</th>
                                  <th  style={{ width: '130px' }}>BARCODE</th>
                                  <th  style={{ width: '130px' }}>GROSSS WEIGHT </th>
                                  <th  style={{ width: '130px' }}>STONE WEIGHT</th>
                                  <th  style={{ width: '130px' }}>PURITY</th>
                                  <th  style={{ width: '130px' }}>GROSS PRICE</th>
                                  <th  style={{ width: '130px' }}>TAX AMOUNT</th>
                                  <th  style={{ width: '130px' }}>NET PRICE </th>
                                  <th  style={{ width: '130px' }}>STATUS </th>
                                </tr>
                              </thead>
                              <tbody>
                                {isLoading ? (
                                    <TableSkelton />
                                ) : data.length === 0 ? (
                                    <tr>
                                    <td className="text-center py-4 text-gray-500 text-sm" colSpan="10">
                                        No data available
                                    </td>
                                    </tr>
                                ) : (
                                    data.map((item,index) => (
                                    <tr key={index} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                                        <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '30px' }}>
                                        {index + 1}
                                        </td>
                                        <td className="py-4 border-b border-gray-200 text-xs">{item.items}</td>
                                        <td className="py-4 border-b border-gray-200 text-xs">{item.barcode}</td>
                                        <td className="py-4 border-b border-gray-200 text-xs">{item.gross_weight}</td>
                                        <td className="py-4 border-b border-gray-200 text-xs">{item.stone_weight}</td>
                                        <td className="py-4 border-b border-gray-200 text-xs">{item.actual_purity}</td>
                                        <td className="py-4 border-b border-gray-200 text-xs">{item.adjusted_gross_price}</td>
                                        <td className="py-4 border-b border-gray-200 text-xs">{item.adjusted_tax_amount}</td>
                                        <td className="py-4 border-b border-gray-200 text-xs">{item.adjusted_net_price}</td>
                                        <td className="py-4 border-b border-gray-200 text-xs">
                                        {item.status ? (
                                            <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                            Active
                                            </span>
                                        ) : (
                                            <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                            INACTIVE
                                            </span>
                                        )}
                                        </td>
                                        {/* <td className="py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                                        <div className="flex gap-2.5 items-center">
                                            <EditButton
                                            
                                            />
                                            
        
                                        </div>
                                        </td> */}
                                    </tr>
                                    ))
                                )}
                                </tbody>
        
                            </table>
                                                
                          
                             <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                               
              </div>
               
             
               
       
               
                                  
                             </>
    )
}

export default UnfixPurchase