import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import createPersistedState from "vuex-persistedstate";

import { apiStore } from "./api.store";
import { authStore } from "./auth.store";
import { errorStore } from "./error.store";

const MODULES = {
  api: apiStore,
  auth: authStore,
  error: errorStore,
};

export interface IAppState { }

Vue.use(Vuex);

export const appStore = new Vuex.Store<IAppState>({
  modules: { ...MODULES },
  plugins: [createPersistedState()],
  state: {},
});