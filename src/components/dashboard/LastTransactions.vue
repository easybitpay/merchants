<script setup>
// Vue
import { onMounted, watch } from 'vue'

// Hook
import useSortTable from '@/hooks/useSortTable'

// ----- START ----- //
const { startCheckSort, selectedSort } = useSortTable()

onMounted(() => {
  startCheckSort('transaction')
})

watch(selectedSort, () => {
  console.log(selectedSort.value)
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
            <tr class="space-icon" transaction-sortable sortable>
              <th sortKey="id" class="min-w-70px">ID</th>
              <th sortKey="code" class="min-w-200px">Code</th>
              <th sortKey="date" class="min-w-200px">Date</th>
              <th sortKey="amount" class="min-w-200px">Amount</th>
              <th class="min-w-200px">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>12</td>
              <td>jY0ODA2ODNhMjQwN</td>
              <td>
                <div class="max-content">30.Nov.2023 - 14:43</div>
              </td>
              <td>
                <div class="max-content">0.1 BTC</div>
              </td>
              <td>
                <div class="max-content text-warning">in Progress ...</div>
              </td>
            </tr>

            <tr>
              <td>12</td>
              <td>jY0ODA2ODNhMjQwN</td>
              <td>
                <div class="max-content">30.Nov.2023 - 14:43</div>
              </td>
              <td>
                <div class="max-content">0.1 BTC</div>
              </td>
              <td>
                <div class="max-content text-success">Paid</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- end::Table -->
    </div>
  </div>
</template>
