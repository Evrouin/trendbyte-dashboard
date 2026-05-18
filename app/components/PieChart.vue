<template>
  <Doughnut :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS = ['#58a6ff', '#f78166', '#7ee787', '#d2a8ff', '#ffa657', '#f0883e', '#79c0ff']

const props = defineProps<{
  labels: string[]
  values: number[]
}>()

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: COLORS.slice(0, props.labels.length),
      borderWidth: 0,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: { color: '#8b949e', boxWidth: 12, padding: 12 },
    },
  },
}
</script>
