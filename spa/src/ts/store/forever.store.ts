import { AxiosResponse, default as Axios } from "axios";
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";

import { ForeverDTO, ForeverEndDTO, ForeverStartDTO, IForeverDTO, IForeverJSON, IInstancesJSON, InstancesDTO } from "../../../../shared/dto";
import { IAppState } from "./app.store";

export interface IForeverState { } // tslint:disable-line:no-empty-interface

export type foreverIndexAction = () => Promise<ForeverDTO[]>;
export type foreverStartAction = (foreverStart: ForeverStartDTO) => Promise<void>;
export type foreverEndAction = (foreverEnd: ForeverEndDTO) => Promise<void>;
export type foreverInstancesAction = () => Promise<InstancesDTO[]>;

export const foreverStore: Module<IForeverState, IAppState> = {
  namespaced: true,
  actions: {
    index: ({ dispatch }): Promise<ForeverDTO[]> => {
      return new Promise((resolve, reject) => {
        Axios.get<IForeverJSON[]>("/forever").then((response: AxiosResponse<IForeverJSON[]>) => {
          resolve(response.data.map((forever: IForeverJSON) => ForeverDTO.parse(forever)));
        }).catch((error: any) => {
          dispatch("error/submit", { message: "forever index request failed", error }, { root: true });
          reject();
        });
      });
    },
    start: ({ dispatch }, foreverStart: ForeverStartDTO): Promise<void> => {
      return new Promise((resolve, reject) => {
        Axios.post("/forever", foreverStart.serialize()).then(() => {
          resolve();
        }).catch((error: any) => {
          dispatch("error/submit", { message: "forever start request failed", error }, { root: true });
          reject();
        });
      });
    },
    end: ({ dispatch }, foreverEnd: ForeverEndDTO): Promise<void> => {
      return new Promise((resolve, reject) => {
        Axios.put(`/forever/${foreverEnd.uid}`, foreverEnd.serialize()).then(() => {
          resolve();
        }).catch((error: any) => {
          dispatch("error/submit", { message: "forever end request failed", error }, { root: true });
          reject();
        });
      });
    },
    instances: ({ dispatch }): Promise<InstancesDTO[]> => {
      return new Promise((resolve, reject) => {
        Axios.get<IInstancesJSON[]>("/instances").then((response: AxiosResponse<IInstancesJSON[]>) => {
          resolve(response.data.map((forever: IInstancesJSON) => InstancesDTO.parse(forever)));
        }).catch((error: any) => {
          dispatch("error/submit", { message: "instance index request failed", error }, { root: true });
          reject();
        });
      });
    },
  } as ActionTree<IForeverState, IAppState>,
};
