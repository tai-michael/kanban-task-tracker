<template>
  <div></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { db } from '@/firebaseInit'
// import { doc, getDoc } from 'firebase/firestore'
// import { useRoute } from 'vue-router';
// const route = useRoute()
const props = defineProps(['card'])
// const card = ref({})

// const fetchingCardFromBackend = ref(false)
// const fetchCard = async (id: string) => {
//   const cardRef = doc(db, 'cards', id)
//   const cardDoc = await getDoc(cardRef)
//   console.log(cardDoc?.data()?.card)
//   if (cardDoc.exists()) return cardDoc.data()
// }
// const emit = defineEmits(['cardIdEmitted'])
// onMounted(async () => {
//   fetchingCardFromBackend.value = true
//   card.value = await fetchCard(props.cardId)
//   console.log(card.value)
//   fetchingCardFromBackend.value = false
// })
onMounted(() => {
  console.log(props.card)
})
</script>

<style scoped lang="scss"></style>
