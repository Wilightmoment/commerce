<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="h3 d-flex justify-content-center mt-3 text-myr">訂單列表</div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <td>購買時間</td>
                    <td>Email</td>
                    <td>購買款項</td>
                    <td class="text-right">應付金額</td>
                    <td class="text-right">是否付款</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, index) in orders" :key="index">
                    <td>{{ order.created_at }}</td>
                    <td>{{ order.user.email }}</td>
                    <td>
                        <span v-for="(item, index) in order.products" :key="index">
                            {{ item.product.title }} 數量: {{ item.qty }} <br>
                        </span>
                    </td>
                    <td class="text-right">{{ order.total | currency}}</td>
                    <td class="text-right">
                        <span v-if="order.is_paid" class="text-success">已付款</span>
                        <span v-else class="text-danger">尚未付款</span>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Pagination -->
        <Pagination :pagination="pagination" @pageMethod="getOrders"></Pagination>
    </div>
</template>

<script>
import Pagination from '../Pagination'
export default {
    name: 'Orders',
    components: { Pagination },
    data() {
        return {
            isLoading: false,
            orders: [],
            pagination: {}
        }
    },
    methods: {
        getOrders(page = 1) {
            const vm = this
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/orders?page=${page}`
            vm.isLoading = true
            this.axios.get(api).then((response) => {
                console.log('getOrders', response.data)
                if (response.data.success) {
                    vm.orders = response.data.orders
                    vm.pagination = response.data.pagination
                    vm.orders.forEach((item) => {                      
                        let temp = new Date(item.create_at * 1000)                       
                        let year = temp.getFullYear()
                        let month = temp.getMonth() + 1
                        let day = temp.getDate() + 1
                        item.created_at = `${year}/${month}/${day}`
                    })
                }
                vm.isLoading = false
            })
        }
    },
    created() {
        this.getOrders()
    }
}
</script>