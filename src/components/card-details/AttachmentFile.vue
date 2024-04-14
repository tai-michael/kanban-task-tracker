<template>
  <div class="flex justify-between items-center py-2">
    <AttachmentIcon
      class="block xs:hidden !w-6 !h-6 text-[hsla(0,0%,35%,75%)] dark:text-[var(--card-text-subtle)]"
    />
    <span
      :title="props.file.originalName"
      class="max-w-[235px] xs:max-w-[335px] sm:max-w-[430px] truncate w-full dark:text-[var(--card-text)]"
      >{{ props.file.originalName }}</span
    >

    <EllipsisMenu
      ref="ellipsisMenuRef"
      :popover-classes="'!top-[-85px] !right-[25px]'"
    >
      <template #custom-buttons>
        <div class="flex flex-col">
          <button
            @click="deleteFile(props.file)"
            type="button"
            class="ellipsis-popover__button p-3"
          >
            <DeleteIcon class="text-[var(--light-red)]" />
            <label class="select-none text-[var(--light-red)]">Delete</label>
          </button>

          <a
            :href="props.file.url"
            target="_blank"
            download
            type="button"
            class="ellipsis-popover__button p-3"
            @click="closePopover"
          >
            <DownloadIcon />
            <label class="select-none">Download</label>
          </a>
        </div>
      </template>
    </EllipsisMenu>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EllipsisMenu from '@/components/EllipsisMenu.vue'
import AttachmentIcon from '@/assets/icons/icon-attachment.vue'
import DeleteIcon from '@/assets/icons/icon-delete.vue'
import DownloadIcon from '@/assets/icons/icon-download.vue'
import { ref as storageRef, deleteObject } from 'firebase/storage'
import { storage, auth } from '@/firebaseInit'
import { useCardStore } from '@/stores'
const store = useCardStore()
const props = defineProps(['file'])

const ellipsisMenuRef = ref()
const closePopover = () => {
  ellipsisMenuRef.value.toggleEllipsisMenu()
}

// REVIEW not sure whether to await deleteObject or not; it adds a noticeable delay if awaited, which is poor UX, but also safer in case delete fails; perhaps if error occurs, reinstate a backup to frontend?
const deleteFile = (fileToDelete) => {
  try {
    const fileRef = storageRef(
      storage,
      `attachments/${auth.currentUser.uid}/${store.cardDetails?.boardId}/${store.cardDetails?.id}/${fileToDelete.storageName}`
    )
    deleteObject(fileRef)
    store.removeAttachment(fileToDelete)
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}
</script>

<style scoped lang="scss"></style>
