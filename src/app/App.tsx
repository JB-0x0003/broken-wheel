import React, {useState} from 'react';
import './App.css';
import Overlay from "./event-overlay";
import TimePanel from "./time-panel";
import AttributePanel from "./attribute-panel";
import Center1Panel from './center-1-panel';
import EquipmentPanel from "./equipment-panel";
import LogPanel from './log-panel';
import {loadStateFromLocal, defaultState} from "./game-state/state";
import LogService from "./game-state/log-service";
import CharacterService from './game-state/character-service';
import WorldService from './game-state/world-service';
import MainLoopService from './game-state/main-loop-service';
import GlobalServiceProvider, {ServiceObject}  from "./global-service-provider";
import {ThemeType} from './common-types';

function App() {

let [,dummyState] = useState({});

function toggleTheme() {
	
	console.log(st.options.theme);
	if (st.options.theme === ThemeType.Light) st.options.theme = ThemeType.Dark;
	else st.options.theme = ThemeType.Light;
	dummyState({});
}

//Define Services
//First one represents global state. It isn't provided to html pages, only other services
//State is loaded from local storage if present	
let [st,] = useState(loadStateFromLocal());
let [log,] = useState(new LogService());
let [character,] = useState(new CharacterService(st));
let [world,] = useState(new WorldService(st, character));
let [mainLoop,] = useState(new MainLoopService(st,log,character, world));

const [serv,] = useState({
	ST: st,
	Log: log,
	Character: character,
	World: world,
	MainLoop: mainLoop,

})

return (

<GlobalServiceProvider serv={serv} >
<div id="themeWrapper" className={"themeWrapper " + st.options.theme}>
<div id="main" className="mainContainer">

<Overlay/>

<div className="navbar">
	
	<span className="gameTitle">
		A Wheel {"\t"}Is Broken
	<span className="version">v{process.env.REACT_APP_VERSION}</span>
	</span>
	<span className=" navElement">
		<span 
			className="mat-icon iconButt" 
			onClick={()=>{mainLoop.pushEvent('system',1002)}}
		>
			question
		</span>
		<span className="tooltipContainer">
			<span className="tooltip">
				Game details. 
			</span>
		</span>
	</span>
	<span className=" navElement">
		<span 
			className="mat-icon iconButt" 
			onClick={()=>{mainLoop.pushEvent('system',1003)}}
		>
			download
		</span>
		<span className="tooltipContainer">
			<span className="tooltip">
				<div className="tooltipHeader">
					Save Management
				</div>
				<div className="tooltipSegment">
					You may want to move between devices.
				</div>
			</span>
		</span>
	</span>
	<span className="navElement">
		<span className=" textButt" onClick={()=>{mainLoop.die()}}>
			Die
		</span>
		<span className="tooltipContainer">
			<span className="tooltip">
				<div className="tooltipHeader">
					Instantly Die
				</div>
				<div className="tooltipSegment">
					Final peace is denied you, but you can speed things along from time to time.
				</div>
			</span>
		</span>
	</span>
	<span className="navElement">
		<label>
			<input 
			type="checkbox" 
			id="themeCheckbox" 
			checked={st.options.theme === ThemeType.Light} 
			onChange={toggleTheme}/>
				Light Theme
		</label>
	</span>
	<span className="mat-icon iconButt navElement" onClick={()=>{mainLoop.pushEvent('system',1001)}}>cog</span>
</div>
<div className="panelContainer">
	<div className="panelContainerLeft">
		<TimePanel/>
		<AttributePanel/>
	</div>

	<div className="panelContainerCenter">
		<div className="panelContainerCenterUpper">
			<Center1Panel/>
		</div>
		<div className="panelContainerCenterLower">
			<LogPanel/>
		</div>
	</div>
	<div className="panelContainerRight">
		<EquipmentPanel/>
	</div>

	</div>
</div>
</div>
</GlobalServiceProvider>


  );
}

export default App;
