import React from 'react';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Button } from "primereact/button";

export const TimelineDemo = () => {

	const events1 = [
		{ status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
		{ status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
		{ status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
		{ status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
	];

	const events2 = [
		'2020', '2021', '2022', '2023'
	];

	const customizedMarker = (item: any) => {
		return (
			<span className="custom-marker p-shadow-2" style={{ backgroundColor: item.color }}>
				<i className={item.icon}></i>
			</span>
		);
	};

	const customizedContent = (item: any) => {
		return (
			<Card title={item.status} subTitle={item.date}>
				{ item.image && <img src={`assets/demo/images/product/${item.image}`} alt={item.name} width={200} className="p-shadow-2" />}
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
					quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p>
				<Button label="Read more" className="p-button-text"></Button>
			</Card>
		);
	};

	return (
		<div className="p-grid">
			<div className="p-col-12">
				<div className="card">
					<h4>Timeline</h4>

					<h5>Custom Timeline</h5>
					<Timeline value={events1} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />

					<h5 style={{marginTop: '5em'}}>Horizontal - Alternate Align</h5>
					<Timeline value={events2} layout="horizontal" align="alternate" content={(item) => item} opposite={() => <span>&nbsp;</span>} />
				</div>
			</div>
		</div>
	)
}