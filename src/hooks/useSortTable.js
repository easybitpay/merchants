import { ref } from 'vue'

export default function useSortTable() {
  const selectedSort = ref({
    column: '',
    direction: ''
  })

  const startCheckSort = (name) => {
    console.log({ name })
    // Detect Sort Table Header Row
    const sort_table = document.querySelector(`[${name}-sortable]`)
    console.log({ sort_table })
    if (sort_table) {
      const sort_items = sort_table.querySelectorAll('[sortKey]')

      sort_items.forEach((item) => {
        item.addEventListener('click', () => {
          // Remove ASC or DESC from item
          sort_items.forEach((element) => {
            element.classList.remove('asc')
            element.classList.remove('desc')
          })

          const sort_column = item.getAttribute('sortKey') || ''
          const { column, direction } = selectedSort.value

          // If its not same: set sort
          // else: check is ASC or DESC: If is ASC change with DESC else remove
          if (column != sort_column) {
            selectedSort.value = {
              column: sort_column,
              direction: 'asc'
            }
          } else {
            selectedSort.value = {
              column: direction === 'asc' ? sort_column : '',
              direction: direction === 'asc' ? 'desc' : ''
            }
          }

          // ADD ASC or DESC to selected item
          if (selectedSort.value.direction) {
            item.classList.add(selectedSort.value.direction)
          }else {
            item.classList.remove('asc')
            item.classList.remove('desc')
          }
        })
      })
    }
  }

  return {
    startCheckSort,
    selectedSort
  }
}
