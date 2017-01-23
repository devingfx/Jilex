import { Component, Natives } from '../namespace.js'
// import '../utils/DOM.js'
import { CustomElement } from '../decorators.js'
// import { Component } from '../Component.js'
// import { Natives } from '../Package.js'

@CustomElement
export class Application extends Component {
	Application()
	{
		this.Component();
		this.style.position = 'relative';
		this.style.display = 'block';
		
		this.rawChildren.append( ...DOM`
			<style>
				#top, #left, content, #right, #bottom {
					position: absolute;
					display: block;
				}
				#top {
					width: 100%;
					top: 0;
				}
				#bottom {
					width: 100%;
					bottom: 0;
				}
				#left {
					height: 100%;
					left: 0;
				}
				#right {
					height: 100%;
					right: 0;
				}
			</style>
			<slot id="top"></slot>
			<slot id="left"></slot>
			<content></content>
			<slot id="right"></slot>
			<slot id="bottom"></slot>
		`);
		return this
	}
	
}