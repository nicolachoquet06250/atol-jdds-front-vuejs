import { useStore } from "vuex";
import { computed, ref } from "vue";

/**
 * @returns {{searchFromFlags: Function}}
 */
export const useSearch = () => {
    const store = useStore();
    /**
     * @param {String} query
     */
    const searchFromFlags = (query) => {
        store.commit('cancelSearch');
        if (query === '') {
            query = store.getters.types.join(';');
        }
        store.commit('search', { from: 'flags', query });
        return store.getters.jdds;
    };

    /**
     * @param {String} query
     */
    const searchFromEnvs = (query) => {
        store.commit('cancelSearch');
        if (query === '') {
            query = store.getters.environments.join(';');
        }
        store.commit('search', { from: 'envs', query });
        return store.getters.jdds;
    };

    /**
     * @param {String} query
     */
    const searchFromFlagsAndEnvs = (query) => {
        store.commit('cancelSearch');
        if (query === '') {
            query = [...store.getters.environments, ...store.getters.types].join(';');
        }
        store.commit('search', { from: 'both', query });
        return store.getters.jdds;
    };

    return {
        searchFromFlags,
        searchFromEnvs,
        searchFromFlagsAndEnvs
    };
};

export const useSearchForm = () => {
    let query;
    let separator;
    const setQuery = (_query) => query = _query;
    const setSeparator = (_separator) => separator = _separator;

    /**
     * @param {String|Array} defaultValue
     * @returns {*}
     */
    const createQuery = (defaultValue = '') => {
        setQuery(ref(defaultValue));
        return query;
    }

    const { searchFromFlagsAndEnvs } = useSearch();

    const searchCanceled = ref(true);

    const handleSearch = () => {
        let __query = query.value;
        if (typeof query.value === 'object' && Array.isArray(query.value)) {
            __query = query.value.join(separator);
        }

        searchFromFlagsAndEnvs(__query);
        searchCanceled.value = __query === '';
    };

    const handleCancelSearch = () => {
        if (typeof query.value === 'object' && Array.isArray(query.value)) {
            query.value = [];
        } else if (typeof query.value === 'object' && !Array.isArray(query.value)) {
            query.value = {};
        } else {
            query.value = '';
        }

        handleSearch();
    };

    return {
        searchCanceled: computed(() => searchCanceled.value),

        setQuery,
        setSeparator,
        createQuery,
        handleSearch,
        handleCancelSearch
    }
}