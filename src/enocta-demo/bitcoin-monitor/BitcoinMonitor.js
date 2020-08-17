import React, {Component} from 'react';
import './BitcoinMonitor.css'
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import moment from "moment";

class BitcoinMonitor extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentBitcoinInfo: null
		}
	}

	componentDidMount() {
		this.getInfo(true);

		this.interval = setInterval( () => {
			this.getInfo(false);
		}, 10000);
	}

	getInfo(isInitial) {
		let self = this;
		let {currentBitcoinInfo} = this.state;

		axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
				.then(function (response) {

					let res = response.data;

					if (!isInitial) {
						for (let key in currentBitcoinInfo.bpi) {
							if (currentBitcoinInfo.bpi.hasOwnProperty(key)) {
								console.log(currentBitcoinInfo.bpi[key])
								if (res.bpi[key].rate_float > currentBitcoinInfo.bpi[key].rate_float) {
									res.bpi[key].direction = 'up';
								} else if (res.bpi[key].rate_float < currentBitcoinInfo.bpi[key].rate_float) {
									res.bpi[key].direction = 'down';
								} else {
									res.bpi[key].direction = '-';
								}
							}
						}
					}

					self.setState({
						currentBitcoinInfo: res
					})
				})
				.catch(function (error) {
					console.log(error);
				})
				.finally(function () {
				});
	}

	componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	render() {

		const {currentBitcoinInfo} = this.state;

		return (
				<div className="main-container">
					<div className='currency-monitor'>
						<div className='monitor-header'>
							{!currentBitcoinInfo ?
									<div className="lds-spinner">
										<div></div>
										<div></div>
										<div></div>
										<div></div>
										<div></div>
										<div></div>
										<div></div>
										<div></div>
										<div></div>
										<div></div>
										<div></div>
										<div></div>
									</div>

									:

									<div className='header-info'>
										<div style={{width: '50%', paddingTop: '10px'}}>
											{!currentBitcoinInfo.chartName

													?

													<h1> ? </h1>

													:

													<h1 className="monitor-chartName">{currentBitcoinInfo.chartName}</h1>
											}
										</div>

										<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '50%'}}>
											<label>Last Update: </label>
											<h5>{currentBitcoinInfo.time.updated}</h5>
										</div>
									</div>
							}
						</div>

						<div className='monitor-body'>
							{currentBitcoinInfo && Object.entries(currentBitcoinInfo.bpi).map((key, value) => {
								return (
										<div key={Math.random().toString(36)} className='currency-info'>

											<div className='currency-container'>
												<FontAwesomeIcon
														icon={key[1].direction ? (key[1].direction === 'up' ? 'arrow-circle-up' : (key[1].direction === 'down' ? 'arrow-circle-down' : 'arrows-alt-h')) : 'arrows-alt-h'}
														color={key[1].direction && (key[1].direction === 'up' ? '#31FF42' : (key[1].direction === 'down' ? '#FF5B45' : 'black'))}/>
											</div>

											<div className='currency-container'>
												<h3>{key[1].code}</h3>
											</div>

											<div className='currency-container'>
												<h3 style={{color: key[1].direction && (key[1].direction === 'up' ? '#31FF42' : (key[1].direction === 'down' ? '#FF5B45' : 'black'))}}>{key[1].rate}</h3>
											</div>
										</div>
								)
							})}
						</div>
					</div>
				</div>
		)
	}
}

export default BitcoinMonitor;