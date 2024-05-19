<script setup>
// Vue
import { onMounted, watch, computed, ref } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

// Router
import { useRoute, useRouter } from 'vue-router'

// Bootstrap
import { Tooltip } from 'bootstrap'

// Hook
import useSortTable from '@/hooks/useSortTable'

// Component
import ApplicationCard from '../../../components/application/ApplicationCard.vue'
import TransactionItem from '../../../components/application/transaction/TransactionItem.vue'
import TransactionItemLoading from '../../../components/loadings/TransactionItemLoading.vue'
import PaginationCard from '../../../components/globals/PaginationCard.vue'
import SelectDropdown from '../../../components/globals/SelectDropdown.vue'

const searchConditions = [
  {
    key: '=',
    title: 'Equal'
  },
  {
    key: '!=',
    title: 'Not equal'
  },
  {
    key: 'like',
    title: 'Like'
  },
  {
    key: 'not like',
    title: 'Not like'
  },
  {
    key: '>',
    title: 'More than'
  },
  {
    key: '<',
    title: 'Less than'
  }
]

const searchColumnKeys = [
  {
    key: 'code',
    title: 'Invoice Code'
  },
  {
    key: 'status',
    title: 'Status'
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
    key: 'paid',
    title: 'Paid Amount'
  },
  {
    key: 'base_token_id',
    title: 'Base Token'
  },
  {
    key: 'invoice_items',
    title: 'Invoice Items'
  },
  {
    key: 'customer_info',
    title: 'Customer Info'
  },
  {
    key: 'client_order_identifier',
    title: 'Customer No.'
  },
  {
    key: 'description',
    title: 'Description'
  },
  {
    key: 'transactions.hash',
    title: 'Hash'
  },
  {
    key: 'transactions.from_wallet',
    title: 'From Wallet'
  },
  {
    key: 'transactions.to_wallet',
    title: 'To Wallet'
  },
  {
    key: 'created_at',
    title: 'Created At (Date)'
  },
  {
    key: 'updated_at',
    title: 'Updated At Date)'
  }
]

// ----- START ----- //

// Generals
const store = useAppStore()
const route = useRoute()
const router = useRouter()
const { startCheckSort, selectedSort } = useSortTable()

// Refs
const loadings = ref({
  list: false,
  pagination: false
})
const history = ref([])
const lastPage = ref(1)
const currentPage = ref(1)

const tokens = ref([])

