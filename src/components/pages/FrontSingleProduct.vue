<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <!-- headers -->
        <nav class="navbar navbar-light bg-light">
            <router-link class="navbar-brand" to="/frontshop">
                <i class="fas fa-heart text-info mr-1"></i>
                六角血拚賣賣
            </router-link>

            <div class="ml-auto">
                <router-link class="btn btn-outline-info" to="/login">
                    登入會員
                </router-link>
            </div>
            <!-- 購物車內的數量(Button 內包含 icon, 數量 badge) -->
            <div class="dropdown ml-3">
                <button class="btn btn-sm btn-cart" data-toggle="dropdown" data-flip="false">
                    <i class="fas fa-shopping-cart text-dark fa-2x" aria-hidden="true"></i>
                    <span class="badge badge-pill badge-danger">{{ carts.length }}</span>
                </button>
                <div class="dropdown-menu dropdown-menu-right" style="min-width: 400px;">
                    <div class="px-4 py-3">
                        <h5 class="text-center text-success text-bold">已選擇商品</h5>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>商品名稱</th>
                                    <th>數量</th>
                                    <th>金額</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in carts" :key="index">
                                    <td>
                                        <button class="text-danger btn-del" @click="removeCartItem(item.id)">
                                            <i class="far fa-trash-alt" aria-hidden="true"></i>
                                        </button>
                                    </td>
                                    <td>{{ item.product.title }}</td>
                                    <td>{{ item.qty }}</td>
                                    <td>{{ item.final_total | currency }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="d-flex justify-content-end">
                            <router-link to="/checkout/checkoutorder" class="btn btn-outline-myr">結帳去 GO!!</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb bg-transparent">
                    <li class="breadcrumb-item">
                        <router-link to="/frontshop">首頁</router-link>
                    </li>
                    <li class="breadcrumb-item">
                        <router-link to="/frontshop">{{ product.category }}</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">{{ product.title }}</li>
                </ol>
            </nav>
            <div class="row">
                <div class="col-md-4">
                    <div class="sticky-top">
                        <h1 class="h2">{{ product.title }}
                            <small class="text-muted">({{ product.category }})</small>
                        </h1>
                        <div class="d-flex justify-content-between align-items-end mt-3">
                            <span class="text-muted text-decoration ">售價 ${{ product.origin_price }}</span>
                            <div class="text-danger h3 mb-0">
                                <small>特價 NT$</small>
                                <strong>{{ product.price }}</strong>
                            </div>
                        </div>
                        <hr> 請選擇數量
                        <div class="input-group mt-3">
                            <select name="" id="" class="form-control mr-2" v-model="product.num">
                                <option :value="num" v-for="(num) in 10" :key="num">{{ num }} {{product.unit}}</option>
                            </select>
                            <button class="btn btn-primary" @click="addtoCart(product.id, product.num)">加入購物車</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="h2 text-center mb-3">{{ product.title }}</div>
                    <div class="h5 mb-3">Lorem ipsum dolor sit amet, consectetur adipisicing elit. A nam ipsum cupiditate nesciunt maxime esse consectetur! Iusto voluptatibus perferendis nobis sed? Fugiat distinctio maiores consequuntur nihil eos nostrum quam reiciendis?</div>
                    <div class="d-flex justify-content-center mb-3">
                        <img :src="product.imageUrl" alt="" class="img-fluid">
                    </div>
                    <div class="card bg-light my-3">
                        <div class="card-body">
                            <div class="h2 text-center">購物說明</div>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure perspiciatis architecto vel dolores voluptatum nam! Iste placeat dolorem explicabo earum ad beatae magnam aliquid inventore vel, a eos neque corporis.</p>
                        </div>
                    </div>

                </div>
            </div>
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

<script>
export default {
    data() {
        return {
            isLoading: false,
            productId: '',
            product: {},
            status: {
                loadingItem: ''
            },
            carts: [],
        }
    },
    methods: {
        getProduct() {
            const vm = this
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${vm.productId}`
            vm.isLoading = true
            this.axios.get(url).then((response) => {
                console.log('getProduct', response.data)
                if (response.data.success) {
                    vm.product = response.data.product
                }
                vm.isLoading = false
            })
        },
        getCarts() {
            const vm = this
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
            vm.isLoading = true
            this.axios.get(url).then((response) => {
                console.log('getCarts', response.data)
                if (response.data.success) {
                    vm.carts = response.data.data.carts
                }
                vm.isLoading = false
            })
        },
        addtoCart(id, qty = 1) {
            const vm = this
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
            vm.status.loadingItem = id
            const cart = {
                product_id: id,
                qty
            }
            this.axios.post(url, { data: cart }).then((response) => {
                console.log('addtoCart', response.data)
                if (response.data.success) {
                    vm.getCarts();
                }
                vm.status.loadingItem = ''
            })
        },
        removeCartItem(id) {
            const vm = this
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`
            this.axios.delete(url).then((response) => {
                console.log(response.data)
                if (response.data.success) {
                    vm.getCarts()
                }
            })
        },
    },
    created() {
        this.productId = this.$route.params.productId
        console.log(this.productId)
        this.getProduct()
        this.getCarts()
    }
}
</script>

<style>
body {
    font-size: 18px;
}
.btn-cart {
    background-color: transparent;
    position: relative;
}
.navbar-brand {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    font-size: 1.4rem;
    font-weight: bolder;
    background-color: transparent;
    box-shadow: inset 0px 0 0 rgba(0, 0, 0, 0.25);
}
.btn-cart .badge-pill {
    position: absolute;
    top: -6px;
    right: 0;
    padding-left: 0.4rem;
    padding-right: 0.4rem;
}
.text-decoration {
    text-decoration: line-through;
}
.sticky-top {
    top: 10px;
}
</style>
