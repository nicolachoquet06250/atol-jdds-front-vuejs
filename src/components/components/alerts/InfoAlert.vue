<template>
  <div class="alert alert-info alert-dismissible fade show" role="alert" v-if="open && internalOpen">
    <span class="alert-icon">
      <span class="visually-hidden">Info</span>
    </span>

    <slot></slot>

    <button type="button" class="btn-close" @click="$emit('close'); handleClose()">
      <span class="visually-hidden">Close</span>
    </button>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits, ref } from 'vue';

  const props = defineProps({ open: Boolean });

  defineEmits([ 'close' ]);

  const internalOpen = ref(props.open);

  const handleClose = () => {
    internalOpen.value = false;
  }
</script>