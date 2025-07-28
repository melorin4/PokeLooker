import React, { useState } from 'react';


const Pagination = ({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  startItem,
  endItem,
  onPageChange
}) => {
  const [pageInput, setPageInput] = useState("");

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(pageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setPageInput("");
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToFirstPage = () => {
    onPageChange(1);
  };

  const goToLastPage = () => {
    onPageChange(totalPages);
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span>Showing {startItem}-{endItem} of {totalCount} Pokémon</span>
      </div>
      
      <div className="pagination-controls">
        <button 
          className="btn pagination-btn first-last" 
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          title="First page"
        >
          ⟪
        </button>
        
        <button 
          className="btn pagination-btn" 
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          title="Previous page"
        >
          ⟨ Prev
        </button>
        
        <div className="page-info">
          <span className="page-display">
            Page {currentPage} of {totalPages}
          </span>
          
          <form onSubmit={handlePageInputSubmit} className="page-input-form">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder="Go to..."
              className="page-input"
              title={`Enter page number (1-${totalPages})`}
            />
            <button type="submit" className="btn page-go-btn" disabled={!pageInput}>
              Go
            </button>
          </form>
        </div>
        
        <button 
          className="btn pagination-btn" 
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          title="Next page"
        >
          Next ⟩
        </button>
        
        <button 
          className="btn pagination-btn first-last" 
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
          title="Last page"
        >
          ⟫
        </button>
      </div>
    </div>
  );
};

export default Pagination;
