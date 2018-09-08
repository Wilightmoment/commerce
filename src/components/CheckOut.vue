<template>
    <div>
        <nav class="navbar navbar-light bg-light">
            <router-link class="navbar-brand" to="/frontshop">
                <i class="fas fa-heart text-info mr-1"></i>
                六角血拚賣賣
            </router-link>                      
        </nav>
        <div class="container py-5">
            <h1 class="text-center text-success">六角血拚結帳</h1>
            <div class="form-row text-center my-5">
                <div class="col-12 col-sm">
                    <div class="alert alert-dark alert-rounded" :class="{'bg-green': name==='CheckOutOrder'}">
                        1.輸入訂單資料
                    </div>
                </div>
                <div class="col-12 col-sm">
                    <div class="alert alert-dark alert-rounded" :class="{'bg-green': name==='CheckOutComplete'}">
                        2.確認付款
                    </div>
                </div>                
            </div>
            <router-view/>
        </div>

        <footer class="bg-light text-muted py-5">
            <div class="container">
                <ul class="list-inline text-center">
                    <li class="list-inline-item">© Copright 2018 六角血拚賣賣</li>
                    <li class="list-inline-item text-info">
                        <i class="fab fa-instagram mr-1"></i>Instagrame</li>
                    <li class="list-inline-item text-info">
                        <i class="fab fa-facebook mr-1"></i>Facebook</li>
                    <li class="list-inline-item text-info">About</li>
                </ul>
                <p class="text-center">Made with YingRan</p>
            </div>
        </footer>
    </div>
</template>

<style>
.alert-rounded {
    border-radius: 25px;
}
.bg-green{
    background-color: rgb(26, 255, 26)
}
.navbar-brand {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    font-size: 1.4rem;
    font-weight: bolder;
    background-color: transparent;
    box-shadow: inset 0px 0 0 rgba(0, 0, 0, 0.25);
}
</style>


<script>
import $ from 'jquery'
export default {
    data () {
        return {      
            name: ''
        }
    },
    created() {
      const vm = this
      vm.name = this.$route.name      
    },   
}
</script>