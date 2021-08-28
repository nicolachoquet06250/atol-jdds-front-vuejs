<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <button @click.prevent.stop="switchColor">Mettre en {{ showColor }}</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const color = ref('green');

const switchColor = () => {
  color.value = color.value === 'red' ? 'green' : 'red';
};

const showColor = computed(() => color.value === 'red' ? 'vert' : 'rouge');
</script>

<style scoped>
  button {
    cursor: pointer;
    color: v-bind(color)
  }
</style>
