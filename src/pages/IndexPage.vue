<template>
  <q-page class="q-pa-md">
    <!-- УБИРАЕМ ВРЕМЕННЫЕ КНОПКИ -->
    <!-- <div class="q-mb-md text-right">
      <q-btn label="Settings" color="primary" @click="showSettingsDialog = true" class="q-mr-sm" />
      <q-btn label="Reboot" color="negative" @click="showRebootDialog = true" />
    </div> -->

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12">
        <device-info />
      </div>
    </div>

    <!-- Секция: Метрики слева, Панель управления справа -->
    <div class="row q-col-gutter-md q-mb-md">
      <!-- Левая колонка: Блок метрик -->
      <div class="col-12 col-lg-8">
        <metrics-grid />
      </div>
      <!-- Правая колонка: Панель управления -->
      <div class="col-12 col-lg-4">
        <q-card flat class="bg-dark-alt text-white full-height">
          <q-card-section>
            <!-- Заголовок убран, т.к. на макете его нет -->
            <!-- <div class="text-h6 q-mb-md">Device Control</div> -->

            <!-- Отображение IP, Port, User, Power -->
            <div class="control-info q-mb-md">
              <div class="row items-center q-mb-sm">
                <strong class="col-4 text-grey-6">Server IP:</strong>
                <span class="col-8">{{ deviceControlInfo.ip }}</span>
              </div>
              <div class="row items-center q-mb-sm">
                <strong class="col-4 text-grey-6">Port:</strong>
                <span class="col-8">{{ deviceControlInfo.port }}</span>
              </div>
              <div class="row items-center q-mb-sm">
                <strong class="col-4 text-grey-6">UserName:</strong>
                <span class="col-8">{{ deviceControlInfo.username }}</span>
              </div>
              <div class="row items-center">
                <strong class="col-4 text-grey-6">Power:</strong>
                <span class="col-8">{{ deviceControlInfo.power }} W</span>
              </div>
            </div>

            <!-- Кнопки управления -->
            <div class="row q-gutter-sm justify-end">
               <q-btn
                 label="Reboot"
                 color="grey-8" 
                 text-color="white"
                 icon="refresh" 
                 @click="showRebootDialog = true"
                 class="reboot-button"
                 no-caps
                 outline
                 rounded
               />
               <q-btn
                 label="Setting" 
                 color="primary"
                 @click="showSettingsDialog = true"
                 class="settings-button"
                 no-caps
                 rounded
               />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Секция: Графики (под метриками и панелью) -->
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <charts-section />
      </div>
    </div>

    <!-- Модальное окно Настроек -->
    <q-dialog v-model="showSettingsDialog">
      <!-- Добавляем классы и стили -->
      <q-card class="bg-dark-alt text-white dialog-card" style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Settings</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md"> 
          <!-- Добавляем q-pt-md для отступа -->
          <network-settings />
          <power-settings class="q-mt-lg"/> <!-- Увеличиваем отступ q-mt-lg -->
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <!-- Стилизуем кнопки -->
          <q-btn 
            label="Cancel" 
            color="grey-8" 
            text-color="white"
            outline
            rounded 
            no-caps 
            v-close-popup 
            class="dialog-button"
          />
          <q-btn 
            label="Save" 
            color="primary" 
            rounded 
            no-caps 
            @click="saveSettings" 
            class="dialog-button q-ml-sm" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Модальное окно Перезагрузки -->
    <q-dialog v-model="showRebootDialog">
      <!-- Добавляем класс для стилизации -->
      <q-card class="bg-dark-alt text-white dialog-card" style="width: 400px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Reboot</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <p>Do you really want to restart the device?</p>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <!-- Стилизуем кнопки -->
          <q-btn 
            label="Cancel" 
            color="grey-8" 
            text-color="white"
            outline
            rounded 
            no-caps 
            v-close-popup 
            class="dialog-button"
          />
          <q-btn 
            label="Reboot"  
            color="primary" 
            rounded 
            no-caps 
            @click="confirmReboot" 
            class="dialog-button q-ml-sm" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue' // Импортируем ref и reactive
import DeviceInfo from 'components/dashboard/DeviceInfo.vue'
import MetricsGrid from 'components/dashboard/MetricsGrid.vue'
import ChartsSection from 'components/dashboard/ChartsSection.vue'
import NetworkSettings from 'components/dashboard/NetworkSettings.vue'
import PowerSettings from 'components/dashboard/PowerSettings.vue'

// Состояние для управления видимостью модальных окон
const showSettingsDialog = ref(false)
const showRebootDialog = ref(false)

// Реактивные данные для панели управления (заглушка)
// TODO: Заменить реальными данными
const deviceControlInfo = reactive({
  ip: '222.222.222.22',
  port: 8888,
  username: 'administrator',
  power: 3500
})

// Методы для модальных окон (остаются без изменений)
const saveSettings = () => {
  console.log('Saving settings...')
  // Логика сохранения
  showSettingsDialog.value = false
}

const confirmReboot = () => {
  console.log('Rebooting device...')
  // Логика перезагрузки
  showRebootDialog.value = false
}
</script>

<style scoped lang="scss">
.q-page {
  background: rgba(27, 40, 49, 1); /* Новый цвет фона */
  min-height: 100vh;
}

.bg-dark-alt {
  background-color: rgba(14, 18, 22, 1); /* Новый фон для панели управления */
  border-radius: 12px;
}

.full-height {
  height: 100%;
}

/* Стили для блока информации в панели управления */
.control-info {
  strong {
    font-weight: 500; /* Слегка изменим жирность для соответствия макету */
  }
}

/* Стили для кнопок, чтобы соответствовать макету */
.settings-button {
  min-width: 100px;
}
.reboot-button {
  min-width: 100px;
  border: 1px solid rgba(255, 255, 255, 0.28);
}

// Адаптивность: на маленьких экранах панель управления будет под метриками
@media (max-width: 1023px) {
  .col-lg-8,
  .col-lg-4 {
    width: 100%;
  }
}

/* Стили для карточки диалога */
.dialog-card {
  background-color: #1E2029; /* Более светлый фон для диалогов */
  border-radius: 12px; 
}

/* Общие стили для кнопок диалога */
.dialog-button {
  min-width: 90px;
}

/* Стили для компонентов внутри диалога настроек */
/* Возможно, понадобится перенести в сами компоненты */
:deep(.q-dialog .q-card) {
  .q-input {
    .q-field__label {
      color: $grey-6; // Цвет лейбла
    }
    .q-field__control {
      background: transparent !important; // Прозрачный фон
      border: 1px solid rgba(255, 255, 255, 0.28); // Рамка
      border-radius: 8px;
      &:before, &:after {
        border: none !important; // Убираем стандартные линии quasar
      }
    }
    .q-field__native,
    .q-field__input {
      color: white; // Цвет текста ввода
    }
  }
  // Стили для PowerSettings (можно сделать точнее, если знать структуру)
  .power-settings-component { // Заменить на реальный класс/селектор
    .q-input {
      // специфичные стили, если нужны
    }
  }
}
</style>
