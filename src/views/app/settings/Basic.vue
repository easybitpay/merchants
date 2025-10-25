<script setup>
// Vue
import { computed } from 'vue'

// Store
import { useAuthStore } from '@/stores/auth'

// Hook
import useIconImage from '@/hooks/useIconImage'

// Components
import UploadImageOffcanvas from '../../../components/settings/basic/UploadImageOffcanvas.vue'
import ContactInfoOffcanvas from '../../../components/settings/basic/ContactInfoOffcanvas.vue'
import BasicInfoOffcanvas from '../../../components/settings/basic/BasicInfoOffcanvas.vue'
import LinkedAccounts from '../../../components/settings/basic/LinkedAccounts.vue'

// ----- START ----- //
const store = useAuthStore()
const { storageImage } = useIconImage()

const currentUser = computed(() => store.currentUser)
const profile = computed(() => JSON.parse(currentUser.value?.merchant?.profile || '{}'))
</script>

<template>
  <div class="premium-settings-page">
    <!-- Page Header -->
    <div class="settings-header">
      <div>
        <h1 class="settings-title">Account Settings</h1>
        <p class="settings-subtitle">Manage your personal information and preferences</p>
      </div>
    </div>

    <!-- Profile Card -->
    <div class="settings-card profile-card">
      <div class="card-header">
        <h2 class="card-title">Profile</h2>
        <p class="card-description">Your photo and personal details</p>
      </div>

      <div class="profile-section">
        <div class="profile-avatar-section">
          <img
            :src="
              currentUser?.merchant?.avatar
                ? storageImage(currentUser.merchant.avatar, 80)
                : '/media/images/banner/auth-bg.jpg'
            "
            :alt="currentUser?.merchant?.first_name"
            class="profile-avatar"
          />
          <div class="profile-avatar-info">
            <h3 class="profile-name">
              {{ currentUser?.merchant?.first_name }} {{ currentUser?.merchant?.last_name }}
            </h3>
            <p class="profile-email">{{ currentUser?.merchant?.email }}</p>
          </div>
        </div>

        <button
          class="btn-change-photo"
          data-bs-toggle="offcanvas"
          data-bs-target="#uploadAvatar_offcanvas"
          aria-controls="uploadAvatar_offcanvas"
        >
          Change Photo
        </button>
      </div>
    </div>

    <!-- Personal Information Card -->
    <div class="settings-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Personal Information</h2>
          <p class="card-description">Update your personal details</p>
        </div>
        <button
          class="btn-edit"
          data-bs-toggle="offcanvas"
          data-bs-target="#contactInfo_offcanvas"
          aria-controls="contactInfo_offcanvas"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11.333 2L14 4.667l-9.333 9.333H2v-2.667L11.333 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Edit
        </button>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Full Name</div>
          <div class="info-value">
            {{ currentUser?.merchant?.first_name }} {{ currentUser?.merchant?.last_name }}
          </div>
        </div>

        <div class="info-item">
          <div class="info-label">Birthday</div>
          <div class="info-value">{{ profile.birth_date || 'Not set' }}</div>
        </div>

        <div class="info-item">
          <div class="info-label">Gender</div>
          <div class="info-value">{{ profile.gender || 'Not set' }}</div>
        </div>
      </div>
    </div>

    <!-- Contact Information Card -->
    <div class="settings-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Contact Information</h2>
          <p class="card-description">Manage your email and phone number</p>
        </div>
        <button
          class="btn-edit"
          data-bs-toggle="offcanvas"
          data-bs-target="#basicInfo_offcanvas"
          aria-controls="basicInfo_offcanvas"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11.333 2L14 4.667l-9.333 9.333H2v-2.667L11.333 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Edit
        </button>
      </div>

      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Email Address</div>
          <div class="info-value-with-badge">
            <span>{{ currentUser?.merchant?.email }}</span>
            <span v-if="currentUser?.merchant?.email_verified_at" class="badge-verified">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 7l2.5 2.5L11 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Verified
            </span>
            <span v-else class="badge-unverified">Not verified</span>
          </div>
        </div>

        <div class="info-item">
          <div class="info-label">Phone Number</div>
          <div class="info-value-with-badge">
            <span>{{ currentUser?.merchant?.phone || 'Not set' }}</span>
            <span v-if="currentUser?.merchant?.phone_verified_at" class="badge-verified">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 7l2.5 2.5L11 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Verified
            </span>
            <span v-else-if="currentUser?.merchant?.phone" class="badge-unverified">Not verified</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Linked Accounts -->
    <LinkedAccounts />

    <!-- Language Preference Card -->
    <div class="settings-card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Language</h2>
          <p class="card-description">Choose your preferred language</p>
        </div>
      </div>

      <div class="language-selector">
        <div class="dropdown w-100">
          <button
            class="language-dropdown-btn"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div class="language-current">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="language-icon">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="currentColor" stroke-width="1.5"/>
                <path d="M2 10h16M10 2a12 12 0 010 16 12 12 0 010-16z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <span>English</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <ul class="dropdown-menu w-100">
            <li><a class="dropdown-item">English</a></li>
            <li><a class="dropdown-item">Spanish</a></li>
            <li><a class="dropdown-item">French</a></li>
          </ul>
        </div>
        <p class="language-note">Changes will be applied after restarting the app</p>
      </div>
    </div>
  </div>

  <!-- Offcanvas Components -->
  <UploadImageOffcanvas />
  <ContactInfoOffcanvas />
  <BasicInfoOffcanvas />
