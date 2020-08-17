import React, {Component} from 'react';
import moment from 'moment';
import './Counter.css';
import {parse} from "@fortawesome/fontawesome-svg-core";

class Counter extends Component {

	constructor(props) {
		super(props);

		this.state = {
			timeTillDate: moment.utc().add(36000, "seconds"),
			initial_min: 0,
			timeFormat: "HH:mm:ss",
			hours: undefined,
			minutes: undefined,
			seconds: undefined
		};
	}


	componentDidMount() {
		this.interval = setInterval(() => {
			const {timeTillDate, timeFormat} = this.state;
			const then = moment.utc(timeTillDate, timeFormat);
			const now = moment.utc();
			const countdown = moment.utc(then - now);

			const hours = then.diff(now, 'hours');
			const minutes = countdown.format('mm');
			const seconds = countdown.format('ss');

			this.setState({initial_min: then.diff(now, 'hours') + 1, hours, minutes, seconds});
		});
	}

	componentWillUnmount() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}

	mapNumber(number, in_min, in_max, out_min, out_max) {
		return (
				((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
		);
	}

	polarToCartesian(centerX, centerY, radius, angleInDegrees) {
		let angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

		return {
			x: centerX + radius * Math.cos(angleInRadians),
			y: centerY + radius * Math.sin(angleInRadians)
		};
	}

	describeArc(x, y, radius, startAngle, endAngle) {
		let start = this.polarToCartesian(x, y, radius, endAngle);
		let end = this.polarToCartesian(x, y, radius, startAngle);

		let largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

		return [
			'M',
			start.x,
			start.y,
			'A',
			radius,
			radius,
			0,
			largeArcFlag,
			0,
			end.x,
			end.y
		].join(' ');
	}

	changeValue(direction, type) {
		let { timeTillDate } = this.state;
		let secondsRemaining = parseInt(moment.utc(timeTillDate, 'HH:mm:ss').diff(moment.utc(), 'seconds'));

		if (type === 'seconds') {
			direction === 'increase' ? secondsRemaining += 2 : secondsRemaining -= 0;
		} else if (type === 'minutes') {
			direction === 'increase' ? secondsRemaining += 61 : secondsRemaining -= 59;
		} else {
			direction === 'increase' ? secondsRemaining += 3601 : secondsRemaining -= 3599;
		}

		this.setState({
			timeTillDate: moment.utc().add(secondsRemaining, "seconds"),
		})
	}

	render() {

		const SVGCircle = ({radius}) => (
				<svg className="countdown-svg">
					<path
							fill="none"
							stroke="#333"
							strokeWidth="4"
							d={this.describeArc(50, 50, 48, 0, radius)}
					/>
				</svg>
		);

		let {initial_min, hours, minutes, seconds} = this.state;

		const hoursRadius = this.mapNumber(hours, initial_min, 0, 360, 0);
		const minutesRadius = this.mapNumber(minutes, 60, 0, 360, 0);
		const secondsRadius = this.mapNumber(seconds, 60, 0, 360, 0);

		if (!seconds) {
			return null;
		}

		return (
				<div className="countdown-wrapper">
					{hours && (
							<div className="time-section-display">
								<div className="countdown-item">
									<SVGCircle radius={hoursRadius}/>
									<div className="time-container">
										<p style={{color: '#828282'}}>{hours}</p>
										<span style={{color: '#828282'}}>hours</span>
									</div>
								</div>

								<div className="adjustment-container">
									<button className="adjust-button" style={{color: 'red'}} onClick={() => this.changeValue('decrease', 'hours')}>-</button>
									<button className="adjust-button" style={{color: 'green'}} onClick={() => this.changeValue('increase', 'hours')}>+</button>
								</div>
							</div>
					)}

					{minutes && (
							<div className="time-section-display">
								<div className="countdown-item">
									<SVGCircle radius={minutesRadius}/>
									<div className="time-container">
										<p style={{color: '#828282'}}>{minutes}</p>
										<span style={{color: '#828282'}}>minutes</span>
									</div>
								</div>

								<div className="adjustment-container">
									<button className="adjust-button" style={{color: 'red'}} onClick={() => this.changeValue('decrease', 'minutes')}>-</button>
									<button className="adjust-button" style={{color: 'green'}} onClick={() => this.changeValue('increase', 'minutes')}>+</button>
								</div>
							</div>
					)}

					{seconds ?
							(
									<div className="time-section-display">
										<div className="countdown-item">
											<SVGCircle radius={secondsRadius}/>
											<div className="time-container">
												<p style={{color: '#828282'}}>{seconds}</p>
												<span style={{color: '#828282'}}>seconds</span>
											</div>
										</div>

										<div className="adjustment-container">
											<button className="adjust-button" style={{color: 'red'}} onClick={() => this.changeValue('decrease', 'seconds')}>-</button>
											<button className="adjust-button" style={{color: 'green'}} onClick={() => this.changeValue('increase', 'seconds')}>+</button>
										</div>
									</div>
							)

							:

							<div>
								<p>Countdown Ended</p>
							</div>
					}
				</div>
		);
	}
}

export default Counter;