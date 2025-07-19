import { useState, useCallback, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Save, X, Upload, Eye, Calculator, ArrowLeft } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomScrollbar from "../../components/CustomScrollbar";

import TableSkelton from "../../components/tableSkelton";
import PayslipModel from "../../models/PayslipModel";
import employeeModel from "../../models/employeeModel";
import CreateButton from "../../components/CreateButton";
import EditButton from "../../components/EditButton";
import DeleteButton from "../../components/DeleteButton";
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import employeeDepartmentModel from "../../models/employeeDepartmentModel";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router";
const PayslipList = () => {
  
    const[limit,setLimit]=useState(10);  
    const [totalPages, setTotalPages] = useState(1);
    const [search,setSearch] = useState('');
    const [viewAll,setViewAll]= useState(false)
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [status,setStatus] =useState('')
    const [page,setPage] =useState(1)
    const [payslips, setPayslips] = useState([]);
    const auth = useSelector((state) => state.auth || {});
    const { login_id ,can_manage_user_types,} = auth;    
    const [deletingId, setDeletingId] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const {id} = useParams()
    console.log(itemToDelete)
    const user_id = login_id 
    const user_types = Object.keys(can_manage_user_types).join(',');


    const getValueFromId = (id, field, key = 'name') => {
                  if (!Array.isArray(field)) return '—'; // Ensure it's a valid array
                  const item = field.find((entry) => entry?.id === id);
                  return item?.[key] || '—'; // Safe access
                };
                
   const fetchPaySlipList = async () => {
    try {
      const res = await PayslipModel.getPayslip(
        user_id, user_types, limit, page, search, status
      );
      
        setPayslips(res?.data?.data || []);
        setTotalPages(res?.data?.pagination?.pages || 1);
      
    } catch (error) {
     console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

   const handleDeletePayslip = async (payslipId) => {
    
        if (!payslipId) return toast.error("Sorry We Are Unable to Delete PaySlip");
        try {
            setDeletingId(payslipId);
            await PayslipModel.deletePayslip(payslipId)
            await fetchPaySlipList();
            toast.success("Payslip deleted Succesfully");
        } catch {
            toast.error("Sorry, Unable to delete Payslip");
        } finally {
            setDeletingId(null);
        }
    };

  
           
  
  useEffect(() => {
  let isMounted = true;

  const fetchDepartments = async () => {
    try {
      const res = await employeeDepartmentModel.getDepartments(
        user_id, user_types, 1000, page, search, status
      );
      if (isMounted) {
        setDepartments(res?.data?.data || res?.data || []);
      }
    } catch (err) {
      if (isMounted) console.error("Error loading departments:", err);
    }
  };

  fetchDepartments();

  return () => {
    isMounted = false;
  };
}, [user_id, user_types, page, search, status]); 


 useEffect(() => {
  let isMounted = true;

  const fetchEmployees = async () => {
    try {
      const res = await employeeModel.getEmployees(
        user_id, user_types, limit, page, search, status
      );
      if (isMounted) {
        setEmployees(res?.data?.data || []);
        setTotalPages(res?.data?.pagination?.pages || 1);
      }
    } catch (error) {
      if (isMounted) console.error("Error loading employees:", error);
    }
  };

  fetchEmployees();

  return () => {
    isMounted = false;
  };
}, [user_id, user_types, limit, page, search, status]); // ✅ Reactive to changes


 const selectedEmployeePayslip = viewAll
  ? payslips
  : payslips.filter((payslip) => payslip.employee == id);



 useEffect(() => {
  let isMounted = true;

  const fetchPaySlipList = async () => {
    try {
      const res = await PayslipModel.getPayslip(
        user_id, user_types, limit, page, search, status
      );
      if (isMounted) {
        setPayslips(res?.data?.data || []);
        setTotalPages(res?.data?.pagination?.pages || 1);
      }
    } catch (error) {
      if (isMounted) console.error(error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  fetchPaySlipList();

  return () => {
    isMounted = false;
  };
}, [user_id, user_types, limit, page, search, status]); // ✅ Responsive to filters


    return (
        <>
            <CustomScrollbar/>

            <div className="bg-white w-full
                max-w-[99vw] 
                xl:max-w-[90vw] 
                2xl:max-w-[95vw] 
                h-auto max-h-[70vh] 
                rounded-xl px-4 md:px-8 lg:px-12
                mx-auto overflow-auto custom-scrollbar text-gray-500"
                style={{ fontFamily: 'Open Sans', overflow: 'auto'}}
            >
                <CreateButton buttoncontent={viewAll ? "View Single Payslip" : "View All Payslips"} onClick={() => setViewAll(!viewAll)} />
                <ItemsPerPageSelector items={limit} setItems={setLimit} />

               
               
                            <div className="overflow-x-auto" style={{padding:'10px'}}>
                                <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1200px]" style={{ borderSpacing: '0 12px', borderCollapse: 'separate' }}>
                                    <thead style={{margin:'100px'}}>
                                        <tr className="sticky text-gray-400">
                                            <th  style={{ width: '100px' }}>Employee ID</th>
                                            <th  style={{ width: '100px' }}>Employee Name</th>
                                            <th  style={{ width: '100px' }}>Department</th>
                                            <th  style={{ width: '90px' }}>Pay Period</th>
                                            <th  style={{ width: '90px' }}>Gross Earnings</th>
                                            <th  style={{ width: '90px' }}>Total Deductions</th>
                                            <th  style={{ width: '100px' }}>Net Salary</th>
                                            <th  style={{ width: '100px' }}>Is Paid</th>
                                            <th  style={{ width: '90px' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <TableSkelton />
                                            ) : selectedEmployeePayslip.length === 0 ? (
                                            <tr >
                                                <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
                                                No data available
                                                </td>
                                            </tr>
                                            ) : selectedEmployeePayslip.map(payslip => (
                                            <tr key={payslip.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                                                <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{paddingLeft:'20px'}}>
                                                   {payslip.employee}
                                                </td>
                                                <td className="px-6 py-5 border-b border-gray-100 text-xs">{getValueFromId(payslip.employee,employees)}</td>
                                                <td className="px-6 py-5 border-b border-gray-100 text-xs">{getValueFromId(payslip.department,departments)}</td>
                                                <td className="px-6 py-5 border-b border-gray-100 text-xs">{payslip.salary_month}</td>
                                                <td className="px-6 py-5 border-b border-gray-100 text-xs">{payslip.gross_earnings}</td>
                                                <td className="px-6 py-5 border-b border-gray-100 text-xs">{payslip.total_deductions}</td>
                                                <td className="px-6 py-5 border-b border-gray-100 text-xs">{payslip.net_salary}</td>
                                               <td className="px-6 py-5 border-b border-gray-100 text-xs">
                                                                                {payslip.is_paid ? 'Paid' : 'Not Paid'}
                                                                                </td>

                                                <td className="px-6 py-5 border-b border-gray-100 text-xs">
                                                    <div className="flex gap-2.5 items-center">
                                                     <Link to={`/dashboard/editPayslip/${payslip.id}`}  state={{ payslip }}>
                                                    <EditButton/>
                                                     </Link>
                                                    <DeleteButton 
                                                        buttonText={deletingId === payslip.id ? 'Deleting...' : 'Delete'}
                                                        onOpenModal={() => setItemToDelete(payslip)} 
                                                        item={'Payslip'}
                                                        onConfirmDelete={() => handleDeletePayslip(itemToDelete?.id)}
                                                        disabled={deletingId === payslip.id}
                                                    />
                                                                      
                                                    
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
              

               
            </div>
        </>
    );
}

export default PayslipList;