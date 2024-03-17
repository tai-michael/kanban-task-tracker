<template>
  <div class="flex flex-col gap-x-2 mb-2">
    <div
      class="relative flex justify-between mb-1 ml-[var(--card-gutter-mobile)] xs:ml-[var(--card-gutter-desktop)]"
    >
      <div class="absolute left-[-35px]">
        <AttachmentIcon
          class="!w-6 !h-6 text-[hsla(0,0%,35%,75%)] dark:text-[var(--card-text-subtle)]"
        />
      </div>
      <label class="block mb-2 text-base font-semibold text-[var(--card-text)]"
        >Attachments</label
      >

      <div v-if="store.cardDetails?.attachments.length">
        <AddAttachmentButton
          @button-triggered="clearUploadErrorMessage"
          @error-registered="displayError"
        />
      </div>
    </div>

    <div class="xs:ml-[var(--card-gutter-desktop)]">
      <div v-if="!store.cardDetails?.attachments.length">
        <AddAttachmentButton />
      </div>
      <!-- TODO need to check UI on android and iPhone -->
      <!-- TODO need to test how upload error actually looks, and possibly place in top div instead -->
      <div v-if="uploadErrorMessage">
        <span class="text-red-600">{{ uploadErrorMessage }}</span>
      </div>

      <ul v-if="store.cardDetails?.attachments.length">
        <li
          v-for="file in store.cardDetails?.attachments"
          :key="file.storageName"
          class="first:border-t dark:border-t-gray-500 [&:not(:last-child)]:border-b dark:[&:not(:last-child)]:border-b-gray-500"
        >
          <AttachmentFile :file="file" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AddAttachmentButton from '@/components/card-details/AddAttachmentButton.vue'
import AttachmentFile from '@/components/card-details/AttachmentFile.vue'
import AttachmentIcon from '@/assets/icons/icon-attachment.vue'
import { useCardStore } from '@/stores'
const store = useCardStore()
const uploadErrorMessage = ref('')
const clearUploadErrorMessage = () => {
  if (uploadErrorMessage.value) uploadErrorMessage.value = ''
}
const displayError = (error) => {
  uploadErrorMessage.value = error
}

watch(
  () => store.cardDetails?.attachments.length,
  (newValue) => {
    store.syncAttachmentsTotal(newValue)
  }
)
</script>

<style scoped lang="scss"></style>
