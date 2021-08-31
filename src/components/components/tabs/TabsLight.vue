<template>
  <ul class="nav nav-tabs nav-tabs-light">
    <slot></slot>
  </ul>

  <slot name="content"></slot>
</template>

<script setup>

</script>

<style scoped>
  ::slotted(.tab-content) {
    border: none;
  }
</style>