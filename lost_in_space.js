"use strict";
/* avant que vous lisiez j'ai fais quelques modifications sur les touches comme ma page peut etre scroller j'ai du changer la barre espace pour tirer
et la touche haut pour monter (voir les regles sur la pages HTML*/

function Vaisseau(x,y,size=5,couleur="blue",orientation="bas"){
	/* Fonction dessinant le vaisseau */
	var i = -1
	if(orientation=="haut"){
		
		i = 1;
	}
	var canvas = document.getElementById('game_area');
	var vaisseau = canvas.getContext("2d");
	vaisseau.strokeStyle = couleur;
	vaisseau.lineCap = "round";
	vaisseau.lineWidth = 2;
	vaisseau.beginPath();
	vaisseau.moveTo(x,y);
		
	vaisseau.lineTo(x+size*i,y+size*i);
	vaisseau.lineTo(x+size*i,y+(size+5)*i);
	vaisseau.lineTo(x+size*i,y+size*i);
		
	vaisseau.lineTo(x-size*i,y+size*i);
	vaisseau.lineTo(x-size*i,y+(size+5)*i);
	vaisseau.lineTo(x-size*i,y+size*i);
		
	vaisseau.lineTo(x,y);
	vaisseau.stroke();
}

function Ennemi(x,y,dy=0.5,dx=0.5,taille=5,couleur="purple",hp = 1){
	/* Fonction dessinant les Ennemis */
	
	
	this.x = x;
	this.y = y;
	
	
	this.vy = dy;
	this.vx = dx;
	
	
	this.enVie = true;
	this.hp = hp;
	
	
	this.taille = taille;
	

	this.direction = "bas";
	this.direction_x = "droite";
	
	
	this.couleur = couleur
	
	
	this.dessiner = function(){Vaisseau(this.x,this.y,this.taille,this.couleur)};
	
	
	this.colision = function(u,v,w){
		if(u>=this.x-(this.taille/2) && u<=this.x+(this.taille/2) && ((v<=this.y+(this.taille/2) && v>=this.y-(this.taille/2)) || (v-w<=this.y+(this.taille/2) && v-w>=this.y-(this.taille/2)) || (this.y<v && this.y>v-w))){  return true;}
		return false;
	};
	this.deplacer = function(){

		var acc = -1.1;

		if(this.vy>5 || this.vy<-5){
			acc = -1;
		}
		switch(this.direction){
			case "bas":
				if(this.y+(this.taille/2)>=600){
					this.vy*=acc; 
					this.direction = "haut";
				}
				break;
			case "haut":
				if(this.y-(this.taille/2)<=0){
					this.vy*=acc; 
					this.direction = "bas";
				}
				break;
			default:
				break;
		}
		this.y+=this.vy; 
		
		switch(this.direction_x){
			case "gauche":
				if(this.x-(this.taille/2)<=0){
					this.direction_x ="droite";
					this.vx *=-1; 
				}
				break;
			case "droite":
				if(this.x+(this.taille/2)>=600){
					this.direction_x ="gauche";
					this.vx *=-1; 
				}
				break;
			default:
				break;
		}
		this.x+=this.vx; 
	};
}

function Laser(x,y,dy=2,couleur="cyan",taille=1){
	/* Création du laser */
	
	
	this.x=x;
	this.y=y;
	
	
	this.dy=dy;
	
	
	this.taille = taille;
	
	
	this.vie = taille; 
	
	
	this.couleur = couleur;
	this.dist = 299+taille;
	
	
	this.dessiner = function(laser){

		laser.beginPath();
		laser.strokeStyle = this.couleur;
		laser.moveTo(this.x,this.y);
		laser.lineTo(this.x,this.y-taille);
		laser.lineWidth = 4;
		laser.stroke();
	};
}

function Joueur(x,y,taille=10){
	/* Créer un Joueur */
	
	
	this.x = x;
	this.y = y;
	
	this.enVie = true;
	this.hp=15;
	
	
	
	
	
	this.taille = taille;
	
	
	this.dessiner = function(){Vaisseau(this.x,this.y,this.taille,"blue","haut");}
	
	
	this.deplacer = function(dx,dy){
		if(this.x+dx>0 && this.y+dy>0 && this.x+dx<600 && this.y+dy<600){
			this.x=this.x+dx;
			this.y=this.y+dy;
		}
	}
	
	this.colision = function(u,v){
		if(u>=this.x-(this.taille/2) && u<=this.x+(this.taille/2) && v<=this.y+(this.taille/2) && v>=this.y-(this.taille/2)){  return true;}
		return false;
	};
}

