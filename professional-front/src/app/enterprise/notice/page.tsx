'use client';
import NormalNotice from '@/components/NormalNotice';
import React from 'react';

const Enterprise: React.FC = () => {
  return <NormalNotice />;
};

export default Enterprise;

// 'use client';
// import { AnounceItem } from '@/components/AnounceItem/AnounceItem';
// import Card from '@/components/Card';
// import { usePagination } from '@/hooks/usePagination';
// import useFetch from '@/services/use-fetch';
// import { ProvideMethod } from '@/types/data-types';
// import { Pagination } from 'antd';
// import React, { useEffect, useState } from 'react';
// import styles from './styles/style.module.css';

// const Tourist: React.FC = () => {
//   const [userType, setUserType] = useState('TOURIST');
//   const { offset, pageNum, setCurrentPage } = usePagination({
//     offset: 10,
//     pageNum: 1
//   });
//   const { data } = useFetch({
//     url: '/notifies/all',
//     method: 'GET' as ProvideMethod,
//     params: {
//       pageNum,
//       offset
//     }
//   });

//   // const mockData = [
//   //   {
//   //     nid: '11111',
//   //     title: 'aaa',
//   //     time: '2024-4-16',
//   //     content_slice: 'heoihilwjdlwkanlk'
//   //   }
//   // ];

//   useEffect(() => {
//     setUserType(localStorage.getItem('user-type') || 'TOURIST');
//   }, []);

//   return (
//     <div className={styles.main}>
//       <Card>
//         <div className='w-full h-full flex flex-col'>
//           <div className='flex flex-row justify-between'>
//             <div className='relative'>
//               <div className='bg-green-500 w-1 h-6 absolute left-[-1rem]'></div>
//               <div>News Anouncement</div>
//             </div>
//             {/* <div className='text-green-500 text-sm mt-1'>
//               <span className='text-green-500 mr-2 underline'>All News</span>
//               {'>'}
//             </div> */}
//           </div>
//           <div className='w-full h-full flex flex-col p-8'>
//             {data.map((data: any) => (
//               <AnounceItem
//                 link={`/${userType.toLowerCase()}/notice/${data.nid}`}
//                 data={data}
//                 key={data.content_slice}
//               />
//             ))}
//           </div>
//           <Pagination
//             defaultCurrent={1}
//             total={72}
//             current={pageNum}
//             onChange={page => {
//               setCurrentPage(page);
//             }}
//           />
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Tourist;
