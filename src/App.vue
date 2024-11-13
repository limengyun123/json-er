<template>
  <div class="wrapper">
    <!-- <div class="head">
      <div class="logo"></div>
      <h2 style="margin-bottom: 0; color: #fff">可视化JSON</h2>
    </div> -->
    <div class="body">
      <div class="input-wrapper">
        <json-form ref="jsonInputRef" @change="onDataUpdated" />
      </div>
      <div class="graph-wrapper">
        <div id="graph-container" style="width: 1400px; height: 1000px"></div>
      </div>
    </div>
  </div>
  <edit-modal ref="editModalRef" @ok="onEditOk" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { isUndefined } from "lodash";
import JsonForm from "./components/input/json-input.vue";
import EditModal from "./components/edit/index.vue";
import { GraphView } from "./components/graph/graph";

let graphManager: GraphView | undefined;

/********************************* for inputting json *********************************/
let jsonValue: Object | undefined;
const jsonInputRef = ref();

function updateInputValue(newV: string) {
  jsonInputRef.value?.updateValue(newV);
}
function onDataUpdated(newV: Object | undefined) {
  jsonValue = newV;
  if (!isUndefined(jsonValue)) graphManager?.update(jsonValue);
}

onMounted(() => {
  const container = document.getElementById("graph-container") as HTMLElement;
  graphManager = new GraphView(container, { editValue });
  onDataUpdated(jsonValue);
});
onUnmounted(() => {
  graphManager && graphManager.destroy();
});

/********************************* for editing value *********************************/
const editModalRef = ref();
let parentsData: (string | number)[] = [];
function editValue(params: { parents: (string | number)[]; data: Object }) {
  parentsData = params.parents;
  editModalRef.value?.openModal(params.data);
}

function onEditOk(data: any) {
  if (!parentsData.length) jsonValue = data;
  else {
    let target: any = jsonValue;
    for (let i = 0; i < parentsData.length - 2; i++) {
      target.value = target[parentsData[i]];
    }
    target[parentsData[parentsData.length - 1]] = data;
  }
  updateInputValue(JSON.stringify(jsonValue));
}
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;

  // .head {
  //   flex: 0 0 64px;
  //   background-color: #87cefa;
  //   // background-color: #6495ed;
  //   display: flex;
  //   align-items: center;
  //   padding: 0 16px;
  //   color: #fff;
  //   border-bottom: 1px solid #eee;

  //   .logo {
  //     width: 32px;
  //     height: 32px;
  //     background-image: url("logo-bg.svg");
  //     background-size: 32px;
  //     margin-right: 16px;
  //   }
  // }

  .body {
    flex: 1;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    align-items: stretch;

    .input-wrapper {
      flex: 0 0 300px;
      padding: 16px;
      box-shadow: 1px 0px 8px rgba(0, 0, 0, 0.3);
    }

    .graph-wrapper {
      flex: 1;
      overflow: hidden;
    }
  }
}
</style>
