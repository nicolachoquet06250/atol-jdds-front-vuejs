<template>
  <Navigation />
  <router-view style="margin-top: 30px;" />
</template>

<script setup>
  import Navigation from './components/Navigation.vue';
  import { useScrollable } from "./hooks";
  import { computed, watch } from "vue";

  const { scrollable } = useScrollable();

  const overflow = computed(() => scrollable.value ? 'auto' : 'hidden');

  watch(() => overflow.value, () => {
    document.body.style.overflow = overflow.value;
  })
</script>