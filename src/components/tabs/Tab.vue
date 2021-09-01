<template>
  <li class="nav-item">
    <a :class="{'nav-link': link, active, disabled}" href="#"
       @click.prevent.stop="$emit('click')"
       @contextmenu.prevent.stop="$emit('contextmenu', $event)"
       :tabindex="tabindex ? -1 : false"
       :aria-disabled="disabled">
      <slot></slot>
    </a>
  </li>
</template>

<script setup>
  import { defineEmits, defineProps, ref, watch } from 'vue';

  const props = defineProps({
    active: Boolean,
    disabled: {
      type: Boolean,
      default: false
    },
    link: {
      type: Boolean,
      default: true,
    },
    tabindex: {
      type: Boolean,
      default: false
    }
  });
  defineEmits([ 'contextmenu', 'click' ]);

  const active = ref(props.active);

  watch(() => props.active, () => {
    active.value = props.active;
  });
</script>

<style scoped>

</style>
