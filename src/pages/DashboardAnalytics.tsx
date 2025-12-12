import React, { useContext, useEffect, useRef, useState } from 'react';
import { classNames } from 'primereact/utils';
import { Menu } from 'primereact/menu';
import { ProgressBar } from 'primereact/progressbar';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import ProductService from '../service/ProductService';
import { RTLContext } from '../App';
import { InputText } from 'primereact/inputtext';
import httpClient from '../utils/htttpClient';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';

const storeAData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
    datasets: [{
        data: [55, 3, 45, 6, 44, 58, 84, 68, 64],
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

const storeBData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
    datasets: [{
        data: [81, 75, 63, 100, 69, 79, 38, 37, 76],
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

const storeCData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
    datasets: [{
        data: [99, 55, 22, 72, 24, 79, 35, 91, 48],
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

const getColors = (colorMode: string) => {
    const isLight = colorMode === 'light';
    return {
        pinkColor: isLight ? '#EC407A' : '#F48FB1',
        purpleColor: isLight ? '#AB47BC' : '#CE93D8',
        deeppurpleColor: isLight ? '#7E57C2' : '#B39DDB',
        indigoColor: isLight ? '#5C6BC0' : '#9FA8DA',
        blueColor: isLight ? '#42A5F5' : '#90CAF9',
        lightblueColor: isLight ? '#29B6F6' : '#81D4FA',
        cyanColor: isLight ? '#00ACC1' : '#4DD0E1',
        tealColor: isLight ? '#26A69A' : '#80CBC4',
        greenColor: isLight ? '#66BB6A' : '#A5D6A7',
        lightgreenColor: isLight ? '#9CCC65' : '#C5E1A5',
        limeColor: isLight ? '#D4E157' : '#E6EE9C',
        yellowColor: isLight ? 'FFEE58' : '#FFF59D',
        amberColor: isLight ? '#FFCA28' : '#FFE082',
        orangeColor: isLight ? '#FFA726' : '#FFCC80',
        deeporangeColor: isLight ? '#FF7043' : '#FFAB91',
        brownColor: isLight ? '#8D6E63' : '#BCAAA4'
    }
}

const getPieData = (colorMode: string) => {
    const { limeColor, blueColor, tealColor } = getColors(colorMode);
    const borderColor = getComputedStyle(document.body).getPropertyValue('--divider-color') || 'rgba(160, 167, 181, .3)';
    return {
        labels: ['O', 'D', 'R'],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: [
                    blueColor,
                    tealColor,
                    limeColor
                ],
                borderColor
            }
        ]
    }
}

const getPieOptions = () => {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-color') || 'rgba(0, 0, 0, 0.87)';
    const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-family');
    return {
        aspectRatio: 1,
        legend: {
            position: 'top',
            labels: {
                fontFamily,
                color: textColor
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };
}

const getChartData = (colorMode: string) => {
    const { limeColor, amberColor, orangeColor, blueColor, lightblueColor,
        cyanColor, tealColor, greenColor, lightgreenColor } = getColors(colorMode);

    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: '2012',
                data: [6, 25, 97, 12, 7, 70, 42],
                borderColor: blueColor,
                backgroundColor: blueColor,
                borderWidth: 2,
                fill: true
            },
            {
                label: '2013',
                data: [81, 3, 5, 11, 59, 47, 99],
                borderColor: lightblueColor,
                backgroundColor: lightblueColor,
                borderWidth: 2,
                fill: true
            },
            {
                label: '2014',
                data: [68, 47, 46, 46, 61, 70, 94],
                borderColor: cyanColor,
                backgroundColor: cyanColor,
                borderWidth: 2,
                fill: true
            },
            {
                label: '2015',
                data: [31, 9, 18, 76, 6, 11, 79],
                borderColor: tealColor,
                backgroundColor: tealColor,
                borderWidth: 2,
                fill: true
            },
            {
                label: '2016',
                data: [85, 37, 47, 29, 2, 10, 54],
                borderColor: greenColor,
                backgroundColor: greenColor,
                borderWidth: 2,
                fill: true
            },
            {
                label: '2017',
                data: [28, 48, 40, 19, 86, 27, 90],
                borderColor: lightgreenColor,
                backgroundColor: lightgreenColor,
                borderWidth: 2,
                fill: true
            },
            {
                label: '2018',
                data: [89, 18, 95, 18, 97, 61, 54],
                borderColor: limeColor,
                backgroundColor: limeColor,
                borderWidth: 2,
                fill: true
            },
            {
                label: '2019',
                data: [18, 36, 39, 58, 41, 50, 72],
                borderColor: amberColor,
                backgroundColor: amberColor,
                borderWidth: 2,
                fill: true
            },
            {
                label: '2020',
                data: [31, 4, 35, 74, 47, 35, 46],
                borderColor: orangeColor,
                backgroundColor: orangeColor,
                borderWidth: 2,
                fill: true
            }
        ]
    };
}

const getChartOptions = () => {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-color') || 'rgba(0, 0, 0, 0.87)';
    const gridLinesColor = getComputedStyle(document.body).getPropertyValue('--divider-color') || 'rgba(160, 167, 181, .3)';
    const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-family');
    return {
        maintainAspectRatio: false,
        aspectRatio: .8,
        plugins: {
            legend: {
                display: true,
                labels: {
                    fontFamily,
                    color: textColor
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
                categoryPercentage: .9,
                barPercentage: .8,
                ticks: {
                    fontFamily,
                    color: textColor
                },
                grid: {
                    color: gridLinesColor
                }
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    }
}

const getDoughnutData = (colorMode: string) => {
    const { blueColor, lightblueColor, cyanColor, tealColor, greenColor,
        lightgreenColor, orangeColor } = getColors(colorMode);
    const borderColor = getComputedStyle(document.body).getPropertyValue('--divider-color') || 'rgba(160, 167, 181, .3)';

    return {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [
            {
                data: [11, 29, 71, 33, 28, 95, 6],
                backgroundColor: [blueColor, lightblueColor, cyanColor, tealColor, greenColor, lightgreenColor, orangeColor],
                borderColor
            }
        ]
    };
}

const getDoughnutOptions = () => {
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-color') || 'rgba(0, 0, 0, 0.87)';
    const fontFamily = getComputedStyle(document.body).getPropertyValue('--font-family');
    return {
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    fontFamily,
                    color: textColor
                }
            },
        },
        cutout: '50%'
    };
}

let chartMonthlyData: any;
let chartMonthlyOptions: any;
let doughnutData: any;
let doughnutOptions: any;
let pieData: any;
let pieOptions: any;
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
export const DashboardAnalytics = (props: any) => {

let ordersOptions = getOrdersOptions();
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
    const chart1 = useRef<any>(null);


        const menu5 = useRef<any>(null);
        const menu6 = useRef<any>(null);
        const menu7 = useRef<any>(null);
    
        const menu9 = useRef<any>(null);
    
        const op = useRef<any>(null);

    const [products, setProducts] = useState<any>(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
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
    const isRTL = useContext(RTLContext)
    const bar = useRef<any>(null);
    const doughnut = useRef<any>(null);
    const storeA = useRef<any>(null);
    const storeB = useRef<any>(null);
    const storeC = useRef<any>(null);
    const storeD = useRef<any>(null);
    const pie = useRef<any>(null);
    const menu11 = useRef<any>(null);
    const menu12 = useRef<any>(null);
    const menu13 = useRef<any>(null);

    const [storeATotalValue, setStoreATotalValue] = useState<number>(100);
    const [storeADiff, setStoreADiff] = useState<number>(0);

    const [storeBTotalValue, setStoreBTotalValue] = useState<number>(120);
    const [storeBDiff, setStoreBDiff] = useState<number>(0);

    const [storeCTotalValue, setStoreCTotalValue] = useState<number>(150);
    const [storeCDiff, setStoreCDiff] = useState<number>(0);

    const [storeDTotalValue, setStoreDTotalValue] = useState<number>(80);
    const [storeDDiff, setStoreDDiff] = useState<number>(0);

    const calculateStore = (storeData: any, totalValue: number) => {
        let randomNumber = +((Math.random() * 500).toFixed(2));
        let data = storeData.datasets[0].data;
        let length = data.length;
        data.push(randomNumber);
        data.shift();

        let diff = +((data[length - 1] - data[length - 2]).toFixed(2));
        let status = diff === 0 ? 0 : (diff > 0 ? 1 : -1);
        totalValue = +((totalValue + diff).toFixed(2));

        storeA.current.chart.update();
        storeB.current.chart.update();
        storeC.current.chart.update();
        storeD.current.chart.update();

        return { diff, totalValue, status };
    }



   

    useEffect(() => {
        if (props.isNewThemeLoaded) {
            ordersOptions = getOrdersOptions();
            props.onNewThemeChange(false);
        }
    }, [props.isNewThemeLoaded, props.onNewThemeChange]); // eslint-disable-line react-hooks/exhaustive-deps
    

    useEffect(() => {
        const productService = new ProductService();
                productService.getProducts().then(data => setProducts(data));
        
        productService.getProducts().then(data => setProducts(data));
        chartMonthlyData = getChartData(props.colorMode);
        chartMonthlyOptions = getChartOptions();
        doughnutData = getDoughnutData(props.colorMode);
        doughnutOptions = getDoughnutOptions();
        pieData = getPieData(props.colorMode);
        pieOptions = getPieOptions();

        let storeInterval = setInterval(() => {
            let { diff: _storeADiff, totalValue: _storeATotalValue } = calculateStore(storeAData, storeATotalValue);
            setStoreADiff(_storeADiff);
            setStoreATotalValue(_storeATotalValue);
            storeA.current.chart.update();

            let { diff: _storeBDiff, totalValue: _storeBTotalValue } = calculateStore(storeBData, storeBTotalValue);
            setStoreBDiff(_storeBDiff);
            setStoreBTotalValue(_storeBTotalValue);
            storeB.current.chart.update();

            let { diff: _storeCDiff, totalValue: _storeCTotalValue } = calculateStore(storeCData, storeCTotalValue);
            setStoreCDiff(_storeCDiff)
            setStoreCTotalValue(_storeCTotalValue);
            storeC.current.chart.update();

            let { diff: _storeDDiff, totalValue: _storeDTotalValue } = calculateStore(storeDData, storeDTotalValue);
            setStoreDDiff(_storeDDiff);
            setStoreDTotalValue(_storeDTotalValue);
            storeD.current.chart.update();
        }, 2000)

        return () => {
            clearInterval(storeInterval);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (props.isNewThemeLoaded) {
            chartMonthlyData = getChartData(props.colorMode);
            chartMonthlyOptions = getChartOptions();
            doughnutData = getDoughnutData(props.colorMode);
            doughnutOptions = getDoughnutOptions();
            pieData = getPieData(props.colorMode);
            pieOptions = getPieOptions();
            props.onNewThemeChange(false);
        }
    }, [props.isNewThemeLoaded, props.onNewThemeChange]); // eslint-disable-line react-hooks/exhaustive-deps

    const imageTemplate = (rowData: any, column: any) => {
        var src = "assets/demo/images/product/" + rowData.image;
        return <img src={src} alt={rowData.brand} width="50px" className="p-shadow-4" />;
    }

    const formatCurrency = (value: any) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };


    const actionTemplate = (rowData: any, column: any) => {
        return (
            <>
                <span className="p-column-title">View</span>
                <Button icon="pi pi-search" type="button" className={classNames('p-button-rounded p-button-text p-mb-1', { 'p-mr-2': !isRTL, 'p-ml-2': isRTL })}></Button>
            </>
        )
    }



    const bodyTemplate = (data: any, props: any) => {
        return (
            <>
                <span className="p-column-title">{props.header}</span>
                {data[props.field]}
            </>
        );
    };

    const changeMonthlyDataView = () => {
        if (bar.current.chart.options.scales.x.stacked) {
            bar.current.chart.options.scales.x.stacked = false;
            bar.current.chart.options.scales.y.stacked = false;
        }
        else {
            bar.current.chart.options.scales.x.stacked = true;
            bar.current.chart.options.scales.y.stacked = true;
        }

        bar.current.chart.update();
    }

    const changeDoughnutDataView = () => {
        if (doughnut.current.chart.options.cutout) {
            doughnut.current.chart.options.cutout = 0;
        }
        else {
            doughnut.current.chart.options.cutout = '50%';
        }


        doughnut.current.chart.update();
    }

    const togglePieDoughnut = () => {
        pie.current.chart.options.cutout = pie.current.chart.options.cutout ? 0 : 50;
        pie.current.chart.update();
    }

    const changePieDoughnutDataView = () => {
        if (pie.current.chart.options.circumference === 180) {
            pie.current.chart.options.circumference = 2 * 180;
            pie.current.chart.options.rotation = -90 / 2;
        } else {
            pie.current.chart.options.circumference = 180;
            pie.current.chart.options.rotation = -90;
        }

        pie.current.chart.update();
    }

    const priceBodyTemplate = (data: any) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(data.price)}
            </>
        );
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
                const { data } = await httpClient.getRawMethod(ELECTRICITY_API_URL);
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
    const toast = useRef<any>(null);
    const saveData = async () => {
        try {
            setIsSaving(true);

            let currentRoomData = roomData;

            // Nếu chưa có dữ liệu phòng thì gọi API
            if (!currentRoomData || currentRoomData.length === 0) {
                const { data } = await httpClient.getRawMethod(ELECTRICITY_API_URL);
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
            const fullData = await httpClient.getRawMethod(ELECTRICITY_API_URL);

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
                                        const { data } = await httpClient.getRawMethod(ELECTRICITY_API_URL);

                                        console.log("Dữ liệu phòng trọ đã được tải:", data);

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

const timelineEvents = [
        { status: 'Ordered', date: '15/10/2020 10:30', icon: "pi pi-shopping-cart", color: '#E91E63', description: "Richard Jones (C8012) has ordered a blue t-shirt for $79." },
        { status: 'Processing', date: '15/10/2020 14:00', icon: "pi pi-cog", color: '#FB8C00', description: "Order #99207 has processed succesfully." },
        { status: 'Shipped', date: '15/10/2020 16:15', icon: "pi pi-compass", color: '#673AB7', description: "Order #99207 has shipped with shipping code 2222302090." },
        { status: 'Delivered', date: '16/10/2020 10:00', icon: "pi pi-check-square", color: '#0097A7', description: "Richard Jones (C8012) has recieved his blue t-shirt." }
    ];

    return (
        <div className="p-grid dashboard">


            <div className="p-col-12 p-lg-12">
                {phongTro()}
            </div>




            <div className="p-col-12 p-md-8">
                <div className="card height-100">
                    <div className="card-header">
                        <h5>Monthly Comparison</h5>
                        <Button type="button" label="Vertical/Stacked Data" className={classNames('p-button-text', { 'p-ml-auto': !isRTL, 'p-mr-auto': isRTL })} onClick={changeMonthlyDataView}></Button>
                    </div>

                    <Chart ref={bar} type="bar" data={chartMonthlyData} options={chartMonthlyOptions} height="400px"></Chart>
                </div>
            </div>

            <div className="p-col-12 p-md-4">
                <div className="card widget-insights height-100">
                    <div className="card-header p-mb-2">
                        <h5>Insights</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu11.current.toggle(event)}></Button>
                            <Menu ref={menu11} popup={true} model={[{ label: 'Update', icon: 'pi pi-fw pi-refresh' }, { label: 'Edit', icon: 'pi pi-fw pi-pencil' }]}></Menu>
                        </div>
                    </div>
                    <div className="card-subheader p-mb-2 p-d-flex p-ai-center">
                        <span>November 22 - November 29</span>
                        <Button type="button" label="Semi/Full Data" className={classNames('p-button-text', { 'p-ml-auto': !isRTL, 'p-mr-auto': isRTL })} onClick={changeDoughnutDataView}></Button>
                    </div>
                    <div className="p-d-flex p-jc-center">
                        <Chart style={{ position: 'relative', height: '50%' }} ref={doughnut} type="doughnut" data={doughnutData} options={doughnutOptions} ></Chart >
                    </div>
                    <div className="p-d-flex p-flex-column p-jc-center">
                        <div className="p-d-flex p-flex-row p-ai-center p-mt-4 p-px-3">
                            <i className="pi pi-thumbs-up p-p-3 rounded-circle lightgreen-bgcolor solid-surface-text-color"></i>
                            <div className={classNames('p-d-flex p-flex-column', { 'p-ml-3': !isRTL, 'p-mr-3': isRTL })}>
                                <span>Best Day of the Week</span>
                                <small>Friday</small>
                            </div>
                            <span className={classNames('indigo-color', { 'p-ml-auto': !isRTL, 'p-mr-auto': isRTL })}>95</span>
                        </div>
                        <div className="p-d-flex p-flex-row p-ai-center p-my-4 p-px-3">
                            <i className="pi pi-thumbs-down rounded-circle p-p-3 orange-bgcolor solid-surface-text-color"></i>
                            <div className={classNames('p-d-flex p-flex-column', { 'p-ml-3': !isRTL, 'p-mr-3': isRTL })}>
                                <span>Worst Day of the Week</span>
                                <small>Saturday</small>
                            </div>
                            <span className={classNames('indigo-color', { 'p-ml-auto': !isRTL, 'p-mr-auto': isRTL })} > 6</span >
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-col-12 p-md-4">
                <div className="card widget-social">
                    <div className="p-d-flex p-jc-between p-ai-center p-p-3">
                        <div className="social-icon">
                            <i className="pi pi-twitter blue-color fs-xxlarge"></i>
                        </div>
                        <div className="info p-d-flex p-flex-column">
                            <span className="value">44.995</span>
                            <span className="subtext p-mt-2">Retweets</span>
                        </div>
                    </div>

                    <div className="stats p-d-flex p-jc-between p-mt-3">
                        <div className="left p-d-flex p-flex-column ">
                            <span className="title">Target</span>
                            <span className="value p-mb-2">10.000</span>
                            <ProgressBar value="50" showValue={false}></ProgressBar>
                        </div>
                        <div className="right p-d-flex p-flex-column">
                            <span className="title">All Time Record</span>
                            <span className="value p-mb-2">50.702</span>
                            <ProgressBar value="24" showValue={false}></ProgressBar>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-col-12 p-md-4">
                <div className="card widget-social">
                    <div className="p-d-flex p-jc-between p-ai-center p-p-3">
                        <div className="social-icon">
                            <i className="pi pi-facebook indigo-color fs-xxlarge"></i>
                        </div>
                        <div className="info p-d-flex p-flex-column">
                            <span className="value">44.995</span>
                            <span className="subtext p-mt-2">Facebook Interactions</span>
                        </div>
                    </div>

                    <div className="stats p-d-flex p-jc-between p-mt-3">
                        <div className="left p-d-flex p-flex-column ">
                            <span className="title">Target</span>
                            <span className="value p-mb-2">10.000</span>
                            <ProgressBar value="23" showValue={false}></ProgressBar>
                        </div>
                        <div className="right p-d-flex p-flex-column">
                            <span className="title">All Time Record</span>
                            <span className="value p-mb-2">99.028</span>
                            <ProgressBar value="38" showValue={false}></ProgressBar>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-col-12 p-md-4">
                <div className="card widget-social">
                    <div className="p-d-flex p-jc-between p-ai-center p-p-3">
                        <div className="social-icon">
                            <i className="pi pi-github text-color fs-xxlarge"></i>
                        </div>
                        <div className="info p-d-flex p-flex-column">
                            <span className="value">81.002</span>
                            <span className="subtext p-mt-2">Star</span>
                        </div>
                    </div>

                    <div className="stats p-d-flex p-jc-between p-mt-3">
                        <div className="left p-d-flex p-flex-column ">
                            <span className="title">Target</span>
                            <span className="value p-mb-2">10.000</span>
                            <ProgressBar value="62" showValue={false}></ProgressBar>
                        </div>
                        <div className="right p-d-flex p-flex-column">
                            <span className="title">All Time Record</span>
                            <span className="value p-mb-2">162.550</span>
                            <ProgressBar value="14" showValue={false}></ProgressBar>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-col-12 p-md-12">
                <div className="card p-grid p-nogutter widget-sales p-d-block p-d-sm-flex">
                    <div className="p-lg-3 p-md-6 p-sm-12 p-p-0">
                        <div className="sales-info p-d-flex p-flex-column p-p-4">
                            <span className="muted-text">Store A Sales</span>
                            <span className="fs-large p-mt-2">
                                {storeADiff !== 0 && <i className={classNames('fw-700 fs-large pi', { 'p-pr-1': !isRTL, 'p-pl-1': isRTL, 'pi-arrow-up green-color': storeADiff > 0, 'pi-arrow-down pink-color': storeADiff < 0 })}></i>}
                                ${storeATotalValue}
                                {storeADiff !== 0 && <span className={classNames('fw-500 fs-normal', { 'p-ml-1': !isRTL, 'p-mr-1': isRTL, 'green-color': storeADiff > 0, 'pink-color': storeADiff < 0 })}>
                                    {storeADiff > 0 ? '+' : ''}{storeADiff}
                                </span>}
                            </span>
                        </div>
                        <div className="p-px-4">
                            <Chart ref={storeA} type="line" data={storeAData} options={storeOptions}></Chart>
                        </div>
                    </div>
                    <div className="p-lg-3 p-md-6 p-sm-12 p-p-0">
                        <div className="sales-info p-d-flex p-flex-column p-p-4">
                            <span className="muted-text">Store B Sales</span>
                            <span className="fs-large p-mt-2">
                                {storeBDiff !== 0 && <i className={classNames('fw-700 fs-large pi', { 'p-pr-1': !isRTL, 'p-pl-1': isRTL, 'pi-arrow-up green-color': storeBDiff > 0, 'pi-arrow-down pink-color': storeBDiff < 0 })}></i>}
                                ${storeBTotalValue}
                                {storeBDiff !== 0 && <span className={classNames('fw-500 fs-normal', { 'p-ml-1': !isRTL, 'p-mr-1': isRTL, 'green-color': storeBDiff > 0, 'pink-color': storeBDiff < 0 })}>
                                    {storeBDiff > 0 ? '+' : ''}{storeBDiff}
                                </span>}
                            </span>
                        </div>
                        <div className="p-px-4">
                            <Chart ref={storeB} type="line" data={storeBData} options={storeOptions}></Chart>
                        </div>
                    </div>
                    <div className="p-lg-3 p-md-6 p-sm-12 p-p-0">
                        <div className="sales-info p-d-flex p-flex-column p-p-4">
                            <span className="muted-text">Store C Sales</span>
                            <span className="fs-large p-mt-2">
                                {storeCDiff !== 0 && <i className={classNames('fw-700 fs-large pi', { 'p-pr-1': !isRTL, 'p-pl-1': isRTL, 'pi-arrow-up green-color': storeCDiff > 0, 'pi-arrow-down pink-color': storeCDiff < 0 })}></i>}
                                ${storeCTotalValue}
                                {storeCDiff !== 0 && <span className={classNames('fw-500 fs-normal', { 'p-ml-1': !isRTL, 'p-mr-1': isRTL, 'green-color': storeCDiff > 0, 'pink-color': storeCDiff < 0 })}>
                                    {storeCDiff > 0 ? '+' : ''}{storeCDiff}
                                </span>}
                            </span>
                        </div>
                        <div className="p-px-4">
                            <Chart ref={storeC} type="line" data={storeCData} options={storeOptions}></Chart>
                        </div>
                    </div>
                    <div className="p-lg-3 p-md-6 p-sm-12 p-p-0">
                        <div className="sales-info p-d-flex p-flex-column p-p-4">
                            <span className="muted-text">Store D Sales</span>
                            <span className="fs-large p-mt-2">
                                {storeDDiff !== 0 && <i className={classNames('fw-700 fs-large pi', { 'p-pr-1': !isRTL, 'p-pl-1': isRTL, 'pi-arrow-up green-color': storeDDiff > 0, 'pi-arrow-down pink-color': storeDDiff < 0 })}></i>}
                                ${storeDTotalValue}
                                {storeDDiff !== 0 && <span className={classNames('fw-500 fs-normal', { 'p-ml-1': !isRTL, 'p-mr-1': isRTL, 'green-color': storeDDiff > 0, 'pink-color': storeDDiff < 0 })}>
                                    {storeDDiff > 0 ? '+' : ''}{storeDDiff}
                                </span>}
                            </span>
                        </div>
                        <div className="p-px-4">
                            <Chart ref={storeD} type="line" data={storeDData} options={storeOptions}></Chart>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-col-12 p-md-6">
                <div className="card height-100 widget-topsearchs">
                    <div className="card-header">
                        <h5>Top Searchs</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu12.current.toggle(event)}></Button>
                            <Menu ref={menu12} popup={true} model={[{ label: 'Update', icon: 'pi pi-fw pi-refresh' }, { label: 'Edit', icon: 'pi pi-fw pi-pencil' }]}></Menu>
                        </div>
                    </div>
                    <div className="p-d-flex p-jc-between item">
                        <span>Mat Orange Case</span>
                        <span className="value type-green">82% CONV RATE</span>
                    </div>
                    <div className="p-d-flex p-jc-between item">
                        <span>Space T-Shirt</span>
                        <span className="value type-green">78% CONV RATE</span>
                    </div>
                    <div className="p-d-flex p-jc-between item">
                        <span>Orange Black Hoodie</span>
                        <span className="value type-green">61% CONV RATE</span>
                    </div>
                    <div className="p-d-flex p-jc-between item">
                        <span>Wonders Notebook</span>
                        <span className="value type-yellow">48 CONV RATE</span>
                    </div>
                    <div className="p-d-flex p-jc-between item">
                        <span>Robots T-Shirt</span>
                        <span className="value type-yellow">34% CONV RATE</span>
                    </div>
                    <div className="p-d-flex p-jc-between item">
                        <span>Green Portal Sticker</span>
                        <span className="value type-pink">11% CONV RATE</span>
                    </div>
                </div>
            </div>

            <div className="p-col-12 p-md-6">
                <div className="card">
                    <DataTable value={products} className="p-datatable-products" paginator={true} rows={4}
                        selection={selectedProduct} onSelectionChange={(e) => setSelectedProduct(e.value)}>
                        <Column header="Image" body={imageTemplate} style={{ width: '5rem' }} />
                        <Column field="name" body={bodyTemplate} header="Name" sortable />
                        <Column field="category" body={bodyTemplate} header="Category" sortable />
                        <Column field="price" header="Price" sortable body={priceBodyTemplate} />
                        <Column header="View" body={actionTemplate} style={{ width: '4rem' }} />
                    </DataTable>
                </div>
            </div>

            <div className="p-col-12 p-md-4">
                <div className="card widget-expenses">
                    <div className="card-header">
                        <h5>Expenses</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-h" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu13.current.toggle(event)}></Button>
                            <Menu ref={menu13} popup={true} model={[{ label: 'Update', icon: 'pi pi-fw pi-refresh' }, { label: 'Edit', icon: 'pi pi-fw pi-pencil' }]}></Menu>
                        </div>
                    </div>
                    <div className="card-subheader p-mb-2 p-pb-3">
                        November 22 - November 29
                    </div>

                    <div className="p-d-flex p-jc-between p-ai-center p-my-2 item">
                        <div className="p-d-flex p-flex-column">
                            <i className="pi pi-cloud type p-mb-2"></i>
                            <span className="value p-mb-1">$30.247</span>
                            <span className="subtext">Cloud Infrastructure</span>
                        </div>
                        <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                    </div>
                    <div className="p-d-flex p-jc-between p-ai-center p-my-2 item">
                        <div className="p-d-flex p-flex-column">
                            <i className="pi pi-tag type p-mb-2"></i>
                            <span className="value p-mb-1">$29.550</span>
                            <span className="subtext">General Goods</span>
                        </div>
                        <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                    </div>
                    <div className="p-d-flex p-jc-between p-ai-center p-my-2 item">
                        <div className="p-d-flex p-flex-column">
                            <i className="pi pi-desktop type p-mb-2"></i>
                            <span className="value p-mb-1">$16.660</span>
                            <span className="subtext">Consumer Electronics</span>
                        </div>
                        <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                    </div>
                    <div className="p-d-flex p-jc-between p-ai-center p-my-2 item">
                        <div className="p-d-flex p-flex-column">
                            <i className="pi pi-compass type p-mb-2"></i>
                            <span className="value p-mb-1">$5.801</span>
                            <span className="subtext">Incalculables</span>
                        </div>
                        <span className="item-button"><button className="p-link"><i className="pi pi-chevron-right"></i></button></span>
                    </div>
                </div>
            </div>

            <div className="p-col-12 p-md-8">
                <div className="card widget-traffic height-100">
                    <div className="card-header">
                        <h5>All Traffic Channels</h5>
                        <Button type="button" label="Pie/Doughnut Data" className={classNames('p-button-text', { 'p-ml-auto': !isRTL, 'p-mr-auto': isRTL })} onClick={() => togglePieDoughnut()}></Button>
                        <Button type="button" label="Semi/Full Data" className="p-button-text p-mx-2" onClick={changePieDoughnutDataView}></Button>
                    </div>
                    <div className="p-d-flex p-grid">
                        <div className="p-col-12 p-md-6 left p-d-flex p-flex-column p-jc-evenly">
                            <div className="total p-d-flex p-flex-column">
                                <span className="title p-mb-2">Total</span>
                                <span className="value p-mb-5">66.761</span>
                            </div>

                            <div className="info p-d-flex p-jc-between">
                                <div className="organic p-d-flex p-flex-column">
                                    <span className="title p-mb-1">Organic</span>
                                    <span className="value">51.596</span>
                                </div>
                                <div className="direct p-d-flex p-flex-column">
                                    <span className="title p-mb-1">Direct</span>
                                    <span className="value">11.421</span>
                                </div>
                                <div className="referral p-d-flex p-flex-column">
                                    <span className="title p-mb-1">Referral</span>
                                    <span className="value">3.862</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-6 right p-d-flex p-jc-center">
                            <Chart ref={pie} type="pie" data={pieData} options={pieOptions}></Chart>
                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />


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

    )
}
