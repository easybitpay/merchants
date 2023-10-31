<script setup>
// Vue
import { ref } from 'vue'

// Component
import ApplicationCard from '../../../components/application/ApplicationCard.vue'

// ----- START ----- //
const telegram = ref(true)
</script>

<template>
  <ApplicationCard action="status"/>

  <div class="table-responsive mt-6">
    <table class="table notification-table">
      <thead>
        <tr>
          <th>Activity</th>
          <th>App</th>
          <th>Telegram</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>New Login</td>
          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
              />
            </div>
          </td>

          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
              />
            </div>
          </td>

          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
              />
            </div>
          </td>
        </tr>

        <tr>
          <td>Two Factor Authentication Disabled</td>
          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
              />
            </div>
          </td>

          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
              />
            </div>
          </td>

          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckDefault"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
