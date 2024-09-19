import Apple from "./Apple.Js";
import Enemy from "./Enemy.Js";
import Player from "./Player.Js";

document.addEventListener('DOMContentLoaded', () => {

	//this part is still a bit messy
	let isSurvivalMode = false;
	let currentEnemy = null;
	let timeLeft = 60;
	let timeInterval = null;
	let isGameOver = false;
	const objectiveScore = parseInt(document.getElementById('Objective_Score').textContent);


	const survivalModeButton = document.getElementById('Survival_Mode');
	const survivalModeIndication = document.getElementById('Survival_Mode_Indication');
	const timeLeftElement = document.getElementById('Time_Left');

	const gameBoard = document.querySelector('.game_board');
	const victoryElement = document.querySelector('.Victory');
	const defeatElement = document.querySelector('.Defeat');

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

		if(isGameOver === false)
		{
			isSurvivalMode = !isSurvivalMode;

			if(isSurvivalMode)
			{
				survivalModeIndication.textContent = 'Yes';
				survivalModeButton.style.backgroundColor = '#da1212';
				spawnEnemy();
				player.isSurvivalMode = true;
				startSurvivalMode();
	
	
			}
			else
			{
				survivalModeIndication.textContent = 'No';
				survivalModeButton.style.backgroundColor = '#45e10c';
				currentEnemy.unSpawnEnemy();
			}

		}
	
	  });

	  function startSurvivalMode()
	  {
		timeLeft = 60;
		timeLeftElement.textContent = timeLeft;

		if(isGameOver === false)
		{
			timeInterval = setInterval(() => { 
				timeLeft--;
				timeLeftElement.textContent = timeLeft;
	
				handleEndGame();
	
				if (timeLeft <= 0){
					clearInterval(timeInterval);
					handleEndGame();
	
				}
			}, 1000);
		}
		else
		{
			clearInterval(timeInterval);
		}
		
	  }


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
		if(isGameOver === false)
		{
			currentEnemy = new Enemy(gameBoard, player);
			player.currentEnemy = currentEnemy;

		}

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
	// when the snake loses a part, we update the score with an event listener which is triggered in the player class
	// PlayerClass ----> Event ----> Main.js ----> Update the score

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

	function updateTotalScore(value)
	{
		const scoreElement = document.getElementById('Total_Score');
		let score = parseInt(scoreElement.textContent);
		score += value;
		scoreElement.textContent = score;

		if (score >= objectiveScore)
		{
			handleVictory("You reached the objective score ! You win !");
		}
	}

	function handleEndGame()
	{
		const snakePartsElement = document.getElementById('Snake_Parts');
		const totalScoreElement = document.getElementById('Total_Score');
		const currentSnakeParts = parseInt(snakePartsElement.textContent);
		const currentTotalScore = parseInt(totalScoreElement.textContent);

		if (currentSnakeParts <= 0)
		{
			handleDefeat("Your snake has no more parts");

		}
		if (currentTotalScore >= objectiveScore && timeLeft > 0)
		{
			handleVictory("You reached the objective score ! You win !");
		}

		if (timeLeft <= 0 && currentTotalScore < objectiveScore)
		{
			handleDefeat("You ran out of time and did not reach the objective score"); 
		}

	}

	// ---------- Victory and Defeat ------------

	document.addEventListener('touchItself', (event) => {
		console.log('----- SERPENT TOUCH ITSELF PART SIGNAL RECEIVED -----');
		console.log(event.detail.message);
		handleDefeat('Your snake touched itself');

	})

	function handleVictory(message)
	{
		if(isGameOver === false )
		{

			clearInterval(timeInterval);
			alert(message);
			victoryElement.style.visibility = 'visible';
			isGameOver = true;
			player.isGameOver = true;
			currentEnemy.isGameOver = true;

		}

		//alert(message);
	}

	function handleDefeat(message)
	{
		if (isGameOver === false)
		{
			clearInterval(timeInterval);
			alert(message);
			defeatElement.style.visibility = 'visible';
			isGameOver = true;
			player.isGameOver = true;
			currentEnemy.isGameOver = true;
		}
		}


});