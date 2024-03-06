<script setup>
// Vue
import { onMounted, watch, computed, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Router
import { useRoute } from 'vue-router'

// Bootstrap
import { Tooltip } from 'bootstrap'

// Component
import TransactionItem from '../../../components/application/transaction/TransactionItem.vue'
import TransactionItemLoading from '../../../components/loadings/TransactionItemLoading.vue'
import PaginationCard from '../../../components/globals/PaginationCard.vue'
import SelectDropdown from '../../../components/globals/SelectDropdown.vue'

//
const searchConditions = [
  {
    key: '=',
    title: 'Equal'
  },
  {
    key: 'like',
    title: 'Like'
  },
  {
    key: '<',
    title: 'More than'
  },
  {
    key: '>',
    title: 'Less than'
  }
]

const searchColumnKeys = [
  {
    key: 'code',
    title: 'Invoice Code'
  },
  {
    key: 'id',
    title: 'ID'
  },
  {
    key: 'amount',
    title: 'Amount'
  },
  {
    key: 'hash',
    title: 'Hash'
  },
  {
    key: 'wallet_address',
    title: 'Wallet Address'
  },
  {
    key: 'base_token',
    title: 'Base Token'
  }
]

// ----- START ----- //

// Generals
const store = useAppStore()
const route = useRoute()

// Refs
const loadings = ref({
  list: false,
  pagination: false
})
const history = ref([])
const lastPage = ref(1)
const currentPage = ref(1)

const timeout = ref(null)
const searchOnColumns = ref([])
const searchColumns = ref([
  {
    value: '',
    condition: {
      key: '=',
      title: 'Equal'
    },
    column: {
      key: 'code',
      title: 'Invoice Code'
    }
  }
])

// Functions
const toggleSearchCondition = (condition, index) => {
  searchColumns.value[index].condition = condition
  createSearchColumnArray()
}

const toggleSearchColumn = (column, index) => {
  searchColumns.value[index].column = column
  createSearchColumnArray()
}

const addNewColumn = () => {
  searchColumns.value.push({
    value: '',
    condition: {
      key: '=',
      title: 'Equal'
    },
    column: {
      key: 'code',
      title: 'Invoice Code'
    }
  })
}

const removeItem = (index) => {
  searchColumns.value.splice(index, 1)

  createSearchColumnArray()

  if (!searchColumns.value.length) {
    searchColumns.value.push({
      value: '',
      condition: {
        key: '=',
        title: 'Equal'
      },
      column: {
        key: 'code',
        title: 'Invoice Code'
      }
    })
  }
}

const searchTimeOut = () => {
  if (timeout.value) {
    clearTimeout(timeout.value)
    timeout.value = null
  }
  timeout.value = setTimeout(() => {
    createSearchColumnArray()
  }, 800)
}

const createSearchColumnArray = () => {
  let searchArray = []
  let before = [...searchOnColumns.value]
  for (let i = 0; i < searchColumns.value.length; i++) {
    const element = searchColumns.value[i]

    if (element.column.key && element.value) {
      searchArray.push({
        value: element.value,
        column: element.column.key,
        condition: element.condition.key
      })
    }
  }

  searchOnColumns.value = [...searchArray]
  if (JSON.stringify(before) != JSON.stringify(searchOnColumns.value)) {
    get_app_invoices(1)
  }
}

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
  const id = route.params.id
  let params = new URLSearchParams()
  params.set('page', `${page}`)
  params.set('pageSize', '15')
  params.set('column', 'updated_at')
  params.set('direction', 'desc')
  params.set('searchOnColumns', JSON.stringify(searchOnColumns.value))

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

  new Tooltip(document.body, {
    selector: "[data-bs-html='true']",
    sanitize: false
  })
})
</script>
<template>
  <!-- begin::Title -->
  <div class="d-flex align-items-center gap-2 mb-4">
    <RouterLink :to="{ name: 'application-transaction', params: { id: route.params.id } }">
      <inline-svg
        :src="`media/icons/icons/long-arrow-left.svg`"
        class="cursor-pointer"
        height="24"
      ></inline-svg>
    </RouterLink>
    <h2 class="mb-0 text-primary neue-machina">Transaction Focus mode</h2>
  </div>
  <!-- end::Title -->

  <div class="card" style="border-radius: 20px">
    <div class="card-body p-4">
      <div class="d-flex flex-column gap-6">
        <!-- begin::Items -->
        <div
          class="d-flex align-items-start gap-2"
          v-for="(item, index) in searchColumns"
          :key="index"
        >
          <div class="w-100">
            <!-- begin::Form -->
            <div class="row gy-4">
              <div class="col-md-4">
                <input
                  type="text"
                  class="form-control w-100"
                  placeholder="Value"
                  v-model="item.value"
                  @input="searchTimeOut"
                />
              </div>

              <div class="col-md-4">
                <SelectDropdown
                  show="title"
                  check="key"
                  width="initial"
                  placeholder="Select Your rule"
                  :items="searchConditions"
                  :selected="item.condition"
                  @change="(info) => toggleSearchCondition(info, index)"
                />
              </div>

              <div class="col-md-4">
                <SelectDropdown
                  show="title"
                  check="key"
                  width="initial"
                  placeholder="Select Your rule"
                  :items="searchColumnKeys"
                  :selected="item.column"
                  @change="(info) => toggleSearchColumn(info, index)"
                />
              </div>
            </div>
            <!-- end::Form -->
          </div>

          <!-- begin::Icon -->
          <div>
            <div class="h-40px w-24px d-flex align-items-center justify-content-center">
              <inline-svg
                :src="`media/icons/icons/close.svg`"
                class="cursor-pointer svg-icon-gray-700"
                height="24"
                @click="removeItem(index)"
              ></inline-svg>
            </div>
          </div>

          <!-- end::Icon -->
        </div>
        <!-- end::Items -->
      </div>
      <!-- begin::Items -->
      <div class="d-flex align-items-start gap-2 mt-4">
        <div class="w-100">
          <!-- begin::Form -->
          <div class="row">
            <div class="col-md-4">
              <button class="btn btn-primary w-100" @click="addNewColumn">Add Rule</button>
            </div>
          </div>
          <!-- end::Form -->
        </div>

        <!-- begin::Icon -->
        <div class="d-none d-md-block">
          <div class="h-40px w-24px"></div>
        </div>

        <!-- end::Icon -->
      </div>
      <!-- end::Items -->
    </div>
  </div>

  <!-- begin::Content -->
  <div class="accordion mt-6" id="transAccordion">
    <div class="table-responsive accordion-table">
      <table class="table pb-4">
        <thead hidden>
          <tr transaction-sortable sortable>
            <th sortKey="id">ID</th>
            <th sortKey="code">
              <div class="max-content">Invoice Link</div>
            </th>
            <th sortKey="created_at">Date</th>
            <th sortKey="client_order_identifier">
              <div class="max-content">Customer No.</div>
            </th>
            <th sortKey="amount">Amount</th>
            <th sortKey="status">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loadings.list">
            <TransactionItemLoading v-for="item in 2" :key="item" />
          </template>
          <template v-else>
            <TransactionItem v-for="item in history" :key="item.id" :item="item" />

            <!-- begin::Show More -->
            <tr class="collapsed show-more" v-if="lastPage > currentPage">
              <td colspan="7">
                <PaginationCard
                  :bold="false"
                  text="Show More Transaction"
                  :count="15"
                  :loading="loadings.pagination"
                  @clicked="get_app_invoices(currentPage + 1)"
                />
              </td>
            </tr>
            <!-- end::Show More -->
          </template>
        </tbody>
      </table>
    </div>
  </div>
  <div class="mt-10 d-flex justify-content-center" v-if="!loadings.list && !history.length">
    <inline-svg src="media/images/nothing-to-show.svg"></inline-svg>
  </div>
  <!-- end::Content -->
</template>
