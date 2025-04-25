<template>
  <q-card flat class="metric-card text-white">
    <q-card-section>
      <div class="row items-start no-wrap">
        <div class="col">
          <div class="text-caption q-mb-xs">{{ title }}</div>
          <div class="value-unit-row row items-baseline q-gutter-xs">
             <div class="text-h6 text-weight-medium">{{ value }}</div>
             <div v-if="unit" class="text-caption">{{ unit }}</div>
          </div>
        </div>

        <div class="col-auto">
          <!-- Use img tag for custom icons -->
          <img 
            v-if="isImagePath(icon)" 
            :src="icon" 
            alt="icon" 
            class="metric-icon"
          />
          <!-- Fallback to q-icon if it's not a path -->
          <q-icon 
            v-else 
            :name="icon" 
            size="2.5em" 
            color="#4080FF" 
            class="metric-icon"
           />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{ 
  title: string;
  value: string | number;
  unit?: string;
  icon: string; 
}>();

// Helper to check if the icon string looks like a path
const isImagePath = (iconName: string): boolean => {
  return typeof iconName === 'string' && (iconName.includes('/') || iconName.includes('.'));
};
</script>

<style scoped lang="scss">
.metric-card {
  background: #3A3D4E;
  border-radius: 8px;
  height: 100%;
}

.value-unit-row {
  margin-bottom: 0;
}

.metric-icon {
  width: 32px;
  height: 32px;
  margin-left: 8px;
  opacity: 0.9;
  object-fit: contain;
}
</style> 