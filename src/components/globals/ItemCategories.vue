<script setup>
// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    required: false
  },
  subject: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div :class="['premium-category-card', { active: active }]">
    <div class="category-content">
      <!-- Icon -->
      <div class="category-icon">
        <inline-svg :src="`/media/icons/shapes/${$filters.shapeStatus(icon)}.svg`"></inline-svg>
      </div>

      <!-- Title & Badge -->
      <div class="category-header">
        <h5 class="category-title">{{ title }}</h5>
        <span v-if="badge" class="category-badge">{{ badge }}</span>
      </div>

      <!-- Subject -->
      <p class="category-subject">{{ subject }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-category-card {
  height: 100%;
  padding: 1.25rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }

  &.active {
    border-color: #6366f1;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);

    .category-title {
      color: #6366f1;
    }

    .category-icon {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

      :deep(svg) {
        filter: brightness(0) invert(1);
      }
    }
  }
}

.category-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 0.75rem;
  transition: all 0.2s ease;

  :deep(svg) {
    width: 24px;
    height: 24px;
  }
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.category-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.5rem;
  background: #ef4444;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.category-subject {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}
</style>
