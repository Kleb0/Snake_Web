//we will create a class called Player that will be used to create player objects
//the constructor will take the gameBoard as a parameter

class Player
{
	
	constructor(gameBoard, posX, posY, moveDistance, currentDirection, apple,
	updateScoreCallBack, updateSnakePartScoreCallback, updateKillScoreCallback )
	{

		console.log('Player created');
		this.currentEnemy = null;
		this.gameBoard = gameBoard;
		this.headElement = document.querySelector('.player');
		this.bodyElements = [];
		this.snakeParts = [{x: posX, y:posY}];
		this.moveDistance = 50;
		this.currentDirection = 'right';
		this.laserSpeed = 10;
		this.posX = posX;
		this.posY = posY;
		this.moveDistance = moveDistance;
		this.currentDirection = currentDirection;
		this.apple = apple;
		this.updateScoreCallBack = updateScoreCallBack;
		this.updateSnakePartScoreCallback = updateSnakePartScoreCallback;
		this.updateKillScoreCallback = updateKillScoreCallback;
		this.isSurvivalMode = false;

		//we will initialize the body parts of the snake
		this.initBodyParts();
		this.updateSnakeVisual();
	

	}

	initBodyParts()
	{
		for (let i = 1; i < 3; i++)
		{
			let body = document.getElementById(`player_bodypart_${i}`);
			if(body)
			{
				this.bodyElements.push(body);
				this.snakeParts.push({x: this.posX - i * this.moveDistance, y: this.posY});
			}
		}
	}
	setupMovement()
	{
		
		document.addEventListener('keydown', (event ) =>
		{

			let moved = false;
			switch(event.key)
			{
				case 'ArrowUp':
				case 'z' :
					if(this.posY - this.moveDistance >= 0)
					{
						
						this.headElement.style.transform = 'scale(2.5) rotate(180deg)'; 
						// console.log('up');
						this.posY -= this.moveDistance;
						this.currentDirection = 'up';
						moved = true;
					}
					break;

				case 'ArrowDown':
				case 's':
					if(this.posY + this.moveDistance < this.gameBoard.clientHeight - 50)
					{
						// console.log('down');
						this.headElement.style.transform = 'scale(2.5) rotate(0deg)'; 
						this.posY += this.moveDistance;
						this.currentDirection = 'down';
						moved = true;
					}
					break;
				case 'ArrowLeft':
				case 'q':
					if(this.posX - this.moveDistance >= 0)
					{
						// console.log('left');
						this.headElement.style.transform = 'scale(2.5) rotate(90deg)';
						this.posX -= this.moveDistance;
						this.currentDirection = 'left';
						moved = true;
					}
					break;
				case 'ArrowRight':
				case 'd':
					if(this.posX + this.moveDistance < this.gameBoard.clientWidth - 50)
					{
						// console.log('right');
						this.headElement.style.transform = 'scale(2.5) rotate(270deg)';
						this.posX += this.moveDistance;
						this.currentDirection = 'right';
						moved = true;
					}
					break;
				case 'x':
					console.log('space bar pressed laser shot');
					this.laserShot();
					break;				
		
			}
			if (moved)
			{
				this.simulateSnake();
				this.updateSnakeVisual();

				if(this.checkAppleCollision(this.apple))
				{
					console.log('collision');
					this.apple.placeApple();
					this.growSnake();

					if(this.updateScoreCallBack)
					{
						this.updateScoreCallBack();
					}

					if (this.updateSnakePartScoreCallback)
					{
						this.updateSnakePartScoreCallback();
					}

				}
			}	
		});
	}

	moveUp()
	{
	
		if(this.snakeParts[0].y - this.moveDistance >= 0 )
		{
			// console.log('up');
			this.snakeParts[0].y -= this.moveDistance;
			this.currentDirection = 'up';		
		}
	}

	moveDown()
	{
		if (this.snakeParts[0].y + this.moveDistance < this.gameBoard.clientHeight - 50)
		{
			// console.log('move down');
			this.snakeParts[0].y += this.moveDistance;
			this.currentDirection = 'down';
		}
	}

	moveLeft()
	{
		if (this.snakeParts[0].x - this.moveDistance >= 0)
		{
			// console.log('left');
			this.snakeParts[0].x -= this.moveDistance;
			this.currentDirection = 'left';
		}
	}

	moveRight()
	{
		if (this.snakeParts[0].x + this.moveDistance < this.gameBoard.clientWidth - 50)
		{
			// console.log('right');
			this.snakeParts[0].x += this.moveDistance;
			this.currentDirection = 'right';
		}
	}
	
