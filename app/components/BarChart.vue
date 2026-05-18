<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

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
      backgroundColor: 'rgba(88, 166, 255, 0.6)',
      borderColor: '#58a6ff',
      borderWidth: 1,
      borderRadius: 6,
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
      font: { size: 14, weight: '600' as const },
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
