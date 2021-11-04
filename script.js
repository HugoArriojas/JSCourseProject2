// Creating the namespace for the  app
const alphaAlcs = {}

// Showing main content once the start button is pressed on splash screen
alphaAlcs.start = () => {
    $(".start").on("click", () => {
        $(".content").toggleClass("content", "contentShow")
        $(".splash").toggleClass("content", "splash")
    })
}

// function to remove null from arrays
const removeNull = (array) => {
    return array.filter(x => x !== null)
}

// Making random letter function (excluding letters without entries in the API)
alphaAlcs.letterRandomizer = () => {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "v", "w", "y", "z", "1", "2", "3", "4", "5", "6", "7", "9"];
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    return randomLetter;
}

// Making a randomizer function for arrays
alphaAlcs.arrayRandomizer = (array) => {
    const randomArr = array[Math.floor(Math.random() * array.length)];
    return randomArr
}

//  Saving Giphy API key
alphaAlcs.giphyApiKey = "bT4cKp5t3W32Z0y3nvvnDyW6I3neAsH2"

//   AJAX call for Giphy to obtain "alcohol" related GIF
alphaAlcs.retrieveGif = function () {
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/search",
        method: "GET",
        dataType: "json",
        data: {
            api_key: alphaAlcs.giphyApiKey,
            q: "alcohol"
        }
    }).then(function (gifData) {
        // Randomizing which gif is chosen and then displayed
        const randomGif = alphaAlcs.arrayRandomizer(gifData.data);
        alphaAlcs.displayGif(randomGif);
    });
}

// Displaying gif on page and adding alt text
alphaAlcs.displayGif = function (gif) {
    $("img.drinkGif").attr("src", gif.images.original.url)
    $("img.drinkGif").attr("alt", gif.title)
}


// Function to display the results of the request to the page
alphaAlcs.displayResults = drinks => {
    // data returns an object with an array, have to target array with .drinks
    drinks.drinks.forEach(drink => {
        // converting the ingredients into their own object
        // NOTE: I don't know how to extract items from an object into another, this is to be fixed
        const ingredientObject = (({ strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient15 }) => ({ strIngredient1, strIngredient2, strIngredient3, strIngredient4, strIngredient5, strIngredient6, strIngredient7, strIngredient8, strIngredient9, strIngredient10, strIngredient11, strIngredient12, strIngredient13, strIngredient14, strIngredient1 }))(drink);
        // converting the ingredient object into an ingredient array without nulls
        const ingredientArray = removeNull(Object.values(ingredientObject));
        // Making the array show up vertically in the HTML
        const ingredientVertical = ingredientArray.join("\n")

        // converting the measurements into their own object
        const measureObject = (({ strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5, strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10, strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure15 }) => ({ strMeasure1, strMeasure2, strMeasure3, strMeasure4, strMeasure5, strMeasure6, strMeasure7, strMeasure8, strMeasure9, strMeasure10, strMeasure11, strMeasure12, strMeasure13, strMeasure14, strMeasure1 }))(drink);
        // converting the measurements object into an array without nulls
        const measureArray = removeNull(Object.values(measureObject));
        // Making the array show up vertically in the HTML
        const measureVertical = measureArray.join("\n")

        // This is the HTML to be appended to the page (name, image, ingredients, and measurements)
        const htmlToAdd = `
       <div class="drinkOption">
            <h2 class="drinkName">${drink.strDrink}</h2>
            <div class="drinkImage">
              <img src="${drink.strDrinkThumb}" alt="Image of ${drink.strDrink} cocktail">
            </div>
            <h3>Ingredients</h3> 
            <div class="instructions">
              <p class="ingredients">${ingredientVertical}</p>
              <p class="measures">${measureVertical}</p>              
            </div>
        </div>
        `
        // Attaching the html to the page in the drink container
        $(".drinkContainer").append(htmlToAdd);
    })
}

// Ajax request for the cocktail API and wrapped it in the method that we can put in the init function 
alphaAlcs.retrieveData = (query) => {
    $.ajax({
        // Put in query in order to make the search dynamic
        // Note: had some trouble putting this under data: {f:} might need to fix in the future?
        url: `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${query}`,
        method: "GET",
        dataType: "json"
    }).then(function (data) {
        //   Error handling in case the API does not have cocktails under a certain letter
        if (data.drinks == null) {
            $(".drinkContainer").append("<h2>Unfortunately there are no results under this character in the API, try again!</h2>");
        } else {
            alphaAlcs.displayResults(data);
        }
    })
}

// Function to save selected user letter from input box
alphaAlcs.getSelectedLetter = () => {
    $("form").on("submit", (e) => {
        // Stop form from refreshing
        e.preventDefault();
        // Save submitted letter in selection var
        const selection = $("input#letterPicked").val()
        // Error handling: making sure user places one letter at a time in input box
        if (selection.length > 1) {
            alert("Please please, one letter at a time!")
        } else {
            // Passing selection through to the ajax call
            $(".drinkContainer").empty()
            alphaAlcs.retrieveData(selection);
            // Loading a new gif for the page
            alphaAlcs.retrieveGif();
        }
    })
    // Random letter button event listener + calls for a new GIF
    $(".randomButton").on("click", (r) => {
        $(".drinkContainer").empty();
        alphaAlcs.retrieveData(alphaAlcs.letterRandomizer());
        alphaAlcs.retrieveGif();
    })
}

// Initializing method that loads splash page and readies gif + letter selection functions
alphaAlcs.init = function () {
    alphaAlcs.start();
    alphaAlcs.getSelectedLetter();
    alphaAlcs.retrieveGif();
}

// Document ready function calling the init method
$(function () {
    alphaAlcs.init();
})




