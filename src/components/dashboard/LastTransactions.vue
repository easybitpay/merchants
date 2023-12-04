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
  if (status == 1 || status == 2) return 'gray-500'
  if (status == 10) return 'success'
}

/**
 * Convert Status Code To Text
 */
const convertStatusToText = (status) => {
  if (status == 0) return 'in Progress...'
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
  <div class="card">
    <div class="card-body">
      <!-- begin::Header -->
      <h4 class="neue-machina mb-9 text-gray-900 fw-normal">Your Last Transaction</h4>
      <!-- end::Header -->

      <!-- begin::Table -->
      <div class="table-responsive">
        <table class="table simple-table">
          <thead>
            <tr class="space-icon" lastInvoices-sortable sortable>
              <th sortKey="id" class="min-w-70px">ID</th>
              <th sortKey="code" class="min-w-200px">Code</th>
              <th sortKey="created_at" class="min-w-200px">Date</th>
              <th sortKey="amount" class="min-w-200px">Amount</th>
              <th sortKey="status" class="min-w-200px">Status</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <LastTransactionsItemLoading v-for="item in 2" :key="item" />
            </template>

            <template v-else>
              <tr v-for="item in list" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.code }}</td>
                <td>
                  <div class="max-content">
                    {{ convertDate(item.created_at, 'DD.MMM.YYYY - hh:mm') }}
                  </div>
                </td>
                <td>
                  <div class="max-content">{{ item.amount }} {{ item?.baseToken?.symbol }}</div>
                </td>
                <td>
                  <div :class="`max-content text-${convertStatusToColor(item.status)}`">
                    {{ convertStatusToText(item.status) }}
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <!-- end::Table -->
    </div>
  </div>
</template>