const showSearch = ref(false)
const search = ref('')
const filterSearchTimeOutRef = ref(null)
const searchTimeOutRef = ref(null)
const searchOnColumns = ref([])
const searchColumns = ref([
  {
    token: {},
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

// Computeds
const selectedApp = computed(() => store.selectedApp)

// Functions

/**
 * Toggle Search Condition
 */
const toggleSearchCondition = (condition, index) => {
  searchColumns.value[index].condition = condition
  createSearchColumnArray()
}

/**
 * Toggle Search Column
 */
const toggleSearchColumn = (column, index) => {
  searchColumns.value[index].column = column
  createSearchColumnArray()
}

/**
 * Toggle Base Coin
 */
const toggleBaseToken = (token, index) => {
  searchColumns.value[index].token = token
  searchColumns.value[index].value = token.id
  createSearchColumnArray()
}

/**
 * Add Item From Filter Row
 */
const addNewColumn = () => {
  searchColumns.value.push({
    token: {},
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

/**
 * Remove Item From Filter Row
 */
const removeItem = (index) => {
  searchColumns.value.splice(index, 1)

  createSearchColumnArray()

  if (!searchColumns.value.length) {
    searchColumns.value.push({
      token: {},
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

/**
 * Call Function After User Stop Typing In Filter Value Input
 */
const filterSearchTimeOut = () => {
  if (filterSearchTimeOutRef.value) {
    clearTimeout(filterSearchTimeOutRef.value)
    filterSearchTimeOutRef.value = null
  }
  filterSearchTimeOutRef.value = setTimeout(() => {
    createSearchColumnArray()
  }, 800)
}

/**
 * Change Search Input
 */
const changeShowSearchStatus = () => {
  showSearch.value = !showSearch.value
  search.value = ''
  setSearchQuery()
}

/**
 * Call Function After User Stop Typing In Search Input
 */
const searchTimeOut = () => {
  if (searchTimeOutRef.value) {
    clearTimeout(searchTimeOutRef.value)
    searchTimeOutRef.value = null
  }
  searchTimeOutRef.value = setTimeout(() => {
    get_app_invoices(1)
    setSearchQuery()
  }, 800)
}

const checkRouteSearchQuery = () => {
  const searchQuery = route.query.search

  if (searchQuery) {
    showSearch.value = true
    search.value = searchQuery
  }
}

const setSearchQuery = () => {
  router.push({
    name: 'application-transaction',
    params: { id: selectedApp.value.id },
    query: { search: search.value }
  })
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
 * Get App Tokens
 */
const getAppTokens = async () => {
  // Request
  await store.getAppTokens(selectedApp.value.id).then((res) => {
    if (res) {
      tokens.value = res
    }
  })
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
  const id = selectedApp.value.id
  let params = new URLSearchParams()
  params.set('page', `${page}`)
  params.set('pageSize', '15')
  params.set('column', selectedSort.value.column || 'updated_at')
  params.set('direction', selectedSort.value.direction || 'desc')
  params.set('searchOnColumns', JSON.stringify(searchOnColumns.value))
  params.set('search', search.value)

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
  getAppTokens()

  checkRouteSearchQuery()

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

watch(search, async (newVal, oldVal) => {
  if (!newVal && oldVal) {
    get_app_invoices(1)
  }
})
</script>
<template>
  <ApplicationCard action="action" :app="selectedApp" />

  <!-- begin::Search Collapse -->
  <div class="collapse" id="filterCollapse">
    <div class="card mt-4" style="border-radius: 20px">
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
                  <input
                    v-if="item.column.key != 'base_token_id'"
                    type="text"
                    class="form-control w-100"
                    placeholder="Value"
                    v-model="item.value"
                    @input="filterSearchTimeOut"
                  />

                  <SelectDropdown
                    v-else
                    placeholder="Base Token"
                    show="name"
                    showImage
                    showCoinNetwork
                    :items="tokens"
                    :selected="item.token"
                    @change="(token) => toggleBaseToken(token, index)"
                    :disabled="!tokens.length"
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
  </div>
  <!-- end::Search Collapse -->

  <div class="accordion mt-10 position-relative" id="transAccordion">
    <!-- begin::Search Input -->
    <div class="table-search-box z-1" v-if="showSearch">
      <input
        type="text"
        class="form-control placeholder-gray-600"
        placeholder="What, You are loking for?"
        v-model="search"
        @input="searchTimeOut"
      />
    </div>
    <!-- end::Search Input -->

    <!-- begin::Floating Icons -->
    <div class="floating-icons">
      <!-- begin::Search & Close Icon -->
      <inline-svg
        @click="changeShowSearchStatus()"
        :src="`media/icons/icons/${showSearch ? 'close' : 'search'}.svg`"
        class="cursor-pointer svg-icon-gray-700"
        width="24"
        height="24"
      ></inline-svg>
      <!-- end::Search & Close Icon -->

      <!-- begin::Expand -->
      <inline-svg
        src="media/icons/icons/Scale.svg"
        class="cursor-pointer"
        data-bs-toggle="collapse"
        href="#filterCollapse"
        role="button"
        aria-expanded="false"
        aria-controls="filterCollapse"
      ></inline-svg>
      <!-- end::Expand -->
    </div>
    <!-- end::Floating Icons -->

    <div class="table-responsive accordion-table position-relative">
      <!-- begin::Table -->
      <table class="table pb-4">
        <thead>
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
      <!-- end::Table -->
    </div>
  </div>

  <div class="mt-10 d-flex justify-content-center" v-if="!loadings.list && !history.length">
    <inline-svg src="media/images/nothing-to-show.svg"></inline-svg>
  </div>
</template>
