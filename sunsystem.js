const day = 24.0*60*60;

AFRAME.registerComponent('planet', {
		schema: {
				name: {type: 'string', default: ""}, 
				dist: {type: 'number', default: 0},
				mass: {type: 'number', default: 0}, 
				T: {type: 'int', default: 0}, 
				v: {type: 'array', default: [0,0,0]}, 
				a: {type: 'array', default: [0,0,0]}, 
				pos: {type: 'array', default: [0,0,0]}
		},
		
		init: function () {
				this.data.T=this.data.T * day;
				this.data.pos[0]=this.data.dist;

				this.el.setAttribute('position',this.data.dist/1e9+' 0 0');
				if(this.data.T!=0)
						this.data.v[1] = 2*Math.PI*this.data.dist/this.data.T;
		}
});



AFRAME.registerComponent('main', {
		init: function() {
				this.solar_system = document.querySelectorAll('[planet]');
		},
		
		tick: function (time, deltaTime) {
				const dt = day/3;
				const G=6.67e-11; 
				
				for(var i = 0; i<this.solar_system.length; i++) {
						planet_i=this.solar_system[i].getAttribute('planet');
						planet_i.a[0]=planet_i.a[1]=planet_i.a[2]=0;
						for(var j = 0; j<this.solar_system.length; j++) {
								planet_j=this.solar_system[j].getAttribute('planet');
								if(i!=j) {
										deltapos = [0,0,0];
										for(var k = 0; k < 3; k++)
												deltapos[k]=planet_j.pos[k]-planet_i.pos[k];
										var r=Math.sqrt(Math.pow(deltapos[0],2)+Math.pow(deltapos[1],2)+Math.pow(deltapos[2],2));
										for(var k = 0; k < 3; k++)
												planet_i.a[k]+=G*planet_j.mass*deltapos[k]/Math.pow(r, 3);
								}
						}
						for(var k = 0; k < 3; k++)
								planet_i.v[k]+=planet_i.a[k]*dt;
						for(var k = 0; k < 3; k++)
								planet_i.pos[k]+=planet_i.v[k]*dt;
						this.solar_system[i].setAttribute('position',
								(planet_i.pos[0]/1e9)+' '+(planet_i.pos[1]/1e9)+' '+(planet_i.pos[2]/1e9));
				}
		}
 });