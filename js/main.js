const navbar = document.querySelector('.navbar');
const cartIcon = document.querySelector('.cart-icon');
const cartValue = document.querySelector('.cart-values');
const grid = document.querySelector('.product-overlay-grid');
const productContainer = document.querySelector('.product-items');
const imageContainer = document.querySelector('.img-container');
const bagbtn = document.querySelector('.addtobagbtn');
const cartContainer = document.querySelector('.cart-container');
const cart = document.querySelector('.cart');
const closeCartbtn = document.querySelector('.cart-close-btn');

let cartData = [];

//fetch all the products
class Products{
    async getProducts(){
        try{
            let productListfetch = await fetch('./products.json');
            let productList = await productListfetch.json();
            let products = productList.items.map((product) => {
                const {title, price} = product.fields;
                const image = product.fields.image.fields.file.url;
                const {id} = product.sys;
                return {title, price, image, id};
            });
            return products;
        }catch(e){
            console.log(e); 
        }
    }
}

//perform all the activities and display in the UI
class UI{
    displayProducts(products){
        let tags = '';

        products.forEach((product) => {
            tags += `<div class="product-items">
            <div class="img-container">
                    <img src=${product.image} alt="Product">
                    <button class="addtobagbtn" data-id=${product.id}>Add to Cart</button>
            </div>
            <h2>${product.title}</h2>
            <h4>$${product.price}</h4>
        </div>`
        });
        // console.log(tags);        
        grid.innerHTML = tags;
        Storage.saveProducts(products);
    }
    getCartButtons(){
        const buttons = [...document.querySelectorAll('.addtobagbtn')];
        console.log(buttons);
        buttons.forEach((button) => {
            let id = button.getAttribute('data-id');
            let isPresentInCart = cartData.find((item) => {
                return item.id === id;
            });
            if(isPresentInCart){
                button.innerText = 'In Cart';
                button.disabled = true;
            }
            button.addEventListener('click', (event) => {
                event.target.innerText = 'In Cart';
                event.target.disabled = true;

                //get product for that id
                let cartProduct = this.getCartProduct(id);
                //merge the current selected cart product with already existing cart product
                cartData = [...cartData, cartProduct];
                //save cart values in localstorage
                Storage.saveCartData(cartData);
                //set cart Values
                this.setCartValues(cartData);

                //show Cart
                this.showCart();
                
            });
        });
    }
    getCartProduct(id){
        let products = Storage.getProducts();
        let cartProduct = null;
        if(products.length > 0){
            cartProduct = products.find((product) => {
                return product.id === id;
            })
        }
        return cartProduct;
    }

    setCartValues(cartValue){
        let cartElement = '';
        cartValue.forEach((cartItem) => {
            cartElement += `<div class="cart-items">
            <h2>${cartItem.title}</h2>
            <h3>$${cartItem.price}</h3>
            <button class="cart-remove-btn" data-id=${cartItem.id}>Remove</button>
    </div>`;
        })
        cart.innerHTML = cartElement;
    }
    showCart(){
        cartContainer.classList.remove('cart-container');
        cartContainer.classList.add('abc');
    }
    hideCart(){
        cartContainer.classList.remove('abc');
        cartContainer.classList.add('cart-container');
    }
    intialSetupofApplication(){
        //get existing Cart Data from localStorage
        cartData = Storage.getCartData();
        this.setCartValues(cartData);
        this.cartfunctionality();
    }
    cartfunctionality(){
        cartIcon.addEventListener('click', (event) => {
            this.showCart();
        });
        closeCartbtn.addEventListener('click', (event) => {
            this.hideCart();
        });
    }
}

//save and get data from localStorage
class Storage{
    static saveProducts(products){
        localStorage.setItem('product', JSON.stringify(products));
    }
    static getProducts(){
        return localStorage.getItem('product') ? JSON.parse(localStorage.getItem('product')) : [];
    }
    static saveCartData(carts){
        localStorage.setItem('cart', JSON.stringify(carts));
    }
    static getCartData(){
        return  localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let products = new Products();
    let ui = new UI();

    ui.intialSetupofApplication();
    products.getProducts().then((products) => {
        // console.log(products);
        ui.displayProducts(products);
    }).then(() => {
        ui.getCartButtons();
    });

});
