<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import useIconImage from '@/hooks/useIconImage'

const { iconImage } = useIconImage()

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  selected: {
    type: [Object, Array],
    default: null
  },
  placeholder: {
    type: String,
    default: 'Select...'
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])

const isOpen = ref(false)
const searchQuery = ref('')

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items
  return props.items.filter(item => {
    const name = item.name?.toLowerCase() || ''
    const symbol = item.symbol?.toLowerCase() || ''
    const query = searchQuery.value.toLowerCase()
    return name.includes(query) || symbol.includes(query)
  })
})

const selectedItems = computed(() => {
  if (props.multiple) {
    return Array.isArray(props.selected) ? props.selected : []
  }
  return props.selected
})

const displayText = computed(() => {
  if (props.multiple) {
    const count = selectedItems.value.length
    if (count === 0) return props.placeholder
    if (count === 1) return selectedItems.value[0].name
    return `${count} currencies selected`
  }
  return props.selected?.name || props.placeholder
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const selectItem = (item) => {
  if (props.multiple) {
    const index = selectedItems.value.findIndex(i => i.id === item.id)
    let newSelection = [...selectedItems.value]
    
    if (index > -1) {
      newSelection.splice(index, 1)
    } else {
      newSelection.push(item)
    }
    
    emit('change', newSelection)
  } else {
    emit('change', item)
    isOpen.value = false
  }
}

const isSelected = (item) => {
  if (props.multiple) {
    return selectedItems.value.some(i => i.id === item.id)
  }
  return props.selected?.id === item.id
}

const removeItem = (item, event) => {
  event.stopPropagation()
  const newSelection = selectedItems.value.filter(i => i.id !== item.id)
  emit('change', newSelection)
}

// Close dropdown when clicking outside
const dropdownRef = ref(null)
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="crypto-select" ref="dropdownRef">
    <!-- Selected Display -->
    <div 
      class="crypto-select-trigger"
      :class="{ 'is-open': isOpen, 'has-value': props.multiple ? selectedItems.length : props.selected }"
      @click="toggleDropdown"
    >
      <div class="crypto-select-value">
        <!-- Single Select Display -->
        <div v-if="!props.multiple && props.selected && props.selected.id" class="d-flex align-items-center gap-2">
          <img v-if="props.selected.symbol" 
               :src="iconImage(props.selected.symbol)" 
               :alt="props.selected.name" 
               width="24" 
               height="24"
               class="crypto-icon" />
          <span class="crypto-name">{{ props.selected.name }}</span>
          <span v-if="props.selected.symbol" class="crypto-symbol">{{ props.selected.symbol }}</span>
        </div>
        
        <!-- Multiple Select Display -->
        <div v-else-if="props.multiple && selectedItems.length" class="crypto-chips">
          <div v-for="item in selectedItems.slice(0, 3)" :key="item.id" class="crypto-chip">
            <img v-if="item.symbol"
                 :src="iconImage(item.symbol)" 
                 :alt="item.name" 
                 width="20" 
                 height="20" />
            <span>{{ item.symbol || item.name }}</span>
            <button type="button" class="chip-remove" @click="removeItem(item, $event)">×</button>
          </div>
          <span v-if="selectedItems.length > 3" class="crypto-chip-more">
            +{{ selectedItems.length - 3 }} more
          </span>
        </div>
        
        <!-- Placeholder -->
        <span v-else class="crypto-placeholder">{{ placeholder }}</span>
      </div>
      
      <svg class="crypto-select-arrow" :class="{ 'rotate': isOpen }" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- Dropdown Menu -->
    <transition name="dropdown">
      <div v-if="isOpen" class="crypto-select-dropdown">
        <!-- Search -->
        <div class="crypto-select-search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="search-icon">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 10L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search currencies..."
            class="crypto-search-input"
            @click.stop
          />
        </div>

        <!-- Items List -->
        <div class="crypto-select-list">
          <div 
            v-for="item in filteredItems" 
            :key="item.id"
            class="crypto-select-item"
            :class="{ 'is-selected': isSelected(item) }"
            @click="selectItem(item)"
          >
            <img v-if="item.symbol"
                 :src="iconImage(item.symbol)" 
                 :alt="item.name" 
                 width="32" 
                 height="32"
                 class="crypto-icon" />
            <div class="crypto-info">
              <div class="crypto-name">{{ item.name }}</div>
              <div v-if="item.symbol" class="crypto-symbol">{{ item.symbol }}</div>
            </div>
            <div v-if="isSelected(item)" class="crypto-check">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          
          <div v-if="!filteredItems.length" class="crypto-select-empty">
            No currencies found
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.crypto-select {
  position: relative;
  width: 100%;
}

.crypto-select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 48px;

  &:hover {
    border-color: #d1d5db;
  }

  &.is-open {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
}

.crypto-select-value {
  flex: 1;
  min-width: 0;
}

.crypto-placeholder {
  color: #9ca3af;
  font-size: 0.9375rem;
}

.crypto-name {
  font-weight: 500;
  color: #111827;
  font-size: 0.9375rem;
}

.crypto-symbol {
  color: #6b7280;
  font-size: 0.875rem;
}

.crypto-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.crypto-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;

  img {
    flex-shrink: 0;
  }

  .chip-remove {
    border: none;
    background: none;
    padding: 0;
    margin-left: 0.125rem;
    color: #6b7280;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
      color: #111827;
    }
  }
}

