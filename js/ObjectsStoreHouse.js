"use strict";

function Category(title) {
    if (!(this instanceof Category)) {
        throw new InvalidAccessConstructorException();
    }

    if (!title === 0) throw new EmptyValueException("title", title);

    var _title = title;
    var _description;


    Object.defineProperty(this, 'title', {
        get: function () {
            return _title;
        },
        set: function (value) {

            _title = value;

        }
    });

    Object.defineProperty(this, 'description', {
        get: function () {
            return _description;
        },
        set: function (value) {

            _description = value;

        }
    });
}


function Product(serialNumber, name, price) {
    if (!(this instanceof Product)) {
        throw new InvalidAccessConstructorException();
    }

    if ((this.constructor === Product)) {
        throw new AbstractClassException("Product");
    }

    if (!serialNumber) throw new EmptyValueException("serialNumber");
    if (!name) throw new EmptyValueException("name");
    if (!price) throw new EmptyValueException("price");

    var _serialNumber = serialNumber;
    var _name = name;
    var _price = price;
    var _description = "";
    var _tax = "";
    var _images = [];

    Object.defineProperty(this, 'serialNumber', {
        get: function () {
            return _serialNumber;
        }
    });

    Object.defineProperty(this, 'name', {
        get: function () {
            return _name;
        },
        set: function (value) {
            _name = value;
        }
    });

    Object.defineProperty(this, 'price', {
        get: function () {
            return _price;
        },
        set: function (value) {
            _price = value;
        }
    });

    Object.defineProperty(this, 'description', {
        get: function () {
            return _description;
        },
        set: function (value) {
            _description = value;
        }
    });

    Object.defineProperty(this, 'tax', {
        get: function () {
            return _tax;
        },
        set: function (value) {
            _tax = value;
        }
    });

    Object.defineProperty(this, 'images', {
        get: function () {
            return _images;
        },
        set: function (value) {
            _images = value;
        }
    });
}

Product.prototype = {};
Product.prototype.constructor = Product;

function DefaultProduct(serialNumber, name, price) {
    Product.call(this, serialNumber, name, price);
}

DefaultProduct.prototype = Object.create(Product.prototype);
DefaultProduct.prototype.constructor = DefaultProduct;

function Smartphone(serialNumber, name, price) {
    Product.call(this, serialNumber, name, price);

}

Smartphone.prototype = Object.create(Product.prototype);
Smartphone.prototype.constructor = Smartphone;

function Laptop(serialNumber, name, price) {
    Product.call(this, serialNumber, name, price);
}

Laptop.prototype = Object.create(Product.prototype);
Laptop.prototype.constructor = Laptop;

function TV(serialNumber, name, price) {
    Product.call(this, serialNumber, name, price);

}

TV.prototype = Object.create(Product.prototype);
TV.prototype.constructor = TV;


function Coords(latitude, longitude) {

    if (!(this instanceof Coords)) {
        throw new InvalidAccessConstructorException();
    }
    latitude = typeof latitude !== 'undefined' ? Number(latitude).valueOf() : 0;
    if (Number.isNaN(latitude) || latitude < -90 || latitude > 90)
        throw new InvalidValueException("latitude", latitude);
    longitude = typeof longitude !== 'undefined' ? Number(longitude).valueOf() : 0;
    if (Number.isNaN(longitude) || longitude < -180 || longitude > 180)
        throw new InvalidValueException("longitude", longitude);

    var _latitude = latitude;
    var _longitude = longitude;


    Object.defineProperty(this, 'latitude', {
        get: function () {
            return _latitude;
        },
        set: function (value) {
            value = typeof value !== 'undefined' ? Number(value).valueOf() : 0;
            if (Number.isNaN(value) || value < -90 || value > 90)
                throw new InvalidValueException("latitude", value);
            _latitude = value;
        }
    });

    Object.defineProperty(this, 'longitude', {
        get: function () {
            return _longitude;
        },
        set: function (value) {
            value = typeof value !== 'undefined' ? Number(value).valueOf() : 0;
            if (Number.isNaN(value) || value < -180 || value > 180)
                throw new InvalidValueException("latitude", value);
            _longitude = value;
        }
    });

}

Coords.prototype = {};
Coords.prototype.constructor = Coords;

function Shop(cif, name) {

    if (!(this instanceof Shop)) {
        throw new InvalidAccessConstructorException();
    }
    if (!cif) throw new EmptyValueException("cif");
    if (!name) throw new EmptyValueException("name");

    var _cif = cif;
    var _name = name;
    var _address;
    var _telf;
    var _coords;

    Object.defineProperty(this, 'cif', {
        get: function () {
            return _cif;
        }
    });

    Object.defineProperty(this, 'name', {
        get: function () {
            return _name;
        },
        set: function (value) {
            _name = value;
        }
    });

    Object.defineProperty(this, 'address', {
        get: function () {
            return _address;
        },
        set: function (value) {
            _address = value;
        }
    });

    Object.defineProperty(this, 'telf', {
        get: function () {
            return _telf;
        },
        set: function (value) {
            if (/^[679]\d{8}$/.test(value)) throw new InvalidValueException("telf", value);
            _telf = value;
        }
    });

    Object.defineProperty(this, 'coords', {
        get: function () {
            return _coords;
        },
        set: function (value) {
            if (!(value instanceof Coords)) {
                throw new InvalidValueException("coords", value);
            }
            _coords = value;
        }
    });
}

Shop.prototype = {};
Shop.prototype.constructor = Shop;
