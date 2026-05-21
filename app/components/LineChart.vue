<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

const props = defineProps<{
  labels: string[]
  values: number[]
  title?: string
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      borderColor: '#58a6ff',
      backgroundColor: 'rgba(88, 166, 255, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: '#58a6ff',
      pointRadius: 3,
      tension: 0.3,
      fill: true,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: !!props.title,
      text: props.title,
      color: '#f0f6fc',
      font: { size: 14, weight: 'bold' as const },
    },
    tooltip: {
      backgroundColor: '#161b22',
      borderColor: 'rgba(88, 166, 255, 0.15)',
      borderWidth: 1,
      titleColor: '#f0f6fc',
      bodyColor: '#8b949e',
    },
  },
  scales: {
    x: {
      ticks: { color: '#8b949e', font: { size: 11 } },
      grid: { display: false },
      border: { color: 'rgba(88, 166, 255, 0.1)' },
    },
    y: {
      ticks: { color: '#8b949e', font: { size: 11 } },
      grid: { color: 'rgba(88, 166, 255, 0.05)' },
      border: { display: false },
    },
  },
}
</script>
