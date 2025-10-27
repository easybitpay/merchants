<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hooks
import useConvertDate from '@/hooks/useConvertDate'
import useIconImage from '@/hooks/useIconImage'

// Components
import TwoFaOffcanvas from '../../../components/settings/privacy/TwoFaOffcanvas.vue'
import UpdatePasswordOffcanvas from '../../../components/settings/privacy/UpdatePasswordOffcanvas.vue'
import NewKycOffcanvas from '../../../components/settings/privacy/NewKycOffcanvas.vue'
import LockScreenOffcanvas from '../../../components/settings/privacy/LockScreenOffcanvas.vue'
import LastSignInLoading from '../../../components/loadings/LastSignInLoading.vue'

// ----- START ----- //
const store = useAuthStore()
const { convertDate, conevrtUnixToDate } = useConvertDate()
const { storageImage } = useIconImage()

// Refs
const twoFaStatus = ref(false)
const lockScreenStatus = ref(false)
const passSetedDate = ref('')
const showSessionCount = ref(2)
const sessionsLoading = ref(false)
const sessionsList = ref([])
const kycList = ref([])
const kycLoading = ref(false)

// Computeds
const currentUser = computed(() => store.currentUser)
const filteredSessions = computed(() => {
  if (sessionsList.value.length) {
    return sessionsList.value.slice(0, showSessionCount.value)
  } else {
    return []
  }
})

// Functions
const change2FaToggleStatus = () => {
  const enable_2fa = currentUser.value.merchant.two_factor_enabled
  twoFaStatus.value = enable_2fa ? true : false
}

const changeLockScreenStatus = () => {
  const status = localStorage.getItem('lockScreenInfo')
  if (status) {
    lockScreenStatus.value = true
    const parsedInfo = JSON.parse(status)
    passSetedDate.value = conevrtUnixToDate(parsedInfo.timestamp, 'DD MMM YYYY')
  } else {
    lockScreenStatus.value = false
    passSetedDate.value = ''
  }
}

const getActiveSessions = async () => {
  sessionsLoading.value = true
  await store.getActiveSessions().then((res) => {
    if (res) sessionsList.value = res
  })
  sessionsLoading.value = false
}

const getKYCList = async () => {
  kycLoading.value = true
  await store.KYCList().then((res) => {
    if (res) kycList.value = res
  })
  kycLoading.value = false
}

const deleteDocument = async (id) => {
  await store.deleteKYC(id).then((res) => {
    if (res) kycList.value = kycList.value.filter((item) => item.id != id)
  })
}

