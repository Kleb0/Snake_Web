import Apple from "./Apple.Js";
import Enemy from "./Enemy.Js";
import Player from "./Player.Js";

document.addEventListener('DOMContentLoaded', () => {


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

	//as you can see we are only create the instance of the Apple and Player class here (through it's not complete yet)
	let newapple = new Apple(gameBoard);
	const player = new Player(gameBoard, 350, 350, 50, currentDirection, null, newapple, updateScore, updateSnakePartScore);
	
	player.updateSnakeVisual();
	player.setupMovement();


	// ---------- DOM Score update ------------

	survivalModeButton.addEventListener('click', () => {
		isSurvivalMode = !isSurvivalMode;

		if(isSurvivalMode)
		{
			survivalModeIndication.textContent = 'Yes';
			survivalModeButton.style.backgroundColor = '#da1212';
			currentEnemy = new Enemy(gameBoard, player);
			
		}
		else
		{
			survivalModeIndication.textContent = 'No';
			survivalModeButton.style.backgroundColor = '#45e10c';
			currentEnemy.killEnemy();
			currentEnemy.projectiles.remove();

		}
	  });
	
	
	function updateSnakePartScore()
	{
		console.log('updateSnakePartScore');
		const snakePartsElement = document.getElementById('Snake_Parts');
		snakePartsElement.textContent = player.snakeParts.length -1;
	}

	function updateScore()
	{
		const scoreElement = document.getElementById('Apple_score');
		let score = parseInt(scoreElement.textContent);
		score += 1;
		scoreElement.textContent = score;
	}


		
});