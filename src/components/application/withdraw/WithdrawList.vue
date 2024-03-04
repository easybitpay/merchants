<script setup>
// Vue
import { onMounted, watch, ref, computed } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Bootstrap
import { Tooltip } from 'bootstrap'

// Hook
import useSortTable from '@/hooks/useSortTable'

// Components
import PaginationCard from '../../globals/PaginationCard.vue'
import WithdrawItem from './WithdrawItem.vue'
import WithdrawItemLoading from '../../loadings/WithdrawItemLoading.vue'

// ----- START ----- //

// Generals
const store = useAppStore()
const { startCheckSort, selectedSort } = useSortTable()

// Refs
const showList = ref(false)
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
 * Get App Withdraws
 */
const get_app_withdraws = async (page) => {
  // Start Loading
  if (page === 1) {
    loadings.value.list = true
  } else {
    loadings.value.pagination = true
  }

  // Set Variables
  let params = new URLSearchParams()
  params.set('appId', selectedApp.value.id)
  params.set('page', `${page}`)
  params.set('pageSize', '15')
  params.set('column', selectedSort.value.column || 'updated_at')
  params.set('direction', selectedSort.value.direction || 'desc')

  // Request
  await store.getAppWithdraws(params).then((res) => {
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

/**
 * Update Withdraw Item
 */
const updateItem = (item) => {
  for (let i = 0; i < history.value.length; i++) {
    const element = history.value[i]
    if (element.id == item.id) {
      history.value[i] = item

      break
    }
  }
}

onMounted(async () => {
  await get_app_withdraws(1)

  startCheckSort('withdraw')
  new Tooltip(document.body, {
    selector: "[data-bs-html='true']"
  })
})

watch(selectedSort, () => {
  get_app_withdraws(1)
})
</script>
<template>
  <PaginationCard
    v-if="history.length"
    :text="`${showList ? 'Hide' : 'Show'} Withdraws`"
    :bold="false"
    :shadows="!showList"
    gap="4"
    :count="history.length"
    @clicked="showList = !showList"
  />

  <div class="accordion" id="withdAccordion" v-show="showList">
    <div class="table-responsive accordion-table">
      <table class="table pb-4">
        <thead>
          <tr withdraw-sortable sortable>
            <th sortKey="id">ID</th>
            <th sortKey="created_at">Date</th>
            <th sortKey="wallet_address">Wallet Address</th>
            <th sortKey="amount">Amount</th>
            <th sortKey="token">Token</th>
            <th sortKey="fee">Fee</th>
            <th sortKey="status">Status</th>
            <th class="ps-0"></th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loadings.list">
            <WithdrawItemLoading v-for="item in 2" :key="item" />
          </template>

          <template v-else>
            <WithdrawItem
              v-for="item in history"
              :key="item.id"
              :item="item"
              @updateItem="updateItem"
            />

            <!-- begin::Show More -->
            <tr class="collapsed show-more" v-if="lastPage > currentPage">
              <td colspan="7">
                <PaginationCard
                  :bold="false"
                  text="Show More Withdraws"
                  :count="15"
                  :loading="loadings.pagination"
                  @clicked="get_app_withdraws(currentPage + 1)"
                />
              </td>
            </tr>
            <!-- end::Show More -->
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
