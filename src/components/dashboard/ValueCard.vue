<script setup>
const props = defineProps({
  iconColor: {
    type: String,
    default: '#6366f1',
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: String
  },
  valuePrifix: {
    type: String,
    default: '$'
  },
  loading: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div class="premium-value-card">
    <div class="card-icon" :style="{ background: `linear-gradient(135deg, ${iconColor}, ${iconColor}dd)` }">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v20M2 12h20"/>
      </svg>
    </div>

    <div class="card-content">
      <div class="card-label">{{ title }}</div>
      
      <div v-if="!loading" class="card-value">
        <span class="value-prefix">{{ valuePrifix }}</span>{{ value }}
      </div>

      <Skeletor v-else width="120" height="32" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-value-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: #d1d5db;
  }
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2.5px;
  }
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.card-value {
  font-size: 1.875rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.2;
  display: flex;
  align-items: baseline;
  gap: 0.125rem;

  .value-prefix {
    font-size: 1.5rem;
    color: #6b7280;
    font-weight: 500;
  }
}

@media (max-width: 768px) {
  .premium-value-card {
    padding: 1.25rem;
  }

  .card-icon {
    width: 40px;
    height: 40px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .card-value {
    font-size: 1.5rem;

    .value-prefix {
      font-size: 1.25rem;
    }
  }
}
</style>
