import { createStore } from 'vuex';

import { defaultData, types, environments, customMatch, stringSplice, getTextWidth, searchByFlags, searchByEnvs, searchByAll } from './annexes';

/**
 * @param {RegExp} regex
 */
String.prototype.customMatch = customMatch;
String.prototype.getWidth = getTextWidth;
String.splice = stringSplice;

export default createStore({
  state: {
    jdds: {...defaultData},
    searchJdds: {...defaultData},
    environments,
    types,
  },
  mutations: {
    addJdd(state, { env, jdd }) {
      state.jdds = {
        ...state.jdds,
        [env]: [
          ...state.jdds[env] || [],
          jdd
        ]
      }

      state.searchJdds = {
        ...state.searchJdds,
        [env]: [
          ...state.searchJdds[env] || [],
          jdd
        ]
      }
    },
    delJdd(state, { env, id }) {
      state.jdds[env] = this.getters.saveJdds[env].reduce((r, c) => c.id !== id ? [...r, c] : r, []);
      state.searchJdds[env] = this.getters.jdds[env].reduce((r, c) => c.id !== id ? [...r, c] : r, []);
    },
    updateJdd(state, { env, oldEnv, jdd }) {
      const id = jdd.id;

      if (env !== oldEnv) {
        // original jdd array
        state.jdds[env] = state.jdds[env].reduce((r, c) => JSON.stringify(c) !== jdd.id ? [...r, c] : r, []);
        delete jdd.id;

        state.jdds = {
          ...state.jdds,
          [env]: [
            ...state.jdds[env],
            jdd
          ]
        }

        // search jdd array
        jdd.id = id;
        state.searchJdds[env] = state.searchJdds[env].reduce((r, c) => JSON.stringify(c) !== jdd.id ? [...r, c] : r, []);
        delete jdd.id;

        state.searchJdds = {
          ...state.searchJdds,
          [env]: [
            ...state.searchJdds[env],
            jdd
          ]
        }
      } else {
        // original jdd array
        this.getters.saveJdds[env].map((_jdd, i) => {
          if (_jdd.id === jdd.id) {
            delete jdd.id;
            state.jdds[env][i] = jdd;
          }
        });

        jdd.id = id;
        // search jdd array
        this.getters.jdds[env].map((_jdd, i) => {
          if (_jdd.id === jdd.id) {
            delete jdd.id;
            state.searchJdds[env][i] = jdd;
          }
        });
      }
    },
    addEnvironment(state, env) {
      if (state.environments.indexOf(env) === -1) {
        state.environments.push(env);
        state.jdds[env] = [];
      }
    },
    addType(state, type) {
      if (state.types.indexOf(type) === -1) {
        state.types.push(type);
      }
    },
    search(state, { from, query }) {
      if (from === 'flags') searchByFlags({ state, getters: this.getters }, query);
      else if (from === 'envs') searchByEnvs({ state, getters: this.getters }, query);
      else if (from === 'both') searchByAll({ state, getters: this.getters }, query);
    },
    cancelSearch(state) {
      state.searchJdds = state.jdds;
    },
    deleteType(state, { type }) {
      state.searchJdds = Object.keys(state.searchJdds).reduce((r, c) => {
        return {
          ...r,
          [c]: state.searchJdds[c].reduce((_r, _c) => _c.type === type ? _r : [..._r, _c], [])
        }
      }, {});
      state.jdds = Object.keys(state.jdds).reduce((r, c) => {
        return {
          ...r,
          [c]: state.jdds[c].reduce((_r, _c) => _c.type === type ? _r : [..._r, _c], [])
        }
      }, {});
      state.types = state.types.reduce((r, c) => c !== type ? [...r, c] : r, []);
    },
    deleteEnv(state, env) {
      delete state.searchJdds[env];
      delete state.jdds[env];
      state.environments = state.environments.reduce((r, c) => c !== env ? [...r, c] : r, []);
    }
  },
  actions: {},
  getters: {
    jdds: state => Object.keys(state.searchJdds)
        .reduce((r, c, i) => ({
          ...r,
          [c]: state.searchJdds[c]
              .map(jdd => ({
                ...jdd,
                case: jdd.case.replace(/\n/g, '<br />'),
                id: i + '-' + JSON.stringify(jdd)
              }))
        }), {}),
    saveJdds: state => Object.keys(state.jdds)
        .reduce((r, c, i) => ({
          ...r,
          [c]: state.jdds[c]
              .map(jdd => ({
                ...jdd,
                case: jdd.case.replace(/\n/g, '<br />'),
                id: i + '-' + JSON.stringify(jdd)
              }))
        }), {}),
    environments: state => state.environments,
    types: state => state.types
  },
  modules: {}
})
