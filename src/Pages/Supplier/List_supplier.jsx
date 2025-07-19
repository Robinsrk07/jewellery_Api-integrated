

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import supplierModel from "../../models/supplierModel";
import CurrencyModel from "../../models/currencyModel";
import { Link } from "react-router-dom";
import '@fontsource/open-sans'; // Default weight 400
import CustomScrollbar from "../../components/CustomScrollbar";
import EditButton from '../../components/EditButton';
import DeleteButton from '../../components/DeleteButton';
import CreateButton from '../../components/CreateButton';
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
const List_supplier=()=>{



              const [limit, setLimit] = useState(10);
              const [page, setPage] = useState(1);
              const [status, setStatus] = useState('');
              const [search, setSearch] = useState('');
             


              const [controlAccounts, setControlAccounts] = useState([]);
              const [countries, setCountries] = useState([]);

              const auth = useSelector((state) => state.auth);
              const { login_id, can_manage_user_types } = auth;

              const user_id = login_id;
              const user_types = Object.keys(can_manage_user_types || {}).join(',');
              // For client-side validation
              // const [errors, setErrors] = useState({
              //   code: '',
              //   name: '',
              //   currency: '',
              //   control_account: '',
              //   supplier_group: '',
              //   tax_category: '',
              //   tax_in_no: '',
              //   tin_no: '',
              //   terms_of_payment: '',
              //   eun: '',
              //   supplier_image: '',
              //   address_type: '',
              //   address: '',
              //   language: '',
              //   country: '',
              //   city: '',
              //   zip_code: '',
              //   gsm_no: '',
              //   phone_no: '',
              //   fax_no: '',
              //   email: '',
              //   website: '',
              //   note: '',
              //   bank_name: '',
              //   bank_address: '',
              //   account_holder_name: '',
              //   account_number: '',
              //   account_code: '',
              //   IBAN: '',
              //   status: '',
              // });



                  const [supplierData, setSupplierData] = useState([]);

                  const fetchSuppliers = async () => {
                    try {
                      const response = await supplierModel.getSuppliers(
                        user_id,
                        user_types,
                        limit,
                        page,
                        search,
                        status
                      );

                      

                      if (response.data && response.data.data) {
                        console.log("Suppliers Received:", response.data.data);
                        setSupplierData(response.data.data);
                      } else {
                        toast.error("Unable to fetch suppliers");
                      }
                    } catch (error) {
                      console.error("Error fetching suppliers:", error);
                      toast.error("Failed to load suppliers");
                    }
                  };

                  useEffect(() => {
                    fetchSuppliers();
                  }, [limit, page, search, status]);


                



useEffect(() => {
  const fetchControlAccounts = async () => {

    try {
      const response = await supplierModel.getControlAccounts(user_id, user_types);
      setControlAccounts(response.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch control accounts:", err);
    }
  };

  fetchControlAccounts();
}, []);





useEffect(() => {
  const fetchCountries = async () => {
    try {
      const res = await supplierModel.getCountries(user_id, user_types); 
      setCountries(res.data?.data || []);  
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  fetchCountries();
}, []);

const getControlAccountName = (id) => {
  const account = controlAccounts.find((acc) => acc.id === id);
  return account?.name || 'N/A';
};


const getCountryName = (id) => {
  const country = countries.find((c) => c.id === id);
  return country?.name || 'N/A';
};

const [cities, setCities] = useState([]);

useEffect(() => {
  const fetchCities = async () => {
    try {
      const res = await supplierModel.getCities(user_id, user_types); 

      setCities(res.data?.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  fetchCities();
}, []);

const getCityName = (id) => {
  const city = cities.find((c) => c.id === id);
  return city?.name || 'N/A';
};


const [currencies, setCurrencies] = useState([]);

useEffect(() => {
  const fetchCurrencies = async () => {
    try {
      const response = await CurrencyModel.getCurrency(user_id, user_types);
      setCurrencies(response.data.data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  fetchCurrencies();
}, []);
const getCurrencySymbol = (id) => {
  const currency = currencies.find(c => String(c.id) === String(id));
  return currency?.symbol || 'N/A';
};




const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'ar', name: 'Arabic' },
];

const getLanguageName = (code) => {
  const lang = languages.find(l => l.code === code);
  return lang?.name || 'N/A';
};


const handleEditClick = (supplier) => {
  console.log("Editing Supplier Data before setting:", supplier);

  if (!supplier.id) {
    toast.error("Supplier object is missing `id`");
    return;
  }

  // setEditSupplierData(supplier); // This line was removed as per the edit hint
};




                      const handleDeleteSupplier = async (id) => {
                        if (!id) return;

                        try {
                         
                          await supplierModel.deleteSupplier(id);

                          setSupplierData((prevData) => prevData.filter((item) => item.id !== id));

                          
                          // if (modal && typeof modal.close === 'function') { // This line was removed as per the edit hint
                          //   modal.close();
                          // }

                          toast.success('Supplier deleted successfully');
                        } catch (error) {
                          console.error("Error deleting Supplier:", error);
                          toast.error('Failed to delete Supplier');
                        }
                      };
          
           
           
             const totalPages = Math.ceil(supplierData.length / limit) || 1;
             return (
               
           <>
       <CustomScrollbar/>
          <div className="bg-white w-full
              max-w-[99vw] 
              xl:max-w-[90vw] 
              2xl:max-w-[95vw] 
              h-auto  max-h-[84vh] 
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
                        padding: '0rem',
                        boxSizing: 'border-box',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width: 'fit-content', 
                        minWidth: '100%' 
                        }}
                    >

                      <Link to="/dashboard/supplier/Create_supplier">
                         <CreateButton
                         buttoncontent=" + Create New Supplier "
             /> 
                      </Link>
                      
                    </div>
           
                    <ItemsPerPageSelector items={limit} setItems={setLimit} />

           
                 
           
                 <table 
                    className="table w-full text-sm text-left text-gray-500 border-collapse" 
                    style={{ 
                      borderSpacing: '0 12px', 
                      borderCollapse: 'separate',
                      minWidth: '1200px',
                      tableLayout: 'fixed'
                    }}
                  >
                    <thead className="text-xs text-gray-400 uppercase bg-white">
                      <tr>
                        <th className="px-4 py-3" style={{ paddingLeft: '20px', width: '100px' }}>SL NO</th>
                        <th className="px-4 py-3" style={{ width: '200px' }}>CODE</th>
                        <th className="px-4 py-3" style={{ width: '200px' }}>NAME</th>
                        <th className="px-4 py-3" style={{ width: '120px' }}>CURRENCY</th>
                        <th className="px-4 py-3" style={{ width: '250px' }}>CONTROLL ACCOUNT</th>
                        <th className="px-4 py-3" style={{ width: '150px' }}>EUN</th>
                        <th className="px-4 py-3" style={{ width: '150px' }}>LANGUAGE</th>
                        <th className="px-4 py-3" style={{ width: '150px' }}>COUNTRY</th>
                        <th className="px-4 py-3" style={{ width: '150px' }}>CITY</th>
                        <th className="px-4 py-3" style={{ width: '150px' }}>CREATED TIME</th>
                        <th className="px-4 py-3" style={{ width: '150px' }}>STATUS</th>
                        <th className="px-4 py-3" style={{ width: '150px' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierData.map((supplier, index) => (
                        <tr key={supplier.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                          <td className="px-4 py-4 border-b border-gray-200 text-xs" style={{ paddingLeft: '35px' }}>{index+1}</td>
                          <td className="px-4 py-4 border-b border-gray-200 text-xs">{supplier.code}</td>
                          <td className="px-4 py-4 border-b border-gray-200 text-xs">{supplier.name}</td>
                          <td className="px-4 py-4 border-b border-gray-200 text-xs">{getCurrencySymbol(supplier.currency)}</td>
                          <td className="px-4 py-4 border-b border-gray-200 text-xs">{getControlAccountName(supplier.control_account)}</td>
                          <td className="px-4 py-4 border-b border-gray-200 text-xs">{supplier.eun}</td>
                          <td className="px-4 py-4 border-b border-gray-200 text-xs">{getLanguageName(supplier.language)}</td>
                          <td className="px-4 py-4 border-b border-gray-200 text-xs">{getCountryName(supplier.country)}</td>
                          <td className="px-4 py-4 border-b border-gray-200 text-xs">{getCityName(supplier.city)}</td>

                          <td className="px-4 py-4 border-b border-gray-200 text-xs">{supplier.createdTime}</td>
                          <td className="px-6 py-5 border-b border-gray-200 text-xs">
                            {supplier.status ? (
                              <span className="bg-green-300 font-bold text-[10px] text-green-700 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                  Active
                              </span>
                              ) : (
                              <span className="bg-gray-200 font-bold text-[10px] text-gray-400 px-2 py-0.5 rounded" style={{ padding: '2px 6px' }}>
                                INACTIVE
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200 text-xs" style={{ width: '200px', paddingLeft: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                           
                              <Link 
                                to={`/dashboard/supplier/update_supplier/${supplier.id}`} 
                                state={{ supplier }}
                              >
                                <EditButton onClick={() => handleEditClick(supplier)} />
                              </Link>
                               <DeleteButton 
                                  buttonText="Delete Supplier" 
                                  modalId={`delete_modal_${supplier.id}`} 
                                  onConfirmDelete={() => handleDeleteSupplier(supplier.id)} 
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                              
           
                 <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

                </div>

              </>)}

export default  List_supplier