	simulateSnake()
	{

		//We update the positions of the snake parts
		for (let i = this.snakeParts.length - 1; i > 0; i--)
		{
			this.snakeParts[i].x = this.snakeParts[i - 1].x;
			this.snakeParts[i].y = this.snakeParts[i - 1].y;
	
		}

		this.snakeParts[0].x = this.posX;
		this.snakeParts[0].y = this.posY;		
	}

	updateSnakeVisual()
	{
		this.headElement.style.left = `${this.snakeParts[0].x}px`;
		this.headElement.style.top =  `${this.snakeParts[0].y}px`;

		for (let i = 0; i < this.bodyElements.length; i++)
		{
			this.bodyElements[i].style.left = `${this.snakeParts[i + 1].x}px`;
			this.bodyElements[i].style.top =  `${this.snakeParts[i + 1].y}px`;

		}
	}
	

	laserShot()
	{
		if(this.isSurvivalMode)
		{
			//first we will create a laser element that we will spawn from the head of the player
		const laser = document.createElement('div');
		laser.classList.add('laser');
		this.gameBoard.appendChild(laser);

		let laserX = this.snakeParts[0].x;
		let laserY = this.snakeParts[0].y;
		laser.style.left = `${laserX}px`;
		laser.style.top = `${laserY}px`;
		laser.style.opacity = 1;

		const laserDirection = this.currentDirection;

		const moveLaser = () => {
			switch(laserDirection)
			{
				case 'up':
					laserY -= this.laserSpeed;
					laser.style.transform = 'rotate(270deg)';
					break;
				case 'down':
					laserY += this.laserSpeed;
					laser.style.transform = 'rotate(90deg)';
					break;
				case 'left':
					laserX -= this.laserSpeed;
					laser.style.transform = 'rotate(180deg)';
					break;
				case 'right':
					laserX += this.laserSpeed;
					laser.style.transform = 'rotate(0deg)';
					break;			
			}

			laser.style.left = `${laserX}px`;
			laser.style.top = `${laserY}px`;

			if (laserX < 0 || 
				laserX > this.gameBoard.clientWidth || 
				laserY < 0 
				|| laserY > this.gameBoard.clientHeight)
			{
				laser.remove();
				
			}
			else
			{
				requestAnimationFrame(moveLaser);
			}
			if (this.checkCollsionWithEnemy(laserX, laserY))
			{
				console.log('collision with enemy');
				laser.remove();
				this.currentEnemy.killEnemy();

				if(this.updateKillScoreCallback)
				{
					this.updateKillScoreCallback();
				}

				return;
			}
		};

		requestAnimationFrame(moveLaser);

		}
		
	}

	growSnake()
	{
		const lastPart = this.snakeParts[this.snakeParts.length - 1];
		this.snakeParts.push({x: lastPart.x, y: lastPart.y});

		const newBodyPart = document.createElement('div');
		newBodyPart.classList.add('player_bodypart');
		newBodyPart.id = `player_bodypart_${this.snakeParts.length - 1}`;

		newBodyPart.style.left = `${lastPart.x}px`;
		newBodyPart.style.top = `${lastPart.y}px`;

		this.gameBoard.appendChild(newBodyPart);
		this.bodyElements.push(newBodyPart);
	}

	destroyLastSnakePart() 
	{
		if(this.snakeParts.length > 1)
		{
			this.snakeParts.pop();
			const lastBodyPart = this.bodyElements.pop();
			lastBodyPart.remove();

			const event = new CustomEvent('SerpentLostPart', {
				detail :{
					message: 'Serpent has lost part decrease total score by 2',
					time: new Date()
				}
			});

			document.dispatchEvent(event);
	
		}

	}

	checkAppleCollision(apple)
	{
		if(!apple || !apple.appleElement)
		{
			console.error('Apple not found');
			return false

		}

		const applePosX = parseInt(apple.appleElement.style.left, 10);
		const applePosY = parseInt(apple.appleElement.style.top, 10);
		const toleranceThreshold = 50;

		if (Math.abs(this.snakeParts[0].x - applePosX) < toleranceThreshold &&
			Math.abs(this.snakeParts[0].y - applePosY) < toleranceThreshold)
		{
			return true;
		}
		return false;
	}

	checkCollsionWithEnemy(laserX, laserY)
	{
		const enemyX = parseInt(this.currentEnemy.enemyElement.style.left, 10);
		const enemyY = parseInt(this.currentEnemy.enemyElement.style.top, 10);
		const toleranceThreshold = 50;

		if (Math.abs(laserX - enemyX) < toleranceThreshold &&
			Math.abs(laserY - enemyY) < toleranceThreshold)
		{
			return true;
		}
		return false;
	}

	spawnEnemy()
	{
		this.currentEnemy = new Enemy(this.gameBoard, this);
	}
}
export default Player;