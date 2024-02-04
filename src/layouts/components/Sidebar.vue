<script setup>
// Vue
import { computed, ref, watch, onMounted } from 'vue'

// Router
import { useRouter, useRoute } from 'vue-router'

// Store
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

// Hook
import useIconImage from '@/hooks/useIconImage'

// Components
import SandboxAlert from '../../components/globals/SandboxAlert.vue'
import EmailVerifyAlert from '../../components/globals/EmailVerifyAlert.vue'

// Props
const props = defineProps({
  collapsed: {
    type: Boolean,
    required: true
  }
})

// Emit
const emit = defineEmits(['changeSidebarStatus'])

// ----- START ----- //

// Generals
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()
const { storageImage } = useIconImage()

const sandBoxStatus = computed(() => appStore.sandBoxStatus)
const sandbox = ref(sandBoxStatus.value)
const emailVerifyAlert = computed(() => authStore.emailVerifyAlert)

// Refs
const search = ref('')

// Computeds
const appList = computed(() => appStore.appList)
const prevAuthAction = computed(() => localStorage.getItem('prevAuthAction') || 'Sign out')
const currentUser = computed(() => authStore.currentUser)

// Functions

const checkActive = (checkText, extraCheck = false) => {
  const currentParentUrl = route.path.split('/').filter((x) => x !== '')

  if (extraCheck) {
    const mustCheckItem = currentParentUrl[currentParentUrl.length - 1]

    return currentParentUrl[0].includes(checkText) && extraCheck == mustCheckItem
  } else {
    return currentParentUrl[0].includes(checkText)
  }
}

/**
 * Change Sibedar
 */
const changeSidebar = () => {
  emit('changeSidebarStatus')
}

/**
 * Check Inner Width For Change Sidebar
 */
const checkInnerWidth = () => {
  const innerWidth = window.innerWidth

  if (innerWidth <= 992) {
    changeSidebar()
  }
}

checkInnerWidth()

const authActionClick = () => {
  if (prevAuthAction.value === 'Lock') {
    lockScreen()
  } else {
    signOut()
  }
}

/**
 * Show Lock Screen
 */
const showLockScreen = () => {
  authStore.changeLockScreenStatus(true)
}

/**
 * Lock Screen Function
 * check for show lock screen or go to privacy page to set
 */
const lockScreen = () => {
  const lockScreenStatus = localStorage.getItem('lockScreenInfo')

  if (lockScreenStatus) {
    localStorage.setItem('prevAuthAction', 'Lock')
    showLockScreen()
  } else {
    router.push({ name: 'settings-privacy' })
  }
}

/**
 * Sign Out User
 */
const signOut = () => {
  localStorage.setItem('prevAuthAction', 'Sign out')
  authStore.logout()
  window.location.reload()
}

/**
 * Set Email Verify Status
 */
const setEmailVerifyStatus = () => {
  let emailVerifyAt = currentUser.value?.merchant?.email_verified_at

  if (!emailVerifyAt) {
    authStore.setShowEmailVerifyAlert(true)
  }
}

onMounted(() => {
  setEmailVerifyStatus()
})

watch(sandbox, () => {
  appStore.setSandBoxStatus(sandbox.value)
})
</script>

