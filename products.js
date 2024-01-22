// 產品資料格式
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1", )
axios.defaults.headers.common['Authorization'] = token;
const url = 'https://vue3-course-api.hexschool.io/v2'; // 請加入站點
const path = 'rock'; // 請加入個人 API Path
let myModal = '';
let delModal = '';
let fileInput;
const app = createApp({
    data() {
        return {
            products: [],
            isNew: true,
            pagination: {},
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
        getProducts(page=1) {
            axios.get(`${url}/api/${path}/admin/products?page=${page}`)
                .then((res) => {
                    //console.log(res.data.products);
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;

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
    },
    mounted() {
        this.checkLogin();
    }

})

app.component('edit-product', {
    data() {
        return {
            
        }
    },
    props: ['isNew', 'tempProduct',],
    methods: {
        updateProduct() {
            if (this.isNew) {
                axios.post(`${url}/api/${path}/admin/product`, { data: this.tempProduct })
                    .then((res) => {
                        alert(res.data.message);
                        this.getProducts();
                        this.hideModal();
                    })
                    .catch((error) => {
                        alert(error.response.data.message);
                        this.hideModal();
                    })
            } else {
                axios.put(`${url}/api/${path}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct })
                    .then((res) => {
                        alert(res.data.message)
                        this.getProducts();
                        this.hideModal();
                    }).catch((error) => {
                        alert(error.response.data.message)
                        this.hideModal();
                    })
            }
        },
        createImages() {
            this.tempProduct.imagesUrl = []
            this.tempProduct.imagesUrl.push('')
        },
        getProducts() {
            this.$emit('getProducts');
        },
        openModal() {
            myModal.show();
        },
        hideModal() {
            myModal.hide();
        },
        uploadFile() {
            //console.dir(fileInput)
            const file = fileInput.files[0]
            //console.log(file)
            const formData = new FormData()
            formData.append('file-to-upload', file)
            axios.post(`${url}/api/${path}/admin/upload`, formData)
                .then((res) => {
                    //console.log(res.data.imageUrl)
                    this.tempProduct.imageUrl = res.data.imageUrl
                }).catch((err) => {
                    //console.dir(err)
                    alert(err.response.data.message)
            })

        },
        uploadFiles(key) {
            let multiImgs = document.querySelectorAll('.uploadImages')
            //console.log(multiImgs[key].files)
            const file = multiImgs[key].files[0]
            const formData = new FormData()
            formData.append('file-to-upload', file)
            axios.post(`${url}/api/${path}/admin/upload`, formData)
                .then((res) => {
                    this.tempProduct.imagesUrl[key] = res.data.imageUrl
                }).catch((err) => {
                    //console.dir(err)
                    alert(err.response.data.message)
            })    
        },
    },
    mounted() {  
        myModal = new bootstrap.Modal(document.querySelector('#productModal'));
        fileInput = document.querySelector('#formFile');
        fileInput.addEventListener('change', this.uploadFile);
    },
    template:`#edit-product`,
})

app.component('delete-product',{
    data() {
        return {
            
        }
    },
    props:['product'],
    methods: {
        deleteProduct() {
            axios.delete(`${url}/api/${path}/admin/product/${this.product.id}`)
                .then((res) => {
                    alert(res.data.message)
                    this.hideModal();
                    this.getProducts();
                }).catch((error) => {
                    alert(error.response.data.message)
                    this.hideModal();
                })
        },
        getProducts() {
            this.$emit('getProducts');
        },
        openModal() {
            delModal.show();
        },
        hideModal() {
            delModal.hide();
        },
    },
    mounted() {
        delModal = new bootstrap.Modal(document.querySelector('#delProductModal'))
    },
    template:`#delete-product`,
})

app.component('pagination', {
    data() {
        return {
    
      }  
    },
    methods: {
        emitPage(item) {
            this.$emit('emit-page',item)
      }  
    },
    props:['pages'],
    template:`#pagination`
})

app.mount('#app')