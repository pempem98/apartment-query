/*
 * Filename: apartment.js
 * Created Date: Friday, September 8th 2023
 * Author: lucasdo
 * Email: donhudong.2710@gmail.com
 * Copyright (c) 2023 Lucas Do
 */


// Table header format
const SUBDIVISION_COLUMN = 1;
const BUILDING_COLUMN = 2;
const APARTMENT_CODE_COLUMN = 3;
const SUPPLIER_COLUMN = 4;
const FLOOR_COLUMN = 5;
const APARTMENT_NUMBER_COLUMN = 6;
const APARTMENT_TYPE_COLUMN = 7;
const DIRECTION_COLUMN = 8;
const NAVIGABLE_AREA_COLUMN = 9;
const BUILT_UP_AREA_COLUMN = 10;
const PLAN1_NON_VAT_COLUMN = 11;
const PLAN1_VAT_COLUMN = 12;
const PLAN2_NON_VAT_COLUMN = 13;
const PLAN2_VAT_COLUMN = 14;
const PLAN3_NON_VAT_COLUMN = 15;
const PLAN3_VAT_COLUMN = 16;
const PLAN4_NON_VAT_COLUMN = 17;
const PLAN4_VAT_COLUMN = 18;

class Apartment {
    constructor(data) {
        this.subdivision = data[SUBDIVISION_COLUMN];
        this.building = data[BUILDING_COLUMN];
        this.code = data[APARTMENT_CODE_COLUMN];
        this.supplier = data[SUPPLIER_COLUMN];
        this.floor = data[FLOOR_COLUMN];
        this.number = data[APARTMENT_NUMBER_COLUMN];
        this.type = data[APARTMENT_TYPE_COLUMN];
        this.direction = data[DIRECTION_COLUMN];
        this.navigableArea = data[NAVIGABLE_AREA_COLUMN];
        this.builtUpArea = data[BUILT_UP_AREA_COLUMN];
        this.plan1 = this.#get_plan(data[PLAN1_NON_VAT_COLUMN], data[PLAN1_VAT_COLUMN]);
        this.plan2 = this.#get_plan(data[PLAN2_NON_VAT_COLUMN], data[PLAN2_VAT_COLUMN]);
        this.plan3 = this.#get_plan(data[PLAN3_NON_VAT_COLUMN], data[PLAN3_VAT_COLUMN]);
        this.plan4 = this.#get_plan(data[PLAN4_NON_VAT_COLUMN], data[PLAN4_VAT_COLUMN]);
    }

    #get_plan(nonVatPrice, fullPrice) {
        return {
            nonVatPrice: nonVatPrice,
            fullPrice: fullPrice,
        };
    }
};
