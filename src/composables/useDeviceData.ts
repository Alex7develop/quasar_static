import { ref, onMounted, onUnmounted, readonly, computed } from 'vue'
import { useQuasar } from 'quasar'
import type { StatisticResponse, HistoryResponse } from '../types/api'
import {
  getStatistics,
  getHistory,
  getApiErrorMessage
} from '../services/api'

const POLLING_INTERVAL = 10 * 60 * 1000;
const USE_STATIC_DATA = true; // Keep the flag, api.ts will use it

// Initialize refs back to null/default
const statistics = ref<StatisticResponse | null>(null);
const history = ref<HistoryResponse | null>(null);
const isLoading = ref<boolean>(false);
const error = ref<string | null>(null);
const lastUpdated = ref<number | null>(null);

let intervalId: ReturnType<typeof setInterval> | null = null;

export function useDeviceData() {
  const $q = useQuasar();

  // fetchData now uses the modified getStatistics/getHistory
  const fetchData = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // These functions will internally decide whether to fetch static or real data
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
      $q.notify({
        color: 'negative',
        message: `Failed to fetch device data: ${message}`,
        icon: 'report_problem'
      });
    } finally {
      isLoading.value = false;
    }
  };

  const startPolling = () => {
    // Polling is only started if NOT using static data
    if (USE_STATIC_DATA) {
       console.log('Using static data, polling is disabled.');
       return; 
    }

    // Original polling logic for real API
    if (intervalId) return;
    intervalId = setInterval(() => {
      void fetchData();
    }, POLLING_INTERVAL);
  };

  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  onMounted(() => {
    // Fetch data once on mount, regardless of static/real mode
    void fetchData();
    // Start polling only if not using static data
    startPolling();
  });

  onUnmounted(() => {
    stopPolling();
  });

  const isOnline = computed(() => statistics.value?.conf?.online ?? false);

  // refreshData simply calls fetchData again
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