<template>
    <div>
        <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <router-link class="navbar-brand col-sm-3 col-md-2 mr-0" to="/admin/products">YING RAN</router-link>
            <!-- <input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search"> -->
            <ul class="navbar-nav px-3">
                <li class="nav-item text-nowrap ">
                    <a class="nav-link" href="#" @click.prevent="signout">登出</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    methods: {
        signout() {
            const api = `${process.env.APIPATH}/logout`
            const vm = this
            this.axios.post(api).then((response) => {
                console.log('logout', response.data)
                if (response.data.success) {
                    vm.$router.push('/login')
                }
            })
        }
    }
}
</script>
