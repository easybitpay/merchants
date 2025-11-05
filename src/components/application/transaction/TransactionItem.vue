<script setup>
// Hooks
import useConvertDate from '@/composables/useConvertDate.js'
import useTrackTransactions from '@/composables/useTrackTransactions.js'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// ----- START ----- //
const { convertDate } = useConvertDate()
const { trackTransaction } = useTrackTransactions()

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
  if (status == 0) return 'In Progress'
  if (status == 1) return 'Expired'
  if (status == 2) return 'Canceled'
  if (status == 10) return 'Paid'
}

/**
 * Calculate Filled Percent For Every Transaction Item
 */
const itemFilledPercent = (mustPay, paid) => {
  return Number((+paid * 100) / +mustPay)
    .toFixed(2)
    .replace(/\.?0+$/, '')
}
</script>

<template>
  <tr
    class="collapsed"
    data-bs-toggle="collapse"
    :data-bs-target="`#tran-${item.id}`"
    aria-expanded="true"
    :aria-controls="`tran-${item.id}`"
  >
    <td>{{ item.id }}</td>
    <td>{{ item.code }}</td>
    <td>
      <div class="max-content">{{ convertDate(item.created_at, 'DD.MMM.YYYY - hh:mm') }}</div>
    </td>
    <td>{{ item?.client_order_identifier || '-' }}</td>
    <td>
      <div class="max-content">{{ item.amount }} {{ item.base_token.symbol }}</div>
    </td>
    <td>
      <div :class="`max-content text-${convertStatusToColor(item.status)}`">
        {{ convertStatusToText(item.status) }}
      </div>
    </td>
    <td class="text-end">
      <div class="w-24px h-24px">
        <inline-svg
          v-if="item.transactions.length"
          src="media/icons/icons/chevron-down.svg"
          class="collapse-icon"
        ></inline-svg>
      </div>
    </td>
  </tr>

  <tr class="collapsed-row">
    <td colspan="7" class="px-0 pt-0 bg-transparent">
      <div
        v-if="item.transactions.length"
        :id="`tran-${item.id}`"
        class="accordion-collapse collapse"
        data-bs-parent="#transAccordion"
      >
        <div class="accordion-body">
          <!-- begin::Transactions -->
          <div class="d-flex flex-column gap-4">
            <!-- begin::Item -->
            <div
              class="transaction-item"
              v-for="(tran, mainIndex) in item.transactions"
              :key="tran.id"
            >
              <div class="infos mb-2">
                <!-- begin::Item -->
                <div class="item">
                  <p class="value">{{ tran?.invoiceToken?.tokenInfo?.symbol }}</p>
                  <p class="title">Token</p>
                </div>
                <!-- end::Item -->
                <!-- begin::Item -->
                <div class="item">
                  <p class="value ellipsis">{{ tran?.invoiceToken?.amount }}</p>
                  <p class="title">Must Pay</p>
                </div>
                <!-- end::Item -->
                <!-- begin::Item -->
                <div class="item">
                  <p class="value">{{ tran.amount }}</p>
                  <p class="title">Paid</p>
                </div>
                <!-- end::Item -->
                <!-- begin::Item -->
                <div
                  class="item cursor-pointer"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-html="true"
                  data-bs-offset="0,20"
                  :data-bs-title="`
                    <div class='d-flex flex-column justify-content-center'>
                        <div class='d-flex amount-columns active-item'>
                            ${item.transactions.map(
                              (listTran, childIndex) =>
                                `<div class='item h-168px ${
                                  mainIndex === childIndex ? 'active' : ''
                                } bg-${convertStatusToColor(
                                  item.status
                                )}' style='width: ${itemFilledPercent(
                                  listTran?.invoiceToken?.amount,
                                  listTran.amount
                                )}%'>
                                <span class='d-none d-sm-block'>${
                                  itemFilledPercent(
                                    listTran?.invoiceToken?.amount,
                                    listTran.amount
                                  ) > 40
                                    ? itemFilledPercent(
                                        listTran?.invoiceToken?.amount,
                                        listTran.amount
                                      )
                                    : ''
                                }%</span>
                            </div>`
                            )}
                        </div>

                        <div class='mt-10 d-flex align-items-center justify-content-center gap-2'>
                            <img src='https://panel.easybitpay.com/icons/32/color/usdt.png' height='24' width='24' alt='usdt' />

                            <h2 class='  mb-0 lh-24px text-gray-800'>$1.000</h2>
                        </div>
                    </div>
                    `"
                >
                  <p :class="`value text-${convertStatusToColor(item.status)}`">
                    {{ itemFilledPercent(tran?.invoiceToken?.amount, tran.amount) }}%
                  </p>
                  <p class="title">Progress</p>
                </div>
                <!-- end::Item -->

                <!-- begin::Item -->
                <div
                  class="item wallet"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-html="true"
                  data-bs-offset="0,20"
                  :data-bs-title="`
                    <div>
                        <div class='w-168px h-168px'>
                            <img src='https://api.qrserver.com/v1/create-qr-code/?size=165x165&data=${tran?.invoiceToken?.wallet_address}'/>
                        </div>

                        <div>
                            <a class='btn btn-primary w-100 mt-6 p-0'>
                                Copy wallet Add.
                            </a>
                        </div>
                    </div>
                  `"
                >
                  <p class="value ellipsis" style="--ellipsis-width: 100%">
                    {{ tran?.invoiceToken?.wallet_address }}
                  </p>
                  <p class="title">Wallet</p>
                </div>
                <!-- end::Item -->
              </div>

              <div class="track-action">
                <a
                  :href="
                    trackTransaction(
                      tran.hash,
                      tran?.invoiceToken?.tokenInfo?.network?.explorer_address,
                      'hash'
                    )
                  "
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-sm btn-primary w-104px h-24px ls-base"
                >
                  Track
                </a>
              </div>
            </div>
            <!-- end::Item -->
          </div>
          <!-- end::Transactions -->

          <!-- begin::Action -->
          <div class="mt-4 mt-xl-8 d-flex justify-content-start justify-content-xl-end">
            <button class="btn btn-primary w-120px">Share</button>
          </div>
          <!-- end::Action -->
        </div>
      </div>
    </td>
  </tr>
</template>
