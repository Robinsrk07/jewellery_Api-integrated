import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import { useEffect, useState } from "react";
import { Link } from "react-router";
import DiamondModel from "../../../models/DiamondModel";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import TableSkelton from "../../../components/tableSkelton";


const DiamondPurchhase = () => {

    const [diamondItem, setDiamondItem] = useState([])
    const auth = useSelector((state) => state.auth);
    const { login_id, can_manage_user_types } = auth
     const [limit, setLimit] = useState(10);
     const [page, setPage] = useState(1);
     const [search, setSearch] = useState('');
     const [status, setStatus] = useState('');
    const user_id = login_id;
    const user_types = Object.keys(can_manage_user_types).join(',');   
    const [deletingId, setDeletingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
     const [isLoading, setIsLoading] = useState(true);
 
    console.log(diamondItem)
    const fetchDiamondItems = async () => {
  setIsLoading(true); // start loading
  try {
    const response = await DiamondModel.getDiamondItems(
      user_types,
      user_id,
      limit,
      page,
      search,
      status,
    );
    if (response) {
      setDiamondItem(response.data.data);
    }
  } catch (err) {
    toast.error("Failed to load diamond items");
  } finally {
    setIsLoading(false); // stop loading
  }
};


        const utils = [
            {
            'item_type':[{'id':7,'name':'test1'},{'id':12,'name':'Gold'},{'id':14,'name':'Diamond'}]
            },{
            'default_tax':[{'id':1,'name':'Gold- default-Input-Tax:1.000000% -output_tax:1.00000%'},{'id':2,'name':'Gold- default-Input-Tax:1.000000% -output_tax:1.00000%'}]
            },{
            'supplier':[{'id':1,'name':'GOLD_SUPPLIER_DUBAI'},{'id':2,'name':'GOLD_SUPPLIER_DUBAI_001'}]
            },{
            'terms_of_payment':[{'id':1,'name':'bhjbhj'},{'id':2,'name':'FGSGS'}]
            },{
            'stock_point':[{'id':18,'name':"Reserved Stock"},{'id':19,'name':'Low Stock Alert'},{'id':20,'name':'Warehouse Stock'},{'id':21,'name':'In-Store Stock'},{'id':22,'name':'Transit Stock'},]
            },{
           ' branch':[{'id':1,'name':'Dubai'},{'id':2,'name':'AbhuDhabi'}]
            }
            ]
           

            const getNameFromId = (field, id) => {
        for (const group of utils) {
          if (group[field]) {
            const match = group[field].find(item => item.id === id);
            return match ? match.name : null;
          }
        }
        return null;
      };


    const handleDeleteDiamondItem = async (uuid) => {
        if (!uuid) return toast.error("Sorry We Are Unable to Delete Item");
        try {
            setDeletingId(uuid);
            await DiamondModel.DeleteDiamondItem(uuid);
            await fetchDiamondItems();
            toast.success("Diamond Item Deleted Successfully");
        } catch {
            toast.error("Sorry, Unable to delete Diamond Item");
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchDiamondItems()
    }, [])  

    return (
      <>
        <CustomScrollbar />
        <div className="bg-white w-full
          max-w-[99vw] 
          xl:max-w-[90vw] 
          2xl:max-w-[95vw] 
          h-auto max-h-[70vh] 
          rounded-xl px-4 md:px-8 lg:px-12
          mx-auto overflow-auto  custom-scrollbar"
          style={{ fontFamily: 'Open Sans', overflow: 'auto' }}
        >
          
            <Link to="/dashboard/createDiamondPurchase">
              <CreateButton buttoncontent="+ Create New Item" />
            </Link>
         

          <ItemsPerPageSelector />

          <table className="table w-full text-sm text-left text-gray-500 min-w-[1500px] table-fixed border-collapse">
    <thead className="text-xs text-gray-400 uppercase bg-white border-b">
    <tr style={{ height: '60px' }}>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'100px' ,paddingLeft:'20px'}}>SL NO</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'120px'}}>ITEM TYPE</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'150px'}}>ITEM NAME</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'120px'}}>ITEM CODE</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'190px'}}>SUPPLIER</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'100px'}}>BRANCH</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'120px'}}>STOCK POINT</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'100px'}}>NO OF PIECES</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'150px'}}>DESCRIPTION</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'100px'}}>SALE MARKUP</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'120px'}}>REFERENCE NO</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'120px'}}>REFERENCE DATE</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'100px'}}>ID LENGTH</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'100px'}}>PREFIX</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'120px'}}>TOTAL AMOUNT</th>
      <th className="px-4 py-3 border-b border-gray-200" style={{width:'120px'}}>NET AMOUNT</th>
      <th className="px-4 py-3" style={{width:'150px'}}>ACTION</th>
    </tr>
    </thead>
    <tbody>
   {isLoading ? (
  <TableSkelton />
) : diamondItem.length === 0 ? (
  <tr>
    <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
      No data available
    </td>
  </tr>
) : (
  diamondItem.map((item, index) => (
    <tr key={item.uuid} className="bg-white hover:bg-gray-50 text-gray-400 border-b border-gray-200">
      <td className="px-4 py-3 border-b border-gray-200 text-xs text-center">
        {index + 1}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs">
        {getNameFromId('item_type', item.item_type)}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs">
        <Link to={`/dashboard/listDiamond/${item.uuid}`}>
          {item.item_name}
        </Link>
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs">
        {item.item_code || 'N/A'}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs">
        {getNameFromId('supplier', item.supplier)}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs">
        {item.branch || 'N/A'}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs text-center">
        {getNameFromId('stock_point', item.stock_point)}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs text-center">
        {item.no_of_pieces}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs">
        {item.notes}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs text-center">
        {item.sale_markup}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs">
        {item.reference_no}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs">
        {item.reference_date ? new Date(item.reference_date).toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs text-center">
        {item.id_length}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs">
        {item.prefix}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs text-left" style={{ padding: '10px 12px' }}>
        ₹{parseFloat(item.total_amount).toFixed(2)}
      </td>
      <td className="px-4 py-3 border-b border-gray-200 text-xs text-left">
        ₹{parseFloat(item.net_amount).toFixed(2)}
      </td>
      <td className="px-4 py-3 text-xs">
        <div className="flex flex-row gap-2">
          <Link to={'/dashboard/editDiamondItems'} state={{ item }}>
            <EditButton />
          </Link>
          <DeleteButton 
            buttonText={deletingId === item.uuid ? 'Deleting...' : 'Delete'}
            item="Diamond Item"
            onOpenModal={() => setItemToDelete(item.uuid)}
            onConfirmDelete={() => handleDeleteDiamondItem(itemToDelete)}
            disabled={deletingId === item.uuid}
          />
        </div>
      </td>
    </tr>
  ))
)}

    </tbody>
  </table>

          <Pagination />

        </div>     
      </>
    )
}

export default DiamondPurchhase