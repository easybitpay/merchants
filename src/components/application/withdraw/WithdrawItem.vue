<script setup>
// Store
import { useAppStore } from '@/stores/app'

// Hooks
import useConvertDate from '@/hooks/useConvertDate.js'

// Bootstrap
import { Offcanvas } from 'bootstrap'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Emit
const emit = defineEmits(['updateItem'])

// ----- START ----- //
const store = useAppStore()
const { convertDate } = useConvertDate()

/**
 * Convert Status Code To Color
 */
const convertStatusToColor = (status) => {
  if (status === 'requested' || status === 'pending' || status === 'processing') return 'warning'
  if (status === 'accepted' || status === 'check' || status === 'done') return 'success'
  if (status === 'rejected') return 'danger'
}

/**
 * Show Cancel Withdraw BTN
 */
const showCancelWithdraw = (status) => {
  if (status === 'requested' || status === 'pending' || status === 'check' || status === 'accepted')
    return true

  return false
}

/**
 * Cancel Withdraw
 */
const cancelWithdraw = async () => {
  // Set Variable
  let id = props.item.id

  // Request
  await store.cancelWithdraw(id).then((res) => {
    if (res) {
      emit('updateItem', res)
      appendAlert('Withdraw cancelled', 'success')
    }
  })
}

/**
 * Open Withdraw Verify Offcanvas
 */
const openWithdrawVerify = () => {
  store.setSelectedWithdrawItem(props.item)

  // Open Offcavas
  const bsOffcanvas = new Offcanvas('#withdrawDetail_offcanvas')
  bsOffcanvas.show()
}
</script>

<template>
  <tr class="collapsed">
    <td>{{ item.id }}</td>
    <td>
      <div class="max-content">{{ convertDate(item.created_at, 'DD.MMM.YYYY - hh:mm') }}</div>
    </td>
    <td>{{ item.wallet_address }}</td>
    <td>{{ item.requested_amount }}</td>
    <td>
      <div class="max-content">
        {{ item?.token?.symbol }} <small>{{ item?.token?.network?.name }}</small>
      </div>
    </td>
    <td>{{ +item.platform_fee + +item.transfer_fee }}</td>
    <td :class="`text-${convertStatusToColor(item.status)}`">
      {{ $filters.capitalize(item.status) }}
    </td>
    <td class="text-end ps-0">
      <div class="d-flex justify-content-end h-24px gap-2">
        <inline-svg
          v-if="showCancelWithdraw(item.status)"
          @click="cancelWithdraw"
          src="media/icons/icons/trash.svg"
          class="svg-icon-danger cursor-pointer"
        ></inline-svg>

        <inline-svg
          v-if="item.status === 'requested'"
          @click="openWithdrawVerify"
          src="media/icons/icons/chevron-down.svg"
          class="collapse-icon cursor-pointer"
        ></inline-svg>
      </div>
    </td>
  </tr>

  <tr class="collapsed-row">
    <td colspan="7" class="px-0 pt-0 bg-transparent"></td>
  </tr>
</template>
