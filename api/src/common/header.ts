// src/common/headers.ts


var xCsrfToken = '6BIqqgaw-xNu_ohkiIr5tQBFNXzEQVOQHR3s';
var cookie = 'consumer=default; DCO=wdc; _csrf=dLiR7nL7mg98kyllxMs6LS_i; atrc=f615aee9-d84a-49f0-9404-2483c3250cbb; referrer=dGVzY28uc2s-L2dyb2Nlcmllcy9zay1TSy8; cookiePreferences=%7B%22experience%22%3Atrue%2C%22advertising%22%3Atrue%7D; _abck=2052186285CCAD773D2831010FECC57F~0~YAAQBk4SAvcFblSQAQAAiXN0dwzivKSyBZ9FU1fA6nFozAzKXRcmkEjuHqQWEl5usqpCXTNIXGHlDYumvteCRz7g8fn4gG84HXXdsPCAsLeOlaz5xJn4hbxeJjapfCwCtCyHAlVjaybMcaDczF0ZMlvpYea4hfPVX76lVGzlFPVj/8FongsRbzW6Dfy9PGwczcWVMURq/0PWyIxba91IwrlKjZYg/Ud3n/+95m748wiAaVF2fU2xzWOWbGcrTECy3malpMNsGUisVxP2hCXAeBwMhmhxjSB7T0RZrjE7OARXQIdt1YYLq9UVL2JzGO8INOLRcaiXDBMLHfXI1q4ITQh1DP+hj5YnMIkD23IlNrWC9EVMOf1xEzmGu1FcBoM5VzV0IUa9/M4ajrmDOtXUm1ecmpFMh34=~-1~-1~1718367542; ak_bmsc=54396798048AFCE25E557AE46499F2D6~000000000000000000000000000000~YAAQBk4SAvgFblSQAQAAiXN0dxjY0WPNYRXi8ZGI+w3uo0PvjHxhrK2nn11azf0Or8toYl4gSeXiihSAGcO6yR+OSPNoC0F3+li0S7KxJNcvWy8BvsJhuBYGujgE2RIMKRObRaR9qC2LyigvA+r1WN7/jR70lZvhTPG+2cEsogOgsO5zP9ROOA53OAQSuqRUKVIWKd4/8pcM8ajMtCOn4HG4Glj1WZgCUSi0IAiklF4hdWEvhVg6wl9Fzwpo1K52Slvpe69/o9KrkHbtDltVTScW4q97ltd7FXOkrYanF+YuJgG/ac6vxKwGo/CNv7Vf0BfBft6gob9lIVdaEtYQD6tOWsOISUkKPOYUmvPSJ/IqnDp5/QML/VuyIvuLePBMOXf8D14DxnxEYA==; bm_sz=F8778AF53BD8B79260BBA130024C71DA~YAAQBk4SAvoFblSQAQAAiXN0dxgDXU98bWViNe/WKwbUb/IPbcfarafDDQNLChoFIWruYgAAlnCEhIuXkGZE8YcjYgFyuqcsYw1TSEQfSeuyWFAcoyLJ58kNyGoL9Vy3n0jc0Qiv6Axi2mbnX7k0n/9+efD5jRhmSu8c2AzvmOla1Ht7kkC/xo2lq4M9hZHylWS8V8lw5U4ecxW/thV6UHilu2+nGSmjeCJxsG0Ektg2h6Lxv5Htm6OBl4vAAcwjumJ3VApoNe0KSX+oAZzdoVjBMDRWEOXfFigZGWU11ls8I6xrx2ViRuhA9kRMsLVufaNxYP0of3nRy/eL6xy16jh6YiD5dVn5FBPphS0nmBiBg4R210fGuJyH1B/VCsq8R8EXfPscxNMaJcB31Ho=~4469809~4338481; ighs-sess=eyJzdG9yZUlkIjoiMjEwMDQiLCJsb2NhdGlvblV1aWQiOiI0MDkxNWFhYy1iY2Q5LTRjMjktODVmNy1mMWNiODgyNDFmNmQiLCJhbmFseXRpY3NTZXNzaW9uSWQiOiIzMGVhOGE5ZTFiZTllNDcyNDIxZjc2YWVkZjQ1NDQxYiIsInJlcXVlc3RCYWNrdXBzIjpbeyJpZCI6IjNmMjg2ZDljLWJjYTMtNDI1MC04Yzc5LWIxMWE5YTY0ZjgwMyIsIm1ldGhvZCI6IlBPU1QiLCJ1cmwiOiIvZ3JvY2VyaWVzL2NiZC1ycHQiLCJib2R5Ijp7ImVsIjoidHJ1ZSIsIl9jc3JmIjoiNkJJcXFnYXcteE51X29oa2lJcjV0UUJGTlh6RVFWT1FIUjNzIn0sInRpbWVzdGFtcCI6MTcxOTk5MTAzOTUwMn1dfQ==; ighs-sess.sig=n2gDHRJMyd_WfpeizTIQND2e5NY; akavpau_slovakia_vp=1719991356~id=0ae56c5ffb01206b747f6ae9621d38bc; bm_sv=E9B9C66A7E23238FE55874D5A352C5E4~YAAQBk4SAikKblSQAQAA/bh0dxjd3DeTcsgXlSCmMhFfrQGEJb0FTAgRV0Dj2wFohDTwbUt4q6NVDnUBBZWY7iSrKG8kFqoPiK2VuPF23dX03t5PnUvPMjkdfEnFGXE11rX50urN3aF+PjWSBac7dG+qJo0gPxenUf6Bv1I/T0jQXuywWVw+o9QDcw87wyXo2H5uy/VyZHYwA9mn6s9cNvteWdM8SnHnHRgWU25k6IekIKt/c7QA4zrmtHp8sz8=~1';


export const defaultHeaders = {
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

