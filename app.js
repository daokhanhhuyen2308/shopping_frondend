const iconCart = document.querySelector('.icon-cart');
const body = document.querySelector('body');
const close = document.querySelector('.close');
const listProductHTML = document.querySelector('.list-product');
const listCartHTML = document.querySelector('.list-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let filter = document.querySelector('.filter');
let count = document.getElementById('count');

let listProducts = [];
let carts = [];

let limit = 8;
let thisPage = 1;


let content = document.querySelector('.content');
let toast = document.querySelector('.toast');


let successMessage = 'Bạn đã thêm sản phẩm thành công';
let updateMessage = 'Bạn đã cập nhật sản phẩm thành công';
let deleteMessage = 'Bạn đã xóa sản phẩm khỏi giỏ hàng';

let bellIcon = document.querySelector('.icon');

// toast
function showToast(message) {
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
    const title = document.createElement('div');
    title.classList.add('title');
    title.innerText = message;
    bellIcon.innerHTML = `<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.193-.538 1.193H5.538c-.538 0-.538-.6-.538-1.193 0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365Zm-8.134 5.368a8.458 8.458 0 0 1 2.252-5.714m14.016 5.714a8.458 8.458 0 0 0-2.252-5.714M8.54 17.901a3.48 3.48 0 0 0 6.92 0H8.54Z" />
</svg>`;
    bellIcon.classList.toggle('move');

    content.appendChild(bellIcon);
    content.appendChild(title);
    toast.classList.add('show-toast');

    setTimeout(() => {
        toast.classList.remove('show-toast');
        bellIcon.classList.toggle('move');
    }, 2000);
}


//khi người dùng click vào icon-cart vào close button thì sẽ hiện thị thông tin của giỏ hàng
iconCart.addEventListener('click', () => {
    body.classList.toggle('show-cart');
});

close.addEventListener('click', () => {
    body.classList.toggle('show-cart');
});


let productFilter = listProducts;
//hiện thị dữ liệu ra màn hình
const addDataToHTML = function (productFilter) {

    count.innerText = productFilter.length;
    //cho bằng rỗng để mỗi lần mình lọc mình sẽ viết lại từ đầu
    listProductHTML.innerHTML = '';
    if (productFilter.length > 0) {
        productFilter.map((product) => {
            const newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            //<a href="/detail.html?id=${product.id}">
            newProduct.innerHTML = `
            
            <img src="${product.image}" />
            </a>
            <h2>${product.name}</h2>
            <div class="price">${product.price.toLocaleString()}đ</div>
            <button class="addToCart">Add to card</button>`;
            listProductHTML.appendChild(newProduct);
        });


    }
}

function clearInput() {
    filter.reset();
}

//search products
filter.addEventListener('submit', (event) => {
    //mỗi khi click vào ô search thì đều refresh lại trang nên ta sẽ ngăn chặn hành vi mặc định này
    event.preventDefault();

    //lấy ra các giá trị của bộ lọc như category, name, price ...

    //Câu lệnh event.target.elements là cách để truy cập các phần tử con trong một biểu mẫu HTML
    // khi sự kiện xảy ra trên biểu mẫu đó.
    let valueFilter = event.target.elements;
    //khai báo các thuộc tính mà mình cần lọc
    let category = valueFilter.category.value;
    let color = valueFilter.color.value;
    let name = valueFilter.name.value;
    let minPrice = valueFilter.minPrice.value;
    let maxPrice = valueFilter.maxPrice.value;
    productFilter = listProducts.filter(item => {

        if (category != '') {
            if (item.nature.type != category) {
                return false;
            }
        }
        if (color != '') {
            if (!item.nature.color.includes(color)) {
                return false;
            }
        }
        if (name !== '') {
            let lowercaseName = name.toLowerCase();
            let uppercaseName = name.toUpperCase();
            if (!item.name.toLowerCase().includes(lowercaseName)) {
                return false;
            }
            if (!item.name.toUpperCase().includes(uppercaseName)) {
                return false;
            }
        }
        if (minPrice !== '') {
            if (item.price < minPrice) {
                return false;
            }
        }
        if (maxPrice !== '') {
            if (item.price > maxPrice) {
                return false;
            }
        }

        return true;
    })
    clearInput();

    addDataToHTML(productFilter);

})


//hiện thị thông tin sản phẩm ra giỏ hàng
const addToCartHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.map((cart) => {
            totalQuantity += cart.quantity;
            //bởi vì trong cart chỉ có trường product_id và quantity nên mình sẽ dựa vào product_id trong cart
            // để lấy ra thông tin sản phẩm trong bảng product 
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];
            const newCart = document.createElement('div');
            newCart.classList.add('item');
            // newCart.dataset.id = cart.product_id;
            newCart.innerHTML = `<div class="image">
            <img src="${info.image}" />
            </div>
            <div class="name">${info.name}</div>
            <div class="totalPrice">
            ${(info.price * cart.quantity).toLocaleString()}
            </div>
            <div class="quantity">
                <button class="minus" data-id="${info.id}">-</button>
                <span>${cart.quantity}</span>
                <button class="plus" data-id="${info.id}">+</button>
            </div>`
            listCartHTML.appendChild(newCart);

        });
    }
    iconCartSpan.textContent = totalQuantity;
}

