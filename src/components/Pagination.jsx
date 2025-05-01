const Pagination = ({ totalPosts, postPerPage, currentPage, onPageChange }) => {
    const pageNumbers = [];
  
    for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="flex justify-center mt-4 space-x-2">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              number === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };
  
  export default Pagination;
  