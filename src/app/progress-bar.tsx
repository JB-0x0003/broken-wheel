
export interface ProgressBarProps{

	value: number;
	max: number;
	colorType: string;
	slim?: boolean;

}

export default function ProgressBar(props : ProgressBarProps){

	let percent = props.value / props.max * 100;
	let percentOverflow = percent > 100? percent - 100 : 0;

	return(
	
			<span className={"progressBar" + (props.slim? " slim" : "")}>	
				<span className="progressText">
					{	!props.slim?
							(Math.ceil(props.value) + "/" + Math.ceil(props.max)):
							""	
					}
				</span>
				<span className={"progressFill " + props.colorType} style={{width: percent + "%"}}>
				</span>
				<span className={"progressFill " + props.colorType + " overcharge"} style={{width: percentOverflow + "%"}}>
				</span>
			</span>

	);

}
