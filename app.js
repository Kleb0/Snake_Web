document.addEventListener('DOMContentLoaded', () => {

	const inialEnemy = document.querySelector('.enemy');

	if(inialEnemy)
	{
		inialEnemy.remove();
	}

	const player = document.querySelector('.player');
	const gameBoard = document.querySelector('.game_board');
	const bordWidth = gameBoard.clientWidth;
	const bordHeight = gameBoard.clientHeight;
	const moveDistance = 50;
	const headDirection = {up: 'up', down: 'down', left: 'left', right : 'right'};
	let currentDirection = headDirection.right;
	let posX = 350;
	let posY = 350;
	let startScore = 0;

	let hasAppleBeenEaten = false;

	// ici notre variable est un tableau d'élements HTML qui sont rendus égaux à une fonction qui retourne un tableau des dits éléments
	const {headElement, bodyElements, snakeParts} = getSnakeParts();



	updateSnakePartScore();
	placeApple();
	updateSnakeVisual();
	PlayerMove();
	spawnEnemy();


	// a chaque pression d'une touche, on vérifie si le serpent peut se déplacer, on prend en compte 
	// la position de la tête, la direction souhaitée, et les limites du plateau de jeu. Avec les deux cases
	// ArrowUp et z, on peux utilisées les arrows keys et les touches zqsd pour se déplacer
	// l'event lu est ici un objet de type KeyboardEvent
	// on utilise la propriété .key pour obtenir la touche pressée
	// et on vérifie si la touche pressée correspond à celle indiquée dans le switch

	function PlayerMove()
	{
		document.addEventListener('keydown', (event) => {
			let moved = false;
			switch (event.key){

				case 'ArrowUp':
				case 'z':
					if (posY - moveDistance >= 0){
						posY -= moveDistance;
						currentDirection = headDirection.up;
						moved = true;

					}					
					break;

				case 'ArrowDown':
				case 's':
					if (posY + moveDistance <= bordHeight - moveDistance){
						posY += moveDistance;
						currentDirection = headDirection.down;
						moved = true;
					}
					break;


				case 'ArrowLeft':
				case 'q':
					if (posX - moveDistance >= 0){
						posX -= moveDistance;
						currentDirection = headDirection.left;
						moved = true;
					}
					break;
	
				case 'ArrowRight':
				case 'd':
					if (posX + moveDistance <= bordWidth - moveDistance){
						posX += moveDistance;
						currentDirection = headDirection.right;
						moved = true;
					}
					break;

				case ' ':
					// barre d'espace pour tirer un laser
					laserShot();
					break;			
			}

			if (moved){
				simulateSnake();
				updateSnakeVisual();

				if (checkAppleCollision()){
					growSnake();
					updateScore();
					updateSnakePartScore();
					placeApple();
					hasAppleBeenEaten = false; 	
				}			
			}
		})

	}

	function getSnakeParts()
	{
		//on récupère la tête et le corps du serpent
		const headElement = document.querySelector('.player');

		// on initialise un array vide qui contiendra les éléments du corps du serpent divisé en sections
		const bodyElements = [];

		//comme il y a 5 sections, on récupère les éléments du corps du serpent avec une indexation de 1 à 6 1 étant la tête
		// (donc on a pas besoin de la récupérer car on l'a déjà)
		//le literal template permet de récupérer les éléments du corps du serpent en utilisant une boucle for, ça
		// correspondra aux indices des éléments du corps du serpent dans le HTML / DOM
		// tel que player_bodypart_1, player_bodypart_2,etc.

		for (let i = 1; i < 3; i++){
			bodyElements.push(document.getElementById(`player_bodypart_${i}`));
		}

		//on retourne un tableau contenant la tête et le corps du serpent et en commençant par la tête,
		// sachant que posX et PosY mettent à jour la position de la tête du serpent

		const snakeParts = [ {x:posX, y:posY}]

		for (let i = 1; i < 3; i++){
			snakeParts.push({x: posX - i * moveDistance, y: posY});
		}

		return {headElement, bodyElements, snakeParts};

	}

	//cette fonction a pour but de simuler le mouvement du serpent
	//en déplaçant son corps divisé en segments
	// le premier segment prend la position de la tête
	// le deuxième segment prend la position du premier segment
	// et ainsi de suite

	//la boucle par de l'indice le plus grand : snakeParts.length - 1 et
	// remonte vers la deuxième position
	// Chaque segment prend donc la position du segment précédent

	function simulateSnake()
	{

		for(let i = snakeParts.length - 1; i > 0; i--){
			snakeParts[i].x = snakeParts[i - 1].x;
			snakeParts[i].y = snakeParts[i - 1].y;
		}
		
		//la tête du serpent prend la position de posX et posY
		snakeParts[0].x = posX;
		snakeParts[0].y = posY;

	}

	//cette fonction met à jour la position visuelle du serpent et des éléments de son corps
	// en utilisant les coordonnées de la tête et du corps du serpent
	// comme on peut le voir, la tête du serpent est mise à jour en premier
	// puis les éléments du corps du serpent sont mis à jour devant égaux à la position du segment suivant

	function updateSnakeVisual()
	{
		headElement.style.left = `${snakeParts[0].x}px`;
		headElement.style.top = `${snakeParts[0].y}px`;

		for (let i = 0; i < bodyElements.length; i++){
			bodyElements[i].style.left = `${snakeParts[i + 1].x}px`;
			bodyElements[i].style.top = `${snakeParts[i + 1].y}px`;
		}

	}

	function placeApple()
	{
		const apple = document.querySelector('.apple');
		const maxPosX = gameBoard.clientWidth - 50;
		const maxPosY = gameBoard.clientHeight - 50;

		const randomX = Math.floor(Math.random() * maxPosX);
		const randomY = Math.floor(Math.random() * maxPosY);

		apple.style.left = `${randomX}px`;
		apple.style.top = `${randomY}px`;
		
	}

	function checkAppleCollision()
	{

		const apple = document.querySelector('.apple');
		const applePosX = parseInt(apple.style.left);
		const applePosY = parseInt(apple.style.top);
		const toleranceThreshold = 50; 

		if (Math.abs(snakeParts[0].x - applePosX) < toleranceThreshold && Math.abs(snakeParts[0].y - applePosY) < toleranceThreshold){
			hasAppleBeenEaten = true;
		}

		return hasAppleBeenEaten;


	}

	function growSnake()
	{

		const lastPart = snakeParts[snakeParts.length - 1];
		snakeParts.push({x: lastPart.x, y: lastPart.y});

		const newBodyPart = document.createElement('div');
		newBodyPart.classList.add('player_bodypart');
		gameBoard.appendChild(newBodyPart);
		bodyElements.push(newBodyPart);
	}

	function updateSnakePartScore()
	{
		const snakePartsElement = document.getElementById('Snake_Parts');
		snakePartsElement.textContent = snakeParts.length - 1;
	}

	function updateScore()
	{
		const scoreElement = document.getElementById('Apple_score');
		let score = parseInt(scoreElement.textContent);
		score += 1;
		scoreElement.textContent = score;

		getScore(score);
	}

	function getScore(score)
	{
		
		startScore = score;
		return startScore;
	}


	//cette fonction permet de tirer un laser.
	//On ne va pas simplement déplacement l'élément laser
	//On va le créer à partir de la position de la tête du serpent et le détruire quand
	//on on a plus besoin de lui lorsqu'il atteint les limites du plateau de jeu ou un ennemi par exemple

	function laserShot()
	{

		//creation dynamique de l'élément laser
		const laser = document.createElement('div');
		laser.classList.add('laser');
		gameBoard.appendChild(laser);


		const laserSpeed = 10;
		let laserX = snakeParts[0].x;
		let laserY = snakeParts[0].y;

		laser.style.left = `${laserX}px`;
		laser.style.top = `${laserY}px`;

		const laserDirection = currentDirection;

		laser.style.opacity = 1;

		function moveLaser()
		{
			switch (laserDirection) 
			{
				case headDirection.up:
					laserY -= laserSpeed;
					laser.style.transform = 'rotate(270deg)';
					break;

				case headDirection.down:
					laserY += laserSpeed;
					laser.style.transform = 'rotate(90deg)';
					break;	

				case headDirection.left:
					laserX -= laserSpeed;
					laser.style.transform = 'rotate(180deg)';
					break;
					
				case headDirection.right:
					laserX += laserSpeed;
					laser.style.transform = 'rotate(0deg)';
					break;	

			}

			

			laser.style.left = `${laserX}px`;
			laser.style.top = `${laserY}px`;

			if (checkCollisionWithEnemy(laserX, laserY))
			{
				laser.style.opacity = 0;
				setTimeout(() => laser.remove(), 100);
			}

			if (laserX < 0 || laserX > bordWidth || laserY < 0 || laserY > bordHeight)
			{

				laser.style.opacity = 0;
				//on supprime l'élément laser du DOM
				laser.remove();

			}
			else
			{
				requestAnimationFrame(moveLaser);
			}
		}
		requestAnimationFrame(moveLaser);
	}

	function enemyManagement(enemy)
	{
		const enemySpeed = 2;
		
		let enemyX = parseInt(enemy.style.left) || Math.floor(Math.random() * bordWidth - 50);
		let enemyY = parseInt(enemy.style.top) || Math.floor(Math.random() * bordHeight - 50);

		enemy.style.left = `${enemyX}px`;
		enemy.style.top = `${enemyY}px`;

		let directionX = (Math.random() > 0.5) ? 1 : -1;
		let directionY = (Math.random() > 0.5) ? 1 : -1;

		function moveEnemy()
		{

			enemyX += enemySpeed * directionX;
			enemyY += enemySpeed * directionY;

			if (enemyX <= 0 || enemyX > bordWidth - 50)
			{
				directionX *= -1;
			}

			if (enemyY <= 0 || enemyY > bordHeight - 50)
			{
				directionY *= -1;
			}


			enemy.style.left = `${enemyX}px`;
			enemy.style.top = `${enemyY}px`;

			requestAnimationFrame(moveEnemy);

		}

	

		function EnemyShoot(enemy)
		{
			const projectile = document.createElement('div');
			projectile.classList.add('enemy_projectile');
			gameBoard.appendChild(projectile);

			projectile.style.opacity = 1;

			let projectileX = parseInt(enemy.style.left);
			let projectileY = parseInt(enemy.style.top);

			//recupérer la position de la tête du serpent

			let playerX = snakeParts[0].x;
			let playerY = snakeParts[0].y;

			//calculer la direction du projectile
			let diffX = playerX - projectileX;
			let diffY = playerY - projectileY;

			//Normaliser le vecteur de direction
			const magnitude = Math.sqrt(diffX * diffX + diffY * diffY);
			const directionX = diffX / magnitude;
			const directionY = diffY / magnitude;

			const projectileSpeed = 5;

			function moveProjectile()
			{

				projectileX += projectileSpeed * directionX;
				projectileY += projectileSpeed * directionY;

				projectile.style.left = `${projectileX}px`;
				projectile.style.top = `${projectileY}px`;

				if (checkCollisionWithSnake(projectileX, projectileY))
				{
					projectile.style.opacity = 0;
					destroyLastSnakePart();
					projectile.remove();
				}

				if (projectileX < 0 || projectileX > bordWidth || projectileY < 0 || projectileY > bordHeight)
				{
					//meme chose, on retire l'élément projectile du DOM quand il atteint les limites du plateau de jeu
					projectile.style.opacity = 0;
					projectile.remove();
					
				}
				else
				{
					requestAnimationFrame(moveProjectile);
				}
			}
			requestAnimationFrame(moveProjectile);
		}

		requestAnimationFrame(moveEnemy);
		moveEnemy();

		const shootingInterval = setInterval(() => EnemyShoot(enemy), 2000);
		enemy.shootingInterval = shootingInterval;

	}

	function checkCollisionWithSnake(projectileX, projectileY)
	{
		const toleranceThreshold = 10;

		for (let i= 0; i < snakeParts.length; i++)
		{
			const part = snakeParts[i];

			if (Math.abs(projectileX - part.x) < toleranceThreshold && Math.abs(projectileY - part.y) < toleranceThreshold)
			{

				return true;
			}

		}
		return false;
	}

	function destroyLastSnakePart()
	{
		if (snakeParts.length > 1) // on ne peut pas détruire la tête du serpent
		{
			//on retire le dernier élément du tableau snakeParts
			snakeParts.pop();

			const lastBodyPart = bodyElements.pop();
			lastBodyPart.remove();

			updateSnakePartScore();

		}
	}

	function spawnEnemy()
	{
		const newEnemy = document.createElement('div');
		newEnemy.classList.add('enemy');

		newEnemy.id = `enemy_${Date.now()}`;
		gameBoard.appendChild(newEnemy);

		let enemyX = Math.floor(Math.random() * bordWidth - 50);
		let enemyY = Math.floor(Math.random() * bordHeight - 50);

		newEnemy.style.left = `${enemyX}px`;
		newEnemy.style.top = `${enemyY}px`;

		enemyManagement(newEnemy);
	}

	function killEnemy(enemy)
	{
		clearInterval(enemy.shootingInterval);
		updateEnemyKillScore();
		enemy.remove();
		spawnEnemy();

	}

	function updateEnemyKillScore()
	{
		const enemyKillScoreElement = document.getElementById('destroyed_enemies_score');
		let enemyKillScore = parseInt(enemyKillScoreElement.textContent);
		enemyKillScore += 1;
		enemyKillScoreElement.textContent = enemyKillScore;		
	}

	function checkCollisionWithEnemy(laserX, laserY) 
	{
		const enemies = document.querySelectorAll('.enemy');
		const toleranceThreshold = 20;

		for (let enemy of enemies)
		{
			const enemyX = parseInt(enemy.style.left);
			const enemyY = parseInt(enemy.style.top);

			if (Math.abs(laserX - enemyX) < toleranceThreshold && Math.abs(laserY - enemyY) < toleranceThreshold)
			{
				killEnemy(enemy);
				return true;
			}
		}
		return false;
	}
});