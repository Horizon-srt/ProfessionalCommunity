import { useRenderChart } from '@/hooks/useRenderChart';
import { ResourceType } from '@/types/data-types';
import { Chart } from '@antv/g2';
import React, { useEffect, useMemo } from 'react';

export const LineChart = ({ data, currentOption, pageNum }: any) => {
  const lineChartData = useMemo(() => {
    const lineChartTypeData = {
      [ResourceType.ELETRIC]: [] as any[],
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
        if (resource.type) {
          lineChartTypeData[resource.type].push(
            Object.assign({ time: `${resource.year}-${resource.month}` })
          );
        }
        lineChartTypeData[ResourceType.ELETRIC].sort();
        lineChartTypeData[ResourceType.WATER].sort();
        lineChartTypeData[ResourceType.GAS].sort();
      }
    );
    return lineChartTypeData;
  }, [data]);

  const lineChartDataMock = {
    [ResourceType.ELETRIC]: [
      { month: '2023-10', value: 3.5, comparsion: false },
      { month: '2023-11', value: 5, comparsion: true },
      { month: '2023-12', value: 4.9 },
      { month: '2024-1', value: 6, comparsion: true },
      { month: '2024-2', value: 7, comparsion: true },
      { month: '2024-3', value: 9 },
      { month: '2024-4', value: 6 }
    ],
    [ResourceType.WATER]: [
      { month: '2023-10', value: 0 },
      { month: '2023-11', value: 5 },
      { month: '2023-12', value: 8.9 },
      { month: '2024-1', value: 6 },
      { month: '2024-2', value: 7 },
      { month: '2024-3', value: 9 },
      { month: '2024-4', value: 6 }
    ],
    [ResourceType.GAS]: [
      { month: '2023-10', value: 0 },
      { month: '2023-11', value: 5 },
      { month: '2023-12', value: 8.9 }
    ]
  };

  useEffect(() => {
    updateChart();
  }, [data]);
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
        .data(lineChartDataMock[currentOption])
        // .data([
        //   { month: '2023-10', value: 3.5 },
        //   { month: '2023-11', value: 5 },
        //   { month: '2023-12', value: 4.9 },
        //   { month: '2024-1', value: 6 },
        //   { month: '2024-2', value: 7 },
        //   { month: '2024-3', value: 9 },
        //   { month: '2024-4', value: 6 }
        // ])
        .encode('x', 'month')
        .encode('y', 'value')
        .style({
          stroke: 'green',
          strokeWidth: 4
        });

      chart
        .point()
        .data(lineChartDataMock[currentOption])
        .encode('x', 'month')
        .encode('y', 'value')
        .style('stroke', (s: any) => {
          return s.comparsion ? 'red' : 'green';
        })
        .style('strokeWidth', 10);

      // 渲染可视化
      chart.render();

      return chart;
    },
    updateChart: chart => {
      chart.changeData(lineChartDataMock[currentOption]);
    }
  });

  return <div className='w-full' ref={lineRef || null}></div>;
};
