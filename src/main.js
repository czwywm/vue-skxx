import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import scui from './scui'
import i18n from './locales'
import router from './router'
import store from './store'
import { createApp } from 'vue'
import App from './App.vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css' //样式文件
import JsonViewer from 'vue-json-viewer'
import '@/assets/font-family/font-family.css'



const app = createApp(App);

app.use(store);
app.use(router);
app.use(ElementPlus, { size: 'small' });
app.use(i18n);
app.use(scui);
app.use(hljs);
app.use(JsonViewer)


app.directive('highlight', (el) => {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block)=>{
      hljs.highlightBlock(block)
    })
    // let blocks = el.querySelectorAll('pre code')

    // blocks.forEach((block) => {

    //     let ol = document.createElement("ol");

    //     let rowCount = block.outerHTML.split('\n').length;

    //     for (let i = 1; i < rowCount; i++) {


    //         let li = document.createElement("li");

    //         let text = document.createTextNode(i);


    //         li.appendChild(text);


    //         ol.appendChild(li);

    //     }
    //     ol.className = 'pre-numbering';

    //     block.parentNode.appendChild(ol);

    //     hljs.highlightBlock(block)

    // });
})

    //挂载app
    app.mount('#app');
