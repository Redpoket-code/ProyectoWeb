const API_URL = 'http://localhost:5000/api/productos';

async function cargarProductos() {
    const container = document.getElementById('productosContainer');
    container.innerHTML = '<div class="cargando"><i data-feather="loader"></i><p>Cargando productos...</p></div>';
    
    try {
        const response = await fetch(API_URL);
        const productos = await response.json();
        
        if (productos.length === 0) {
            container.innerHTML = '<div class="error"><p>No hay productos disponibles</p></div>';
            return;
        }
        
        container.innerHTML = '';
        
        productos.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'producto-card';
            card.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen" onerror="this.src='https://placehold.co/400x300/e9eaec/333?text=${encodeURIComponent(producto.nombre)}'">
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <div class="producto-precio">${producto.precio}</div>
                    <button class="btn-agregar" data-id="${producto._id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}" data-imagen="${producto.imagen}">
                        <i data-feather="shopping-cart"></i>
                        Agregar al carrito
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
        
        feather.replace();
        
        document.querySelectorAll('.btn-agregar').forEach(btn => {
            btn.addEventListener('click', () => {
                const producto = {
                    id: btn.dataset.id,
                    nombre: btn.dataset.nombre,
                    precio: parseFloat(btn.dataset.precio),
                    imagen: btn.dataset.imagen
                };
                agregarAlCarrito(producto);
            });
        });
        
    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<div class="error"><p>Error cargando productos. Asegúrate que el servidor esté corriendo.</p></div>';
    }
}

function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const existe = carrito.find(item => item.id === producto.id);
    
    if (existe) {
        existe.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`${producto.nombre} agregado al carrito`);
}

document.addEventListener('DOMContentLoaded', cargarProductos);