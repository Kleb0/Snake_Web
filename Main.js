import Apple from "./Apple.Js";
import Enemy from "./Enemy.Js";
import Player from "./Player.Js";

document.addEventListener('DOMContentLoaded', () => {

	//this part is still a bit messy
	let isSurvivalMode = false;
	let currentEnemy = null;
	const survivalModeButton = document.getElementById('Survival_Mode');
	const survivalModeIndication = document.getElementById('Survival_Mode_Indication');

	//first clean the DOM from any existing elements
	const inialEnemy = document.querySelector('.enemy');
	if(inialEnemy)
	{
		inialEnemy.remove();
	}
	
	const initialApple = document.querySelector('.apple');
	if(initialApple)
	{
		initialApple.remove();
	}

	const gameBoard = document.querySelector('.game_board');

	const headDirection = {up: 'up', down: 'down', left: 'left', right : 'right'};
	let currentDirection = headDirection.right;

	//initialize the apple
	let newapple = new Apple(gameBoard);

	//initialize the player
	const player = new Player(gameBoard, 250, 350, 50, currentDirection, newapple, updateScore, updateSnakePartScore, UpdateKillScore);
	

	//as you can see, we only need to call the events reported in the Player class
	//the player implemente its own logic : movement, score update, visual update etc
	//as all of these logics are related to its own class
	player.updateSnakeVisual();
	player.setupMovement();

	// we need to update the score at the beginning as we have already two segments to our snake
	player.updateSnakePartScoreCallback();



	// ---------- Survival Mode Logic ------------

	survivalModeButton.addEventListener('click', () => {
		isSurvivalMode = !isSurvivalMode;

		if(isSurvivalMode)
		{
			survivalModeIndication.textContent = 'Yes';
			survivalModeButton.style.backgroundColor = '#da1212';
			spawnEnemy();

		}
		else
		{
			survivalModeIndication.textContent = 'No';
			survivalModeButton.style.backgroundColor = '#45e10c';
			currentEnemy.unSpawnEnemy();
		}
	  });

	// ---------- Enemy Spawning Logic ------------

	// we create an instance of the enemy to our DOM
	// so do it in the Main.JS file
	// to be simple : When the enemy is killed, it sends a kind of signal to the main.js file
	// so that the main.js file know it has to create a new enemy
	// the enemy is only created at the survival mode, so we don't need to check if the survival mode is on or off
	// you can visualise loop like this :
	// Survival mode ON ---> Enemy creation ---> Enemy killed ---> Signal to Main.js ---> Main.js create a new enemy

	function spawnEnemy()
	{
		currentEnemy = new Enemy(gameBoard, player);
		player.currentEnemy = currentEnemy;
	}

	document.addEventListener('enemyKilled', (event) => {
		console.log('----- ENNEMY KILLED SIGNAL RECEIVED -----');
		console.log(event.detail.message);
		spawnEnemy();
	})

	// ---------- Score functions ------------
	

	function updateSnakePartScore()
	{
		const snakePartsElement = document.getElementById('Snake_Parts');
		let currentSnakeLength = player.snakeParts.length - 1;	
		snakePartsElement.textContent = currentSnakeLength;

	}
	document.addEventListener('SerpentLostPart', (event) => {
		console.log('----- SERPENT LOST PART SIGNAL RECEIVED -----');
		console.log(event.detail.message);
		updateTotalScore(-2);
	})

	function updateScore()
	{
		const scoreElement = document.getElementById('Apple_Score');
		let score = parseInt(scoreElement.textContent);
		score += 1;
		scoreElement.textContent = score;

		updateTotalScore(1);
	}		

	function UpdateKillScore()
	{
		console.log('Kill score updated');
		const scoreElement = document.getElementById('Kill_Score');
		let score = parseInt(scoreElement.textContent);
		score += 1;
		scoreElement.textContent = score;

		updateTotalScore(5);
		
	}

	function DecreaseTime()
	{

	}

	function updateTotalScore(value)
	{
		const scoreElement = document.getElementById('Total_Score');
		let score = parseInt(scoreElement.textContent);
		score += value;
		scoreElement.textContent = score;
	}
});