import React, { useRef, useState, useEffect, useContext } from 'react';
import { classNames } from 'primereact/utils';
import { Chart } from 'primereact/chart';
import { Toast } from 'primereact/toast';
import { RTLContext } from '../App';
import ChatComponent from '../components/ChatComponent';
import { fetchPrices, SymbolCode } from '../utils/stockClient';

export const Dashboard = (props: any) => {

    const toast = useRef<any>(null);
    const isRTL = useContext(RTLContext)
 
    const [prices, setPrices] = useState<any[]>([]);

    const symbols: SymbolCode[] = [
        "ETH", "BTC", "SOL", "ONDO",
        "GOLD",
        "TESLA", "NVIDIA", "APPLE", "GOOGLE",
        "META", "AMAZON", "MICROSOFT"
    ];

    useEffect(() => {
    

        fetchPrices(symbols).then(setPrices);

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const storeD = useRef<any>(null);
    const storeDData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
        datasets: [{
            data: [5, 51, 68, 82, 28, 21, 29, 45, 44],
            borderColor: [
                '#4DD0E1',
            ],
            backgroundColor: [
                'rgba(77, 208, 225, 0.8)',
            ],
            borderWidth: 2,
            fill: true,
            tension: .4
        }]
    };
    const storeOptions = {
        maintainAspectRatio: false,
        aspectRatio: 4,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                display: false
            },
            x: {
                display: false
            },
        },
        tooltips: {
            enabled: false
        },
        elements: {
            point: {
                radius: 0
            }
        },
        animation: {
            duration: 0
        }

    };

    const renderFinanceSection = () => {

        return prices.map(item => {
            let storeDDiff = 1;
            return <React.Fragment>
                <div className="p-lg-3 p-md-6 p-sm-12 p-p-0">
                    <div className="sales-info p-d-flex p-flex-column p-p-4">
                        <span className="muted-text">{item.code}</span>
                        <span className="fs-large p-mt-2">
                            {storeDDiff !== 0 && <i className={classNames('fw-700 fs-large pi', { 'p-pr-1': !isRTL, 'p-pl-1': isRTL, 'pi-arrow-up green-color': storeDDiff > 0, 'pi-arrow-down pink-color': storeDDiff < 0 })}></i>}
                            ${item.price}
                            {storeDDiff !== 0 && <span className={classNames('fw-500 fs-normal', { 'p-ml-1': !isRTL, 'p-mr-1': isRTL, 'green-color': storeDDiff > 0, 'pink-color': storeDDiff < 0 })}>
                                {storeDDiff > 0 ? '+' : ''}{storeDDiff}
                            </span>}
                        </span>
                    </div>
                    <div className="p-px-4">
                        <Chart ref={storeD} type="line" data={storeDData} options={storeOptions}></Chart>
                    </div>
                </div>
            </React.Fragment>
        });
    }

    return (
        <>
            <div className="p-grid dashboard">
                <ChatComponent />

                {renderFinanceSection()}
            </div>
            <Toast ref={toast} />
        </>

    )
}