function initialiserEnnemis(ennemis){
	/* Initialisation de la liste d'ennemi */
	for(var i=0; i < 25;i++){
		for(var j=0; j<12;j++){
			ennemis.push(new Ennemi(20*(i+1),40+20*j));
		}
	}
}

	
window.onload = function principale(){
	/* Fonction principale */
	
	
	var canvas = document.getElementById('game_area');
	var context = canvas.getContext("2d");
	
	
	var joueur = new Joueur(300,550);
	var ennemis = [];
	var boss = new Ennemi(300,10,1,1,25,"red",5);
	var tirs = [];
	
	initialiserEnnemis(ennemis);
	
		
		window.addEventListener('keydown',function(event){
			var ev = event.keyCode;
			
			if(ev==82){
				/* Recommencer le jeu si la touche est R */
				joueur = new Joueur(300,550);
				ennemis = [];
				initialiserEnnemis(ennemis);
				boss = new Ennemi(300,10,1,1,25,"red",5);
				tirs = [];
			}
			else if(joueur.enVie){
				var vitesse = 4;
				switch(ev){
					// Déplacement du joueur en cas de touche ZQSD enfoncée
					case 68:
						joueur.deplacer(vitesse,0);
						break; 
					case 90:
						joueur.deplacer(0,-vitesse);
						break;
					case 83:
						joueur.deplacer(0,vitesse);
						break;
					case 81:
						joueur.deplacer(-vitesse,0);
						break;
						
					/* laser lancé si le joueur appuie sur M */
					case 77:
						tirs.push(new Laser(joueur.x,joueur.y-(joueur.taille/2)));
						break;
						


						
					default:
						break;
				}
			}
		});
	var jouer = function(){
		
		
		context.clearRect(0,0,600,600);
		
		
		for(var i=0;i<ennemis.length;i++){
			if(ennemis[i].enVie){
				ennemis[i].dessiner();
				ennemis[i].deplacer();
				}
		}
		/*initialisation du boss*/
		if(boss.enVie){
			boss.dessiner();
			if(joueur.x-20<boss.x && joueur.x+20>boss.x){
				
				tirs.push(new Laser(boss.x,boss.y+(boss.taille/2),-2,"yellow"));
			}
			boss.deplacer();
		}
		/* Initialisation des tirs */
	    var j=0;
		while(j<tirs.length){
			
			if(tirs[j].dist<=0 || tirs[j].x<=0 || tirs[j].x>=600 || tirs[j].y<=0 || tirs[j].y>=600){
				tirs[j].vie =0;
			}
			else{
				tirs[j].dessiner(context);
				tirs[j].y -=tirs[j].dy;
				
				if(tirs[j].dy>0.4){
					tirs[j].dy *=0.99; 
				}
				tirs[j].dist-=tirs[j].dy;
			}
			j++;
		}
		
		/* Verification que le laser touche les ennemi */
		for(var i=0; i<ennemis.length;i++){
			for(var j=0; j<tirs.length;j++){
				if(tirs[j].vie >0 && ennemis[i].enVie && tirs[j].dy >0 && ennemis[i].colision(tirs[j].x,tirs[j].y,tirs[j].taille)){
					ennemis[i].enVie = false;
					tirs[j].vie--;
					if(joueur.boost<300){
						joueur.boost+=10;
					}
				}
				else if(tirs[j].vie >0 && boss.enVie && boss.colision(tirs[j].x,tirs[j].y)){
					boss.hp--;
					tirs[j].vie--;
				}
				else if(tirs[j].vie >0 && joueur.enVie && joueur.colision(tirs[j].x,tirs[j].y)){
					joueur.hp--;
					tirs[j].vie--;
				}
			}
		}
		
		if(boss.hp<=0){
			boss.enVie = false;
		}
		if(joueur.hp<=0){
			joueur.enVie = false;
		}
		
		
		if(joueur.enVie){
			joueur.dessiner()
		}
		/* Met a jour l'armée d'ennemis */ 
		ennemis = ennemis.filter(function(x){if(x.enVie){
												return x;
											}
		});
		
		tirs =tirs.filter(function(x){
								if(x.vie>0){
									return x;
								}
		});
		window.requestAnimationFrame(jouer);
	}
	window.requestAnimationFrame(jouer);
	
};
