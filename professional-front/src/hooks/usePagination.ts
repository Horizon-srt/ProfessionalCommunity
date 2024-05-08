import { useState } from 'react';

export const usePagination = ({
  offset,
  pageNum
}: {
  offset: number;
  pageNum: number;
}) => {
  const [currentPage, setCurrentPage] = useState(pageNum);
  const nextPage = () => {
    setCurrentPage(c => c + 1);
  };
  const prevPage = () => {
    setCurrentPage(c => c - 1);
  };
  return { offset, pageNum: currentPage, nextPage, prevPage, setCurrentPage };
};
