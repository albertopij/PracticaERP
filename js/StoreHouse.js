"use strict";

function StoreHouseException() {
    this.name = "ImageManagerException";
    this.message = "Error: StoreHouse Generic Exception.";
}

StoreHouseException.prototype = new BaseException();
StoreHouseException.prototype.constructor = StoreHouseException;

function CategoryStoreHouseException() {
    this.name = "CategoryStoreHouseException";
    this.message = "Error, debes añadir un objeto categoría";
}

CategoryStoreHouseException.prototype = new StoreHouseException();
CategoryStoreHouseException.prototype.constructor = CategoryStoreHouseException;

function ProductStoreHouseException() {
    this.name = "ProductStoreHouseException";
    this.message = "Error, debes añadir un objeto Product";
}

ProductStoreHouseException.prototype = new StoreHouseException();
ProductStoreHouseException.prototype.constructor = ProductStoreHouseException;

function ShopStoreHouseException() {
    this.name = "ShopStoreHouseException";
    this.message = "Error, debes añadir un objeto Shop";
}

ShopStoreHouseException.prototype = new StoreHouseException();
ShopStoreHouseException.prototype.constructor = ShopStoreHouseException;


function CategoryExistsStoreHouseException() {
    this.name = "CategoryExistsStoreHouseException";
    this.message = "Error, la categoría ya existe";
}

CategoryExistsStoreHouseException.prototype = new StoreHouseException();
CategoryExistsStoreHouseException.prototype.constructor = CategoryExistsStoreHouseException;

function CategoryNotExistsStoreHouseException() {
    this.name = "CategoryNotExistsStoreHouseException";
    this.message = "Error, No existe la categoría";
}

CategoryNotExistsStoreHouseException.prototype = new StoreHouseException();
CategoryNotExistsStoreHouseException.prototype.constructor = CategoryNotExistsStoreHouseException;

function ShopNotExistsStoreHouseException() {
    this.name = "ShopNotExistsStoreHouseException";
    this.message = "Error, No existe la tienda";
}

ShopNotExistsStoreHouseException.prototype = new StoreHouseException();
ShopNotExistsStoreHouseException.prototype.constructor = ShopNotExistsStoreHouseException;

function ProductExistsStoreHouseException() {
    this.name = "ProductExistsStoreHouseException";
    this.message = "Error, el producto ya existe";
}

ProductExistsStoreHouseException.prototype = new StoreHouseException();
ProductExistsStoreHouseException.prototype.constructor = ProductExistsStoreHouseException;

function ShopExistsStoreHouseException() {
    this.name = "ShopExistsStoreHouseException";
    this.message = "Error, la tienda ya existe";
}

ShopExistsStoreHouseException.prototype = new StoreHouseException();
ShopExistsStoreHouseException.prototype.constructor = ShopExistsStoreHouseException;

function ProductNotExistsStoreHouseException() {
    this.name = "ProductNotExistsStoreHouseException";
    this.message = "Error, No existe el producto";
}

CategoryNotExistsStoreHouseException.prototype = new StoreHouseException();
CategoryNotExistsStoreHouseException.prototype.constructor = CategoryNotExistsStoreHouseException;


function DefaultCategoryStoreHouseException() {
    this.name = "DefaultCategoryStoreHouseException";
    this.message = "Error: The default category can't be removed.";
}

DefaultCategoryStoreHouseException.prototype = new StoreHouseException();
DefaultCategoryStoreHouseException.prototype.constructor = DefaultCategoryStoreHouseException;

function DefaultShopStoreHouseException() {
    this.name = "DefaultShopStoreHouseException";
    this.message = "Error: The default shop can't be removed.";
}

DefaultShopStoreHouseException.prototype = new StoreHouseException();
DefaultShopStoreHouseException.prototype.constructor = DefaultShopStoreHouseException;

function NumberEmptyStoreHouseException() {
    this.name = "NumberEmptyStoreHouseException";
    this.message = "Error, number no puede estar vacío";
}

NumberEmptyStoreHouseException.prototype = new StoreHouseException();
NumberEmptyStoreHouseException.prototype.constructor = NumberEmptyStoreHouseException;

