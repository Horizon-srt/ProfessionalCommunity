'use client';
import Card from '@/components/Card';
import { Col, InputNumber, Radio, Row, Slider } from 'antd';
import React from 'react';
import { useRenderChart } from '@/hooks/useRenderChart';
import { Chart } from '@antv/g2';
const Family: React.FC = () => {
  const options = [
    { label: '用水量', value: 'Apple' },
    { label: '用电量', value: 'Pear' },
    { label: '燃气用量', value: 'Orange' }
  ];

  const { containerRef: lineRef } = useRenderChart({
    renderChart: container => {
      const chart = new Chart({
        width: 600,
        height: 200,
        container: container as HTMLElement
      });

      // 声明可视化
      chart.options({
        type: 'view', // 视图节点
        data: [
          { month: '2023-10', value: 3.5 },
          { month: '2023-11', value: 5 },
          { month: '2023-12', value: 4.9 },
          { month: '2024-1', value: 6 },
          { month: '2024-2', value: 7 },
          { month: '2024-3', value: 9 },
          { month: '2024-4', value: 6 }
        ],
        encode: {
          x: 'month',
          y: 'value'
        },
        children: [
          { type: 'line' }, // Line 标记
          { type: 'point' } // Point 标记
        ]
      });
      // 渲染可视化
      chart.render();

      return chart;
    },
    updateChart: () => {}
  });
  const { containerRef: pieRef } = useRenderChart({
    renderChart: container => {
      // 初始化图表实例
      const chart = new Chart({
        width: 300,
        height: 150,
        container: container as HTMLElement
      });

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
  return (
    <main className='p-6 h-full'>
      <Card>
        <div className='w-full h-full'>
          <header className='flex justify-between'>
            <span>资源使用数据</span>
            <Radio.Group options={options} optionType='button' />
          </header>
          <main>
            <div>
              <div className='w-full' ref={lineRef || null}></div>
            </div>
            <div className='flex flex-row justify-between'>
              <div className='w-[49%]'>
                <Card title='阈值设置'>
                  <div className='w-full h-full flex flex-col'>
                    <Row className='w-full'>
                      <Col span={5} className='mt-1'>
                        用水量
                      </Col>
                      <Col span={12}>
                        <Slider min={1} max={20} />
                      </Col>
                      <Col span={4}>
                        <InputNumber
                          min={1}
                          max={20}
                          style={{ margin: '0 16px' }}
                        />
                      </Col>
                    </Row>
                    <Row className='w-full'>
                      <Col span={5} className='mt-1'>
                        用电量
                      </Col>
                      <Col span={12}>
                        <Slider min={1} max={20} />
                      </Col>
                      <Col span={4}>
                        <InputNumber
                          min={1}
                          max={20}
                          style={{ margin: '0 16px' }}
                        />
                      </Col>
                    </Row>
                    <Row className='w-full'>
                      <Col span={5} className='mt-1'>
                        燃气用量
                      </Col>
                      <Col span={12}>
                        <Slider min={1} max={20} />
                      </Col>
                      <Col span={4}>
                        <InputNumber
                          min={1}
                          max={20}
                          style={{ margin: '0 16px' }}
                        />
                      </Col>
                    </Row>
                  </div>
                </Card>
              </div>
              <div className='w-[49%]'>
                <Card title='类别比例'>
                  <div ref={pieRef}></div>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </Card>
    </main>
  );
};

export default Family;
