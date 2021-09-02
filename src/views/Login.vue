<template>
  <div class="container">
    <form class="row" @submit="login">
      <div class="col-6 offset-3">
        <input type="email" class="form-control" placeholder="Email" v-model="email" />
      </div>

      <div class="col-12 my-2"></div>

      <div class="col-6 offset-3">
        <input type="password" class="form-control" placeholder="Mot de passe" v-model="password" />
      </div>

      <div class="col-12 my-2"></div>

      <div class="col-6 offset-3">
        <button type="submit" class="btn btn-primary">Se connecter</button>
      </div>
    </form>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useGuest, useLoading } from '../hooks';

  const { signin, guest } = useGuest();
  const { setLoading } = useLoading();
  const router = useRouter();

  // Redirection si loggé
  if (guest.value !== false) {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    router.push('/jdds');
  }

  const email = ref('nicolas.choquet.ext@orange.fr');
  const password = ref('toto');

  const login = () => {
    signin();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    router.push('/jdds');
  };
</script>

<style scoped>

</style>
