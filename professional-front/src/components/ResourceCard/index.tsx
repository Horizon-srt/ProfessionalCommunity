import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import Link from 'next/link';
import { useRenderChart } from '@/hooks/useRenderChart';
import { Chart } from '@antv/g2';

interface ResourceCardProps {
  width: string;
  height: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ width, height }) => {
  const [type, setTypes] = useState('TOURIST');
  useEffect(() => {
    setTypes(localStorage.getItem('user-type') || 'TOURIST');
  }, []);

  const { containerRef: pieRef } = useRenderChart({
    renderChart: container => {
      // 初始化图表实例
      const chart = new Chart({ width: 300, height: 150, container });

      const data = [
        { type: '用水量', value: 500 },
        { type: '用电量', value: 500 },
        { type: '燃气用量', value: 500 }
      ];
      chart.options({
        type: 'interval',
        data: data,
        transform: [{ type: 'stackY' }],
        coordinate: { type: 'theta' },
        scale: {
          color: { palette: 'spectral', offset: t => t * 0.3 + 0.1 }
        },
        legend: false,
        encode: { y: 'value', color: 'type' },
        style: { stroke: 'white' },
        labels: [
          {
            text: 'type',
            radius: 0.4,
            style: { fontSize: 12, fontWeight: 'bold', color: 'black' }
          },
          {
            text: (d, i, data) => (i < data.length - 3 ? d.value : ''),
            radius: 0.2,
            style: { fontSize: 9, dy: 12 }
          }
        ]
      });
      // 渲染可视化
      chart.render();

      return chart;
    },
    updateChart: () => {}
  });

  const isLoading = false;

  return (
    <Card
      title={<div style={{ fontWeight: 'bold' }}>Resource Type Ratio</div>}
      extra={
        <Link
          href={`/${type.toLowerCase()}/family`}
          style={{ color: '#16A609' }}
        >
          {'More >'}
        </Link>
      }
      style={{
        width: width,
        height: height,
        borderRadius: '20px',
        overflow: 'auto'
      }}
      styles={{ body: { paddingTop: '0px' } }}
    >
      <Spin spinning={isLoading} size='large'>
        {isLoading ? <div></div> : <div ref={pieRef}></div>}
      </Spin>
    </Card>
  );
};

export default ResourceCard;
