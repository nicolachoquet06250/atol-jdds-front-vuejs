import {computed, reactive, ref} from "vue";

const userIsConnected = ref(false);
const user = reactive({
    project: 'ATOL',
    firstname: 'Nicolas',
    lastname: 'Choquet',
    fullname: computed(() => user.firstname + ' ' + user.lastname),
    email: 'nicolas.choquet.ext@orange.com',
    nd: '0763207630'
});

export const useGuest = () => ({
    guest: computed(() => userIsConnected.value ? user : false),

    signin() {
        userIsConnected.value = true;
    },

    signout() {
        userIsConnected.value = false;
    }
});