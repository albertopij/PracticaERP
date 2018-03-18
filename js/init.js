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

        var inicioLogo = document.getElementById("logo");

        inicioLogo.addEventListener("click", function () {

            var categorias = document.getElementById("menuCategoryShopPopulate");
            var shopPopulate = document.getElementById("shopPopulate");
            var detalleProducto = document.getElementById("detalleProducto");
            var globalProductPopulate = document.getElementById("globalProductPopulate");
            var initPopulate = document.getElementById("initPopulate");
            var categoryPopulate = document.getElementById("categoryPopulate");

            if (categoryPopulate !== null) {

                categoryPopulate.remove();
            }


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


        var buttonCloseWindows = document.getElementById("closeAllWindows");

        buttonCloseWindows.addEventListener("click", function () {

            var i;
            for (i = 0; i < ventanas.length; i++) {
                if (!ventanas[i].close()) {
                    ventanas[i].close();
                }
            }
            ventanas = [];
        });


        var contenedorTiendas = document.createElement("div");
        contenedorTiendas.setAttribute("class", ".container");
        contenedorTiendas.setAttribute("id", "initPopulate");

        var buttonAddShop = document.createElement("button");
        buttonAddShop.setAttribute("class", "btn btn-md loggin text-center");
        buttonAddShop.setAttribute("id", "buttonAddShop");
        buttonAddShop.setAttribute("type", "button");
        buttonAddShop.setAttribute("data-toggle", "modal");
        buttonAddShop.setAttribute("data-target", "#addShop");
        buttonAddShop.appendChild(document.createTextNode("Añadir Tienda "));
        var spanAddShop = document.createElement("span");
        spanAddShop.setAttribute("class", "glyphicon glyphicon-plus");
        buttonAddShop.appendChild(spanAddShop);
        contenedorTiendas.appendChild(buttonAddShop);

        var buttonAddProductERP = document.createElement("button");
        buttonAddProductERP.setAttribute("class", "btn btn-md loggin text-center");
        buttonAddProductERP.setAttribute("id", "buttonAddProductERP");
        buttonAddProductERP.setAttribute("type", "button");
        buttonAddProductERP.setAttribute("data-toggle", "modal");
        buttonAddProductERP.setAttribute("data-target", "#addProductERP");
        buttonAddProductERP.appendChild(document.createTextNode("Añadir Producto"));
        var spanAddProduct = document.createElement("span");
        spanAddProduct.setAttribute("class", "glyphicon glyphicon-plus");
        buttonAddProductERP.appendChild(spanAddProduct);
        contenedorTiendas.appendChild(buttonAddProductERP);

        var buttonSaveState = document.createElement("button");
        buttonSaveState.setAttribute("class", "btn btn-md loggin text-center");
        buttonSaveState.setAttribute("id", "buttonSaveState");
        buttonSaveState.setAttribute("type", "button");
        buttonSaveState.appendChild(document.createTextNode("Guardar Estado "));
        var spanSaveState = document.createElement("span");
        spanSaveState.setAttribute("class", "glyphicon glyphicon-save");
        buttonSaveState.appendChild(spanSaveState);
        contenedorTiendas.appendChild(buttonSaveState);
        buttonSaveState.addEventListener("click", saveState);

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

            var dirImg;
            if (shop.value.image !== undefined || shop.value.image == "") {
                dirImg = shop.value.image;

            } else {
                dirImg = "img/noShopImage.jpg";
            }


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

            if (shop.value.name !== "defaultShop") {

                var buttonUpdateCategory = document.createElement("button");
                buttonUpdateCategory.setAttribute("class", "btn btn-success loggin pull-left");
                buttonUpdateCategory.setAttribute("type", "button");
                buttonUpdateCategory.setAttribute("data-toggle", "modal");
                buttonUpdateCategory.setAttribute("data-target", "#updateShop");
                buttonUpdateCategory.appendChild(document.createTextNode("Modificar"));
                panelBody.appendChild(buttonUpdateCategory);
                buttonUpdateCategory.addEventListener("click", createFunctionUpdateShop(shop.value));

                var buttonRemoveShop = document.createElement("button");
                buttonRemoveShop.setAttribute("class", "btn btn-danger loggin pull-right");
                buttonRemoveShop.setAttribute("type", "button");
                buttonRemoveShop.setAttribute("data-toggle", "modal");
                buttonRemoveShop.setAttribute("data-target", "#removeShop");
                buttonRemoveShop.appendChild(document.createTextNode("Eliminar"));
                panelBody.appendChild(buttonRemoveShop);
                buttonRemoveShop.addEventListener("click", createFunctionRemoveShop(shop.value));
            }

            var panelFooter = document.createElement("div");
            panelFooter.setAttribute("class", "panel-footer");

            var button = document.createElement("button");
            button.setAttribute("class", "btn btn-lg tienda");
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


        var selectCategory = document.getElementById("selectCategoryProduct");

        var categories = almacen.categories;
        var category = categories.next();

        while (category.done !== true) {

            var option = document.createElement("option");
            option.setAttribute("value", category.value.title);
            option.setAttribute("class", "optionDinamico");
            option.appendChild(document.createTextNode(category.value.title));
            selectCategory.appendChild(option);
            category = categories.next();
        }

        var selectProduct = document.getElementById("selectProduct");
        var i;
        var categories = almacen.categories;
        var category = categories.next();
        while (category.done !== true) {
            var product = almacen.getCategoryProduct(category.value);
            if (product.length > 0) {
                var optgroup = document.createElement("optgroup");
                optgroup.setAttribute("label", category.value.title);
                optgroup.setAttribute("class", "optionDinamico");
                selectProduct.appendChild(optgroup);

                for (i = 0; i < product.length; i++) {
                    var option = document.createElement("option");
                    option.setAttribute("value", product[i].serialNumber);
                    option.setAttribute("class", "optionDinamico");
                    option.appendChild(document.createTextNode(product[i].name));
                    optgroup.appendChild(option);
                }

            }
            category = categories.next();
        }

        function createFunctionUpdateShop(shop) {
            return function () {

                document.getElementById("formUpdateShop").reset();


                var nombre = document.getElementById("nameShop2");
                nombre.setAttribute("value", shop.name);

                if (shop.image !== undefined && shop.image !== "") {
                    var imagen = document.getElementById("imageShop2");
                    imagen.setAttribute("value", shop.image)
                }

                if (shop.address !== undefined) {
                    var direccion = document.getElementById("addressShop2");
                    direccion.setAttribute("value", shop.address);
                }

                if (shop.telf !== undefined) {
                    var telf = document.getElementById("telfShop2");
                    telf.setAttribute("value", shop.telf)
                }

                var buttonUpdateShopRepetido = document.getElementById("buttonUpdateShop");

                if (buttonUpdateShopRepetido !== null) {
                    buttonUpdateShopRepetido.remove();
                }
                var bupdateShop = document.getElementById("BupdateShop");
                var buttonUpdateShop = document.createElement("button");
                buttonUpdateShop.setAttribute("id", "buttonUpdateShop");
                buttonUpdateShop.setAttribute("class", "btn btn-block btn-classic");
                buttonUpdateShop.setAttribute("data-dismiss", "modal");
                buttonUpdateShop.appendChild(document.createTextNode("Modificar"));
                bupdateShop.appendChild(buttonUpdateShop);
                buttonUpdateShop.addEventListener("click", update(shop));
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
            var categoryPopulate = document.getElementById("categoryPopulate");

            if (categoryPopulate !== null) {

                categoryPopulate.remove();
            }

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


        var textoTitulo = document.createTextNode("ERP");
        tituloMenu.appendChild(textoTitulo);


        var navBar = document.createElement("div");
        navBar.setAttribute("id", "navBar");
        navBar.setAttribute("class", "collapse navbar-collapse navbar-ex1-collapse");

        var ulNavbar = document.createElement("ul");
        ulNavbar.setAttribute("id", "navLeft");
        ulNavbar.setAttribute("class", "nav navbar-nav");


        var textoTienda = document.createTextNode("Tiendas");
        var li = document.createElement("li");
        var enlaceTienda = document.createElement("a");
        enlaceTienda.setAttribute("href", "#");
        enlaceTienda.addEventListener("click", function () {

            var categorias = document.getElementById("menuCategoryShopPopulate");
            var shopPopulate = document.getElementById("shopPopulate");
            var detalleProducto = document.getElementById("detalleProducto");
            var globalProductPopulate = document.getElementById("globalProductPopulate");
            var initPopulate = document.getElementById("initPopulate");
            var categoryPopulate = document.getElementById("categoryPopulate");

            if (categoryPopulate !== null) {

                categoryPopulate.remove();
            }

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
        enlaceTienda.appendChild(textoTienda);
        li.appendChild(enlaceTienda);
        ulNavbar.appendChild(li);

        var textoTienda = document.createTextNode("Categorías Globales");
        var li = document.createElement("li");
        var enlaceTienda = document.createElement("a");
        enlaceTienda.setAttribute("href", "#");
        enlaceTienda.addEventListener("click", categoryPopulate);
        enlaceTienda.appendChild(textoTienda);
        li.appendChild(enlaceTienda);
        ulNavbar.appendChild(li);


        var textoAllProduct = document.createTextNode("Productos Globales");
        li = document.createElement("li");
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


        var liRightNav = document.createElement("li");

        ulNavbar.appendChild(liRightNav);

        var aLiRight = document.createElement("a");
        aLiRight.setAttribute("href", "#");
        aLiRight.setAttribute("id", "closeAllWindows2");
        aLiRight.setAttribute("class", "hidden-sm hidden-md hidden-lg");
        aLiRight.appendChild(document.createTextNode("Cerrar Ventanas"));
        aLiRight.addEventListener("click", function () {

            var i;
            for (i = 0; i < ventanas.length; i++) {
                if (!ventanas[i].close()) {
                    ventanas[i].close();
                }
            }
            ventanas = [];
        });

        liRightNav.appendChild(aLiRight);


        var buttonAccess = document.createElement("button");
        buttonAccess.setAttribute("id", "buttonAccess2");
        buttonAccess.setAttribute("class", "btn btn-md pull-right");
        buttonAccess.setAttribute("data-toggle", "modal");
        buttonAccess.setAttribute("data-target", "#modalAccess");
        var spanAccess = document.createElement("span");
        spanAccess.setAttribute("class", "glyphicon glyphicon-user");
        buttonAccess.appendChild(spanAccess);
        buttonAccess.appendChild(document.createTextNode(" Acceso"));
        nav1Header.appendChild(buttonAccess);

        var divLoggin = document.createElement("div");
        divLoggin.setAttribute("id", "loggin2");
        divLoggin.setAttribute("class", "pull-right");
        nav1Header.appendChild(divLoggin);

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

        var buttonAddProduct = document.createElement("button");
        buttonAddProduct.setAttribute("class", "btn btn-md loggin text-center");
        buttonAddProduct.setAttribute("type", "button");
        buttonAddProduct.setAttribute("data-toggle", "modal");
        buttonAddProduct.setAttribute("data-target", "#addProductShop");
        buttonAddProduct.appendChild(document.createTextNode("Añadir Producto "));
        var spanAddProduct = document.createElement("span");
        spanAddProduct.setAttribute("class", "glyphicon glyphicon-plus");
        buttonAddProduct.appendChild(spanAddProduct);
        divShopPopulate.appendChild(buttonAddProduct);


        var mainH2 = document.createElement("h2");
        mainH2.setAttribute("class", "text-center bold titulo");
        mainH2.appendChild(document.createTextNode("Tienda " + shop.name));
        divShopPopulate.appendChild(mainH2);


        var row = document.createElement("div");
        row.setAttribute("class", "row");
        divShopPopulate.appendChild(row);
        var x = 0;
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


            var buttonUpdateProduct = document.createElement("button");
            buttonUpdateProduct.setAttribute("class", "btn btn-success loggin pull-left");
            buttonUpdateProduct.setAttribute("type", "button");
            buttonUpdateProduct.setAttribute("data-toggle", "modal");
            buttonUpdateProduct.setAttribute("data-target", "#updateProduct");
            buttonUpdateProduct.appendChild(document.createTextNode("Modificar"));
            panelBodyProducto.appendChild(buttonUpdateProduct);
            buttonUpdateProduct.addEventListener("click", createFunctionUpdateProduct(productos[i], shop));


            var buttonRemoveProducto = document.createElement("button");
            buttonRemoveProducto.setAttribute("class", "btn btn-danger loggin pull-right");
            buttonRemoveProducto.setAttribute("type", "button");
            buttonRemoveProducto.setAttribute("data-toggle", "modal");
            buttonRemoveProducto.setAttribute("data-target", "#removeProduct");
            buttonRemoveProducto.appendChild(document.createTextNode("Eliminar"));
            panelBodyProducto.appendChild(buttonRemoveProducto);
            buttonRemoveProducto.addEventListener("click", createFunctionRemoveProduct(productos[i], tienda));

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

            var buttonAddProductShop = document.getElementById("buttonAddProductShop");
            buttonAddProductShop.addEventListener("click", createFunctionAddProduct(shop));

            checkCookie();

        }

        function createFunctionUpdateProduct(product, shop) {
            return function () {

                document.getElementById("formUpdateProduct").reset();


                var nombre = document.getElementById("nameProduct2");
                nombre.setAttribute("value", product.name);

                var precio = document.getElementById("priceProduct2");
                precio.setAttribute("value", product.price);

                var imagen = document.getElementById("imageProduct2");

                if (product.images !== undefined && product.images[0] !== "") {
                    imagen.setAttribute("value", product.images[0]);
                }

                if (product.description !== undefined) {
                    descripcionProduct2.innerHTML = product.description;
                }

                var buttonUpdateProductRepetido = document.getElementById("buttonUpdateProduct");

                if (buttonUpdateProductRepetido !== null) {
                    buttonUpdateProductRepetido.remove();
                }
                var formUpdateProduct = document.getElementById("formUpdateProduct");
                var buttonUpdateProduct = document.createElement("button");
                buttonUpdateProduct.setAttribute("id", "buttonUpdateProduct");
                buttonUpdateProduct.setAttribute("class", "btn btn-block btn-classic");
                buttonUpdateProduct.setAttribute("data-dismiss", "modal");
                buttonUpdateProduct.appendChild(document.createTextNode("Modificar"));
                formUpdateProduct.appendChild(buttonUpdateProduct);
                buttonUpdateProduct.addEventListener("click", update(product, shop));
            }
        }

        function update(product) {
            return function () {
                functionUpdateProduct(product, shop);
            }
        }

        function createFunctionAddProduct(shop) {
            return function () {
                if (x === 0) {
                    addProductInShop(shop);
                }
                x++;
            }
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


        var buttonAddProduct = document.createElement("button");
        buttonAddProduct.setAttribute("class", "btn btn-md loggin text-center");
        buttonAddProduct.setAttribute("type", "button");
        buttonAddProduct.setAttribute("data-toggle", "modal");
        buttonAddProduct.setAttribute("data-target", "#addShop");
        buttonAddProduct.appendChild(document.createTextNode("Añadir Producto "));
        var spanAddProduct = document.createElement("span");
        spanAddProduct.setAttribute("class", "glyphicon glyphicon-plus");
        buttonAddProduct.appendChild(spanAddProduct);
        divShopPopulate.appendChild(buttonAddProduct);

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

                var buttonUpdateProduct = document.createElement("button");
                buttonUpdateProduct.setAttribute("class", "btn btn-success loggin pull-left");
                buttonUpdateProduct.setAttribute("type", "button");
                buttonUpdateProduct.setAttribute("data-toggle", "modal");
                buttonUpdateProduct.setAttribute("data-target", "#updateProduct");
                buttonUpdateProduct.appendChild(document.createTextNode("Modificar"));
                panelBodyProducto.appendChild(buttonUpdateProduct);
                buttonUpdateProduct.addEventListener("click", createFunctionUpdateProduct(productos[i], tienda));

                var buttonRemoveProducto = document.createElement("button");
                buttonRemoveProducto.setAttribute("class", "btn btn-danger loggin pull-right");
                buttonRemoveProducto.setAttribute("type", "button");
                buttonRemoveProducto.setAttribute("data-toggle", "modal");
                buttonRemoveProducto.setAttribute("data-target", "#removeProduct");
                buttonRemoveProducto.appendChild(document.createTextNode("Eliminar"));
                panelBodyProducto.appendChild(buttonRemoveProducto);
                buttonRemoveProducto.addEventListener("click", createFunctionRemoveProduct(productos[i], tienda, category));

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
            checkCookie();
        }


        function createFunctionUpdateProduct(product, shop) {
            return function () {

                document.getElementById("formUpdateProduct").reset();


                var nombre = document.getElementById("nameProduct2");
                nombre.setAttribute("value", product.name);

                var precio = document.getElementById("priceProduct2");
                precio.setAttribute("value", product.price);

                var imagen = document.getElementById("imageProduct2");

                if (product.images !== undefined && product.images[0] !== "") {
                    imagen.setAttribute("value", product.images[0]);
                }

                if (product.description !== undefined) {
                    descripcionProduct2.innerHTML = product.description;
                }

                var buttonUpdateProductRepetido = document.getElementById("buttonUpdateProduct");

                if (buttonUpdateProductRepetido !== null) {
                    buttonUpdateProductRepetido.remove();
                }
                var formUpdateProduct = document.getElementById("formUpdateProduct");
                var buttonUpdateProduct = document.createElement("button");
                buttonUpdateProduct.setAttribute("id", "buttonUpdateProduct");
                buttonUpdateProduct.setAttribute("class", "btn btn-block btn-classic");
                buttonUpdateProduct.setAttribute("data-dismiss", "modal");
                buttonUpdateProduct.appendChild(document.createTextNode("Modificar"));
                formUpdateProduct.appendChild(buttonUpdateProduct);
                buttonUpdateProduct.addEventListener("click", update(product, shop));
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

        var categorias = document.getElementById("menuCategoryShopPopulate");
        var shopPopulate = document.getElementById("shopPopulate");
        var detalleProducto = document.getElementById("detalleProducto");
        var globalProductPopulate = document.getElementById("globalProductPopulate");
        var menuCategoryShopPopulateRepetido = document.getElementById("menuCategoryShopPopulate");
        var returnShopProduct = document.getElementById("returnShopProduct");
        var categoryPopulate = document.getElementById("categoryPopulate");
        var categories = showCategories();


        if (categoryPopulate !== null) {

            categoryPopulate.remove();
        }


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


        for (i = 0; i < categories.length; i++) {
            categoryProducts = almacen.getCategoryProduct(categories[i]);
            if (categoryProducts.length > 0) {
                console.log("La categoria Global: " + categories[i].title);

                var nameCategory = document.createElement("h3");
                nameCategory.setAttribute("class", "text-center bold titulo");
                nameCategory.appendChild(document.createTextNode(categories[i].title));
                globalProductPopulate.appendChild(nameCategory);

                var row = document.createElement("div");
                row.setAttribute("class", "row");
                globalProductPopulate.appendChild(row);
            }

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
                        suma += parseInt(stock);
                        var disponibilidadTienda = document.createElement("p");
                        var textodisponibilidadTienda = document.createTextNode(tienda.value.name + " tiene de stock " + stock + " ");
                        disponibilidadTienda.appendChild(textodisponibilidadTienda);
                        panelBodyProducto.appendChild(disponibilidadTienda);
                        var buttonStock = document.createElement("button");
                        buttonStock.setAttribute("class", "btn btn-md loggin pull-right");
                        buttonStock.setAttribute("data-toggle", "modal");
                        buttonStock.setAttribute("data-target", "#updateGlobalProduct");

                        var spanButtonStock = document.createElement("span");
                        spanButtonStock.setAttribute("class", "glyphicon glyphicon-pencil");
                        buttonStock.appendChild(spanButtonStock);
                        disponibilidadTienda.appendChild(buttonStock);
                        buttonStock.addEventListener("click", createFunctionUpdateGlobalProduct(product, tienda.value));
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


        function createFunctionUpdateGlobalProduct(product, shop) {
            return function () {

                var formPanelBodyProducto = document.getElementById("formUpdateGlobalProduct");

                var buttonUpdateGlobalProductRepetido = document.getElementById("buttonUpdateGlobalProduct");

                if (buttonUpdateGlobalProductRepetido !== null) {
                    buttonUpdateGlobalProductRepetido.remove();
                }

                var buttonUpdateGlobalProduct = document.createElement("button");
                buttonUpdateGlobalProduct.setAttribute("id", "buttonUpdateGlobalProduct");
                buttonUpdateGlobalProduct.setAttribute("class", "btn btn-block btn-classic");
                buttonUpdateGlobalProduct.setAttribute("type", "button");
                buttonUpdateGlobalProduct.setAttribute("data-dismiss", "modal");
                buttonUpdateGlobalProduct.appendChild(document.createTextNode("Modificar"));
                formPanelBodyProducto.appendChild(buttonUpdateGlobalProduct);
                buttonUpdateGlobalProduct.addEventListener("click", update(product, shop));
            }
        }

        function update(product, shop) {


            return function () {
                functionUpdateGlobalProduct(product, shop);
            };

        }

        checkCookie();

    }


    function categoryPopulate() {
        var initPopulate = document.getElementById("initPopulate");
        initPopulate.style.display = "none";
        var categoryPopulate = document.getElementById("categoryPopulate");
        if (categoryPopulate !== null) {

            categoryPopulate.remove();
        }

        var globalProductPopulate = document.getElementById("globalProductPopulate");

        if (globalProductPopulate !== null) {
            globalProductPopulate.remove();
        }


        var menuCategoryShopPopulateRepetido = document.getElementById("menuCategoryShopPopulate");

        if (menuCategoryShopPopulateRepetido !== null) {

            menuCategoryShopPopulateRepetido.parentElement.removeChild(menuCategoryShopPopulateRepetido);
        }

        var contenedorTiendas = document.getElementById("initPopulate");

        contenedorTiendas.style.display = "none";

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


        var categorias = showCategories();

        var divCategoryPopulate = document.createElement("div");
        divCategoryPopulate.setAttribute("id", "categoryPopulate");
        divCategoryPopulate.setAttribute("class", ".container-fluid");
        contenedorPrincipal.appendChild(divCategoryPopulate);

        var buttonAddCategory = document.createElement("button");
        buttonAddCategory.setAttribute("class", "btn btn-md loggin text-center");
        buttonAddCategory.setAttribute("type", "button");
        buttonAddCategory.setAttribute("data-toggle", "modal");
        buttonAddCategory.setAttribute("data-target", "#addCategory");
        buttonAddCategory.appendChild(document.createTextNode("Añadir Categoria "));
        var spanAddCategory = document.createElement("span");
        spanAddCategory.setAttribute("class", "glyphicon glyphicon-plus");
        buttonAddCategory.appendChild(spanAddCategory);
        divCategoryPopulate.appendChild(buttonAddCategory);

        var mainH2 = document.createElement("h2");
        mainH2.setAttribute("class", "text-center bold titulo");
        mainH2.appendChild(document.createTextNode("Categorías"));
        divCategoryPopulate.appendChild(mainH2);


        var row = document.createElement("div");
        row.setAttribute("class", "row");
        divCategoryPopulate.appendChild(row);

        for (i = 0; i < categorias.length; i++) {

            j++;

            if (j > 4) {
                j = 0;

                row = document.createElement("div");
                row.setAttribute("class", "row");
                divCategoryPopulate.appendChild(row);

            }

            var categoria = document.createElement("div");
            categoria.setAttribute("class", "col-md-3 col-sm-6 col-xs-12");
            row.appendChild(categoria);

            var panelCategoria = document.createElement("div");
            panelCategoria.setAttribute("class", "panel panel-default text-center categoria");
            categoria.appendChild(panelCategoria);


            var panelBodyCategoria = document.createElement("div");
            panelBodyCategoria.setAttribute("class", "panel-body");
            panelCategoria.appendChild(panelBodyCategoria);

            var h2 = document.createElement("h2");
            h2.appendChild(document.createTextNode(categorias[i].title));
            panelBodyCategoria.appendChild(h2);
            panelCategoria.appendChild(panelBodyCategoria);


            var descipcionCategoria = document.createElement("p");
            descipcionCategoria.appendChild(document.createTextNode(categorias[i].description));
            panelBodyCategoria.appendChild(descipcionCategoria);


            var panelFooterCategoria = document.createElement("div");
            panelFooterCategoria.setAttribute("class", "panel-footer loggin");
            panelCategoria.appendChild(panelFooterCategoria);


            var divFooterBotones = document.createElement("div");
            divFooterBotones.setAttribute("id", "divFooterBotones");
            panelFooterCategoria.appendChild(divFooterBotones);
            if (categorias[i].title !== "Anonymous category") {
                var buttonUpdateProduct = document.createElement("button");
                buttonUpdateProduct.setAttribute("class", "btn btn-success loggin pull-left");
                buttonUpdateProduct.setAttribute("type", "button");
                buttonUpdateProduct.setAttribute("data-toggle", "modal");
                buttonUpdateProduct.setAttribute("data-target", "#updateCategory");
                buttonUpdateProduct.appendChild(document.createTextNode("Modificar"));
                buttonUpdateProduct.addEventListener("click", createFunctionUpdateCategory(categorias[i]));

                divFooterBotones.appendChild(buttonUpdateProduct);

                var buttonRemoveCategory = document.createElement("button");
                buttonRemoveCategory.setAttribute("class", "btn btn-danger loggin pull-right");
                buttonRemoveCategory.setAttribute("type", "button");
                buttonRemoveCategory.setAttribute("data-toggle", "modal");
                buttonRemoveCategory.setAttribute("data-target", "#removeCategori");
                buttonRemoveCategory.appendChild(document.createTextNode("Eliminar"));
                divFooterBotones.appendChild(buttonRemoveCategory);
                buttonRemoveCategory.addEventListener("click", createFunctionRemoveCategory(categorias[i]));

            }

            checkCookie();
        }


        function createFunctionUpdateCategory(category) {
            return function () {

                document.getElementById("formUpdateCategory").reset();


                var nombre = document.getElementById("nameCategory2");
                nombre.setAttribute("value", category.title);

                if (category.description !== undefined) {
                    descripcionCategory2.innerHTML = category.description;
                }

                var buttonUpdateCategoryRepetido = document.getElementById("buttonUpdateCategory");

                if (buttonUpdateCategoryRepetido !== null) {
                    buttonUpdateCategoryRepetido.remove();
                }
                var formUpdateCategory = document.getElementById("formUpdateCategory");
                var buttonUpdateCategory = document.createElement("button");
                buttonUpdateCategory.setAttribute("id", "buttonUpdateCategory");
                buttonUpdateCategory.setAttribute("class", "btn btn-block btn-classic");
                buttonUpdateCategory.setAttribute("data-dismiss", "modal");
                buttonUpdateCategory.appendChild(document.createTextNode("Modificar"));
                formUpdateCategory.appendChild(buttonUpdateCategory);
                buttonUpdateCategory.addEventListener("click", update(category));
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
        var initPopulate1 = document.getElementById("initPopulate");


        if (cif.length > 0 && nombre.length > 0) {
            var tienda = new Shop(cif, nombre);
            tienda.image = imagen;
            tienda.address = direccion;
            tienda.telf = telefono;
            almacen.addShop(tienda);

            tiendasObjectStore.push({
                shop: tienda.getObject(),
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
        var initPopulate1 = document.getElementById("initPopulate");

        if (nombre.length > 0) {
            shop.name = nombre;
            shop.image = imagen;
            shop.address = direccion;
            shop.telf = telefono;

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

        var optionDinamico = document.getElementsByClassName("optionDinamico");
        var size = optionDinamico.length;
        for (j = 0; j < size; j++) {
            optionDinamico[j].style.display = "none";
        }

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

                if (products[i].serialNumber === product) {
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
                    // shop.coords = cursor.value.coords;

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

        console.log(Json);
        var xhttp = new XMLHttpRequest();


        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                $("#modalSaveState").modal("show");

            }
        }

        xhttp.open("POST", "saveState.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("Json=" + myJSON + "&user=" + username);
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
                    // shop.coords = cursor.value.coords;


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

            //Creamos categorias
            /*
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
                        var tienda2 = new Shop("2", "Worten");
                        tienda2.image = "img/Worten.jpg";
                        var tienda3 = new Shop("3", "PcComponentes");
                        tienda3.image = "img/PcComponentes.jpg";


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


            //  var Json = createJson();
            //  var myJSON = JSON.stringify(Json);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var myJSON = JSON.parse(this.responseText);
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

                        // shop.address = myJSON.shops[i].shop.address;
                        // shop.telf = myJSON.shops[i].shop.telf;
                        shop1.image = myJSON.shops[i].shop.image;
                        // shop.coords = cursor.value.coords;
                        almacen.addShop(shop1);

                        tiendasObjectStore[i] = {
                            shop: shop1.getObject(),
                            products: [],
                            stocks: []
                        };

                        var shopsObjectStore = db.transaction(DB_STORE_NAME2, "readwrite").objectStore(DB_STORE_NAME2);

                        for (j = 0; j < myJSON.shops[i].products.length; j++) {
                            alert("product" + myJSON.shops[i].products[j].name);

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
                    //createObjectsStores();
                    initPopulate();
                    checkCookie();


                }
            };

            createCategoriesObjectStore();
            createShopObjectStore();


            xhttp.open("POST", "initJson.php", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send("Json=" + "init.json");


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
                    "cif": tiendas[i].cif,
                    "name": tiendas[i].name,
                    "image": tiendas[i].image,
                    "address": tiendas[i].address,
                    "coords": tiendas[i].coords,
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