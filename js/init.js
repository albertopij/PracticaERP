"use strict";
const DB_NAME = 'UT07Indexed_erp';
const DB_VERSION = 1;
const DB_STORE_NAME1 = 'categories';
const DB_STORE_NAME2 = 'shops';


function init() {

    var contenedorPrincipal = document.getElementById("contenedorPrincipal");
    var etiquetaNav = document.getElementsByTagName("nav");
    var ventana;
    var ventanas = [];
    var tiendasObjectStore = [];
    var categoriasObjectStore = [];


    function showCategories() {
        var categorias = [];
        console.log("Recorremos las categorias.");
        var categories = almacen.categories;
        var category = categories.next();
        while (category.done !== true) {
            console.log("Category: " + category.value.description);
            categorias.push(category.value);
            category = categories.next();
        }

        return categorias;
    }

    function showShops() {
        var tiendas = [];
        console.log("Recorremos las tiendas.");
        var shops = almacen.shops;
        var shop = shops.next();
        while (shop.done !== true) {
            console.log("Shop: " + shop.value.name);
            tiendas.push(shop.value);
            shop = shops.next();
        }

        return tiendas;
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

        $("#logo").click(function () {

            $("#mapPopulate").hide();
            $("#categoryPopulate").remove();
            $("#menuCategoryShopPopulate").remove();
            $("#shopPopulate").remove();
            $("#detalleProducto").remove();
            $("#globalProductPopulate").remove();
            $("#initPopulate").css("display", "");

        });


        $("#closeAllWindows").click(function () {
            var i;
            for (i = 0; i < ventanas.length; i++) {
                if (!ventanas[i].close()) {
                    ventanas[i].close();
                }
            }
            ventanas = [];
        });
        $("#contenedorPrincipal").append("<div id='initPopulate' class='container'></div>");
        $("#initPopulate").append("<button id='buttonAddShop' class='btn btn-md loggin text-center' type='button' data-toggle='modal' data-target='#addShop'>Añadir tienda <span class='glyphicon glyphicon-plus'></span></button>");
        $("#buttonAddShop").click(myMapAddShop());

        $("#initPopulate").append("<button id='buttonAddProductERP' class='btn btn-md loggin text-center' type='button' data-toggle='modal' data-target='#addProductERP'>Añadir Producto <span class='glyphicon glyphicon-plus'></span></button>");
        $("#initPopulate").append("<button id='buttonSaveState' class='btn btn-md loggin text-center' type='button'>Guardar Estado <span class='glyphicon glyphicon-save'></span></button>");

        $("#buttonSaveState").click(saveState);

        $("#initPopulate").append("<h2 class='text-center bold titulo'>Inicio</h2>");

        $("#initPopulate").append("<div class='row'></div>");

        while (shop.done !== true) {

            i++;

            if (i > 4) {
                i = 0;
                $("#initPopulate").append("<div class='row'></div>");

            }

            var dirImg;
            if (shop.value.image !== undefined || shop.value.image == "") {
                dirImg = shop.value.image;

            } else {
                dirImg = "img/noShopImage.jpg";
            }

            $("#initPopulate .row:last").append("<div class='col-md-3 col-sm-6 col-xs-12 tiendas'></div>");
            $("#initPopulate .tiendas:last").append("<div class='panel panel-default text-center'></div>");
            $("#initPopulate .tiendas:last .panel-default").append("<div class='panel-heading'><h2>" + shop.value.name + "</h2></div>");
            $("#initPopulate .tiendas:last .panel-default").append("<div class='panel-body'><img class='img-responsive' src='" + dirImg + "'></div>");

            if (shop.value.name !== "defaultShop") {
                $("#initPopulate .tiendas:last .panel-default>.panel-body").append("<button class='btn btn-success loggin pull-left' type='button' data-toggle='modal' data-target='#updateShop'>Modificar</button>");
                $("#initPopulate .tiendas:last .panel-default>.panel-body").append("<button class='btn btn-danger loggin pull-right' type='button' data-toggle='modal' data-target='#removeShop'>Eliminar</button>");

                $($("#initPopulate .tiendas:last .panel-default>.panel-body>.btn-success")).click(createFunctionUpdateShop(shop.value));

                $($("#initPopulate .tiendas:last .panel-default>.panel-body>.btn-danger")).click(createFunctionRemoveShop(shop.value));
            }

            $("#initPopulate .tiendas:last .panel-default").append("<div class='panel-footer'><button class='btn btn-lg tienda'>Ver Tienda</button></div>");

            $($("#initPopulate .tiendas:last .panel-default>.panel-footer> button")).click(createFunctionShowShop(shop.value));

            shop = shops.next();
        }


        var categories = almacen.categories;
        var category = categories.next();

        while (category.done !== true) {

            $("#selectCategoryProduct").append("<option value='" + category.value.title + "' class='optionDinamico'>" + category.value.title + "</option>");

            category = categories.next();
        }


        var i;
        var categories = almacen.categories;
        var category = categories.next();
        while (category.done !== true) {

            var product = almacen.getCategoryProduct(category.value);
            if (product.length > 0) {

                $("#selectProduct").append("<optgroup label='" + category.value.title + "' class='optionDinamico'></optgroup>");

                for (i = 0; i < product.length; i++) {

                    $("#selectProduct optgroup:last").append("<option value='" + product[i].serialNumber + "' class='optionDinamico'>" + product[i].name + "</option>");
                }

            }
            category = categories.next();
        }

        function createFunctionUpdateShop(shop) {
            return function () {

                myMapUpdateShop();
                $("#nameShop2").val(shop.name);

                if (shop.image !== undefined && shop.image !== "") {
                    $("#imageShop2").val(shop.image);
                }

                if (shop.address !== undefined) {
                    $("#addressShop2").val(shop.address);
                }

                if (shop.telf !== undefined) {

                    $("#telfShop2").val(shop.telf);
                }

                if (shop.coords.latitude !== undefined) {

                    $("#latitudeUpdateShop").val(shop.coords.latitude);
                }

                if (shop.coords.longitude !== undefined) {
                    $("#longitudeUpdateShop").val(shop.coords.longitude);
                }

                myMapUpdateShop();


                $("#buttonUpdateShop").remove();

                $("#BupdateShop").append("<button id='buttonUpdateShop' class='btn btn-block btn-classic' data-dismiss='modal'>Modificar</button>");

                $("#buttonUpdateShop").click(update(shop));
            }
        }

        function update(shop) {
            return function () {
                functionUpdateShop(shop);
            }
        }

        function createFunctionShowShop(shop) {
            return function () {
                shopPopulate(shop);
                checkCookie();
            }
        }

        function createFunctionRemoveShop(shop) {
            return function () {
                removeShop(shop);
            }
        }

    }

    function shopsMenusPopulate() {


        $("nav").append("<div id='nav1' class='container-fluid navbar navbar-default' role='navigation'></div>");
        $("#nav1").append("<div class='navbar-header'><button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-ex1-collapse'>" +
            "<span class='icon-bar'></span><span class='icon-bar'></span><span class='icon-bar'></span></button></div>");


        $("#nav1:first-child").append("<a class='navbar-brand' href='#'>ERP</a>");
        $("#nav1:first-child > a:first").click(function () {

            $("#mapPopulate").hide();
            $("#categoryPopulate").remove();
            $("#menuCategoryShopPopulate").remove();
            $("#shopPopulate").remove();
            $("#detalleProducto").remove();
            $("#globalProductPopulate").remove();
            $("#initPopulate").css("display", "");
        });

        $("#nav1").append("<div id='navBar' class='collapse navbar-collapse navbar-ex1-collapse'><ul id='navLeft' class='nav navbar-nav'></ul></div>");
        $("#navLeft").append("<li><a href='#'>Tiendas</a></li>");
        $("#navLeft > li:last a ").click(function () {

            $("#mapPopulate").hide();
            $("#categoryPopulate").remove();
            $("#menuCategoryShopPopulate").remove();
            $("#shopPopulate").remove();
            $("#detalleProducto").remove();
            $("#globalProductPopulate").remove();
            $("#initPopulate").css("display", "");
        });


        $("#navLeft").append("<li><a href='#'>Categorías Globales</a></li>");
        $("#navLeft > li:last a ").click(categoryPopulate);

        $("#navLeft").append("<li><a href='#'>Productos Globales</a></li>");
        $("#navLeft > li:last a ").click(globalProductPopulate);

        $("#navLeft").append("<li><a href='#'>Mapa</a></li>");
        $("#navLeft > li:last a ").click(mapPopulate);


        $("#navLeft").append("<li><a href='#' id='closeAllWindows2' class='hidden-sm hidden-md hidden-lg'>Cerrar Ventanas</a></li>");
        $("#closeAllWindows2").click(function () {
            var i;
            for (i = 0; i < ventanas.length; i++) {
                if (!ventanas[i].close()) {
                    ventanas[i].close();
                }
            }
            ventanas = [];
        });

        $("#nav1:first-child").append("<button id='buttonAccess2' class='btn btn-md pull-right' data-toggle='modal' data-target='#modalAccess'><span class='glyphicon glyphicon-user'> Acceso</span></button>");

        $("#nav1:first-child").append("<div id='loggin2' class='pull-right'></div>");
    }

    function shopPopulate(shop) {

        $("#globalProductPopulate").remove();

        menuCategoryShopPopulate(shop);

        $("#initPopulate").hide();


        var tienda = shop;
        var j = 0;
        var i;

        $("#shopPopulate").remove();
        $("#detalleProducto").remove();

        var productos = showProductShop1(almacen.getShopProduct(tienda), tienda);


        $("#contenedorPrincipal").append("<div id='shopPopulate' class='.container-fluid'></div>");


        $("#shopPopulate").append("<button class='btn btn-md loggin text-center' type='button' data-toggle='modal' data-target='#addProductShop'>Añadir Producto <span class='glyphicon glyphicon-plus'></span></button>");

        $("#shopPopulate").append("<h2 class='text-center bold titulo'>Tienda " + shop.name + "</h2>");

        $("#shopPopulate").append("<div class='row'></div>");

        var x = 0;
        for (i = 0; i < productos.length; i++) {

            j++;

            if (j > 4) {
                j = 0;
                $("#shopPopulate").append("<div class='row'></div>");
            }

            $("#shopPopulate .row:last").append("<div class='col-md-3 col-sm-6 col-xs-12 productos'></div>");
            $("#shopPopulate .row:last .productos:last").append("<div class='panel panel-default text-center producto'></div>");
            $("#shopPopulate .productos:last .panel-default").append("<div class='panel-body'><img src='" + productos[i].images[0] + "'></div>");


            $("#shopPopulate .productos:last .panel-default .panel-body").append("<button class='btn btn-success loggin pull-left' type='button' data-toggle='modal' data-target='#updateProduct'>Modificar</button>");
            $("#shopPopulate .productos:last .panel-default .panel-body button:last").click(createFunctionUpdateProduct(productos[i], shop));


            $("#shopPopulate .productos:last .panel-default .panel-body").append("<button class='btn btn-danger loggin pull-right' type='button' data-toggle='modal' data-target='#removeProduct'>Eliminar</button>");

            $("#shopPopulate .productos:last .panel-default .panel-body button:last").click(createFunctionRemoveProduct(productos[i], tienda));

            $("#shopPopulate .productos:last .panel-default").append("<div class='panel-footer'></div>");

            $("#shopPopulate .productos:last .panel-default .panel-footer").append("<p>" + productos[i].name + "</p><h3 class='bold'>" + productos[i].price + "€</h3>");

            $("#shopPopulate .productos:last .panel-default .panel-footer").append("<button class='btn btn-lg'>Ver Detalle</button>");

            $("#shopPopulate .productos:last .panel-default .panel-footer button:last").click(createFunctionShowShopDetailProduct(tienda, productos[i]));

        }
        $("#buttonAddProductShop").remove();

        $("#formAddProductShop").append("<button id='buttonAddProductShop' class='btn btn-block btn-classic' data-dismiss='modal'><span class='glyphicon glyphicon-plus'> Añadirrrrrrrrrrr</span></button>");


        $("#buttonAddProductShop").click(createFunctionAddProduct());
        checkCookie();


        function createFunctionUpdateProduct(product, shop) {
            return function () {

                document.getElementById("formUpdateProduct").reset();


                $("#nameProduct2").val(product.name);

                $("#priceProduct2").val(product.price);


                if (product.images !== undefined && product.images[0] !== "") {

                    $("#imageProduct2").val(product.images[0]);
                }


                if (product.description !== undefined) {

                    $("#descripcionProduct2").val(product.description);
                }


                $("#buttonUpdateProduct").remove();


                $("#formUpdateProduct").append("<button id='buttonUpdateProduct' class='btn btn-block btn-classic' data-dismiss='modal'>Modificar</button>");

                $("#buttonUpdateProduct").click(update(product, shop));
            }
        }

        function update(product) {
            return function () {
                functionUpdateProduct(product, shop);
            }
        }

        function createFunctionAddProduct() {
            return function () {
                if (x === 0) {
                    addProduct(shop);
                }
                x++;
            }
        }

        function addProduct() {
            addProductInShop(shop);
        }

        function createFunctionRemoveProduct(product, shop) {
            return function () {
                removeProduct(product, shop);
            }
        }

        function createFunctionShowShopDetailProduct(shop, product) {
            return function () {


                ventana = window.open("detalleProducto.html", "", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=700,height=400");

                ventana.onload = montarVentana;

                ventanas.push(ventana);

                function montarVentana() {
                    productShopPopulate(shop, product);
                }
            }
        }
    }

    function menuCategoryShopPopulate(shop) {

        var tienda = shop;
        var j = 0;
        var i;
        var productsCategory = [];
        var productosTienda = showProductShop1(almacen.getShopProduct(tienda), tienda);
        var productos = showProductShop1(almacen.getShopProduct(tienda), tienda);
        var categoriasTienda = [];


        $("#menuCategoryShopPopulate").remove();

        $("#navLeft").append("<li id='menuCategoryShopPopulate' class='dropdown'></li>");
        $("#menuCategoryShopPopulate").append("<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>Categorias <span class='caret'></span></span></a>");
        $("#menuCategoryShopPopulate").append("<ul class='dropdown-menu'></ul>");


        var categories = almacen.categories;
        var category = categories.next();


        $("#menuCategoryShopPopulate ul").append("<li><a href='#'>Todas las categorias</a></li>");
        $("#menuCategoryShopPopulate ul a").click(createFunctionShowShop(tienda));


        function getProductPosition1(product, categoriesProduct) {

            function compareElements(element) {
                return (element.serialNumber === product.serialNumber)
            }

            return categoriesProduct.findIndex(compareElements);
        }

        while (category.done !== true) {
            productsCategory = almacen.getCategoryProduct(category.value);


            for (i = 0; i < productosTienda.length; i++) {


                if (getProductPosition1((productosTienda[i]), productsCategory) > -1 && categoriasTienda.indexOf(category.value) < 0) {

                    $("#menuCategoryShopPopulate ul").append("<li><a href='#'>" + category.value.title + "</a></li>");
                    categoriasTienda[j] = category.value;
                    $("#menuCategoryShopPopulate ul li:last a").click(createFunctionShowShopCategoryProduct(tienda, category.value));

                    j++;
                }
            }

            category = categories.next();
        }

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

        $("#globalProductPopulate").remove();

        menuCategoryShopPopulate(shop);

        $("#initPopulate").hide();


        var tienda = shop;
        var j = 0;
        var i;
        var productsCategory = almacen.getCategoryProduct(category);

        $("#shopPopulate").remove();
        $("#detalleProducto").remove();

        var productos = showProductShop1(almacen.getShopProduct(tienda), tienda);


        $("#contenedorPrincipal").append("<div id='shopPopulate' class='.container-fluid'></div>");


        $("#shopPopulate").append("<button class='btn btn-md loggin text-center' type='button' data-toggle='modal' data-target='#addProductShop'>Añadir Producto <span class='glyphicon glyphicon-plus'></span></button>");

        $("#shopPopulate").append("<h2 class='text-center bold titulo'>Tienda " + shop.name + "</h2>");

        $("#shopPopulate").append("<div class='row'></div>");

        var x = 0;
        for (i = 0; i < productos.length; i++) {


            if (j > 4) {
                j = 0;
                $("#shopPopulate").append("<div class='row'></div>");
            }

            if (getProductPosition(productos[i], productsCategory) > -1) {
                j++;


                $("#shopPopulate .row:last").append("<div class='col-md-3 col-sm-6 col-xs-12 productos'></div>");
                $("#shopPopulate .row:last .productos:last").append("<div class='panel panel-default text-center producto'></div>");
                $("#shopPopulate .productos:last .panel-default").append("<div class='panel-body'><img src='" + productos[i].images[0] + "'></div>");


                $("#shopPopulate .productos:last .panel-default .panel-body").append("<button class='btn btn-success loggin pull-left' type='button' data-toggle='modal' data-target='#updateProduct'>Modificar</button>");
                $("#shopPopulate .productos:last .panel-default .panel-body button:last").click(createFunctionUpdateProduct(productos[i], shop));


                $("#shopPopulate .productos:last .panel-default .panel-body").append("<button class='btn btn-danger loggin pull-right' type='button' data-toggle='modal' data-target='#removeProduct'>Eliminar</button>");

                $("#shopPopulate .productos:last .panel-default .panel-body button:last").click(createFunctionRemoveProduct(productos[i], tienda));

                $("#shopPopulate .productos:last .panel-default").append("<div class='panel-footer'></div>");

                $("#shopPopulate .productos:last .panel-default .panel-footer").append("<p>" + productos[i].name + "</p><h3 class='bold'>" + productos[i].price + "€</h3>");

                $("#shopPopulate .productos:last .panel-default .panel-footer").append("<button class='btn btn-lg'>Ver Detalle</button>");

                $("#shopPopulate .productos:last .panel-default .panel-footer button:last").click(createFunctionShowShopDetailProduct(tienda, productos[i]));

            }

        }

        checkCookie();


        function getProductPosition(product, categoriesProduct) {

            function compareElements(element) {
                return (element.serialNumber === product.serialNumber)
            }

            return categoriesProduct.findIndex(compareElements);
        }

        function createFunctionUpdateProduct(product, shop) {
            return function () {
                document.getElementById("formUpdateProduct").reset();


                $("#nameProduct2").val(product.name);

                $("#priceProduct2").val(product.price);


                if (product.images !== undefined && product.images[0] !== "") {

                    $("#imageProduct2").val(product.images[0]);
                }


                if (product.description !== undefined) {

                    $("#descripcionProduct2").val(product.description);
                }


                $("#buttonUpdateProduct").remove();


                $("#formUpdateProduct").append("<button id='buttonUpdateProduct' class='btn btn-block btn-classic' data-dismiss='modal'>Modificar</button>");

                $("#buttonUpdateProduct").click(update(product, shop));
            }

        }

        function update(product) {
            return function () {
                functionUpdateProduct(product, shop);
            }
        }


        function createFunctionRemoveProduct(product, shop) {
            return function () {
                removeProduct(product, shop, category);
            }
        }

        function createFunctionShowShopDetailProduct(shop, product) {
            return function () {


                ventana = window.open("detalleProducto.html", "", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=700,height=400");

                ventana.onload = montarVentana;

                ventanas.push(ventana);

                function montarVentana() {
                    productShopPopulate(shop, product);
                }
            }
        }
    }

    function productShopPopulate(shop, product) {

        var contenedorPrincipal = ventana.document.getElementById("contenedorPrincipal");

        var contenedorPanel = ventana.document.createElement("div");
        contenedorPanel.setAttribute("id", "detalleProducto");
        contenedorPanel.setAttribute("class", "col-sm-8 col-sm-offset-2 col-xs-12");
        contenedorPrincipal.appendChild(contenedorPanel);


        var mainH2 = ventana.document.createElement("h2");
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

        var i;

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
        var categories = showCategories();


        $("#mapPopulate").hide();
        $("#categoryPopulate").remove();
        $("#menuCategoryShopPopulate").remove();
        $("#shopPopulate").remove();
        $("#detalleProducto").remove();
        $("#globalProductPopulate").remove();
        $("#initPopulate").css("display", "none");


        $("#contenedorPrincipal").append("<div id='globalProductPopulate'><h2 class='text-center bold titulo'>Productos Globales</h2></div>");

        for (i = 0; i < categories.length; i++) {
            categoryProducts = almacen.getCategoryProduct(categories[i]);
            if (categoryProducts.length > 0) {

                $("#globalProductPopulate").append("<h3 class='text-center bold titulo'>" + categories[i].title + "</h3>");
                $("#globalProductPopulate").append("<div class='row'></div>");
            }

            for (j = 0; j < categoryProducts.length; j++) {
                suma = 0;
                tiendas = almacen.shops;
                tienda = tiendas.next();
                if (x > 4) {
                    x = 0;
                    $("#globalProductPopulate").append("<div class='row'></div>");
                }
                x++;

                $("#globalProductPopulate .row:last").append("<div class='col-md-4 col-sm-6 col-xs-12 gProducts'></div>");

                $("#globalProductPopulate .row:last .gProducts:last").append("<div class='panel panel-default text-center producto'></div>");

                $("#globalProductPopulate .gProducts:last .panel-default:last").append("<div class='panel-body'></div>");

                var numTienda = 0;
                while (tienda.done !== true) {

                    product = showProductShop2(almacen.getShopProduct(tienda.value), categoryProducts[j], tienda.value);

                    if (product != "") {

                        if (lastProduct !== product.serialNumber) {
                            lastProduct = product.serialNumber;

                            $("#globalProductPopulate .gProducts:last .panel-default:last .panel-body").append("<h3>" + product.name + "</h3>");
                            $("#globalProductPopulate .gProducts:last .panel-default:last .panel-body").append("<img src='" + product.images[0] + "' class='img-responsive'>");


                        }

                        stock = almacen.getProductStock(product, tienda.value);
                        suma += parseInt(stock);

                        $("#globalProductPopulate .gProducts:last .panel-default:last .panel-body").append("<p>" + tienda.value.name + " tiene de stock " + stock + "</p>");

                        $("#globalProductPopulate .panel-default:last .panel-body p:last").append("<button id='updateGlobalProduct" + numTienda + "' class='btn btn-md loggin pull-right' data-toggle='modal' data-target='#updateGlobalProduct'><span class='glyphicon glyphicon-pencil'></span></button>");


                        $("#globalProductPopulate .panel-default:last .panel-body p:last #updateGlobalProduct" + numTienda).on("click", createFunctionUpdateGlobalProduct(product, tienda.value));

                    }
                    numTienda++;
                    tienda = tiendas.next();
                }
                $("#globalProductPopulate .gProducts:last .panel-default:last").append("<div class='panel-footer'><h3>Stock total: " + suma + "</h3></div>");
            }
        }


        function createFunctionUpdateGlobalProduct(product, shop) {

            return function () {
                $("#buttonUpdateGlobalProduct").remove();


                $("#formUpdateGlobalProduct").append("<button id='buttonUpdateGlobalProduct' class='btn btn-block btn-classic' type='button' data-dismiss='modal'>Modificar</button>");

                $("#buttonUpdateGlobalProduct").click(update(product, shop));
            }
        }

        function update(product, shop) {
            return function () {
                functionUpdateGlobalProduct(product, shop);

            }
        }

        checkCookie();
    }

    function categoryPopulate() {

        $("#mapPopulate").hide();
        $("#categoryPopulate").remove();
        $("#menuCategoryShopPopulate").remove();
        $("#shopPopulate").remove();
        $("#detalleProducto").remove();
        $("#globalProductPopulate").remove();
        $("#initPopulate").css("display", "none");

        var categorias = showCategories();
        var j = 0;
        var i;

        $("#contenedorPrincipal").append("<div id='categoryPopulate' class='container-fluid'></div>");
        $("#categoryPopulate").append("<button class='btn btn-md loggin text-center' type='button' data-toggle='modal' data-target='#addCategory'>Añadir Categoría <span class='glyphicon glyphicon-plus'></span></button>");

        $("#categoryPopulate").append("<h2 class='text-center bold titulo'>Categorías</h2>")

        $("#categoryPopulate").append("<div class='row'></div>");


        for (i = 0; i < categorias.length; i++) {

            j++;

            if (j > 4) {
                j = 0;

                $("#categoryPopulate").append("<div class='row'></div>");
            }

            $("#categoryPopulate .row:last").append("<div class='col-md-3 col-sm-6 col-xs-12 categorias'></div>");

            $("#categoryPopulate .row:last .categorias:last").append("<div class='panel panel-default text-center categoria'></div>");

            $("#categoryPopulate .categorias:last .panel-default").append("<div class='panel-body'><h2>" + categorias[i].title + "</h2></div>")

            $("#categoryPopulate .categorias:last .panel-default .panel-body").append("<p>" + categorias[i].description + "</p>");

            $("#categoryPopulate .categorias:last .panel-default").append("<div class='panel-footer loggin'></div>");

            if (categorias[i].title !== "Anonymous category") {

                $("#categoryPopulate .categorias:last .panel-default .panel-footer").append("<div class='divFooterBotones'></div>");
                $(".divFooterBotones:last").append("<button class='btn btn-success loggin pull-left' type='button' data-toggle='modal' data-target='#updateCategory'>Modificar</button>");

                $(".divFooterBotones:last button:last").click(createFunctionUpdateCategory(categorias[i]));

                $(".divFooterBotones:last").append("<button class='btn btn-danger loggin pull-right' type='button' data-toggle='modal' data-target='#removeCategory'>Eliminar</button>");

                $(".divFooterBotones:last button:last").click(createFunctionRemoveCategory(categorias[i]));

            }

        }


        checkCookie();

        function createFunctionUpdateCategory(category) {
            return function () {

                $("#nameCategory2").val(category.title);

                if (category.description !== undefined) {

                    $("#descripcionCategory2").val(category.description);
                }

                $("#buttonUpdateCategory").remove();

                $("#formUpdateCategory").append("<button id='buttonUpdateCategory' class='btn btn-block btn-classic' data-dismiss='modal'>Modificar</button>");

                $("#buttonUpdateCategory").click(update(category));
            }
        }

        function update(category) {
            return function () {
                functionUpdateCategory(category);
            }
        }

        function createFunctionRemoveCategory(category) {
            return function () {
                removeCategory(category);
            }
        }

    }

    function addShop() {

        var cif = document.forms["formAddShop"]["cif"].value;
        var nombre = document.forms["formAddShop"]["nameShop"].value;
        var imagen = document.forms["formAddShop"]["imageShop"].value;
        var direccion = document.forms["formAddShop"]["addressShop"].value;
        var telefono = document.forms["formAddShop"]["telfShop"].value;
        var latidude = document.forms["formAddShop"]["latitudeAddShop"].value;
        var longitude = document.forms["formAddShop"]["longitudeAddShop"].value;
        var initPopulate1 = document.getElementById("initPopulate");


        if (cif.length > 0 && nombre.length > 0) {
            var tienda = new Shop(cif, nombre);
            tienda.image = imagen;
            tienda.address = direccion;
            tienda.telf = telefono;
            var coord = new Coords(latidude, longitude);
            tienda.coords = coord;
            almacen.addShop(tienda);

            tiendasObjectStore.push({
                shop: {
                    cif: tienda.cif,
                    name: tienda.name,
                    address: tienda.address,
                    telf: tienda.telf,
                    image: tienda.image,
                    coords: {latitude: tienda.coords.latitude, longitude: tienda.coords.longitude}
                },
                products: [],
                stocks: []
            });

            var shopsObjectStore = db.transaction(DB_STORE_NAME2, "readwrite").objectStore(DB_STORE_NAME2);

            shopsObjectStore.add(tiendasObjectStore[tiendasObjectStore.length - 1]);

        }
        initPopulate1.remove();
        initPopulate();
        checkCookie();
    }

    function removeShop(shop) {
        var initPopulate1 = document.getElementById("initPopulate");
        var tiendas = showShops();
        var position = almacen.getShopPosition(shop);
        var shopPosition = almacen.getShopPosition(almacen.defaultShop);
        var productosInShop;

        var i;
        var productsInDefaultShop = showProductShop1(almacen.getShopProduct(tiendas[shopPosition]), tiendas[shopPosition]);

        var product;
        var objectStore1 = db.transaction([DB_STORE_NAME2], "readwrite").objectStore(DB_STORE_NAME2);
        var productosInShop = showProductShop1(almacen.getShopProduct(shop), shop);

        function checkProduct(productERP) {
            return productERP.serialNumber == product.serialNumber;
        }

        var request1 = objectStore1.get("9");


        request1.onsuccess = function (event) {


            var products = productosInShop;

            for (var i = 0; i < products.length; i++) {

                product = products[i];
                var productPosition = productsInDefaultShop.findIndex(checkProduct);
                var productPositionNoDefault = productosInShop.findIndex(checkProduct);


                if (productPosition !== -1) {

                    var product1 = new DefaultProduct(product.serialNumber, product.name, product.price);
                    var data = request1.result;

                    var stock = almacen.getProductStock(product1, shop);

                    data.stocks[productPosition] += stock;

                } else {
                    var product1 = new DefaultProduct(productosInShop[productPositionNoDefault].serialNumber, productosInShop[productPositionNoDefault].name, productosInShop[productPositionNoDefault].price);
                    product1.description = productosInShop[productPositionNoDefault].description;
                    product1.images = productosInShop[productPositionNoDefault].images;

                    var data = request1.result;

                    var stock = almacen.getProductStock(product1, shop);

                    data.products.push(product1.getObject());
                    data.stocks.push(stock);


                }

            }
            var requestUpdate = objectStore1.put(data);
            requestUpdate.onerror = function (event) {
                alert("Fallo al actualizar!!!!");

            };
            requestUpdate.onsuccess = function (event) {

            };

        };


        var request = db.transaction([DB_STORE_NAME2], "readwrite")
            .objectStore(DB_STORE_NAME2)
            .delete(shop.cif);

        request.onsuccess = function (event) {
            almacen.removeShop(shop);

            initPopulate1.remove();
            initPopulate();
            checkCookie();

            // It's gone!
        };

        request.onerror = function (event) {
            alert("Problemas al borrar: " + event.target.error);
            // It's gone!
        };

    }


    function functionUpdateShop(shop) {

        var nombre = document.forms["formUpdateShop"]["nameShop2"].value;
        var imagen = document.forms["formUpdateShop"]["imageShop2"].value;
        var direccion = document.forms["formUpdateShop"]["addressShop2"].value;
        var telefono = document.forms["formUpdateShop"]["telfShop2"].value;
        var latidude = document.forms["formUpdateShop"]["latitudeUpdateShop"].value;
        var longitude = document.forms["formUpdateShop"]["longitudeUpdateShop"].value;
        var initPopulate1 = document.getElementById("initPopulate");

        if (nombre.length > 0) {
            shop.name = nombre;
            shop.image = imagen;
            shop.address = direccion;
            shop.telf = telefono;
            var coord = new Coords(latidude, longitude);
            shop.coords = coord;


            var objectStore = db.transaction([DB_STORE_NAME2], "readwrite").objectStore(DB_STORE_NAME2);
            var request = objectStore.get(shop.cif);
            request.onerror = function (event) {
                // Handle errors!
            };
            request.onsuccess = function (event) {
                // Get the old value that we want to update
                var data = request.result;

                // update the value(s) in the object that you want to change
                data.shop.name = nombre;
                data.shop.image = imagen;
                data.shop.address = direccion;
                data.shop.telf = telefono;
                data.shop.coords = {latitude: latidude, longitude: longitude};

                // Put this updated object back into the database.
                var requestUpdate = objectStore.put(data);
                requestUpdate.onerror = function (event) {
                    alert("Fallo al actualizar");

                };
                requestUpdate.onsuccess = function (event) {

                };
            };


            initPopulate1.remove();
            initPopulate();
            checkCookie();
        }


    }


    function addCategory() {

        var id = document.forms["formAddCategory"]["idCategory"].value;
        var nombre = document.forms["formAddCategory"]["nameCategory"].value;
        var descripcion = document.forms["formAddCategory"]["descripcionCategory"].value;


        if (id > 0 && nombre.length > 0) {
            var category = new Category(id, nombre);
            category.description = descripcion;

            almacen.addCategory(category);
            categoriasObjectStore.push({
                category: category.getObject(),
                products: []
            });

            var categoriesObjectStore = db.transaction(DB_STORE_NAME1, "readwrite").objectStore(DB_STORE_NAME1);

            categoriesObjectStore.add(categoriasObjectStore[categoriasObjectStore.length - 1]);

        }
        categoryPopulate();
        checkCookie();
    }


    function removeCategory(category) {


        var objectStore1 = db.transaction([DB_STORE_NAME1], "readwrite").objectStore(DB_STORE_NAME1);
        var productInCategory = almacen.getCategoryProduct(category);
        var productsInDefaultCategory = almacen.getCategoryProduct(almacen.defaultCategory);
        var product;

        function checkProduct(productERP) {
            return productERP.serialNumber == product.serialNumber;
        }

        var request1 = objectStore1.get(almacen.defaultCategory.id);


        request1.onsuccess = function (event) {


            var products = productInCategory;

            for (var i = 0; i < products.length; i++) {

                product = products[i];
                var productPosition = productsInDefaultCategory.findIndex(checkProduct);
                var productPositionNoDefault = productInCategory.findIndex(checkProduct);


                var product1 = new DefaultProduct(productInCategory[i].serialNumber, productInCategory[i].name, productInCategory[i].price);
                product1.description = productInCategory[i].description;
                product1.images = productInCategory[i].images;

                var data = request1.result;

                data.products.push(product1.getObject());


            }
            var requestUpdate = objectStore1.put(data);
            requestUpdate.onerror = function (event) {
                alert("Fallo al actualizar!!!!");

            };
            requestUpdate.onsuccess = function (event) {

            };

        };


        var request = db.transaction([DB_STORE_NAME1], "readwrite")
            .objectStore(DB_STORE_NAME1)
            .delete(category.id);

        request.onsuccess = function (event) {
            almacen.removeCategory(category);
            categoryPopulate();
            checkCookie();

        };

        request.onerror = function (event) {
            alert("Problemas al borrar categoria: " + event.target.error);
            // It's gone!
        };


    }


    function functionUpdateCategory(category) {

        var nombre = document.forms["formUpdateCategory"]["nameCategory2"].value;
        var descripcion = document.forms["formUpdateCategory"]["descripcionCategory2"].value;


        if (nombre.length > 0) {
            category.title = nombre;
            category.description = descripcion;

            var objectStore = db.transaction([DB_STORE_NAME1], "readwrite").objectStore(DB_STORE_NAME1);
            var request = objectStore.get(category.id);
            request.onerror = function (event) {
                // Handle errors!
            };
            request.onsuccess = function (event) {
                // Get the old value that we want to update
                var data = request.result;

                // update the value(s) in the object that you want to change
                data.category.title = nombre;
                data.category.description = descripcion;


                // Put this updated object back into the database.
                var requestUpdate = objectStore.put(data);
                requestUpdate.onerror = function (event) {
                    alert("Fallo al actualizar");

                };
                requestUpdate.onsuccess = function (event) {

                };
            };

            categoryPopulate();
            checkCookie();
        }

    }


    function removeProduct(product, shop, category) {

        var productosInERPShop = showProductShop1(almacen.getShopProduct(shop), shop);


        function checkProduct(productERP) {
            return productERP.serialNumber == product.serialNumber;
        }


        var productPosition = productosInERPShop.findIndex(checkProduct);


        var objectStore = db.transaction([DB_STORE_NAME2], "readwrite").objectStore(DB_STORE_NAME2);
        var request = objectStore.get(shop.cif);
        request.onerror = function (event) {
            // Handle errors!
        };
        request.onsuccess = function (event) {
            // Get the old value that we want to update
            var data = request.result;

            // update the value(s) in the object that you want to change

            data.products.splice(productPosition, 1);
            data.stocks.splice(productPosition, 1);

            // Put this updated object back into the database.
            var requestUpdate = objectStore.put(data);
            requestUpdate.onerror = function (event) {
                alert("fallo al eliminar");

            };
            requestUpdate.onsuccess = function (event) {

            };
        };


        almacen.removeShopProduct(product, shop);

        if (!category) {
            shopPopulate(shop);
        } else {
            productsCategoryShopPopulate(shop, category);
        }


        checkCookie();
    }

    function addProductERP() {


        var serialNumber = document.forms["formAddProductERP"]["serialNumber"].value;
        var name = document.forms["formAddProductERP"]["name"].value;
        var price = document.forms["formAddProductERP"]["price"].value;
        var image = document.forms["formAddProductERP"]["image"].value;
        var category = document.forms["formAddProductERP"]["selectCategoryProduct"].value;
        var descripcionProduct = document.forms["formAddProductERP"]["descripcionProduct"].value;
        var categories = showCategories();
        var i = 0;
        var j;
        var initPopulate1 = document.getElementById("initPopulate");
        initPopulate1.remove();

        if (serialNumber.length > 0 && name.length > 0 && price.length > 0) {

            var product = new DefaultProduct(serialNumber, name, price);

            if (image.length === 0) {
                image = "img/noProductImage.jpg";
            }

            product.images[0] = image;
            product.description = descripcionProduct;

            while (i < categories.length) {

                if (categories[i].title === category) {
                    category = categories[i];
                    almacen.addProduct(product, category);


                    var objectStore = db.transaction([DB_STORE_NAME1], "readwrite").objectStore(DB_STORE_NAME1);
                    var request = objectStore.get(category.id);
                    request.onerror = function (event) {
                        // Handle errors!
                    };
                    request.onsuccess = function (event) {
                        // Get the old value that we want to update
                        var data = request.result;

                        // update the value(s) in the object that you want to change
                        data.products[data.products.length - 1] = product.getObject();


                        // Put this updated object back into the database.
                        var requestUpdate = objectStore.put(data);
                        requestUpdate.onerror = function (event) {
                            alert("Fallo al añadir al erp");

                        };
                        requestUpdate.onsuccess = function (event) {

                        };
                    }
                }

                i++;
            }
        }


        $(".optionDinamico").hide();

        initPopulate();
        checkCookie();
    }


    function addProductInShop(shop) {

        var product = document.forms["formAddProductShop"]["selectProduct"].value;
        var stock = document.forms["formAddProductShop"]["stock"].value;
        var products;
        var i;
        var j;
        var categories = showCategories();
        for (j = 0; j < categories.length; j++) {

            products = almacen.getCategoryProduct(categories[j]);
            console.log("La categoria es: " + categories[j].title);
            for (i = 0; i < products.length; i++) {
                if (products[i].serialNumber == parseInt(product)) {
                    almacen.addProductInShop(products[i], shop, stock);
                    var productoInsertar = products[i];

                    var objectStore = db.transaction([DB_STORE_NAME2], "readwrite").objectStore(DB_STORE_NAME2);
                    var request = objectStore.get(shop.cif);
                    request.onerror = function (event) {
                        alert("hay error");
                    };
                    request.onsuccess = function (event) {
                        // Get the old value that we want to update
                        var data = request.result;

                        // update the value(s) in the object that you want to change
                        data.products.push(productoInsertar.getObject());
                        data.stocks.push(stock);


                        // Put this updated object back into the database.
                        var requestUpdate = objectStore.put(data);
                        requestUpdate.onerror = function (event) {
                            alert("Fallo al añadir a la tienda");

                        };
                        requestUpdate.onsuccess = function (event) {

                        };
                    }

                }

            }

        }

        shopPopulate(shop);
        checkCookie();
    }


    function UpdateProductBBDD(product) {
        var categorias = showCategories();


        for (var i = 0; i < categorias.length; i++) {

            var products = almacen.getCategoryProduct(categorias[i]);
            for (var j = 0; j < products.length; j++) {

                if (products[j].serialNumber === product.serialNumber) {
                    var posicionProducto = j;
                    var objectStore1 = db.transaction([DB_STORE_NAME1], "readwrite").objectStore(DB_STORE_NAME1);
                    var request1 = objectStore1.get(categorias[i].id);
                    request1.onerror = function (event) {
                        // Handle errors!
                    };
                    request1.onsuccess = function (event) {
                        // Get the old value that we want to update
                        var data = request1.result;

                        // update the value(s) in the object that you want to change
                        data.products[posicionProducto] = product.getObject();

                        // Put this updated object back into the database.
                        var requestUpdate = objectStore1.put(data);
                        requestUpdate.onerror = function (event) {
                            alert("Fallo al actualizar");

                        };
                        requestUpdate.onsuccess = function (event) {

                        };

                    };
                }
            }

        }


        var objectStore = db.transaction([DB_STORE_NAME2], "readwrite").objectStore(DB_STORE_NAME2);


        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {

                var request = objectStore.get(cursor.value.shop.cif);

                request.onsuccess = function (event) {

                    var shop = new Shop(request.result.shop.cif, request.result.shop.name);
                    var productInShop = request.result.products;
                    var stockInShop = request.result.stocks;


                    shop.address = request.result.shop.address;
                    shop.telf = request.result.shop.telf;
                    shop.image = request.result.shop.image;
                    var coords = new Coords(request.result.shop.coords.latitude, request.result.shop.coords.longitude);
                    shop.coords = coords;

                    var products = showProductShop1(almacen.getShopProduct(shop), shop);
                    for (var j = 0; j < products.length; j++) {

                        if (products[j].serialNumber === product.serialNumber) {

                            var posicionProducto = j;
                            request.onerror = function (event) {
                                alert("hay error");
                            };

                            // Get the old value that we want to update
                            var data = request.result;

                            // update the value(s) in the object that you want to change
                            data.products[posicionProducto] = product.getObject();

                            // Put this updated object back into the database.
                            var requestUpdate = objectStore.put(data);
                            requestUpdate.onerror = function (event) {
                                alert("Fallo al actualizar!!!!");

                            };
                            requestUpdate.onsuccess = function (event) {

                            };

                        }
                    }

                };
                cursor.continue();
            }
        };
    }


    function functionUpdateProduct(product, shop) {

        var nombre = document.forms["formUpdateProduct"]["nameProduct2"].value;
        var precio = document.forms["formUpdateProduct"]["priceProduct2"].value;
        var imagen = document.forms["formUpdateProduct"]["imageProduct2"].value;
        var descripcion = document.forms["formUpdateProduct"]["descripcionProduct2"].value;


        if (nombre.length > 0 && precio > 0) {


            if (imagen.length === 0) {
                imagen = "img/noProductImage.jpg";
            }

            product.name = nombre;
            product.price = precio;
            product.images[0] = imagen;
            product.description = descripcion;


            UpdateProductBBDD(product);
            shopPopulate(shop);
            checkCookie();
        }
    }

    function functionUpdateGlobalProduct(product, shop) {


        var number = document.forms["formUpdateGlobalProduct"]["stockGlobalProduct"].value;
        var productosInERPShop = showProductShop1(almacen.getShopProduct(shop), shop);


        function checkProduct(productERP) {
            return productERP.serialNumber == product.serialNumber;
        }


        if (number > 0) {


            var productPosition = productosInERPShop.findIndex(checkProduct);


            var objectStore = db.transaction([DB_STORE_NAME2], "readwrite").objectStore(DB_STORE_NAME2);
            var request = objectStore.get(shop.cif);
            request.onerror = function (event) {
                // Handle errors!
            };
            request.onsuccess = function (event) {
                // Get the old value that we want to update
                var data = request.result;

                // update the value(s) in the object that you want to change


                data.stocks[productPosition] = parseInt(number);

                // Put this updated object back into the database.
                var requestUpdate = objectStore.put(data);
                requestUpdate.onerror = function (event) {
                    alert("fallo al actualizar stock");

                };
                requestUpdate.onsuccess = function (event) {

                };
            };


            almacen.changeProductStock(product, shop, number);
        }


        globalProductPopulate();

    }

    function saveState() {

        var Json = createJson();
        var myJSON = JSON.stringify(Json);
        var username = getCookie("username");


        $.ajax({
            // la URL para la petición
            url: 'saveState.php',

            // la información a enviar
            // (también es posible utilizar una cadena de datos)
            data: {Json: myJSON, user: username},

            // especifica si será una petición POST o GET
            type: 'POST',

            // el tipo de información que se espera de respuesta
            dataType: 'json',

            // código a ejecutar si la petición es satisfactoria;
            // la respuesta es pasada como argumento a la función
            success: function (json) {
                $("#modalSaveState").modal("show");
            },

            // código a ejecutar si la petición falla;
            // son pasados como argumentos a la función
            // el objeto de la petición en crudo y código de estatus de la petición
            error: function (xhr, status) {
                $("#modalSaveStateFalse").modal("show");
            },

            // código a ejecutar sin importar si la petición falló o no
            complete: function (xhr, status) {
            }
        });


    }


    function mapPopulate() {

        $("#mapPopulate").css("display", "block");
        $("#categoryPopulate").remove();
        $("#menuCategoryShopPopulate").remove();
        $("#shopPopulate").remove();
        $("#detalleProducto").remove();
        $("#globalProductPopulate").remove();
        $("#initPopulate").css("display", "none");

        myMap();
    }

    function myMap() {

        var latitude = "";
        var longitude = "";
        var tiendas = showShops();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showMap);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }

        function showMap(position) {
            if (tiendas !== undefined) {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                var myCenter = new google.maps.LatLng(latitude, longitude);

                var mapCanvas = document.getElementById("map");
                var mapOptions = {center: myCenter, zoom: 10};
                var map = new google.maps.Map(mapCanvas, mapOptions);
                for (var i = 0; i < tiendas.length; i++) {

                    var position = new google.maps.LatLng(tiendas[i].coords.latitude, tiendas[i].coords.longitude);

                    var marker = new google.maps.Marker({
                        position: position,
                        icon: "img/icoMapa.png"
                    });

                    marker.setMap(map);

                    google.maps.event.addListener(marker, 'click', showOpenInfo(map, marker, tiendas[i]));
                }
            }

        }

        function showOpenInfo(map, marker, tienda) {
            return function () {
                var infowindow = new google.maps.InfoWindow({
                    content: tienda.name
                });
                infowindow.open(map, marker);
            }
        }
    }


    function myMapAddShop() {
        var markers = [];
        var latitude = "";
        var longitude = "";
        var tiendas = showShops();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showMap);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }

        function showMap(position) {

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            var myCenter = new google.maps.LatLng(latitude, longitude);
            var mapCanvas = document.getElementById("mapShop");

            var mapOptions = {center: myCenter, zoom: 9};
            var map = new google.maps.Map(mapCanvas, mapOptions);
            google.maps.event.addListener(map, 'click', function (event) {
                placeMarker(map, event.latLng);
            });


            function placeMarker(map, location) {

                var latitude = document.getElementById("latitudeAddShop");
                var longitude = document.getElementById("longitudeAddShop");

                if (markers.length > 0) {
                    markers[0].setMap(null);
                }
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: "img/icoMapa.png"
                });
                var infowindow = new google.maps.InfoWindow({
                    content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
                });
                infowindow.open(map, marker);

                markers[0] = marker;

                latitude.value = location.lat();
                longitude.value = location.lng();
            }
        }

        function showOpenInfo(map, marker, tienda) {
            return function () {
                var infowindow = new google.maps.InfoWindow({
                    content: tienda.name
                });
                infowindow.open(map, marker);
            }
        }
    }

    function myMapUpdateShop() {
        var markers = [];
        var latitude = "";
        var longitude = "";
        var tiendas = showShops();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showMap);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }

        function showMap(position) {

            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            var myCenter = new google.maps.LatLng(latitude, longitude);
            var mapCanvas = document.getElementById("mapShop2");

            var mapOptions = {center: myCenter, zoom: 9};
            var map = new google.maps.Map(mapCanvas, mapOptions);
            google.maps.event.addListener(map, 'click', function (event) {
                placeMarker(map, event.latLng);
            });


            function placeMarker(map, location) {

                var latitude = document.getElementById("latitudeUpdateShop");
                var longitude = document.getElementById("longitudeUpdateShop");

                if (markers.length > 0) {
                    markers[0].setMap(null);
                }
                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: "img/icoMapa.png"
                });
                var infowindow = new google.maps.InfoWindow({
                    content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
                });
                infowindow.open(map, marker);

                markers[0] = marker;

                latitude.value = location.lat();
                longitude.value = location.lng();
            }
        }

        function showOpenInfo(map, marker, tienda) {
            return function () {
                var infowindow = new google.maps.InfoWindow({
                    content: tienda.name
                });
                infowindow.open(map, marker);
            }
        }
    }

    console.log("##### Testeo StoreHouse. ##### ");
    var almacen = StoreHouse.getInstance();
    almacen.name = "Almacen de prueba";
    console.log("Instancia StoreHouse: " + almacen.name);
    console.log("");

    var buttonAddShop = document.getElementById("buttonAddShop");
    buttonAddShop.addEventListener("click", addShop);

    var buttonAddCategory = document.getElementById("buttonAddCategory");
    buttonAddCategory.addEventListener("click", addCategory);

    var buttonAddProductERP = document.getElementById("buttonAddProductERP");
    buttonAddProductERP.addEventListener("click", addProductERP);


    var db;
    var request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = function (event) {
        document.getElementById("error").appendChild(document.createTextNode("Error en la solicitud: " + event.target.error + "<br/>"));
    };

    request.onsuccess = function (event) {

        // I get a DB to use it in my students form.
        db = event.target.result;
        db.onerror = function (event) {
            // Generic error handler for all errors targeted at this database's
            // requests!
            document.getElementById("error").appendChild(document.createTextNode("Error en el acceso a la base de datos: " + event.target.error + "<br/>"));
        };

        var objectStore = db.transaction(DB_STORE_NAME1).objectStore(DB_STORE_NAME1);

        objectStore.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var request = objectStore.get(cursor.value.category.id);

                request.onsuccess = function (event) {
                    var category = new Category(request.result.category.id, request.result.category.title);
                    category.description = request.result.category.description;
                    var productInCategory = request.result.products;


                    var categoryPosition = almacen.getCategoryPosition(category);

                    if (categoryPosition === -1 || category.id == "9") {

                        if (categoryPosition === -1) {
                            almacen.addCategory(category);

                        }
                        for (var i = 0; i < productInCategory.length; i++) {


                            var product = new DefaultProduct(productInCategory[i].serialNumber, productInCategory[i].name, productInCategory[i].price);

                            product.description = productInCategory[i].description;
                            product.tax = productInCategory[i].tax;
                            product.images = productInCategory[i].images;


                            almacen.addProduct(product, category);

                        }
                    }

                };
                cursor.continue();
            }
        };

        var objectStore1 = db.transaction(DB_STORE_NAME2).objectStore(DB_STORE_NAME2);

        objectStore1.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {

                var request = objectStore1.get(cursor.value.shop.cif);

                request.onsuccess = function (event) {
                    var shop = new Shop(request.result.shop.cif, request.result.shop.name);
                    var productInShop = request.result.products;
                    var stockInShop = request.result.stocks;


                    shop.address = request.result.shop.address;
                    shop.telf = request.result.shop.telf;
                    shop.image = request.result.shop.image;
                    var coords = new Coords(cursor.value.shop.coords.latitude, cursor.value.shop.coords.longitude);
                    shop.coords = coords;


                    var shopPosition = almacen.getShopPosition(shop);

                    if (shopPosition === -1) {
                        almacen.addShop(shop);

                        for (var i = 0; i < productInShop.length; i++) {

                            var product = new DefaultProduct(productInShop[i].serialNumber, productInShop[i].name, productInShop[i].price);
                            product.description = productInShop[i].description;
                            product.tax = productInShop[i].tax;
                            product.images = productInShop[i].images;

                            almacen.addProductInShop(product, shop, stockInShop[i]);
                        }
                    } else if (shopPosition === 0) {
                        var productosInERPShop = showProductShop1(almacen.getShopProduct(shop), shop);
                        if (productosInERPShop.length === 0) {
                            for (var i = 0; i < productInShop.length; i++) {

                                var product = new DefaultProduct(productInShop[i].serialNumber, productInShop[i].name, productInShop[i].price);
                                product.description = productInShop[i].description;
                                product.tax = productInShop[i].tax;
                                product.images = productInShop[i].images;
                                almacen.addProductInShop(product, shop, stockInShop[i]);

                            }
                        }
                    }

                };

                cursor.continue();
            }
            else {
                initPopulate();
                shopsMenusPopulate();
                checkCookie();
            }
        };
    };

    request.onupgradeneeded = function (event) {

        db = event.target.result;
        console.log("Event onupgradeneeded: " + db.name);
        var productos = [];


        function createCategoriesObjectStore() {
            //reyeno el array de categorias preparado para insertar en la bbdd
            var categorias = showCategories();

            for (var i = 0; i < categorias.length; i++) {
                categoriasObjectStore.push({
                    category: categorias[i].getObject(),
                    products: []
                });

                productos = almacen.getCategoryProduct(categorias[i]);

                for (var j = 0; j < productos.length; j++) {

                    categoriasObjectStore[i].products[j] = productos[j].getObject();
                }
            }


            // Create an objectStore with autoincrement key
            var categoriesObjectStore = db.createObjectStore(DB_STORE_NAME1, {keyPath: "category.id"});
            console.log("Categories Object Store has been created");


            // Use transaction oncomplete to make sure the objectStore creation is
            // finished before adding data into it.

            // Store values in the newly created objectStore.
            var i = 0;
            for (i in categoriasObjectStore) {
                categoriesObjectStore.add(categoriasObjectStore[i]);
            }

        }

        function createShopObjectStore() {
            var tiendas = showShops();
            for (var i = 0; i < tiendas.length; i++) {

                tiendasObjectStore.push({
                    shop: tiendas[i].getObject(),
                    products: [],
                    stocks: []
                });

                var productosInShop = showProductShop1(almacen.getShopProduct(tiendas[i]), tiendas[i]);


                for (var j = 0; j < productosInShop.length; j++) {

                    var stockInShop = almacen.getProductStock(productosInShop[j], tiendas[i]);
                    tiendasObjectStore[i].products[j] = productosInShop[j].getObject();
                    tiendasObjectStore[i].stocks[j] = stockInShop;
                }
            }


            var shopsObjectStore = db.createObjectStore(DB_STORE_NAME2, {keyPath: "shop.cif"});

            // Create an index to search customers by specialty

            // Use transaction oncomplete to make sure the objectStore creation is
            // finished before adding data into it.

            // Store values in the newly created objectStore.
            var i = 0;
            for (i in tiendasObjectStore) {
                shopsObjectStore.add(tiendasObjectStore[i]);
            }

        }

        function createObjectsStores() {
            createCategoriesObjectStore();
            createShopObjectStore();
        }

        try {

            /*
                      //Creamos categorias

                      var telefonos = new Category(1, "Telefonos");
                      telefonos.description = "Descripción categoría Telefonos";
                      var televisiones = new Category(2, "Televisiones");
                      televisiones.description = "Descripción categoría Televisiones";
                      var portatiles = new Category(3, "Portatiles");
                      portatiles.description = "Descripción categoría Portatiles";
                      var ropa = new Category(4, "Ropa");
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
                      tienda1.image = "img/MediaMarkt.jpg";
                      var coord = new Coords(39.3965861,-3.232647);
                      tienda1.coords = coord;
                      var tienda2 = new Shop("2", "Worten");
                      tienda2.image = "img/Worten.jpg";
                      var coord = new Coords(38.9876103,-3.9314084);
                      tienda2.coords = coord;
                      var tienda3 = new Shop("3", "PcComponentes");
                      tienda3.image = "img/PcComponentes.jpg";
                      var coord = new Coords(38.6932382,-4.120831);
                      tienda3.coords = coord;


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
          */

            createCategoriesObjectStore();
            createShopObjectStore();

            $.ajax({
                // la URL para la petición
                url: 'initJson.php',

                // la información a enviar
                // (también es posible utilizar una cadena de datos)
                data: {Json: "init.json"},

                // especifica si será una petición POST o GET
                type: 'POST',

                // el tipo de información que se espera de respuesta
                dataType: 'json',

                // código a ejecutar si la petición es satisfactoria;
                // la respuesta es pasada como argumento a la función
                success: function (json) {

                    var myJSON = json;
                    var i;
                    var j;
                    for (i = 1; i < myJSON.categories.length; i++) {

                        var category = new Category(myJSON.categories[i].category.id, myJSON.categories[i].category.title);
                        category.description = myJSON.categories[i].category.description;

                        almacen.addCategory(category);
                        categoriasObjectStore[i] = {
                            category: category.getObject(),
                            products: []
                        };

                        var categoriesObjectStore = db.transaction(DB_STORE_NAME1, "readwrite").objectStore(DB_STORE_NAME1);

                        for (j = 0; j < myJSON.categories[i].products.length; j++) {

                            var product = new DefaultProduct(myJSON.categories[i].products[j].serialNumber, myJSON.categories[i].products[j].name, myJSON.categories[i].products[j].price);
                            product.images = myJSON.categories[i].products[j].images;
                            product.description = myJSON.categories[i].products[j].description;

                            categoriasObjectStore[i].products[j] = product.getObject();

                            almacen.addProduct(product, category);

                        }
                        categoriesObjectStore.add(categoriasObjectStore[categoriasObjectStore.length - 1]);

                    }
                    for (i = 1; i < myJSON.shops.length; i++) {

                        var shop1 = new Shop(myJSON.shops[i].shop.cif, myJSON.shops[i].shop.name);

                        shop1.address = myJSON.shops[i].shop.address;
                        shop1.telf = myJSON.shops[i].shop.telf;
                        shop1.image = myJSON.shops[i].shop.image;

                        var coords = new Coords(myJSON.shops[i].shop.coords.latitude, myJSON.shops[i].shop.coords.longitude);
                        shop1.coords = coords;
                        almacen.addShop(shop1);

                        tiendasObjectStore[i] = {
                            shop: {
                                cif: shop1.cif,
                                name: shop1.name,
                                address: shop1.address,
                                telf: shop1.telf,
                                image: shop1.image,
                                coords: {latitude: shop1.coords.latitude, longitude: shop1.coords.longitude}
                            },
                            products: [],
                            stocks: []
                        };

                        var shopsObjectStore = db.transaction(DB_STORE_NAME2, "readwrite").objectStore(DB_STORE_NAME2);

                        for (j = 0; j < myJSON.shops[i].products.length; j++) {

                            var product = new DefaultProduct(myJSON.shops[i].products[j].serialNumber, myJSON.shops[i].products[j].name, myJSON.shops[i].products[j].price);
                            product.images = myJSON.shops[i].products[j].images;
                            product.description = myJSON.shops[i].products[j].description;

                            tiendasObjectStore[i].products[j] = product.getObject();
                            tiendasObjectStore[i].stocks[j] = myJSON.shops[i].stocks[j];

                            almacen.addProductInShop(product, shop1, myJSON.shops[i].stocks[j]);


                        }

                        shopsObjectStore.add(tiendasObjectStore[tiendasObjectStore.length - 1]);

                    }

                    var initPopulate1 = document.getElementById("initPopulate");

                    if (initPopulate1 !== null) {
                        initPopulate1.remove();

                    }
                    initPopulate();
                    checkCookie();
                },

                // código a ejecutar si la petición falla;
                // son pasados como argumentos a la función
                // el objeto de la petición en crudo y código de estatus de la petición
                error: function (xhr, status) {
                    alert('Disculpe, existió un problema');
                },

                // código a ejecutar sin importar si la petición falló o no
                complete: function (xhr, status) {
                }
            });

        } catch (e) {
            console.log("Exception creating object store: " + e);
        }
    };


    function createJson() {


        var categorias = showCategories();
        var tiendas = showShops();
        var stocks = [];
        var JSon = {
            "categories": [],
            "shops": [{}]
        };
        var i;
        var j;
        var x;
        for (i = 0; i < categorias.length; i++) {
            JSon.categories[i] = {
                category: {
                    'id': categorias[i].id,
                    "title": categorias[i].title,
                    "description": categorias[i].description
                },
                products: []
            };

            var products = almacen.getCategoryProduct(categorias[i]);


            for (j = 0; j < products.length; j++) {

                JSon.categories[i].products[j] = {
                    serialNumber: +products[j].serialNumber,
                    "name": products[j].name,
                    "description": products[j].description,
                    "price": products[j].price,
                    "images": products[j].images
                };

            }
        }

        for (i = 0; i < tiendas.length; i++) {
            JSon.shops[i] = {
                shop: {
                    cif: tiendas[i].cif,
                    "name": tiendas[i].name,
                    "image": tiendas[i].image,
                    "address": tiendas[i].address,
                    "coords": {latitude: tiendas[i].coords.latitude, longitude: tiendas[i].coords.longitude},
                    "telf": tiendas[i].telf
                },
                products: [],
                stocks: []
            };


            var products = showProductShop1(almacen.getShopProduct(tiendas[i]), tiendas[i]);

            for (j = 0; j < products.length; j++) {


                JSon.shops[i].products[j] = {
                    serialNumber: +products[j].serialNumber,
                    "name": products[j].name,
                    "description": products[j].description,
                    "price": products[j].price,
                    "images": products[j].images
                };

                JSon.shops[i].stocks[j] = almacen.getProductStock(products[j], tiendas[i]);

            }
        }
        return JSon;
    }
}

window.onload = init;