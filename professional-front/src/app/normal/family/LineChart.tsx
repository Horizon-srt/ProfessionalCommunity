import { useRenderChart } from '@/hooks/useRenderChart';
import { ResourceType } from '@/types/data-types';
import { Chart } from '@antv/g2';
import { Empty } from 'antd';
import React, { useEffect, useMemo } from 'react';

export const LineChart = ({ data, currentOption }: any) => {
  const lineChartData = useMemo(() => {
    const lineChartTypeData = {
      [ResourceType.ELECTRICITY]: [] as any[],
      [ResourceType.WATER]: [] as any[],
      [ResourceType.GAS]: [] as any[]
    };
    data?.resources.forEach(
      (resource: {
        resource_id: string;
        type: ResourceType;
        value: string;
        month: string;
        year: string;
        // 是否超过阈值
        comparison: boolean;
      }) => {
        console.log(resource.type);
        if (resource.type) {
          lineChartTypeData[
            ResourceType[resource.type] as unknown as ResourceType
          ].push(
            Object.assign(resource, {
              time: `${resource.year}-${resource.month}`
            })
          );
        }
        lineChartTypeData[ResourceType.ELECTRICITY].sort();
        lineChartTypeData[ResourceType.WATER].sort();
        lineChartTypeData[ResourceType.GAS].sort();
      }
    );
    return lineChartTypeData;
  }, [data, currentOption]);

  // const lineChartDataMock = {
  //   [ResourceType.ELETRIC]: [
  //     { month: '2023-10', value: 3.5, comparsion: false },
  //     { month: '2023-11', value: 5, comparsion: true },
  //     { month: '2023-12', value: 4.9 },
  //     { month: '2024-1', value: 6, comparsion: true },
  //     { month: '2024-2', value: 7, comparsion: true },
  //     { month: '2024-3', value: 9 },
  //     { month: '2024-4', value: 6 }
  //   ],
  //   [ResourceType.WATER]: [
  //     { month: '2023-10', value: 0 },
  //     { month: '2023-11', value: 5 },
  //     { month: '2023-12', value: 8.9 },
  //     { month: '2024-1', value: 6 },
  //     { month: '2024-2', value: 7 },
  //     { month: '2024-3', value: 9 },
  //     { month: '2024-4', value: 6 }
  //   ],
  //   [ResourceType.GAS]: [
  //     { month: '2023-10', value: 0 },
  //     { month: '2023-11', value: 5 },
  //     { month: '2023-12', value: 8.9 }
  //   ]
  // };

  // 标准节水线
  const saveLineChartData = useMemo(() => {
    const saveLineChartTypeData = JSON.parse(JSON.stringify(lineChartData));
    Object.keys(saveLineChartTypeData).forEach(key => {
      saveLineChartTypeData[key as unknown as ResourceType] =
        saveLineChartTypeData[key as unknown as ResourceType].map(
          (item: any) => {
            item.value = 5;
            return item;
          }
        );
    });
    return saveLineChartTypeData;
  }, [lineChartData]);

  useEffect(() => {
    updateChart();
  }, [data, currentOption]);

  const { containerRef: lineRef, updateChart } = useRenderChart({
    renderChart: container => {
      const chart = new Chart({
        width: 800,
        height: 200,
        container: container as HTMLElement
      });

      // 声明可视化
      chart
        .line()
        .data(lineChartData[currentOption as ResourceType])
        .encode('x', 'month')
        .encode('y', 'value')
        .style({
          stroke: 'green',
          strokeWidth: 4
        });

      chart
        .point()
        .data(lineChartData[currentOption as ResourceType])
        .encode('x', 'month')
        .encode('y', 'value')
        .style('stroke', (s: any) => {
          return s.comparsion ? 'red' : 'green';
        })
        .style('strokeWidth', 10);

      chart
        .line()
        .data(saveLineChartData[currentOption])
        .encode('x', 'month')
        .encode('y', 'value')
        .style({
          stroke: 'red',
          strokeWidth: 4
        });
      // 渲染可视化
      chart.render();

      return chart;
    },
    updateChart: chart => {
      chart.clear();
      chart
        .line()
        .data(lineChartData[currentOption as ResourceType])
        .encode('x', 'month')
        .encode('y', 'value')
        .style({
          stroke: 'green',
          strokeWidth: 4
        });

      chart
        .point()
        .data(lineChartData[currentOption as ResourceType])
        .encode('x', 'month')
        .encode('y', 'value')
        .style('stroke', (s: any) => {
          return s.comparison ? 'red' : 'green';
        })
        .style('strokeWidth', 10);

      chart
        .line()
        .data(saveLineChartData[currentOption])
        .encode('x', 'month')
        .encode('y', 'value')
        .style({
          stroke: 'red',
          strokeWidth: 4
        });
      chart.render();
    }
  });

  return (
    <>
      {!data?.resources?.length && <Empty></Empty>}
      <div className='w-full' ref={lineRef || null}></div>
    </>
  );
};
