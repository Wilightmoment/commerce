<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="accordion mb-3" id="accordionExample">
                    <div class="card border-0">
                        <div class="card-header bg-transparent" id="headingOne">
                            <h4 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                    顯示/隱藏 訂單資料
                                </button>
                            </h4>
                        </div>

                        <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>商品名稱</th>
                                        <th>數量</th>
                                        <th class="text-right">金額</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in carts" :key="index">
                                        <td>
                                            <button class="text-danger btn-del" @click="removeCartItem(item.id)">
                                                <i class="far fa-trash-alt" aria-hidden="true"></i>
                                            </button>
                                        </td>
                                        <td>
                                            {{ item.product.title }}
                                            <div class="text-success" v-if="item.coupon">已套用優惠券</div>
                                        </td>
                                        <td>{{ item.qty }}</td>
                                        <td class="text-right">{{ item.final_total | currency }}</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td class="text-right" colspan="3">總計</td>
                                        <td class="text-right">{{ cash.total | currency}}</td>
                                    </tr>
                                    <tr v-if="cash.finaltotal!==cash.total">
                                        <td colspan="3" class="text-success text-right">折扣價</td>
                                        <td class="text-right text-success">{{ cash.finaltotal | currency}}</td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" placeholder="請輸入優惠碼" @keyup.enter="addCoupon" v-model="coupon_code" aria-label="Recipient's username" aria-describedby="input-upon">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" id="input-upon" @click="addCoupon">套用優惠碼</button>
                                </div>
                            </div>
                            <span v-if="!couponed" class="text-danger text-right d-block">沒有此優惠券Q _ Q</span>
                        </div>
                    </div>
                </div>
                <div class="bg-light py-2 text-center">
                    <div class="h2">訂購人資訊</div>
                </div>

                <form class="mt-3" @submit.prevent="createOrder">
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
                        <button type="button" class="btn btn-secondary mr-1" @click="goback">繼續選購</button>
                        <button type="submit" class="btn btn-primary">確認付款</button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            carts: [],
            isLoading: false,
            coupon_code: '',
            cash: {
                total: 0,
                finaltotal: 0,
            },
            couponed: true,
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
        getCarts() {
            const vm = this
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
            vm.isLoading = true
            this.axios.get(url).then((response) => {
                console.log('getCarts', response.data)
                if (response.data.success) {
                    vm.carts = response.data.data.carts
                    vm.carts.forEach((item) => {
                        vm.cash.total += item.total
                        vm.cash.finaltotal += item.final_total
                    })
                }
                vm.isLoading = false
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
        addCoupon() {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`
            const vm = this
            const code = { code: vm.coupon_code }
            vm.isLoading = true
            this.axios.post(api, { data: code }).then((response) => {
                vm.isLoading = false
                console.log('addCoupon', response.data)
                if (!response.data.success) {
                    vm.couponed = false
                }
                vm.coupon_code = ''
                vm.getCarts()
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
                            this.$router.push(`/checkout/checkoutcomplete/${response.data.orderId}`)
                        }
                    })
                } else {
                    vm.isLoading = false
                    this.$bus.$emit('message:push', '欄位不完整', 'danger')
                }
            });
        },
        goback() {
            this.$router.go(-1)
        },
    },
    created() {
        this.getCarts()
    }
}
</script>

<style>
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
</style>
