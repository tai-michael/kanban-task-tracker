<template>
  <div>
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
      <div v-if="!isUploadingFile">
        <span class="mr-1">📎</span>Add attachment
      </div>
      <div v-else>Uploading...</div>
    </label>

    <div v-if="uploadError">
      <span class="text-red-600">{{ uploadError }}</span>
    </div>

    <ul v-if="store.cardDetails?.attachments.length">
      <label>Attachments:</label>
      <li
        v-for="file in store.cardDetails?.attachments"
        :key="file.storageName"
        class="flex justify-between"
      >
        <span :title="file.originalName" class="max-w-[200px] truncate block">{{
          file.originalName
        }}</span>
        <div>
          <a :href="file.url" target="_blank" download class="mr-2">Download</a>
          <button @click="deleteFile(file)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref as vueRef, watch } from 'vue'
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
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
const uploadError = vueRef('')
const uploadFile = async (event) => {
  uploadError.value = ''
  isUploadingFile.value = true

  const filesSelected = event.target.files
  if (!filesSelected.length) return

  try {
    for (const file of filesSelected) {
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

      if (file.size > maxFileSize) {
        throw new Error('File size exceeds the limit of 10MB.')
      }

      // In Firebase Storage, uploading a file with the same name to the same location overwrites the existing file, hence the workaround below
      const storageFileName = `${Date.now()}-${file.name}`
      const fileRef = storageRef(
        storage,
        `attachments/${auth.currentUser.uid}/${store.cardDetails?.boardId}/${store.cardDetails?.id}/${storageFileName}`
      )
      const snapshot = await uploadBytes(fileRef, file)
      const url = await getDownloadURL(snapshot.ref)

      store.addAttachment({
        originalName: file.name,
        storageName: storageFileName,
        url,
      })
    }
  } catch (err) {
    console.error('Upload failed:', err)
    uploadError.value = err.message
  } finally {
    isUploadingFile.value = false
  }
}

const deleteFile = async (fileToDelete) => {
  try {
    const fileRef = storageRef(
      storage,
      `attachments/${auth.currentUser.uid}/${store.cardDetails?.boardId}/${store.cardDetails?.id}/${fileToDelete.storageName}`
    )
    await deleteObject(fileRef)
    store.removeAttachment(fileToDelete)
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}
watch(
  () => store.cardDetails?.attachments.length,
  (newValue) => {
    store.syncAttachmentsTotal(newValue)
  }
)
</script>
