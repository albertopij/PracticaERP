"use strict";

function init() {

    var contenedorPrincipal = document.getElementById("contenedorPrincipal");
    var etiquetaNav = document.getElementsByTagName("nav");

    function showCategories() {
        var categorias = [];
        console.log("Recorremos las categorias.");
        var categories = almacen.categories;
        var category = categories.next();
        while (category.done !== true) {
            console.log("Category: " + category.value.title);
            categorias.push(category.value);
            category = categories.next();
        }

        return categorias;
    }

    function showShops() {

        console.log("Recorremos las tiendas.");
        var shops = almacen.shops;
        var shop = shops.next();
        while (shop.done !== true) {
            console.log("Shop: " + shop.value.name);

            shop = shops.next();
        }
    }

    function showAllProductsShops(product) {
        console.log("####### Mostramos los productos de cada Tienda. #######");
        var tiendas = almacen.shops;
        var tienda = tiendas.next();
        while (tienda.done !== true) {
            console.log("Tienda: " + tienda.value.name);
            if (product) {
                showProductShop2(almacen.getShopProduct(tienda.value), product, tienda.value);
            } else {
                showProductShop1(almacen.getShopProduct(tienda.value), tienda.value);

            }
            tienda = tiendas.next();
        }
        console.log("####### Fin: Mostramos los productos de cada Tienda. #######");
    }


    function showAllProducts() {
        console.log("####### Mostramos los productos de cada categoría. #######");
        var categories = almacen.categories;
        var category = categories.next();
        while (category.done !== true) {
            console.log("Category: " + category.value.title);
            showProducts(almacen.getCategoryProduct(category.value));
            category = categories.next();
        }
        console.log("####### Fin: Mostramos los productos de cada categoría. #######");
    }

    function showProducts(products) {

        var product = products.next();
        var productos = [];
        while (product.done !== true) {
            console.log("   Product: " + product.value.name + " (" + product.value.price + "€)");
            productos.push(product.value);
            product = products.next();
        }

        return productos;
    }


    function showProductShop1(products, shop) {

        var product = products.next();
        var stock;
        var productInShop = [];
        var i = 0;
        while (product.done !== true) {
            stock = almacen.getProductStock(product.value, shop);
            console.log("   Product: " + product.value.name + " (" + product.value.price + "€) con stock " + stock);
            productInShop[i] = product.value;
            i++;
            product = products.next();
        }

        return productInShop;
    }

    function showProductShop2(products, product1, shop) {

        var product = products.next();
        var productInShop = "";
        var stock;

        while (product.done !== true) {
            if (product.value.serialNumber === product1.serialNumber) {
                stock = almacen.getProductStock(product.value, shop);

                productInShop = product.value;
            }
            product = products.next();
        }

        return productInShop;
    }


    function initPopulate() {

        var i = 0;
        var shops = almacen.shops;
        var shop = shops.next();
        var botonGlobalProductPopulate = document.getElementById("HglobalProductPopulate");
        botonGlobalProductPopulate.addEventListener("click", function () {
            globalProductPopulate()
        });

        var inicioLogo = document.getElementById("logo");

        inicioLogo.addEventListener("click", function () {

            var categorias = document.getElementById("menuCategoryShopPopulate");
            var shopPopulate = document.getElementById("shopPopulate");
            var detalleProducto = document.getElementById("detalleProducto");
            var globalProductPopulate = document.getElementById("globalProductPopulate");
            var initPopulate = document.getElementById("initPopulate");


            if (categorias !== null) {
                categorias.remove();
            }

            if (shopPopulate !== null) {
                shopPopulate.remove();
            }

            if (detalleProducto !== null) {
                detalleProducto.remove();
            }

            if (globalProductPopulate !== null) {
                globalProductPopulate.remove();
            }

            initPopulate.style.display = "";

        });

        var contenedorTiendas = document.createElement("div");
        contenedorTiendas.setAttribute("class", ".container");
        contenedorTiendas.setAttribute("id", "initPopulate");

        var mainH2 = document.createElement("h2");
        mainH2.setAttribute("class", "text-center bold titulo");
        mainH2.appendChild(document.createTextNode("Inicio"));
        contenedorTiendas.appendChild(mainH2);

        var row = document.createElement("div");
        row.setAttribute("class", "row");

        contenedorPrincipal.appendChild(contenedorTiendas);

        while (shop.done !== true) {

            i++;

            if (i > 4) {
                i = 0;

                row = document.createElement("div");
                row.setAttribute("class", "row");

                contenedorTiendas.appendChild(row);

            }

            var nombreTienda = document.createTextNode(shop.value.name);
            var dirImg = "img/" + shop.value.name + ".jpg";


            var tienda = document.createElement("div");
            tienda.setAttribute("class", "col-md-3 col-sm-6 col-xs-12");

            var panel = document.createElement("div");
            panel.setAttribute("class", "panel panel-default text-center");

            var panelHeading = document.createElement("div");
            panelHeading.setAttribute("class", "panel-heading");

            var h2 = document.createElement("h2");
            h2.appendChild(nombreTienda);
            panelHeading.appendChild(h2);

            var panelBody = document.createElement("div");
            panelBody.setAttribute("class", "panel-body");


            var imagen = document.createElement("img");
            imagen.setAttribute("class", "img-responsive");
            imagen.setAttribute("src", dirImg);
            panelBody.appendChild(imagen);


            var panelFooter = document.createElement("div");
            panelFooter.setAttribute("class", "panel-footer");

            var button = document.createElement("button");
            button.setAttribute("class", "btn btn-lg");
            button.addEventListener("click", createFunctionShowShop(shop.value));


            button.appendChild(document.createTextNode("Ver Tienda"));
            panelFooter.appendChild(button);

            panel.appendChild(panelHeading);
            panel.appendChild(panelBody);
            panel.appendChild(panelFooter);

            tienda.appendChild(panel);
            row.appendChild(tienda);

            contenedorTiendas.appendChild(row);
            shop = shops.next();
        }


        function createFunctionShowShop(shop) {
            return function () {
                shopPopulate(shop);
            }
        }
    }


    function shopsMenusPopulate() {

        var nav1 = document.createElement("div");
        nav1.setAttribute("class", "container-fluid navbar navbar-default");
        nav1.setAttribute("id", "nav1");
        nav1.setAttribute("role", "navigation");


        var nav1Header = document.createElement("div");
        nav1Header.setAttribute("class", "navbar-header");

        var buttonNav = document.createElement("button");
        buttonNav.setAttribute("type", "button");
        buttonNav.setAttribute("class", "navbar-toggle");
        buttonNav.setAttribute("data-toggle", "collapse");
        buttonNav.setAttribute("data-target", ".navbar-ex1-collapse");

        var iconBar1 = document.createElement("span");
        iconBar1.setAttribute("class", "icon-bar");
        var iconBar2 = document.createElement("span");
        iconBar2.setAttribute("class", "icon-bar");
        var iconBar3 = document.createElement("span");
        iconBar3.setAttribute("class", "icon-bar");

        var tituloMenu = document.createElement("a");
        tituloMenu.setAttribute("class", "navbar-brand");
        tituloMenu.setAttribute("href", "#");

        tituloMenu.addEventListener("click", function () {

            var categorias = document.getElementById("menuCategoryShopPopulate");
            var shopPopulate = document.getElementById("shopPopulate");
            var detalleProducto = document.getElementById("detalleProducto");
            var globalProductPopulate = document.getElementById("globalProductPopulate");
            var initPopulate = document.getElementById("initPopulate");


            if (categorias !== null) {
                categorias.remove();
            }

            if (shopPopulate !== null) {
                shopPopulate.remove();
            }

            if (detalleProducto !== null) {
                detalleProducto.remove();
            }

            if (globalProductPopulate !== null) {
                globalProductPopulate.remove();
            }

            initPopulate.style.display = "";

        });


        var textoTitulo = document.createTextNode("Tiendas");
        tituloMenu.appendChild(textoTitulo);


        var navBar = document.createElement("div");
        navBar.setAttribute("id", "navBar");
        navBar.setAttribute("class", "collapse navbar-collapse navbar-ex1-collapse");

        var ulNavbar = document.createElement("ul");
        ulNavbar.setAttribute("id", "navLeft");
        ulNavbar.setAttribute("class", "nav navbar-nav");


//iterador tiendas

        var shops = almacen.shops;
        var shop = shops.next();
        while (shop.done !== true) {

            var textoTienda = document.createTextNode(shop.value.name);
            var li = document.createElement("li");
            var enlaceTienda = document.createElement("a");
            enlaceTienda.setAttribute("href", "#");
            enlaceTienda.addEventListener("click", createFunctionShowShop(shop.value));

            enlaceTienda.appendChild(textoTienda);
            li.appendChild(enlaceTienda);
            ulNavbar.appendChild(li);

            shop = shops.next();
        }


        var textoAllProduct = document.createTextNode("Productos Globales");
        li = document.createElement("li");
        li.setAttribute("class", "hidden-sm hidden-md hidden-lg");
        var enlaceProductosGlobales = document.createElement("a");
        enlaceProductosGlobales.setAttribute("href", "#");
        enlaceProductosGlobales.addEventListener("click", function () {

            globalProductPopulate()
        });

        enlaceProductosGlobales.appendChild(textoAllProduct);
        li.appendChild(enlaceProductosGlobales);
        ulNavbar.appendChild(li);

        //navbar header


        buttonNav.appendChild(iconBar1);
        buttonNav.appendChild(iconBar2);
        buttonNav.appendChild(iconBar3);

        nav1Header.appendChild(buttonNav);
        nav1Header.appendChild(tituloMenu);

        //navbar

        navBar.appendChild(ulNavbar);

        nav1.appendChild(nav1Header);
        nav1.appendChild(navBar);

        etiquetaNav[0].appendChild(nav1);

        function createFunctionShowShop(shop) {
            return function () {
                shopPopulate(shop);

                var ulRepetido = document.getElementById("returnShopProduct");


                if (ulRepetido !== null) {

                    navBar.removeChild(ulRepetido);
                }
            }
        }

    }


    function shopPopulate(shop) {

        var globalProductPopulate = document.getElementById("globalProductPopulate");

        if (globalProductPopulate !== null) {
            globalProductPopulate.remove();
        }
        menuCategoryShopPopulate(shop);

        var contenedorTiendas = document.getElementById("initPopulate");

        contenedorTiendas.style.display = "none";

        var tienda = shop;
        var j = 0;
        var i;
        var shopPopulateRepetido = document.getElementById("shopPopulate");
        var detalleProducto = document.getElementById("detalleProducto");


        if (shopPopulateRepetido !== null) {

            contenedorPrincipal.removeChild(shopPopulateRepetido);
        }

        if (detalleProducto !== null) {

            detalleProducto.remove();
        }

        var productos = showProductShop1(almacen.getShopProduct(tienda), tienda);

        var divShopPopulate = document.createElement("div");
        divShopPopulate.setAttribute("id", "shopPopulate");
        divShopPopulate.setAttribute("class", ".container-fluid");
        contenedorPrincipal.appendChild(divShopPopulate);


        var mainH2 = document.createElement("h2");
        mainH2.setAttribute("class", "text-center bold titulo");
        mainH2.appendChild(document.createTextNode("Tienda " + shop.name));
        divShopPopulate.appendChild(mainH2);


        var row = document.createElement("div");
        row.setAttribute("class", "row");
        divShopPopulate.appendChild(row);

        for (i = 0; i < productos.length; i++) {

            j++;

            if (j > 4) {
                j = 0;

                row = document.createElement("div");
                row.setAttribute("class", "row");
                divShopPopulate.appendChild(row);

            }

            var producto = document.createElement("div");
            producto.setAttribute("class", "col-md-3 col-sm-6 col-xs-12");
            row.appendChild(producto);

            var panelProducto = document.createElement("div");
            panelProducto.setAttribute("class", "panel panel-default text-center producto");
            producto.appendChild(panelProducto);

            var panelBodyProducto = document.createElement("div");
            panelBodyProducto.setAttribute("class", "panel-body");
            panelProducto.appendChild(panelBodyProducto);

            var imgProducto = document.createElement("img");
            imgProducto.setAttribute("class", "img-responsive");
            imgProducto.setAttribute("src", productos[i].images[0]);
            panelBodyProducto.appendChild(imgProducto);

            var panelFooterProducto = document.createElement("div");
            panelFooterProducto.setAttribute("class", "panel-footer");
            panelProducto.appendChild(panelFooterProducto);

            var nombreProducto = document.createElement("p");
            var textoNombreProducto = document.createTextNode(productos[i].name);
            nombreProducto.appendChild(textoNombreProducto);
            panelFooterProducto.appendChild(nombreProducto);

            var precioProducto = document.createElement("h3");
            precioProducto.setAttribute("class", "bold");
            var textoPrecioProducto = document.createTextNode(productos[i].price + "€");
            precioProducto.appendChild(textoPrecioProducto);
            panelFooterProducto.appendChild(precioProducto);

            var buttonDetalles = document.createElement("button");
            buttonDetalles.setAttribute("class", "btn btn-lg");
            buttonDetalles.appendChild(document.createTextNode("Ver Detalle"));
            buttonDetalles.addEventListener("click", createFunctionShowShopDetailProduct(tienda, productos[i]));
            panelFooterProducto.appendChild(buttonDetalles);

        }

        function createFunctionShowShopDetailProduct(shop, product) {
            return function () {
                productShopPopulate(shop, product);
            }
        }

    }


    function returnShopPopulate(shop) {

        var navBar = document.getElementById("navBar");


        var ulRight = document.createElement("ul");
        ulRight.setAttribute("id", "returnShopProduct");
        ulRight.setAttribute("class", "nav navbar-nav navbar-right");


        var liReturn = document.createElement("li");


        var aReturn = document.createElement("a");

        var textoEnlace = document.createTextNode("Volver");

        navBar.appendChild(ulRight);
        ulRight.appendChild(liReturn);
        liReturn.appendChild(aReturn);
        aReturn.appendChild(textoEnlace);

        aReturn.addEventListener("click", function () {

            var shopPopulate = document.getElementById("shopPopulate");
            var detalleProducto = document.getElementById("detalleProducto");
            var categorias = document.getElementById("menuCategoryShopPopulate");


            categorias.style.display = "";
            ulRight.remove();
            detalleProducto.remove();
            shopPopulate.style.display = "";
        });

    }

    function menuCategoryShopPopulate(shop) {

        var tienda = shop;
        var j = 0;
        var i;
        var navBar = document.getElementById("navBar");
        var productsCategory = [];
        var productosTienda = showProductShop1(almacen.getShopProduct(tienda), tienda);
        var categoriasTienda = [];

        var menuCategoryShopPopulateRepetido = document.getElementById("menuCategoryShopPopulate");

        if (menuCategoryShopPopulateRepetido !== null) {

            menuCategoryShopPopulateRepetido.parentElement.removeChild(menuCategoryShopPopulateRepetido);
        }


        var ulDropdown1 = document.getElementById("navLeft");


        var liDropdown1 = document.createElement("li");
        liDropdown1.setAttribute("id", "menuCategoryShopPopulate");
        liDropdown1.setAttribute("class", "dropdown");


        var aDropdownPrinci = document.createElement("a");
        aDropdownPrinci.setAttribute("href", "#");
        aDropdownPrinci.setAttribute("class", "dropdown-toggle");
        aDropdownPrinci.setAttribute("data-toggle", "dropdown");
        aDropdownPrinci.setAttribute("role", "button");
        aDropdownPrinci.setAttribute("aria-haspopup", "true");
        aDropdownPrinci.setAttribute("aria-expanded", "false");

        textoEnlace = document.createTextNode("Categorias ");

        var spanFlecha = document.createElement("span");


        spanFlecha.setAttribute("class", "caret");

        aDropdownPrinci.appendChild(textoEnlace);
        aDropdownPrinci.appendChild(spanFlecha);

        liDropdown1.appendChild(aDropdownPrinci);

        var ulDropdown2 = document.createElement("ul");
        ulDropdown2.setAttribute("class", "dropdown-menu");

        liDropdown1.appendChild(ulDropdown2);

        var categories = almacen.categories;
        var category = categories.next();

        textoEnlace = document.createTextNode("Todas las categorias");
        li = document.createElement("li");
        enlaceLi = document.createElement("a");
        enlaceLi.setAttribute("href", "#");
        enlaceLi.appendChild(textoEnlace);
        enlaceLi.addEventListener("click", createFunctionShowShop(tienda));
        li.appendChild(enlaceLi);
        ulDropdown2.appendChild(li);

        // Iterador de las categorias

        while (category.done !== true) {
            productsCategory = almacen.getCategoryProduct(category.value);

            for (i = 0; i < productosTienda.length; i++) {

                if (productsCategory.indexOf(productosTienda[i]) > -1 && categoriasTienda.indexOf(category.value) < 0) {

                    var textoEnlace = document.createTextNode(category.value.title + " ");
                    var li = document.createElement("li");
                    var enlaceLi = document.createElement("a");
                    categoriasTienda[j] = category.value;
                    enlaceLi.setAttribute("href", "#");

                    enlaceLi.appendChild(textoEnlace);
                    enlaceLi.addEventListener("click", createFunctionShowShopCategoryProduct(tienda, category.value));

                    li.appendChild(enlaceLi);
                    j++;
                    ulDropdown2.appendChild(li);
                }

            }
            category = categories.next();
        }

        ulDropdown1.appendChild(liDropdown1);
        navBar.appendChild(ulDropdown1);

        function createFunctionShowShop(shop) {
            return function () {
                shopPopulate(shop);
            }
        }

        function createFunctionShowShopCategoryProduct(shop, category) {
            return function () {
                productsCategoryShopPopulate(shop, category);
            }
        }
    }

    function productsCategoryShopPopulate(shop, category) {

        var globalProductPopulate = document.getElementById("globalProductPopulate");

        if (globalProductPopulate !== null) {
            globalProductPopulate.remove();
        }

        menuCategoryShopPopulate(shop);

        var contenedorTiendas = document.getElementById("initPopulate");

        contenedorTiendas.style.display = "none";

        var tienda = shop;
        var i;
        var productosTienda = showProductShop1(almacen.getShopProduct(tienda), tienda);
        var productsCategory = almacen.getCategoryProduct(category);
        var shopPopulateRepetido = document.getElementById("shopPopulate");

        if (shopPopulateRepetido !== null) {

            contenedorPrincipal.removeChild(shopPopulateRepetido);
        }

        var productos = showProductShop1(almacen.getShopProduct(tienda), tienda);

        var divShopPopulate = document.createElement("div");
        divShopPopulate.setAttribute("id", "shopPopulate");
        divShopPopulate.setAttribute("class", ".container-fluid");
        contenedorPrincipal.appendChild(divShopPopulate);


        var mainH2 = document.createElement("h2");
        mainH2.setAttribute("class", "text-center bold titulo");
        mainH2.appendChild(document.createTextNode("Tienda " + shop.name));
        divShopPopulate.appendChild(mainH2);


        var row = document.createElement("div");
        row.setAttribute("class", "row");
        divShopPopulate.appendChild(row);

        var j = 0;
        for (i = 0; i < productosTienda.length; i++) {

            if (j > 4) {
                j = 0;

                row = document.createElement("div");
                row.setAttribute("class", "row");
                divShopPopulate.appendChild(row);

            }


            if (productsCategory.indexOf(productosTienda[i]) > -1) {

                j++;
                var producto = document.createElement("div");
                producto.setAttribute("class", "col-md-3 col-sm-6 col-xs-12");
                row.appendChild(producto);

                var panelProducto = document.createElement("div");
                panelProducto.setAttribute("class", "panel panel-default text-center producto");
                producto.appendChild(panelProducto);

                var panelBodyProducto = document.createElement("div");
                panelBodyProducto.setAttribute("class", "panel-body");
                panelProducto.appendChild(panelBodyProducto);

                var imgProducto = document.createElement("img");
                imgProducto.setAttribute("class", "img-responsive");
                imgProducto.setAttribute("src", productosTienda[i].images[0]);
                panelBodyProducto.appendChild(imgProducto);

                var panelFooterProducto = document.createElement("div");
                panelFooterProducto.setAttribute("class", "panel-footer");
                panelProducto.appendChild(panelFooterProducto);

                var nombreProducto = document.createElement("p");
                var textoNombreProducto = document.createTextNode(productosTienda[i].name);
                nombreProducto.appendChild(textoNombreProducto);
                panelFooterProducto.appendChild(nombreProducto);

                var precioProducto = document.createElement("h3");
                precioProducto.setAttribute("class", "bold");
                var textoPrecioProducto = document.createTextNode(productosTienda[i].price + "€");
                precioProducto.appendChild(textoPrecioProducto);
                panelFooterProducto.appendChild(precioProducto);

                var buttonDetalles = document.createElement("button");
                buttonDetalles.setAttribute("class", "btn btn-lg");
                buttonDetalles.appendChild(document.createTextNode("Ver Detalle"));
                panelFooterProducto.appendChild(buttonDetalles);
                buttonDetalles.addEventListener("click", createFunctionShowShopDetailProduct(tienda, productosTienda[i]));
                panelFooterProducto.appendChild(buttonDetalles);
            }

        }

        function createFunctionShowShopDetailProduct(shop, product) {
            return function () {
                productShopPopulate(shop, product);
            }
        }
    }

    function productShopPopulate(shop, product) {

        returnShopPopulate();

        var categorias = document.getElementById("menuCategoryShopPopulate");
        categorias.style.display = "none";


        var shopPopulate = document.getElementById("shopPopulate");
        shopPopulate.style.display = "none";
        var i;
        var contenedorPrincipal = document.getElementById("contenedorPrincipal");

        var globalProductPopulate = document.getElementById("globalProductPopulate");

        if (globalProductPopulate !== null) {
            globalProductPopulate.remove();
        }


        var contenedorPanel = document.createElement("div");
        contenedorPanel.setAttribute("id", "detalleProducto");
        contenedorPanel.setAttribute("class", "col-sm-8 col-sm-offset-2 col-xs-12");
        contenedorPrincipal.appendChild(contenedorPanel);


        var mainH2 = document.createElement("h2");
        mainH2.setAttribute("class", "text-center bold titulo");
        mainH2.appendChild(document.createTextNode("Detalle de producto"));
        contenedorPanel.appendChild(mainH2);

        var panel = document.createElement("div");
        panel.setAttribute("class", "panel panel-default text-center");
        contenedorPanel.appendChild(panel);

        var panelHead = document.createElement("div");
        panelHead.setAttribute("class", "panel-heading");
        panel.appendChild(panelHead);

        var nombreProducto = document.createElement("h3");
        panelHead.appendChild(nombreProducto);
        var textoNombreProducto = document.createTextNode(product.name);
        nombreProducto.appendChild(textoNombreProducto);

        var precioProducto = document.createElement("h3");
        panelHead.appendChild(precioProducto);
        var textoPrecioProducto = document.createTextNode(product.price + "€");
        precioProducto.appendChild(textoPrecioProducto);

        var stock = almacen.getProductStock(product, shop);
        var stockProducto = document.createElement("h4");
        panelHead.appendChild(stockProducto);
        var textoStockProducto = document.createTextNode("Quedan " + stock + " unidades");
        stockProducto.appendChild(textoStockProducto);

        var panelBody = document.createElement("div");
        panelBody.setAttribute("class", "panel-body");
        panel.appendChild(panelBody);

        var carrusel = document.createElement("div");
        carrusel.setAttribute("id", "myCarousel");
        carrusel.setAttribute("class", "carousel slide");
        carrusel.setAttribute("data-ride", "carousel");
        panelBody.appendChild(carrusel);

        var carouselIndicators = document.createElement("ol");
        carouselIndicators.setAttribute("class", "carousel-indicators");
        carrusel.appendChild(carouselIndicators);

        for (i = 0; i < product.images.length; i++) {


            var liIndicators = document.createElement("li");
            liIndicators.setAttribute("data-target", "#myCarousel");
            liIndicators.setAttribute("data-slide-to", i);
            if (i === 0) {
                liIndicators.setAttribute("class", "active");
            }

            carouselIndicators.appendChild(liIndicators);
        }

        var carouselInner = document.createElement("div");
        carouselInner.setAttribute("class", "carousel-inner");
        carrusel.appendChild(carouselInner);

        for (i = 0; i < product.images.length; i++) {

            var itemActive = document.createElement("div");
            if (i > 0) {
                itemActive.setAttribute("class", "item");

            } else {
                itemActive.setAttribute("class", "item active");
            }
            carouselInner.appendChild(itemActive);

            var imagen = document.createElement("img");
            imagen.setAttribute("src", product.images[i]);
            imagen.setAttribute("class", "img-responsive");
            itemActive.appendChild(imagen);
        }

        var leftControl = document.createElement("a");
        leftControl.setAttribute("class", "left carousel-control");
        leftControl.setAttribute("href", "#myCarousel");
        leftControl.setAttribute("data-slide", "prev");
        carrusel.appendChild(leftControl);

        var simboloMenor = document.createElement("span");
        simboloMenor.setAttribute("class", "glyphicon glyphicon-chevron-left");
        leftControl.appendChild(simboloMenor);

        var previous = document.createElement("span");
        previous.setAttribute("class", "sr-only");
        leftControl.appendChild(previous);
        var previousTexto = document.createTextNode("Previous");
        previous.appendChild(previousTexto);

        var rightControl = document.createElement("a");
        rightControl.setAttribute("class", "right carousel-control");
        rightControl.setAttribute("href", "#myCarousel");
        rightControl.setAttribute("data-slide", "next");
        carrusel.appendChild(rightControl);

        var simboloMayor = document.createElement("span");
        simboloMayor.setAttribute("class", "glyphicon glyphicon-chevron-right");
        rightControl.appendChild(simboloMayor);

        var next = document.createElement("span");
        next.setAttribute("class", "sr-only");
        rightControl.appendChild(next);
        var nextTexto = document.createTextNode("Next");
        next.appendChild(nextTexto);


        var panelFooter = document.createElement("div");
        panelFooter.setAttribute("class", "panel-footer");
        panel.appendChild(panelFooter);

        var descripcion = document.createElement("h2");
        panelFooter.appendChild(descripcion);
        var textoDescripcion = document.createTextNode("Descripción:");
        descripcion.appendChild(textoDescripcion);

        var parrafoDescripcion = document.createElement("p");
        panelFooter.appendChild(parrafoDescripcion);
        var textoParrafoDescripcion = document.createTextNode(product.description);
        parrafoDescripcion.appendChild(textoParrafoDescripcion);
        descripcion.appendChild(textoDescripcion);

    }


    function globalProductPopulate() {

        var categories = showCategories();
        var categoryProducts;
        var tiendas;
        var tienda;
        var product;
        var lastProduct;
        var i;
        var j;
        var x;
        var stock;
        var suma = 0;

        var categorias = document.getElementById("menuCategoryShopPopulate");
        var shopPopulate = document.getElementById("shopPopulate");
        var detalleProducto = document.getElementById("detalleProducto");
        var globalProductPopulate = document.getElementById("globalProductPopulate");
        var menuCategoryShopPopulateRepetido = document.getElementById("menuCategoryShopPopulate");
        var returnShopProduct = document.getElementById("returnShopProduct");


        if (categorias !== null) {
            categorias.remove();
        }

        if (shopPopulate !== null) {
            shopPopulate.remove();
        }

        if (detalleProducto !== null) {
            detalleProducto.remove();
        }

        if (globalProductPopulate !== null) {
            globalProductPopulate.remove();
        }

        if (menuCategoryShopPopulateRepetido !== null) {

            menuCategoryShopPopulateRepetido.remove();
        }

        if (returnShopProduct !== null) {

            returnShopProduct.remove();
        }

        var initPopulate = document.getElementById("initPopulate");
        initPopulate.style.display = "none";


        var main = document.getElementById("contenedorPrincipal");
        var globalProductPopulate = document.createElement("div");
        globalProductPopulate.setAttribute("id", "globalProductPopulate");
        main.appendChild(globalProductPopulate);

        var mainH2 = document.createElement("h2");
        mainH2.setAttribute("class", "text-center bold titulo");
        mainH2.appendChild(document.createTextNode("Productos Globales"));
        globalProductPopulate.appendChild(mainH2);


        for (i = 1; i < categories.length; i++) {
            categoryProducts = almacen.getCategoryProduct(categories[i]);

            console.log("La categoria Global: " + categories[i].title);


            var nameCategory = document.createElement("h3");
            nameCategory.setAttribute("class", "text-center bold titulo");
            nameCategory.appendChild(document.createTextNode(categories[i].title));
            globalProductPopulate.appendChild(nameCategory);

            var row = document.createElement("div");
            row.setAttribute("class", "row");
            globalProductPopulate.appendChild(row);


            for (j = 0; j < categoryProducts.length; j++) {
                suma = 0;
                tiendas = almacen.shops;
                tienda = tiendas.next();
                if (x > 4) {
                    x = 0;

                    row = document.createElement("div");
                    row.setAttribute("class", "row");
                    globalProductPopulate.appendChild(row);

                }
                x++;

                var producto = document.createElement("div");
                producto.setAttribute("class", "col-md-4 col-sm-6 col-xs-12");
                row.appendChild(producto);

                var panelProducto = document.createElement("div");
                panelProducto.setAttribute("class", "panel panel-default text-center producto");
                producto.appendChild(panelProducto);

                var panelBodyProducto = document.createElement("div");
                panelBodyProducto.setAttribute("class", "panel-body");
                panelProducto.appendChild(panelBodyProducto);

                while (tienda.done !== true) {

                    product = showProductShop2(almacen.getShopProduct(tienda.value), categoryProducts[j], tienda.value);

                    if (product != "") {

                        if (lastProduct !== product.serialNumber) {
                            lastProduct = product.serialNumber;

                            var tituloProducto = document.createElement("h3");
                            var textoTituloProducto = document.createTextNode(product.name);
                            tituloProducto.appendChild(textoTituloProducto);
                            panelBodyProducto.appendChild(tituloProducto);

                            var imgProducto = document.createElement("img");
                            imgProducto.setAttribute("class", "img-responsive");
                            imgProducto.setAttribute("src", product.images[0]);
                            panelBodyProducto.appendChild(imgProducto);
                        }

                        stock = almacen.getProductStock(product, tienda.value);
                        suma += stock;
                        var disponibilidadTienda = document.createElement("p");
                        var textodisponibilidadTienda = document.createTextNode("En la tienda " + tienda.value.name + " tiene de stock " + stock);
                        disponibilidadTienda.appendChild(textodisponibilidadTienda);
                        panelBodyProducto.appendChild(disponibilidadTienda);

                    }

                    tienda = tiendas.next();
                }

                var panelFooterProducto = document.createElement("div");
                panelFooterProducto.setAttribute("class", "panel-footer");
                panelProducto.appendChild(panelFooterProducto);

                var stockTotal = document.createElement("h3");
                var textoStockTotal = document.createTextNode("Stock total: " + suma);
                stockTotal.appendChild(textoStockTotal);
                panelFooterProducto.appendChild(stockTotal);

            }
        }

    }


//Creamos categorias

    var telefonos = new Category("Telefonos");
    telefonos.description = "Descripción categoría Telefonos";
    var televisiones = new Category("Televisiones");
    televisiones.description = "Descripción categoría Televisiones";
    var portatiles = new Category("Portatiles");
    portatiles.description = "Descripción categoría Portatiles";
    var ropa = new Category("Ropa");
    ropa.description = "Descripción categoría Ropa";


// Creamos productos


    var movil1 = new Smartphone("1", "Apple iPhone X 256GB Plata Libre", "1299");
    movil1.images = ["img/iphone-x.jpg", "img/iphone-x2.jpg", "img/iphone-x3.jpg", "img/iphone-x4.jpg"];
    movil1.description = "La pantalla del iPhone X tiene esquinas redondeadas que rematan el diseño curvo del teléfono, y esas esquinas se encuentran dentro de un rectángulo estándar. Si se mide el rectángulo estándar, la pantalla tiene 5,85 pulgadas en diagonal (la superficie real de visión es inferior).";

    var movil2 = new Smartphone("2", "Samsung Galaxy S8 4G 64GB Plata Libre", "699");
    movil2.images = ["img/samsung-s8.jpg", "img/samsung-s82.jpg", "img/samsung-s83.jpg", "img/samsung-s84.jpg"];
    movil2.description = "¡Da la bienvenida a la pantalla infinita! El revolucionario diseño de Galaxy S8 y S8+ comienza desde su interior. Se ha redefinido cada componente del Smartphone para romper con los límites de su pantalla, despidiéndonos de los marcos. Así todo lo que verás será contenido y nada más. Disfruta de la pantalla más grande e inmersiva fabricada para un dispositivo móvil que podrás sostener con una sola mano. Galaxy S8 y S8+ te liberan de los confines de los marcos, ofreciéndote una superficie lisa e ininterrumpida que fluye sobre sus bordes. "

    var movil3 = new Smartphone("7", "LG G6 32GB Plata Libre", "439");
    movil3.images = ["img/lg-g6.jpg", "img/lg-g62.jpg", "img/lg-g63.jpg", "img/lg-g64.jpg"];
    movil3.description = "El LG G6 tiene un diseño refinado resistente al agua y una pantalla casi sin bordes que lo hacen relativamente compacto a pesar de ser de 5.7 pulgadas. La combinación de cámaras es un placer de usar y es algo difícil de encontrar en el mercado; tiene ranura microSD y su desempeño muy bueno.";

    var tele1 = new TV("3", "Samsung QE55Q7C 55\" QLED UltraHD 4K Curvo", "1799");
    tele1.images = ["img/samsung-curve.jpg", "img/samsung-curve2.jpg", "img/samsung-curve3.jpg", "img/samsung-curve4.jpg"];
    tele1.description = "Te presentamos lo último de Samsung la Serie 7 QLED. Simplemente Innovador La tecnología Quantum Dot es capaz de reproducir todos los colores gracias a su nuevo recubrimiento metálico. Disfruta de una experiencia de visualización fuera de este mundo.";

    var tele2 = new TV("4", "LG 55SJ950V 55\" UltraHD 4K", "1649");
    tele2.images = ["img/lg-4k.jpg", "img/lg-4k2.jpg", "img/lg-4k3.jpg", "img/lg-4k4.jpg"];
    tele2.description = "Colores más precisos gracias a la tecnología Nanocell que absorbe frecuencias lumínicas no deseadas para buscar la pureza de los colores primarios, rojo, verde y azul, que componen el resto. La combinación de la tecnología Nano Cell y la pantalla IPS hacen que color y brillo se mantengan constantes y 100% precisos desde un ángulo de visión más amplio que otros LED con pantallas VA.";

    var tele3 = new TV("8", "Sony KD49XE9005 49\" LED UltraHD 4K", "1019");
    tele3.images = ["img/sony-tv.jpg", "img/sony-tv2.jpg", "img/sony-tv3.jpg", "img/sony-tv4.jpg"];
    tele3.description = "La realidad con un contraste excepcional Preciosas vistas nocturna con luces brillantes y negros profundos. Con hasta 5 veces 2 el contraste de un TV LED convencional, las escenas oscuras son más oscuras y las brillantes aún más brillantes.";
    var portatil1 = new Laptop("5", "Lenovo Yoga 520-14IKB Intel Core i5-7200U/8GB/1TB/14\" Táctil", "889");
    portatil1.images = ["img/yoga.jpg", "img/yoga2.jpg", "img/yoga3.jpg", "img/yoga4.jpg", "img/yoga5.jpg"];
    portatil1.description = "Te presentamos el portátil Yoga 520-14IKB de Lenovo. El Yoga 520 (14\") tiene un único reposamanos de diamante tallado. Además, es más delgado y ligero que las generaciones anteriores y tiene el doble de almacenamiento. Además de recargarse más de un 40 % más rápido que los portátiles normales, el Yoga 510se puede dar la vuelta, doblar, inclinar y mantener de pie para satisfacer sus necesidades.";


    var portatil2 = new Laptop("6", "Apple MacBook Pro Retina Display Intel i7/16GB/256GB/15.4\"", "1999");
    portatil2.images = ["img/mac-pro.jpg", "img/mac-pro2.jpg", "img/mac-pro3.jpg", "img/mac-pro4.jpg"];
    portatil2.description = "El MacBook Pro con pantalla Retina sorprende porque es asombrosamente fino y ligero. Pero lo increíble de verdad es que un portátil así sea, además, tan y tan potente. Conseguir semejante rendimiento en un diseño como este no ha sido fácil. En absoluto. Cada milímetro está fabricado y montado con la máxima precisión. Y al diseñarlo hemos tenido que tomar decisiones arriesgadas. Un ejemplo: hemos sustituido viejas tecnologías como el disco duro giratorio y las unidades de disco óptico, que tanto ocupan, por opciones de alto rendimiento como el almacenamiento flash. ¿Por qué? Porque es mucho más rápido y fiable y ocupa hasta un 90% menos. Con todo esto, no es extraño que el MacBook Pro sea tan versátil y cómodo de llevar.";


//Creamos Tiendas

    var tienda1 = new Shop("1", "MediaMarkt");
    var tienda2 = new Shop("2", "Worten");
    var tienda3 = new Shop("3", "PcComponentes");

    console.log("##### Testeo StoreHouse. ##### ");
    var almacen = StoreHouse.getInstance();
    almacen.name = "Almacen de prueba";
    console.log("Instancia StoreHouse: " + almacen.name);
    console.log("");
    console.log("####################################################################");
    console.log("añadimos las categorias Telefonos,televisiones,portatiles y ropa");
    console.log(almacen.addCategory(telefonos));
    console.log(almacen.addCategory(televisiones));
    console.log(almacen.addCategory(portatiles));

    almacen.addProduct(movil1, telefonos);
    almacen.addProduct(movil2, telefonos);
    almacen.addProduct(movil3, telefonos);
    almacen.addProduct(tele1, televisiones);
    almacen.addProduct(tele2, televisiones);
    almacen.addProduct(tele3, televisiones);
    almacen.addProduct(portatil1, portatiles);
    almacen.addProduct(portatil2, portatiles);


    almacen.addShop(tienda1);
    almacen.addShop(tienda2);
    almacen.addShop(tienda3);


    almacen.addProductInShop(movil1, almacen.defaultShop, 55);
    almacen.addProductInShop(movil2, almacen.defaultShop, 44);
    almacen.addProductInShop(movil3, almacen.defaultShop, 28);
    almacen.addProductInShop(tele1, almacen.defaultShop, 70);
    almacen.addProductInShop(tele2, almacen.defaultShop, 42);
    almacen.addProductInShop(tele3, almacen.defaultShop, 77);
    almacen.addProductInShop(portatil1, almacen.defaultShop, 14);
    almacen.addProductInShop(portatil2, almacen.defaultShop, 20);

    almacen.addProductInShop(movil1, tienda1, 20);
    almacen.addProductInShop(tele1, tienda1, 40);
    almacen.addProductInShop(tele2, tienda1, 30);
    almacen.addProductInShop(portatil1, tienda1, 18);

    almacen.addProductInShop(movil1, tienda2, 50);
    almacen.addProductInShop(movil2, tienda2, 24);
    almacen.addProductInShop(tele1, tienda2, 70);
    almacen.addProductInShop(tele2, tienda2, 40);
    almacen.addProductInShop(portatil1, tienda2, 10);
    almacen.addProductInShop(portatil2, tienda2, 15);


    almacen.addProductInShop(movil1, tienda3, 26);
    almacen.addProductInShop(movil2, tienda3, 40);
    almacen.addProductInShop(movil3, tienda3, 59);
    almacen.addProductInShop(tele1, tienda3, 49);
    almacen.addProductInShop(tele2, tienda3, 22);
    almacen.addProductInShop(tele3, tienda3, 47);
    almacen.addProductInShop(portatil1, tienda3, 25);
    almacen.addProductInShop(portatil2, tienda3, 28);

    initPopulate();
    shopsMenusPopulate();

}


window.onload = init();