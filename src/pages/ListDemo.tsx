import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions, DataViewLayoutType } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { PickList } from 'primereact/picklist';
import { OrderList } from 'primereact/orderlist';
import ProductService from '../service/ProductService';

export const ListDemo = () => {

    const listValue = [
        { name: 'San Francisco', code: 'SF' },
        { name: 'London', code: 'LDN' },
        { name: 'Paris', code: 'PRS' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Berlin', code: 'BRL' },
        { name: 'Barcelona', code: 'BRC' },
        { name: 'Rome', code: 'RM' },
    ];

    const [picklistSourceValue, setPicklistSourceValue] = useState<any>(listValue);
    const [picklistTargetValue, setPicklistTargetValue] = useState<any>([]);
    const [orderlistValue, setOrderlistValue] = useState<any>(listValue);
    const [dataviewValue, setDataviewValue] = useState<any>(null);
    const [layout, setLayout] = useState<DataViewLayoutType>('grid');
    const [sortKey, setSortKey] = useState<any>(null);
    const [sortOrder, setSortOrder] = useState<any>(null);
    const [sortField, setSortField] = useState<any>(null);

    const sortOptions = [
        { label: 'Price High to Low', value: '!price' },
        { label: 'Price Low to High', value: 'price' }
    ];

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then(data => setDataviewValue(data));
    }, []);

    const onSortChange = (event: any) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        }
        else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const dataviewHeader = (
        <div className="p-grid p-nogutter">
            <div className="p-col-6" style={{ textAlign: 'left' }}>
                <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort By Price" onChange={onSortChange} />
            </div>
            <div className="p-col-6" style={{ textAlign: 'right' }}>
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        </div>
    );

    const dataviewListItem = (data: any) => {
        return (
            <div className="p-col-12 list-demo">
                <div className="product-list-item">
                    <img src={`assets/demo/images/product/${data.image}`} alt={data.name} />
                    <div className="product-list-detail">
                        <div className="product-name">{data.name}</div>
                        <div className="product-description">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false}></Rating>
                        <i className="pi pi-tag product-category-icon"></i><span className="product-category">{data.category}</span>
                    </div>
                    <div className="product-list-action">
                        <span className="product-price">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" label="Add to Cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
                        <span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span>
                    </div>
                </div>
            </div>
        );
    };

    const dataviewGridItem = (data: any) => {
        return (
            <div className="p-col-12 p-md-4">
                <div className="product-grid-item card">
                    <div className="product-grid-item-top">
                        <div>
                            <i className="pi pi-tag product-category-icon"></i>
                            <span className="product-category">{data.category}</span>
                        </div>
                        <span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span>
                    </div>
                    <div className="product-grid-item-content">
                        <img src={`assets/demo/images/product/${data.image}`} alt={data.name} />
                        <div className="product-name">{data.name}</div>
                        <div className="product-description">{data.description}</div>
                        <Rating value={data.rating} readOnly cancel={false}></Rating>
                    </div>
                    <div className="product-grid-item-bottom">
                        <span className="product-price">${data.price}</span>
                        <Button icon="pi pi-shopping-cart" disabled={data.inventoryStatus === 'OUTOFSTOCK'}></Button>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (data: any, layout: string) => {
        if (!data) {
            return;
        }

        if (layout === 'list') {
            return dataviewListItem(data);
        }
        else if (layout === 'grid') {
            return dataviewGridItem(data);
        }
    };

    return (
        <div className="p-grid list-demo">
            <div className="p-col-12">
                <div className="card">
                    <h5>DataView</h5>
                    <DataView value={dataviewValue} layout={layout} paginator rows={9} sortOrder={sortOrder} sortField={sortField} itemTemplate={itemTemplate} header={dataviewHeader}></DataView>
                </div>
            </div>

            <div className="p-col-12 p-lg-8">
                <div className="card">
                    <h5>PickList</h5>
                    <PickList source={picklistSourceValue} target={picklistTargetValue} sourceHeader="From" targetHeader="To" itemTemplate={(item) => <div>{item.name}</div>}
                        onChange={(e) => { setPicklistSourceValue(e.source); setPicklistTargetValue(e.target) }} sourceStyle={{ height: '200px' }} targetStyle={{ height: '200px' }}></PickList>
                </div>
            </div>

            <div className="p-col-12 p-lg-4">
                <div className="card">
                    <h5>OrderList</h5>
                    <OrderList value={orderlistValue} listStyle={{ height: '200px' }} className="p-orderlist-responsive" header="Cities" itemTemplate={(item) => <div>{item.name}</div>}
                        onChange={(e) => setOrderlistValue(e.value)}></OrderList>
                </div>
            </div>
        </div>
    )
}