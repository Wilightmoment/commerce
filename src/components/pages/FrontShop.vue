<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <!-- headers -->
        <nav class="navbar navbar-light bg-light fixed-top">
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

        <!-- jubmotron -->
        <div class="jumbotron jumbotron-fluid jumbotron-bg d-flex align-items-end">
            <div class="container">
                <div class="bg-lighter px-3 py-3 text-center">
                    <h1 class="display-4 text-danger">再買就剁手啦</h1>
                    <p class="lead text-myy">撐不住的荷包君
                        <span class="ml-2 text-dark h4">இдஇ</span>
                    </p>
                </div>
            </div>
        </div>

        <section class="container-fluid mb-5">
            <div class="row px-5">
                <!-- 產品導覽 -->
                <div class="col-md-3 px-5">
                    <div class="sticky-top" style="top: 80px">
                        <div class="list-group mx-4 mb-3" id="list-tab" role="tablist">
                            <a class="list-group-item list-group-item-action active" id="list-colthes-list" data-toggle="list" href="#list-colthes" role="tab" aria-controls="colthes" @click.prevent="category='衣服'">衣服</a>
                            <a class="list-group-item list-group-item-action" id="list-shoes-list" data-toggle="list" href="#list-shoes" role="tab" aria-controls="shoes" @click.prevent="category='鞋子'">鞋子</a>
                            <a class="list-group-item list-group-item-action" id="list-plats-list" data-toggle="list" href="#list-plats" role="tab" aria-controls="plats" @click.prevent="category='褲子'">褲子</a>
                            <a class="list-group-item list-group-item-action" id="list-hats-list" data-toggle="list" href="#list-hats" role="tab" aria-controls="hats" @click.prevent="category='帽子'">帽子</a>
                            <a class="list-group-item list-group-item-action" id="list-glasses-list" data-toggle="list" href="#list-glasses" role="tab" aria-controls="glasses" @click.prevent="category='眼鏡'">眼鏡</a>
                        </div>
                    </div>
                </div>
                <!-- 產品列表 -->
                <div class="col-md-9">
                    <div class="tab-content" id="nav-tabContent">
                        <div class="tab-pane fade show active" id="list-colthes" role="tabpanel" aria-labelledby="list-colthes-list">
                            <div class="row">
                                <div class="col-xl-4 mb-4" v-for="product in filterCategory" :key="product.id">
                                    <div class="card d-flex h-100 border-0 box-shadow">
                                        <div class="card-img-top" alt="Card image cap" :style="{backgroundImage:`url(${product.imageUrl})`}"></div>
                                        <div class="card-body text-center">
                                            <h3 class="card-title text-info">{{ product.title }}</h3>
                                            <p class="card-text text-success">
                                                <i>{{ product.description }}</i>
                                            </p>
                                            <div class="text-left">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident suscipit sit officiis tempora eligendi inventore iure, dignissimos sequi rem. Aliquam qui odit voluptatibus asperiores totam explicabo iste nisi, esse suscipit.</div>
                                            <div class="d-flex justify-content-between align-items-end mt-2">
                                                <span class="text-muted text-decoration h6 mb-0">
                                                    售價 {{ product.origin_price }}
                                                </span>
                                                <div class="h3 text-danger mb-0">
                                                    <small>特價 NT$</small>
                                                    <strong>{{ product.price }}</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer border-top-0 d-flex justify-content-between">
                                            <div class="btn btn-outline-info" @click="getProduct(product.id)">
                                                查看更多
                                                <i class="fas fa-spinner fa-pulse" v-if="product.id===status.loadingItem"></i>
                                            </div>
                                            <div class="btn btn-myr" @click="addtoCart(product.id)">
                                                加入購物車
                                                <i class="fas fa-spinner fa-pulse" v-if="product.id===status.loadingItem"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="list-shoes" role="tabpanel" aria-labelledby="list-shoes-list">
                            <div class="row">
                                <div class="col-xl-4 mb-4" v-for="product in filterCategory" :key="product.id">
                                    <div class="card d-flex h-100 border-0 box-shadow">
                                        <div class="card-img-top" alt="Card image cap" :style="{backgroundImage:`url(${product.imageUrl})`}"></div>
                                        <div class="card-body text-center">
                                            <h3 class="card-title text-info">{{ product.title }}</h3>
                                            <p class="card-text text-success">
                                                <i>{{ product.description }}</i>
                                            </p>
                                            <div class="text-left">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident suscipit sit officiis tempora eligendi inventore iure, dignissimos sequi rem. Aliquam qui odit voluptatibus asperiores totam explicabo iste nisi, esse suscipit.</div>
                                            <div class="d-flex justify-content-between align-items-end mt-2">
                                                <span class="text-muted text-decoration h6 mb-0">
                                                    售價 {{ product.origin_price }}
                                                </span>
                                                <div class="h3 text-danger mb-0">
                                                    <small>特價 NT$</small>
                                                    <strong>{{ product.price }}</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer border-top-0 d-flex justify-content-between">
                                            <div class="btn btn-outline-info" @click="getProduct(product.id)">
                                                查看更多
                                                <i class="fas fa-spinner fa-pulse" v-if="product.id===status.loadingItem"></i>
                                            </div>
                                            <div class="btn btn-myr" @click="addtoCart(product.id)">
                                                加入購物車
                                                <i class="fas fa-spinner fa-pulse" v-if="product.id===status.loadingItem"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="list-plats" role="tabpanel" aria-labelledby="list-plats-list">
                            <div class="row">
                                <div class="col-xl-4 mb-4" v-for="product in filterCategory" :key="product.id">
                                    <div class="card d-flex h-100 border-0 box-shadow">
                                        <div class="card-img-top" alt="Card image cap" :style="{backgroundImage:`url(${product.imageUrl})`}"></div>
                                        <div class="card-body text-center">
                                            <h3 class="card-title text-info">{{ product.title }}</h3>
                                            <p class="card-text text-success">
                                                <i>{{ product.description }}</i>
                                            </p>
                                            <div class="text-left">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident suscipit sit officiis tempora eligendi inventore iure, dignissimos sequi rem. Aliquam qui odit voluptatibus asperiores totam explicabo iste nisi, esse suscipit.</div>
                                            <div class="d-flex justify-content-between align-items-end mt-2">
                                                <span class="text-muted text-decoration h6 mb-0">
                                                    售價 {{ product.origin_price }}
                                                </span>
                                                <div class="h3 text-danger mb-0">
                                                    <small>特價 NT$</small>
                                                    <strong>{{ product.price }}</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer border-top-0 d-flex justify-content-between">
                                            <div class="btn btn-outline-info" @click="getProduct(product.id)">
                                                查看更多
                                                <i class="fas fa-spinner fa-pulse" v-if="product.id===status.loadingItem"></i>
                                            </div>
                                            <div class="btn btn-myr" @click="addtoCart(product.id)">
                                                加入購物車
                                                <i class="fas fa-spinner fa-pulse" v-if="product.id===status.loadingItem"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="list-hats" role="tabpanel" aria-labelledby="list-hats-list">
                            <div class="row">
                                <div class="col-xl-4 mb-4" v-for="product in filterCategory" :key="product.id">
                                    <div class="card d-flex h-100 border-0 box-shadow">
                                        <div class="card-img-top" alt="Card image cap" :style="{backgroundImage:`url(${product.imageUrl})`}"></div>
                                        <div class="card-body text-center">
                                            <h3 class="card-title text-info">{{ product.title }}</h3>
                                            <p class="card-text text-success">
                                                <i>{{ product.description }}</i>
                                            </p>
                                            <div class="text-left">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident suscipit sit officiis tempora eligendi inventore iure, dignissimos sequi rem. Aliquam qui odit voluptatibus asperiores totam explicabo iste nisi, esse suscipit.</div>
                                            <div class="d-flex justify-content-between align-items-end mt-2">
                                                <span class="text-muted text-decoration h6 mb-0">
                                                    售價 {{ product.origin_price }}
                                                </span>
                                                <div class="h3 text-danger mb-0">
                                                    <small>特價 NT$</small>
                                                    <strong>{{ product.price }}</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer border-top-0 d-flex justify-content-between">
                                            <div class="btn btn-outline-info" @click="getProduct(product.id)">
                                                查看更多
                                                <i class="fas fa-spinner fa-pulse" v-if="product.id===status.loadingItem"></i>
                                            </div>
                                            <div class="btn btn-myr" @click="addtoCart(product.id)">
                                                加入購物車
                                                <i class="fas fa-spinner fa-pulse" v-if="product.id===status.loadingItem"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="list-glasses" role="tabpanel" aria-labelledby="list-glasses-list">
                            <div class="row">
                                <div class="col-xl-4 mb-4" v-for="product in filterCategory" :key="product.id">
                                    <div class="card d-flex h-100 border-0 box-shadow">
                                        <div class="card-img-top" alt="Card image cap" :style="{backgroundImage:`url(${product.imageUrl})`}"></div>
                                        <div class="card-body text-center">
                                            <h3 class="card-title text-info">{{ product.title }}</h3>
                                            <p class="card-text text-success">
                                                <i>{{ product.description }}</i>
                                            </p>
                                            <div class="text-left">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident suscipit sit officiis tempora eligendi inventore iure, dignissimos sequi rem. Aliquam qui odit voluptatibus asperiores totam explicabo iste nisi, esse suscipit.</div>
                                            <div class="d-flex justify-content-between align-items-end mt-2">
                                                <span class="text-muted text-decoration h6 mb-0">
                                                    售價 {{ product.origin_price }}
                                                </span>
                                                <div class="h3 text-danger mb-0">
                                                    <small>特價 NT$</small>
                                                    <strong>{{ product.price }}</strong>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer border-top-0 d-flex justify-content-between">
                                            <div class="btn btn-outline-info" @click="getProduct(product.id)">
                                                查看更多
                                                <i class="fas fa-spinner fa-pulse" v-if="product.id===status.loadingItem"></i>
                                            </div>
                                            <div class="btn btn-myr" @click="addtoCart(product.id)">
                                                加入購物車
                                                <i class="fas fa-spinner fa-pulse" v-if="product.id===status.loadingItem"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
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
import $ from 'jquery'
export default {
    data() {
        return {
            isLoading: false,
            carts: [],
            products: [],
            product: {},
            category: '衣服',
            status: {
                loadingItem: ''
            },
        }
    },
    computed: {
        filterCategory() {
            const vm = this
            return vm.products.filter((item) => {
                return item.category === vm.category
            })
        }
    },
    methods: {
        getProducts() {
            const vm = this
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`
            vm.isLoading = true
            this.axios.get(url).then((response) => {
                console.log('getProducts', response.data)
                if (response.data.success) {
                    vm.products = response.data.products
                }
                vm.isLoading = false
            })
        },
        getProduct(id) {
            this.$router.push(`/singleproduct/${id}`)
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
        }
    },
    created() {
        this.getProducts()
        this.getCarts()
    }
}
</script>

<style scoped>
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
.jumbotron-bg {
    background-image: url(https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a4deb7be2c7c79941884cdf35c1cee8e&auto=format&fit=crop&w=1050&q=80);
    background-position: center center;
    background-size: cover;
    min-height: 400px;
    margin-top: 73px;
}
.bg-lighter {
    background-color: rgba(255, 255, 255, 0.25);
}
.card-img-top {
    height: 200px;
    background-position: center center;
    background-size: cover;
}
.box-shadow {
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.16);
    transition: box-shadow 0.3s;
}
.box-shadow:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.24);
}
.btn-del {
    background-color: transparent;
    border: 0px;
    border-radius: 5px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.16);
}
.btn-del:hover {
    cursor: pointer;
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.24);
}
.text-decoration {
    text-decoration: line-through;
}
</style>