const state ={
   score:{
      playerScore:0,
      computerScore:0,
      scoreBox:document.getElementById('score_points'),
   },
   cardSprites:{
      avatar: document.getElementById('card-image'),
      name:document.getElementById('card-name'),
      type:document.getElementById('card-type'),
   },
   fieldCards:{
      player:document.getElementById('player-field-card'),
      computer:document.getElementById('computer-field-card'),
   },
   actions:{
      button:document.getElementById('next-duel'),
   },
   playersSide :{
   player1:"player-cards",
   player1Box:document.querySelector("#player-cards"),
   computer:"computer-cards",
   computerBox:document.querySelector("#computer-cards"),

}
}

const pathImage = '../src/assets/icons/';

const cardData = [
   {
      id:0,
      name:"Blue Eyes White Dragon",
      type:"Paper",
      img: `${pathImage}dragon.png`,
      WinOf:[1],
      LoseOf:[2],
   },
   {
      id:1,
      name:"Exodia",
      type:"Rock",
      img: `${pathImage}exodia.png`,
      WinOf:[2],
      LoseOf:[0],
   },
   {
      id:2,
      name:"Dark Magician",
      type:"Cut",
      img: `${pathImage}magician.png`,
      WinOf:[0],
      LoseOf:[1],
   },
]

const bgm = document.getElementById('bgm');
bgm.play()

async function getRandomCardId(){
   const randomIdCard = Math.floor(Math.random()*cardData.length);
   return cardData[randomIdCard].id;
}

async function drawSelectedCard(index){
   state.cardSprites.avatar.src=cardData[index].img;
   state.cardSprites.name.innerHTML=cardData[index].name;
   state.cardSprites.type.innerHTML= "Attribute : "+cardData[index].type;
}
async function createCardImage(idCard,fieldSide){
   const cardImage = document.createElement('img');
   cardImage.setAttribute("height","100px");
   cardImage.setAttribute("src",`${pathImage}card-back.png`);
   cardImage.setAttribute("data-id",idCard);
   cardImage.classList.add("card");
   if (fieldSide === state.playersSide.player1){
      cardImage.addEventListener("click",()=>{
         setCardField(cardImage.getAttribute("data-id"));
      })

      cardImage.addEventListener("mouseover",()=>{
         drawSelectedCard(idCard);
      })
   }
   return cardImage;

}

async function removeAllCardsImages(){
   const {computerBox, player1Box} =state.playersSide;
   let imgElements = computerBox.querySelectorAll("img");
   imgElements.forEach((img)=>img.remove());

   imgElements = player1Box.querySelectorAll("img");
   imgElements.forEach((img)=>img.remove());
}

async function checkDuel(playerCardId,computerCardId){
   let duelResults="Draw";
   let playerCard = cardData[playerCardId];
   let computerCard = cardData[computerCardId];
   if(playerCard.WinOf.includes(computerCardId)){
      duelResults="Win";
      state.score.playerScore++;
      playAudio(duelResults);
   }else if(playerCard.LoseOf.includes(computerCardId)){
      duelResults="lose";
      state.score.computerScore++;
      playAudio(duelResults);
   }
   duelResults= duelResults.toUpperCase();
   await drawButton(duelResults);
   return duelResults;
}

async function drawButton(duelResults){
   state.actions.button.innerHTML = duelResults;
   state.actions.button.style.display = "block";
}
async function updateScore(){
   state.score.scoreBox.innerHTML = `Win : ${state.score.playerScore} | Lose : ${state.score.computerScore}`
}

async function setCardField(cardId){
   await removeAllCardsImages();
   let computerCardId = await getRandomCardId();

   await cardFieldImagesVisible(true)


   await drawCardsInField(cardId, computerCardId)

   let duelResults = await checkDuel(cardId,computerCardId);
   await updateScore();
//   await drawResult(duelResults)
}

async function drawCardsInField(cardId, computerCardId){
   state.fieldCards.player.src = cardData[cardId].img;
   state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function drawCards(cardNumbers, fieldSide){
   for (let i = 0; i < cardNumbers; i++) {
      const randomIdCard = await getRandomCardId();
      const cardImage = await createCardImage(randomIdCard,fieldSide);
      document.getElementById(fieldSide).appendChild(cardImage);
   }
}


async function resetDuel(){
   await hiddenCardDetails();
   state.actions.button.style.display = "none";

   await init();

}

async function hiddenCardDetails(){
   state.cardSprites.avatar.src="";
   state.cardSprites.name.innerHTML="";
   state.cardSprites.type.innerHTML="";
}
async function playAudio(status){
   const audio = new Audio(`./src/assets/audios/${status}.wav`);
   audio.play();
}

async function cardFieldImagesVisible(value){
   if (value){
      state.fieldCards.player.classList.remove("hidden")
      state.fieldCards.computer.classList.remove("hidden")
   }else{
      state.fieldCards.player.classList.add("hidden")
      state.fieldCards.computer.classList.add("hidden")
   }

}
async function init(){
   await cardFieldImagesVisible(false)
   await drawCards(5, state.playersSide.player1);
   await drawCards(5, state.playersSide.computer);
}


init();