var StoreHouse;
StoreHouse = (function () {
    var instantiated;

    function init() { //Inicialización del Singleton

        function StoreHouse() {
            if (!(this instanceof StoreHouse)) {
                throw new InvalidAccessConstructorException();
            }

            var _name;

            Object.defineProperty(this, 'name', {
                get: function () {
                    return _name;
                },
                set: function (value) {

                    _name = value;

                }
            });

            var _categories = [];

            Object.defineProperty(this, 'categories', {
                get: function () {
                    var nextIndex = 0;
                    return {
                        next: function () {
                            return nextIndex < _categories.length ?
                                {value: _categories[nextIndex++].category, done: false} :
                                {done: true};
                        }
                    }
                }
            });


            Object.defineProperty(this, 'shops', {
                get: function () {
                    var nextIndex = 0;
                    return {
                        next: function () {
                            return nextIndex < _shops.length ?
                                {value: _shops[nextIndex++].shop, done: false} :
                                {done: true};
                        }
                    }
                }
            });


            this.addCategory = function (category) {
                if (!(category instanceof Category)) {
                    throw new CategoryStoreHouseException();
                }
                var position = getCategoryPosition(category);
                if (position === -1) {
                    _categories.push(
                        {
                            category: category,
                            products: []
                        }
                    );
                } else {
                    throw new CategoryExistsStoreHouseException();
                }
                return _categories.length;
            };

            this.removeCategory = function (category) {
                if (!(category instanceof Category)) {
                    throw new CategoryStoreHouseException();
                }
                var position = getCategoryPosition(category);

                if (position !== -1) {
                    if (Category.name !== _defaultCategory.name) {

                        var positionDefaultCategory = getCategoryPosition(_defaultCategory);
                        var i;

                        for (i = 0; i < _categories[position].products.length; i++) {
                            _categories[positionDefaultCategory].products.push(_categories[position].products[i]);
                        }

                        _categories.splice(position, 1);
                    } else {
                        throw new DefaultCategoryStoreHouseException();
                    }
                } else {
                    throw new CategoryNotExistsStoreHouseException();
                }
                return _categories.length;
            };

            function getCategoryPosition(category) {
                if (!(category instanceof Category)) {
                    throw new CategoryStoreHouseException();
                }

                function compareElements(element) {
                    return (element.category.title === category.title)
                }

                return _categories.findIndex(compareElements);
            }

            var _defaultCategory = new Category("Anonymous category"); //Categoría por defecto
            this.addCategory(_defaultCategory);
            _defaultCategory.description = "En esta categoría se guardan los productos que no están etiquetados en ninguna categoría.";

            Object.defineProperty(this, 'defaultCategory', {
                get: function () {
                    return _defaultCategory;
                }
            });

            function getProductPosition(product, categoriesProduct) {
                if (!(product instanceof Product)) {
                    throw new ProductStoreHouseException();
                }

                function compareElements(element) {
                    return (element.product.serialNumber === product.serialNumber)
                }

                return categoriesProduct.findIndex(compareElements);
            }

            this.addProduct = function (product, category) {

                if (!product) throw new EmptyValueException("product");
                if (!(product instanceof Product)) {
                    throw new CategoryStoreHouseException();
                }

                if (!category) {
                    category = _defaultCategory;
                }

                var categoryPosition = getCategoryPosition(category);
                if (categoryPosition === -1) {
                    categoryPosition = this.addCategory(category) - 1;
                }

                var productPosition = getProductPosition(product, _categories[categoryPosition].products);
                if (productPosition === -1) {
                    _categories[categoryPosition].products.push(
                        {
                            product: product
                        }
                    )
                    ;
                } else {
                    throw new ProductExistsStoreHouseException();
                }
                return _categories[categoryPosition].products.length;
            };

            this.removeProduct = function (product) {

                if (!(product instanceof Product)) {
                    throw new ProductStoreHouseException();
                }

                var i = _categories.length - 1, position = -1;
                while (i >= 0 && position === -1) {
                    position = getProductPosition(product, _categories[i].products);
                    i--;
                }
                if (position !== -1) {
                    _categories[i + 1].products.splice(position, 1);
                } else {
                    throw new ProductNotExistsStoreHouseException();
                }
            };

            this.removeShopProduct = function (product, shop) {

                if (!(product instanceof Product)) {
                    throw new ProductStoreHouseException();
                }

                if (!(shop instanceof Shop)) {
                    throw new ShopStoreHouseException();
                }

                var i = _categories.length - 1, position = -1;

                var shopPosition = getShopPosition(shop);
                var productPosition = getProductPosition(product, _shops[shopPosition].products);

                if (productPosition > -1) {
                    _shops[shopPosition].products.splice(productPosition, 1);
                }

            };

            this.getCategoryProduct = function (category) {

                if (!(category instanceof Category)) {
                    throw new CategoryStoreHouseException();
                }

                var products = [];
                var i;
                var categoryPosition = getCategoryPosition(category);

                if (categoryPosition === -1) throw new CategoryNotExistsStoreHouseException();

                for (i = 0; i < _categories[categoryPosition].products.length; i++) {
                    products[i] = _categories[categoryPosition].products[i].product;
                }

                return products;
            };


            this.allCategories = function () {
                var nextIndex = 0;
                return _categories;
            };


            function getShopPosition(shop) {
                if (!(shop instanceof Shop)) {
                    throw new ShopStoreHouseException();
                }

                function compareElements(element) {
                    return (element.shop.cif === shop.cif)
                }

                return _shops.findIndex(compareElements);
            }


            var _shops = [];

            this.addShop = function (shop) {
                if (!(shop instanceof Shop)) {
                    throw new ShopStoreHouseException();
                }
                var position = getShopPosition(shop);
                if (position === -1) {
                    _shops.push({
                        shop: shop,
                        products: [],
                        stocks: []
                    });

                } else {
                    throw new ShopExistsStoreHouseException();
                }
                return _shops.length;
            };

            this.removeShop = function (shop) {
                if (!(shop instanceof Shop)) {
                    throw new ShopStoreHouseException();
                }
                var position = getShopPosition(shop);

                if (position !== -1) {
                    if (shop.cif !== _defaultCategory.cif) {
                        var shopPosition = getShopPosition(_defaultShop);
                        var productPosition = -1;
                        var i;
                        for (i = 0; i < _shops[position].products.length; i++) {

                            productPosition = getProductPosition(_shops[position].products[i].product, _shops[shopPosition].products);

                            if (productPosition !== -1) {
                                _shops[shopPosition].stocks[productPosition].stock += _shops[position].stocks[i].stock;
                            } else {
                                this.addProductInShop(_shops[position].products[i].product, _defaultShop, _shops[position].stocks[i].stock)
                            }


                        }
                        _shops.splice(position, 1);
                    } else {
                        throw new DefaultShopStoreHouseException();
                    }
                } else {
                    throw new ShopNotExistsStoreHouseException();
                }
                return _shops.length;
            };

            var _defaultShop = new Shop("9", "defaultShop"); //Categoría por defecto
            this.addShop(_defaultShop);

            Object.defineProperty(this, 'defaultShop', {
                get: function () {
                    return _defaultShop;
                }
            });

            this.addProductInShop = function (product, shop, number) {

                if (!(product instanceof Product)) {
                    throw new ProductStoreHouseException;
                }

                if (!(shop instanceof Shop)) {
                    throw new ShopStoreHouseException;
                }

                if (!number || number === 0) throw new NumberEmptyStoreHouseException;

                if (!shop) {
                    shop = _defaultShop;
                }

                var shopPosition = getShopPosition(shop);
                if (shopPosition === -1) {
                    shopPosition = this.addShop(shop) - 1;
                }

                var productPosition = getProductPosition(product, _shops[shopPosition].products);
                if (productPosition === -1) {
                    _shops[shopPosition].products.push(
                        {
                            product: product
                        });
                    _shops[shopPosition].stocks.push(
                        {
                            stock: number
                        }
                    );
                } else {
                    throw new ProductExistsStoreHouseException();


                }
                return _shops[shopPosition].products.length;
            };


            this.getShopProduct = function (shop, product) {
                if (!(shop instanceof Shop)) {
                    throw new ShopStoreHouseException();
                }

                var shopPosition = getShopPosition(shop);

                if (!product) {

                    if (shopPosition === -1) throw new ShopNotExistsStoreHouseException();
                    var nextIndex = 0;
                    return {
                        next: function () {
                            return nextIndex < _shops[shopPosition].products.length ?
                                {value: _shops[shopPosition].products[nextIndex++].product, done: false} :
                                {done: true};
                        }
                    }
                } else {

                    var productPosition = getProductPosition(product, _shops[shopPosition].products);
                    return {value: _shops[shopPosition].products[productPosition].product}
                }
            };

            this.changeProductStock = function (product, shop, number) {

                if (!(product instanceof Product)) {
                    throw new ProductStoreHouseException;
                }
                if (!(shop instanceof Shop)) {
                    throw new ShopStoreHouseException();
                }

                var shopPosition = getShopPosition(shop);
                var productPosition = getProductPosition(product, _shops[shopPosition].products);


                if (shopPosition > -1 && productPosition > -1) {
                    _shops[shopPosition].stocks[productPosition].stock = number;
                }
            };

            this.getProductStock = function (product, shop) {

                if (!(product instanceof Product)) {
                    throw new ProductStoreHouseException;
                }
                if (!(shop instanceof Shop)) {
                    throw new ShopStoreHouseException();
                }

                var shopPosition = getShopPosition(shop);
                var productPosition = getProductPosition(product, _shops[shopPosition].products);

                return _shops[shopPosition].stocks[productPosition].stock;
            };

            this.addQuantityProductInShop = function (product, shop, number) {

                if (!(product instanceof Product)) {
                    throw ProductStoreHouseException;
                }

                if (!(shop instanceof Shop)) {
                    throw ShopStoreHouseException;
                }

                if (!number || number < 0) throw NumberEmptyStoreHouseException;

                if (!shop) {
                    shop = _defaultShop;
                }

                var shopPosition = getShopPosition(shop);
                var productPosition = getProductPosition(product, _shops[shopPosition].products);

                _shops[shopPosition].stocks[productPosition].stock = parseInt(_shops[shopPosition].stocks[productPosition].stock) + parseInt(number);

                return _shops[shopPosition].stocks[productPosition].stock;

            };

        }

        StoreHouse.prototype = {};
        StoreHouse.prototype.constructor = StoreHouse;

        var instance = new StoreHouse();
        Object.freeze(instance);
        return instance;
    } //Fin inicialización del Singleton
    return {
        // Devuelve un objeto con el método getInstance
        getInstance: function () {
            if (!instantiated) { //Si la variable instantiated es undefined, priemera ejecución, ejecuta init.
                instantiated = init(); //instantiated contiene el objeto único
            }
            return instantiated; //Si ya está asignado devuelve la asignación.
        }
    };
})
();