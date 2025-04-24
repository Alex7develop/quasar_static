<template>
  <div class="row q-col-gutter-md">
    <!-- График Performance (TFLOPS) - Вся ширина -->
    <div class="col-12">
      <q-card flat class="chart-card text-white relative-position">
        <q-card-section>
          <div class="row justify-between items-start no-wrap">
            <div>
              <div class="text-subtitle1 q-mb-xs">24 hours</div>
              <div class="text-h6 text-primary">TFLOPS</div>
              <div class="text-caption text-grey-6 q-mt-xs">Производительность</div>
            </div>
            <img 
              src="../../assets/icon/tflops.png" 
              alt="TFLOPS Icon" 
              class="chart-icon-img" 
            />
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none chart-content">
          <Line
            v-if="hashrateChartData.labels?.length"
            :data="hashrateChartData"
            :options="hashrateChartOptions"
            class="chart-canvas"
          />
          <div v-else class="chart-placeholder text-center q-pa-md">Loading chart data...</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Графики Температуры и Мощности - По половине ширины -->
    <div class="col-12">
      <div class="row q-col-gutter-md">
        <!-- График Температуры -->
        <div class="col-12 col-md-6">
          <q-card flat class="chart-card text-white relative-position">
            <q-card-section>
              <div class="row justify-between items-start no-wrap">
                <div>
                  <div class="text-subtitle1 q-mb-xs">24 hours</div>
                  <div class="text-h6 text-primary">Temp</div>
                  <div class="text-caption text-grey-6 q-mt-xs">Производительность</div>
                </div>
                <q-icon name="thermostat" color="primary" size="2.5em" class="chart-icon" />
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none chart-content">
              <Line
                v-if="tempChartData.labels?.length"
                :data="tempChartData"
                :options="tempChartOptions"
                class="chart-canvas"
              />
              <div v-else class="chart-placeholder text-center q-pa-md">Loading chart data...</div>
            </q-card-section>
          </q-card>
        </div>

        <!-- График Мощности -->
        <div class="col-12 col-md-6">
          <q-card flat class="chart-card text-white relative-position">
            <q-card-section>
              <div class="row justify-between items-start no-wrap">
                <div>
                  <div class="text-subtitle1 q-mb-xs">24 hours</div>
                  <div class="text-h6 text-primary">Power</div>
                  <div class="text-caption text-grey-6 q-mt-xs">Производительность</div>
                </div>
                <q-icon name="bolt" color="primary" size="2.5em" class="chart-icon" />
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none chart-content">
              <Line
                v-if="powerChartData.labels?.length"
                :data="powerChartData"
                :options="powerChartOptions"
                class="chart-canvas"
              />
              <div v-else class="chart-placeholder text-center q-pa-md">Loading chart data...</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useDeviceData } from '../../composables/useDeviceData';
import { formatDate } from '../../utils/formatters';
import type { HistoryMetric } from '../../services/api';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  type ChartData,
  type ChartOptions
} from 'chart.js';

// Регистрация компонентов Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

const { history } = useDeviceData();

// --- Общие функции и опции --- 

const baseChartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true, // Делаем всегда адаптивным
  maintainAspectRatio: false, // Позволяем изменять соотношение сторон
  interaction: {
      intersect: false,
      mode: 'index',
  },
  plugins: {
    legend: {
      position: 'bottom',
      align: 'start', // Легенду выравниваем по левому краю
      labels: {
        color: '#ABAFB2', // Цвет текста легенды
        usePointStyle: true,
        pointStyle: 'circle', // Стиль точки легенды
        boxWidth: 8,
        padding: 20
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: '#2A2D3A', // Фон тултипа
      titleColor: '#ABAFB2',
      bodyColor: 'white',
      padding: 10,
      cornerRadius: 4,
      boxPadding: 4,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        color: '#8C8C8C',
        padding: 10, // Отступ тиков Y
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.08)', // Цвет сетки Y
        drawBorder: false,
      }
    },
    x: {
      ticks: {
        color: '#8C8C8C',
        maxRotation: 0, 
        autoSkip: true, 
        maxTicksLimit: 6, // Ограничиваем кол-во тиков X
        padding: 10, // Отступ тиков X
      },
      grid: {
        display: false, // Убираем сетку X
      }
    },
  },
  elements: {
      point: {
          radius: 0, // Убираем точки
          hoverRadius: 5 
      },
      line: {
        tension: 0.4 // Сглаживание линии
      }
  }
}));

