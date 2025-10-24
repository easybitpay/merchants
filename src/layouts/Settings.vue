<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { name: 'settings-basic', label: 'Basic', icon: 'M10 12a2 2 0 100-4 2 2 0 000 4zM13.778 7.778a5.778 5.778 0 11-8.17 8.17 5.778 5.778 0 018.17-8.17' },
  { name: 'settings-privacy', label: 'Privacy', icon: 'M8 7a2 2 0 100-4 2 2 0 000 4zM3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z' },
  { name: 'settings-notification', label: 'Notifications', icon: 'M8 1.918l-.797.161A4.002 4.002 0 003 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C11.134 8.197 11 6.628 11 6a4.002 4.002 0 00-4.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 111.99 0A5.002 5.002 0 0113 6c0 .88.32 4.2 1.22 6z M6.5 14a1.5 1.5 0 103 0' },
  { name: 'settings-customize', label: 'Customize', icon: 'M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 01-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 01.872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 012.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 012.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 01.872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 01-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 01-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 100-5.86 2.929 2.929 0 000 5.858z' }
]

const isActive = (name) => route.name === name
</script>
<template>
  <div class="premium-settings-layout">
    <div class="settings-container">
      <!-- Navigation Tabs -->
      <nav class="settings-tabs">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.name"
          :to="{ name: tab.name }"
          class="settings-tab"
          :class="{ active: isActive(tab.name) }"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fill-rule="evenodd" :d="tab.icon" />
          </svg>
          <span>{{ tab.label }}</span>
        </RouterLink>
      </nav>

      <!-- Content -->
      <div class="settings-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-settings-layout {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.settings-container {
  max-width: 1200px;
  margin: 0 auto;
}

.settings-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.375rem;
  background: white;
  border-radius: 0.75rem;
  border: 1.5px solid #e5e7eb;
  overflow-x: auto;
  
  @media (max-width: 640px) {
    gap: 0.25rem;
    padding: 0.25rem;
  }
}

.settings-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.15s ease;
  
  @media (max-width: 640px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    gap: 0.375rem;
    
    span {
      display: none;
    }
  }
  
  @media (min-width: 641px) {
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  @media (max-width: 640px) {
    svg {
      width: 18px;
      height: 18px;
    }
  }
  
  &:hover {
    background: #f9fafb;
    color: #374151;
  }
  
  &.active {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    }
  }
}

.settings-content {
  // Content styling handled by individual pages
}
</style>
