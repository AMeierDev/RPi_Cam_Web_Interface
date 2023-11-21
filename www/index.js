/* Watch CSS animations */

var lastDirection = 'stop';

/* Keyboard events */

document.addEventListener('keydown', handleKeyEvent);
document.addEventListener('keyup', handleKeyEvent);			

var lastKey = null;

var activeKeys = {
    'ArrowUp':    false,
    'ArrowDown':  false,
    'ArrowLeft':  false,
    'ArrowRight': false
}

function handleKeyEvent(event) {
    if (event.target.tagName == 'STYLE') return;
    if (event.type != 'keydown' && event.type != 'keyup') return;

	if (event.key == 'l' && event.type == 'keydown') {
		executeCommand('lights');
		event.preventDefault();

		return;
	}

	if (activeKeys.hasOwnProperty(event.key)) {
		activeKeys[event.key] = event.type == 'keydown';

		if (event.type == 'keydown') {
			lastKey = event.key;
		}

		event.preventDefault();
	}
	
	evaluateCommands();
}


/* Connect to device */

document.getElementById('connect')
	.addEventListener('click', () => {
		SBrick.connect('SBrick')
			.then(()=> {
				document.body.classList.add('connected');
			});
	});
	
	
/* Handle commands */


var lastCommand = 'stop';

function evaluateCommands() {
	command = 'stop';
	if (activeKeys.ArrowUp || activeButtons.ArrowUp) command = 'forward';
	if (activeKeys.ArrowDown || activeButtons.ArrowDown) command = 'reverse';
	if (activeKeys.ArrowLeft || activeButtons.ArrowLeft) command = 'left';
	if (activeKeys.ArrowRight || activeButtons.ArrowRight) command = 'right';
	
	
    if (lastCommand != command) {
        executeCommand(command);
        lastCommand = command;
    }
}

function updateCommand(value) {
	document.body.classList.remove('forward');
	document.body.classList.remove('reverse');
	document.body.classList.remove('left');
	document.body.classList.remove('right');
	
	if (value) {
		document.body.classList.add(value);
	}
}

function executeCommand(value) {
	
    switch (value) {
        case 'forward':
        	updateCommand('forward');
        	
			if (SBrick.isConnected()) {		            	
            	SBrick.quickDrive([
					{ channel: SBrick.CHANNEL1, direction: SBrick.CW, power: SBrick.MAX },
					{ channel: SBrick.CHANNEL3, direction: SBrick.CCW, power: SBrick.MAX }
				]);
			}
				
			break;
        
        case 'reverse':
        	updateCommand('reverse');
        	
			if (SBrick.isConnected()) {		            	
            	SBrick.quickDrive([
					{ channel: SBrick.CHANNEL1, direction: SBrick.CCW, power: SBrick.MAX },
					{ channel: SBrick.CHANNEL3, direction: SBrick.CW, power: SBrick.MAX }
				]);
			}
				
			break;
        
        case 'right':
        	updateCommand('right');
        	
			if (SBrick.isConnected()) {		            	
            	SBrick.quickDrive([
					{ channel: SBrick.CHANNEL1, direction: SBrick.CCW, power: SBrick.MAX },
					{ channel: SBrick.CHANNEL3, direction: SBrick.CCW, power: SBrick.MAX }
				]);
			}
				
			break;
        
        case 'left':
        	updateCommand('left');

			if (SBrick.isConnected()) {		            	
            	SBrick.quickDrive([
					{ channel: SBrick.CHANNEL1, direction: SBrick.CW, power: SBrick.MAX },
					{ channel: SBrick.CHANNEL3, direction: SBrick.CW, power: SBrick.MAX }
				]);
			}
				
			break;
        
        case 'lights':
			if (SBrick.isConnected()) {		            	
            	if (lightsState) {
	            	SBrick.stop(SBrick.CHANNEL0);
	            	lightsState = false;	
            	} else {
	            	SBrick.drive(SBrick.CHANNEL0, SBrick.CW, SBrick.MAX);							
	            	lightsState = true;	
				}
			}
			
			break;

        case 'stop':
        	updateCommand();

			if (SBrick.isConnected()) {		            	
            	SBrick.stop(SBrick.CHANNEL1);
            	SBrick.stop(SBrick.CHANNEL3);
            }
            
			break;
        
    }
}
