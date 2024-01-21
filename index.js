import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const url = 'https://vue3-course-api.hexschool.io/v2'; // 請加入站點
const path = 'rock'; // 請加入個人 API Path
createApp({
    data() {
        return {
            emailInput: "",
            pwInput: ""
        }
    },
    methods: {
        login() {
            const username = this.emailInput;
            const password = this.pwInput;
            const user = {
                    username,
                    password
                }
                // #2 發送 API 至遠端並登入（並儲存 Token）
            axios.post(`${url}/admin/signin`, user).then((res) => {
                const {
                    token,
                    expired
                } = res.data
                document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
                alert(res.data.message)
                    //console.log(res)
                location.href = './products.html';
            }).catch((error) => {
                //console.dir(error)
                alert(error.response.data.message)
            })
        },
    },
}).mount('#app')