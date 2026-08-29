<script setup lang="ts">
import useHome from '@/composables/useHome'
import IsLoading from '@/components/IsLoading.vue'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  type ChartOptions
} from 'chart.js'
import { computed } from 'vue'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const COLORS = ['#2563eb', '#f97316', '#ef4444', '#16a34a']

const BG = [
  'rgba(37, 99, 235, 0.08)',
  'rgba(249, 115, 22, 0.08)',
  'rgba(239, 68, 68, 0.08)',
  'rgba(22, 163, 74, 0.08)'
]

const { data, isLoading, isError, error } = useHome()

const chartData = computed(() => {
  if (!data.value?.labels || !data.value?.datasets) {
    return {
      labels: [],
      datasets: []
    }
  }
  return {
    labels: data.value.labels || [],
    datasets: data.value.datasets.map((d: any, index: number) => {
      // Create a plain (non-reactive) deep copy so Chart.js can mutate it safely
      const dataset = JSON.parse(JSON.stringify(d))
      const color = COLORS[index] ?? COLORS[COLORS.length - 1]
      return {
        ...dataset,
        borderColor: color,
        backgroundColor: BG[index] ?? BG[BG.length - 1],
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointBorderColor: color,
        tension: 0.4,
        fill: true
      }
    })
  }
})

const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  },
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    },
    tooltip: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      border: {
        display: false
      },
      ticks: {
        color: '#94a3b8',
        maxTicksLimit: 10
      }
    },
    y: {
      beginAtZero: true,
      border: {
        display: false
      },
      grid: {
        color: '#f1f5f9'
      },
      ticks: {
        precision: 0,
        color: '#64748b'
      }
    }
  }
}
</script>

<template>
  <header class="flex items-center justify-between mb-8">
    <span class="font-bold text-2xl"> Estadisticas </span>
  </header>

  <IsLoading v-if="isLoading" />

  <div v-else-if="isError" class="alert alert-error">
    {{ error?.message || 'Error al cargar los datos' }}
  </div>

  <div v-else class="card bg-white card-bordered shadow-sm">
    <div class="card-body">
      <div class="h-[360px]">
        <Line :data="chartData" :options="lineChartOptions" />
      </div>
    </div>
  </div>
</template>
