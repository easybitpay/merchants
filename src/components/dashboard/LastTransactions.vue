<script setup>
// Vue
import { onMounted, ref, watch } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Hook
import useSortTable from '@/hooks/useSortTable'
import useConvertDate from '@/hooks/useConvertDate'

// Components
import LastTransactionsItemLoading from '../loadings/LastTransactionsItemLoading.vue'

// ----- START ----- //

// Generals
const store = useAppStore()
const { convertDate } = useConvertDate()
const { startCheckSort, selectedSort } = useSortTable()

// Refs
const loading = ref(false)
const list = ref([])

// Functions

/**
 * Convert Status Code To Color
 */
const convertStatusToColor = (status) => {
  if (status == 0) return 'warning'
  if (status == 1 || status == 2) return 'expired'
  if (status == 10) return 'success'
}

/**
 * Convert Status Code To Text
 */
const convertStatusToText = (status) => {
  if (status == 0) return 'In Progress'
  if (status == 1) return 'Expired'
  if (status == 2) return 'Canceled'
  if (status == 10) return 'Paid'
}

/**
 * Get Last Invoices
 */
const getLastInvoices = async (pend) => {
  if (pend) {
    // Start Loading
    loading.value = true
  }

  // Set Variables
  let params = new URLSearchParams()
  params.set('page', '1')
  params.set('pageSize', '10')
  params.set('column', selectedSort.value.column || 'updated_at')
  params.set('direction', selectedSort.value.direction || 'desc')

  // requst
  await store.getInvoices(params).then((res) => {
    if (res) {
      list.value = res.list
    }
  })

  // Stop Loading
  loading.value = false
}

onMounted(async () => {
  await getLastInvoices(true)
  startCheckSort('lastInvoices')
})

watch(selectedSort, () => {
  getLastInvoices(false)
})
</script>

<template>
  <div class="premium-transactions-card">
    <div class="transactions-header">
      <h3 class="transactions-title">Recent Transactions</h3>
    </div>

    <div class="transactions-table">
      <table>
        <thead>
          <tr lastInvoices-sortable sortable>
            <th sortKey="id">ID</th>
            <th sortKey="code">Code</th>
            <th sortKey="created_at">Date</th>
            <th sortKey="amount">Amount</th>
            <th sortKey="status">Status</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <LastTransactionsItemLoading v-for="item in 5" :key="item" />
          </template>

          <template v-else>
            <tr v-for="item in list" :key="item.id">
              <td>
                <span class="id-badge">#{{ item.id }}</span>
              </td>
              <td>
                <span class="code-text">{{ item.code }}</span>
              </td>
              <td>
                <span class="date-text">
                  {{ convertDate(item.created_at, 'DD.MMM.YYYY - hh:mm') }}
                </span>
              </td>
              <td>
                <span class="amount-text">
                  {{ item.amount }} {{ item?.baseToken?.symbol }}
                </span>
              </td>
              <td>
                <span :class="`status-badge status-${convertStatusToColor(item.status)}`">
                  {{ convertStatusToText(item.status) }}
                </span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.premium-transactions-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.transactions-header {
  margin-bottom: 1.5rem;
}

.transactions-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}

.transactions-table {
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  thead {
    tr {
      border-bottom: 1.5px solid #e5e7eb;
    }

    th {
      padding: 0.75rem 1rem;
      text-align: left;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: #374151;
      }

      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        padding-right: 0;
      }
    }
  }

  tbody {
    tr {
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #f9fafb;
      }
    }

    td {
      padding: 1rem;
      font-size: 0.9375rem;
      color: #374151;
      border-bottom: 1px solid #f3f4f6;

      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        padding-right: 0;
        border-bottom: none;
      }
    }

    tr:last-child td {
      border-bottom: none;
    }
  }
}

.id-badge {
  font-weight: 600;
  color: #6366f1;
  font-size: 0.875rem;
}

.code-text {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  color: #374151;
}

.date-text {
  color: #6b7280;
  white-space: nowrap;
}

.amount-text {
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;

  &.status-success {
    background: #d1fae5;
    color: #065f46;
  }

  &.status-warning {
    background: #fef3c7;
    color: #92400e;
  }

  &.status-expired {
    background: #f3f4f6;
    color: #6b7280;
  }
}

@media (max-width: 768px) {
  .premium-transactions-card {
    padding: 1rem;
  }

  .transactions-table {
    thead th,
    tbody td {
      padding: 0.75rem 0.5rem;
      font-size: 0.8125rem;
    }
  }

  .status-badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
