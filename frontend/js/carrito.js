function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const listaContainer = document.getElementById('carritoLista');
    const resumenContainer = document.getElementById('resumenContent');
    
    if (carrito.length === 0) {
        listaContainer.innerHTML = '<div class="carrito-vacio"><i data-feather="shopping-cart"></i><p>Tu carrito está vacío</p><a href="tienda.html" style="color:#bfa8ff;">Ir a la tienda</a></div>';
        resumenContainer.innerHTML = '';
        return;
    }
    
    listaContainer.innerHTML = '';
    let subtotal = 0;
    
    carrito.forEach((item, index) => {
        const itemTotal = item.precio * item.cantidad;
        subtotal += itemTotal;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'carrito-item';
        itemDiv.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-imagen" onerror="this.src='https://placehold.co/100x100/e9eaec/333?text=${encodeURIComponent(item.nombre)}'">
            <div class="carrito-item-info">
                <div class="carrito-item-nombre">${item.nombre}</div>
                <div class="carrito-item-precio">$${item.precio}</div>
                <div class="carrito-item-cantidad">
                    <button class="btn-decrementar" data-index="${index}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-incrementar" data-index="${index}">+</button>
                    <span class="carrito-item-eliminar" data-index="${index}">✖️ Eliminar</span>
                </div>
            </div>
        `;
        listaContainer.appendChild(itemDiv);
    });
    
    const iva = subtotal * 0.13;
    const servicio = 10;
    const envio = 0;
    const total = subtotal + iva + servicio + envio;
    
    resumenContainer.innerHTML = `
        <div class="resumen-linea"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="resumen-linea"><span>IVA (13%):</span><span>$${iva.toFixed(2)}</span></div>
        <div class="resumen-linea"><span>Servicio:</span><span>$${servicio.toFixed(2)}</span></div>
        <div class="resumen-linea"><span>Envío:</span><span>$${envio.toFixed(2)}</span></div>
        <div class="resumen-total"><span>TOTAL:</span><span>$${total.toFixed(2)}</span></div>
        <button class="btn-checkout" id="btnCheckout">Proceder al pago</button>
    `;
    
    feather.replace();
    
    document.querySelectorAll('.btn-incrementar').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            carrito[index].cantidad += 1;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            cargarCarrito();
        });
    });
    
    document.querySelectorAll('.btn-decrementar').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            if (carrito[index].cantidad > 1) {
                carrito[index].cantidad -= 1;
            } else {
                carrito.splice(index, 1);
            }
            localStorage.setItem('carrito', JSON.stringify(carrito));
            cargarCarrito();
        });
    });
    
    document.querySelectorAll('.carrito-item-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            cargarCarrito();
        });
    });
    
    const btnCheckout = document.getElementById('btnCheckout');
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            alert('Funcionalidad de pago en desarrollo');
        });
    }
}

document.addEventListener('DOMContentLoaded', cargarCarrito);