<template>
  <div class="sidebar-click-box" @click="changeSidebar()"></div>
  <aside id="sidebar" :class="[{ collapsed: collapsed }]">
    <!-- begin::Logo & Search -->
    <div class="two-side-space w-100">
      <!-- begin::Logo -->
      <router-link :to="{ name: 'dashboard' }">
        <inline-svg src="media/images/logo/sidebar-main-logo.svg" class="logo"></inline-svg>
        <inline-svg
          src="media/images/logo/sidebar-collapse-logo.svg"
          class="logo-collapse"
        ></inline-svg>
      </router-link>
      <!-- end::Logo -->

      <!-- begin::Search -->
      <div class="search-box">
        <input
          type="text"
          class="form-control form-control-sm"
          placeholder="Search anything"
          v-model="search"
        />

        <!-- begin::Icon -->
        <inline-svg src="media/icons/icons/search.svg" class="position-absolute"></inline-svg>
        <!-- end::Icon -->
      </div>
      <!-- end::Search -->
    </div>
    <!-- end::Logo & Search -->

    <!-- begin::Links -->
    <div class="links w-100">
      <div class="links custom-scroll">
        <!-- begin::Link Box -->
        <div class="link-box mb-12">
          <!-- begin::Collapse Link -->
          <div class="collapse-box">
            <div class="collapse-link">
              <router-link
                :to="{ name: 'applications' }"
                :class="[{ 'link pe-0': true }, { active: checkActive('application') }]"
              >
                <!-- begin::icon -->
                <div>
                  <inline-svg src="media/icons/icons/settings.svg" class="icon"></inline-svg>
                </div>
                <!-- end::icon -->

                <span>Applications</span>
              </router-link>

              <!-- begin::icon -->
              <inline-svg
                v-if="appList.length"
                src="media/icons/icons/chevron-down.svg"
                data-bs-toggle="collapse"
                data-bs-target="#appListCollapse"
                aria-expanded="false"
                aria-controls="appListCollapse"
              ></inline-svg>
              <!-- end::icon -->
            </div>

            <div class="collapse collapse-box" id="appListCollapse">
              <div class="box">
                <router-link
                  :to="{ name: 'application-overview', params: { id: app.id } }"
                  :class="[{ item: true }, { active: checkActive('application', app.id) }]"
                  v-for="app in appList"
                  :key="app.id"
                >
                  <div>
                    <div class="w-8px h-8px rounded-circle bg-success"></div>
                  </div>

                  <span>{{ app.name }}</span>
                </router-link>
              </div>
            </div>
          </div>

          <!-- end::Collapse Link -->

          <!-- begin::Link -->
          <router-link
            :to="{ name: 'exchange' }"
            :class="[{ link: true }, { active: checkActive('exchange') }]"
          >
            <!-- begin::icon -->
            <div>
              <inline-svg src="media/icons/icons/settings-alt.svg" class="icon"></inline-svg>
            </div>
            <!-- end::icon -->

            <span>Exchange</span>
          </router-link>
          <!-- end::Link -->

          <!-- begin::Link -->
          <!-- <router-link
            :to="{ name: 'notification' }"
            :class="[{ link: true }, { active: checkActive('notification') }]"
          > -->
            <!-- begin::icon -->
            <!-- <div>
              <inline-svg src="media/icons/icons/notification.svg" class="icon"></inline-svg>
            </div> -->
            <!-- end::icon -->

            <!-- <span>Notif Center</span> -->
          <!-- </router-link> -->
          <!-- end::Link -->

          <!-- begin::Link -->
          <router-link
            :to="{ name: 'plugin' }"
            :class="[{ link: true }, { active: checkActive('plugin') }]"
          >
            <!-- begin::icon -->
            <div>
              <inline-svg src="media/icons/icons/commandline.svg" class="icon"></inline-svg>
            </div>
            <!-- end::icon -->

            <span>Plugin</span>
          </router-link>
          <!-- end::Link -->
        </div>
        <!-- end::Link Box -->

        <!-- begin::Link Box -->
        <div class="link-box">
          <!-- begin::Link -->
          <router-link
            :to="{ name: 'settings' }"
            :class="[{ link: true }, { active: checkActive('settings') }]"
          >
            <!-- begin::icon -->
            <div>
              <inline-svg src="media/icons/icons/settings.svg" class="icon"></inline-svg>
            </div>
            <!-- end::icon -->

            <span>Setting</span>
          </router-link>
          <!-- end::Link -->

          <!-- begin::Link -->
          <a
            href="https://docs.easybitpay.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="link"
          >
            <!-- begin::icon -->
            <div>
              <inline-svg src="media/icons/icons/book.svg" class="icon"></inline-svg>
            </div>
            <!-- end::icon -->

            <span>Documentation</span>
          </a>
          <!-- end::Link -->

          <!-- begin::Link -->
          <router-link
            :to="{ name: 'help' }"
            :class="[{ link: true }, { active: checkActive('help') }]"
          >
            <!-- begin::icon -->
            <div>
              <inline-svg src="media/icons/icons/compass.svg" class="icon"></inline-svg>
            </div>
            <!-- end::icon -->

            <span>Get Help</span>
          </router-link>
          <!-- end::Link -->

          <!-- begin::SandBox -->
          <div class="link form-check form-switch">
            <!-- begin::icon -->
            <div>
              <inline-svg src="media/icons/icons/archive-full.svg" class="icon"></inline-svg>
            </div>
            <!-- end::icon -->

            <span class="d-flex align-items-center justify-content-between w-100">
              <div>
                <label class="form-check-label" for="sandbox"> SandBox </label>
              </div>

              <div>
                <input
                  class="form-check-input m-0"
                  type="checkbox"
                  role="switch"
                  id="sandbox"
                  v-model="sandbox"
                />
              </div>
            </span>
          </div>
          <!-- end::SandBox -->
        </div>
        <!-- end::Link Box -->
      </div>
      <!-- begin::Collapse -->

      <!-- begin::Seprate Line -->
      <div class="seprator-line">
        <span></span>
      </div>
      <!-- end::Seprate Line -->

      <div class="link-box">
        <!-- begin::Lock -->
        <!-- begin::Collapse Link -->
        <div class="collapse-box">
          <div class="collapse-link">
            <a class="link pe-0" @click="authActionClick">
              <!-- begin::icon -->
              <div>
                <inline-svg src="media/icons/icons/lock-unlocked.svg" class="icon"></inline-svg>
              </div>
              <!-- end::icon -->

              <span>{{ prevAuthAction }}</span>
            </a>

            <!-- begin::icon -->
            <div>
              <inline-svg
                src="media/icons/icons/chevron-down.svg"
                data-bs-toggle="collapse"
                data-bs-target="#authActionsCollapse"
                aria-expanded="false"
                aria-controls="authActionsCollapse"
              ></inline-svg>
            </div>
            <!-- end::icon -->
          </div>

          <div class="collapse collapse-box" id="authActionsCollapse">
            <div class="box">
              <a class="item cursor-pointer" @click="lockScreen">
                <div>
                  <div class="w-8px h-8px rounded-circle bg-trasnaprent"></div>
                </div>

                <span class="fs-6">Lock</span>
              </a>

              <a class="item cursor-pointer" @click="signOut">
                <div>
                  <div class="w-8px h-8px rounded-circle bg-trasnaprent"></div>
                </div>

                <span class="fs-6">Sign out</span>
              </a>
            </div>
          </div>
        </div>
        <!-- end::Collapse Link -->
        <!-- end::Lock -->

        <div class="link collapse-btn" @click="changeSidebar()">
          <!-- begin::icon -->
          <div>
            <inline-svg src="media/icons/icons/chevron-left.svg" class="icon"></inline-svg>
          </div>
          <!-- end::icon -->

          <span>Collapse</span>
        </div>
      </div>
    </div>
    <!-- end::Links -->

    <!-- begin::User -->
    <div class="user-box w-100">
      <RouterLink :to="{ name: 'settings-basic' }" class="user cursor-pointer">
        <div>
          <!-- begin::Image Box -->
          <div class="w-40px h-40px position-relative">
            <!-- begin::Image -->
            <img
              :src="
                currentUser?.merchant?.avatar
                  ? storageImage(currentUser.merchant.avatar)
                  : '/media/images/banner/auth-bg.jpg'
              "
              :alt="currentUser?.merchant?.first_name"
              class="w-100 h-100 rounded-circle object-cover"
            />
            <!-- end::Image -->

            <!-- begin::Bullet -->
            <div class="w-8px h-8px rounded-circle bg-primary position-absolute bullet"></div>
            <!-- end::Bullet -->
          </div>
          <!-- end::Image Box -->
        </div>

        <div>
          <h6 class="neue-machina fw-light mb-0 lh-1 text-gray-800 name">
            {{
              $filters.shortenText(
                `${currentUser?.merchant?.first_name} ${currentUser?.merchant?.last_name}`
              )
            }}
          </h6>
          <small class="mb-0 lh-1 text-gray-600 balance">
            {{ currentUser?.total_balance_usd?.toFixed(2) }} $
          </small>
        </div>
      </RouterLink>
    </div>
    <!-- end::User -->
  </aside>

  <SandboxAlert v-if="sandBoxStatus" />
  <EmailVerifyAlert v-if="emailVerifyAlert" />
</template>
