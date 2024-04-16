import React from 'react';

const Detail: React.FC<{ params: { detail: string } }> = ({ params }) => {
  const list: any[] = [];
  for (let i = 1; i < 20; i += 1) {
    list.push({
      bid: i,
      name: 'name' + i,
      cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png',
      content:
        'Umi@4 实战教程，专门针对中后台项目零基础的朋友，不管你是前端还是后端，看完这个系列你也有能力合理“抗雷”，“顶坑”',
      description: 'this is a description' + i,
      detail: 'this is a detail',
      label: ['science', 'literature']
    });
  }
  console.log(list[Number(params.detail) - 1]);

  return (
    <div>
      <h1>Tourist page for book{params.detail}</h1>
    </div>
  );
};

export default Detail;