const convertStatusToColor = (status) => {
  if (status == 0) return { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' }
  if (status == 9) return { bg: '#fee2e2', text: '#991b1b', border: '#f87171' }
  if (status == 10) return { bg: '#d1fae5', text: '#065f46', border: '#34d399' }
}

const convertStatusToText = (status) => {
  if (status == 0) return 'Checking'
  if (status == 9) return 'Rejected'
  if (status == 10) return 'Verified'
}

onMounted(() => {
  change2FaToggleStatus()
  changeLockScreenStatus()
  getActiveSessions()
  getKYCList()
})
</script>

<template>
  <div class="premium-settings-page">
    <!-- Page Header -->
    <div class="settings-header">
      <div>
        <h1 class="settings-title">Privacy & Security</h1>
        <p class="settings-subtitle">Manage your security settings and account access</p>
      </div>
    </div>

    <!-- Authentication Card -->
    <div class="settings-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Authentication</h2>
          <p class="card-description">Secure your account with additional protection</p>
        </div>
      </div>

      <div class="security-options">
        <!-- 2FA Toggle -->
        <div class="security-option">
          <div class="option-info">
            <div class="option-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="4" y="8" width="12" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M7 8V5a3 3 0 116 0v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <div class="option-title">Two-Factor Authentication</div>
              <div class="option-subtitle">Add an extra layer of security</div>
            </div>
          </div>
          <label class="toggle-switch">
            <input
              type="checkbox"
              v-model="twoFaStatus"
              data-bs-toggle="offcanvas"
              data-bs-target="#twoFactor_offcanvas"
              aria-controls="twoFactor_offcanvas"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>

        <!-- Password -->
        <div class="security-option">
          <div class="option-info">
            <div class="option-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 8h1a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h1m4-4v4m0 0l2-2m-2 2L7 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="flex-1">
              <div class="option-title">Password</div>
              <div class="option-subtitle">Last changed {{ convertDate(currentUser.last_password_update, 'DD MMM YYYY') }}</div>
            </div>
          </div>
          <button
            class="btn-action"
            data-bs-toggle="offcanvas"
            data-bs-target="#updatePassword_offcanvas"
            aria-controls="updatePassword_offcanvas"
          >
            Change
          </button>
        </div>

        <!-- Lock Screen -->
        <div class="security-option">
          <div class="option-info">
            <div class="option-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="5" y="9" width="10" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="10" cy="13" r="1" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <div class="option-title">Lock Screen</div>
              <div class="option-subtitle">{{ passSetedDate ? `Set on ${passSetedDate}` : 'Protect your account when idle' }}</div>
            </div>
          </div>
          <label class="toggle-switch">
            <input
              type="checkbox"
              v-model="lockScreenStatus"
              data-bs-toggle="offcanvas"
              data-bs-target="#lockScreen_offcanvas"
              aria-controls="lockScreen_offcanvas"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- Active Sessions Card -->
    <div class="settings-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Active Sessions</h2>
          <p class="card-description">Devices currently signed into your account</p>
        </div>
      </div>

      <div class="sessions-list">
        <LastSignInLoading v-if="sessionsLoading" />
        
        <div v-else-if="filteredSessions.length" class="session-items">
          <div v-for="item in filteredSessions" :key="item.id" class="session-item">
            <div class="session-icon">
              {{ item.type.charAt(0) }}
            </div>
            <div class="session-info">
              <div class="session-device">{{ item.type }}</div>
              <div class="session-ip">{{ item.ip }}</div>
            </div>
            <button class="btn-session-remove" title="Remove session">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-else class="empty-sessions">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="12" width="32" height="24" rx="3" stroke="#d1d5db" stroke-width="2"/>
            <path d="M8 20h32" stroke="#d1d5db" stroke-width="2"/>
          </svg>
          <p>No active sessions</p>
        </div>

        <button
          v-if="filteredSessions.length < sessionsList.length"
          class="btn-view-more"
          @click="showSessionCount = showSessionCount + 2"
        >
          View more sessions
        </button>
      </div>
    </div>

    <!-- KYC Verification Card -->
    <div class="settings-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Identity Verification</h2>
          <p class="card-description">Verify your identity to unlock full account features</p>
        </div>
        <button
          class="btn-upload"
          data-bs-toggle="offcanvas"
          data-bs-target="#newKyc_offcanvas"
          aria-controls="newKyc_offcanvas"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Upload Document
        </button>
      </div>

      <div v-if="kycLoading" class="kyc-loading">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="kycList.length" class="kyc-list">
        <div v-for="item in kycList" :key="item.id" class="kyc-item">
          <div class="kyc-preview" :style="`background-image: url(${storageImage(item.file)})`">
            <div class="kyc-type">{{ $filters.capitalize(item.type) }}</div>
          </div>
          <div class="kyc-info">
            <div
              class="kyc-status"
              :style="{
                background: convertStatusToColor(item.status).bg,
                color: convertStatusToColor(item.status).text,
                borderColor: convertStatusToColor(item.status).border
              }"
            >
              <svg v-if="item.status === 10" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else-if="item.status === 9" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10 4L4 10M4 4l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.5"/>
                <path d="M7 4v3l2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              {{ convertStatusToText(item.status) }}
            </div>
            <button class="btn-kyc-delete" @click="deleteDocument(item.id)" title="Delete document">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-kyc">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="8" width="32" height="32" rx="3" stroke="#d1d5db" stroke-width="2"/>
          <path d="M20 20h8M20 28h8M16 24h16" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>No documents uploaded yet</p>
        <small>Upload your ID or documents for verification</small>
      </div>
    </div>
  </div>

  <!-- Offcanvas Components -->
  <TwoFaOffcanvas @change2FaToggleStatus="change2FaToggleStatus" />
  <UpdatePasswordOffcanvas />
  <LockScreenOffcanvas @changeLockScreenStatus="changeLockScreenStatus" />
  <NewKycOffcanvas @refresh="getKYCList" />
</template>

<style scoped lang="scss">
.premium-settings-page {
  max-width: 100%;
  width: 100%;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.settings-header {
  margin-bottom: 2rem;
}

.settings-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.settings-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}

.settings-card {
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #d1d5db;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.card-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.security-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.security-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  gap: 1rem;
  transition: all 0.15s ease;

  &:hover {
    background: #f9fafb;
  }
}

