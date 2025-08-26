<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style>
.pagepadding {
  padding: 20px;
}
.app-container {
  padding: 20px;
}
.pageborder{
  overflow: hidden;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  background-color: #f7f7f7;
}
.pageback{
  background-color: #ffffff;
}
.pageinpadding{
  min-height: calc(100vh - 48px);
  padding: 16px;
  padding-top: 32px;
}
body{
  margin: 0
}
</style>