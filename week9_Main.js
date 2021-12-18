// 請代入自己的網址路徑
const api_path = "peiying";
const token = "zsYAPcI9hNMISTqubJAtNmAN2Rn1";
const url= "https://livejs-api.hexschool.io";

init()
function init(){
    getProductList();
    getCartData()
    
}

//獲取產品資料
let productsData;
function getProductList(){
    let urlApi=url+`/api/livejs/v1/customer/${api_path}/products`
    axios.get(urlApi).then(function(renponse){
        productsData=renponse.data.products;
        renderProductList()
        
    })
    .catch(function(error){
        console.log(error)
    })
}

//印出產品
const productWrap=document.querySelector('.productWrap');
function renderProductList(){
    let str='';
    console.log()
    
    productsData.forEach(function(item){
        str+=renderProductsDataItem(item);
    })
    productWrap.innerHTML=str;
}

let cartListData;
let cartListTotal;
//加入購物車，如果id已有加入，則原有的數量+1
productWrap.addEventListener('click',function(e){
    e.preventDefault();
    let id=e.target.getAttribute('data-id')
    let numCheck=0;
    cartListData.forEach(function(item){
        if(item.product.id==id){
            numCheck=item.quantity+1
        }
    })
    addCartNum(id,numCheck)
})

function addCartNum(id,num){
    let urlApi=url+`/api/livejs/v1/customer/${api_path}/carts`
    axios.post(urlApi,{
        "data": {
            "productId": id,
            "quantity": num
        }
        })
        .then(function(response){
            console.log(response)
            getCartData()
        })
        .catch(function(error){
            console.log(error)
        })
}



//獲取購物車資料
function getCartData(){
    let urlApi=url+`/api/livejs/v1/customer/${api_path}/carts`
    axios.get(urlApi).then(function(response){
        cartListData=response.data.carts;
        cartListTotal=response.data.finalTotal
        renderCatList()

    })
    .catch(function(error){
        console.log(error);
    })
}

const tbody=document.querySelector('.js_tbody');
//加入購物車>印出購物車列表
function renderCatList(){
    console.log(cartListData)
    const strTotal=document.querySelector('.js-total');
    strTotal.innerHTML=`<td class="js-total">NT$ ${cartListTotal}</td>`
    let str=''
    cartListData.forEach(function(item){
        str+=`<tr class='js_cartList'>
        <td>
            <div class="cardItem-title">
                <img src="${item.product.images}" alt="">
                <p>${item.product.title}</p>
            </div>
        </td>
        <td>NT$${ThousandsTool(item.product.price)}</td>
        <td>${item.quantity}</td>
        <td>NT$${ThousandsTool(item.product.price*item.quantity)}</td>
        <td class="discardBtn">
            <a href="#" class="material-icons" data-id="${item.id}">
                clear
            </a>
        </td>
    </tr>`
    })
    tbody.innerHTML=str;
}
//刪除單一品項
tbody.addEventListener('click',function(e){
    e.preventDefault();
    if(e.target.getAttribute('class')=='material-icons'){
        let id=e.target.getAttribute('data-id')
        let urlApi=url+`/api/livejs/v1/customer/${api_path}/carts/${id}`
        axios.delete(urlApi)
        .then(function(response){
            console.log(response)
            getCartData()
        })
        .catch(function(error){
            console.log(error)
        })
    }
})

//刪除所有品項
const discardAllBtn=document.querySelector('.discardAllBtn');
discardAllBtn.addEventListener('click',function(e){
    e.preventDefault();
    let urlApi=url+`/api/livejs/v1/customer/${api_path}/carts`
    axios.delete(urlApi).then(function(response){
        console.log(response);
        getCartData()
    })
    .catch(function(error){
        console.log(error)
    })
})

//篩選品項列表
const productSelect=document.querySelector('.productSelect')
productSelect.addEventListener('change',function(e){
    e.preventDefault();
    console.log(e.target.value)
    let str=''
    productsData.forEach(function(item){
        if(e.target.value==item.category){
            str+=renderProductsDataItem(item)
        }else if(e.target.value=='全部'){
            str+=renderProductsDataItem(item)
        }
        
    })
    productWrap.innerHTML=str;
})
//印出產品列表的HTML結構
function renderProductsDataItem(item){
    return `<li class="productCard">
            <h4 class="productType">${item.category}</h4>
            <img src="${item.images}" alt="">
            <a href="#" class="addCardBtn" data-id="${item.id}" >加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${ThousandsTool(item.origin_price)}</del>
            <p class="nowPrice">NT$${ThousandsTool(item.price)}</p>
            </li>`;
}

//送出訂單
const orderInfo_btn=document.querySelector('.orderInfo-btn');
orderInfo_btn.addEventListener('click',function(e){
    e.preventDefault();
    //欄位驗證
    let error=validate(orderInfo_form, constraints)
    if(error){
        return validatejs(error)
    }
    //購物車有項目才能送出訂單
    if(cartListData.length<1){
        return alert('目前購物車沒有品項')
    }else{
        const customerName=document.querySelector('#customerName');
        const customerPhone=document.querySelector('#customerPhone');
        const customerEmail=document.querySelector('#customerEmail');
        const customerAddress=document.querySelector('#customerAddress');
        const tradeWay=document.querySelector('#tradeWay');
        const orderInfo_form=document.querySelector('.orderInfo-form')

        let urlApi=url+`/api/livejs/v1/customer/${api_path}/orders`
    axios.post(urlApi,{
        "data": {
            "user": {
                "name": customerName.value,
                "tel": customerPhone.value,
                "email": customerEmail.value,
                "address": customerAddress.value,
                "payment": tradeWay.value
            }
        }
    }).then(function(response){
        console.log(response);
        getCartData()
        orderInfo_form.reset()
        alert('訂單已送出')
    })
    .catch(function(error){
        console.log(error)
    })
    }
    
})

//欄位驗證
const orderInfo_form=document.querySelector('.orderInfo-form')
const inputs=document.querySelectorAll('input[type=text], input[type=tel], input[type=email]')
let constraints={
    '姓名':{
        presence: {
            message: "^必填"
        }
    },
    '電話':{
        presence: {
            message: "^必填"
        }
    },
    'Email':{
        presence: {
            message: "^必填"
        }
    },
    '寄送地址':{
        presence: {
            message: "^必填"
        }
    }
}

function validatejs(error){
    inputs.forEach(function(item){
        console.log(item)
        item.nextElementSibling.textContent='';
        let errorAry=Object.keys(error);
        errorAry.forEach(function(keys){
            let errorText=document.querySelector(`[data-message=${keys}]`)
            errorText.textContent=error[keys]
        })
    })
    
}

function ThousandsTool(x) {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
    return parts.join("."); 
}