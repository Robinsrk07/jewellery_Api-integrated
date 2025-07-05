import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import colorModel from "../../../models/colorModel";
import EditButton from '../../../components/EditButton';
import DeleteButton from '../../../components/DeleteButton';
import CreateButton from '../../../components/CreateButton';
import Pagination from '../../../components/Pagination';
import CustomScrollbar from "../../../components/CustomScrollbar";
import ItemsPerPageSelector from '../../../components/ItemsPerPageSelector';



const Color = ()=>{

                const [isHovered, setIsHovered] = useState(false);
                const [modal, setModal] = useState(false);
                const [editModal, setEditModal] = useState(false);

                
                const [colorData, setColorData] = useState([]);
                const [editingColor, setEditingColor] = useState(null);
                const [editingColorId, setEditingColorId] = useState(null);
                const [editingHex, setEditingHex] = useState('');

                
                const [limit, setLimit] = useState(10);
                const [page, setPage] = useState(1);
                const [search, setSearch] = useState('');
                const [status, setStatus] = useState('');

                
                const [addColorData, setAddColorData] = useState({
                  name: '',
                  code: '',
                  hex_code: '#000000',
                  color: '#000000',
                  description: '',
                  status: '',
                });

                
                const [errors, setErrors] = useState({});
                const [editErrors, setEditErrors] = useState({});

                
                const [isSubmitting, setIsSubmitting] = useState(false);

               
                const auth = useSelector((state) => state.auth);
                const user_id = auth?.login_id;
                const user_types = Object.keys(auth?.can_manage_user_types || {}).join(',');


                const fetchColors = async () => {
                  try {
                    const response = await colorModel.getColors(user_id, user_types, limit, page, search, status);
                    if (response.data?.data) {
                      setColorData(response.data.data);
                    } else {
                      toast.error("Unable to fetch colors");
                    }
                  } catch (error) {
                    console.error("Fetch error:", error);
                    toast.error("Failed to load colors");
                  }
                };

                useEffect(() => {
                  fetchColors();
                }, [limit, page, search, status]);

                const handleAddColorChange = (e) => {
                  const { name, value } = e.target;
                  setAddColorData((prev) => ({
                    ...prev,
                    [name]: value,
                    ...(name === 'hex_code' && { color: value }),
                    ...(name === 'color' && { hex_code: value }),
                  }));
                };


                const validateColor = () => {
                  const newErrors = {};
                  const { name, code, hex_code, color, description, status } = addColorData;

                  if (!name.trim()) newErrors.name = 'Please enter name';
                  if (!code.trim()) newErrors.code = 'Please enter code';
                  if (!hex_code.trim()) newErrors.hex_code = 'Please enter hex code';
                  if (!color.trim()) newErrors.color = 'Please enter color';
                  if (!description.trim()) newErrors.description = 'Please enter description';
                  if (status === '') newErrors.status = 'Please select status';

                  return newErrors;
                };


                const handleSubmitColor = async () => {
                  const validationErrors = validateColor();
                  if (Object.keys(validationErrors).length > 0) {
                    setErrors(validationErrors);
                    return;
                  }

                  const payload = {
                    ...addColorData,
                    status: addColorData.status === 'true',
                    created_by: user_id,
                    created_by_type: user_types,
                  };

                  try {
                    const response = await colorModel.createColor(payload);
                    if (response.status === 200 || response.status === 201) {
                      fetchColors();
                      handleCloseModal();
                      toast.success('Color created successfully!');
                    }
                  } catch (error) {
                    console.error("Create error:", error);
                    toast.error('Failed to create color!');
                    if (error.response?.data?.errors) {
                      setErrors((prev) => ({ ...prev, ...error.response.data.errors }));
                    }
                  }
                };


                const handleEditClickColor = (colorObj) => {
                  if (!colorObj?.id) {
                    toast.error("Invalid color selected.");
                    return;
                  }

                  setEditingColor({ ...colorObj });
                  setEditModal(true);
                };
                const handleEditColorChange = (e) => {
                const { name, value } = e.target;
                setEditingColor((prev) => ({
                  ...prev,
                  [name]: name === 'status' ? value === 'true' : value,  
                }));
              };


                const handleEditColorPickerChange = (e) => {
                  const newColor = e.target.value;
                  setEditingColor((prev) => ({
                    ...prev,
                    hex_code: newColor,
                    color: newColor,
                  }));
                };


                const validateEditColor = () => {
                  const newErrors = {};
                  const { name, code, hex_code, color, description, status } = editingColor || {};

                  if (!name?.trim()) newErrors.name = 'Name is required';
                  if (!code?.trim()) newErrors.code = 'Code is required';
                  if (!hex_code?.trim()) newErrors.hex_code = 'Hex code is required';
                  if (!color?.trim()) newErrors.color = 'Color is required';
                  if (!description?.trim()) newErrors.description = 'Description is required';
                  if (status === undefined || status === '') newErrors.status = 'Status is required';

                  setEditErrors(newErrors);
                  return Object.keys(newErrors).length === 0;
                };

                const handleEditSubmitColor = async () => {
                  if (!editingColor?.id) {
                    toast.error("Invalid color selected for editing.");
                    return;
                  }

                  if (!validateEditColor()) return;

                  setIsSubmitting(true);
                  try {
                    const payload = {
                      ...editingColor,
                      status: editingColor.status === true || editingColor.status === 'true',
                    };

                    const response = await colorModel.updateColor(editingColor.id, payload);
                    if (response.status === 200) {
                      fetchColors();
                      toast.success('Color updated successfully!');
                      setEditModal(false);
                    }
                  } catch (error) {
                    console.error("Update error:", error);
                    toast.error('Failed to update color!');
                    if (error.response?.data?.errors) {
                      setEditErrors((prev) => ({ ...prev, ...error.response.data.errors }));
                    }
                  } finally {
                    setIsSubmitting(false);
                  }
                };

                const handleDeleteColor = async (id) => {
                console.log("Deleting color with ID:", id);
                if (!id) return;

                try {
                  await colorModel.deleteColor(id);

                  setColorData((prevData) => prevData.filter((item) => item.id !== id)); 

                  const modal = document.getElementById('my_modal_8'); 
                  if (modal && typeof modal.close === 'function') {
                    modal.close();
                  }

                  toast.success('Color deleted successfully');
                } catch (error) {
                  console.error("Error deleting color:", error);
                  toast.error('Failed to delete color');
                }
              };


                const handleCloseModal = () => setModal(false);
                const handleEditCloseModal = () => setEditModal(false);


    

  return (
    
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
                <CreateButton
            buttoncontent="+ New Color"
            onClick={() => setModal(true)}  
             />                 
            {/* <ItemsPerPageSelector items={items} setItems={setItems} /> */}

      

      

              <table className="table w-full text-sm text-left text-gray-500" 
              style={{ borderSpacing: '0 12px', borderCollapse: 'separate', minWidth: '1200px' }}>
              <thead className="text-xs text-gray-400 uppercase bg-white">
                <tr>
                  <th style={{ width: '70px', paddingLeft: '20px' }}>SL NO</th>
                  <th style={{ width: '100px' }}>CODE</th>
                  <th style={{ width: '70px' }}>HEX CODE</th>
                  <th style={{ width: '80px' }}>NAME</th>
                  <th style={{ width: '100px' }}>COLOR</th>
                  <th style={{ width: '150px' }}>DESCRIPTION</th>
                  <th style={{ width: '100px' }}>STATUS</th>
                  <th style={{ width: '140px' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {colorData.map((color, index) =>(
                  <tr key={color.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                    <td className="border-b border-gray-200 text-xs" style={{ paddingLeft: '40px' }}>{index+1}</td>
                    <td className="border-b border-gray-200 text-xs">{color.code}</td>
                    <td className="border-b border-gray-200 text-xs">{color.hex_code}</td>
                    <td className="border-b border-gray-200 text-xs">{color.name}</td>
                    <td className="border-b border-gray-200 text-xs" style={{ paddingLeft: '10px' }}>
                      <div 
                        style={{ 
                          width: '20px', 
                          height: '20px', 
                          backgroundColor: color.hex_code, 
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}
                      ></div>
                    </td>
                    <td className="border-b border-gray-200">{color.description}</td>
                    <td className="px-6 py-5 border-b border-gray-200 text-xs">
                      {color.status ? (
                        <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                          Active
                        </span>
                        ) : (
                        <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                          INACTIVE
                        </span>
                      )}
                    </td>
                    <td className="border-b border-gray-200 text-blue-600">
                        <div className="flex flex-row  gap-2"> 
                          <EditButton
                          onClick={()=>handleEditClickColor(color)}
                          />

                          <DeleteButton 
                            buttonText="Delete Color" 
                            modalId={`delete_modal_${color.id}`} 
                            onConfirmDelete={() => handleDeleteColor(color.id)}
                          />
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> 
            

     <Pagination/>

  {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
              <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[650px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}> 
                                                
                                                {/* Added flex-col */}
                    <h3 className="font-bold text-[22px] text-[#344767] pl-4 pt-2 sm:pl-6 sm:pt-4 md:pl-8 md:pt-6">
                    Create Color                        
                    </h3>
                    <hr className="my-4 border-gray-300" />
                    <div className="flex flex-col gap-2 flex-grow"> {/* Added flex-grow */}
                      <label 
                      className="font-semibold text-xs text-[#344767] w-[100%]">
                          Name:
                      </label>
                      <input type="text" 
                        placeholder="Type here" 
                        className="input input-sm w-[100%] border-gray-300 text-gray-500 bg-white rounded-lg focus:outline-none bg-gray-100 focus:border-b-2 focus:border-blue-500"                                       
                        value={addColorData.name}
                        onChange={handleAddColorChange}
                        name="name"
                        style={{paddingLeft:'12px',}}
                      />
                      <label 
                      className="font-semibold text-xs text-[#344767] w-[100%]">
                          Code:
                      </label>
                      <input type="text" 
                        placeholder="Type here" 
                        className="input input-sm w-[100%] rounded-lg border-gray-300 text-gray-500 bg-white focus:outline-none bg-gray-100 focus:border-b-2 focus:border-blue-500"                                       
                        style={{paddingLeft:'12px',}}
                        value={addColorData.code}
                        onChange={handleAddColorChange}
                        name="code"
                      />
                      <label 
                      className="font-semibold text-xs text-[#344767] w-[100%]">
                            Hex code:
                      </label>
                      <input type="text" 
                        name="hex_code"
                        value={addColorData.hex_code}
                        onChange={handleAddColorChange}
                        className="input w-full border-gray-300 text-gray-500 text-xs bg-white rounded-lg focus:outline-none bg-gray-100 focus:border-b-2 focus:border-blue-500"
                        style={{ paddingLeft: '12px', }}
                        placeholder="#000000"
                      />
                      <label className="font-semibold text-xs text-[#344767] w-[100%]">
                              Color:
                      </label>
                      <div className="flex items-center gap-2 w-full">
                      <input 
                        type="color"
                        name="color"
                        value={addColorData.color}
                        onChange={handleAddColorChange}
                        className="h-5 w-full cursor-pointer rounded border border-gray-300"
                      />
                      </div>
                                      

                      <label 
                        className="font-semibold text-xs text-[#344767] w-[100%]">
                          Description:
                      </label>
                      <textarea 
                      className="textarea w-[100%] text-xs  border-gray-300 text-gray-500 bg-white rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                      placeholder="Description" 
                      value={addColorData.description}
                      onChange={handleAddColorChange}
                      name="description"
                      style={{padding:'12px'}}
                      ></textarea>
                            
                                           
                      <label 
                       className="font-semibold text-xs text-[#344767] w-[100%]">
                          Status:
                      </label>
                      <select defaultValue=""
                        className="select w-[100%] h-[35px] border-gray-300 text-gray-500 bg-white focus:outline-none text-gray-400 rounded-lg focus:border-b-2 focus:border-blue-500" 
                        value={addColorData.status}
                        onChange={handleAddColorChange}
                        name="status" 
                      >
                       <option value="" className="text-gray-600">Select</option>
                       <option value="true" className="text-gray-600">Active</option>
                       <option value="false" className="text-gray-600">InActive</option>
                      </select>
            
                    </div> 
                    {/* Button container positioned 10px above bottom */}
                    <div className="flex flex-col gap-2 sm:flex-row justify-end items-end ">
                      <button
                          type="button"
                          className="btn w-[100px] rounded-lg text-white border-none"
                          style={{ backgroundColor: '#5E72e4' }}
                          onClick={(e) => handleSubmitColor(e)}>
                            Create
                      </button>
                      <button
                        type="button"
                        className="btn w-[100px]  rounded-lg text-white border-none"
                        style={{ backgroundColor: '#8392ab' }} 
                         onClick={handleCloseModal}
                      >
                        Close
                       </button>
                    </div>
              </div>
        </div>
              )}      
      
      
  {editModal &&  (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
              <div className="bg-white rounded-xl shadow-md w-[90vw] max-w-[500px] h-[95vh] max-h-[650px] flex flex-col gap-3 overflow-y-auto" style={{padding:'20px'}}> 
                <h3 className="font-bold text-[22px] text-[#344767] pl-4 pt-2 sm:pl-6 sm:pt-4 md:pl-8 md:pt-6">
                   Edit Color                        
                </h3>
                <hr className="my-4 border-gray-300" />
                <div className="flex flex-col gap-2 flex-grow"> 
                  <label 
                    className="font-semibold text-xs text-[#344767] w-[100%]">
                      Name:
                  </label>
                  <input type="text" 
                    placeholder="Type here" 
                    className="input input-sm w-[100%] border-gray-300 text-gray-500 bg-white rounded-lg focus:outline-none bg-gray-100 focus:border-b-2 focus:border-blue-500"                                       
                    value={editingColor.name}
                    onChange={handleEditColorChange}
                    name="name"
                    style={{paddingLeft:'12px',}}
                  />
                  <label 
                    className="font-semibold text-xs text-[#344767] w-[100%]">
                      Code:
                  </label>
                  <input type="text" 
                    placeholder="Type here" 
                    className="input input-sm w-[100%] rounded-lg border-gray-300 text-gray-500 bg-white focus:outline-none bg-gray-100 focus:border-b-2 focus:border-blue-500"                                       
                    style={{paddingLeft:'12px',}}
                    value={editingColor.code}
                    onChange={handleEditColorChange}
                    name="code"
                  />
                  <label 
                    className="font-semibold text-xs text-[#344767] w-[100%]">
                      Hex code:
                  </label>
                  <input type="text" 
                    placeholder="Type here" 
                    className="input w-[100%] border-gray-300 text-gray-500 text-xs bg-white rounded-lg focus:outline-none bg-gray-100 focus:border-b-2 focus:border-blue-500"                                       
                    style={{paddingLeft:'12px',}}
                    value={editingColor.hex_code}
                    onChange={handleEditColorPickerChange}
                    name="hex_code"
                  />
                  <label 
                    className="font-semibold text-xs text-[#344767] w-[100%]">
                        Color:
                  </label>
                  <div className="flex items-center gap-2 w-full">
                  <input 
                    type="color"
                    className="h-5 w-full cursor-pointer rounded border border-gray-300"
                    value={editingColor.hex_code} 
                    onChange={handleEditColorPickerChange}
                    name="color"
                    />
                  </div>
                  <label 
                        className="font-semibold text-xs text-[#344767] w-[100%]">
                          Description:
                    </label>
                    <textarea 
                      className="textarea w-[100%] bg-white border-gray-300 text-gray-500 rounded-lg focus:outline-none  focus:border-b-2 focus:border-blue-500" 
                      placeholder="Description" 
                      style={{paddingLeft:'12px',}}
                      value={editingColor.description}
                      onChange={handleEditColorChange}
                      name="description"
                    ></textarea>
                  <label 
                    className="font-semibold text-xs text-[#344767] w-[100%]">
                      Status:
                  </label>
                  <select defaultValue=""
                    className="select w-[100%] h-[35px] border-gray-300 bg-white focus:outline-none text-gray-500 rounded-lg focus:border-b-2 focus:border-blue-500" 
                    value={String(editingColor?.status)}
                    onChange={handleEditColorChange}
                    name='status'
                  >
                    <option value="" className=" text-gray-600">Select </option>
                    <option value={true} className=" text-gray-600"> Active</option>
                    <option value={false} className=" text-gray-600"> InActive</option>
                  </select>
            
                </div> 
                {/* Button container positioned 10px above bottom */}
                <div className="flex flex-col gap-2 sm:flex-row justify-end items-end " 
                >
                <div className="flex flex-col gap-2 sm:flex-row justify-end items-end mt-4">
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
                    onClick={handleEditSubmitColor}
                    disabled={isSubmitting}
                  >
                  {isSubmitting ? 'Updating...' : 'Update'}
                  </button>
                </div>


                </div>
              </div>
        </div>
         )}
                              
     </div>
     </>
    
  );
}

export default Color