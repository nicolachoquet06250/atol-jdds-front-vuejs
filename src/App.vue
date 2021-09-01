<template>
  <Navigation />
  <router-view style="margin-top: 30px;" />

  <spinner v-if="loading" />
</template>

<script setup>
  import Navigation from './components/Navigation.vue';
  import Spinner from './components/Spinner.vue';

  import { useScrollable, useLoading } from "./hooks";
  import { computed, watch } from "vue";
  import { useStore } from 'vuex';
  import { getEnvironmentsFromMocks, getJddsFromMocks, getTypesFromMocks } from "./store/annexes";

  const store = useStore();

  const { loading, setLoading } = useLoading();

  setLoading(true);
  Promise.all([
      getJddsFromMocks(),
      getEnvironmentsFromMocks(),
      getTypesFromMocks()
  ]).then(r => ({
    jdds: r[0],
    searchJdds: r[0],
    environments: r[1],
    types: r[2]
  })).then(r => {
    for (const stateKey of Object.keys(r)) {
      store.state[stateKey] = r[stateKey];
    }

    setTimeout(() => setLoading(false), 1000);
  });

  const { scrollable } = useScrollable();

  const overflow = computed(() => scrollable.value ? 'auto' : 'hidden');

  watch(() => overflow.value, () => {
    document.body.style.overflow = overflow.value;
  })
</script>