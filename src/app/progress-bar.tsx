
export interface ProgressBarProps{

	value: number;
	max: number;
	colorType: string;
	slim?: boolean;

}

export default function ProgressBar(props : ProgressBarProps){

	let percent = props.value / props.max * 100;
	let className = "progressFill " + props.colorType;

	return(
	
			<span className={"progressBar" + (props.slim? " slim" : "")}>	
				<span className="progressText">
					{	!props.slim?
							(Math.ceil(props.value) + "/" + Math.ceil(props.max)):
							""	
					}
				</span>
				<span className={className} style={{width: percent + "%"}}>
				</span>
			
			</span>

	);

}
