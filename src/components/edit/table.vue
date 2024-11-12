<template>
  <div @dblclick="onTableClick">
    <a-table
      :columns="columns"
      :data-source="dataSource"
      row-key="id"
      :pagination="false"
      :scroll="{ y: 'calc(100% - 54px)' }"
      class="map-table"
    >
      <template #headerCell="{ title }">
        <template v-if="title === 'isComplex'">
          {{ title }}
          <a-tooltip>
            <template #title
              >如果Value为复杂结构（如Object/Array），请勾选此项</template
            >
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
      </template>
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.dataIndex === 'key'">
          <a-input
            v-if="record.fontEditing"
            v-model:value="record.key"
            class="map-input"
            @blur="onEdited1(record)"
            @press-enter="onEdited1(record)"
          ></a-input>
          <div v-else class="map-text">{{ text }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'value'"
          ><a-input
            v-if="record.backEditing"
            :defaultValue="record.value"
            class="map-input"
            @blur="(e) => onEdited2(e, record)"
            @press-enter="(e) => onEdited2(e, record)"
          ></a-input>
          <div v-else class="map-text" :title="text">{{ text }}</div>
        </template>
        <template
          v-else-if="column.dataIndex === 'isComplex' && record.key !== ''"
        >
          <a-checkbox
            v-model:checked="record.isComplex"
            style="margin-left: 42px"
          />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import {
  Checkbox as ACheckbox,
  Input as AInput,
  Table as ATable,
  Tooltip as ATooltip,
  message,
} from "ant-design-vue";
import { QuestionCircleOutlined } from "@ant-design/icons-vue";
import type { DataSourceType } from "/@/types";

const props = defineProps<{ data: DataSourceType[] }>();
const emit = defineEmits(["update:data"]);

const columns = [
  { title: "Key", dataIndex: "key", width: 150 },
  { title: "Value", dataIndex: "value" },
  { title: "isComplex", dataIndex: "isComplex", width: 118 },
];
const dataSource = ref<DataSourceType[]>(props.data || []);

function onTableClick(e: any) {
  const target = e.target as HTMLElement;
  if (!target) return;

  const targetCell = target.closest(".ant-table-cell") as any;
  if (!targetCell || !targetCell?.parentNode) return;
  e.stopPropagation();

  const columnIndex = targetCell.cellIndex;
  if (columnIndex > 1) return;

  const rowId = parseInt(targetCell.parentNode.dataset["rowKey"] || "0");

  const record = dataSource.value[rowId];
  if (record.key === "" || columnIndex === 0) {
    record.fontEditing = true;
    record.backEditing = false;
  } else {
    record.fontEditing = false;
    record.backEditing = true;
  }
  nextTick(() => {
    const textarea = targetCell.parentNode.querySelector("input") as any;
    textarea && textarea.focus();
  });
}

function onEdited1(record: any) {
  record.fontEditing = false;
  if (record.id === dataSource.value.length - 1 && record.key) addNewData();
}

function addNewData() {
  dataSource.value.push({
    id: dataSource.value.length,
    key: "",
    value: "",
    isComplex: false,
    fontEditing: false,
    backEditing: false,
  });
  emit("update:data", dataSource.value);
}

function onEdited2(e: any, record: any) {
  record.backEditing = false;

  const v = e.target.value;
  if (!record.isComplex) {
    record.value = v;
    return;
  }

  try {
    JSON.parse(v);
    record.value = v;
  } catch (e) {
    message.error("请输入正确的JSON字符串");
  }
}
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
