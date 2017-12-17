"use strict";

function testStoreHouse() {

    function showCategories() {

        console.log("Recorremos las categorias.");
        var categories = almacen.categories;
        var category = categories.next();
        while (category.done !== true) {
            console.log("Category: " + category.value.title);
            category = categories.next();
        }
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
        while (product.done !== true) {
            console.log("   Product: " + product.value.name + " (" + product.value.price + "€)");
            product = products.next();
        }
    }

    function showProductShop1(products, shop) {

        var product = products.next();
        var stock;
        while (product.done !== true) {
            stock = almacen.getProductStock(product.value, shop);
            console.log("   Product: " + product.value.name + " (" + product.value.price + "€) con stock " + stock);
            product = products.next();
        }
    }

    function showProductShop2(products, product1, shop) {

        var product = products.next();
        var stock;
        while (product.done !== true) {
            stock = almacen.getProductStock(product.value, shop);
            if (product.value.serialNumber === product1.serialNumber) {
                console.log("   Product: " + product.value.name + " (" + product.value.price + "€) con stock " + stock);
            }
            product = products.next();
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

    var movil1 = new Smartphone("1", "Iphone X", "1300");
    var movil2 = new Smartphone("2", "Samsung S8", "800");
    var tele1 = new TV("3", "Samsung Curve", "2000");
    var tele2 = new TV("4", "LG 4k", "1400");
    var portatil1 = new Laptop("5", "Lenovo Yoga", "600");
    var portatil2 = new Laptop("6", "Mac Pro", "1800");


//Creamos Tiendas

    var tienda1 = new Shop("1", "Tienda 1");
    var tienda2 = new Shop("2", "Tienda 2");
    var tienda3 = new Shop("3", "Tienda 3");

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
    console.log(almacen.addCategory(ropa));
    showCategories();
    console.log("");
    console.log("####################################################################");
    console.log("Borramos la categoria ropa");
    console.log(almacen.removeCategory(ropa));
    showCategories();
    console.log("");
    console.log("####################################################################");
    console.log("Añado productos a sus categorias");
    almacen.addProduct(movil1, telefonos);
    almacen.addProduct(movil2, telefonos);
    almacen.addProduct(tele1, televisiones);
    almacen.addProduct(tele2, televisiones);
    almacen.addProduct(portatil1, portatiles);
    almacen.addProduct(portatil2, portatiles);
    showAllProducts();
    console.log("");
    console.log("####################################################################");
    console.log("Borro el producto Samsung S8 porque es muy caro");
    almacen.removeProduct(movil2);
    showAllProducts();
    console.log("");
    console.log("####################################################################");
    console.log("Añadimos tienda 1, tienda 2 y tienda 3");
    almacen.addShop(tienda1);
    almacen.addShop(tienda2);
    almacen.addShop(tienda3);
    showShops();
    console.log("");
    console.log("####################################################################");
    console.log("Borramos la tienda 3");
    almacen.removeShop(tienda3);
    showShops();
    console.log("");
    console.log("####################################################################");
    console.log("añadimos productos en la tienda 1 y tienda 2");
    almacen.addProductInShop(movil1, tienda1, 20);
    almacen.addProductInShop(tele1, tienda1, 40);
    almacen.addProductInShop(movil1, tienda2, 50);
    almacen.addProductInShop(tele1, tienda2, 70);
    almacen.addProductInShop(tele2, tienda2, 40);
    almacen.addProductInShop(portatil1, tienda2, 10);
    almacen.addProductInShop(portatil2, tienda2, 15);
    showAllProductsShops();
    console.log("");
    console.log("####################################################################");
    console.log("añadimos mas stock al Iphone X de la tienda 1 que ahora tiene 20 y le sumamos 20 más");
    console.log(almacen.addQuantityProductInShop(movil1, tienda1, 20));
    showAllProductsShops();
    console.log("");
    console.log("####################################################################");
    console.log("Miramos en todas las tiendas en las que está el iphone y su stock");
    showAllProductsShops(movil1);
    console.log("");
    console.log("Ahora miramos todas las tiendas en las que está el mac y su stock");
    showAllProductsShops(portatil2);
}

window.onload = testStoreHouse();
