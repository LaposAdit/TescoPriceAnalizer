"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHeaders = void 0;
var xCsrfToken = 'O8ewVd3s-KAI4ow6XtWv-qZYmeOQwTJ0Dm8Y';
var cookie = 'consumer=default; DCO=wdc; _csrf=NwFK8ON4fIdLN1HdLP5f5vDe; atrc=f615aee9-d84a-49f0-9404-2483c3250cbb; cookiePreferences=%7B%22experience%22%3Atrue%2C%22advertising%22%3Atrue%7D; referrer=dGVzY28uc2s-L2dyb2Nlcmllcy9zay1TSy8; _abck=2052186285CCAD773D2831010FECC57F~0~YAAQNElnaEDAiVOQAQAAs5ZblgxW9adMtK+sPj1+QhP0E9bBBw5UZyQAVChl+Sz8evZuUS8BeAmSlAW2COi6NP6MjhxUA8vxktGP5bafLm0Fy4s93dwLINsMUSgPe5vE86lrEmG6EBiNOD4IsfCD/3bD6IFEVR56cOm5OTeuxGlA0MGJ53bp46zau+DiYXuHRH+/MAVJmEYyA1YUftxnZxLSbwv/QK1EXGGGh82GTVgDv4H0uduPxIQCtdPGTYvbrgLGGfOcT56IdXkxI3TLOxBfqOIH7dLPi+dOCj6TG0+hdmD6OUIVRFw+s4WBZ0DHHPwOTbEi45wFeYkJistzaGsSsknKGbrtGWlNDTGQ42xm7tDKo+cvVCLtVjls/4pMHTNcsdWQFII388msUopqRr423wpQ6xU=~-1~-1~1718367542; ak_bmsc=64A901D313EE47A677ABA77ABA4B4C9A~000000000000000000000000000000~YAAQNElnaEHAiVOQAQAAs5Zblhjm03kOjFChhzpapoouGbiL5vWnNgoEEbEQ9EjccFWmnzuRPHU207Ua/0bWAwVwUcDGjzYgUdxgw1g0eaJSdwPxhO33LlFyIj4JJYfpJ0KN1nq4lVeLTt91mmvIBzMP/dKbzJNcI5NrdgHGkbAy92k/EgsKJVwglZ8phCW/3Gv+xSFyrMDYM76Nhwax59VFsmXY3Bci1vLBELOwNqKyr+ujI6WQOQbatlyaMJXIOXoLDm2IZiOlSREjKBiT6PyCzw0bOGnMX63gBqwIU5pZS5EstNv1amCIfxyaJWkny9gqoJ83ro5d5sf0r3fL6u63xcUXXL4TGaiOdfx00FKnHhn5NpRmCX6KElACy4WLjxhdsoy3QX9Lyg==; bm_sz=AE6C81E762B9FF3AFE6C6B54139DB5A2~YAAQNElnaEPAiVOQAQAAs5ZblhiFUkNj6s7paaqnxUPZqmd7wBI3DXl7ns4YLMc5KWdReLNsv+pxbiKi0Aql81WXj6WuytPktzVdlef2Zcjzql6d+PlzEsCE6ltqDaIM9l04AjfdA4ZculnVen4/IbwRiHcQsfR+jJFi+HDuuc2i8WuOdgwM+wTDkdMsM10YX/gzbMFasRJa7azdKbqejyaY4cKlg927mcRQsS9Dle9wwjLXUvqOjuGbZlWXUXZqZOPqANPT5kUU19048scAxEddi/dgIrwk905uaNGIHuE4qlg0mbRC7rh7BcGiUn7nArugSvmI2eESY0m7bkZ76pc7jEuuLlRwzuWoLPkWJYaZQrS3rX27XnUaH6KEEzWGiaokUsU0Mqk9hJ67Sw0=~3752249~3552578; ighs-sess=eyJzdG9yZUlkIjoiMjEwMDQiLCJsb2NhdGlvblV1aWQiOiI0MDkxNWFhYy1iY2Q5LTRjMjktODVmNy1mMWNiODgyNDFmNmQiLCJhbmFseXRpY3NTZXNzaW9uSWQiOiJhZTcwNzYyMTVlY2Q1MDEzZDA2N2U3ODQwZDM4YmZhMiIsInJlcXVlc3RCYWNrdXBzIjpbeyJpZCI6IjU5Y2I0MDk5LTFiYjQtNDllNi04ZWZmLTIxZTVmZDliYWE1YyIsIm1ldGhvZCI6IlBPU1QiLCJ1cmwiOiIvZ3JvY2VyaWVzL2NiZC1ycHQiLCJib2R5Ijp7ImVsIjoidHJ1ZSIsIl9jc3JmIjoiTzhld1ZkM3MtS0FJNG93Nlh0V3YtcVpZbWVPUXdUSjBEbThZIn0sInRpbWVzdGFtcCI6MTcyMDUwOTUwMzkxMH1dfQ==; ighs-sess.sig=e2NwjFLT5pMjhmx-Z0vZxLQjMk0; akavpau_slovakia_vp=1720509812~id=c6f5cc93988e7f14c9d03ee588d36d80; bm_sv=22BA494C7057DE8D1916DFBD49C34199~YAAQNElnaKDAiVOQAQAAqLxblhit+4E/NmshstLH7W8A60GJJ/j+LuwNAXxrIF6dPXhIrXJxCnWZgCO0VUf8CUSWAkqmPSsqVbIdcezJhzNYgk7TO9CvL6crucuxluVFNX+O1+SbFBgaCam4fdrIcqfry2tKc78MsFIkuTk4RpBxfw9TL9AJxoQff9yyT+e1J4pI2MNGsfm+/FbkOe/2VuMORNnk0a7qEn3SNZIiYdoAAWrpaMFGXc9UpxF9pTY=~1';
exports.defaultHeaders = {
    'accept': 'application/json',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'cookie': `${cookie}`,
    'origin': 'https://potravinydomov.itesco.sk',
    'pragma': 'no-cache',
    'referer': 'https://potravinydomov.itesco.sk/groceries/sk-SK/shop/ovocie-zelenina-a-kvety/all?viewAll=promotion&promotion=4294967272',
    'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'traceparent': '00-bb0414a40d7b2848f2335f9afc7e797b-c21551b32ff1b1ca-01',
    'tracestate': '3296235@nr=0-1-3512954-1134246125-c21551b32ff1b1ca----1717157111146',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'x-csrf-token': `${xCsrfToken}`,
    'x-queueit-ajaxpageurl': 'false',
    'x-requested-with': 'XMLHttpRequest'
};
//# sourceMappingURL=header.js.map