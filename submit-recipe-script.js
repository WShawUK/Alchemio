export function submitRecipe() {
    const submitRecipeForm = document.getElementById('enter-recipe-box').querySelector('form')
    const submitButton = document.getElementById('submit-recipe-button')
    const nameInput = submitRecipeForm.children[0].querySelector('input')
    const ingredientsList = submitRecipeForm.children[1].querySelector('ol')
    const instructionsList = submitRecipeForm.children[2].querySelector('ol')
    const usernameInput = document.getElementById('submit-recipe-box').querySelector('input')
    const tagsInput = document.getElementById('tags-input')

    // this is what the data obj looks like
    let recipeEntryData = {
        type : 'recipe',
        recipeName : '',
        ingredients : '',
        ingredientsCount : 1,
        instructions : '',
        instructionsCount : 1,
        tags : '',
        username : 'anon',
        timeSubmitted : '',
        upvotes : 0
    }
    
    // construct data obj
    recipeEntryData.recipeName = nameInput.value
    if (/^[\s\r\n]*$/.test(recipeEntryData.recipeName)){
        window.alert('please include a name')
        return
    }

    let ingredientsString = ''
    for (let ingredient of ingredientsList.children){
        if (/^[\s\r\n]*$/.test(ingredient.textContent)){
            window.alert('please dont include empty ingredient slots')
            return
        }
        if (/\|/.test(ingredient.textContent)){
            window.alert('please dont include pipe characters')
            return
        }
        ingredientsString = ingredientsString + `${ingredient.textContent}|`
    }
    recipeEntryData.ingredients = ingredientsString.slice(0, -1)
    recipeEntryData.ingredientsCount = ingredientsList.children.length

    let instructionsString = ''
    for (let instruction of instructionsList.children){
        if (/^[\s\r\n]*$/.test(instruction.textContent)){
            window.alert('please dont include empty instruction slots')
            return
        }
        if (/\|/.test(instruction.textContent)){
            window.alert('please dont include pipe characters')
            return
        }
        instructionsString = instructionsString + `${instruction.textContent}|`
    }
    recipeEntryData.instructions = instructionsString.slice(0, -1)
    recipeEntryData.instructionsCount = instructionsList.children.length

    recipeEntryData.tags = tagsInput.value

    if (usernameInput.value){
        recipeEntryData.username = usernameInput.value
    }

    const currentDate = new Date()
        let currentDateDay = (currentDate.getDate() + 1).toString()
        if (currentDateDay.length == 1){
            currentDateDay = `0${currentDateDay}`
        }

        let currentDateMonth = (currentDate.getMonth() + 1).toString()
        if (currentDateMonth.length == 1){
            currentDateMonth = `0${currentDateMonth}`
        }
    recipeEntryData.timeSubmitted = `${currentDateDay}:${currentDateMonth}:${currentDate.getFullYear()}`


    // perform fetch
    const APIFetch = fetch('https://tjjte32ws4pvoihteuzode4k2u0jwupu.lambda-url.eu-north-1.on.aws/', {
    method: 'POST',
    body: JSON.stringify(recipeEntryData)
    })

    let APIFetchJSON = APIFetch.then((fetchResolution) => {  //this returns a promise of converting the api data to a JSON
    if (fetchResolution.ok){
        console.log('successful API call')

        // remove visible entry data
        submitRecipeForm.reset()
        ingredientsList.innerHTML = '<li></li>'
        instructionsList.innerHTML = '<li></li>'

        // show success
        submitButton.innerHTML = 'Submission Successful!'
        setTimeout(() => {
            submitButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M470.3 271.15L43.16 447.31a7.83 7.83 0 01-11.16-7V327a8 8 0 016.51-7.86l247.62-47c17.36-3.29 17.36-28.15 0-31.44l-247.63-47a8 8 0 01-6.5-7.85V72.59c0-5.74 5.88-10.26 11.16-8L470.3 241.76a16 16 0 010 29.39z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>'
        }, 2000)
        return fetchResolution.json()
    }
    else {
        console.log('API call failed', fetchResolution.status, fetchResolution.statusText)
        submitButton.innerHTML = 'Submission Failed :('
        setTimeout(() => {
            submitButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M470.3 271.15L43.16 447.31a7.83 7.83 0 01-11.16-7V327a8 8 0 016.51-7.86l247.62-47c17.36-3.29 17.36-28.15 0-31.44l-247.63-47a8 8 0 01-6.5-7.85V72.59c0-5.74 5.88-10.26 11.16-8L470.3 241.76a16 16 0 010 29.39z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>'
        }, 2000)
    }
    })

    APIFetchJSON.then((JSONResolution) => console.table(JSONResolution)) // this receives the promise and prints the returned JSON
}