// 高德map   https://webapi.amap.com/maps?v=1.4.11&key=你的高德地图的key
export default function MapLoader() {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve(window.AMap);
    } else {
      var link = document.createElement("link");
      link.type = "text/css";
      link.rel = "stylesheet";
      link.src = "https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css";
      document.head.appendChild(link);

      var scriptSecuruty = document.createElement("script");
      scriptSecuruty.type = "text/javascript";
      scriptSecuruty.text = "window._AMapSecurityConfig = {securityJsCode: '7a21e7841e7e9d3284b5cf72c49b0882'};"
      document.head.appendChild(scriptSecuruty);

      // 引入，注意链接要用https://
      // 插件，plugin=AMap.Driving
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "https://webapi.amap.com/maps?v=1.4.15&key=914bc9e5440aca8fcc92bbb5f2c3a4f2&plugin=AMap.Driving";
      script.onerror = reject;
      document.head.appendChild(script);

      var script1 = document.createElement("script");
      script1.type = "text/javascript";
      script1.async = true;
      script1.src = "https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js";
      script1.onerror = reject;
      document.head.appendChild(script1);

      var script2 = document.createElement("script");
      script2.type = "text/javascript";
      script2.async = true;
      script2.src = "https://cache.amap.com/lbs/static/addToolbar.js";
      script2.onerror = reject;
      document.head.appendChild(script2);
    }

    window.initAMap = () => {
      resolve(window.AMap);
    };
  });
}
