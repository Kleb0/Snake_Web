class Apple
{

	constructor(gameBoard)
	{
		console.log('Apple created');
		this.gameBoard = gameBoard;

		//create an instance of the specified tag
		this.appleElement = document.createElement('div');
		this.appleElement.classList.add('apple');
		this.gameBoard.appendChild(this.appleElement);
		this.placeApple();
	}


	placeApple()
	{
		const maxPosX = this.gameBoard.clientWidth - 50;
		const maxPosY = this.gameBoard.clientHeight - 50;

		const randomX = Math.floor(Math.random() * maxPosX);
		const randomY = Math.floor(Math.random() * maxPosY);

		this.appleElement.style.left = `${randomX}px`;
		this.appleElement.style.top = `${randomY}px`;
	}
}

//instruction export is used during the creation of javascript modules
//here we are exporting our whole class apple so that, it can be imported and instantiated in the main file. 

export default Apple;