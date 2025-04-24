<template>
  <q-card flat class="bg-reference-card text-white q-mb-md">
    <q-card-section class="q-pa-sm">
      <div class="row items-center justify-between no-wrap">
        <!-- Левая часть: Лого, Статус и Название -->
        <div class="col-auto row items-center no-wrap q-gutter-sm">
          <!-- Логотип Syndicate -->
          <img src="../../assets/quasar-logo-vertical.svg" alt="Syndicate Logo" class="syndicate-logo q-mr-md">

          <div class="row items-center no-wrap status-container q-pa-xs q-mr-md">
            <span class="status-dot-ref" :class="isOnline ? 'bg-green' : 'bg-red'"></span>
            <span class="text-body2 text-weight-bold q-ml-sm">{{ deviceStatusText }}</span>
          </div>

          <span class="text-body1 device-name">{{ deviceName }}</span>
        </div>

        <!-- Правая часть: IP, MAC, Locate -->
        <div class="col-auto row items-center no-wrap q-gutter-sm">
          <div class="ip-locate-wrapper row no-wrap items-stretch">
            <div class="ip-mac-block q-px-md q-py-sm text-left row items-center no-wrap">
              <div class="network-info">
                <span>IP: {{ ipAddress || '-' }}</span>
                <span class="q-ml-lg">MAC: {{ macAddress || '-' }}</span>
              </div>
            </div>
            <q-btn
              unelevated
              color="primary"
              label="Locate"
              @click="onLocate"
              :loading="isLocating"
              :disable="!isOnline"
              class="locate-button"
            />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useDeviceData } from '../../composables/useDeviceData';
import { startBlink, getApiErrorMessage } from '../../services/api';

const $q = useQuasar();
const { statistics, isOnline } = useDeviceData();

const isLocating = ref(false);

// Используем данные из composable
const deviceName = computed(() => {
  const model = statistics.value?.model;
  return model ? `${model.board} ${model.type}` : 'Loading...';
});
const ipAddress = computed(() => statistics.value?.network?.address);
const macAddress = computed(() => statistics.value?.network?.macaddr);
const deviceStatusText = computed(() => isOnline.value ? 'ONLINE' : 'OFFLINE');

const onLocate = async () => {
  if (!isOnline.value) return;
  isLocating.value = true;
  try {
    await startBlink();
    $q.notify({
      color: 'positive',
      message: 'Locate signal sent',
      icon: 'location_searching'
    });
   
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: `Locate failed: ${getApiErrorMessage(error)}`,
      icon: 'error'
    });
  } finally {
    isLocating.value = false;
  }
};

</script>

<style scoped lang="scss">
.bg-reference-card {
  background-color: rgba(14, 18, 22, 1); /* Новый фон для шапки */
  border-radius: 12px;
}

.syndicate-logo {
  height: 30px;
}

.status-container {
  border-radius: 20px;
  min-width: 90px;
  justify-content: center;
  white-space: nowrap;
}

.status-dot-ref {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.device-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ip-locate-wrapper {
  display: flex;
  align-items: stretch;
  background: transparent;
  border-radius: 8px;
  overflow: visible;
  gap: 8px;
}

.ip-mac-block {
  background: #1E2029;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  border-radius: 8px;
}

.network-info {
  display: flex;
  align-items: center;
  white-space: nowrap;
  font-size: 14px;
}

.locate-button {
  padding: 0 24px;
  border-radius: 8px;
  min-height: 40px;
  flex-shrink: 0;
  background: #4080FF !important;
}

// Медиа-запросы для мобильных устройств
@media (max-width: 599px) {
  .row {
    flex-wrap: wrap;
  }

  .ip-locate-wrapper {
    margin-top: 12px;
    width: 100%;
  }

  .ip-mac-block {
    padding: 8px 12px;
  }

  .network-info {
    flex-wrap: wrap;
    gap: 4px 16px;

    span.q-ml-lg {
    }
  }

  .locate-button {
    padding: 0 16px;
  }

  .syndicate-logo {
    height: 24px;
  }

  .status-container {
    min-width: auto;
  }

  .device-name {
    max-width: 150px;
  }
}
</style> 