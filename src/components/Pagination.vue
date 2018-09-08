<template>
    <div>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item mr-2" :class="{'disabled': !pagination.has_pre}">
                    <a class="page-link-custom" href="#" aria-label="Previous" @click="pageMethod(pagination.current_page - 1)">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                    </a>
                </li>
                <li class="page-item mr-2" :class="{'active': pagination.current_page === page}" v-for="(page, index) in pagination.total_pages" :key="index">
                    <a class="page-link-custom" href="#" @click="pageMethod(page)">{{ page }}</a>
                </li>
                <li class="page-item mr-2" :class="{'disabled': !pagination.has_next}">
                    <a class="page-link-custom" href="#" aria-label="Next" @click="pageMethod(pagination.current_page + 1)">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import $ from 'jquery';
export default {
    name: 'Pagination',
    props: ['pagination'],
    methods: {
        pageMethod(page) {
            this.$emit('pageMethod', page)
        }
    },
    //因為元件化之後使用a連結會導致連結跑掉
    beforeUpdate() {
        console.log('thisPagination',this.$root._route.fullPath)
        const vm = this
        $(document).ready(function(){
            let href = vm.$root._route.fullPath
            console.log('href', href)
             $('.page-link-custom').attr('href', '#'+href)
        })
    },
}
</script>

<style scoped>
.pagination a {
    display: block;
    font-size: 14px;
    padding: 3px 10px;
    color: blue;
    border: 1px solid transparent;
    text-decoration: none;
    line-height: 1.5;
}
.page-link-custom {
    border-radius: 100%;
    width: 30px;
    height: 30px;
    padding: 0;
}
.page-link-custom:hover {
    background-color: rgb(184, 239, 243);
}
.page-item.active {
    background-color: rgb(184, 239, 243);
    border-radius: 100%;
    width: 30px;
    height: 30px;
}
</style>
