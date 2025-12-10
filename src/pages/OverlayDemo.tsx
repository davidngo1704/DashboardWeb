import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { confirmDialog } from 'primereact/confirmdialog';
import { confirmPopup } from 'primereact/confirmpopup';
import ProductService from '../service/ProductService';

export const OverlayDemo = () => {

    const [displayBasic, setDisplayBasic] = useState<boolean>(false);
    const [visibleLeft, setVisibleLeft] = useState<boolean>(false);
    const [visibleRight, setVisibleRight] = useState<boolean>(false);
    const [visibleTop, setVisibleTop] = useState<boolean>(false);
    const [visibleBottom, setVisibleBottom] = useState<boolean>(false);
    const [visibleFullScreen, setVisibleFullScreen] = useState<boolean>(false);
    const [products, setProducts] = useState<any>(null);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const op = useRef<any>(null);
    const op2 = useRef<any>(null);
    const toast = useRef<any>(null);

    useEffect(() => {
        const productService = new ProductService();
        productService.getProductsSmall().then(data => setProducts(data));
    }, []);

    const confirm1 = () => {
        confirmDialog({
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle'
        });
    };

    const confirm2 = (e: any) => {
        confirmPopup({
            target: e.target,
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle'
        });
    };

    const toggle = (event: any) => {
        op.current.toggle(event);
    };

    const toggleDataTable = (event: any) => {
        op2.current.toggle(event);
    };

    const formatCurrency = (value: any) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const onProductSelect = (event: any) => {
        op2.current.hide();
        toast.current.show({ severity: 'info', summary: 'Product Selected', detail: event.data.name, life: 3000 });
    };

    const basicDialogFooter = (
        <>
            <Button type="button" label="No" onClick={() => setDisplayBasic(false)} icon="pi pi-check" className="p-button-text" />
            <Button autoFocus type="button" label="Yes" onClick={() => setDisplayBasic(false)} icon="pi pi-check" className="p-button-text" />
        </>
    );
    const imageBodyTemplate = (data: any) => <img src={`assets/demo/images/product/${data.image}`} alt={data.image} className="product-image" width="50" style={{ boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }} />;
    const priceBodyTemplate = (data: any) => formatCurrency(data.price);

    return (
        <>
            <Toast ref={toast} />
            <div className="p-grid overlay-demo">
                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h5>Dialog</h5>
                        <Dialog header="Dialog" visible={displayBasic} style={{ width: '30vw' }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit
                                in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </Dialog>

                        <Button type="button" label="Show" icon="pi pi-external-link" onClick={() => setDisplayBasic(true)} />
                    </div>
                    <div className="card p-fluid">
                        <h5>Overlay Panel</h5>
                        <div className="p-grid p-formgrid">
                            <div className="p-col-6">
                                <Button type="button" label="Image" onClick={toggle} className="p-button-success" />
                                <OverlayPanel ref={op} showCloseIcon>
                                    <img src="assets/demo/images/product/blue-band.jpg" alt="Blue Band" />
                                </OverlayPanel>
                            </div>
                            <div className="p-col-6">
                                <Button type="button" label="DataTable" onClick={toggleDataTable} className="p-button-success" />
                                <OverlayPanel ref={op2} showCloseIcon id="overlay_panel" style={{ width: '450px' }}>
                                    <DataTable value={products} selection={selectedProduct} onSelectionChange={(e) => setSelectedProduct(e.value)} selectionMode="single"
                                        paginator rows={5} onRowSelect={onProductSelect}>
                                        <Column field="name" header="Name" sortable></Column>
                                        <Column header="Image" body={imageBodyTemplate}></Column>
                                        <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column>
                                    </DataTable>
                                </OverlayPanel>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h5>Confirmation</h5>
                        <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirm1} />
                    </div>
                    <div className="card">
                        <h5>Sidebar</h5>
                        <Sidebar visible={visibleLeft} onHide={() => setVisibleLeft(false)} baseZIndex={1000000}>
                            <h3 style={{ fontWeight: 'normal' }}>Left Sidebar</h3>
                        </Sidebar>

                        <Sidebar visible={visibleRight} onHide={() => setVisibleRight(false)} baseZIndex={1000000} position="right">
                            <h3 style={{ fontWeight: 'normal' }}>Right Sidebar</h3>
                        </Sidebar>

                        <Sidebar visible={visibleTop} onHide={() => setVisibleTop(false)} baseZIndex={1000000} position="top">
                            <h3 style={{ fontWeight: 'normal' }}>Top Sidebar</h3>
                        </Sidebar>

                        <Sidebar visible={visibleBottom} onHide={() => setVisibleBottom(false)} baseZIndex={1000000} position="bottom">
                            <h3 style={{ fontWeight: 'normal' }}>Bottom Sidebar</h3>
                        </Sidebar>

                        <Sidebar visible={visibleFullScreen} onHide={() => setVisibleFullScreen(false)} baseZIndex={1000000} fullScreen>
                            <h3 style={{ fontWeight: 'normal' }}>Full Screen</h3>
                        </Sidebar>

                        <Button type="button" icon="pi pi-arrow-right" className="p-button-warning" onClick={() => setVisibleLeft(true)} style={{ marginRight: '.25em' }} />
                        <Button type="button" icon="pi pi-arrow-left" className="p-button-warning" onClick={() => setVisibleRight(true)} style={{ marginRight: '.25em' }} />
                        <Button type="button" icon="pi pi-arrow-down" className="p-button-warning" onClick={() => setVisibleTop(true)} style={{ marginRight: '.25em' }} />
                        <Button type="button" icon="pi pi-arrow-up" className="p-button-warning" onClick={() => setVisibleBottom(true)} style={{ marginRight: '.25em' }} />
                        <Button type="button" icon="pi pi-external-link" className="p-button-warning" onClick={() => setVisibleFullScreen(true)} />
                    </div>
                </div>

                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h5>Tooltip</h5>
                        <div className="p-formgroup-inline">
                            <div className="p-field">
                                <InputText type="text" placeholder="Username" tooltip="Your username" />
                            </div>

                            <Button className="p-mt-2" type="button" label="Save" icon="pi pi-check" tooltip="Click to proceed" />
                        </div>
                    </div>
                </div>

                <div className="p-col-12 p-lg-6">
                    <div className="card">
                        <h5>ConfirmPopup</h5>
                        <Button icon="pi pi-check" label="Confirm" onClick={confirm2} />
                    </div>
                </div>
            </div>
        </>
    )
}
