import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import CustomScrollbar from "../../components/CustomScrollbar";
import TableSkelton from "../../components/tableSkelton";
import employeeDepartmentModel from "../../models/employeeDepartmentModel";
import employeePositionModel from "../../models/employeePositionModel";
import employeeModel from "../../models/employeeModel";
import Pagination from '../../components/Pagination';
import ItemsPerPageSelector from '../../components/ItemsPerPageSelector';
import { useSelector } from "react-redux";
import { Link } from "react-router";
const PaySlip = () => {
    //its a initial page which list employee for creating payslip
    
    const[limit,setLimit]=useState(10);   
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [employees,setEmployees] =useState([])
	const auth = useSelector((state) => state.auth || {});
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const[search,setSearch] = useState('')
    const [status,setStatus] = useState('')
	const { login_id ,can_manage_user_types,} = auth;	
	const user_id = login_id 
	const user_types = Object.keys(can_manage_user_types).join(',');
    
    const getValueFromId = (id, field, key = 'name') => {
		if (!Array.isArray(field)) return '—'; // Ensure it's a valid array
		const item = field.find((entry) => entry?.id === id);
		return item?.[key] || '—'; // Safe access
	};
    
 

  


            //     const fetchEmployees = async ()=>{
                    
            //     try{
            //         const res = await  employeeModel.getEmployees(user_id, user_types, limit, page, search, status)
            //      console.log(res)
            //         setEmployees(res?.data?.data)
            //        // setTotalPages(res.data.pagination.page);
            //     }catch(error){ 
            //         console.error("Error loading employees:", error);
            //     }finally{
            //         setIsLoading(false)
            //     }
            // }


           useEffect(() => {
                let isMounted = true; 

                const fetchDepartments = async () => {
                    try {
                    const res = await employeeDepartmentModel.getDepartments(user_id, user_types, 1000, page, search, status);
                    if (isMounted) {
                        setDepartments(res?.data?.data || res?.data || []);
                    }
                    } catch (err) {
                    if (isMounted) {
                        console.error("Error loading departments:", err);
                    }
                    }
                };

                fetchDepartments();

                return () => {
                    isMounted = false; 
                };
                }, []);



         useEffect(() => {
           let isMounted = true; 

            const fetchPositions = async () => {
                try {
                const res = await employeePositionModel.getPositions(user_id, user_types, 1000, page, search, status);
                if (isMounted) {
                    setPositions(res?.data?.data || res?.data || []);
                }
                } catch (err) {
                if (isMounted) {
                    console.error("Error loading positions:", err);
                }
                }
            };

            fetchPositions();

       
            return () => {
                isMounted = false;
            };
            }, []);

            

        useEffect(() => {
        let isMounted = true;

        const fetchEmployees = async () => {
            try {
            const res = await employeeModel.getEmployees(user_id, user_types, limit, page, search, status);
            if (isMounted) {
                setEmployees(res?.data?.data || []);
            }
            } catch (error) {
            if (isMounted) {
                console.error('Error fetching employees:', error);
            }
            }finally{
                setIsLoading(false)
            }
        };

        fetchEmployees();

        return () => {
            isMounted = false; // Cleanup: prevents state update after unmount
        };
        }, [user_id, user_types, limit, page, search, status]);


   

    return (
        <>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 3px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgb(218, 216, 216);
                    border-radius: 3px;
                    border: 1px solid rgb(206, 198, 198);
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgb(202, 190, 190);
                }
                
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgb(226, 215, 215) #f1f1f1;
                }
            `}</style>

            <div className="bg-white w-full
                max-w-[99vw] 
                xl:max-w-[90vw] 
                2xl:max-w-[95vw] 
                h-auto max-h-[80vh] 
                rounded-xl px-4 md:px-8 lg:px-12
                mx-auto overflow-auto custom-scrollbar text-gray-500"
                style={{ fontFamily: 'Open Sans', overflow: 'auto' }}
            >
                
                        <div
                            className="flex flex-row justify-between gap-20 w-full"
                            style={{
                                position: 'sticky',
                                top: 0,
                                backgroundColor: 'white',
                                zIndex: 30,
                                padding: '10px',
                                paddingTop: '30px',
                            }}
                        >
                             <ItemsPerPageSelector items={limit} setItems={setLimit} />

                            <input
                                type="text"
                                placeholder="Search employee..."
                                className="border input bg-white border-gray-300 rounded-sm text-sm w-[300px] focus:border-blue-300"
                                style={{ padding: '10px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <table className="table w-full text-sm text-left text-gray-500 border-collapse min-w-[1000px]" style={{ borderSpacing: '0 12px', borderCollapse: 'separate' }}>
                            <thead>
                                <tr className="sticky text-gray-400">
                                    <th className="sticky" style={{ width: '90px', paddingLeft: '20px' }}>SL NO</th>
                                    <th style={{ width: '100px' }}>NAME</th>
                                    <th style={{ width: '100px' }}>EMPLOYEE ID</th>
                                    <th style={{ width: '90px' }}>DEPARTMENT</th>
                                    <th style={{ width: '90px' }}>DESIGNATION</th>
                                    <th style={{ width: '90px' }}>PHONE NUMBER</th>
                                    <th style={{ width: '100px' }}>PAYSLIP</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                <TableSkelton />
                                ) : employees.length === 0 ? (
                                <tr >
                                    <td colSpan={17} className="text-center py-4 text-gray-500 text-sm">
                                    No data available
                                    </td>
                                </tr>
                                ) :employees
                                    .filter((emp) =>
                                        (emp?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                        (getValueFromId(emp?.department, departments) || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (getValueFromId(emp?.designation, positions) || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (emp?.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase())
                                    )

                                    .map((emp, index) => (
                                        <tr key={emp.id} className="bg-white hover:bg-gray-50 h-[44px] text-gray-400">
                                            <td className="px-6 py-5 border-b border-gray-200 text-xs" style={{ paddingLeft: '20px' }}>{index + 1}</td>
                                            <td className="px-6 py-5 border-b border-gray-200 text-xs">{emp.name}</td>
                                            <td className="px-6 py-5 border-b border-gray-200 text-xs">{emp.id}</td>
                                            <td className="px-6 py-5 border-b border-gray-200 text-xs">{getValueFromId(emp.department,departments)}</td>
                                            <td className="px-6 py-5 border-b border-gray-200 text-xs">
                                                {getValueFromId(emp.position,positions)}
                                            </td>
                                            <td className="px-6 py-5 border-b border-gray-200 text-xs">{emp.phone_number}</td>
                                            <td className="px-6 py-5 border-b border-gray-200 text-xs ">
                                                <div className="flex flex-row gap-2">
                                                <Link to='/dashboard/createPayslip' state={{
                                                                                    id: emp.id,
                                                                                    name: emp.name,
                                                                                    department: getValueFromId(emp.department,departments),
                                                                                    departmentId: emp.department,
                                                                                    position: getValueFromId(emp.position,positions),
                                                                                    positionId: emp.position,
                                                                                }}>
                                                 <button className="w-[100px] h-[25px] text-white rounded-sm bg-[#646FE4]">Create Payslip</button>
                                                </Link>
                                               <Link to={`/dashboard/paysliplist/${emp?.id}`}>
                                                 <button className="w-[100px] h-[25px] text-white rounded-sm bg-[#646FE4]">View</button>
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
}

export default PaySlip;