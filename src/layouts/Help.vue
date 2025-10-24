<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { name: 'help-knowledge', label: 'Knowledge', icon: 'M8 1a3 3 0 013 3v1h1.5a.5.5 0 01.5.5v1a.5.5 0 01-.5.5H13v7a3 3 0 01-3 3H6a3 3 0 01-3-3V7h-.5a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5H4V4a3 3 0 013-3h1zm2 3a2 2 0 00-2-2H7a2 2 0 00-2 2v1h5V4z' },
  { name: 'help-faq', label: 'FAQ', icon: 'M8 15A7 7 0 118 1a7 7 0 010 14zm0 1A8 8 0 108 0a8 8 0 000 16z M5.255 5.786a.237.237 0 00.241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 00.25.246h.811a.25.25 0 00.25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z' },
  { name: 'help-ticket', label: 'Ticket', icon: 'M0 4.5A1.5 1.5 0 011.5 3h13A1.5 1.5 0 0116 4.5V6a.5.5 0 01-.5.5 1.5 1.5 0 000 3 .5.5 0 01.5.5v1.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 010 11.5V10a.5.5 0 01.5-.5 1.5 1.5 0 100-3A.5.5 0 010 6V4.5z' }
]

const isActive = (name) => route.name === name
</script>
<template>
  <div class="premium-help-layout">
    <div class="help-container">
      <!-- Navigation Tabs -->
      <nav class="help-tabs">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.name"
          :to="{ name: tab.name }"
          class="help-tab"
          :class="{ active: isActive(tab.name) }"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fill-rule="evenodd" :d="tab.icon" />
          </svg>
          <span>{{ tab.label }}</span>
        </RouterLink>
      </nav>

      <!-- Content -->
      <div class="help-content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-help-layout {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.help-container {
  max-width: 1400px;
  margin: 0 auto;
}

.help-tabs {
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

.help-tab {
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

.help-content {
  // Content styling handled by individual pages
}
</style>
