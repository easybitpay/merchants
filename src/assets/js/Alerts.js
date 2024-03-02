// UUID For Unique ID
import { v4 as uuidv4 } from 'uuid'

// Main Wraper For Alerts
let alertPlaceholder = null

// Timer For Delete
const time = 5

// Alert List
let list = []

// Convert Type To Background For Alert
const colorToBg = {
  success: 'green',
  danger: 'red',
  warning: 'yellow'
}

/**
 * New Alert
 */
export const appendAlert = (message, color) => {
  // Set Main Wraper Element
  alertPlaceholder = document.getElementById('liveAlertPlaceholder')

  // Set Alert Variables
  const content = {
    id: uuidv4(),
    message,
    color
  }

  // Add Alert To List
  list.push(content)

  // Show Alert If List Has Only One Parameter
  if (list.length == 1) {
    startAlert(list[0])
  }

  // Show Shadows If List Has More Than One Parameter
  if (list.length > 1) {
    alertPlaceholder.classList.add('pending-list')
  }
}

/**
 * Create Alert And Show
 */
const startAlert = (item) => {
  // Create A Wraper For Alert
  const wrapper = document.createElement('div')
  wrapper.classList.add('alert-wraper')
  wrapper.setAttribute('id', `alert-wraper-${item.id}`)

  // Create Alert Item For Timer Type
  wrapper.innerHTML = [
    `<div class="progress mb-2" role="progressbar" aria-label="Danger example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="height: 4px">`,
    `<div class="progress-bar bg-${item.color}" style="--transition-time: ${time}s; width: 0%"></div>`,
    `</div>`,
    `<div class="alert alert-shadow alert-${item.color} alert-dismissible bg-${
      colorToBg[item.color]
    }-100 m-0" role="alert" id="alert-${item.id}">`,
    `   <div class='alert-text'>${item.message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',

    '<span class="first"></span>',
    '<span class="last"></span>',
    '</div>'
  ].join('')

  // Add Wraper To Main Element To Show In The DOM
  alertPlaceholder.append(wrapper)

  // Add Listener For Close BTN
  const myAlert = document.getElementById(`alert-${item.id}`)
  myAlert.addEventListener('closed.bs.alert', (event) => {
    closeAlert(item.id)
  })

  // Close BTN After Timer Finish
  setTimeout(() => {
    closeAlert(item.id)
  }, time * 1000)
}

/**
 * Close Alert
 */
const closeAlert = (id) => {
  const alertWraper = document.getElementById(`alert-wraper-${id}`)

  // Check IF Deleted Before OR Not
  if (alertWraper) {

    // Remove Item From List
    list = list.filter((item) => item.id != id)

    // Delete Alert Wraper From DOM
    alertPlaceholder.removeChild(alertWraper)

    // Check For Next Alert
    if (list.length) {
      startAlert(list[0])
    }

    // Remove Shadows If List Has One Parameter
    if (list.length == 1) {
      alertPlaceholder.classList.remove('pending-list')
    }
  }
}
