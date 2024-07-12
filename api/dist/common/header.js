"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHeaders = void 0;
var xCsrfToken = 'iPSBXzCJ-oiB9-G5xkZJ-Dc7bfAZIYTlJ994';
var cookie = 'consumer=default; DCO=wdc; _csrf=NwFK8ON4fIdLN1HdLP5f5vDe; atrc=f615aee9-d84a-49f0-9404-2483c3250cbb; cookiePreferences=%7B%22experience%22%3Atrue%2C%22advertising%22%3Atrue%7D; referrer=dGVzY28uc2s-L2dyb2Nlcmllcy9zay1TSy8; _abck=2052186285CCAD773D2831010FECC57F~0~YAAQNElnaGPQoFOQAQAAjnmEpgx8XjAQWcMUn5SNQPs6VwZhhuUMHEmwS12vt3XCQHB4d6VmpsbXB+bqYg0WU9FD3shA6AdVnXQwRYS4Dw8O32QLEtkFB/R9dsiir3PuEKnGLqCCREuEBl6JINzVDLg4Q7nfQeqSoS8NDb81IkkTWQ++dNkmWKsBxgrlzpWKjJGg6/miixbkM+BcTrL38oFDQwzBqPZdnHzm/lT2t2LHhIx4gyny9JtAHsH2LJOnXBBIflOgUUSM40TTgTKcW8ec+xNwuFkpGfo4LVmvLQcDNNJsch8KtK0alWm7O4XbZrhbR7aOYARRVGmQ4SlXmKAE280gzRR9sezVoPtIz6CZnxpHqKXvBrChGnzO0m9b+WlfNKSFDlPP70PUz3v3qKdcKf2FKxc=~-1~-1~1718367542; ak_bmsc=F90BAA0EA63C877CF5F1779A0C68B73E~000000000000000000000000000000~YAAQNElnaGTQoFOQAQAAjnmEphgCTxAffZ86TF7OJfhsMcfwrh1e/4VjqBYdmqBqvsI/qm6zkzEslegtk/asy2ShmW9QDi5BChjVQBGZdotFl9rqvy8HV86Vy1mw0EHOdzAC88J6DiohDsAhipFJe6sG6EJZZTfqLhHuMvtr4lrw8XTKFwWq2Te8lJuYm/oKfrIzqICv3iUj5XsGxeIHhMUJ7P+3aYUmVWspa6KMw++T2SLNQ0QZemoPplR/Uajr7ho9MWcpdCA1XN6vwcEyqsADenhjFVbF4dwnhS5LTcPZFN1VMQPmogIU1J/IsL6bRFe8VVoKoOkqoCt5Zq0AuW12PCg3WcnlOTGZVD06RIFFqrrj/rnX1Gy4PgtpIKrBBapqKHNdcoO2eg==; bm_sz=8B8F1850EE03ADEB174D280F61C9CEEB~YAAQNElnaGbQoFOQAQAAjnmEphgDiLOLlBDVGyqalBT/156ZD7aGnLcXnZYnO7vqqQg/j7lYrursO6FTGWuHNGqTX8/sLRtAExcbwPX8hdq5kkiJ3t6CgiqZZFY2s2tV7rDpZdQt/lIKTVXYQqBiVvua55QYy9BZlMZ9VeS8RYlnVdXlYELxOAgXSJeihjqLg9/B4nx+jewtW3wbf99qK1Yd+GGXXAbp8CvwS7TCvUSzHXrwMRrIwLz+0BYBIhV5Jc8iujonVPWkK6uNXe2XkvSJb+IrywkxfNKegGRgKSG9AUDgBwTKATWn3BR5K/1Sp+K8eYBZGV4qKhk5ddgudem9l29XWCHOvQVCKKoRCtDh5ORhJOH7Z8NjK1d5DRgF3mT+grCHpJFeULrHeIo=~4474436~4404276; ighs-sess=eyJzdG9yZUlkIjoiMjEwMDQiLCJsb2NhdGlvblV1aWQiOiI0MDkxNWFhYy1iY2Q5LTRjMjktODVmNy1mMWNiODgyNDFmNmQiLCJhbmFseXRpY3NTZXNzaW9uSWQiOiIwM2VlNzk4YWE2N2ZiMzU5NDA4MGVmZjJlZTNlYTE5MCIsInJlcXVlc3RCYWNrdXBzIjpbeyJpZCI6ImNlMDg2MzJlLTkyZjUtNGYzNi04OTcwLWEwOTZmMzYxYzVkNiIsIm1ldGhvZCI6IlBPU1QiLCJ1cmwiOiIvZ3JvY2VyaWVzL2NiZC1ycHQiLCJib2R5Ijp7ImVsIjoidHJ1ZSIsIl9jc3JmIjoiaVBTQlh6Q0otb2lCOS1HNXhrWkotRGM3YmZBWklZVGxKOTk0In0sInRpbWVzdGFtcCI6MTcyMDc4MDYxODczNn1dfQ==; ighs-sess.sig=cLGTSRstvzi1J8KLiJoMlNUZQy4; akavpau_slovakia_vp=1720780930~id=8794e346bef9d2632f75b0a0cb8bdc2d; bm_sv=36AF13F7D27ED82EF4B2DD5C06AB3E53~YAAQNElnaNnQoFOQAQAAzqiEphjafQBwLBk3uC8Sjaq4/TdPg20pgMckwc5xlIDkoqDO0z5S3TOaaeBYOoGa7veJl8mr5CqDIY/BiL5XHODeNBE9Qpj3XdUw+GhdEJ24+pRVnYv+v9ALoVyNCzGixGfoHRtuRxOqc8cZn7hDqGDtQOPoZsZtJpVfLi27KgpgGJCX7HgTh5rmymKwTETjqiQhsxwTwqufXRkkePPs9wh4ncxzl4tNvGs3k0HAAag=~1';
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