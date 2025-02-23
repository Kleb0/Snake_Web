class Enemy
{
	constructor(gameBoard, player)
	{
		console.log('Enemy created');
		this.gameBoard = gameBoard;
		this.player = player;
		this.hasBeenSpawned = true;
		this.isGameOver = false;


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

		if(this.isGameOver)
		{
	
			this.enemySpeed = 0;
			return;

		} 

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
		if(this.isGameOver)
		{
			this.enemySpeed = 0;
			return;
		}

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
			if(!this.hasBeenSpawned)
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

				projectile.remove();
				this.player.destroyLastSnakePart();
				this.player.updateSnakePartScoreCallback();
				return;
			}

			if (projectileX < 0 || projectileX > this.gameBoard.clientWidth || projectileY < 0 || projectileY > this.gameBoard.clientHeight)
			{
				projectile.remove();
				projectile.classList.remove('enemy_projectile');

			}	
			else
			{
				this.checkCollisionWithSnake(projectileX, projectileY);
				requestAnimationFrame(moveProjectile);
			}
		};
		requestAnimationFrame(moveProjectile);
	
	}

	checkCollisionWithSnake(projectileX, projectileY)
	{

		const toleranceThreshold = 50;

		for (let i = 0; i < this.player.snakeParts.length; i++)
		{
			const part = this.player.snakeParts[i];

			if (Math.abs(projectileX - part.x) < toleranceThreshold && 
				Math.abs(projectileY - part.y) < toleranceThreshold)
			{

				return true;
			}
		}
		return false;
	}

	killEnemy()
	{

		//One the enemy is killed we need to remove it, but the main class need to recreate it
		//so we will use a personnalised event to notify the main class

		const event = new CustomEvent('enemyKilled', {
			detail :{
				message: 'Enemy has been killed',
				time: new Date()
			}
		});

		document.dispatchEvent(event);
		clearInterval(this.shootingInterval);
		this.enemyElement.remove();		
	}

	unSpawnEnemy()
	{
		this.hasBeenSpawned = false;
		clearInterval(this.shootingInterval);
		this.enemyElement.remove(); 
	}

}

export default Enemy;