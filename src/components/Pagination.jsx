const Pagination=()=>{


    return(
         <div className="flex gap-1 justify-center" style={{margin:'10px'}}>
                         <button className="btn rounded-full bg-white w-[40px] h-[40px] flex items-center justify-center font-bold text-gray-500 border border-gray-100">
                           {'<'}
                         </button>
                         <button className="btn rounded-full w-[40px] h-[40px] flex items-center justify-center font-semibold bg-[#5E72E4] text-white border-none">
                           1
                         </button>
                         <button className="btn rounded-full bg-white w-[40px] h-[40px] flex items-center justify-center font-bold text-gray-500 border border-gray-100">
                           {'>'}
                         </button>
                       </div>
    )
}

export default Pagination