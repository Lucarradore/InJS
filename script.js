var swiper = new Swiper(".mySwiper-1",{
    slidesPerView:1,
    spaceBetween:30,
    loop:true,
    pagination:{
        el:".swiper-pagination",
        clickeable:true,
    },
    navigation:{
        nextEl:".swiper-button-next",
        prevEl:".swiper-button-prev",
    }
});

var swiper = new Swiper(".mySwiper-2",{
    slidesPerView:3,
    spaceBetween:20,
    loop:true,
    loopFillGroupWithBlank:true,
    navigation:{
        nextEl:".swiper-button-next",
        prevEl:".swiper-button-prev",
    },
    breakpoints: {
        0: {
            slidesPerView:1,
        },
        520: {
            slidesPerView:2,
        },
        950:{
            slidesPerView:3,
        }
    }
});

let tabInputs = document.querySelectorAll(".tabInput");

tabInputs.forEach(function(input){
    input.addEventListener("change", function(){
        let id = input.ariaValueMax;
        let thisSwiper = document.getElementById("swiper" + id);
        thisSwiper.swiper.update();
    })
});

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////PROBLEMA////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
    const openShopping = document.querySelector('.shopping');
    const closeShopping = document.querySelector('.closeShopping');
    const listCard = document.querySelector('.listCard');
    const body = document.querySelector('body');
    const quantity = document.querySelector('.quantity');
    const buyButton = document.querySelector('.buy');

    openShopping.addEventListener('click', () => {
        body.classList.add('active');
    });

    closeShopping.addEventListener('click', () => {
        body.classList.remove('active');
    });

    const products = [
        { id: 1, name: 'GUITARRA ELECTRICA', image: 'guitarra9-removebg-preview.png', price: 1000000 },
        { id: 2, name: 'GUITARRA ELECTRICA', image: 'guitarra7-removebg-preview.png', price: 400000 },
        { id: 3, name: 'GUITARRA ELECTRICA', image: 'guitarra8-removebg-preview.png', price: 200000 },
        { id: 4, name: 'TROMPA', image: 'viento1-removebg-preview.png', price: 700000 },
        { id: 5, name: 'TROMPETA', image: 'viento2-removebg-preview.png', price: 100000 },
        { id: 6, name: 'SAXOFÓN', image: 'viento3-removebg-preview.png', price: 500000 },
        { id: 7, name: 'BONGÓ', image: 'percusion1-removebg-preview.png', price: 60000 },
        { id: 8, name: 'PANDERETA', image: 'percusion2-removebg-preview.png', price: 10000 },
        { id: 9, name: 'TAMBOR', image: 'percusion3-removebg-preview.png', price: 300000 }
    ];

    let listCards = [];

    
    document.querySelectorAll('.addToCard').forEach((button) => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.getAttribute('data-product-id'));
            addToCard(productId);
        });
    });

    
    buyButton.addEventListener('click', () => {
        let totalPrice = calculateTotalPrice();
        if (listCards.length > 0) {
            Swal.fire({
                icon: 'success',
                title: 'Compra exitosa',
                text: `Gracias por tu compra! El total es ${totalPrice.toLocaleString()}`,
                showConfirmButton: true,
                timer: 2000,
                background: '#343a40',
                color: '#ffffff'
            });
            listCards = [];
            updateCart();
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Carrito vacío',
                text: 'Añade productos al carrito para realizar una compra.',
                background: '#343a40',
                color: '#ffffff'
            });
        }
    });

    function addToCard(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingProduct = listCards.find(p => p.id === productId);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                listCards.push({ ...product, quantity: 1 });
            }
            updateCart();
        } else {
            console.error(`Product with ID: ${productId} not found`);
        }
    }

    function updateCart() {
        listCard.innerHTML = '';
        let count = 0;
        let totalPrice = 0;

        listCards.forEach((product) => {
            count += product.quantity;
            totalPrice += product.price * product.quantity;

            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div><img src="image/${product.image}" /></div>
                <div>${product.name}</div>
                <div>${product.price.toLocaleString()}</div>
                <div>
                    <button class="decrease" data-id="${product.id}">-</button>
                    <span class="quantity">${product.quantity}</span>
                    <button class="increase" data-id="${product.id}">+</button>
                </div>
                <div>
                    <button class="remove" data-id="${product.id}">Eliminar</button>
                </div>
            `;

            listCard.appendChild(listItem);
        });

        if (count > 0) {
            quantity.innerText = count;
        } else {
            quantity.innerText = '';
        }

        
        assignEventListeners();
    }

    function assignEventListeners() {
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.getAttribute('data-id'));
                changeQuantity(productId, 1);
            });
        });

        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.getAttribute('data-id'));
                changeQuantity(productId, -1);
            });
        });

        document.querySelectorAll('.remove').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.getAttribute('data-id'));
                removeProduct(productId);
            });
        });
    }

    function changeQuantity(productId, delta) {
        const product = listCards.find(p => p.id === productId);
        if (product) {
            product.quantity += delta;
            if (product.quantity <= 0) {
                listCards = listCards.filter(p => p.id !== productId);
            }
            updateCart();
            showUpdatedPriceAlert();
        } else {
            console.error(`Product with ID: ${productId} not found in cart`);
        }
    }

    function removeProduct(productId) {
        listCards = listCards.filter(p => p.id !== productId);
        updateCart();
        showUpdatedPriceAlert();
    }

    function calculateTotalPrice() {
        return listCards.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    }

    function showUpdatedPriceAlert() {
        const totalPrice = calculateTotalPrice();
        Swal.fire({
            icon: 'info',
            title: 'Carrito actualizado',
            text: `El total actualizado es ${totalPrice.toLocaleString()}`,
            showConfirmButton: false,
            timer: 1500,
            background: '#343a40',
            color: '#ffffff'
        });
    }

    window.changeQuantity = function(productId, quantity) {
        let product = listCards.find(p => p.id === productId);
        if (quantity == 0) {
            listCards = listCards.filter(p => p.id !== productId);
        } else {
            product.quantity = quantity;
        }
        updateCart();
    }

    updateCart();
});
