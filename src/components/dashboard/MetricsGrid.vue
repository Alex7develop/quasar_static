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

// Импортируем иконки
import tflopsIcon from '../../assets/icon/tflops.png';
import powerIcon from '../../assets/icon/power.png';
import uptimeIcon from '../../assets/icon/uptime.png';
import fanIcon from '../../assets/icon/fan.png';
import tempIcon from '../../assets/icon/temp.png';

const { statistics } = useDeviceData();
const $q = useQuasar();

// Формируем массив метрик на основе данных из statistics
const metrics = computed(() => {
  if (!statistics.value) {
    const placeholder = (title: string, iconPath: string, unit = '') => ({ title, value: '-', unit, icon: iconPath });
    return [
      placeholder('10 sec', tflopsIcon, 'TFLOPS'),
      placeholder('24 hours', tflopsIcon, 'TFLOPS'),
      placeholder('Power', powerIcon, 'Watts'),
      placeholder('Uptime', uptimeIcon, ''),
      placeholder('Fan 1', fanIcon, 'RPM'),
      placeholder('Fan 2', fanIcon, 'RPM'),
      placeholder('Fan 3', fanIcon, 'RPM'),
      placeholder('Fan 4', fanIcon, 'RPM'),
      placeholder('Temp IN', tempIcon, '°C'),
      placeholder('Temp OUT', tempIcon, '°C'),
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
      icon: tflopsIcon,
    },
    {
      title: '24 hours',
      value: formatTflops(s.avg),
      unit: 'TFLOPS',
      icon: tflopsIcon,
    },
    {
      title: 'Power',
      value: typeof s.power === 'string' ? parseInt(s.power, 10) : (typeof s.power === 'number' ? s.power : '-'),
      unit: 'Watts',
      icon: powerIcon,
    },
    {
      title: 'Uptime',
      value: formatUptime(s.uptime_sys),
      unit: '',
      icon: uptimeIcon,
    },
    {
      title: 'Fan 1',
      value: fans[0] ?? '-',
      unit: 'RPM',
      icon: fanIcon,
    },
    {
      title: 'Fan 2',
      value: fans[1] ?? '-',
      unit: 'RPM',
      icon: fanIcon,
    },
    {
      title: 'Fan 3',
      value: fans[2] ?? '-',
      unit: 'RPM',
      icon: fanIcon,
    },
    {
      title: 'Fan 4',
      value: fans[3] ?? '-',
      unit: 'RPM',
      icon: fanIcon,
    },
    {
      title: 'Temp IN',
      value: temps.in ?? '-',
      unit: '°C',
      icon: tempIcon,
    },
    {
      title: 'Temp OUT',
      value: temps.out ?? '-',
      unit: '°C',
      icon: tempIcon,
    },
  ];
});

</script>

<style scoped lang="scss">
/* You might want to add styles here if needed, for example, 
   to ensure cards have a consistent height or adjust padding on small screens */
</style> 