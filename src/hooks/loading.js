import { ref, computed } from "vue";

const loading = ref(false);

export const useLoading = () => {
    return {
        loading: computed(() => loading.value),

        setLoading(v) {
            loading.value = v;
        }
    }
};