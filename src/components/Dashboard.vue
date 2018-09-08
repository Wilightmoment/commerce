<template>
    <div>
        <Navbar/>
        <Alert/>
        <div class="container-fluid">
            <div class="row">
                <Sidebar/>
                <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
                   <router-view/>
                </main>
            </div>
        </div>
    </div>
</template>

<script>
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Alert from './AlertMessage'
export default {
    components: {
        Sidebar,
        Navbar,
        Alert,
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