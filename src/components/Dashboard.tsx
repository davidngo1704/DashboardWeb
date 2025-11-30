import React, { useRef, useState, useEffect, useContext } from 'react';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { ProgressBar } from 'primereact/progressbar';
import { Menu } from 'primereact/menu';
import { Card } from 'primereact/card';
import ProductService from '../service/ProductService';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Timeline } from 'primereact/timeline';
import { InputText } from 'primereact/inputtext';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Toast } from 'primereact/toast';
import { RTLContext } from '../App';
import httpClient from "../utils/htttpClient";

import { fetchPrices, SymbolCode, PriceResult } from '../utils/stockClient';

const overviewChartData1 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
    datasets: [
        {
            data: [50, 64, 32, 24, 18, 27, 20, 36, 30],
            borderColor: [
                '#4DD0E1',
            ],
            backgroundColor: [
                'rgba(77, 208, 225, 0.8)',
            ],
            borderWidth: 2,
            fill: true,
            tension: .4
        }
    ]
};
const overviewChartData2 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
    datasets: [
        {
            data: [11, 30, 52, 35, 39, 20, 14, 18, 29],
            borderColor: [
                '#4DD0E1',
            ],
            backgroundColor: [
                'rgba(77, 208, 225, 0.8)',
            ],
            borderWidth: 2,
            fill: true,
            tension: .4
        }
    ]
};
const overviewChartData3 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
    datasets: [
        {
            data: [20, 29, 39, 36, 45, 24, 28, 20, 15],
            borderColor: [
                '#4DD0E1',
            ],
            backgroundColor: [
                'rgba(77, 208, 225, 0.8)',
            ],
            borderWidth: 2,
            fill: true,
            tension: .4
        }
    ]
};
const overviewChartData4 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
    datasets: [
        {
            data: [30, 39, 50, 21, 33, 18, 10, 24, 20],
            borderColor: [
                '#4DD0E1',
            ],
            backgroundColor: [
                'rgba(77, 208, 225, 0.8)',
            ],
            borderWidth: 2,
            fill: true,
            tension: .4
        }
    ]
};
const overviewChartOptions = {
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
        }
    },
    tooltips: {
        enabled: false
    },
    elements: {
        point: {
            radius: 0
        }
    }
};
const ordersChart = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
    datasets: [{
        label: 'New Orders',
        data: [31, 83, 69, 29, 62, 25, 59, 26, 46],
        borderColor: [
            '#4DD0E1',
        ],
        backgroundColor: [
            'rgba(77, 208, 225, 0.8)',
        ],
        borderWidth: 2,
        fill: true,
        tension: .4
    }, {
        label: 'Completed Orders',
        data: [67, 98, 27, 88, 38, 3, 22, 60, 56],
        borderColor: [
            '#3F51B5',
        ],
        backgroundColor: [
            'rgba(63, 81, 181, 0.8)',
        ],
        borderWidth: 2,
        fill: true,
        tension: .4
    }]
};
const getOrdersOptions = () => {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-color') || 'rgba(0, 0, 0, 0.87)';
    const gridLinesColor = getComputedStyle(document.body).getPropertyValue('--divider-color') || 'rgba(160, 167, 181, .3)';
    const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-family');
    return {
        plugins: {
            legend: {
                display: true,
                labels: {
                    fontFamily,
                    color: textColor,
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    fontFamily,
                    color: textColor
                },
                grid: {
                    color: gridLinesColor
                }
            },
            x: {
                ticks: {
                    fontFamily,
                    color: textColor
                },
                grid: {
                    color: gridLinesColor
                }
            }
        }
    }
}
let ordersOptions = getOrdersOptions();
export const Dashboard = (props: any) => {
    const [products, setProducts] = useState<any>(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const menu1 = useRef<any>(null);
    const menu2 = useRef<any>(null);
    const menu3 = useRef<any>(null);
    const menu4 = useRef<any>(null);
    const menu5 = useRef<any>(null);
    const menu6 = useRef<any>(null);
    const menu7 = useRef<any>(null);
    const menu8 = useRef<any>(null);
    const menu9 = useRef<any>(null);
    const menu10 = useRef<any>(null);
    const op = useRef<any>(null)
    const chatcontainer = useRef<any>(null);
    const toast = useRef<any>(null);
    const isRTL = useContext(RTLContext)
    const chart1 = useRef<any>(null);

    const getOverviewColors = () => {
        const isLight = props.colorMode === 'light';
        return {
            pinkBorderColor: isLight ? '#E91E63' : '#EC407A',
            pinkBgColor: isLight ? '#F48FB1' : '#F8BBD0',
            tealBorderColor: isLight ? '#009688' : '#26A69A',
            tealBgColor: isLight ? '#80CBC4' : '#B2DFDB'
        }
    }
    const setOverviewColors = () => {
        const { pinkBorderColor, pinkBgColor, tealBorderColor, tealBgColor } = getOverviewColors();
        overviewChartData1.datasets[0].borderColor[0] = tealBorderColor;
        overviewChartData1.datasets[0].backgroundColor[0] = tealBgColor;
        overviewChartData2.datasets[0].borderColor[0] = tealBorderColor;
        overviewChartData2.datasets[0].backgroundColor[0] = tealBgColor;
        overviewChartData3.datasets[0].borderColor[0] = pinkBorderColor;
        overviewChartData3.datasets[0].backgroundColor[0] = pinkBgColor;
        overviewChartData4.datasets[0].borderColor[0] = tealBorderColor;
        overviewChartData4.datasets[0].backgroundColor[0] = tealBgColor;
    }
    useEffect(() => {
        if (props.isNewThemeLoaded) {
            ordersOptions = getOrdersOptions();
            props.onNewThemeChange(false);
            setOverviewColors();
        }
    }, [props.isNewThemeLoaded, props.onNewThemeChange]); // eslint-disable-line react-hooks/exhaustive-deps
    const timelineEvents = [
        { status: 'Ordered', date: '15/10/2020 10:30', icon: "pi pi-shopping-cart", color: '#E91E63', description: "Richard Jones (C8012) has ordered a blue t-shirt for $79." },
        { status: 'Processing', date: '15/10/2020 14:00', icon: "pi pi-cog", color: '#FB8C00', description: "Order #99207 has processed succesfully." },
        { status: 'Shipped', date: '15/10/2020 16:15', icon: "pi pi-compass", color: '#673AB7', description: "Order #99207 has shipped with shipping code 2222302090." },
        { status: 'Delivered', date: '16/10/2020 10:00', icon: "pi pi-check-square", color: '#0097A7', description: "Richard Jones (C8012) has recieved his blue t-shirt." }
    ];
    const [chatMessages, setChatMessages] = useState([
        { from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['Hey M. hope you are well.', 'Our idea is accepted by the board. Now it’s time to execute it'] },
        { messages: ['We did it! 🤠'] },
        { from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['That\'s really good!'] },
        { messages: ['But it’s important to ship MVP ASAP'] },
        { from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['I’ll be looking at the process then, just to be sure 🤓'] },
        { messages: ['That’s awesome. Thanks!'] }
    ]);
    const chatEmojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😇', '😉', '😊', '🙂', '🙃', '😋', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '🤪', '😜', '😝', '😛',
        '🤑', '😎', '🤓', '🧐', '🤠', '🥳', '🤗', '🤡', '😏', '😶', '😐', '😑', '😒', '🙄', '🤨', '🤔', '🤫', '🤭', '🤥', '😳', '😞', '😟', '😠', '😡', '🤬', '😔',
        '😟', '😠', '😡', '🤬', '😔', '😕', '🙁', '😬', '🥺', '😣', '😖', '😫', '😩', '🥱', '😤', '😮', '😱', '😨', '😰', '😯', '😦', '😧', '😢', '😥', '😪', '🤤'
    ];
    const onChatKeydown = (event: any) => {
        if (event.key === 'Enter') {
            let message = event.target.value;
            let newChatMessages = [...chatMessages];
            let lastMessage = newChatMessages[newChatMessages.length - 1];
            if (lastMessage.from) {
                newChatMessages.push({ messages: [message] });
                setChatMessages(newChatMessages)
            } else {
                lastMessage.messages.push(message);
                setChatMessages(newChatMessages)
            }
            if (message.match(/primeng|primereact|primefaces|primevue/i)) {
                newChatMessages.push({ from: 'Ioni Bowcher', url: 'assets/demo/images/avatar/ionibowcher.png', messages: ['Always bet on Prime!'] });
                setChatMessages(newChatMessages)
            }
            event.target.value = '';
            const el = chatcontainer.current;
            setTimeout(() => {
                el.scroll({
                    top: el.scrollHeight,
                    behavior: 'smooth'
                });
            }, 1);
        }
    }
    const marker = (item: any) => {
        return (
            <span className="custom-marker p-shadow-2 p-p-2" style={{ backgroundColor: item.color }}>
                <i className={classNames('marker-icon', item.icon)}></i>
            </span>
        );
    };
    const content = (item: any) => {
        return (
            <Card className="p-mb-3" title={item.status} subTitle={item.date}>
                {item.image && <img src={`showcase/demo/images/product/${item.image}`} alt={item.name} width={200} className="p-shadow-2" />}
                <p>{item.description}</p>
            </Card>
        );
    };
    const imageTemplate = (rowData: any, column: any) => {
        var src = "assets/demo/images/product/" + rowData.image;
        return <img src={src} alt={rowData.brand} width="50px" className="p-shadow-4" />;
    }
    const actionTemplate = (rowData: any, column: any) => {
        return (
            <>
                <span className="p-column-title">View</span>
                <Button icon="pi pi-search" type="button" className={classNames('p-button-rounded p-button-text p-mb-1', { 'p-mr-2': !isRTL, 'p-ml-2': isRTL })}></Button>
            </>
        )
    }
    const priceBodyTemplate = (data: any) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(data.price)}
            </>
        );
    };
    const bodyTemplate = (data: any, props: any) => {
        return (
            <>
                <span className="p-column-title">{props.header}</span>
                {data[props.field]}
            </>
        );
    };
    const formatCurrency = (value: any) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };


    // ---------------------- Quản lý phòng trọ ----------------------
    type RoomApiData = {
        code: string;
        electricityPrice: number;
        month: number;
        year: number;
        price: number;
        electricityNumber: number;
        name: string;
        history: {
            electricityNumber1: number;
            electricityNumber: number;
        }
    };

    const ELECTRICITY_API_URL = "https://rtafvndlc6mc6g5apdwzdjduma0sjicv.lambda-url.ap-southeast-2.on.aws/?id=89ce40e7-73e5-4f35-a3e4-22cf836e19ea";

    const [roomData, setRoomData] = useState<RoomApiData[]>([]);

    // số điện hiện tại nhập cho từng phòng
    const [electricityInputs, setElectricityInputs] = useState<Record<string, string>>({
        Phong1: '',
        Phong2: '',
        Phong3: ''
    });

    // nội dung text kết quả cho từng phòng
    const [roomMessages, setRoomMessages] = useState<Record<string, string>>({});
    const [isCalculating, setIsCalculating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const formatVND = (value: number) =>
        value.toLocaleString('vi-VN', { minimumFractionDigits: 0 });

    const handleElectricityInputChange = (code: string, value: string) => {
        setElectricityInputs(prev => ({
            ...prev,
            [code]: value
        }));
    };

    const calculateBills = async () => {
        try {
            setIsCalculating(true);

            let currentRoomData = roomData;

            // Nếu chưa có dữ liệu phòng thì gọi API
            if (!currentRoomData || currentRoomData.length === 0) {
                const { data: { data } } = await httpClient.getMethod(ELECTRICITY_API_URL);
                currentRoomData = data;
                setRoomData(data);
            }

            const messages: Record<string, string> = {};

            currentRoomData.forEach((room: RoomApiData) => {
                const currentInput = electricityInputs[room.code];
                if (!currentInput) {
                    return;
                }

                const currentElectricityNumber = Number(currentInput);
                if (isNaN(currentElectricityNumber)) {
                    return;
                }

                const lastMonthElectricityNumber = room.electricityNumber;
                const usedElectricity = Math.max(0, currentElectricityNumber - lastMonthElectricityNumber);
                const electricityCost = usedElectricity * room.electricityPrice;
                const total = electricityCost + room.price;

                const message =
                    `Phòng của ${room.name} (tháng ${room.month}) tổng tiền trọ hết ${formatVND(total)} đồng.\n` +
                    `Trong đó:\n` +
                    `- Tiền nhà là ${formatVND(room.price)} đồng.\n` +
                    `- Tiền điện ${formatVND(electricityCost)} dùng ${usedElectricity} số điện (tháng này: ${currentElectricityNumber} số) (tháng trước chốt: ${lastMonthElectricityNumber} số).`;

                messages[room.code] = message;
            });

            setRoomMessages(messages);
        } finally {
            setIsCalculating(false);
        }
    };

    const saveData = async () => {
        try {
            setIsSaving(true);

            let currentRoomData = roomData;

            // Nếu chưa có dữ liệu phòng thì gọi API
            if (!currentRoomData || currentRoomData.length === 0) {
                const { data: { data } } = await httpClient.getMethod(ELECTRICITY_API_URL);
                currentRoomData = data;
                setRoomData(data);
            }

            // Kiểm tra xem đã nhập số điện cho tất cả các phòng chưa
            const hasAllInputs = currentRoomData.every((room: RoomApiData) => {
                const input = electricityInputs[room.code];
                return input && !isNaN(Number(input));
            });

            if (!hasAllInputs) {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Cảnh báo',
                    detail: 'Vui lòng nhập số điện cho tất cả các phòng',
                    life: 3000
                });
                return;
            }

            // Chuẩn bị dữ liệu để gửi lên API
            const updatedData = currentRoomData.map((room: RoomApiData) => {
                const currentInput = Number(electricityInputs[room.code]);

                // Tính toán tháng và năm mới
                let newMonth = room.month + 1;
                let newYear = room.year;

                if (newMonth > 12) {
                    newMonth = 1;
                    newYear = newYear + 1;
                }

                // Cập nhật lịch sử: đẩy electricityNumber hiện tại xuống electricityNumber1
                // và giá trị mới vào electricityNumber
                const newHistory = {
                    electricityNumber1: room.history.electricityNumber,
                    electricityNumber: currentInput
                };

                return {
                    ...room,
                    month: newMonth,
                    year: newYear,
                    electricityNumber: currentInput,
                    history: newHistory
                };
            });

            // Lấy dữ liệu đầy đủ từ API response để có age, id, name
            const { data: fullData } = await httpClient.getMethod(ELECTRICITY_API_URL);

            const requestBody = {
                age: fullData.age || 1,
                data: updatedData,
                name: fullData.name || "QuanLyNhaTro"
            };

            // Gọi API PUT để lưu dữ liệu
            await httpClient.putMethod(ELECTRICITY_API_URL, requestBody);

            // Cập nhật state với dữ liệu mới
            setRoomData(updatedData);

            // Hiển thị thông báo thành công
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Đã lưu dữ liệu số điện thành công',
                life: 3000
            });

        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể lưu dữ liệu. Vui lòng thử lại',
                life: 3000
            });
        } finally {
            setIsSaving(false);
        }
    };
    const [captiens, setCaptiens] = React.useState<any[]>([]);

    const [prices, setPrices] = useState<any[]>([]);

    const symbols: SymbolCode[] = [
        "ETH","BTC","SOL","ONDO",
        "GOLD",
        "TESLA","NVIDIA","APPLE","GOOGLE",
        "META","AMAZON","MICROSOFT"
      ];
    

    useEffect(() => {
        const productService = new ProductService();
        productService.getProducts().then(data => setProducts(data));
        ordersOptions = getOrdersOptions();
        setOverviewColors();

        
        fetchPrices(symbols).then(setPrices);
          

        (async () => {
            try {
                setCaptiens([
                    {
                        name: 'ETH',
                    },
                    {
                        name: 'BTC',
                    },
                    {
                        name: 'SOL',
                    },
                    {
                        name: 'ONDO',
                    },
                    {
                        name: 'GOLD',
                    },
                    {
                        name: 'TESLA',
                    },
                    {
                        name: 'NVIDIA',
                    },
                    {
                        name: 'APPLE',
                    },
                    {
                        name: 'GOOGLE',
                    },
                    {
                        name: 'META',
                    },
                    {
                        name: 'AMAZON',
                    },
                    {
                        name: 'MICROSOFT',
                    },
                ]);
            } catch (error) {
            }
        })();


    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const renderFinanceSection = () => {
        return prices.map(item => {
            return <React.Fragment>
                <div className="p-col-12 p-md-6 p-lg-3">
                    <div className="card overview-box p-d-flex p-flex-column p-pt-2">
                        <div className="p-d-flex p-ai-center muted-text">
                            <i className="pi pi-dollar"></i>
                            <h6 className={classNames('p-m-0', { 'p-pl-2': !isRTL, 'p-pr-2': isRTL })}>{item.code}</h6>
                            <div className={classNames({ 'p-ml-auto': !isRTL, 'p-mr-auto': isRTL })}>
                                <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu2.current.toggle(event)}></Button>
                                <Menu ref={menu2} popup model={[{ label: 'Update', icon: 'pi pi-fw pi-refresh' }, { label: 'Edit', icon: 'pi pi-fw pi-pencil' }]}></Menu>
                            </div>
                        </div>
                        <div className="p-d-flex p-jc-between p-mt-3 p-flex-wrap">
                            <div className="p-d-flex p-flex-column" style={{ width: '80px' }}>
                                <span className="p-mb-1 fs-xlarge">${item.price}</span>
                            </div>
                            <div className="p-d-flex p-ai-end">
                                <Chart type="line" data={overviewChartData2} options={overviewChartOptions} height="60px" width="160px"></Chart>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        })
    }


    const phongTro: any = () => {
        return (
            <>
                <h5>Quản lý phòng trọ</h5>
                <div className="p-grid p-formgrid">
                    <div className="p-col-12 p-mb-4 p-lg-4 p-mb-lg-4">
                        <InputText
                            type="number"
                            placeholder="Số điện hiện tại phòng 1"
                            value={electricityInputs.Phong1}
                            onChange={(e) => handleElectricityInputChange('Phong1', e.target.value)}
                        />
                    </div>

                    <div className="p-col-12 p-mb-4 p-lg-4 p-mb-lg-4">
                        <InputText
                            type="number"
                            placeholder="Số điện hiện tại phòng 2"
                            value={electricityInputs.Phong2}
                            onChange={(e) => handleElectricityInputChange('Phong2', e.target.value)}
                        />
                    </div>

                    <div className="p-col-12 p-mb-4 p-lg-4 p-mb-lg-4">
                        <InputText
                            type="number"
                            placeholder="Số điện hiện tại phòng 3"
                            value={electricityInputs.Phong3}
                            onChange={(e) => handleElectricityInputChange('Phong3', e.target.value)}
                        />
                    </div>
                </div>
                <div className="p-col-12">
                    <div className="card">
                    <Button
                            label={"Khởi động"}
                            className="p-mr-2 p-mb-2"
                            onClick={() => {
                                // tải sẵn dữ liệu phòng trọ để sau này tính tiền nhanh hơn
                                (async () => {
                                    try {
                                        const { data: { data } } = await httpClient.getMethod(ELECTRICITY_API_URL);
                                        setRoomData(data);

                                        toast.current?.show({
                                            severity: 'success',
                                            summary: 'Thành công',
                                            detail: 'Khởi động thành công',
                                            life: 3000
                                        });
                                    } catch (error) {
                                        console.error("Không thể tải dữ liệu phòng trọ", error);
                                    }
                                })();
                            }}
                        />
                        <Button
                            label={isCalculating ? "Đang xử lý..." : "Tính toán"}
                            className="p-mr-2 p-mb-2"
                            onClick={calculateBills}
                            disabled={isCalculating || isSaving}
                        />
                        <Button
                            label={isSaving ? "Đang lưu..." : "Lưu lại"}
                            className="p-mr-2 p-mb-2"
                            onClick={saveData}
                            disabled={isCalculating || isSaving}
                        />
                        <h4 style={{ whiteSpace: 'pre-line', userSelect: 'text', cursor: 'text' }}>
                            {roomMessages.Phong1}
                        </h4>
                        <h4 style={{ whiteSpace: 'pre-line', userSelect: 'text', cursor: 'text' }}>
                            {roomMessages.Phong2}
                        </h4>
                        <h4 style={{ whiteSpace: 'pre-line', userSelect: 'text', cursor: 'text' }}>
                            {roomMessages.Phong3}
                        </h4>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <div className="p-grid dashboard">
                {renderFinanceSection()}

                <div className="p-col-12 p-lg-3">
                    <div className="card height-100">
                        <div className="card-header">
                            <h5>Best Sellers</h5>
                            <div>
                                <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu10.current.toggle(event)}></Button>
                                <Menu ref={menu10} popup model={[{ label: 'Update', icon: 'pi pi-fw pi-refresh' }, { label: 'Edit', icon: 'pi pi-fw pi-pencil' }]}></Menu>
                            </div>
                        </div>
                        <ul className="widget-bestsellers">
                            <li>
                                <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                    <img src="assets/demo/images/product/blue-band.jpg" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                    <span>Blue Band</span>
                                    <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                                </div>

                                <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                    <img src="assets/demo/images/product/bracelet.jpg" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                    <span>Bracelet</span>
                                    <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                                </div>

                                <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                    <img src="assets/demo/images/product/black-watch.jpg" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                    <span>Black Watch</span>
                                    <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                                </div>

                                <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                    <img src="assets/demo/images/product/bamboo-watch.jpg" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                    <span>Bamboo Watch</span>
                                    <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                                </div>

                                <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                    <img src="assets/demo/images/product/blue-t-shirt.jpg" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                    <span>Blue T-Shirt</span>
                                    <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                                </div>

                                <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                    <img src="assets/demo/images/product/game-controller.jpg" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                    <span>Game Controller</span>
                                    <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                                </div>

                                <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                    <img src="assets/demo/images/product/gold-phone-case.jpg" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                    <span>Phone Case</span>
                                    <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                                </div>

                                <div className="bestseller-item p-d-flex p-ai-center p-p-3 p-mb-2">
                                    <img src="assets/demo/images/product/purple-t-shirt.jpg" alt="product" className={classNames({ 'p-mr-3': !isRTL, 'p-ml-3': isRTL })} />
                                    <span>Purple T-Shirt</span>
                                    <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="p-col-12 p-lg-9">
                    <div className="card height-100">
                        <div className="card-header">
                            <h5>Chat</h5>
                            <div>
                                <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu8.current.toggle(event)}></Button>
                                <Menu ref={menu8} popup model={[{ label: 'View Media', icon: 'pi pi-fw pi-images' }, { label: 'Starred Messages', icon: 'pi pi-fw pi-star-o' }, { label: 'Search', icon: 'pi pi-fw pi-search' }]}></Menu>
                            </div>
                        </div>
                        <div className="widget-chat">
                            <ul ref={chatcontainer}>
                                {
                                    chatMessages.map((chatMessage, i) => {
                                        const last = i === chatMessages.length - 1;
                                        return <li key={i} className={classNames('p-d-flex p-ai-start', { 'from': chatMessage.from, 'own p-jc-end': !chatMessage.from, 'p-mb-3': !last, 'p-mb-1': last })}>
                                            {chatMessage.url && <img src={chatMessage.url} alt="avatar" className={classNames({ 'p-mr-2': !isRTL, 'p-ml-2': isRTL })} />}
                                            <div className={classNames('messages p-d-flex p-flex-column', { 'p-ai-start': chatMessage.from, 'p-ai-end': !chatMessage.from })}>
                                                {
                                                    chatMessage.messages.map((message, i) => {
                                                        const first = i === 0
                                                        return <span key={i} className={classNames('message', { 'cyan-bgcolor': chatMessage.from, 'pink-bgcolor': !chatMessage.from, 'p-mt-1': !first })}>
                                                            {message}
                                                        </span>
                                                    })
                                                }
                                            </div>
                                        </li>
                                    })
                                }
                            </ul>
                            <div className="p-inputgroup write-message p-mt-3">
                                <span className="p-inputgroup-addon">
                                    <Button type="button" icon="pi pi-plus-circle" className="p-button-text p-button-plain"></Button>
                                </span>
                                <InputText placeholder="Write your message (Hint: 'PrimeReact')" onKeyDown={onChatKeydown} />
                                <span className="p-inputgroup-addon">
                                    <Button type="button" icon="pi pi-video" className="p-button-text p-button-plain"></Button>
                                </span>
                                <span className="p-inputgroup-addon">
                                    <Button type="button" icon="pi pi-clock" className="p-button-text p-button-plain"></Button>
                                    <OverlayPanel ref={op} className="emoji">
                                        {
                                            chatEmojis.map((emoji, i) => {
                                                return <Button key={i} type="button" label={emoji} className="emoji-button p-p-2 p-button-text p-button-plain"></Button>
                                            })
                                        }
                                    </OverlayPanel>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-lg-12">
                    {phongTro()}
                </div>



                <div className="p-col-12 p-lg-6">
                    <div className="card height-100">
                        <div className="card-header">
                            <h5>Contact</h5>
                            <div>
                                <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu5.current.toggle(event)}></Button>
                                <Menu ref={menu5} popup model={[{ label: 'New', icon: 'pi pi-fw pi-plus' }, { label: 'Edit', icon: 'pi pi-fw pi-pencil' }, { label: 'Delete', icon: 'pi pi-fw pi-trash' }]}></Menu>
                            </div>
                        </div>

                        <ul className="widget-list">
                            <li className="p-d-flex p-ai-center p-py-3">
                                <div className="person-item p-d-flex p-ai-center">
                                    <img src="assets/demo/images/avatar/xuxuefeng.png" alt="" />
                                    <div className={classNames({ 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}>
                                        <div>Xuxue Feng</div>
                                        <small className="muted-text">feng@ultima.org</small>
                                    </div>
                                </div>
                                <span className={classNames('person-tag indigo-bgcolor p-p-1 fs-small', { 'p-ml-auto': !isRTL, 'p-mr-auto': isRTL })}>Accounting</span>
                                <span className={classNames('person-tag orange-bgcolor p-p-1 fs-small', { 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}>Sales</span>
                            </li>

                            <li className="p-d-flex p-ai-center p-py-3">
                                <div className="person-item p-d-flex p-ai-center">
                                    <img src="assets/demo/images/avatar/elwinsharvill.png" alt="" />
                                    <div className={classNames({ 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}>
                                        <div>Elwin Sharvill</div>
                                        <small className="muted-text">sharvill@ultima.org</small>
                                    </div>
                                </div>
                                <span className={classNames('person-tag teal-bgcolor p-p-1 fs-small', { 'p-ml-auto': !isRTL, 'p-mr-auto': isRTL })}>Finance</span>
                                <span className={classNames('person-tag orange-bgcolor p-p-1 fs-small', { 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}>Sales</span>
                            </li>

                            <li className="p-d-flex p-ai-center p-py-3">
                                <div className="person-item p-d-flex p-ai-center">
                                    <img src="assets/demo/images/avatar/avatar-1.png" alt="" />
                                    <div className={classNames({ 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}>
                                        <div>Anna Fali</div>
                                        <small className="muted-text">fali@ultima.org</small>
                                    </div>
                                </div>
                                <span className={classNames('person-tag pink-bgcolor p-p-1 fs-small', { 'p-ml-auto': !isRTL, 'p-mr-auto': isRTL })}>Management</span>
                            </li>

                            <li className="p-d-flex p-ai-center p-py-3">
                                <div className="person-item p-d-flex p-ai-center">
                                    <img src="assets/demo/images/avatar/avatar-2.png" alt="" />
                                    <div className={classNames({ 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}>
                                        <div>Jon Stone</div>
                                        <small className="muted-text">stone@ultima.org</small>
                                    </div>
                                </div>
                                <span className={classNames('person-tag pink-bgcolor p-p-1 fs-small', { 'p-ml-auto': !isRTL, 'p-mr-auto': isRTL })}>Management</span>
                                <span className={classNames('person-tag teal-bgcolor p-p-1 fs-small', { 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}>Finance</span>
                            </li>

                            <li className="p-d-flex p-ai-center p-py-3">
                                <div className="person-item p-d-flex p-ai-center">
                                    <img src="assets/demo/images/avatar/avatar-3.png" alt="" />
                                    <div className={classNames({ 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}>
                                        <div>Stephen Shaw</div>
                                        <small className="muted-text">shaw@ultima.org</small>
                                    </div>
                                </div>
                                <span className={classNames('person-tag teal-bgcolor p-p-1 fs-small', { 'p-ml-auto': !isRTL, 'p-mr-auto': isRTL })}>Finance</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="p-col-12 p-lg-6">
                    <div className="card height-100">
                        <div className="card-header">
                            <h5>Order Graph</h5>
                            <div>
                                <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu6.current.toggle(event)}></Button>
                                <Menu ref={menu6} popup model={[{ label: 'Update', icon: 'pi pi-fw pi-refresh' }, { label: 'Edit', icon: 'pi pi-fw pi-pencil' }]}></Menu>
                            </div>
                        </div>
                        <Chart type="line" data={ordersChart} options={ordersOptions}></Chart>
                    </div>
                </div>

                <div className="p-col-12 p-lg-6">
                    <div className="card height-100 widget-timeline">
                        <div className="card-header">
                            <h5>Timeline</h5>
                            <div>
                                <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu7.current.toggle(event)}></Button>
                                <Menu ref={menu7} popup model={[{ label: 'Update', icon: 'pi pi-fw pi-refresh' }, { label: 'Edit', icon: 'pi pi-fw pi-pencil' }]}></Menu>
                            </div>
                        </div>

                        <Timeline value={timelineEvents} align="left" className="customized-timeline" marker={marker} content={content} />
                    </div>
                </div>

                <div className="p-col-12 p-md-12 p-lg-6">
                    <div className="card height-100">
                        <DataTable value={products} paginator rows={8} className="p-datatable-products"
                            selection={selectedProduct} onSelectionChange={(e) => setSelectedProduct(e.value)}>
                            <Column header="Image" body={imageTemplate} style={{ width: '5rem' }} />
                            <Column field="name" body={bodyTemplate} header="Name" sortable />
                            <Column field="category" body={bodyTemplate} header="Category" sortable />
                            <Column field="price" body={priceBodyTemplate} header="Price" sortable />
                            <Column header="View" body={actionTemplate} style={{ width: '4rem' }} />
                        </DataTable>
                    </div>
                </div>


                <div className="p-col-12 p-lg-3">
                    <div className="card height-100">
                        <div className="card-header">
                            <h5>Activity</h5>
                            <div>
                                <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu9.current.toggle(event)}></Button>
                                <Menu ref={menu9} popup model={[{ label: 'Update', icon: 'pi pi-fw pi-refresh' }, { label: 'Edit', icon: 'pi pi-fw pi-pencil' }]}></Menu>
                            </div>
                        </div>

                        <ul className="widget-activity">
                            <li>
                                <div className="activity-item p-d-flex p-flex-column">
                                    <div className="activity-title p-mb-1">Income</div>
                                    <div className="activity-subtext p-mb-2">30 November, 16.20</div>
                                    <ProgressBar value="50" showValue={false}></ProgressBar>
                                </div>
                            </li>
                            <li>
                                <div className="activity-item p-d-flex p-flex-column">
                                    <div className="activity-title p-mb-1">Tax</div>
                                    <div className="activity-subtext p-mb-2">1 December, 15.27</div>
                                    <ProgressBar value="15" showValue={false}></ProgressBar>
                                </div>
                            </li>
                            <li>
                                <div className="activity-item p-d-flex p-flex-column">
                                    <div className="activity-title p-mb-1">Invoices</div>
                                    <div className="activity-subtext p-mb-2">1 December, 15.28</div>
                                    <ProgressBar value="78" showValue={false}></ProgressBar>
                                </div>
                            </li>
                            <li>
                                <div className="activity-item p-d-flex p-flex-column">
                                    <div className="activity-title p-mb-1">Expanses</div>
                                    <div className="activity-subtext p-mb-2">3 December, 09.15</div>
                                    <ProgressBar value="66" showValue={false}></ProgressBar>
                                </div>
                            </li>
                            <li>
                                <div className="activity-item p-d-flex p-flex-column">
                                    <div className="activity-title p-mb-1">Bonus</div>
                                    <div className="activity-subtext p-mb-2">1 December, 23.55</div>
                                    <ProgressBar value="85" showValue={false}></ProgressBar>
                                </div>
                            </li>
                            <li>
                                <div className="activity-item p-d-flex p-flex-column">
                                    <div className="activity-title p-mb-1">Revenue</div>
                                    <div className="activity-subtext p-mb-2">30 November, 16.20</div>
                                    <ProgressBar value="54" showValue={false}></ProgressBar>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>


            </div>
            <Toast ref={toast} />
        </>

    )
}
