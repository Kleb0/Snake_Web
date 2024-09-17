class Enemy
{
	constructor(gameBoard, player)
	{
		console.log('Enemy created');
		this.gameBoard = gameBoard;
		this.player = player;
		this.isAlive = true;


		this.enemyElement = document.createElement('div');
		this.enemyElement.classList.add('enemy');
		this.gameBoard.appendChild(this.enemyElement);

		let enemyX = Math.floor(Math.random() * (this.gameBoard.clientWidth - 50));
		let enemyY = Math.floor(Math.random() * (this.gameBoard.clientHeight - 50));

		this.enemyElement.style.left = `${enemyX}px`;
		this.enemyElement.style.top = `${enemyY}px`;

		this.enemySpeed = 2;

		this.moveEnemy();
		this.shootingInterval = setInterval(() => this.enemyShoot(), 2000);
	}

	moveEnemy()
	{
		let directionX = (Math.random() > 0.5) ? 1 : -1;
		let directionY = (Math.random() > 0.5) ? 1 : -1;

		let enemyX = parseInt(this.enemyElement.style.left);
		let enemyY = parseInt(this.enemyElement.style.top);

		const move = () => {
			enemyX += this.enemySpeed * directionX;
			enemyY += this.enemySpeed * directionY;

			if (enemyX <= 0 || enemyX > this.gameBoard.clientWidth - 50)
			{
				directionX *= -1;
			}
			if (enemyY <= 0 || enemyY > this.gameBoard.clientHeight - 50)
			{
				directionY *= -1;
			}

			this.enemyElement.style.left = `${enemyX}px`;
			this.enemyElement.style.top = `${enemyY}px`;

			requestAnimationFrame(move);
		};
		requestAnimationFrame(move);
	}

	enemyShoot()
	{
		const projectile = document.createElement('div');
		projectile.classList.add('enemy_projectile');
		this.gameBoard.appendChild(projectile);

		projectile.style.opacity = 1;

		let projectileX = parseInt(this.enemyElement.style.left);
		let projectileY = parseInt(this.enemyElement.style.top);

		// get the player's position, here the snake's head
		let playerX = this.player.snakeParts[0].x;
		let playerY = this.player.snakeParts[0].y;

		//calculate the direction of the projectile
		let diffX = playerX - projectileX;
		let diffY = playerY - projectileY;

		const magnitude = Math.sqrt(diffX * diffX + diffY * diffY);
		const directionX = diffX / magnitude;
		const directionY = diffY / magnitude;

		const projectileSpeed = 3;

		const moveProjectile = () => {
			if(!this.isAlive)
			{
				projectile.remove();
				return;
			}

			projectileX += projectileSpeed * directionX;
			projectileY += projectileSpeed * directionY;

			projectile.style.left = `${projectileX}px`;
			projectile.style.top = `${projectileY}px`;

			if(this.checkCollisionWithSnake(projectileX, projectileY))
			{
				projectile.style.opacity = 0;
				this.player.destroyLastSnakePart();
				projectile.remove();
				return;

			}
			if (projectileX < 0 || projectileX > this.gameBoard.clientWidth || projectileY < 0 || projectileY > this.gameBoard.clientHeight)
			{
				projectile.remove();
				projectile.classList.remove('enemy_projectile');

			}	
			else
			{
				requestAnimationFrame(moveProjectile);
			}
		};
		requestAnimationFrame(moveProjectile);
	
	}

	checkCollisionWithSnake(projectileX, projectileY)
	{
		const toleranceThreshold = 10;

		for (let i = 0; i < this.player.snakeParts.length; i++)
		{
			const part = this.player.snakeParts[i];

			if (Math.abs(projectileX - part.x) < toleranceThreshold.Threshold && 
				Math.abs(projectileY - part.y) < toleranceThreshold)
			{
				return true;
			}
		}
		return false;
	}

	killEnemy()
	{
		this.isAlive = false;
		clearInterval(this.shootingInterval);
		this.enemyElement.remove();
	}



}

export default Enemy;