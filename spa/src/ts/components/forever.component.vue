<template>
  <div>
    <div class="row">
      <div class="col">
        <h1>Forever</h1>
      </div>
    </div>
    <div class="row d-flex justify-content-center">
      <div class="col-5">
        <form v-on:submit.prevent="start(command)">
          <div class="form-group">
            <label>Start with command</label>
            <div class="input-group">
              <input type="text" class="form-control" placeholder="command" v-model="command">
              <div class="input-group-append">
                <button class="btn btn-primary" type="submit">Start</button>
              </div>
            </div>
          </div>
        </form>
        <form v-on:submit.prevent="startInstance(instance)">
          <div class="form-group">
            <label>Start from instance</label>
            <div class="input-group">
              <select class="custom-select" v-model="instance">
                <option
                  v-for="(instance, index) in instances"
                  v-bind:key="index"
                  :value="instance"
                >{{ instance.project }}</option>
              </select>
              <div class="input-group-append">
                <button class="btn btn-primary" type="submit">Start</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>UID</th>
              <th>Uptime</th>
              <th>Process</th>
              <th>Command</th>
              <th>Forever ID</th>
              <th>PID</th>
              <th>Stop</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="forever in forever" v-bind:key="forever.id">
              <td>{{ forever.uid }}</td>
              <td>{{ forever.uptime }}</td>
              <td>{{ forever.command }}</td>
              <td>{{ forever.script }}</td>
              <td>{{ forever.fid }}</td>
              <td>{{ forever.pid }}</td>
              <td>
                <button class="btn btn-danger btn-sm" v-on:click.prevent="end(forever)">Stop</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State, Action, Getter } from "vuex-class";
import moment from "moment";
import {
  foreverIndexAction,
  foreverStartAction,
  foreverEndAction,
  foreverInstancesAction
} from "../store/forever.store";
import {
  ForeverDTO,
  IForeverDTO,
  ForeverEndDTO,
  ForeverStartDTO,
  InstancesDTO
} from "../../../../shared/dto";

export class ForeverViewModel extends ForeverDTO {
  public get uptime(): string {
    let now = moment();
    let start = moment(this.startTime);
    let duration = moment.duration(now.diff(start));

    let days = Math.round(duration.asDays());
    let hours = Math.round(duration.asSeconds()) % 24;
    let minutes = Math.round(duration.asMinutes()) % 60;
    let seconds = Math.round(duration.asSeconds()) % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s `;
  }
  public static parse(object: ForeverDTO): ForeverViewModel {
    return new ForeverViewModel({
      uid: object.uid,
      command: object.command,
      script: object.script,
      fid: object.fid,
      pid: object.pid,
      startTime: object.startTime
    });
  }
}

@Component
export default class ForeverComponent extends Vue {
  @Action("forever/index") foreverIndexAction: foreverIndexAction;
  @Action("forever/start") foreverStartAction: foreverStartAction;
  @Action("forever/end") foreverEndAction: foreverEndAction;
  @Action("forever/instances") foreverInstancesAction: foreverInstancesAction;

  public loading: boolean = false;
  public command: string =
    "/Users/hannes/Documents/dwik/repos/watch-forever/forever.js";
  public forever: ForeverViewModel[] = [];
  public instances: InstancesDTO[] = [];
  public instance: InstancesDTO | null = null;

  public mounted() {
    this.refresh();
  }

  public refresh() {
    this.loading = true;
    Promise.all([this.getForever(), this.getInstances()])
      .then(() => {
        this.loading = false;
      })
      .catch(() => (this.loading = false));
  }

  public getForever() {
    return new Promise((resolve, reject) => {
      this.foreverIndexAction()
        .then((forever: ForeverDTO[]) => {
          this.forever = forever.map((forever: ForeverDTO) =>
            ForeverViewModel.parse(forever)
          );
          resolve();
        })
        .catch(() => reject());
    });
  }

  public getInstances() {
    return new Promise((resolve, reject) => {
      this.foreverInstancesAction()
        .then((instances: InstancesDTO[]) => {
          this.instances = instances.map((instances: InstancesDTO) =>
            InstancesDTO.parse(instances.serialize())
          );
          resolve();
        })
        .catch(() => reject());
    });
  }

  public start(command: string) {
    this.foreverStartAction(
      ForeverStartDTO.parse({
        command
      })
    ).then(() => this.refresh());
  }

  public startInstance(instance: InstancesDTO) {
    this.start(instance.path);
  }

  public end(forever: ForeverViewModel) {
    this.foreverEndAction(
      ForeverEndDTO.parse({
        uid: forever.uid
      })
    ).then(() => this.refresh());
  }
}
</script>