import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    isFirst,
    isLast
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
            <button
                className="btn"
                style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-card)', color: 'var(--color-text-main)' }}
                disabled={isFirst}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <FontAwesomeIcon icon={faChevronLeft} /> Previous
            </button>

            <span style={{ color: 'var(--color-text-muted)' }}>
                Page {currentPage + 1} of {totalPages}
            </span>

            <button
                className="btn"
                style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-card)', color: 'var(--color-text-main)' }}
                disabled={isLast}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next <FontAwesomeIcon icon={faChevronRight} />
            </button>
        </div>
    );
};

export default Pagination;