const hashrateChartData = ref<ChartData<'line'>>({ labels: [], datasets: [] });
const tempChartData = ref<ChartData<'line'>>({ labels: [], datasets: [] });
const powerChartData = ref<ChartData<'line'>>({ labels: [], datasets: [] });


const hashrateChartOptions = computed<ChartOptions<'line'>>(() => ({ ...baseChartOptions.value }));
const tempChartOptions = computed<ChartOptions<'line'>>(() => ({ ...baseChartOptions.value }));
const powerChartOptions = computed<ChartOptions<'line'>>(() => ({ ...baseChartOptions.value }));



const updateCharts = () => {
  const metrics = history.value?.metrics;
  if (!metrics?.length) {
    hashrateChartData.value = { labels: [], datasets: [] };
    tempChartData.value = { labels: [], datasets: [] };
    powerChartData.value = { labels: [], datasets: [] };
    return;
  }

  const labels = metrics.map((m: HistoryMetric) => formatDate(m.unix_time));

  // Hashrate Chart
  const hashrateDataPoints = metrics.map((m: HistoryMetric) => 
    m.hashrate?.avg != null ? parseFloat((m.hashrate.avg / 1e12).toFixed(2)) : null
  );
  hashrateChartData.value = {
    labels,
    datasets: [{
      label: 'Item',
      data: hashrateDataPoints,
      borderColor: '#02E189',
      backgroundColor: 'rgba(2, 225, 137, 0.2)',
      fill: true,
      spanGaps: true,
    }]
  };

  // Temperature Chart
  const inletTempDataPoints = metrics.map((m: HistoryMetric) => 
    m.inlet_temp_max?.avg != null ? parseFloat(m.inlet_temp_max.avg.toFixed(1)) : null
  );
  const outletTempDataPoints = metrics.map((m: HistoryMetric) => 
    m.outlet_temp_max?.avg != null ? parseFloat(m.outlet_temp_max.avg.toFixed(1)) : null
  );
  tempChartData.value = {
    labels,
    datasets: [
      {
        label: 'Temp IN',
        data: inletTempDataPoints,
        borderColor: '#3EBFFC',
        backgroundColor: 'rgba(62, 191, 252, 0.2)',
        fill: false,
        spanGaps: true,
      },
      {
        label: 'Temp OUT',
        data: outletTempDataPoints,
        borderColor: '#FD7972',
        backgroundColor: 'rgba(253, 121, 114, 0.2)',
        fill: false,
        spanGaps: true,
      }
    ]
  };

  // Power Chart
  const powerDataPoints = metrics.map((m: HistoryMetric) => 
    m.power?.avg != null ? parseFloat(m.power.avg.toFixed(0)) : null
  );
  powerChartData.value = {
    labels,
    datasets: [{
      label: 'Item',
      data: powerDataPoints,
      borderColor: '#FFCC40',
      backgroundColor: 'rgba(255, 204, 64, 0.2)',
      fill: true,
      spanGaps: true,
    }]
  };
};

watch(history, updateCharts, { immediate: true, deep: true });

</script>

<style scoped lang="scss">
.chart-card {
  background-color: rgba(14, 18, 22, 1); /* Новый фон для карточек графиков */
  border-radius: 12px;
  height: 100%; // Чтобы карточки в ряду были одинаковой высоты
}

// Новый стиль для иконки-изображения
.chart-icon-img {
  position: absolute;
  top: 16px;
  right: 16px;
  height: 32px; /* Задаем высоту иконки */
  width: auto;  /* Ширина будет автоматической */
  opacity: 0.8;
}

.chart-content {
  height: 300px; /* Задаем фиксированную высоту для области графика */
  position: relative;
  // На маленьких экранах уменьшаем высоту
  @media (max-width: $breakpoint-sm-max) {
    height: 250px;
  }
}

.chart-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.chart-placeholder {
  color: #8C8C8C;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Обновляем заголовки под стиль макета
.text-subtitle1 {
  font-size: 0.875rem; // 14px
  color: #ABAFB2; // Серый цвет
  font-weight: 400;
}

.text-h6 {
  font-size: 1.125rem; // 18px
  line-height: 1.4;
  font-weight: 500;
}

.text-caption {
  font-size: 0.75rem; // 12px
}

.text-primary {
  color: #4080FF !important; // Цвет основного акцента
}
</style> 