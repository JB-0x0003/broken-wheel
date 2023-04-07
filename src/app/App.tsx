import React, {useState} from 'react';
import './App.css';
import EventOverlay from "./event-overlay";
import TimePanel from "./time-panel";
import AttributePanel from "./attribute-panel";
import Center1Panel from './center-1-panel';
import EquipmentPanel from "./equipment-panel";
import {autoLoadState, defaultState} from "./state-service";
import LogService from "./log-service";
import CharacterService from './character-service';
import WorldService from './world-service';
import MainLoopService from './main-loop-service';
import GlobalServiceProvider, {ServiceObject}  from "./global-service-provider";

function App() {

	enum themeNames {

		Dark = 0,
		Light = 1

	}
	
	let [themeSelect, setThemeSelect] = React.useState(0);

	function toggleTheme() {


		if (themeSelect === 0) setThemeSelect(1);
		else setThemeSelect(0);

	}
//Define Services
//First one represents global state. It isn't provided to html pages, only other services
//State is loaded from local storage if present	
let [st,] = useState(autoLoadState());
console.log(st);
let [log,] = useState(new LogService());
let [character,] = useState(new CharacterService(st));
let [world,] = useState(new WorldService(st, character));
let [mainLoop,] = useState(new MainLoopService(st,log,character, world));

const [serv,] = useState({
	Log: log,
	Character: character,
	World: world,
	MainLoop: mainLoop,

})

return (

<GlobalServiceProvider serv={serv} >
<div id="themeWrapper" className={"themeWrapper" + themeNames[themeSelect]}>
<div id="main" className="mainContainer">

<EventOverlay/>

<div className="navbar">
	
	<span className="gameTitle">
		A Wheel Is Broken
	<span className="version">v{process.env.REACT_APP_VERSION}</span>
	</span>
	<span className="navElement">
		<span className="mat-icon iconButt">question</span>
	</span>
	<span className="mat-icon navElement">
		<span className="iconButt navElement">download</span>
		<span className="iconButt navElement" onClick={()=>{mainLoop.save()}}>upload</span>
	</span>
	<span className="navElement textButt" onClick={()=>{mainLoop.die()}}>
		Die
	</span>
	<span className="navElement">
		<label>
			<input type="checkbox" id="themeCheckbox" checked={themeSelect === 1} onChange={toggleTheme}/>
			Light Theme
		</label>
	</span>
	<span className="mat-icon iconButt navElement" onClick={()=>{mainLoop.pushEvent(['system',1001])}}>cog</span>
</div>

<div className="panelContainer">

	<div className="panelContainerLeft">
		<TimePanel/>
		<AttributePanel/>
	</div>

	<div className="panelContainerCenter">
		<Center1Panel/>
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
