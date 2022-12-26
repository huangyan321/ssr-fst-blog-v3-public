<template>
  <div>
    <div>
      <el-checkbox v-model="checked1" label="Option 1" size="large" />
      <el-checkbox v-model="checked2" label="Option 2" size="large" />
    </div>
    <div>
      <el-checkbox v-model="checked3" label="Option 1" />
      <el-checkbox v-model="checked4" label="Option 2" />
    </div>
    <div>
      <el-checkbox v-model="checked5" label="Option 1" size="small" />
      <el-checkbox v-model="checked6" label="Option 2" size="small" />
    </div>
    <div>
      <el-checkbox v-model="checked5" label="Option 1" size="small" disabled />
      <el-checkbox v-model="checked6" label="Option 2" size="small" disabled />
    </div>
    <el-switch v-model="value1" />
    <el-switch
      v-model="value2"
      class="ml-2"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
    />
    <div class="example-pagination-block">
      <div class="example-demonstration">When you have few pages</div>
      <el-pagination layout="prev, pager, next" :total="50" />
    </div>
    <div class="example-pagination-block">
      <div class="example-demonstration">When you have more than 7 pages</div>
      <el-pagination layout="prev, pager, next" :total="1000" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const value1 = ref(true);
const value2 = ref(true);
const checked1 = ref(true);
const checked2 = ref(false);
const checked3 = ref(false);
const checked4 = ref(false);
const checked5 = ref(false);
const checked6 = ref(false);
</script>
<style scoped>
.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}
.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}
</style>