</template>

<style scoped lang="scss">
.premium-settings-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
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

.profile-card {
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
}

.profile-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 0.75rem;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.profile-avatar-info {
  flex: 1;
}

.profile-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.profile-email {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.btn-change-photo {
  padding: 0.625rem 1.25rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    border-color: #6366f1;
    color: #6366f1;
    background: #f9fafb;
  }
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  svg {
    color: #6b7280;
  }
}

.info-grid {
  display: grid;
  gap: 1.25rem;
}

.info-item {
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}

.info-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 0.9375rem;
  color: #111827;
  font-weight: 500;
}

.info-value-with-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;

  > span:first-child {
    font-size: 0.9375rem;
    color: #111827;
    font-weight: 500;
  }
}

.badge-verified {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;

  svg {
    color: #059669;
  }
}

.badge-unverified {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.language-selector {
  max-width: 400px;
}

.language-dropdown-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  background: white;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #111827;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #d1d5db;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
}

.language-current {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.language-icon {
  color: #6b7280;
  flex-shrink: 0;
}

.language-note {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0.75rem 0 0 0;
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

  .profile-card {
    background: linear-gradient(135deg, #1a1d1e 0%, #0f1011 100%);
  }

  .profile-avatar {
    border-color: #2d3233;
  }

  .profile-name {
    color: #f3f4f6;
  }

  .profile-email {
    color: #9ca3af;
  }

  .btn-change-photo {
    background: #0f1011;
    border-color: #2d3233;
    color: #e5e7eb;

    &:hover {
      border-color: #6366f1;
      color: #a5b4fc;
      background: #1a1d1e;
    }
  }

  .btn-edit {
    background: #0f1011;
    border-color: #2d3233;
    color: #e5e7eb;

    &:hover {
      background: #1a1d1e;
      border-color: #374151;
    }

    svg {
      color: #9ca3af;
    }
  }

  .info-item {
    border-bottom-color: #2d3233;
  }

  .info-label {
    color: #9ca3af;
  }

  .info-value {
    color: #f3f4f6;
  }

  .info-value-with-badge > span:first-child {
    color: #f3f4f6;
  }

  .badge-verified {
    background: #064e3b;
    color: #86efac;

    svg {
      color: #10b981;
    }
  }

  .badge-unverified {
    background: #422006;
    color: #fbbf24;
  }

  .language-dropdown-btn {
    background: #0f1011;
    border-color: #2d3233;
    color: #f3f4f6;

    &:hover {
      border-color: #374151;
    }

    &:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }
  }

  .language-icon {
    color: #9ca3af;
  }

  .language-note {
    color: #9ca3af;
  }
}
</style>