.option-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.option-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 0.5rem;
  color: #6b7280;
  flex-shrink: 0;
}

.option-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.125rem;
}

.option-subtitle {
  font-size: 0.8125rem;
  color: #6b7280;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .toggle-slider {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);

      &:before {
        transform: translateX(20px);
      }
    }
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #d1d5db;
    transition: 0.3s;
    border-radius: 28px;

    &:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }
}

.btn-action {
  padding: 0.5rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: #f3f4f6;
    border-color: #6366f1;
    color: #6366f1;
  }
}

.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.15s ease;

  &:hover {
    background: #f9fafb;

    .btn-session-remove {
      opacity: 1;
    }
  }
}

.session-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 0.5rem;
  font-weight: 600;
  color: #6366f1;
  flex-shrink: 0;
}

.session-info {
  flex: 1;
  min-width: 0;
}

.session-device {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.125rem;
}

.session-ip {
  font-size: 0.8125rem;
  color: #6b7280;
}

.btn-session-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  color: #6b7280;
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s ease;

  &:hover {
    background: #fef2f2;
    border-color: #fca5a5;
    color: #dc2626;
  }
}

.empty-sessions,
.empty-kyc {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #9ca3af;

  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  p {
    font-size: 0.9375rem;
    font-weight: 500;
    margin: 0 0 0.25rem 0;
  }

  small {
    font-size: 0.8125rem;
    color: #6b7280;
  }
}

.btn-view-more {
  width: 100%;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #6366f1;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }
}

.kyc-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.kyc-item {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.15s ease;

  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
}

.kyc-preview {
  height: 160px;
  background-size: cover;
  background-position: center;
  background-color: #f3f4f6;
  position: relative;
}

.kyc-type {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #111827;
}

.kyc-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem;
  gap: 0.75rem;
}

.kyc-status {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border: 1px solid;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
}

.btn-kyc-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: #fef2f2;
    border-color: #fca5a5;
    color: #dc2626;
  }
}

.kyc-loading {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// ===== DARK MODE STYLES =====
[data-bs-theme="dark"] {
  .settings-title {
    color: #f3f4f6;
  }

  .settings-subtitle {
    color: #9ca3af;
  }

  .settings-card {
    background: #1a1d1e;
    border-color: #2d3233;

    &:hover {
      border-color: #374151;
    }
  }

  .card-title {
    color: #f3f4f6;
  }

  .card-description {
    color: #9ca3af;
  }

  .security-option {
    border-color: #2d3233;

    &:hover {
      background: #0f1011;
    }
  }

  .option-icon {
    background: #0f1011;
    color: #9ca3af;
  }

  .option-title {
    color: #f3f4f6;
  }

  .option-subtitle {
    color: #9ca3af;
  }

  .btn-action {
    background: #0f1011;
    border-color: #2d3233;
    color: #e5e7eb;

    &:hover {
      background: #1a1d1e;
      border-color: #6366f1;
      color: #a5b4fc;
    }
  }

  .btn-upload {
    &:hover {
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }
  }

  .session-item {
    border-color: #2d3233;

    &:hover {
      background: #0f1011;
    }
  }

  .session-icon {
    background: #0f1011;
    color: #a5b4fc;
  }

  .session-device {
    color: #f3f4f6;
  }

  .session-ip {
    color: #9ca3af;
  }

  .btn-session-remove {
    color: #9ca3af;

    &:hover {
      background: #7f1d1d;
      border-color: #dc2626;
      color: #fca5a5;
    }
  }

  .empty-sessions,
  .empty-kyc {
    color: #6b7280;

    svg {
      opacity: 0.3;
    }

    small {
      color: #9ca3af;
    }
  }

  .btn-view-more {
    background: #0f1011;
    border-color: #2d3233;
    color: #a5b4fc;

    &:hover {
      background: #1a1d1e;
      border-color: #374151;
    }
  }

  .kyc-item {
    border-color: #2d3233;

    &:hover {
      border-color: #374151;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }

  .kyc-preview {
    background-color: #0f1011;
  }

  .kyc-type {
    background: rgba(26, 29, 30, 0.95);
    color: #f3f4f6;
  }

  .btn-kyc-delete {
    border-color: #2d3233;
    color: #9ca3af;

    &:hover {
      background: #7f1d1d;
      border-color: #dc2626;
      color: #fca5a5;
    }
  }

  .loading-spinner {
    border-color: #2d3233;
    border-top-color: #6366f1;
  }
}
</style>
