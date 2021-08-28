<template>
    <div class="container">
        <h1>Ajout d'un jdd</h1>

        <form class="row" @submit.prevent.stop="submit">
          <div class="col-12 mt-2">
            <h2>Environement</h2>

            <div class="row">
              <div class="col" v-for="(envName, i) of store.getters.environments" :key="i">
                <div class="form-check form-switch">
                  <input type="radio" class="form-check-input" name="env" :id="`${envName}-env-radio`"
                         :value="envName" v-model="env" :checked="env === envName">

                  <label class="form-check-label" :for="`${envName}-env-radio`">
                    {{ envName.toUpperCase() }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 mt-2">
            <h2>Type</h2>

            <div class="row">
              <div class="col" v-for="(typeName, i) of store.getters.types" :key="i">
                <div class="form-check form-switch">
                  <input type="radio" class="form-check-input" name="type" :id="`${typeName}-type-radio`"
                         :value="typeName" v-model="type" :checked="type === typeName">

                  <label class="form-check-label" :for="`${typeName}-type-radio`">
                    {{ typeName.toUpperCase() }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 mt-2">
              <textarea id="case" class="form-control" v-model="useCase"
                        placeholder="Cas d'utilisation" required></textarea>
          </div>

          <div class="col-12 mt-2">
              <input id="phone" class="form-control" type="tel" maxlength="10" v-model="nd"
                     placeholder="ND: 07........" :required="ndRequired" />
          </div>

          <div class="col-12 mt-2">
              <input id="email" class="form-control" type="email" v-model="email"
                     placeholder="Email: test@test.fr" :required="emailRequired"
                     @change="handleEmailPasswordChange" />
          </div>

          <div class="col-12 mt-2 input-group">
              <input id="password" class="form-control" :type="passwordType" v-model="password"
                     :placeholder="passwordPlaceholder" :required="passwordRequired"
                     @change="handleEmailPasswordChange" />

              <button type="button" class="btn btn-dark input-group-text"
                      @click.prevent.stop="togglePassword">
                  {{ passwordShowButtonValue }}
              </button>
          </div>

          <div class="col-12 mt-2 text-start">
            <button type="submit" class="btn btn-dark">Valider</button>
          </div>
        </form>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import { useStore } from 'vuex';

    const store = useStore();

    const [ nd, email, useCase,
      password, passwordType, passwordShowButtonValue,
      env, type, emailRequired,
      passwordRequired, ndRequired ] = [
      ref(''), ref(''), ref(''),
      ref(''), ref('password'), ref('show'),
      ref('dev'), ref('rtc'), ref(true),
      ref(true), ref(true),
    ];

    const passwordPlaceholder = computed(() => `Mot de pass associé à ${email.value || `l'email ci-dessus`}`)

    const togglePassword = () => {
        passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
        passwordShowButtonValue.value = passwordShowButtonValue.value === 'show' ? 'hide' : 'show';
    }

    const submit = () => {
      const payload = {
        env: env.value,
        jdd: {
          type: type.value.toUpperCase(),
          case: useCase.value
        }
      };

      if (nd.value !== '' && (email.value === '' || password.value === '')) {
        payload.jdd.nd = nd.value;
      } else if (email.value !== '' && password.value !== '' && nd.value === '') {
        payload.jdd.email = email.value;
        payload.jdd.password = password.value;
      } else if (nd.value !== '' && email.value !== '' && password.value !== '') {
        payload.jdd.email = email.value;
        payload.jdd.password = password.value;
        payload.jdd.nd = nd.value;
      }

      store.commit('addJdd', payload);
    }

    const handleEmailPasswordChange = () => {
      emailRequired.value = password.value !== '';
      passwordRequired.value = password.value !== '';
      ndRequired.value = password.value === '' && email.value === '';
    }

</script>

<style scoped>
  .form-check-input[type="radio"] {
    border-radius: 0;
  }
  textarea {
    min-height: 100px;
  }
</style>