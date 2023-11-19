<script setup>
import { Collapse } from 'bootstrap'

// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

// ----- START ----- //
const authStore = useAuthStore()
const appStore = useAppStore()
const emit = defineEmits(['changeSidebarStatus'])

const props = defineProps({
  collapsed: {
    type: Boolean,
    required: true
  }
})

const search = ref('')

const appList = computed(() => appStore.appList)

const changeSidebar = () => {
  emit('changeSidebarStatus')
}

const checkInnerWidth = () => {
  const innerWidth = window.innerWidth

  if (innerWidth <= 992) {
    changeSidebar()
  }
}

checkInnerWidth()

const showLockScreen = () => {
  authStore.changeLockScreenStatus(true)
}
</script>

<template>
  <div class="sidebar-click-box" @click="changeSidebar()"></div>
  <aside id="sidebar" :class="[{ collapsed: collapsed }]">
    <!-- begin::Logo & Search -->
    <div class="two-side-space w-100">
      <!-- begin::Logo -->
      <RouterLink :to="{ name: 'dashboard' }">
        <inline-svg src="media/images/logo/sidebar-main-logo.svg" class="logo"></inline-svg>
        <inline-svg
          src="media/images/logo/sidebar-collapse-logo.svg"
          class="logo-collapse"
        ></inline-svg>
      </RouterLink>
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
    <div class="links w-100 custom-scroll">
      <!-- begin::Link Box -->
      <div class="link-box mb-12">
        <!-- begin::Collapse Link -->
        <div class="collapse-box">
          <div class="collapse-link">
            <RouterLink :to="{ name: 'applications' }" class="link pe-0">
              <!-- begin::icon -->
              <div>
                <inline-svg src="media/icons/icons/settings.svg" class="icon"></inline-svg>
              </div>
              <!-- end::icon -->

              <span>Applications</span>
            </RouterLink>

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
              <RouterLink
                :to="{ name: 'application-overview', params: { id: app.id } }"
                class="item"
                v-for="app in appList"
                :key="app.id"
              >
                <div>
                  <div class="w-8px h-8px rounded-circle bg-success"></div>
                </div>

                <span>{{ app.name }}</span>
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- end::Collapse Link -->

        <!-- begin::Link -->
        <RouterLink :to="{ name: 'exchange' }" class="link">
          <!-- begin::icon -->
          <div>
            <inline-svg src="media/icons/icons/settings-alt.svg" class="icon"></inline-svg>
          </div>
          <!-- end::icon -->

          <span>Exchange</span>
        </RouterLink>
        <!-- end::Link -->

        <!-- begin::Link -->
        <RouterLink :to="{ name: 'notification' }" class="link">
          <!-- begin::icon -->
          <div>
            <inline-svg src="media/icons/icons/notification.svg" class="icon"></inline-svg>
          </div>
          <!-- end::icon -->

          <span>Notif Center</span>
        </RouterLink>
        <!-- end::Link -->

        <!-- begin::Link -->
        <RouterLink :to="{ name: 'plugin' }" class="link">
          <!-- begin::icon -->
          <div>
            <inline-svg src="media/icons/icons/commandline.svg" class="icon"></inline-svg>
          </div>
          <!-- end::icon -->

          <span>Plugin</span>
        </RouterLink>
        <!-- end::Link -->
      </div>
      <!-- end::Link Box -->

      <!-- begin::Link Box -->
      <div class="link-box">
        <!-- begin::Link -->
        <RouterLink :to="{ name: 'settings' }" class="link">
          <!-- begin::icon -->
          <div>
            <inline-svg src="media/icons/icons/settings.svg" class="icon"></inline-svg>
          </div>
          <!-- end::icon -->

          <span>Setting</span>
        </RouterLink>
        <!-- end::Link -->

        <!-- begin::Link -->
        <RouterLink :to="{ name: 'login' }" class="link">
          <!-- begin::icon -->
          <div>
            <inline-svg src="media/icons/icons/book.svg" class="icon"></inline-svg>
          </div>
          <!-- end::icon -->

          <span>Documentation</span>
        </RouterLink>
        <!-- end::Link -->

        <!-- begin::Link -->
        <RouterLink :to="{ name: 'help' }" class="link">
          <!-- begin::icon -->
          <div>
            <inline-svg src="media/icons/icons/compass.svg" class="icon"></inline-svg>
          </div>
          <!-- end::icon -->

          <span>Get Help</span>
        </RouterLink>
        <!-- end::Link -->

        <!-- begin::Lock -->
        <div class="link" @click="showLockScreen">
          <!-- begin::icon -->
          <div>
            <inline-svg src="media/icons/icons/lock-unlocked.svg" class="icon"></inline-svg>
          </div>
          <!-- end::icon -->

          <span>Lock</span>
        </div>
        <!-- end::Lock -->

        <!-- begin::SandBox -->
        <div class="link">
          <!-- begin::icon -->
          <div>
            <inline-svg src="media/icons/icons/archive-full.svg" class="icon"></inline-svg>
          </div>
          <!-- end::icon -->

          <span>SandBox</span>
        </div>
        <!-- end::SandBox -->
      </div>
      <!-- end::Link Box -->

      <!-- begin::Seprate Line -->
      <div class="seprator-line">
        <span></span>
      </div>
      <!-- end::Seprate Line -->

      <!-- begin::Collapse -->
      <div class="link collapse-btn" @click="changeSidebar()">
        <!-- begin::icon -->
        <div>
          <inline-svg src="media/icons/icons/chevron-left.svg" class="icon"></inline-svg>
        </div>
        <!-- end::icon -->

        <span>Collapse</span>
      </div>
      <!-- end::Collapse -->
    </div>
    <!-- end::Links -->

    <!-- begin::User -->
    <div class="two-side-space w-100">
      <div class="user cursor-pointer">
        <div>
          <div class="w-40px h-40px position-relative">
            <!-- begin::Image Box -->

            <img
              src="/media/images/banner/auth-bg.jpg"
              alt="user"
              class="w-100 h-100 rounded-circle object-cover"
            />

            <div class="w-8px h-8px rounded-circle bg-primary position-absolute bullet"></div>

            <!-- end::Image Box -->
          </div>
        </div>

        <div>
          <h6 class="neue-machina fw-light mb-0 lh-1 text-gray-800 name">Mohamad r.</h6>
          <small class="mb-0 lh-1 text-gray-600 balance">145.25 $</small>
        </div>
      </div>
    </div>
    <!-- end::User -->
  </aside>
</template>
