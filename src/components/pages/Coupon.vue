<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right mt-2">
            <button class="btn btn-primary mt-2" @click.prevent="openModal(true)">建立新的優惠劵</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th>名稱</th>
                    <th width="190">折扣百分比</th>
                    <th width="150">到期日</th>
                    <th width="150">是否啟用</th>
                    <th width="130">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(coupon, index) in coupons" :key="index">
                    <td>{{coupon.title}}</td>
                    <td>{{coupon.percent}}</td>
                    <td>{{coupon.due_date}}</td>
                    <td>
                        <span v-if="coupon.is_enabled" class="text-success">已啟用</span>
                        <span v-else class="text-danger">未啟用</span>
                    </td>
                    <td>
                        <div class="btn-group btn-group-toggle">
                            <label class="btn btn-outline-primary btn-sm" @click="openModal(false,coupon)">
                                編輯
                            </label>
                            <label class="btn btn-outline-danger btn-sm" @click="openDelModal(coupon)">
                                刪除
                            </label>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <Pagination :pagination="pagination" @pageMethod="getCoupons"></Pagination>
        <!-- CouponModal -->
        <div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">優惠劵</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <div class="form-group">
                                <label for="title">標題</label>
                                <input type="text" class="form-control" id="title" placeholder="請輸入標題" v-model="tempCoupon.title">
                            </div>
                            <div class="form-group">
                                <label for="coupon">優惠碼</label>
                                <input type="text" class="form-control" id="coupon" placeholder="Code" v-model="tempCoupon.code">
                            </div>
                            <div class="form-group">
                                <label for="dateline">到期日</label>
                                <input type="date" class="form-control" id="dateline" v-model="tempCoupon.due_date">
                            </div>
                            <div class="form-group">
                                <label for="percent">折扣百分比</label>
                                <input type="number" class="form-control" id="percent" placeholder="請輸入1-100" v-model="tempCoupon.percent">
                            </div>
                            <div class="form-group">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="tempCoupon.is_enabled" :true-value="1" :false-value="0" id="is_enabled">
                                    <label class="form-check-label" for="is_enabled">
                                        是否啟用
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="upCoupon">更新優惠卷</button>
                    </div>
                </div>
            </div>
        </div>

        <!--deleteModal-->
        <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>刪除優惠券</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除
                        <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠券(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="removeCoupon">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Pagination from '../Pagination'
import $ from "jquery"
export default {
    components: { Pagination },
    data() {
        return {
            isLoading: false,
            pagination: {},
            coupons: [],
            isNew: false,
            tempCoupon: {},
        }
    },
     methods: {
        getCoupons(page = 1) {
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`
            vm.isLoading = true
            this.axios.get(api).then((response) => {
                console.log('getCoupons', response.data)
                if (response.data.success) {
                    vm.coupons = response.data.coupons
                    vm.pagination = response.data.pagination
                } else {
                    if (response.data.message === "禁止使用, 請確認 api_path 是否為本人使用。" || response.data.message === "驗證錯誤, 請重新登入") {
                        vm.$router.push('/login')
                    }
                }
                vm.isLoading = false
            })
        },
        openModal(isNew, item) {
            const vm = this
            if (isNew) {
                vm.tempCoupon = {}
                vm.isNew = true
            } else {
                vm.tempCoupon = item
                vm.isNew = false
            }
            $('#couponModal').modal('show')
        },
        upCoupon() {
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`
            let couponMethod = 'post'
            if (!vm.isNew) {
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`
                couponMethod = 'put'
            }
            this.axios[couponMethod](api, { data: vm.tempCoupon }).then((response) => {
                console.log('upCoupon', response.data)
                if (response.data.success) {
                    $('#couponModal').modal('hide')
                    this.getCoupons();
                } else {
                    console.log('修改失敗', response.data)
                }
            })
        },
        openDelModal(coupon) {
            const vm = this
            vm.tempCoupon = coupon
            $('#delCouponModal').modal('show')
        },
        removeCoupon() {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${this.tempCoupon.id}`
            this.axios.delete(api).then((response) => {
                console.log('removeCoupon', response.data)
                $('#delCouponModal').modal('hide')
                this.getCoupons();
            })
        }
    },
    created() {
        this.getCoupons();
    }
}
</script>