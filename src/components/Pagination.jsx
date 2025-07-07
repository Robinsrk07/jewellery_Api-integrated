const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <div className="flex gap-1 justify-center" style={{ margin: '10px' }}>
      <button
        className="btn rounded-full bg-white w-[40px] h-[40px] flex items-center justify-center font-bold text-gray-500 border border-gray-100"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        {'<'}
      </button>
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx + 1}
          className={`btn rounded-full w-[40px] h-[40px] flex items-center justify-center font-semibold ${
            page === idx + 1 ? 'bg-[#5E72E4] text-white' : 'bg-white text-gray-500'
          } border-none`}
          onClick={() => onPageChange(idx + 1)}
        >
          {idx + 1}
        </button>
      ))}
      <button
        className="btn rounded-full bg-white w-[40px] h-[40px] flex items-center justify-center font-bold text-gray-500 border border-gray-100"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        {'>'}
      </button>
    </div>
  );
};

export default Pagination;