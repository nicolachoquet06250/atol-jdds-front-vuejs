<template>
  <div class="overlay" v-if="open" @click.prevent.stop="$emit('close')">
    <div class="context-menu">
      <ul class="list-group">
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits, computed } from 'vue';

  const props = defineProps({
    open: Boolean,
    coordinate: Object
  });

  defineEmits(['close']);

  const coordX = computed(() => props.coordinate.x + 'px');
  const coordY = computed(() => props.coordinate.y + 'px');
</script>

<style lang="scss" scoped>

.overlay {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: transparent;

  .context-menu {
    position: absolute;
    top: v-bind(coordY);
    left: v-bind(coordX);
    width: 200px;
  }
}

</style>