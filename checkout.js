import listProducts from '../shopping/app.js';

let listCart = [];

let listCartHTML = document.querySelector('.returnCart .list');
let totalQuantityHTML = document.querySelector('.return .totalQuantity');
let totalPriceHTML = document.querySelector('.return .totalPrice');

listCart = JSON.parse(localStorage.getItem('cart'));
console.log(listCart);




function addToCartHTML() {
    let totalQuantity = 0;
    let totalPrice = 0;
    listCartHTML.innerHTML = '';

    if (listCart) {
        listCart.map((cart) => {
            if (cart) {
                let position = listProducts.findIndex((value) => value.id == cart.product_id);
                let info = listProducts[position];
                let newProduct = document.createElement('div');
                newProduct.classList.add('item');
                newProduct.innerHTML = `<img src="${info.image}" alt="">
                <div class="info">
                    <div class="name">${info.name}</div>
                    <div class="price">$${info.price}</div>
                </div>
                <div class="quantity">${cart.quantity}</div>
                <div class="returnPrice">$${cart.quantity * info.price}</div>`;

                listCartHTML.appendChild(newProduct);
                totalQuantity += cart.quantity;
                totalPrice += (cart.quantity * info.price);
            }
        })
    }

    totalQuantityHTML.innerHTML = totalQuantity;
    totalPriceHTML.innerHTML = totalPrice;
}

addToCartHTML();