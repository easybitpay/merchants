import { ref } from 'vue'

export default function useForm() {
  const feedBacks = ref([])
  const showFeedBacks = () => {
    feedBacks.value = document.querySelectorAll('.invalid-feedback')

    awaitForClick()
  }

  const awaitForClick = () => {
    feedBacks.value.forEach((item) => {
      item.classList.add('d-flex')
      item.addEventListener('click', () => {
        const parent = item.parentElement;
        parent.querySelector('input').focus();
        item.classList.remove('d-flex')
      })
    })
  }

  return {
    showFeedBacks
  }
}
