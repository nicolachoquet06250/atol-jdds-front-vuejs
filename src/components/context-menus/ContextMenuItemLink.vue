<template>
  <a href="#" class="list-group-item list-group-item-action" @click.prevent.stop="$emit('click')">
    <slot></slot>
  </a>
</template>

<script setup>
  import { defineEmits } from 'vue';

  defineEmits(['click'])
</script>