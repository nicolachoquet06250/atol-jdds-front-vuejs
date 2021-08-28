import { computed, ref } from "vue";

const scrollable = ref(true);

export const useScrollable = () => {
    return {
        scrollable: computed(() => scrollable.value),

        /**
         * @param {Boolean} v
         */
        setScrollable(v) {
            scrollable.value = v;
        }
    }
};