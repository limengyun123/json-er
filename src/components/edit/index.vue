<template>
  <a-modal
    v-model:visible="visible"
    title="编辑值"
    width="800px"
    centered
    :destroyOnClose="true"
    ok-text="确定"
    cancel-text="取消"
    @ok="onOk"
    @cancel="onCancel"
  >
    <edit-table v-model:data="data" />
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { isArray, isObject } from "lodash";
import { Modal as AModal } from "ant-design-vue";
import EditTable from "./table.vue";
import type { DataSourceType } from "/@/types";
import { NodeDataType } from "/@/types";

const emit = defineEmits(["ok"]);

const visible = ref(false);
let otherParams: any = {};
const data = ref<DataSourceType[]>([]);

function openModal(originalData: any) {
  visible.value = true;

  const type = isArray(originalData) ? NodeDataType.ARRAY : NodeDataType.OBJECT;
  otherParams.type = type;
  if (type === NodeDataType.ARRAY) {
    data.value = originalData.map((item: any, index: number) => {
      const isComplex = isArray(item) || isObject(item);
      return {
        id: index,
        key: index,
        value: isComplex ? JSON.stringify(item) : item,
        isComplex,
        fontEditing: false,
        backEditing: false,
      };
    });
  } else {
    data.value = Object.keys(originalData).map((key: any, index: number) => {
      const v = originalData[key];
      const isComplex = isArray(v) || isObject(v);
      return {
        id: index,
        key: key,
        value: isComplex ? JSON.stringify(v) : v,
        isComplex,
        fontEditing: false,
        backEditing: false,
      };
    });
  }
  data.value.push({
    id: data.value.length,
    key: "",
    value: "",
    isComplex: false,
    fontEditing: false,
    backEditing: false,
  });
}

function onCancel() {
  visible.value = false;
}

function onOk() {
  visible.value = false;
  const dataAfter = data.value.filter((item: any) => item.key !== "");
  let result: any;
  if (otherParams.type === NodeDataType.ARRAY) {
    result = dataAfter.map((item: any) =>
      item.isComplex ? JSON.parse(item.value) : item.value
    );
  } else
    result = dataAfter.reduce(
      (pre: any, cur: any) => (
        (pre[cur.key] = cur.isComplex ? JSON.parse(cur.value) : cur.value), pre
      ),
      {}
    );
  emit("ok", result);
}

defineExpose({
  openModal,
});
</script>

<style lang="less" scoped>
.map-table {
  height: 400px;

  :deep(.ant-spin-nested-loading) {
    height: 100%;
    .ant-spin-container,
    .ant-table,
    .ant-table-container {
      height: 100%;
    }
    div > .ant-spin {
      max-height: 100%;
    }
  }

  :deep(.ant-table.ant-table-empty) {
    .ant-table-container .ant-table-body {
      height: calc(100% - 54px);
      table {
        height: 100%;
      }
    }
  }

  :deep(.ant-table-tbody .ant-table-cell) {
    padding: 0;
  }

  .map-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 16px;
    height: 48px;
    line-height: 48px;
  }

  .map-input {
    width: calc(100% - 4px);
    height: 46px;
    margin: 1px 2px;
    border: none;
  }
}
</style>
