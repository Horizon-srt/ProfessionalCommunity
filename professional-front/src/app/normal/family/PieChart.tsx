import { useRenderChart } from '@/hooks/useRenderChart';
import { ResourceType } from '@/types/data-types';
import { Chart } from '@antv/g2';
import React, { useCallback, useEffect } from 'react';

export const PieChart = ({ data }: any) => {
  const getPieChartData = useCallback(() => {
    const pieChartTypeData = {
      [ResourceType.ELETRIC]: { type: 'Eletricity', value: 0 },
      [ResourceType.WATER]: { type: 'Water', value: 0 },
      [ResourceType.GAS]: { type: 'Gas', value: 0 }
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
        if (resource.type === ('ELECTRICITY' as unknown as ResourceType)) {
          pieChartTypeData[1].value += +resource.value;
        } else if (resource.type === ('WATER' as unknown as ResourceType)) {
          pieChartTypeData[0].value += +resource.value;
        } else if (resource.type === ('GAS' as unknown as ResourceType)) {
          pieChartTypeData[2].value += +resource.value;
        }
      }
    );
    return [
      pieChartTypeData[ResourceType.ELETRIC],
      pieChartTypeData[ResourceType.GAS],
      pieChartTypeData[ResourceType.WATER]
    ];
  }, [data]);
  useEffect(() => {
    updateChart();
  }, [data]);
  const { containerRef: pieRef, updateChart } = useRenderChart({
    renderChart: container => {
      // 初始化图表实例
      const chart = new Chart({
        width: 400,
        height: 180,
        container: container as HTMLElement
      });

      chart
        .interval()
        .coordinate({ type: 'theta', innerRadius: 0.5 })
        .transform({ type: 'stackY' })
        .data(getPieChartData())
        .encode('y', 'value')
        .encode('color', 'type');
      // 渲染可视化
      chart.render();

      return chart;
    },
    updateChart: chart => {
      chart.clear();
      chart
        .interval()
        .coordinate({ type: 'theta', innerRadius: 0.5 })
        .transform({ type: 'stackY' })
        .data(getPieChartData())
        .encode('y', 'value')
        .encode('color', 'type');
      // 渲染可视化
      chart.render();

      return chart;
    }
  });

  return <div ref={pieRef} className='-mt-6'></div>;
};
