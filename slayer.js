$(document).ready(function() {

var playerHBar = $('#playerHealth');
var dragonHBar = $('#dragonHealth');
var userHealthBar = $('#user-HP');
var enemyHealthBar = $('#enemy-HP');
var yourDamage = $('#yourDamage');
var dragonDamage = $('#dragonDamage');
var dialogue = $('#dialogue');
var frenzySlot = $('#frenzy');
var slay = $('#slay');
var playAgain = $('#play-again');
var guide = $('#guide-text');
var name = "Slayer";


// Math/Number Variables
var youHit = Math.floor(Math.random() * 2);
var yourHP = 200;
var dragonHP = 500;
var yourHPPercent = (yourHP / 200)*100 + "%";
var dragonHPPercent = (dragonHP / 500)*100 + "%";
var turnCounter = 0;
var userDelay = 500; // milliseconds after you choose an attack, something happens!
var turnDelay = 1500; // milliseconds before enemy attack

// Nice Colours!
var lightBlue = "#42c5f4";
var red = "#f44141";
var gold = "#f4ca41";

// Auto Scroll Down 

function scrollDown() {
    dialogue.animate({scrollTop: dialogue.prop("scrollHeight")}, 500);
};

// Random Damage Number between select Range

function randomDamage(max, min) {
    return (Math.random()*(max-min)) + min;
};

// HP Bars

$('#name-HP').text(name + " HP ");
userHealthBar.append(yourHP + " / 200");
enemyHealthBar.append(dragonHP + " / 500");

// Attack Dictionaries

var warriorTexts = {
    0: "You remembered your training! Now the hits you take won't be so bad.",
    1: name + " charged!",
    2: "You jabbed your sharpened steel at the dragon!",
    3: "You leaped up and gashed the beast with everything you had!!",
    miss: "Your jump missed the dragon and you hit a pile of rocks! Ouch!",
    sprite0: {
    	w: 1249,
    	h: 150,
    	verSpeed: 0,
    	horSpeed: 0,
    	frames: 9,
    	lastFrame: 18,
    },
    sprite1: {
    	w: 1380,
    	h: 150,
    	verSpeed: 0,
    	horSpeed: 30,
    	frames: 10,
    	lastFrame: 10,
    },
    sprite2: {
    	w: 2240,
    	h: 150,
    	verSpeed: 0,
    	horSpeed: 30,
    	frames: 10,
    	lastFrame: 10,
    },
    sprite3: {
    	w: 4480,
    	h: 150,
    	verSpeed: 10,
    	horSpeed: 25,
    	frames: 20,
    	lastFrame: 20,
    },
}
var mageTexts = {
    0: "You frantically search your spellbooks for the enemy's weaknesses.",
    1: "Kaza-Bazoo! You sapped some energy from the dragon!",
    2: "You were told not to use this spell, but here it goes! You gained dark energy!",
    3: "You start mumbling beneath your breath... You laid a dark curse on the dragon! But it also affected you!",
    miss: "You said the wrong words and hurt yourself instead!",
}
var rogueTexts = {
    0: "You sneak under the dragon's legs and steal some gold!",
    1: "You take a swift swipe at the dragon! Your accuracy was sharpened!",
    2: "You throw at least 10 daggers at the dragon! Where did those come from?!",
    3: "Dragons are smart! You need a distraction before you try something that bold!",
    miss: "The dragon caught on to your scheme and shoved you aside!",
}
var psychicTexts = {
    0: "You use a yo-yo you had on hand to hypnotize the dragon into a doze!",
    1: "You sent a pulse of psychic energy to the dragon's head!",
    2: "Dangling your fingers in the air, waves of psychic energy send boulders crashing!",
    3: "The dragon forgot where it was! It panicked and hurt it's self badly!",
    miss: "You gave yourself a headache from over-focusing!",
}

// Parent Character Class

function Character() {
    this.charName = name;
}

// Child Character Class List

function Warrior() {
    this.classNum = 0;
    this.className = "warrior";
    this.charName = name;
    this.attacks = ["Shield-Up", "Brute-Force", "Sharp-Steel", "Two-Hand-Slash"];
    this.dictionary = warriorTexts;
}

function Mage() {
    this.classNum = 1;
    this.className = "mage";
    this.charName = name;
    this.attacks = ["Study", "White-Magic", "Black-Magic", "Curse"];
    this.dictionary = mageTexts;
}

function Rogue() {
    this.classNum = 2;
    this.className = "rogue";
    this.charName = name;
    this.attacks = ["Steal", "Agile-Strike", "Dagger-Assault", "Assassinate"];
    this.dictionary = rogueTexts;
}

function Psychic() {
    this.classNum = 3;
    this.className = "psychic";
    this.charName = name;
    this.attacks = ["Hypnosis", "Lobotomize", "Electro-Manipulation", "Mind-Eraser"];
    this.dictionary = psychicTexts;
}

Warrior.prototype = new Character();
Mage.prototype = new Character();
Rogue.prototype = new Character();
Psychic.prototype = new Character();

// Enemy Object Constructor
function Enemy(enemy, level) { 
	this.enemyName = enemy;
	this.damage = 30*level;
	this.specialAttack = function() {
			return this.damage*2.5;
	}
};

var dragon = new Enemy("Dragon", 1);

function createUserObjects(userClass) { // create user player object + attack objects

	var classChoiceNeeded = true;
	while (classChoiceNeeded) {
	  switch (userClass) {
		  case "0":
			var user = new Warrior();
			loadImage("warrior-legs", "warrior-breathing-parts");
			classChoiceNeeded = false;
			break;
		  case "1": 
			var user = new Mage();
			loadImage("mage-legs", "mage-breathing-parts");
			classChoiceNeeded = false;
			break;
		  case "2":
			var user = new Rogue();
			loadImage("rogue-legs", "rogue-breathing-parts");
			classChoiceNeeded = false;
			break;
		  case "3":
			var user = new Psychic();
			loadImage("psychic-legs", "psychic-breathing-parts");
			classChoiceNeeded = false;
			break;
		  default:
		    console.log("default triggered.");
		    var user = new Warrior();
			loadImage("warrior-legs", "warrior-breathing-parts");
		    classChoiceNeeded = false;
			break;
	  }
	}
	
	function Attack(attackName, damage, accuracy, hitText, missText) { // Attack Constructor
		this.attackName = attackName;
		this.damage = damage;
		this.accuracy = accuracy;
		this.hitText = hitText;
		this.missText = missText;
    }
    
	var userAttacks = [];
	var userAnimations = [];
	var attackSlots = [ $('#attack1'), $('#attack2'), $('#attack3'), $('#attack4') ];
	var dragonPower = 1;
	var userDef = 1;
	var userAtt = 1;
	var userAcc = 0;
	var dragAcc = 1;
	var rogueGold = 0;
	var hasEnoughGold = false;
	var redHot = false;

	for (let slot = 0; slot < attackSlots.length; slot++) {
		attackSlots[slot].text(user.attacks[slot]);
		var blur = (slot - 1 - userAcc) / 10;
		var damageMod = slot*20*userAtt;
		userAttacks[slot] = new Attack(user.attacks[slot], damageMod, (1 - blur), user.dictionary[slot], user.dictionary["miss"]);
		loadSprites(user.className + "-" + user.attacks[slot], slot, user.dictionary["sprite" + slot]);

				// Define UNIQUE userAttacks[slot].EFFECTS

		userAttacks[slot].effects = function(damageThisTurn) { 
			switch (user.classNum) {
				case 0: // WARRIOR ATTACK EFFECTS
				  switch (slot) {
					case 0: // Shield-Up
					  if (userDef === 1) {
					      userDef *= 2;
					      console.log("userDef is: " + userDef);
					  } else {
					      this.hitText = "Your defence can't get any better! Better start fighting!";
					  }
					  break;
					case 1: // Brute-Force
					  frenzyBoost();
					  break;
					case 2: // Sharp-Steel
					  if (userAtt < 1.5) {
					    userAtt += 0.1;
					    console.log("userAtt is: " + userAtt);
					    dialogue.append(("The dragon's tough scales sharpened your blade!" + "<br />").fontcolor(lightBlue));
					  } 
					  break;
					case 3: // Two-Hand-Slash
					  break;
					}
				break;
				case 1: // MAGE ATTACK EFFECTS
				  switch (slot) {
					case 0: // Study
					  if (userAtt === 1) {
					      userAtt *= 2;
					  } else {
					      this.hitText = "You couldn't find anything else of use in your notes! Better start fighting!" + "<br />";
					  }
					  console.log("userAtt is: " + userAtt);
					  break;
					case 1: // White-Magic
					  var beforeHealHP = yourHP;
					  yourHP += 0.5*damageThisTurn;
					  damageCalculator(dragonHP, yourHP);
					  if (yourHP > 200) {
					      yourHP = 200;
					      yourDamage.text("+" + (Math.ceil(200 - beforeHealHP)));
					  } else {
					      yourDamage.text("+" + (Math.ceil(0.5*damageThisTurn)));
					  }
					  yourDamage.addClass('heal');
					  userHealthBar.text(Math.ceil(yourHP) + " / 200");
					  break;
					case 2: // Black-Magic
					  frenzyBoost();
					  break;
					case 3: // Curse
					    userDef -= 0.2;
					    dragonPower -= 0.1;
					    dialogue.append(("The curse decreased your defence quite a bit!" + "<br />").fontcolor(red));
					    dialogue.append(("The dragon's power fell!" + "<br />").fontcolor(lightBlue));
					  break;
					}             
				break;
				case 2: // ROGUE ATTACK EFFECTS
				  dragAcc = 0.666;
				  switch (slot) {
					case 0: // Steal
					  dragonPower += 0.1;
					  if (rogueGold >= 5) {
					    dialogue.append(("The dragon won't fall for that one again!" + "<br>").fontcolor(red));
					  } else {
					    dialogue.append(("The dragon is furious you dared to lay hands on it's gold!" + "<br />").fontcolor(red));
					    rogueGold += 1;
					    if (rogueGold === 5) {
					    	hasEnoughGold = true;
					    }
					  }
					  console.log("The Rogue has " + rogueGold + " gold bars.");
					  break;
					case 1: // Agile-Strike
					  userAcc += 0.05;
					  break;
					case 2: // Dagger-Assault
					  if (dragonPower > 0.5) {
					      dragonPower -= 0.1;
					      dialogue.append(("The daggers are stuck in the dragon, weakening him" + "<br />").fontcolor(lightBlue));
					  }
					  break;
					case 3: // Assassinate
					  if (hasEnoughGold) {
					    var hpBeforeHit = dragonHP;
					    dragonHP -= 500;
					    rogueGold = 0;
					    damageCalculator(dragonHP, yourHP);
					    dragonDamage.text("-" + Math.min(500, hpBeforeHit));
				        dragonDamage.addClass('shake').css('font-size', '24px');
					    hasEnoughGold = false;
					  }
					  break;
					}              
				break;
				case 3: // PSYCHIC ATTACK EFFECTS
				  switch (slot) {
					case 0: // Hypnosis
					  if (dragAcc === 1) {
					      dragAcc /= 1.5;
					  } else {
					      this.hitText = "The dragon destroyed your yo-yo! It's useless now!";
					  }
					  console.log("dragAcc is " + dragAcc);
					  break;
					case 1: // Lobotomy
					  if (dragonPower > 0.7) {
					      dragonPower -= 0.1;
					      dialogue.append(("The dragon seems slightly less aggressive!" + "<br />").fontcolor(lightBlue));
					  } else {
					      dialogue.append(("You have fried all the brain cells you can!" + "<br />").fontcolor(red));
					  }
					  break;
					case 2: // Electro-Manipulation
					  frenzyBoost();
					  break;
					case 3: // Mind-Eraser
					  if (userAtt < 1.5) {
					    userAtt += 0.1;
					    console.log("userAtt is: " + userAtt);
					    dialogue.append(("You drew some power from the dragon!" + "<br>").fontcolor(lightBlue));
					  }
					  break;
					}              
				break;
			}
		};
		
		userAttacks[slot].method = function (attMod, accMod) {
			if (Math.random() < this.accuracy + accMod) {
				var damageThisTurn = Math.floor(this.damage*randomDamage(1, 0.85)*attMod);
				dialogue.append(this.hitText + "<br>");
				if (slot === 0) {
				    userAttacks[slot].effects();
				} else if (slot !== 0 && this.attackName !== "Assassinate!") {
				    var hpBeforeHit = dragonHP;
				    dragonHP -= damageThisTurn;
				    damageCalculator(dragonHP, yourHP);
				    if (dragonHP <= 0) {
				        dragonDamage.text("-" + hpBeforeHit);
				    } else {
				        dragonDamage.text("-" + damageThisTurn);
				    }
				    dragonDamage.addClass('shake');
				    userAttacks[slot].effects(damageThisTurn);
			    } else if (hasEnoughGold && this.attackName === "Assassinate!") {
				    dialogue.append("You lay out the stolen gold as bait, while he is distracted you jump down from above and...FINISH HIM!" + "<br>");
				    userAttacks[slot].effects(damageThisTurn);		    
				} 
				if (dragonHP <= 0) { 
					enemyHealthBar.text(0 + " / 500");
				} else {
					enemyHealthBar.text(dragonHP + " / 500");
				}
			} else {
				dialogue.append("Rats!! You missed!" + "<br />");
				scrollDown();
				if (slot === 3) {
				    yourHP -= Math.ceil(0.1*yourHP);
				    damageCalculator(dragonHP, yourHP);
				    dialogue.append((this.missText + "<br />").fontcolor(red)); 
				    userHealthBar.text(Math.ceil(yourHP) + " / 200");
				}
			}
		};
		
		attackSlots[slot].on('click', function(e) {
			if (turnCounter % 2 !== 0 && turnCounter !== 0) {
			    turnCounter++;
			    sprites[user.className + "-" + user.attacks[slot]].attack(user.className + "-" + user.attacks[slot]);
				setTimeout(function() {
				    userAttacks[slot].method(userAtt, userAcc);
					scrollDown();
					guide.text("It's the enemy's turn...");
				}, userDelay);
			
				setTimeout(function() {
				    dragonDamage.text("");
				    dragonDamage.removeClass('shake').css('font-size', '14px');
				    yourDamage.removeClass('heal');
					dragonsTurn(dragonPower, userDef, dragAcc);
				}, turnDelay);
			
			}
		}); 
	}
	
	function frenzyBoost() {
	    frenzyMeter++;
	    if (frenzyMeter <= 5) {
	    	drawFrenzyMeter(frenzyMeter, true);
	    }
	    if (frenzyMeter === 5) {
	        frenzySlot.css('visibility', 'visible');
	        dialogue.append(("The dragon slayer started glowing with energy!" + "<br />").fontcolor(gold));
	        scrollDown();
	    } 
	};

	// Frenzy Special Attack
	var frenzyMeter = 0;
	var frenzySpecialAttack = function(attMod) {
        dialogue.append(("The dragon slayer went into a frenzy!" + "<br />").fontcolor(gold));
        scrollDown();
        setTimeout(function() {
		    var hpBeforeHit = dragonHP;
		    var frenzyDam = Math.floor(120*attMod);
		    dragonHP -= Math.floor(120*attMod);
			damageCalculator(dragonHP, yourHP);		    
			dragonDamage.text("-" + Math.min(frenzyDam, hpBeforeHit)).css('font-size', '24px');
		    dragonDamage.addClass('shake');
		    frenzyMeter = 0;
            dialogue.append("The dragon was overwhelmed and took massive damage!" + "<br />");
            guide.text("It's the enemy's turn...");
            if (dragonHP <= 0) {
				enemyHealthBar.text(0 + " / 500");
			} else {
				enemyHealthBar.text(dragonHP + " / 500");
			}
		}, userDelay);
		
		setTimeout(function() {
		    dragonDamage.text("").css('font-size', '14px');
		    dragonDamage.removeClass('shake');
			dragonsTurn(dragonPower, userDef, dragAcc);
		}, turnDelay);
    };
    
    frenzySlot.on('click', function() {
	    if (frenzyMeter >= 5 && turnCounter % 2 !== 0 && yourHP !== 0) {
	        turnCounter++;
		    frenzySpecialAttack(userAtt);
		    drawFrenzyMeter(frenzyMeter, false);
		    frenzySlot.css('visibility', 'hidden');
		}
	});

    //console.log(userAttackObjects[0].attackName); //test calling attack properties

	// Dragon/Enemy/NPC Engine!
	function dragonsTurn(attMod, userDefMod, dragAcc) {
	  if (turnCounter % 2 === 0 && turnCounter !== 0 && dragonHP > 0) {
	      if (Math.random() <= dragAcc) {
	      	if (redHot) {
	      		var damageThisTurn = Math.floor(dragon.specialAttack()*attMod / userDefMod);
	      		dialogue.append(("The dragon unleashed a blast of fire! You took " + damageThisTurn + " damage!" + "<br />").fontcolor(red));
	      	} else {
	      		var damageThisTurn = Math.floor((dragon.damage*randomDamage(1, 0.75)*attMod) / userDefMod);
	      		dialogue.append("The dragon clawed you! You took " + damageThisTurn + " damage!" + "<br />");
	      	}
		  	var hpBeforeHit = yourHP;
		  	yourHP -= damageThisTurn;
		  	damageCalculator(dragonHP, yourHP);
		  	yourDamage.addClass('shake');
		  } else {
		    switch (user.className) {
		    	case ("Psychic"): 
		  	    	dialogue.append("You easily dodged the dragon's slow and drowsy attack!" + "<br />");
		  	    	break;
		  	    case ("Rogue"):
		  	        dialogue.append("You evaded the dragon's attack... because you're a Rogue!" + "<br />");
		  	        break;
		  	}
		  	var damageThisTurn = 0;
		  }
		  if (Math.random() > 0.9/attMod) {
		      redHot = true;
		      dialogue.append(("The dragon's belly starting glowing red! This can't be good!" + "<br>").fontcolor(red));
		  } else {
		      redHot = false;
		  }
		  scrollDown();
			if (yourHP <= 0) {
			  userHealthBar.text(0 + " / 200");
			  yourDamage.text("-" + Math.ceil(hpBeforeHit));
			  for (var s = 0; s < attackSlots.length; s++) {
			  	(function(slotLock) {
			  		attackSlots[slotLock].off();
			  	})(s);
			  }
			  dialogue.append("The " + user.className + " has fallen...");
			  scrollDown();
			  guide.text("Dragon slaying is not supposed to easy...Click PLAY AGAIN to continue!");
			} else {
			  userHealthBar.text(Math.ceil(yourHP) + " / 200");
			  yourDamage.text("-" + Math.ceil(damageThisTurn));
			  guide.text("Choose an attack!");
			}
	  } else if (dragonHP <= 0) {
		  dialogue.append("The dragon collapsed!!! The dragon was slain by the " + user.className + "!");
		  scrollDown();
		  guide.text("You won! Congratulations, " + name + "!");
		  $('.attacks').off();
	  }
	  setTimeout(function() {
	      yourDamage.text("");
	      yourDamage.removeClass('shake');
	  }, 1000);
	  turnCounter++;
	};
};

	
function damageCalculator(dragonHP, yourHP) {
	dragonHPPercent = Math.min((dragonHP / 500)*100, 100);
	dragonHBar.css('width', dragonHPPercent + "%");
    yourHPPercent = Math.min((yourHP / 200)*100, 100);
    playerHBar.css('width', yourHPPercent + "%");
    if (yourHPPercent < 50) {
    	playerHBar.css('background-color', 'yellow');
    	if (yourHPPercent < 10) {
    	playerHBar.css('background-color', 'red');
    	}
    } 
    if (dragonHPPercent < 50) {
    	dragonHBar.css('background-color', 'yellow');
    	if (dragonHPPercent < 10) {
    	dragonHBar.css('background-color', 'red');
    	}
    }
};

slay.on('click', function() {
    var charSlots = [ $('#char1'), $('#char2'), $('#char3'), $('#char4') ];
    charSlots[0].text("Warrior");
    charSlots[1].text("Mage");
    charSlots[2].text("Rogue");
    charSlots[3].text("Psychic");
    for (var i = 0; i < charSlots.length; i++) {
    	charSlots[i].css('display', 'block');
    	(function(lockedIndex) {
    		charSlots[lockedIndex].on('click', function() {
				var stringClass = lockedIndex.toString();
				createUserObjects(stringClass); // Call User Object Constructors
				turnCounter++;
				guide.text("Choose an attack!");
				slay.off();
				for (var i = 0; i < charSlots.length; i++) {
					charSlots[i].css('display', 'none');
				}
			});
		})(i);
    }
    guide.text("Choose your Class!");
});


playAgain.on('click', function() {
  window.location.reload();  // Until you figure out how GC works...
  //deleteUserProps();
  /*var userClass = prompt("Will you slay the dragon as a Warrior(1), Mage(2), Rogue(3), or Psychic(4)? Enter option 1, 2, 3, or 4.");
  createUserObjects(userClass);
  turnCounter = 1;
  dialogue.text("");
  yourHP = 100;
  dragonHP = 500;
  userHealthBar.text(yourHP);
  enemyHealthBar.text(dragonHP);
  guide.text("Choose an attack!");*/
});

/*function deleteUserProps() {
  // code for deleting objects/properties that need to be deleted
};*/


});
