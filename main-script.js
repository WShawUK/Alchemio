import { submitRecipe } from './submit-recipe-script.js'

import { receiveRecentRecipes } from './search-and-render-script.js'
import { renderRecipeData } from './search-and-render-script.js'
import { renderCommentData } from './search-and-render-script.js'

import { addExpandableButtonUI } from './UI-script.js'
import { windowResizeEvent } from './UI-script.js'
import { submitCommentEvent } from './UI-script.js'
import { upvoteEvent } from './UI-script.js'



//nav redirect
document.getElementById('nav-div').firstElementChild.children[1].addEventListener('click', () => {
    window.location = 'https://wshawuk.github.io/Alchemio-search/'
})
document.getElementById('nav-div').firstElementChild.children[0].addEventListener('click', () => {
    window.location = 'https://wshawuk.github.io/Alchemio/'
})

// explanation div
const explanationDiv = document.getElementById('explanation-div')
explanationDiv.querySelector('img').addEventListener('click', (e) => {
    console.log('click')
    if (e.target.parentElement.style.maxHeight == '22px'){
        e.target.parentElement.style.maxHeight = explanationDiv.querySelector('p').offsetHeight + 30 + 'px'
        e.target.src = "./icons/remove-outline.svg"
    }
    else{
        e.target.parentElement.style.maxHeight = '22px'
        e.target.src ="./icons/add-outline.svg"
    }
})

//prompt of the day
const today = new Date() 
const todayAsNumber = (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(today.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000
fetch('daily prompts.txt')
.then(response => response.text())
.then(data => {
    const promptOfTheDay = data.split('\n')[todayAsNumber - 1]
    document.getElementById('prompt-of-the-day').querySelector('p').innerHTML = promptOfTheDay
})
.catch(error => console.error(error))


//must load all newly added recipes BEFORE adding the button expand stuff

//initial receive recent recipes code, imported functions
async function afterReceivingSearchData() { // receives json
    const receivedData = await receiveRecentRecipes()
    if (receivedData == 'search returned nothing'){
        window.alert('zero entries that fit search')
        return 
    }
    else if (receivedData){ // now render all UI elements, imported from UI-script.js
        renderRecipeData(receivedData)
        renderCommentData(receivedData)

        addExpandableButtonUI()
        windowResizeEvent()
        const allCommentButtons = document.querySelectorAll('.post-comment-button')
        for (let commentButton of allCommentButtons){
            commentButton.addEventListener('click', submitCommentEvent)
        }

        const allUpvoteButtons = document.querySelectorAll('.upvote-button')
        for (let upvoteButton of allUpvoteButtons){
            upvoteButton.addEventListener('click', upvoteEvent)
        }
    }
}
afterReceivingSearchData()








// submit recipe, imported function
const submitRecipeForm = document.getElementById('enter-recipe-box').querySelector('form')
const nameInput = submitRecipeForm.children[0].querySelector('input')

// recipe entry fix
const allRecipeEntryLists = submitRecipeForm.querySelectorAll('ol')
for (let recipeEntryList of allRecipeEntryLists){
    recipeEntryList.addEventListener('input', (e) => {
        if (e.target.children.length === 0){
            e.target.appendChild(document.createElement('li'))
        }
    })
}

nameInput.addEventListener('keydown', (e) => { // quick fix for pressing enter
    if (e.key === 'Enter') {
        e.preventDefault()
      }
})

document.getElementById("submit-recipe-button").addEventListener('click', submitRecipe)