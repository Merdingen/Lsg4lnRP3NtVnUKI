import React from "react";
import Counter from "./counter/Counter";
import BitcoinMonitor from "./bitcoin-monitor/BitcoinMonitor";

function CustomFormEditor() {

	return (
			<div>
				<div className="col-sm-12">
					<Counter/>
				</div>

				<div className="col-sm-12">
					<BitcoinMonitor/>
				</div>
			</div>
	);
}

export default CustomFormEditor;