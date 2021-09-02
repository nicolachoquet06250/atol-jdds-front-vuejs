<template>
  <div class="card text-white" v-if="guest !== false">
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
  import { useRouter } from 'vue-router';
  import { useGuest, useLoading } from '../hooks';

  defineProps({
    onSignin: {
      type: Function,
      default: () => {}
    },
    onSignout: {
      type: Function,
      default: () => {}
    }
  });

  const { signout, guest } = useGuest();
  const { setLoading } = useLoading();
  const router = useRouter();

  const onSignout = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    router.push('/login')
  };
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