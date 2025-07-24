import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import stockPointModel from "../../../models/stockPointModel"; 
import CustomScrollbar from "../../../components/CustomScrollbar";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';
import TableSkelton from "../../../components/tableSkelton";




const StockPoint = () => {


              const auth = useSelector((state) => state.auth);
              const { login_id, can_manage_user_types } = auth;
              const user_id = login_id;
              const user_types = Object.keys(can_manage_user_types || {}).join(',')
              const [modal, setModal] = useState(false);
              const [editModal, setEditModal] = useState(false);
              const [stockPointData, setStockPointData] = useState([]);
              const [editingStockPoint, setEditingStockPoint] = useState(null);
             const[limit,setLimit]=useState(10); 
            
              const [totalPages, setTotalPages] = useState(1);
              const [page, setPage] = useState(1);
              const [search, setSearch] = useState('');
              const [status, setStatus] = useState('');
              const [isSubmitting, setIsSubmitting] = useState(false);
              const [isLoading, setIsLoading] = useState(true);
               const [deletingId, setDeletingId] = useState(null);
               const [itemToDelete, setItemToDelete] = useState(null);
              const [addStockPointData, setAddStockPointData] = useState({
                name: '',
                description: '',
                status: 'true',
              });
              const [errors, setErrors] = useState({
                name: '',
                description: '',
                status: '',
              });
              const [editErrors, setEditErrors] = useState({
                name: '',
                description: '',
                status: '',
              });             
              const fetchStockPoints = async () => {
                try {
                  const response = await stockPointModel.getStockPoints(
                    user_id,
                    user_types,
                    limit,
                    page,
                    search,
                    status
                  );
                  if (response.data && response.data.data) {
                    setStockPointData(response?.data?.data);
                    setTotalPages(response?.data?.pagination?.pages);
                  } else {
                    toast.error("Unable to fetch stock points");
                  }
                } catch (error) {
                  console.error("Error fetching stock points:", error);
                  toast.error("Failed to load stock points");
                }finally {
                      setIsLoading(false); // stop loading
                    }
              };
              useEffect(() => {
                fetchStockPoints();
              }, [limit, page, search, status]);


              const validate = () => {
                const newErrors = {};
                if (!addStockPointData.name.trim()) newErrors.name = 'Please enter name';
                return newErrors;
              };

             //  Update form data on input change
              const handleAddStockPointChange = (e) => {
                const { name, value } = e.target;
                setAddStockPointData((prev) => ({
                  ...prev,
                  [name]: value,
                }));
              };



              useEffect(() => {
              }, [addStockPointData]);


              const handleSubmitStockPoint = async () => {
                const validationErrors = validate();
                if (Object.keys(validationErrors).length > 0) {
                  setErrors(validationErrors);
                  return;
                }

                const payload = {
                  name: addStockPointData.name,
                  description: addStockPointData.description,
                  status: addStockPointData.status === 'true'  
                };

                try {
                  const response = await stockPointModel.createStockPoint(payload);
                  console.log("Create response:", response);

                  if (response.status === 201 || response.status === 200) {
                    fetchStockPoints();
                    handleCloseModal();
                    toast.success('Stock Point created successfully!');
                  }
                } catch (error) {
                  console.error("Create error:", error);
                  toast.error('Failed to create stock point!');
                  handleCloseModal();

                  if (error.response?.data?.errors) {
                    setErrors((prev) => ({
                      ...prev,
                      ...error.response.data.errors,
                    }));
                  }
                }
              };




              const handleEditClick = (stockPointObj) => {
                setEditingStockPoint({ ...stockPointObj });

                setEditModal(true);
              };

              const handleEditStockPointChange = (e) => {
                const { name, value } = e.target;
                setEditingStockPoint((prev) => ({
                  ...prev,
                  [name]: name === 'status' ? (value === 'true') : value,
                }));
              };


              const validateEditForm = () => {
                let valid = true;
                const newErrors = { name: '', };

                if (!editingStockPoint?.name?.trim()) {
                  newErrors.name = 'Stock Point name is required';
                  valid = false;
                } else if (editingStockPoint.name.length < 2) {
                  newErrors.name = 'Must be at least 2 characters';
                  valid = false;
                }


                setEditErrors(newErrors);
                return valid;
              };


              const handleEditSubmit = async () => {

                if (!editingStockPoint?.id) {
                  toast.error("Invalid stock point.");
                  return;
                }

                if (!validateEditForm()) return  

                setIsSubmitting(true);
                try {
                  const response = await stockPointModel.updateStockPoint(
                    editingStockPoint.id,
                    {
                      name: editingStockPoint.name,
                      description: editingStockPoint.description,
                      status: editingStockPoint.status,
                    }
                  );

                  if (response.status === 200) {
                    fetchStockPoints(); 
                    toast.success('Stock point updated successfully!');
                    handleEditCloseModal();
                  }
                } catch (error) {
                  console.error(error);
                  toast.error('Failed to update stock point!');
                  if (error.response?.data?.errors) {
                    setErrors(prev => ({
                      ...prev,
                      ...error.response.data.errors,
                    }));
                  }
                } finally {
                  setIsSubmitting(false);
                }
              };


                const handleDeleteStockPoint = async (id) => {
                  console.log("Deleting stock point with ID:", id);
                  if (!id) return;

                  try {
                    await stockPointModel.deleteStockPoint(id);

                    setStockPointData(prevData => prevData.filter(item => item.id !== id));

                    const modal = document.getElementById('my_modal_8');
                    if (modal && typeof modal.close === 'function') {
                      modal.close();
                    }

                    toast.success('Stock point deleted successfully');
                  } catch (error) {
                    console.error("Error deleting stock point:", error);
                    toast.error('Failed to delete stock point');
                  }
                };

                useEffect(() => {
                  fetchStockPoints(); 
                }, []);

     
                // Handle close modal
                const handleCloseModal = () => {
                  setModal(false);
                   setAddStockPointData({
                    name: '',
                    description: '',
                  });
                  setErrors({ name: '', description: '', status: '' });
                };
                const handleEditCloseModal = () => {
                  (false);
                  setEditErrors({
                name: '',
                description: '',
                status: '',
              })
                  setEditModal(false)
                };
          
                return (
                  
              <>
             <CustomScrollbar/>
                <div  className="bg-white w-full
                        max-w-[95vw] 
                        xl:max-w-[90vw] 
                        2xl:max-w-[95vw] 
                        h-auto max-h-[70vh] 
                        rounded-xl px-4 md:px-8 lg:px-12
                        mx-auto overflow-auto  custom-scrollbar"
                      style={{ fontFamily: 'Open Sans',overflow:'auto'}}
                                                            >
             <CreateButton
              buttoncontent="+ New Stock Point"
              onClick={() => setModal(true)}  // This will now work!
              />                 
              <ItemsPerPageSelector items={limit} setItems={setLimit} />
              
                    
              
                          <table className="table w-full text-sm text-left text-gray-500 border-collapse" 
                            style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '1200px' }}>
                            <thead className="text-xs text-gray-400 uppercase bg-white">
                              <tr>
                                <th className="px-6 py-3" style={{ width: '70px', paddingLeft: '20px' }}>SL NO</th>
                                <th className="px-6 py-3" style={{ width: '150px' }}>NAME</th>
                                <th className="px-6 py-3" style={{ width: '400px' }}>DESCRIPTION</th>
                                <th className="px-6 py-3" style={{ width: '90px' }}>STATUS</th>
                                <th className="px-6 py-3" style={{ width: '90px' }}>ACTION</th>
                              </tr>
                            </thead>
                            <tbody>
                              {isLoading ? (
                            <TableSkelton />
                          ) : stockPointData.length === 0 ? (
                            <tr >
                              <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
                                No data available
                              </td>
                            </tr>
                          ) : stockPointData.map((stock,index) => (
                                <tr key={stock.id} className="bg-white hover:bg-gray-50 h-12 text-gray-400">
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '20px' }}>
                                    {/* {category.id} */}
                                    {index+1}
                                  </td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs">{stock.name}</td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs text-justify"  style={{paddingRight:'60px'}}>{stock.description}</td>
                                <td className="py-4 border-b border-gray-200 text-xs">
                                  {stock.status ? (
                                      <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                          Active
                                      </span>
                                      ) : (
                                      <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                          INACTIVE
                                      </span>
                                  )}
                                </td>
                                  <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <EditButton 
                                          onClick={() => handleEditClick(stock)} 
                                          />
                                          <DeleteButton 
                                              buttonText={deletingId === stock.id ? 'Deleting...' : 'Delete'}
                                              item="Diamond Item"
                                              onOpenModal={() => setItemToDelete(stock.id)}
                                              onConfirmDelete={() => handleDeleteStockPoint(itemToDelete)}
                                              disabled={deletingId === stock.id}
                                            />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                    
              
                    {/* Pagination */}
                          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              
                    {/* Modal */}
   

                   
                   </div>
   
                            {modal && (
                              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
                                <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[500px] flex flex-col gap-4 overflow-y-auto" style={{ padding: '20px' }}>
                                  <h3 className="font-bold text-[22px] text-[#344767]">
                                    Create Stock Point</h3>
                                  <hr className="border-gray-300" />

                                  <div className="flex flex-col flex-grow gap-2">
                                    <label className="font-semibold text-xs text-[#344767] w-[80%]">
                                      Name: <span className="text-xs text-red-400">*</span>
                                      </label>
                                    <div>
                                    <input
                                      type="text"
                                      name="name"
                                      placeholder="Type here"
                                      className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"
                                      style={{ paddingLeft: '12px' }}
                                      value={addStockPointData.name}
                                      onChange={handleAddStockPointChange}
                                    />
                                    <p className="text-xs text-red-500">{errors.name}</p>
                                    </div>


                                    <label className="font-semibold text-xs text-[#344767] w-[100%]">Description:</label>
                                    <div>
                                    <textarea
                                      name="description"
                                      placeholder="Description"
                                      className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none focus:border-b-2 focus:border-blue-500"
                                      style={{ paddingLeft: '12px',}}
                                      value={addStockPointData.description}
                                      onChange={handleAddStockPointChange}
                                    ></textarea>
                                    </div>

                                    {/* <label className="font-semibold text-xs text-[#344767] w-[80%]">Status:</label>
                                    <select
                                      name="status"
                                      className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500"
                                      style={{ paddingLeft: '12px' }}
                                      value={addStockPointData.status}
                                      onChange={handleAddStockPointChange}
                                    >
                                      <option value="" className="text-gray-600">Select</option>
                                      <option value="true" className="text-gray-600">Active</option>
                                      <option value="false" className="text-gray-600">InActive</option>
                                    </select> */}
                                  </div>

                                  <div className="flex flex-col sm:flex-row justify-end items-end gap-4">
                                   
                                    <button
                                      type="button"
                                      className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                      style={{ backgroundColor: '#8392ab' }}
                                      onClick={handleCloseModal}
                                    >
                                      Close
                                    </button>
                                     <button
                                      type="button"
                                      className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                      style={{ backgroundColor: '#5E72e4' }}
                                      onClick={handleSubmitStockPoint}
                                    >
                                      Submit
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
                                        Edit Stock Point                     </h3>
                                    <hr className=" border-gray-300"/>
      
                                    <div className="flex flex-col flex-grow gap-2"> {/* Added flex-grow */}
                                   
                                      <label
                                        className="font-semibold text-xs text-[#344767] w-[80%]">
                                           Name:<span className="text-red-500 text-[14px]">*</span>
                                      </label>
                                       <div>
                                      <input type="text" 
                                        placeholder="Type here" 
                                        className="input w-[100%] rounded-lg focus:outline-none bg-white text-gray-500 border-gray-300 focus:border-b-2 focus:border-blue-500"                                       
                                        style={{paddingLeft:'12px'}}
                                        value={editingStockPoint?.name || ''} 
                                        onChange={(e)=>handleEditStockPointChange(e)}
                                        name="name"
                                      /> 
                                      <p className="text-xs text-red-500">{editErrors.name}</p>
                                      </div>
                                      

                                      <label 
                                        
                                        className="font-semibold text-xs text-[#344767] w-[100%]"
                                       >
                                        Description:
                                      </label>
                                      <div>
                                      <textarea className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                                        placeholder="Description" 
                                        style={{paddingLeft:'12px',}}
                                        value={editingStockPoint.description}
                                        onChange={handleEditStockPointChange}
                                        name="description"
                                      ></textarea>
                                       </div>
                                           
                                            <label 
                                                
                                                className="font-semibold text-xs text-[#344767] w-[80%]"
                                            >
                                                Status:
                                            </label>
                                            <div>
                                            <select defaultValue=""
                                                className="select w-[100%] h-[35px] bg-white border-gray-300 focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                                                style={{paddingLeft:'12px'}}
                                                value={String(editingStockPoint?.status)}
                                                onChange={handleEditStockPointChange}
                                                name='status'
                                            >
                                                <option value="" className=" text-gray-600 text-xs">-- Select Status -- </option>
                                                <option value={true} className=" text-gray-600 text-xs"> Active</option>
                                                <option value={false} className=" text-gray-600 text-xs"> InActive</option>
                                            </select>
                                              </div>
                                            </div> 
                                            {/* Button container positioned 10px above bottom */}
                                            <div className="flex flex-col sm:flex-row justify-end items-end gap-4  " 
                                                >
                                            <button
                                                type="button"
                                                className="btn w-[100px] h-[35px]  rounded-lg text-white border-none"
                                                style={{ backgroundColor: '#8392ab' }}
                                                onClick={handleEditCloseModal}
                                            >
                                                Close
                                            </button>
                                            <button
                                              type="button"
                                              className="btn w-[100px] h-[35px] rounded-lg text-white border-none"
                                              style={{ backgroundColor: '#5E72E4' }}
                                              onClick={handleEditSubmit}
                                              disabled={isSubmitting}
                                            >
                                              {isSubmitting ? 'Updating...' : 'Update'}
                                            </button>
                                            </div>
                                        </div>
                        </div>)}
   
                      
                 </>)
}
export default StockPoint
