<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/jdds">
        <img src="https://boosted.orange.com/docs/5.0/assets/brand/orange-logo.svg" width="50" height="50" role="img" alt="Boosted" loading="lazy">
      </router-link>

      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse d-flex flex-row" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item" v-for="route of routeList" :key="route">
            <router-link :class="{
                'nav-link': true,
                disabled: route.disabled || false
              }"
             :tabindex="route.disabled ? -1 : false"
             :aria-disabled="route.disabled ? 'true' : 'false'"
             :to="{ name: route.name }">{{ route.title }}</router-link>
          </li>
        </ul>

        <search-form />

        <div class="navbar-text">
          <user-card />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import UserCard from './UserCard.vue';
  import SearchForm from './SearchForm.vue';
  import routes from '../router/routes';

  const routeList = routes.reduce((r, c) => c.hide ? r : [...r, c], []);
</script>

<style lang="scss" scoped>
#navbarNav {
  justify-content: space-between;
}
</style>