"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHeaders = void 0;
var xCsrfToken = 'LlEcNxQY-BLzlWIbh9Bj21wwUnZ_yIRe84ik';
var cookie = 'consumer=default; DCO=wdc; _csrf=dLiR7nL7mg98kyllxMs6LS_i; atrc=f615aee9-d84a-49f0-9404-2483c3250cbb; referrer=dGVzY28uc2s-L2dyb2Nlcmllcy9zay1TSy8; cookiePreferences=%7B%22experience%22%3Atrue%2C%22advertising%22%3Atrue%7D; _abck=2052186285CCAD773D2831010FECC57F~0~YAAQBk4SAtK1QFSQAQAAhRqdcwyswnGf3zWEewQDV4UMFH58OmRn7Tezs++Mw7hOQM/kZL1gBKMqodf7XWgOsZ59PHFTwuDKcEr6LuNeE0Zfgzp9k6K1v0wNaZu2dYiDH1glF/1cIjfBVMoUxDBM/yTuWvjpf398IGSxG/vF50usyIAaS5Qib1z2fh3hqp3aGtrwNNXWvbM16a1vTKVjoL0UNGmlJtdveNdj2zJTt/lYQJboNa7sYtnzYw67q4IoB/ixUJbXZ0Zao0983E+gKP6VBNKP2YCa1lJLGAX5Obln0uOv/J+wok0Vw2ye9CmfsPlcTCa8gKbdbN8zUAolVpxqsIEV9AxZVjfZHH+3LEG+6ruRXLhVTIgrOUjmbKYLX8kQrIXgSX/AypeikJiE8rMgeyP/AL8=~-1~-1~1718367542; bm_sz=B8E9765B4D307C5714D226AD1272267D~YAAQBk4SAtW1QFSQAQAAhRqdcxjJAUINkvK1R2pGnECOidcI7iEKXmDxVTIFwSi0e6V9JfJENk17LxJbaBJZKnTN1L2T2Ddl9jwnO+srcQQAhscK/yq2j8xn+Lfv0ikqY/VQrIUitOaLiSYKVhZgk2BlyZEFQek5wc1zSalZEcdNSDr6FrHx2TFnI7bqL5oP5zWClQgbmKDuR6x3PjmLNu+xioznLc2xtfeU+1MSn5g/bdIZcxSpk05oY6+G0tKzwz8r/9CR/t6PtOnUeQvLBb0z/seGtrxBNFrYT1LBP89DLlFaFDj+2wnlBNGGOBOou7FLQ8GL7FFNf6VEwx+vj8xoMaz9MOb7oBDzyStU3JQjfrxuCpEYAgcpYnY9sIc0WfHvbcf4q8A4yM+tvRM=~4534841~3622454; ighs-sess=eyJzdG9yZUlkIjoiMjEwMDQiLCJsb2NhdGlvblV1aWQiOiI0MDkxNWFhYy1iY2Q5LTRjMjktODVmNy1mMWNiODgyNDFmNmQiLCJhbmFseXRpY3NTZXNzaW9uSWQiOiI4ZjhhNDE2NzA2MGQ2NjhjMDQzN2I0YzZmMjllMTFjNCIsInJlcXVlc3RCYWNrdXBzIjpbeyJpZCI6IjM5NTRmYzNkLTRmOTAtNDFkZC05Mjk0LWFlY2UxYjE1ZmE1YyIsIm1ldGhvZCI6IlBPU1QiLCJ1cmwiOiIvZ3JvY2VyaWVzL2NiZC1ycHQiLCJib2R5Ijp7ImVsIjoidHJ1ZSIsIl9jc3JmIjoiTGxFY054UVktQkx6bFdJYmg5QmoyMXd3VW5aX3lJUmU4NGlrIn0sInRpbWVzdGFtcCI6MTcxOTkyNjU5NDg3M31dfQ==; ighs-sess.sig=lDT2xz3os6GpjODLJwsSf38K5SA; akavpau_slovakia_vp=1719926906~id=0920ce120e075aad9d90b661c87ea0d0; ak_bmsc=2B1B24ED3D0C254D64D91FB33B72E051~000000000000000000000000000000~YAAQBk4SAl65QFSQAQAAzEqdcxjQcc44vcoOK5kmmlNlVdG1MiGuLxDBoFlZ6wv5FIho5LxHHu4caumQ2SRd3UHeNwQoMX1Yx76Af+RW2oh/aFPd9VMirBzGUUX30aQyzZgvNJTiA2jHSnVAes6iR1+7CaasdV9sBwPZ/RfdxJbQGxskBYN5Urf/QXHlbOey4UNWBswGvPtUWIiZyNm7xzB2Ilz9VOwikmLB/cYpPirnwfoQWJkAtpbwJn5uOYeQKc31KODqYnzhlHNGZUwhLSzfjEsyz9frY5erMh3syjtenGmOTU5Iyn73r50+ec9mBGU5gxyTbx2C1s6e4zukBuyxpif28hfUnZaKmDtp5P6Y8ibHdTbFAvxuCcQSJjsALhlVRo0ulWeXepeJVZVqWD1+OOOKmpiOmJXXiOKev15Tl0qRc+5dQwpWcYWhw0xKdTYYZqwqj0DQKsV9pFYvmWVCjQ==; bm_sv=F67A90718761E41E63CD0BA214EB578D~YAAQBk4SAl+5QFSQAQAAzEqdcxjpJ4eFfhwD7ekk6mdbC008sXZzurBkOINtLcrwak8lU+152XWXic+5jVkVmrfvTUV9Sqlnutnr4jMN0sHyxCjQ4gtSJfOXu5HgWqwePUXYoK6+p8BMojxxsNJljYE2LP265Bz+tr1kmq0FBpsfGerJZAyr2i1+8p+vFqd552tOM5Dp3WM7omRHe1pojYygzDrM2XmsCIChcimrhsht3b10/M0m6o22xFL1WII=~1';
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