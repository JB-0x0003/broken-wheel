import React from 'react';
import ErrorPanel from './error-panel';
import {Serv} from "./global-service-provider";
import {pipeBigNum} from "./helpers";
import {AttributeType,AttributeObject,ResourceType, ResourceObject} from './common-types';
import ProgressBar from './progress-bar';
import {StatTooltip} from './tooltips';

export default function AttributePanel(){
	
	let sv = Serv();
	const [, dummyState] = React.useState({});
	
	//check if state is done being created; if not, die
	if (sv === undefined) return <ErrorPanel/>;

	function refresh(tickCount : number){

		dummyState({});

	}

	sv.MainLoop.subscribeToTick(refresh);

	let name = sv.Character.getName();
	let jati = sv.Character.getBody().jati;
	let attr = sv.Character.getAttributes() as AttributeObject;
	let stat = sv.Character.getResources() as ResourceObject;

	let attrHTML : React.ReactNode[] = [];
	
	if (attr.shine.value > 1.0) attrHTML.push(
		<div className="attributeLi">
			<span className="mat-icon ">eye</span>
			Shine: {pipeBigNum(attr.shine.value)}
			<StatTooltip category="attribute" stat={AttributeType.Shine}/>
		</div>

	);
	if (attr.summer.value > 1.0) attrHTML.push(
		<div className="attributeLi">
			<span className="mat-icon "></span>
			Summer: {pipeBigNum(attr.summer.value)}
			<StatTooltip category="attribute" stat={AttributeType.Summer}/>
		</div>

	);
	

	return(

		<div className="panel">
			<div className="panelHeader">
				<span className="charName">{name}, {jati.name}</span>
				<span className="charAge"> - {sv.Character.getAgeString()} old</span>
			</div>
			<div className="attributeFlexRow">
				<div className="attributeFlexColumn">
					<div className="attributeLi">
						<span className="mat-icon ">bolt</span>
						Body: {pipeBigNum(attr.body.value)}
						<StatTooltip category="attribute" stat={AttributeType.Body}/>
					</div>
					<div className="attributeLi">
						<span className="mat-icon ">moon</span>
						Cunning: {pipeBigNum(attr.cunning.value)}
						<StatTooltip category="attribute" stat={AttributeType.Cunning}/>
					</div>
					<div className="attributeLi">
						<span className="mat-icon ">learning</span>
						Learning: {pipeBigNum(attr.learning.value)}
						<StatTooltip category="attribute" stat={AttributeType.Learning}/>
					</div>
					<div className="attributeLi">
						<span className="mat-icon ">chat</span>
						Charisma: {pipeBigNum(attr.charisma.value)}
						<StatTooltip category="attribute" stat={AttributeType.Charisma}/>
					</div>
					<div className="attributeLi">
						<span className="mat-icon ">scales</span>
						Nobility: {pipeBigNum(attr.nobility.value)}
						<StatTooltip category="attribute" stat={AttributeType.Nobility}/>
					</div>
					{attrHTML}
				</div>
				<div className="attributeFlexColumn">
					<div className="attributeLi">
						<span className="resourceName">
							Stamina
						</span>
						<ProgressBar value={stat[ResourceType.Stamina].value} max={stat[ResourceType.Stamina].maxValue} colorType="stamina"/>
					</div>
					<div className="attributeLi">
						<span className="resourceName">
							Health
						</span>
						<ProgressBar value={stat[ResourceType.Health].value} max={stat[ResourceType.Health].maxValue} colorType="health"/>
					</div>
					<div className="attributeLi">
						<span className="resourceName">
							Lifespan	
						</span>
						<ProgressBar value={stat[ResourceType.Life].value} max={stat[ResourceType.Life].maxValue} colorType="lifespan"/>
					</div>
				</div>

				

			</div>


		</div>


	);


}
