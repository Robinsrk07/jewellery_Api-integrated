import SalesOverviewChart from "./SalesOverviewChart";
import SalesByBranch from "./SalesByBranch";
import Categories from "./Categories";
const Dashboard = () => {
  return (
    <>
      <style jsx global>{`
       .custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; /* Fully transparent */
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(218, 216, 216, 0.5); /* Semi-transparent */
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(202, 190, 190, 0.7); /* Less transparent on hover */
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(226, 215, 215, 0.5) transparent;
}
      `}</style>

      <div
        className="w-full h-[82vh]  overflow-auto custom-scrollbar flex flex-col gap-[25px] "
        style={{ fontFamily: 'Open Sans',paddingBottom:'10px' }}
      >
      
       
       <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-[25px] h-auto">
  {/* Card 1 - GOLD */}
  <div className="w-[100%] md:[60%] lg:w-[240px] h-[142px] rounded-2xl bg-white shadow-md flex justify-between p-4" style={{padding:'18px'}}>
    <div className="flex flex-col justify-between">
      <div className="text-[14px] text-gray-500 font-semibold">GOLD</div>
      <div className="text-[20px] font-bold text-gray-800">₹ 52,000</div>
      <div className="text-[16px] text-green-500 text-justify font-medium">+55% <span className="text-gray-500 font-normal">since yesterday</span></div>
    </div>
    <div className="h-10 w-10 rounded-full bg-violet-500 flex items-center justify-center text-white">
      <i className="fas fa-link"></i>
    </div>
  </div>

  {/* Card 2 - DIAMOND */}
  <div className="w-[100%] md:[60%] lg:w-[240px] h-[142px] rounded-2xl bg-white shadow-md flex justify-between p-4"style={{padding:'18px'}}>
    <div className="flex flex-col justify-between">
      <div className="text-[14px] text-gray-500 font-semibold">DIAMOND</div>
      <div className="text-[20px] font-bold text-gray-800">₹ 72,500</div>
      <div className="text-[16px] text-green-500 font-medium">+3% <span className="text-gray-500 font-normal">since last week</span></div>
    </div>
    <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center text-white">
      <i className="fas fa-gem"></i>
    </div>
  </div>

  {/* Card 3 - NEW BRANCH */}
  <div className="w-[100%] md:[60%] lg:w-[240px] h-[142px] rounded-2xl bg-white shadow-md flex justify-between p-4" style={{padding:'18px'}}>
    <div className="flex flex-col justify-between">
      <div className="text-[14px] text-gray-500 font-semibold">NEW BRANCH</div>
      <div className="text-[20px] font-bold text-gray-800">+1000</div>
      <div className="text-[16px] text-red-500 font-medium">-2% <span className="text-gray-500 font-normal">since last quarter</span></div>
    </div>
    <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center text-white">
      <i className="fas fa-building"></i>
    </div>
  </div>

  {/* Card 4 - SALES */}
  <div className="w-[100%] md:[60%] lg:w-[240px] h-[142px] rounded-2xl bg-white shadow-md flex justify-between "style={{padding:'18px'}}>
    <div className="flex flex-col justify-between">
      <div className="text-[14px] text-gray-500 font-semibold">SALES</div>
      <div className="text-[20px] font-bold text-gray-800">₹ 1,03,4300</div>
      <div className="text-[16px] text-green-500 font-medium">+5% <span className="text-gray-500 font-normal">than last month</span></div>
    </div>
    <div className="h-10 w-10 rounded-full bg-orange-400 flex items-center justify-center text-white">
      <i className="fas fa-shopping-cart"></i>
    </div>
  </div>
</div>

        <div className="flex flex-col md:flex-row items-center justify-center w-full  gap-[25px] shrink-0">
              <div className="w-[90vw] h-[403px] md:w-[60%] rounded-2xl bg-white border border-white" style={{padding:'20px'}}>
                <SalesOverviewChart />
            </div>
             <div className="w-[90vw] h-[403px] md:w-[40%]  rounded-2xl  bg-white ">
                <div className="w-full h-full bg-gray-300 rounded-2xl">GOLD</div>
             </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center w-full  gap-[25px]  shrink-0">
             <div className="w-[90vw] h-[310px] md:w-[60%]  rounded-2xl bg-white "><SalesByBranch/></div>
             <div className="w-[90vw] h-[310px] md:w-[40%]  rounded-2xl  bg-white "><Categories/></div>
        </div>
        
      </div>
    </>
  );
};

export default Dashboard;
