<template>
  <div class="container">
    <h1>JDDs</h1>

    <InfoAlert :open="infoAlert" @close="handleCloseInfoAlert">
      <ul v-if="!isMobile && !isTablet">
        <li>{{ mobileMessages[0] }}</li>

        <li>
          <p>{{ mobileMessages[1] }}</p>

          <ul>
            <li>{{ mobileMessages[2][0] }}</li>

            <li>{{ mobileMessages[2][1] }}</li>
          </ul>
        </li>
      </ul>

      <span v-else>{{ desktopMessage }}</span>
    </InfoAlert>

    <tabs>
      <template v-if="store.getters.environments.length > 0">
        <tab v-for="(tabEnv, i) of store.getters.environments" :key="i"
             @click="switchEnv(tabEnv)" @contextmenu="handleContextMenu($event, { environment: tabEnv })"
            :active="activeEnvTab === tabEnv">
          {{ tabEnv.toUpperCase() }} ({{ (store.getters.jdds[tabEnv] || []).length }})
        </tab>
      </template>

      <tab :link="false">
        <button type="button" class="btn btn-icon btn-secondary mx-2"
                data-bs-toggle="modal" data-bs-target="#modal-add-env"
                style="padding-bottom: calc(1px + 0.3rem); padding-top: calc(1px + 0.3rem);">
          <i class="fas fa-plus"></i>

          <span class="mx-1">Créer un environement</span>
        </button>
      </tab>

      <template v-slot:content>
        <div v-for="(envTabContent, i) of store.getters.environments" :key="i"
             :class="{'tab-content': true, active: activeEnvTab === envTabContent}">
          <tabs-light>
            <template v-if="store.getters.types.length > 0">
              <tab v-for="(typeTabName, j) of store.getters.types" :key="j"
                   :active="activeTypeTab === typeTabName.toUpperCase()"
                   :disabled="tabIsDisabled(envTabContent, typeTabName)"
                   :tabindex="getTabindex(envTabContent, typeTabName)"
                   @click="switchTypeTab(typeTabName)"
                   @contextmenu="handleContextMenu($event, { environment: envTabContent, type: typeTabName })">
                {{ typeTabName.toUpperCase() }} ({{ getFromEnvAndType(envTabContent, typeTabName).length }})
              </tab>
            </template>

            <tab :link="false">
              <button type="button" class="btn btn-icon btn-secondary" data-bs-toggle="modal"
                      :data-bs-target="`#modal-add-jdd-${envTabContent}`" @click="handleAddType">
                <i class="fas fa-plus"></i>
              </button>

              <button type="button" class="btn btn-icon btn-secondary mx-2"
                      data-bs-toggle="modal" data-bs-target="#modal-add-type"
                      style="padding-bottom: calc(1px + 0.3rem); padding-top: calc(1px + 0.3rem);">
                <i class="fas fa-plus"></i>

                <span class="mx-1">Créer un type</span>
              </button>
            </tab>

            <template v-slot:content v-if="store.getters.types.length > 0">
              <div :class="{'tab-content': true, active: activeTypeTab === typeTabContent.toUpperCase()}"
                   v-for="(typeTabContent, j) of store.getters.types" :key="j">
                <div v-for="(jdd, k) of getFromEnvAndType(envTabContent, typeTabContent)" :key="k" class="mb-4">
                  <div class="d-flex flex-row">
                    <div class="d-flex flex-column flex-1">
                      <div class="row">
                        <div class="col-4"><strong>Cas d'utilisation</strong></div>
                        <div class="col-8"><span v-html="jdd.case"></span></div>
                      </div>

                      <div class="row">
                        <div class="col-4"><strong>ND</strong></div>
                        <div class="col-8">{{ jdd.nd || ' // ' }}</div>
                      </div>

                      <div class="row">
                        <div class="col-4"><strong>Email</strong></div>
                        <div class="col-8">{{ jdd.email || ' // ' }}</div>
                      </div>

                      <div class="row">
                        <div class="col-4"><strong>Mot de passe</strong></div>
                        <div class="col-8">{{ jdd.password || ' // ' }}</div>
                      </div>
                    </div>

                    <div class="d-flex justify-content-center align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-update-jdd"
                                @click="handleUpdate({ env: envTabContent, id: jdd.id })">Modifier</button>

                        <button type="button" class="btn btn-danger"
                                @click.prevent.stop="handleDelete({ env: envTabContent, id: jdd.id })">Supprimer</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-4" v-if="getFromEnvAndType(envTabContent, typeTabContent).length === 0">
                  Aucun JDD de {{ envTabContent.toUpperCase() }} en {{ typeTabContent.toUpperCase() }}
                </div>
              </div>
            </template>
          </tabs-light>
        </div>
      </template>
    </tabs>

    <modal :id="`modal-add-jdd-${envTabContent}`" @cancel="resetModal" @validate="submit" v-for="(envTabContent, i) of store.getters.environments" :key="i">
      <template v-slot:title>
        <h5 class="modal-title">Créer un JDD de {{ envTabContent.toUpperCase() }}</h5>
      </template>

      <template v-slot:body>
        <form class="row" @submit.prevent.stop="submit">
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
            <button type="submit" class="btn btn-dark">Valider et continuer</button>
          </div>
        </form>
      </template>
    </modal>

    <modal id="modal-update-jdd" @cancel="resetModalUpdate" @validate="updateJdd">
      <template v-slot:title>
        <h5 class="modal-title">Modifier un JDD</h5>
      </template>

      <template v-slot:body>
        <form class="row" @submit.prevent.stop="updateJdd">
          <div class="col-12 mt-2">
            <h2>Environement</h2>

            <div class="row">
              <div class="col" v-for="(envName, i) of store.getters.environments" :key="i">
                <div class="form-check form-switch">
                  <input type="radio" class="form-check-input" name="env" :id="`${envName}-env-radio`"
                         :value="envName" v-model="updatedEnv" :checked="updatedEnv === envName">

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
                         :value="typeName" v-model="updatedType" :checked="updatedType === typeName.toUpperCase()">

                  <label class="form-check-label" :for="`${typeName}-type-radio`">
                    {{ typeName.toUpperCase() }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 mt-2">
                <textarea id="updated-case" class="form-control" v-model="updatedUseCase"
                          placeholder="Cas d'utilisation" required></textarea>
          </div>

          <div class="col-12 mt-2">
            <input id="updated-phone" class="form-control" type="tel" maxlength="10" v-model="updatedNd"
                   placeholder="ND: 07........" :required="updatedNdRequired" />
          </div>

          <div class="col-12 mt-2">
            <input id="updated-email" class="form-control" type="email" v-model="updatedEmail"
                   placeholder="Email: test@test.fr" :required="updatedEmailRequired"
                   @change="handleUpdatedEmailPasswordChange" />
          </div>

          <div class="col-12 mt-2 input-group">
            <input id="updated-password" class="form-control" :type="updatedPasswordType" v-model="updatedPassword"
                   :placeholder="updatedPasswordPlaceholder" :required="updatedPasswordRequired"
                   @change="handleUpdatedEmailPasswordChange" />

            <button type="button" class="btn btn-dark input-group-text"
                    @click.prevent.stop="toggleUpdatedPassword">
              {{ updatedPasswordShowButtonValue }}
            </button>
          </div>

          <div class="col-12 mt-2 text-start">
            <button type="submit" class="btn btn-dark">Valider et continuer</button>
          </div>
        </form>
      </template>
    </modal>

    <modal id="modal-add-env" @cancel="resetEnvModal" @validate="addEnv">
      <template v-slot:title>
        <h5 class="modal-title">Modifier un JDD</h5>
      </template>

      <template v-slot:body>
        <form class="row">
          <div class="col-12 mt-2">
            <input id="added-env" class="form-control" type="text" v-model="addedEnv" placeholder="Environement" required />
          </div>
        </form>
      </template>
    </modal>

    <modal id="modal-add-type" @cancel="resetTypeModal" @validate="addType">
      <template v-slot:title>
        <h5 class="modal-title">Modifier un JDD</h5>
      </template>

      <template v-slot:body>
        <form class="row">
          <div class="col-12 mt-2">
            <input id="added-type" class="form-control" type="text" v-model="addedType" placeholder="Type de JDD" required />
          </div>
        </form>
      </template>
    </modal>
  </div>

  <context-menu-links :open="openContextMenu" :coordinate="contextMenuCoordinate" @close="setScrollable(true); openContextMenu = false">
    <context-menu-item-link @click="handleDeleteClick">
      Supprimer
    </context-menu-item-link>
  </context-menu-links>
</template>

<script setup>
  import ContextMenuLinks from '../components/context-menus/ContextMenu.vue';
  import ContextMenuItemLink from '../components/context-menus/ContextMenuItemLink.vue';
  import InfoAlert from '../components/alerts/InfoAlert.vue';
  import Modal from '../components/Modal.vue';
  import Tabs from '../components/tabs/Tabs.vue';
  import TabsLight from '../components/tabs/TabsLight.vue';
  import Tab from '../components/tabs/Tab.vue';

  import { computed, reactive, ref, watch } from 'vue';
  import { useStore } from 'vuex';
  import { isTablet, isMobile } from 'mobile-device-detect';
  import { useScrollable } from '../hooks';

  const store = useStore();

  const { setScrollable } = useScrollable();

  const mobileMessages = [
      'Faites un appuie long sur un onglet puis cliquez sur "Supprimer" pour le supprimer',
      'Lors d\'une recherche, pour auto compléter :',
      [
          'Faites "Ctrl+Alt+Entré" pour compléter votre requête puis tapez sur "Entré" pour valider',
          'Double clickez sur le bout de mot grisé pour compléter votre requête puis tapez sur "Entré" pour valider'
      ]
  ];
  const desktopMessage = 'Faites un click droit sur un onglet puis cliquez sur "Supprimer" pour le supprimer';

  const [activeEnvTab, activeTypeTab] = [
    ref('dev'),
    ref('RTC')
  ];

  const isUpdated = ref(false);
  const openContextMenu = ref(false);

  const tabToDeleteWithContextMenu = reactive({
    environment: '',
    type: ''
  });

  const infoAlert = ref(localStorage.getItem('disableInfoAlert') === null);

  const handleCloseInfoAlert = () => {
    infoAlert.value = false;
    localStorage.setItem('disableInfoAlert', '1');
  };

  const handleDeleteClick = () => {
    openContextMenu.value = false;
    setScrollable(true);

    if (tabToDeleteWithContextMenu.environment.length > 0 && tabToDeleteWithContextMenu.type.length === 0) {
      store.commit('deleteEnv', tabToDeleteWithContextMenu.environment);
    } else {
      store.commit('deleteType', {
        env: tabToDeleteWithContextMenu.environment,
        type: tabToDeleteWithContextMenu.type
      });
    }
  };

  const contextMenuCoordinate = reactive({ x: 0, y: 0 });

  /**
   * @param {MouseEvent} e
   * @param {String} environment
   * @param {String} type
   */
  const handleContextMenu = (e, { environment, type }) => {
    tabToDeleteWithContextMenu.environment = environment;
    tabToDeleteWithContextMenu.type = type || '';
    contextMenuCoordinate.x = e.clientX;
    contextMenuCoordinate.y = e.clientY;
    setScrollable(false);
    openContextMenu.value = true
  }

  /**
   * @param {'dev'|'rec'|'preprod'|'prod'} env
   * @return {Array<{type: 'PRO'|'RES'|'RTC'|'SOSH', nd?: String, email?: String, case?: String}>}
   */
  const getFromEnv = (env) => store.getters.jdds[env] || [];

  /**
   * @param {Array<{type: 'PRO'|'RES'|'RTC'|'SOSH', nd?: String, email?: String, case?: String}>} envJdds
   * @param {'PRO'|'RES'|'RTC'|'SOSH'} type
   */
  const getFromType = (envJdds, type) => envJdds.reduce((r, c) => c.type === type ? [...r, c] : r, []);

  /**
   * @param {'dev'|'rec'|'preprod'|'prod'} env
   * @param {'rtc'|'res'|'pro'|'sosh'} type
   */
  const getFromEnvAndType = (env, type) => getFromType(getFromEnv(env), type.toUpperCase());

  /**
   * @param {'dev'|'rec'|'preprod'|'prod'} _env
   */
  const switchEnvTab = (_env) => {
    if (_env !== activeEnvTab.value) {
      activeEnvTab.value = _env;
      env.value = _env.toLowerCase();
    }
  }

  /**
   * @param {'pro'|'res'|'rtc'|'sosh'} _type
   */
  const switchTypeTab = (_type) => {
    if (_type !== activeTypeTab.value) {
      activeTypeTab.value = _type.toUpperCase();
      type.value = _type;
    }
  };

  /**
   * @param {'dev'|'rec'|'preprod'|'prod'} env
   */
  const getFirstTabWithContent = (env) => store.getters.types.reduce((r, c) => r === '' && getFromType(getFromEnv(env), c.toUpperCase()).length > 0 ? c.toUpperCase() : r, '') || (store.getters.types[0] ? store.getters.types[0].toUpperCase() : null);

  /**
   * @param {{env: 'dev'|'rec'|'preprod'|'prod', id: String}}
   */
  const handleDelete = ({ env, id }) => store.commit('delJdd', { env, id });

  /**
   * @param {'dev'|'rec'|'preprod'|'prod'} env
   */
  const switchEnv = (env) => {
    const firstTab = getFirstTabWithContent(env);
    if (firstTab) {
      switchTypeTab(firstTab);
    }
    switchEnvTab(env);
  };

  /**
   * @param {'dev'|'rec'|'preprod'|'prod'} env
   * @param {'rtc'|'res'|'pro'|'sosh'} type
   */
  const tabIsDisabled = (env, type) => getFromType(getFromEnv(env), type.toUpperCase()).length === 0;

  /**
   * @param {'dev'|'rec'|'preprod'|'prod'} env
   * @param {'rtc'|'res'|'pro'|'sosh'} type
   */
  const getTabindex = (env, type) => getFromType(getFromEnv(env), type.toUpperCase()).length === 0 ? true : false;

  const addedType = ref('');
  const addedEnv = ref('');

  const addType = () => {
    store.commit('addType', addedType.value);
    resetTypeModal();
  };

  const addEnv = () => {
    store.commit('addEnvironment', addedEnv.value);
    resetEnvModal();
  };

  const resetEnvModal = () => {
    addEnv.value = '';
  };

  const resetTypeModal = () => {
    addedType.value = '';
  };

  const handleAddType = () => {
    type.value = activeTypeTab.value.toLowerCase();
  };

  watch(() => store.getters.jdds, () => {
    if (isUpdated.value) {
      switchTypeTab(activeTypeTab.value);
      isUpdated.value = false;
    } else {
      const firstTab = getFirstTabWithContent(activeEnvTab.value);
      if (firstTab) {
        switchTypeTab(firstTab);
      }
    }
  });

  /** ************************************************************************* **/
  /** * PARTIE MODAL DE CREATION DE JDDs ************************************** **/
  /** ************************************************************************* **/

  const [ nd, email, useCase,
    password, passwordType, passwordShowButtonValue,
    env, type, emailRequired,
    passwordRequired, ndRequired ] = [
      ref(''), ref(''), ref(''),
      ref(''), ref('password'), ref('show'),
      ref('dev'), ref('rtc'), ref(true),
      ref(true), ref(true),
    ];

  const [ updatedNd, updatedEmail, updatedUseCase,
    updatedPassword, updatedPasswordType, updatedPasswordShowButtonValue,
    updatedEnv, oldEnv, updatedType, updatedEmailRequired,
    updatedPasswordRequired, updatedNdRequired, updatedJddId ] = [
      ref(''), ref(''), ref(''),
      ref(''), ref('password'), ref('show'),
      ref('dev'), ref('dev'), ref('rtc'), ref(true),
      ref(true), ref(true), ref('')
    ];

  const passwordPlaceholder = computed(() => `Mot de pass associé à ${email.value || `l'email ci-dessus`}`)

  const updatedPasswordPlaceholder = computed(() => `Mot de pass associé à ${email.value || `l'email ci-dessus`}`)

  const togglePassword = () => {
    passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
    passwordShowButtonValue.value = passwordShowButtonValue.value === 'show' ? 'hide' : 'show';
  }

  const toggleUpdatedPassword = () => {
    updatedPasswordType.value = updatedPasswordType.value === 'password' ? 'text' : 'password';
    updatedPasswordShowButtonValue.value = updatedPasswordShowButtonValue.value === 'show' ? 'hide' : 'show';
  }

  const resetModal = () => {
    [ nd.value, email.value, useCase.value,
      password.value, passwordType.value, passwordShowButtonValue.value,
      emailRequired.value, passwordRequired.value, ndRequired.value ] = [
      '', '', '',
      '', 'password', 'show',
      true, true, true,
    ];
  }

  const resetModalUpdate = () => {
    [ updatedNd.value, updatedEmail.value, updatedUseCase.value,
      updatedPassword.value, updatedPasswordType.value, updatedPasswordRequired.value,
      updatedEnv.value, updatedType.value, updatedEmailRequired.value,
      updatedPasswordRequired.value, updatedNdRequired.value ] = [
      '', '', '',
      '', 'password', 'show',
      'dev', 'rtc', true,
      true, true,
    ];
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

    resetModal();
  }

  const updateJdd = () => {
    const payload = {
      env: updatedEnv.value,
      oldEnv: oldEnv.value,
      jdd: {
        type: updatedType.value.toUpperCase(),
        case: updatedUseCase.value
      }
    };

    if (updatedNd.value !== '' && (updatedEmail.value === '' || updatedPassword.value === '')) {
      payload.jdd.nd = updatedNd.value;
    } else if (updatedEmail.value !== '' && updatedPassword.value !== '' && updatedNd.value === '') {
      payload.jdd.email = updatedEmail.value;
      payload.jdd.password = updatedPassword.value;
    } else if (updatedNd.value !== '' && updatedNd.value !== '' && updatedPassword.value !== '') {
      payload.jdd.email = updatedEmail.value;
      payload.jdd.password = updatedPassword.value;
      payload.jdd.nd = updatedNd.value;
    }
    payload.jdd.id = updatedJddId.value;

    isUpdated.value = true;

    store.commit('updateJdd', payload);

    resetModalUpdate();
  }

  const handleEmailPasswordChange = () => {
    emailRequired.value = password.value !== '';
    passwordRequired.value = password.value !== '';
    ndRequired.value = password.value === '' && email.value === '';
  }

  const handleUpdatedEmailPasswordChange = () => {
    updatedEmailRequired.value = updatedPassword.value !== '';
    updatedPasswordRequired.value = updatedPassword.value !== '';
    updatedNdRequired.value = updatedPassword.value === '' && updatedEmail.value === '';
  }

  const handleUpdate = ({ env, id }) => {
    updatedJddId.value = id;
    const jdd = JSON.parse('{' + id.split('-{')[1]);

    [ updatedNd.value, updatedEmail.value, updatedUseCase.value,
      updatedPassword.value, updatedPasswordType.value, updatedPasswordShowButtonValue.value,
      updatedEnv.value, oldEnv.value, updatedType.value, updatedEmailRequired.value,
      updatedPasswordRequired.value, updatedNdRequired.value ] = [
      jdd.nd || '', jdd.email || '', jdd.case,
      jdd.password || '', 'password', 'show',
      env, env, jdd.type, true,
      true, true,
    ];

    handleUpdatedEmailPasswordChange();
  };
</script>

<style lang="scss" scoped>
  .container {
    margin-top: 45px;

    .tab-content {
      display: none;

      .tab-content {
        border: none;
      }

      &.active {
        display: block;
      }
    }

    .flex-1 {
      flex: 1;
    }

    .form-check-input[type="radio"] {
      border-radius: 0;
    }

    textarea {
      min-height: 100px;
    }
  }

</style>