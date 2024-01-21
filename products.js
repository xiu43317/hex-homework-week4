// 產品資料格式
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1", )
axios.defaults.headers.common['Authorization'] = token;
const url = 'https://vue3-course-api.hexschool.io/v2'; // 請加入站點
const path = 'rock'; // 請加入個人 API Path
let myModal = '';
let delModal = '';
const app = createApp({
    data() {
        return {
            products: [],
            isNew: true,
            tempProduct: {
                imagesUrl: [],
            }
        }
    },
    methods: {
        checkLogin() {
            axios.post(`${url}/api/user/check`).then((res) => {
                //console.log(res.data);
                this.getProducts();
            }).catch((error) => {
                //console.dir(error)
                location.href = './index.html';
            })
        },
        getProducts() {
            axios.get(`${url}/api/${path}/admin/products`)
                .then((res) => {
                    //console.log(res.data.products);
                    this.products = res.data.products;
                })
                .catch((error) => {
                    console.dir(error)
                })
        },
        openModal(status, item = {}) {
            if (status === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                myModal.show();
                this.isNew = true
            } else if (status === 'edit') {
                this.tempProduct = {...item }
                myModal.show();
                this.isNew = false;
            } else if (status === 'delete') {
                this.tempProduct = { ...item }
                delModal.show();
            }

        },
        updateProduct() {
            if (this.isNew) {
                axios.post(`${url}/api/${path}/admin/product`, { data: this.tempProduct })
                    .then((res) => {
                        alert(res.data.message);
                        this.getProducts();
                        myModal.hide();
                    })
                    .catch((error) => {
                        alert(error.response.data.message);
                        myModal.hide();
                    })
            } else {
                axios.put(`${url}/api/${path}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct })
                    .then((res) => {
                        alert(res.data.message)
                        this.getProducts();
                        myModal.hide();
                    }).catch((error) => {
                        alert(error.response.data.message)
                        myModal.hide();
                    })
            }
        },
        deleteProduct() {
            axios.delete(`${url}/api/${path}/admin/product/${this.tempProduct.id}`)
                .then((res) => {
                    alert(res.data.message)
                    this.getProducts();
                    delModal.hide();
                }).catch((error) => {
                    alert(error.response.data.message)
                    delModal.hide();
                })

        }
    },
    mounted() {
        // myModal = new bootstrap.Modal(document.querySelector('#productModal'))
        delModal = new bootstrap.Modal(document.querySelector('#delProductModal'))
        this.checkLogin();
    }

})

app.component('edit-product',{
    data() {
        return {
            
        }
    },
    methods: {
        
    },
    template:`#edit-product`,
})

app.component('delete-product',{
    data() {
        return {
            
        }
    },
    props:['productId'],
    methods: {
        delProduct() {
            this.$emit('del-product',this.productId)
        }
    },
    template:`#delete-product`,
})

app.mount('#app')