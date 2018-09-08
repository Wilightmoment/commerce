<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right mt-4">
            <div class="btn btn-myy text-bold " @click="openModal(true)">建立新產品</div>
        </div>
        <table class="table mt-4 table-hover">
            <thead>
                <tr>
                    <th class="text-center" width="120">分類</th>
                    <th>產品名稱</th>
                    <th class="text-right" width="120">原價</th>
                    <th class="text-right" width="120">售價</th>
                    <th class="text-center" width="120">是否啟用</th>
                    <th class="text-center" width="120">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in products" :key="item.id">
                    <td class="text-center">{{ item.category }}</td>
                    <td>{{ item.title }}</td>
                    <td class="text-right">{{ item.origin_price | currency}}</td>
                    <td class="text-right">{{ item.price | currency}}</td>
                    <td class="text-center">
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else class="text-danger">未啟用</span>
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <div class="btn btn-outline-primary" @click="openModal(false, item)">編輯</div>
                            <div class="btn btn-outline-danger" @click="opendelModal(item)">刪除</div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- openModal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-myy text-myr">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span class="text-bold">新增產品</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label for="image">輸入圖片網址</label>
                                    <input type="text" class="form-control" id="image" placeholder="請輸入圖片連結" v-model="tempProduct.imageUrl">
                                </div>
                                <div class="form-group">
                                    <label for="customFile">或 上傳圖片
                                        <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                                    </label>
                                    <input type="file" id="customFile" class="form-control" ref="files" @change="uploadFile">
                                </div>
                                <img :src="tempProduct.imageUrl" class="img-fluid" alt="">
                            </div>
                            <div class="col-sm-8">
                                <div class="form-group">
                                    <label for="title">標題</label>
                                    <input type="text" class="form-control" id="title" placeholder="請輸入標題" v-model="tempProduct.title">
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="category">分類</label>
                                        <input type="text" class="form-control" id="category" placeholder="請輸入分類" v-model="tempProduct.category">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="price">單位</label>
                                        <input type="unit" class="form-control" id="unit" placeholder="請輸入單位" v-model="tempProduct.unit">
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="origin_price">原價</label>
                                        <input type="number" class="form-control" id="origin_price" placeholder="請輸入原價" v-model="tempProduct.origin_price">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="price">售價</label>
                                        <input type="number" class="form-control" id="price" placeholder="請輸入售價" v-model="tempProduct.price">
                                    </div>
                                </div>
                                <hr>

                                <div class="form-group">
                                    <label for="description">產品描述</label>
                                    <textarea type="text" class="form-control" id="description" placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="content">說明內容</label>
                                    <textarea type="text" class="form-control" id="content" placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
                                </div>
                                <div class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="is_enabled" v-model="tempProduct.is_enabled" :true-value="1" :false-value="0">
                                        <label class="form-check-label" for="is_enabled">
                                            是否啟用
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updatedProduct">確認</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- delModal -->
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>刪除產品</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除
                        <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="removeProduct">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- pagination -->
        <Pagination :pagination="pagination" @pageMethod="getProducts"></Pagination>
    </div>
</template>


<script>
import $ from 'jquery'
import Pagination from '../Pagination'
export default {
    components: { Pagination },
    data() {
        return {
            products: [],
            tempProduct: {},
            isNew: false,
            isLoading: false,
            status: {
                fileUploading: false
            },
            pagination: {}
        }
    },
    methods: {
        getProducts(page = 1) {
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products?page=${page}`
            const vm = this
            vm.isLoading = true
            this.axios.get(api).then((response) => {
                // console.log(response.data)
                if (response.data.success) {
                    // console.log(this.$root._route.fullPath)
                    vm.products = response.data.products
                    vm.pagination = response.data.pagination                    
                }
                vm.isLoading = false
            })
        },
        openModal(isNew, item) {
            if (isNew) {
                this.tempProduct = {}
                this.isNew = true
            } else {
                this.tempProduct = Object.assign(item)
                this.isNew = false
            }
            $('#productModal').modal('show')
        },
        opendelModal(item) {
            this.tempProduct = Object.assign(item)
            $('#delProductModal').modal('show')
        },
        updatedProduct() {
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`
            let axiosMethod = 'post'
            const vm = this
            if (!vm.isNew) {
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`
                axiosMethod = 'put'
            }
            this.axios[axiosMethod](api, { data: vm.tempProduct }).then((response) => {
                console.log('update', response.data)
                if (response.data.success) {
                    $('#productModal').modal('hide')
                    this.getProducts()
                } else {
                    console.log(response.data.message)
                    vm.$router.push('/login')
                }
            })
        },
        uploadFile() {
            const uploadedFile = this.$refs.files.files[0]
            const vm = this
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`
            //上傳檔案需要模擬以前form的格式進行上傳
            const formData = new FormData()
            //圖片上傳的name = file-to-upload (後台設定)
            formData.append('file-to-upload', uploadedFile)
            //loading效果
            vm.status.fileUploading = true
            this.axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                console.log('uploadFile', response.data)
                if (response.data.success) {
                    vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl)
                } else {
                    this.$bus.$emit('message:push', response.data.message, 'danger')
                }
                vm.status.fileUploading = false
            })
        },
        removeProduct() {
            const vm = this
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`
            this.axios.delete(api).then((response) => {
                console.log('removeProduct', response.data)
                if (response.data.success) {
                    $('#delProductModal').modal('hide')
                    this.getProducts()
                }
            })
        }
    },
    created() {
        this.getProducts();
    },
}
</script>

<style scoped>
.btn-myy {
    border-radius: 25px;
}
.text-bold{
    font-weight: bold;
}
</style>

