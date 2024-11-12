<template>
  <a-form
    ref="formRef"
    :model="formState"
    class="json-body"
    @dragover.prevent
    @drop="onFileDrop"
  >
    <utility-menu
      @upload="processFileContent"
      @format="formatContent"
      @copy="copyContent"
      @compress="compressContent"
    />
    <a-form-item label="" name="jsonText" :rules="[{ validator }]">
      <a-textarea
        v-model:value="formState.jsonText"
        placeholder="请输入JSON或拖入JSON文件"
        class="json-textarea"
      ></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  Form as AForm,
  FormItem as AFormItem,
  Textarea as ATextarea,
  message,
} from "ant-design-vue";
import UtilityMenu from "./menu.vue";

const emit = defineEmits(["change"]);

const formRef = ref();
const formState = reactive({
  jsonText: "",
});

let objectJson = {};
const validator = (rule: any, value: string) => {
  if (!value) return Promise.resolve();
  try {
    objectJson = JSON.parse(value);
    emit("change", objectJson);
    return Promise.resolve();
  } catch (e) {
    return Promise.reject("请输入正确的json格式");
  }
};

function updateValue(value: string) {
  formState.jsonText = value;
  formRef.value?.validate();
}

function onFileDrop(e: any) {
  e.preventDefault();
  e.stopPropagation();
  processFileContent(e.dataTransfer.files?.[0]);
}

function processFileContent(file?: File) {
  if (!file) return;
  const reader: FileReader = new FileReader();
  const FILE_MAX_SIZE = 1024 * 1024;
  if (file.size > FILE_MAX_SIZE) {
    message.error("文件大小不能超过1M");
    return;
  }
  reader.readAsArrayBuffer(file);
  reader.onloadend = function () {
    if (reader.readyState == 2) {
      const fileContents = reader.result as ArrayBuffer;
      const snippet = new TextDecoder("UTF-8").decode(fileContents);
      updateValue(snippet);
    }
  };
}

// 格式化json
function formatContent() {
  try {
    formState.jsonText = JSON.stringify(objectJson, null, 2);
  } catch (e) {
    message.error("格式化失败");
  }
}

function copyContent() {
  try {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formState.jsonText ?? "");
    } else {
      copyToClipboard(formState.jsonText);
    }
    message.success("复制成功");
  } catch (e) {
    message.error("复制失败");
  }
}

function copyToClipboard(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function compressContent() {
  try {
    formState.jsonText = JSON.stringify(JSON.parse(formState.jsonText));
  } catch (e) {
    message.error("压缩失败");
  }
}

defineExpose({ updateValue });
</script>

<style lang="less" scoped>
.json-body {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  & > .ant-form-item {
    flex: 1;
    overflow: auto;
  }
  :deep(.ant-form-item-control),
  :deep(.ant-form-item-control-input),
  :deep(.ant-form-item-control-input-content) {
    height: 100%;
  }

  .json-textarea {
    height: 100%;
  }
}
</style>