.crypto-chip-more {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.crypto-icon {
  flex-shrink: 0;
  border-radius: 50%;
}

.crypto-select-arrow {
  flex-shrink: 0;
  color: #6b7280;
  transition: transform 0.2s ease;

  &.rotate {
    transform: rotate(180deg);
  }
}

.crypto-select-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 320px;
  display: flex;
  flex-direction: column;
}

.crypto-select-search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;

  .search-icon {
    flex-shrink: 0;
    color: #9ca3af;
  }

  .crypto-search-input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 0.9375rem;
    color: #111827;

    &::placeholder {
      color: #9ca3af;
    }
  }
}

.crypto-select-list {
  overflow-y: auto;
  max-height: 256px;
}

.crypto-select-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f9fafb;
  }

  &.is-selected {
    background: #eef2ff;

    .crypto-name {
      color: #4f46e5;
    }
  }

  .crypto-info {
    flex: 1;
    min-width: 0;
  }

  .crypto-name {
    font-weight: 500;
    font-size: 0.9375rem;
    margin-bottom: 0.125rem;
  }

  .crypto-symbol {
    font-size: 0.8125rem;
    color: #6b7280;
  }

  .crypto-check {
    flex-shrink: 0;
    color: #4f46e5;
  }
}

.crypto-select-empty {
  padding: 2rem 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

// Dropdown transition
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

// ===== DARK MODE STYLES =====
[data-bs-theme="dark"] {
  .crypto-select-trigger {
    background: #0f1011;
    border-color: #2d3233;

    &:hover {
      border-color: #374151;
    }

    &.is-open {
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }
  }

  .crypto-placeholder {
    color: #6b7280;
  }

  .crypto-name {
    color: #f3f4f6;
  }

  .crypto-symbol {
    color: #9ca3af;
  }

  .crypto-chip {
    background: #1a1d1e;
    color: #e5e7eb;

    .chip-remove {
      color: #9ca3af;

      &:hover {
        color: #f3f4f6;
      }
    }
  }

  .crypto-chip-more {
    color: #9ca3af;
  }

  .crypto-select-arrow {
    color: #9ca3af;
  }

  .crypto-select-dropdown {
    background: #1a1d1e;
    border-color: #2d3233;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }

  .crypto-select-search {
    border-bottom-color: #2d3233;

    .search-icon {
      color: #6b7280;
    }

    .crypto-search-input {
      background: transparent;
      color: #f3f4f6;

      &::placeholder {
        color: #6b7280;
      }
    }
  }

  .crypto-select-item {
    &:hover {
      background: #0f1011;
    }

    &.is-selected {
      background: #1e3a8a;

      .crypto-name {
        color: #bfdbfe;
      }

      .crypto-symbol {
        color: #93c5fd;
      }
    }

    .crypto-name {
      color: #f3f4f6;
    }

    .crypto-symbol {
      color: #9ca3af;
    }

    .crypto-check {
      color: #a5b4fc;
    }
  }

  .crypto-select-empty {
    color: #6b7280;
  }
}
</style>
