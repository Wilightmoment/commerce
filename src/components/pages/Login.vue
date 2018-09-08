<template>
    <div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-12 d-flex justify-content-center">
                    <form class="form-signin w-25  text-white" @submit.prevent="signin">
                        <h1 class="h3 mb-3 font-weight-normal">SIGN IN</h1>
                        <label for="inputEmail" class="text-muted">Email address</label>
                        <input type="email" id="inputEmail" class="form-control" v-model="user.username" placeholder="Email address" required autofocus>
                        <label for="inputPassword" class="mt-3 text-muted">Password</label>
                        <input type="password" id="inputPassword" class="form-control " v-model="user.password" placeholder="Password" required>
                        <div class="checkbox my-3 align-items-center d-flex">
                            <input type="checkbox" id="inputCheckbox" value="remember-me" v-model="remember">
                            <label for="inputCheckbox" class="ml-1"> Remember me </label>
                        </div>
                        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    data() {
        return {
            user: {
                username: '',
                password: '',
            },
            remember: false
        }
    },
    methods: {
        signin() {
            const api = `${process.env.APIPATH}/signin`
            const vm = this
            this.axios.post(api, vm.user).then((response) => {
                console.log('login', response.data)
                if (response.data.success) {
                    if (vm.remember) {
                        this.$localStorage.set('user', JSON.stringify(vm.user))
                    }
                    vm.$router.push('/admin/products')
                }
            })
        }
    },
    created() {
         $(document).ready(function () {
            console.log('ready')
            //讓背景圖佔滿螢幕
            let height = $('body').height();
            console.log('height', height)
            $('.row').css("height", `${height}`)
            //防止在跳轉回來時modal仍然開啟
            if ($('body').hasClass('modal-open')) {
                $('body').removeClass('modal-open');
                this.location.reload();
            }
        })

        //製作localStorage
        let data = JSON.parse(this.$localStorage.get('user'))
        console.log("localStorage", data)
        if(data === null){
            return;
        } else {
            this.user.username = data.username
            this.user.password = data.password
            this.remember = true
        }       
    },
    beforeDestroy() {
        if (!this.remember) {
            this.$localStorage.remove('user')
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
body,
html {
    height: 100%;
}
.row {
    height: 100%;
    background-color: rgb(153, 194, 255);
}
form {
    margin: 10% 0;   
}

input {
    border-radius: 25px;
    padding: 25px 15px;
}
button{
    border-radius: 25px;
}
.checkbox label{
    font-size: 18px;
    font-weight: bold;    
}
input[type="checkbox"]{
    width: 18px; /*Desired width*/
    height: 18px;
    margin-top: -6px;
    background-color: rgb(230, 242, 255);
    border-radius: 5px solid  rgb(230, 242, 255);
}
.text-muted{
    font-size: 16px;
}
</style>
