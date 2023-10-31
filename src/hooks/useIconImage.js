export default function useIconImage() {
  const iconImage = (title, size = '32', type = 'color') => {
    const name = title.toLowerCase()

    return `${import.meta.env.VITE_APP_STORAGE_URL}/icons/${size}/${type}/${name}.png`
  }

  const storageImage = (url, size) => {
    if (url) {
      const URL = url.split('.')
      const newURL = `${URL[0]}_${size}x0.${URL[1]}`

      return `${import.meta.env.VITE_APP_STORAGE_URL}${size ? newURL : url}`
    }
  }

  return { iconImage, storageImage }
}
