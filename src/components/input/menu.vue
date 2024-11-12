<template>
  <a-space :size="16" style="margin-bottom: 16px">
    <a-button @click="importFile">导入</a-button>
    <a-button @click="emit('format')">格式化</a-button>
    <a-button @click="emit('copy')">复制</a-button>
    <a-button @click="emit('compress')">压缩</a-button>
    <input
      ref="fileInputRef"
      type="file"
      @change="onFileLoaded"
      style="display: none"
    />
  </a-space>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Space as ASpace, Button as AButton } from "ant-design-vue";

const emit = defineEmits(["upload", "format", "copy", "compress"]);

const fileInputRef = ref();

function importFile() {
  fileInputRef.value.click();
}

function onFileLoaded(e: any) {
  emit("upload", e.target.files?.[0]);
}
</script>
