<script setup>
// Vue
import { onMounted, watch } from 'vue'

// Bootstrap
import { Tooltip } from 'bootstrap'

// Hook
import useSortTable from '@/hooks/useSortTable'

// Component
import ApplicationCard from '../../../components/application/ApplicationCard.vue'

// ----- START ----- //
const { startCheckSort, selectedSort } = useSortTable()

onMounted(() => {
  startCheckSort('transaction')
  new Tooltip(document.body, {
    selector: "[data-bs-html='true']"
  })
})

watch(selectedSort, () => {
  console.log(selectedSort.value)
})
</script>
<template>
  <ApplicationCard action="status"/>

  <div class="accordion mt-10" id="faqAccordion">
    <div class="table-responsive accordion-table">
      <table class="table pb-4">
        <thead>
          <tr transaction-sortable sortable>
            <th sortKey="id">ID</th>
            <th sortKey="link">Invoice Link</th>
            <th sortKey="date">Date</th>
            <th sortKey="customer">Customer No.</th>
            <th sortKey="amount">Amount</th>
            <th sortKey="status">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#faqOne"
            aria-expanded="true"
            aria-controls="faqOne"
          >
            <td>1</td>
            <td>jY0ODA2ODNhMjQwN</td>
            <td>
              <div class="max-content">30.Nov.2023 - 14:43</div>
            </td>
            <td>34</td>
            <td>
              <div class="max-content">1000 BTC</div>
            </td>
            <td>Paid</td>
            <td class="text-end">
              <inline-svg
                src="media/icons/icons/chevron-down.svg"
                class="collapse-icon"
              ></inline-svg>
            </td>
          </tr>

          <tr class="collapsed-row">
            <td colspan="7" class="px-0 pt-0 bg-transparent">
              <div id="faqOne" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                  <!-- begin::Transactions -->
                  <div class="d-flex flex-column gap-4">
                    <!-- begin::Item -->
                    <div class="transaction-item">
                      <div class="infos mb-2">
                        <!-- begin::Item -->
                        <div class="item">
                          <p class="value">USDT</p>
                          <p class="title">Token</p>
                        </div>
                        <!-- end::Item -->
                        <!-- begin::Item -->
                        <div class="item">
                          <p class="value">10</p>
                          <p class="title">Must Pay</p>
                        </div>
                        <!-- end::Item -->
                        <!-- begin::Item -->
                        <div class="item">
                          <p class="value">0</p>
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
                              <div class='d-flex amount-columns'>
                                <div class='item h-168px bg-success'>
                                  <span class='d-none d-sm-block'>46%</span>
                                </div>
                                <div class='item h-168px bg-warning'>
                                  <span class='d-none d-sm-block'>54%</span>
                                </div>
                              </div>

                              <div class='mt-10 d-flex align-items-center justify-content-center gap-2'>
                                <img src='https://panel.easybitpay.com/icons/32/color/usdt.png' height='24' width='24' alt='usdt' />

                                <h2 class='neue-machina mb-0 lh-24px text-gray-800'>$1.000</h2>
                              </div>
                            </div>
                          `"
                        >
                          <p class="value text-warning">46%</p>
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
                                <img src='media/qr-code.png'/>
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
                            DDDZPxJpNHgKj9bszZRu8DAGBU5G6Mi9GQ
                          </p>
                          <p class="title">Wallet</p>
                        </div>
                        <!-- end::Item -->
                      </div>

                      <div class="track-action">
                        <button class="btn btn-sm btn-primary w-104px h-24px ls-base">Track</button>
                      </div>
                    </div>
                    <!-- end::Item -->

                    <!-- begin::Item -->
                    <div class="transaction-item">
                      <div class="infos mb-2">
                        <!-- begin::Item -->
                        <div class="item">
                          <p class="value">USDT</p>
                          <p class="title">Token</p>
                        </div>
                        <!-- end::Item -->
                        <!-- begin::Item -->
                        <div class="item">
                          <p class="value">10</p>
                          <p class="title">Must Pay</p>
                        </div>
                        <!-- end::Item -->
                        <!-- begin::Item -->
                        <div class="item">
                          <p class="value">0</p>
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
                              <div class='d-flex amount-columns'>
                                <div class='item h-168px bg-success'>
                                  <span class='d-none d-sm-block'>46%</span>
                                </div>
                                <div class='item h-168px bg-warning'>
                                  <span class='d-none d-sm-block'>54%</span>
                                </div>
                              </div>

                              <div class='mt-10 d-flex align-items-center justify-content-center gap-2'>
                                <img src='https://panel.easybitpay.com/icons/32/color/usdt.png' height='24' width='24' alt='usdt' />

                                <h2 class='neue-machina mb-0 lh-24px text-gray-800'>$1.000</h2>
                              </div>
                            </div>
                          `"
                        >
                          <p class="value text-warning">46%</p>
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
                                <img src='media/qr-code.png'/>
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
                            DDDZPxJpNHgKj9bszZRu8DAGBU5G6Mi9GQ
                          </p>
                          <p class="title">Wallet</p>
                        </div>
                        <!-- end::Item -->
                      </div>

                      <div class="track-action">
                        <button class="btn btn-sm btn-primary w-104px h-24px ls-base">Track</button>
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

          <tr
            class="collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#faqTwo"
            aria-expanded="true"
            aria-controls="faqTwo"
          >
            <td>1</td>
            <td>jY0ODA2ODNhMjQwN</td>
            <td>
              <div class="max-content">30.Nov.2023 - 14:43</div>
            </td>
            <td>34</td>
            <td>0.1 BTC</td>
            <td>Paid</td>
            <td class="text-end">
              <inline-svg
                src="media/icons/icons/chevron-down.svg"
                class="collapse-icon"
              ></inline-svg>
            </td>
          </tr>

          <tr class="collapsed-row">
            <td colspan="7" class="px-0 pt-0 bg-transparent">
              <div id="faqTwo" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div class="accordion-body">
                  <!-- begin::Transactions -->
                  <div class="d-flex flex-column gap-4">
                    <!-- begin::Item -->
                    <div class="transaction-item">
                      <div class="infos mb-2">
                        <!-- begin::Item -->
                        <div class="item">
                          <p class="value">USDT</p>
                          <p class="title">Token</p>
                        </div>
                        <!-- end::Item -->
                        <!-- begin::Item -->
                        <div class="item">
                          <p class="value">10</p>
                          <p class="title">Must Pay</p>
                        </div>
                        <!-- end::Item -->
                        <!-- begin::Item -->
                        <div class="item">
                          <p class="value">0</p>
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
                              <div class='d-flex amount-columns'>
                                <div class='item h-168px bg-success'>
                                  <span class='d-none d-sm-block'>46%</span>
                                </div>
                                <div class='item h-168px bg-warning'>
                                  <span class='d-none d-sm-block'>54%</span>
                                </div>
                              </div>

                              <div class='mt-10 d-flex align-items-center justify-content-center gap-2'>
                                <img src='https://panel.easybitpay.com/icons/32/color/usdt.png' height='24' width='24' alt='usdt' />

                                <h2 class='neue-machina mb-0 lh-24px text-gray-800'>$1.000</h2>
                              </div>
                            </div>
                          `"
                        >
                          <p class="value text-warning">46%</p>
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
                                <img src='media/qr-code.png'/>
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
                            DDDZPxJpNHgKj9bszZRu8DAGBU5G6Mi9GQ
                          </p>
                          <p class="title">Wallet</p>
                        </div>
                        <!-- end::Item -->
                      </div>

                      <div class="track-action">
                        <button class="btn btn-sm btn-primary w-104px h-24px ls-base">Track</button>
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

          <!-- begin::Show More -->
          <tr class="collapsed show-more">
            <td colspan="7">
              <span class="first"></span>
              <span class="last"></span>
              <div class="d-flex align-items-center justify-content-between">
                <!-- begin::Title -->
                <div class="d-flex align-items-center gap-4">
                  <inline-svg src="media/icons/icons/clock.svg" height="24"></inline-svg>
                  <p class="mb-0 fs-7">Show All Transaction</p>
                </div>
                <!-- end::Title -->

                <!-- begin::Count -->

                <small class="lh-24px rounded bg-cyan-500 text-white px-2">+40</small>

                <!-- end::Count -->
              </div>
            </td>
          </tr>
          <!-- end::Show More -->
        </tbody>
      </table>
    </div>
  </div>
</template>
