<template>
  <div>
    <h1>{{ store.board.name }}</h1>

    <div class="flex">
      <div v-for="list of store.board.lists">
        <List :list="list"></List>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useBoardStore } from '@/stores'
const List = defineAsyncComponent(() => import('@/components/List.vue'))
const store = useBoardStore()
</script>

<style scoped lang="scss">
h1 {
  font-weight: 600;
  font-size: 1.5rem;
}
</style>
