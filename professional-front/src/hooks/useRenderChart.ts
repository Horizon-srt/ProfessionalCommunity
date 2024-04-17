import { useEffect, useRef } from 'react';

interface IuseRenderChart {
  renderChart: (container: HTMLElement | null) => any;
  updateChart: (ref: any) => void;
}
export const useRenderChart = ({
  renderChart,
  updateChart
}: IuseRenderChart) => {
  const container = useRef(null);
  const chart = useRef(null);

  useEffect(() => {
    if (!chart.current) {
      chart.current = renderChart(container.current);
    }
  }, []);

  const updateChartExpose = () => {
    updateChart(chart.current);
  };

  return {
    containerRef: container,
    chartRef: chart,
    updateChart: updateChartExpose
  };
};
