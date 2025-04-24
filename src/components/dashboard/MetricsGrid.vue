<template>
  <div class="row q-col-gutter-md">
    <div
      v-for="metric in metrics"
      :key="metric.title"
      class="col-6 col-sm-6 col-md-4 col-lg" 
      :style="$q.screen.gt.md ? 'flex-basis: 20%; min-width: 180px;' : ''"
    >
      <metric-card
        :title="metric.title"
        :value="metric.value"
        :unit="metric.unit"
        :description="metric.description"
        :icon="metric.icon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MetricCard from './MetricCard.vue';
import { useDeviceData } from '../../composables/useDeviceData';
import { formatUptime } from '../../utils/formatters'; 
import { useQuasar } from 'quasar';

const { statistics } = useDeviceData();
const $q = useQuasar();

// Формируем массив метрик на основе данных из statistics
const metrics = computed(() => {
  if (!statistics.value) {
   
    const placeholder = (title: string, iconPath: string, unit = '', description = '') => ({ title, value: '-', unit, description, icon: iconPath });
    return [
      placeholder('10 sec', 'src/assets/icon/tflops.png', 'TFLOPS', 'Выработка мощности за 10 сек.'),
      placeholder('24 hours', 'src/assets/icon/tflops.png', 'TFLOPS', 'Выработка мощности за 24 часа'),
      placeholder('Power', 'src/assets/icon/power.png', 'Watts', 'Потребление электричества'),
      placeholder('Uptime', 'src/assets/icon/uptime.png', '', 'Время не прерывной работы устройства'),
      placeholder('Fan 1', 'src/assets/icon/fan.png', '', 'Скорость вращения вентилятора'),
      placeholder('Fan 2', 'src/assets/icon/fan.png', '', 'Скорость вращения вентилятора'),
      placeholder('Fan 3', 'src/assets/icon/fan.png', '', 'Скорость вращения вентилятора'),
      placeholder('Fan 4', 'src/assets/icon/fan.png', '', 'Скорость вращения вентилятора'),
      placeholder('Temp IN', 'src/assets/icon/temp.png', '°C', 'Температура'),
      placeholder('Temp OUT', 'src/assets/icon/temp.png', '°C', 'Температура'),
    ];
  }

  const s = statistics.value;
  const fans = s.fan || [];
  const temps = s.temps || { in: null, out: null };

 
  const formatTflops = (flops: number | null | undefined) => flops ? (flops / 1e12).toFixed(2) : '-';

  return [
    {
      title: '10 sec',
      value: formatTflops(s.real),
      unit: 'TFLOPS',
      description: 'Выработка мощности за 10 сек.',
      icon: 'src/assets/icon/tflops.png',
    },
    {
      title: '24 hours',
      value: formatTflops(s.avg),
      unit: 'TFLOPS',
      description: 'Выработка мощности за 24 часа',
      icon: 'src/assets/icon/tflops.png',
    },
    {
      title: 'Power',
      value: typeof s.power === 'string' ? parseInt(s.power, 10) : (typeof s.power === 'number' ? s.power : '-'),
      unit: 'Watts',
      description: 'Потребление электричества',
      icon: 'src/assets/icon/power.png',
    },
    {
      title: 'Uptime',
      value: formatUptime(s.uptime_sys),
      unit: '',
      description: 'Время не прерывной работы устройства',
      icon: 'src/assets/icon/uptime.png',
    },
    {
      title: 'Fan 1',
      value: fans[0] ?? '-',
      unit: 'RPM',
      description: 'Скорость вращения вентилятора',
      icon: 'src/assets/icon/fan.png',
    },
    {
      title: 'Fan 2',
      value: fans[1] ?? '-',
      unit: 'RPM',
      description: 'Скорость вращения вентилятора',
      icon: 'src/assets/icon/fan.png',
    },
    {
      title: 'Fan 3',
      value: fans[2] ?? '-',
      unit: 'RPM',
      description: 'Скорость вращения вентилятора',
      icon: 'src/assets/icon/fan.png',
    },
    {
      title: 'Fan 4',
      value: fans[3] ?? '-',
      unit: 'RPM',
      description: 'Скорость вращения вентилятора',
      icon: 'src/assets/icon/fan.png',
    },
    {
      title: 'Temp IN',
      value: temps.in ?? '-',
      unit: '°C',
      description: 'Температура',
      icon: 'src/assets/icon/temp.png',
    },
    {
      title: 'Temp OUT',
      value: temps.out ?? '-',
      unit: '°C',
      description: 'Температура',
      icon: 'src/assets/icon/temp.png',
    },
  ];
});

</script>

<style scoped lang="scss">
/* You might want to add styles here if needed, for example, 
   to ensure cards have a consistent height or adjust padding on small screens */
</style> 