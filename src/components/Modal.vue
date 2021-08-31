<template>
  <div class="modal fade" tabindex="-1" :id="id">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="title"></slot>

          <button type="button" class="btn-close" data-bs-dismiss="modal" @click="$emit('cancel')">
            <span class="visually-hidden">Close</span>
          </button>
        </div>

        <div class="modal-body">
          <slot name="body"></slot>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="$emit('validate')">
            Valider et quitter
          </button>

          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="$emit('cancel')">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits } from 'vue';

  defineProps({ id: String });

  defineEmits([ 'validate', 'cancel' ]);
</script>

<style scoped>

</style>