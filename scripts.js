document.addEventListener('DOMContentLoaded', function () {
    const cartIcon = document.getElementById('cart-icon');
    const sidebar = document.getElementById('cart-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const cartContent = document.getElementById('cart-content');
    let payButton = document.getElementById('pay-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartIcon.addEventListener('click', function (event) {
        event.preventDefault();
        sidebar.classList.add('open');
        updateCartContent();
    });

    closeSidebarBtn.addEventListener('click', function () {
        sidebar.classList.remove('open');
    });

    document.querySelectorAll('.quantity-controls .quantity-btn').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            const item = button.closest('.item');
            const title = item.querySelector('.titulo-item').textContent;
            const price = parseFloat(item.querySelector('.precio-item').textContent.replace('$', '').replace('.', ''));
            const quantitySpan = item.querySelector('.quantity');
            let quantity = parseInt(quantitySpan.textContent);

            if (action === 'increase') {
                quantity++;
            } else if (action === 'decrease' && quantity > 0) {
                quantity--;
            }

            quantitySpan.textContent = quantity;

            const cartItem = cart.find(product => product.name === title);

            if (cartItem) {
                cartItem.quantity = quantity;
                if (cartItem.quantity <= 0) {
                    cart = cart.filter(product => product.name !== title);
                }
            } else if (action === 'increase') {
                cart.push({ name: title, price: price, quantity: 1 });
            }

            if (quantity <= 0) {
                cart = cart.filter(product => product.name !== title);
            }

            updateCartContent();
        });
    });

    function updateCartContent() {
        cartContent.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartContent.innerHTML = '<p>Vacío</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;

                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `
                    <span>${item.name} - $${item.price.toLocaleString()} - Cantidad: ${item.quantity}</span>
                    <div>
                        <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                        <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    </div>
                `;
                cartContent.appendChild(itemDiv);
            });
        }

        document.getElementById('cart-total').innerHTML = `
            <p>Total: $${total.toLocaleString()}</p>
            <button class="pay-btn" id="pay-btn">Total a pagar</button>
        `;

        payButton = document.getElementById('pay-btn');
        payButton.addEventListener('click', function () {
            alert('Gracias por su compra!');
            cart = [];
            updateCartContent();
            localStorage.removeItem('cart'); // Limpiar carrito en localStorage
        });

        // Guardar carrito en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Actualizar la cantidad en la tarjeta del producto
        const productCards = document.querySelectorAll('.item');
        productCards.forEach((card, index) => {
            const quantitySpan = card.querySelector('.quantity');
            const title = card.querySelector('.titulo-item').textContent;
            const cartItem = cart.find(item => item.name === title);
            if (cartItem) {
                quantitySpan.textContent = cartItem.quantity;
            } else {
                quantitySpan.textContent = '0';
            }
        });
    }

    window.changeQuantity = function (index, delta) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCartContent();
    };

    // Cargar carrito desde localStorage
    if (cart.length > 0) {
        updateCartContent();
    }
});