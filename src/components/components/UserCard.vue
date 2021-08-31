<template>
  <button type="button" class="btn btn-dark" v-if="!guest" @click.prevent.stop="signin(); onSignin();">
    Se connecter
  </button>

  <div class="card text-white" v-else>
    <div class="card-body">
      <h5 class="card-title">{{ guest.fullname }} - {{ guest.project }}</h5>

      <p class="card-text">{{ guest.email }}</p>

      <a href="#" class="btn btn-primary" @click.prevent.stop="signout(); onSignout();">
        Se déconnecter
      </a>
    </div>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue';
  import { useGuest } from '../hooks';

  defineProps({
    onSignin: {
      type: Function,
      default: () => {}
    },
    onSignout: {
      type: Function,
      default: () => {}
    }
  })

  const { signin, signout, guest } = useGuest();
</script>

<style lang="scss" scoped>
.card {
  .btn-primary {
    color: black;

    &:hover {
       color: #FC7902;
     }
  }
}
</style>