<script>
import { useDropzone } from 'vue3-dropzone'
export default {
  name: 'drop-zone',
  emit: ['set-files'],
  setup(props, { emit }) {
    const { getRootProps, getInputProps, ...rest } = useDropzone({
      accept: 'image/*',
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        let files = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )

        emit('set-files', files)
      }
    })

    return {
      getRootProps,
      getInputProps,
      ...rest
    }
  }
}
</script>

<template>
  <div class="dropzone">
    <div v-bind="getRootProps({ class: 'clickable' })"></div>
    <input v-bind="getInputProps()" />
    <div class="dz-message needsclick d-flex align-items-center gap-2">
      <!--begin::Icon-->
      <inline-svg src="media/icons/icons/photo.svg" class="svg-icon-cyan-500"></inline-svg>
      <!--end::Icon-->
      <!--begin::Info-->
      <p class="m-0 fs-7 text-cyan-500 ls-sm lh-1">Drag your File Here</p>
      <!--end::Info-->
    </div>
  </div>
</template>
