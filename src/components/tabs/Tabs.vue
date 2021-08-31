<template>
  <ul class="nav nav-tabs">
    <slot></slot>
  </ul>

  <slot name="content"></slot>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.nav {
  &.nav-tabs {
    height: 47.2px;
  }
}
</style>