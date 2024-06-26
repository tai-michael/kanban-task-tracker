<template>
  <input
    type="file"
    id="fileInput"
    @change="uploadFile"
    multiple
    :accept="allowedFileTypes"
    :disabled="isUploadingFile"
    style="display: none"
  />

  <label
    for="fileInput"
    class="custom-file-input"
    :class="{ disabled: isUploadingFile }"
  >
    <span
      class="flex items-center gap-x-1 text-[var(--card-text)] font-medium"
      :class="{ invisible: isUploadingFile }"
    >
      Add file
    </span>

    <SpinnerCircle
      v-if="isUploadingFile"
      :spinner-classes="'absolute flex w-5 h-5 border-2 border-[var(--medium-dark-gray)]'"
    />
  </label>
</template>

<script setup lang="ts">
import { ref as vueRef } from 'vue'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage'
import SpinnerCircle from '@/assets/spinner-circle.vue'
import { storage, auth } from '@/firebaseInit'
import { useCardStore } from '@/stores'
const store = useCardStore()

const maxFileSize = 10 * 1024 * 1024 // 10 MB
const allowedFileTypesArray = [
  'image/*',
  'application/pdf',
  'audio/*',
  'video/*',
  // Microsoft Office Formats
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  // OpenOffice Formats
  'application/vnd.oasis.opendocument.text', // .odt
  'application/vnd.oasis.opendocument.spreadsheet', // .ods
  'application/vnd.oasis.opendocument.presentation', // .odp
  // Text Formats
  'text/plain',
  'text/rtf',
  'text/csv',
  'text/html',
  'text/xml',
  'text/css',
  'text/javascript',
  'application/json',
  'text/markdown',
  'application/x-yaml',
  // Compressed File Formats
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/gzip',
  'application/x-tar',
  'application/x-bzip',
  'application/x-bzip2',
  'application/x-gzip',
]
const allowedFileTypes = allowedFileTypesArray.join(',')

const isUploadingFile = vueRef(false)
const emit = defineEmits(['buttonTriggered', 'errorRegistered'])
const uploadFile = async (event) => {
  emit('buttonTriggered')
  isUploadingFile.value = true

  const filesSelected = event.target.files
  if (!filesSelected.length) {
    isUploadingFile.value = false
    return
  }

  try {
    for (const file of filesSelected) {
      validateFileType(file, allowedFileTypesArray)
      validateFileSize(file, maxFileSize)

      const { storageFileName, url } = await uploadFileToFirebase(file)
      store.addAttachment({
        originalName: file.name,
        storageName: storageFileName,
        url,
      })
    }
  } catch (err) {
    console.error('Upload failed:', err)
    emit('errorRegistered', err.message)
  } finally {
    isUploadingFile.value = false
  }
}

const validateFileType = (file, allowedFileTypesArray) => {
  const fileType = file.type
  const isValidType = allowedFileTypesArray.some((allowedType) => {
    if (allowedType.endsWith('*')) {
      // For generic types like 'image/*'
      return fileType.startsWith(allowedType.replace('*', ''))
    }
    return fileType === allowedType
  })

  if (!isValidType) {
    throw new Error(`Invalid file type: ${fileType}`)
  }
}

const validateFileSize = (file, maxFileSize) => {
  if (file.size > maxFileSize) {
    throw new Error(
      `File size exceeds the limit of ${maxFileSize / 1024 / 1024}MB.`
    )
  }
}

const uploadFileToFirebase = async (file) => {
  try {
    const storageFileName = `${Date.now()}-${file.name}`
    const fileRef = storageRef(
      storage,
      `attachments/${auth.currentUser.uid}/${store.cardDetails?.boardId}/${store.cardDetails?.id}/${storageFileName}`
    )
    const snapshot = await uploadBytes(fileRef, file)
    const url = await getDownloadURL(snapshot.ref)
    return { storageFileName, url }
  } catch (err) {
    throw new Error(err.message || 'Failed to upload file to Firebase.')
  }
}
</script>

<style scoped lang="scss">
.custom-file-input {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 6px 16px;
  background-color: var(--card-secondary-button);
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 0.75rem;
  transition: background-color 0.1s ease-in-out;

  &:hover,
  &:active {
    background-color: var(--card-secondary-button-hover);
  }
}

.custom-file-input.disabled {
  cursor: not-allowed;
}
</style>