//khi người dùng nhập vào bất cứ element nào thuộc listprodut thì chúng ta sẽ thực hiện 
listProductHTML.addEventListener('click', (event) => {
    let pos = event.target;
    // console.log(pos);
    if (pos.classList.contains('addToCart')) {
        // console.log(message);
        showToast(successMessage);

        // console.log('Add to cart');
        //lấy ra vị trị của từng sản phẩm thông qua thuộc tính id mà mình đã set
        //nên nhớ là mình set id cho phần tử cha thì lúc lấy ra mình phải lấy từ phần tử cha
        let product_id = pos.parentElement.dataset.id;
        addToCart(product_id);
    }

})


const addToCart = (product_id) => {
    let posThisProductInCart = carts.findIndex((value) => value.product_id === product_id);
    if (carts.length <= 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        })
    } else if (posThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        })

    }
    else {
        carts[posThisProductInCart].quantity++;
    }

    // console.log(carts);
    addToCartHTML();
    addToCartMemory();
}


listCartHTML.addEventListener('click', (event) => {
    let posCart = event.target;
    // console.log(posCart);
    let product_id = posCart.dataset.id;
    // console.log(product_id);
    let posThisProductInCart = carts.findIndex((value) => value.product_id === product_id);
    if (posCart.classList.contains('plus')) {
        carts[posThisProductInCart].quantity++;
        showToast(updateMessage);
        addToCartHTML();
        addToCartMemory();

    }
    if (posCart.classList.contains('minus')) {
        carts[posThisProductInCart].quantity--;
        showToast(updateMessage);

        if (carts[posThisProductInCart].quantity === 0) {
            carts.splice(posThisProductInCart, 1);
            showToast(deleteMessage);

        }
        addToCartHTML();
        addToCartMemory();
    }


})

//lưu thông tin vào local storage để khi refresh lại trang sẽ không bị mất data
const addToCartMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

const initApp = function () {
    //get data from json file
    fetch('products.json').then(response => {
        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }
        return response.json();
    })
        .then(data => {
            listProducts = data;
            //hiện thị dữ liệu ra màn hình sau khi lấy được từ json file
            addDataToHTML(listProducts);

            if (localStorage.getItem('cart')) {
                carts = JSON.parse(localStorage.getItem('cart'));
                //hiện thị dữ liệu của sản phẩm trong giỏ hàng
                addToCartHTML();
            }
        })
        .catch(error => {
            console.log(error);
        })

}

initApp();

export default listProducts;



/*
const setProductInCart = (product_id, quantity, position) => {
    if (quantity > 0) {
        if (position < 0) {
            carts.push({
                product_id: product_id,
                quantity: quantity
            })
        } else {
            carts[position].quantity = quantity;
        }
    } else {
        //nếu như sản quantity và nhỏ hơn không thì ta sẽ xóa product đó ra khỏi list cart
        carts.splice(position, 1);
    }
    addToCartHTML();
    //lưu thông tin vào local storage để khi refresh lại trang sẽ không bị mất data
    localStorage.setItem('cart', JSON.stringify(carts));
}


    document.addEventListener('click', (event) => {
    //khi mình click và bất kì element nào thì chúng sẽ hiện thị ra thông tin của element đó
    let buttonClick = event.target;
    // console.log(buttonClick);
    //lấy ra thông tin id của element nào chứa id mà mình set vào, ở đây ta có set id cho 3 button là addToCart
    //plus, minus để phân biệt ra được khi mình add product nào thì sẽ lấy ra được info của product đó
    let product_id = buttonClick.dataset.id;
    // console.log(product_id);
    // addToCart(product_id);
    //dựa vào id ta vừa lấy ra được ta sẽ lấy ra được vị trí của product đó nằm ở vị trị nào trong giỏ hàng nếu như
    // trả ra -1 tức là product đó chưa nằm trong giỏ hàng
    let position = carts.findIndex((value) => value.product_id === product_id);
    //nếu như trong giỏ hàng của ta chưa tồn tại vị trí (position) này thì tức là chúng chưa được thêm vào cart
    //thì sẽ trả và -1 và mình sẽ set giá trị mới cho chúng là 0, nếu như sản phảm đó đã tồn tại trong giỏ hàng rồi
    //thì ta sẽ thăng giá trị của quantity lên hoặc giảm tùy thuộc vào thao tác của user
    let quantity = position < 0 ? 0 : carts[position].quantity;
    if (buttonClick.classList.contains('addToCart') || buttonClick.classList.contains('plus')) {
        quantity++;
        setProductInCart(product_id, quantity, position);

    }
    else if (buttonClick.classList.contains('minus')) {
        quantity--;
        setProductInCart(product_id, quantity, position);

    }


});*/