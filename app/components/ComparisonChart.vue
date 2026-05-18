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
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const COLORS = ['#58a6ff', '#f78166', '#7ee787', '#d2a8ff', '#ffa657']

const props = defineProps<{
  datasets: { name: string; labels: string[]; values: number[] }[]
}>()

const chartData = computed(() => ({
  labels: props.datasets[0]?.labels || [],
  datasets: props.datasets.map((ds, i) => ({
    label: ds.name,
    data: ds.values,
    borderColor: COLORS[i % COLORS.length],
    backgroundColor: 'transparent',
    borderWidth: 2,
    pointRadius: 2,
    tension: 0.3,
  })),
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: { color: '#f0f6fc', boxWidth: 12 },
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
    },
    y: {
      ticks: { color: '#8b949e', font: { size: 11 } },
      grid: { color: 'rgba(88, 166, 255, 0.05)' },
    },
  },
}
</script>
