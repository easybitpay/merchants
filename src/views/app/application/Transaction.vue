<script setup>
// Vue
import { onMounted, watch, computed, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Bootstrap
import { Tooltip } from 'bootstrap'

// Hook
import useSortTable from '@/hooks/useSortTable'

// Component
import ApplicationCard from '../../../components/application/ApplicationCard.vue'
import TransactionItem from '../../../components/application/transaction/TransactionItem.vue'
import PaginationCard from '../../../components/globals/PaginationCard.vue'

// ----- START ----- //

// Generals
const store = useAppStore()
const { startCheckSort, selectedSort } = useSortTable()

// Refs
const loadings = ref({
  list: false,
  pagination: false
})
const history = ref([])
const lastPage = ref(1)
const currentPage = ref(1)

// Computeds
const selectedApp = computed(() => store.selectedApp)

// Functions

/**
 * Get App invoices
 */
const get_app_invoices = async (page) => {
  // Start Loading
  if (page === 1) {
    loadings.value.list = true
  } else {
    loadings.value.pagination = true
  }

  // Set Variables
  const id = selectedApp.value.id
  let params = new URLSearchParams()
  params.set('page', `${page}`)
  params.set('pageSize', '15')
  params.set('column', selectedSort.value.column || 'updated_at')
  params.set('direction', selectedSort.value.direction || 'desc')

  // Request
  await store.getAppInvoices({ id, params }).then((res) => {
    if (res) {
      if (page === 1) {
        history.value = res.list
      } else {
        history.value = [...history.value, ...res.list]
      }
      currentPage.value = page
      lastPage.value = res.lastPage
    }
  })

  // Stop Loading
  loadings.value.list = false
  loadings.value.pagination = false
}

onMounted(async () => {
  await get_app_invoices(1)

  startCheckSort('transaction')
  new Tooltip(document.body, {
    selector: "[data-bs-html='true']",
    sanitize: false
  })
})

watch(selectedSort, () => {
  get_app_invoices(1)
})
</script>
<template>
  <ApplicationCard action="status" :app="selectedApp" />

  <div class="accordion mt-10" id="transAccordion">
    <div class="table-responsive accordion-table">
      <table class="table pb-4">
        <thead>
          <tr transaction-sortable sortable>
            <th sortKey="id">ID</th>
            <th sortKey="code">Invoice Link</th>
            <th sortKey="created_at">Date</th>
            <th sortKey="client_order_identifier">Customer No.</th>
            <th sortKey="amount">Amount</th>
            <th sortKey="status">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <TransactionItem v-for="item in history" :key="item.id" :item="item" />

          <!-- begin::Show More -->
          <tr class="collapsed show-more" v-if="lastPage > currentPage">
            <td colspan="7">
              <PaginationCard
                :bold="false"
                text="Show More Transaction"
                count="15"
                :loading="loadings.pagination"
                @clicked="get_app_invoices(currentPage + 1)"
              />
            </td>
          </tr>
          <!-- end::Show More -->
        </tbody>
      </table>
    </div>
  </div>
</template>
