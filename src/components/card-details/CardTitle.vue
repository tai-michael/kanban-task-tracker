<template>
  <div class="flex flex-col gap-x-2 mb-9">
    <div
      class="relative flex justify-between mb-1 ml-[var(--card-gutter-mobile)] xs:ml-[var(--card-gutter-desktop)]"
    >
      <div class="absolute top-[8px] left-[-35px]">
        <CardIcon
          class="text-[hsla(0,0%,35%,75%)] dark:text-[var(--card-text-subtle)]"
        />
      </div>
      <Title
        :title="store.cardSummary?.title"
        @title-edited="changeCardTitle"
        class="block max-w-[455px] mb-3 py-1.5 text-xl font-bold"
      />
    </div>

    <div class="ml-2 xs:ml-[var(--card-gutter-desktop)]">
      <CardDatePicker />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import CardIcon from '@/assets/icons/icon-card.vue'
import { useCardStore } from '@/stores'
const Title = defineAsyncComponent(() => import('@/components/Title.vue'))
const CardDatePicker = defineAsyncComponent(
  () => import('@/components/card-details/CardDatePicker.vue')
)
const store = useCardStore()

const changeCardTitle = (title: string) => {
  store.updateCardTitle(title)
}
</script>

<style scoped lang="scss"></style>
