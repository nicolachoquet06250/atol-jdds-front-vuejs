<template>
  <form class="d-flex position-absolute mx-2" @submit.prevent.stop="handleSearch">
    <div class="badges-container d-flex justify-content-center align-items-center" ref="badgesContainer">
      <span class="badge rounded-pill bg-primary mx-1" v-for="(chip, i) of chipsList" :key="chip">
        {{ chip }}
        <a href="#" @click.prevent.stop="handleRemoveChip(i)">
          <i class="fas fa-times"></i>
        </a>
      </span>
    </div>

    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"
           v-model="query"
           @keyup.prevent.stop="handleMouseUp($event)"
           @input="handleInput($event)"
           ref="searchField">
    <span class="autocomplete"
          v-if="autocomplete.length > 0"
          @dblclick="handleAutocompleteQuery"
          @click="searchField.focus">
      <span class="query">{{ query }}</span>{{ autocomplete }}
    </span>

    <button type="button" class="btn-close" v-if="!searchCanceled"
            @click.prevent.stop="handleCancelSearch">
      <span class="visually-hidden" data-v-68267af5="">Close</span>
    </button>
  </form>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useGuest, useSearchForm } from '../hooks';

  const store = useStore();
  const { guest } = useGuest();
  const { searchCanceled, handleSearch, handleCancelSearch, createQuery, setSeparator } = useSearchForm();

  const searchField = ref(null);
  const badgesContainer = ref(null);

  const chipsList = createQuery([]);
  setSeparator(';');

  const query = ref('');
  const autocomplete = ref('');
  const badgesContainerWidth = ref('15px')

  const handleAutocompleteQuery = () => {
    query.value += autocomplete.value;
    autocomplete.value = '';
    searchField.value.focus();
  }

  /**
   * @param {KeyboardEvent} e
   */
  const handleMouseUp = (e) => {
    if (e.keyCode === 13) {
      if (e.ctrlKey && e.altKey) {
        handleAutocompleteQuery();
      } else {
        if (query.value !== '') {
          if (chipsList.value.indexOf(query.value) === -1) {
            chipsList.value.push(query.value);
            autocomplete.value = '';
            query.value = '';
          }
        }
      }

      handleSearch();
    }
  };

  const handleInput = (e) => {
    if (query.value === '') {
      autocomplete.value = '';
    } else {
      if (
          (e.inputType === 'insertText' && Object.keys(e.data.customMatch(/(\w|-)/g)).length > 0)
          || e.inputType === 'deleteContentBackward'
      ) {
        autocomplete.value = String.splice(
            [
              ...store.getters.types,
              ...store.getters.environments,
              ...Object.keys(store.getters.jdds)
                  .reduce((r, c) => [
                    ...r,
                    ...store.getters.jdds[c]
                        .reduce((_r, jdd) => r.indexOf(jdd.case) === -1 && _r.indexOf(jdd.case) === -1 ? [..._r, jdd.case] : _r, [])
                  ], [])
            ].reduce((r, c) => r === '' && Object.keys(c.customMatch(new RegExp(`^(${query.value}).+`, 'g'))).length > 0
                ? c : r, ''), 0, query.value.length);
      }
    }

    handleSearch();
  }

  /**
   * @param {number} i
   */
  const handleRemoveChip = (i) => {
    chipsList.value.splice(i, 1);

    handleSearch();
  };

  const formTop = computed(() => guest.value ? '41px' : '7px');

  watch(() => chipsList.value.length, () => {
    setTimeout(() => {
      badgesContainerWidth.value = badgesContainer.value.offsetWidth + 5 + 'px';
    }, 500);

  })
</script>

<style lang="scss" scoped>
form {
  position: relative;
  top: v-bind(formTop);

  span {
    &.autocomplete {
      color: lightgray;
      cursor: pointer;
      position: absolute;
      height: 40px;
      padding-right: 15px;
      padding-top: 10px;
      padding-bottom: 5px;
      margin-left: v-bind(badgesContainerWidth);
      right: 10px;
      left: 10px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      .query {
        color: transparent;
      }
    }
  }

  .btn-close {
    width: 55px;
    height: 40px;
    color: #FC7902;

    &:hover {
      border: none;
    }
  }

  .badges-container {
    padding-right: 10px;

    .badge {
      a {
        &:hover, &:focus, &:active {
          color: black !important;
        }

        .fas {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
