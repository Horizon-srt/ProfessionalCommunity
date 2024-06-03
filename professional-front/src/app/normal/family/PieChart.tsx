import { useRenderChart } from '@/hooks/useRenderChart';
import { ResourceType } from '@/types/data-types';
import { Chart } from '@antv/g2';
import React, { useEffect, useMemo } from 'react';

export const PieChart = ({ data }: any) => {
  const getPieChartData = useMemo(() => {
    const pieChartTypeData = {
      [ResourceType.ELECTRICITY]: { type: 'Eletricity', value: 0 },
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
          pieChartTypeData[ResourceType.ELECTRICITY].value += +resource.value;
        } else if (resource.type === ('WATER' as unknown as ResourceType)) {
          pieChartTypeData[ResourceType.WATER].value += +resource.value;
        } else if (resource.type === ('GAS' as unknown as ResourceType)) {
          pieChartTypeData[ResourceType.GAS].value += +resource.value;
        }
      }
    );
    // console.log([
    //   pieChartTypeData[ResourceType.ELECTRICITY],
    //   pieChartTypeData[ResourceType.GAS],
    //   pieChartTypeData[ResourceType.WATER]
    // ]);
    return [
      pieChartTypeData[ResourceType.ELECTRICITY],
      pieChartTypeData[ResourceType.GAS],
      pieChartTypeData[ResourceType.WATER]
    ];
  }, [data]);

  useEffect(() => {
    updateChart();
  }, [getPieChartData]);
  const { containerRef: pieRef, updateChart } = useRenderChart({
    renderChart: container => {
      // 初始化图表实例
      const chart = new Chart({
        width: 350,
        height: 180,
        container: container as HTMLElement
      });
      chart.render();
      return chart;
    },
    updateChart: chart => {
      chart
        .interval()
        .coordinate({ type: 'theta', innerRadius: 0.5 })
        .transform({ type: 'stackY' })
        .data(getPieChartData)
        .encode('y', 'value')
        .encode('color', 'type');
      // 渲染可视化
      chart.render();

      return chart;
    }
  });

  return <div ref={pieRef} className='-mt-6'></div>;
};
