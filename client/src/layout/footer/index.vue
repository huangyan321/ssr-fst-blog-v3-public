<template>
  <footer class="footer if fd-c fjc-fe fai-c">
    <el-link href="http://beian.miit.gov.cn/"
      ><span>闽ICP备2021008516号-1</span></el-link
    >
    <el-link
      target="_blank"
      href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35012102000346"
      style="display: inline-block; height: 20px; line-height: 20px"
      ><el-image :src="bei_an" style="float: left" />
      <span class="beian">闽公网安备 35012102000346号</span></el-link
    >
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const bei_an = require('@/assets/img/beian.png');
</script>
<style lang="stylus" scoped>
.footer
  height 60px
  font-size 12px
  width 100%
  text-align center
  color gray
  align-content center
  :deep(.el-link)
    font-size 12px
.beian
  float left
  height 20px
  text-decoration underline
  line-height 20px
  margin 0px 0px 0px 5px
</style>
