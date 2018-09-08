<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="(item, index) in products" :key="index">
                <div class="card border-0 shadow-sm d-flex h-100">
                    <div style="height: 200px; background-size: cover; background-position: center" :style="{backgroundImage:`url(${item.imageUrl})`}">
                    </div>
                    <div class="card-body">
                        <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                        <h5 class="card-title">
                            <a href="#" class="text-dark">{{ item.title }}</a>
                        </h5>
                        <p class="card-text">{{ item.content }}</p>
                        <div class="d-flex justify-content-between align-items-baseline">
                            <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
                            <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
                            <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
                        </div>
                    </div>
                    <div class="card-footer d-flex">
                        <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
                            <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                            查看更多
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addtoCart(item.id)">
                            <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                            加到購物車
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <!--購物車內容-->
        <div class=" container-fluid mt-5">
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <table class="table">
                        <thead>
                            <tr>
                                <th width="80"></th>
                                <th width="">品名</th>
                                <th width="80">數量</th>
                                <th width="80">單價</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in carts" :key="index">
                                <td>
                                    <button class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.id)">
                                        <i class="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                                <td>
                                    {{ item.product.title }}
                                    <div class="text-success" v-if="item.coupon">已套用優惠券</div>
                                </td>
                                <td>{{ item.qty }} /件</td>
                                <td class="text-right">{{ item.total | currency}}</td>
                            </tr>
                            <tr>
                                <td class="text-right" colspan="3">總計</td>
                                <td class="text-right">{{ cash.total | currency}}</td>
                            </tr>
                            <tr v-if="cash.finaltotal!==cash.total">
                                <td colspan="3" class="text-success text-right">折扣價</td>
                                <td class="text-right text-success">{{ cash.finaltotal | currency}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code" aria-label="Recipient's username" aria-describedby="input-upon">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" id="input-upon" @click="addCoupon">套用優惠碼</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--建立訂單內容-->
        <div class="my-5 row justify-content-center">
            <form class="col-md-6" @submit.prevent="createOrder">
                <div class="form-group">
                    <label for="useremail">Email</label>
                    <input type="email" class="form-control" name="email" id="useremail" v-validate="'required|email'" :class="{'is-invalid': errors.has('email')}" v-model="form.user.email" placeholder="請輸入 Email">
                    <span class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
                </div>

                <div class="form-group">
                    <label for="username">收件人姓名</label>
                    <input type="text" class="form-control" name="name" id="username" :class="{'is-invalid': errors.has('name')}" v-validate="'required'" v-model="form.user.name" placeholder="輸入姓名">
                    <span class="text-danger" v-if="errors.has('name')">姓名必須輸入</span>
                </div>

                <div class="form-group">
                    <label for="usertel">收件人電話</label>
                    <input type="tel" class="form-control" id="usertel" name="phone" v-validate="'required|numeric'" :class="{'is-invalid': errors.has('phone')}" v-model="form.user.tel" placeholder="請輸入電話">
                    <span class="text-danger" v-if="errors.has('phone')">電話欄位格式錯誤</span>
                </div>

                <div class="form-group">
                    <label for="useraddress">收件人地址</label>
                    <input type="address" class="form-control" name="address" id="useraddress" v-validate="'required'" :class="{'is-invalid': errors.has('address')}" v-model="form.user.address" placeholder="請輸入地址">
                    <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
                </div>

                <div class="form-group">
                    <label for="useraddress">留言</label>
                    <textarea name="" id="" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
                </div>
                <div class="text-right">
                    <button class="btn btn-danger">送出訂單</button>
                </div>
            </form>
        </div>

        <!--ProductModal-->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content ">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                            {{product.title}}
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body ">
                        <img :src="product.imageUrl" class="img-fluid" alt="">
                        <blockquote class="blockquote mt-3">
                            <p class="mb-0">{{product.content}}</p>
                            <footer class="blockquote-footer text-right">{{product.description}}</footer>
                        </blockquote>
                        <div class="d-flex justify-content-between align-items-baseline">
                            <div class="h4" v-if="!product.price">原價 {{product.origin_price}} 元</div>
                            <del class="h6" v-if="product.price">原價 {{product.origin_price}} 元</del>
                            <div class="h4" v-if="product.price">現在只要 {{product.price}} 元</div>
                        </div>
                        <select name="" class="form-control mt-3" v-model="product.num">
                            <option :value="num" v-for="num in 10" :key="num">
                                選購 {{num}} {{product.unit}}
                            </option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <div class="text-muted text-nowrap mr-3">
                            小計
                            <strong>{{product.num*product.price}}</strong> 元
                        </div>
                        <button class="btn btn-primary" type="button" @click="addtoCart(product.id,product.num)">
                            <i class="fas fa-spinner fa-spin" v-if="product.id===status.loadingItem"></i>
                            加到購物車
                        </button>
                    </div>
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
            isLoading: false,
            products: [],
            product: {},
            status: {
                loadingItem: '',
            },
            carts: [],
            cash: {
                total: 0,
                finaltotal: 0,
            },
            coupon_code: '',
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: ''
            }
        }
    },
    methods: {
        getProducts(page = 1) {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`
            const vm = this
            vm.isLoading = true
            this.axios.get(api).then((response) => {
                console.log('getProducts', response.data)
                if (response.data.success) {
                    vm.products = response.data.products
                }
                vm.isLoading = false
            })
        },
        getProduct(id) {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`
            const vm = this
            vm.status.loadingItem = id
            this.axios.get(api).then((response) => {
                console.log('getProduct', response.data)
                if (response.data.success) {
                    vm.product = response.data.product
                    $('#productModal').modal('show')
                }
                vm.status.loadingItem = ''
            })
        },
        addtoCart(id, qty = 1) {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
            const vm = this
            vm.status.loadingItem = id
            const cart = {
                product_id: id,
                qty,
            }
            this.axios.post(api, { data: cart }).then((response) => {
                console.log('addtoCart', response.data)
                if (response.data.success) {
                    $('#productmodal').modal('hide')
                    vm.getCart()
                }
                vm.status.loadingItem = ''
            })
        },
        getCart() {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/`
            const vm = this
            vm.isLoading = true
            vm.cash.total = 0
            vm.cash.finaltotal = 0
            this.axios.get(api).then((response) => {
                console.log('getCart', response.data)
                if (response.data.success) {
                    vm.isLoading = false
                    vm.carts = response.data.data.carts
                    vm.carts.forEach((item) => {
                        vm.cash.total += item.total
                        vm.cash.finaltotal += item.final_total
                    })
                } else {
                    if (response.data.message === "禁止使用, 請確認 api_path 是否為本人使用。" || response.data.message === "驗證錯誤, 請重新登入") {
                        vm.$router.push('/login')
                    }
                }
            })
        },
        removeCartItem(id) {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`
            const vm = this
            vm.isLoading = true
            this.axios.delete(api).then((response) => {
                vm.isLoading = false
                console.log('removeCartItem', response.data)
                vm.getCart()
            })
        },
        addCoupon() {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`
            const vm = this
            const code = { code: vm.coupon_code }
            vm.isLoading = true
            this.axios.post(api, { data: code }).then((response) => {
                vm.isLoading = false
                console.log('addCoupon', response.data)
                vm.getCart()
            })
        },
        createOrder() {
            const vm = this
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`
            const order = vm.form
            vm.isLoading = true
            this.$validator.validate().then((result) => {
                if (result) {
                    this.axios.post(api, { data: order }).then((response) => {
                        vm.isLoading = false
                        console.log('createOrder', response.data)
                        if (response.data.success) {
                            this.$router.push(`/customer_checkout/${response.data.orderId}`)
                        }
                    })
                } else {
                    vm.isLoading = false                    
                    this.$bus.$emit('message:push', '欄位不完整', 'danger')
                }
            });
        }
    },
    created() {
        this.getProducts()
        this.getCart()
    }
}
</script>