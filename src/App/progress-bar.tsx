
export interface ProgressBarProps{

	value: number;
	max: number;
	colorType: string;

}

export default function ProgressBar(props : ProgressBarProps){

	let percent = props.value / props.max * 100;
	let className = "progressFill " + props.colorType;

	return(
	
		<div className="attributeLi">
			<span className="statusName">
				{props.colorType}
			</span>
			<span className="progressBar">	
				<span className="progressText">
					{Math.ceil(props.value) + "/" + Math.ceil(props.max)}
				</span>
				<span className={className} style={{width: percent + "%"}}>
				</span>
			
			</span>
		</div>

	);

}
