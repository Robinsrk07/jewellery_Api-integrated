import React, { useEffect, useState } from "react";
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from "../../../components/EditButton";
import DeleteButton from "../../../components/DeleteButton";
import Pagination from "../../../components/Pagination";
import ItemsPerPageSelector from "../../../components/ItemsPerPageSelector";
import CreateButton from "../../../components/CreateButton";
import UtilsGetModel from "../../../models/Utils_getModel";
import TableSkelton from "../../../components/tableSkelton";

import { Link, useParams } from "react-router";
import { toast } from "react-toastify";
import DiamondModel from "../../../models/DiamondModel";
import { useSelector } from "react-redux";
const ListDiamond = () => {
const [diamondList, setDiamondList] = useState([]);
 const [goldUtils,setGoldUtils] =useState([])
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

const {uuid,id} =useParams()
//const auth = useSelector((state) => state.auth);
//const { login_id, can_manage_user_types } = auth
const [limit, setLimit] = useState(10);
const [page, setPage] = useState(1);
const [search, setSearch] = useState('');
const [status, setStatus] = useState('');
//const user_types = Object.keys(can_manage_user_types).join(',');

const commonDiamondItemId =
  diamondList.length > 0 &&
  diamondList.every(item => item.diamond_item_id === diamondList[0].diamond_item_id)
    ? diamondList[0].diamond_item_id
    : null;




 const fetchDiamond = async () => {
        try {
            const response = await DiamondModel.getDiamond( 
                 id,
                 limit,
                 page,
                 search,
                 status,
                 uuid
            )
            if (response) {
                setDiamondList(response.data.data)
                 setTotalPages(response.data.pagination.pages);
            }

        } catch(error) {
           console.error(error)
        }
        finally{
          setIsLoading(false)
        }
    }

     const fetchGoldUtils =async ()=>{
                try{
                   const response = await UtilsGetModel.getUtilsData()
                   if(response){
                    setGoldUtils(response?.data?.data)
                     }
                }catch(error){
                   console.error(error)
                }
              }
    useEffect(()=>{

        if(uuid){
            fetchDiamond()
        }
    },[])

    useEffect(()=>{
      fetchGoldUtils()
    },[])
  return (
    <>
      <CustomScrollbar />
      <div
        className="bg-white w-full max-w-[99vw] xl:max-w-[90vw] 2xl:max-w-[95vw] h-auto max-h-[80vh] 
        rounded-xl px-4 md:px-8 lg:px-12 mx-auto overflow-auto custom-scrollbar"
        style={{ fontFamily: "Open Sans" }}
      >
        {/* <Link to='/dashboard/createDiamond'> */}
        <Link to={`/dashboard/itemDetials/${commonDiamondItemId}`}>
          <CreateButton buttoncontent="+ Create New Diamond" />
        </Link>

        <ItemsPerPageSelector />

        <table className="table w-full text-sm text-left text-gray-500 min-w-[2000px] table-fixed border-collapse">
          <thead className="text-xs text-gray-400 uppercase bg-white border-b">
            <tr style={{ height: "60px" }}>
              <th className="px-4 py-3 "style={{width:'100px' ,paddingLeft:'20px'}}>SL NO</th>
              <th className="px-4 py-3" style={{width:'120px'}}>ITEM NAME</th>
              <th className="px-4 py-3"style={{width:'120px'}}>ITEM TYPE</th>
              
              <th className="px-4 py-3"style={{width:'150px'}}>DESCRIPTION</th>
              <th className="px-4 py-3"style={{width:'220px'}}>SERIAL NUMBER</th>
              <th className="px-4 py-3"style={{width:'120px'}}>UOM</th>
              <th className="px-4 py-3"style={{width:'120px'}}>CATEGORY</th>
              <th className="px-4 py-3"style={{width:'120px'}}>SUBCATEGORY</th>
              <th className="px-4 py-3"style={{width:'120px'}}>STYLE</th>
              <th className="px-4 py-3"style={{width:'120px'}}>DESIGN</th>
              <th className="px-4 py-3"style={{width:'120px'}}>MADE IN</th>
              <th className="px-4 py-3"style={{width:'120px'}}>METAL COLOR</th>
              <th className="px-4 py-3"style={{width:'120px'}}>SIZE</th>
              <th className="px-4 py-3"style={{width:'120px'}}>COST PRICE</th>
              <th className="px-4 py-3"style={{width:'120px'}}>TAG PRICE</th>
              <th className="px-4 py-3"style={{width:'120px'}}>MARK UP</th>
              <th className="px-4 py-3"style={{width:'120px'}}>GOLD WEIGHT</th>
              <th className="px-4 py-3"style={{width:'120px'}}>PEARL WEIGHT</th>
              <th className="px-4 py-3"style={{width:'120px'}}>RUBY WEIGHT</th>
              <th className="px-4 py-3"style={{width:'140px'}}>EMERALD WEIGHT</th>
              <th className="px-4 py-3"style={{width:'140px'}}>SAPPHIRE WEIGHT</th>
              <th className="px-4 py-3"style={{width:'180px'}}>OTHER STONE WEIGHT</th>
              <th className="px-4 py-3"style={{width:'120px'}}>IS GIFT ITEM</th>
              <th className="px-4 py-3"style={{width:'120px'}}>PROFIT MARGIN</th>
              <th className="px-4 py-3"style={{width:'120px'}}>STATUS</th>
              <th className="px-4 py-3"style={{width:'120px'}}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
  <TableSkelton />
) : diamondList.length === 0 ? (
  <tr>
    <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
      No data available
    </td>
  </tr>
) : diamondList.map((item, index) => (
              <tr key={item.uuid} style={{height:'50px', padding:'0px 20px'}} className="bg-white border-b h-[50px] border-gray-200 hover:bg-gray-50 text-xs">
                <td className="px-4 py-3 text-center" >{index + 1}</td>
                <td className="px-4 py-3">{item.diamond_item}</td>
                <td className="px-4 py-3">{item.item_type}</td>
                <td className="px-4 py-3">{item.description || "N/A"}</td>
             <td className="px-4 py-3 text-blue-500 cursor-pointer underline hover:text-blue-600 transition-all duration-200">
                {item.serial_no || "N/A"}
              </td>

                <td className="px-4 py-3">{item.uom}</td>
                <td className="px-4 py-3">{item.category || "N/A"}</td>
                <td className="px-4 py-3">{item.subcategory || "N/A"}</td>
                <td className="px-4 py-3">{item.style}</td>
                <td className="px-4 py-3">{item.design}</td>
                <td className="px-4 py-3">{item.made_in}</td>
                <td className="px-4 py-3">{item.metal_color}</td>
                <td className="px-4 py-3">{item.size}</td>
                <td className="px-4 py-3">₹{parseFloat(item.cost_price).toFixed(2)}</td>
                <td className="px-4 py-3">₹{parseFloat(item.tag_price).toFixed(2)}</td>
                <td className="px-4 py-3">{item.mark_up}%</td>
                <td className="px-4 py-3">{item.gold_weight}</td>
                <td className="px-4 py-3">{item.pearl_weight}</td>
                <td className="px-4 py-3">{item.ruby_weight}</td>
                <td className="px-4 py-3">{item.emerald_weight}</td>
                <td className="px-4 py-3">{item.sapphire_weight}</td>
                <td className="px-4 py-3">{item.other_stone_weight}</td>
                <td className="px-4 py-3">{item.is_gift_item ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  {item.consider_profit_margin ? "Yes" : "No"}
                </td>
                <td
  className={`px-4 py-3 text-ger text-center rounded 
    
  `}
>
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


                <td className="px-4 py-3">
                  <div className="flex flex-row gap-2">
                    <Link to={`/dashboard/editDiamond/${item.uuid}`} state={{ item }}>
                      <EditButton />
                    </Link>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  );
};

export default ListDiamond;
