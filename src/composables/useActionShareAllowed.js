// Vue
import { computed } from 'vue'

// Store
import { useAppStore } from '@/stores/app'

export default function useActionShareAllowed() {
  const store = useAppStore()

  const shareAppStatus = computed(() => store.shareAppStatus)

  const actionShareAllowed = (type, action) => {
    let allowed = true
    for (let i = 0; i < shareAppStatus.value.length; i++) {
      const shareType = shareAppStatus.value[i]

      if (shareType.type === type) {
        for (let f = 0; f < shareType.rules.forbidden.length; f++) {
          const forbidden = shareType.rules.forbidden[f]
          if (forbidden === action) {
            allowed = false
            break
          }
        }
      }
    }

    return allowed
  }

  return { actionShareAllowed }
}
