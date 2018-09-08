<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'App',  
}
</script>

<style lang="scss">
@import "./assets/all";
body, html{
  height: 100%;
}
</style>
