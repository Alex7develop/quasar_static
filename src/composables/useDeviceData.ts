import { ref, onMounted, onUnmounted, readonly, computed } from 'vue'
import { useQuasar } from 'quasar'
import type { StatisticResponse, HistoryResponse } from '../types/api'
import {
  getStatistics,
  getHistory,
  getApiErrorMessage
} from '../services/api'

// Устанавливаем интервал обновления в 10 секунд (10 * 1000 мс)
const POLLING_INTERVAL = 10 * 1000; 

const statistics = ref<StatisticResponse | null>(null);
const history = ref<HistoryResponse | null>(null);
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);
const lastUpdated = ref<number | null>(null);

let intervalId: ReturnType<typeof setInterval> | null = null;

export function useDeviceData() {
  const $q = useQuasar();

  const fetchData = async () => {
    // Не устанавливаем isLoading в true при каждом поллинге, 
    // чтобы избежать мерцания индикатора загрузки.
    // Установим только при первой загрузке.
    if (!statistics.value && !history.value) {
        isLoading.value = true;
    }
    error.value = null;
    try {
      // Запрашиваем данные из API
      const [statsData, histData] = await Promise.all([
        getStatistics(),
        getHistory()
      ]);
      statistics.value = statsData;
      history.value = histData;
      lastUpdated.value = Date.now();
    } catch (err) {
      const message = getApiErrorMessage(err);
      error.value = message;
      // Показываем уведомление об ошибке только если это не ошибка поллинга (т.е. при первой загрузке)
      // или если ошибка отличается от предыдущей, чтобы не спамить
      if (!statistics.value && !history.value) {
        $q.notify({
          color: 'negative',
          message: `Failed to fetch initial device data: ${message}`,
          icon: 'report_problem'
        });
      }
       console.error('Error fetching device data during polling:', message);
    } finally {
      // Устанавливаем isLoading в false только после первой загрузки
      if (isLoading.value && (statistics.value || history.value)) {
        isLoading.value = false;
      }
    }
  };

  const startPolling = () => {
    stopPolling(); // Останавливаем предыдущий интервал, если он был
    console.log(`Starting data polling every ${POLLING_INTERVAL / 1000} seconds.`);
    intervalId = setInterval(() => {
      void fetchData();
    }, POLLING_INTERVAL);
  };

  const stopPolling = () => {
    if (intervalId) {
      console.log('Stopping data polling.');
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  onMounted(() => {
    void fetchData(); // Первая загрузка данных
    startPolling();  // Запуск периодического обновления
  });

  onUnmounted(() => {
    stopPolling(); // Остановка обновления при размонтировании компонента
  });

  const isOnline = computed(() => statistics.value?.conf?.online ?? false);

  // refreshData просто снова вызывает fetchData
  const refreshData = async () => {
     await fetchData();
  };

  return {
    statistics: readonly(statistics),
    history: readonly(history),
    isLoading: readonly(isLoading),
    error: readonly(error),
    lastUpdated: readonly(lastUpdated),
    isOnline,
    refreshData,
  };
} 