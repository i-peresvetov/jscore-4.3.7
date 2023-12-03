// нужно сокращение имени, если имя слишком большое
// автокомплит сначала скрыт
// если набрано что-то, то он появляется


let fiveRepos

const debounce = (fn, debounceTime) => {
    let bounces = 0
    return function(...args) {
        let newF = fn.bind(this)
        bounces++
        setTimeout(function(){
            if (bounces === 1) newF(...args)
            bounces--
        }, debounceTime)
    }
};

async function searchRepo(searchStr) {
    let searchResult = await fetch(`https://api.github.com/search/repositories?q=${searchStr}`)
    if (searchResult.ok) {
        let autoComlite = document.querySelector('.search__autocomplite')
        const resultProm = searchResult.json()
        console.log(resultProm)
        resultProm.then((result) => {
            result.items.slice(0, 5).forEach(function(repo) {
                let newLi = document.createElement('li')
                newLi.textContent = repo.name
                newLi.classList.add('search__result')
                autoComlite.appendChild(newLi)
                console.log(repo.name)
            })
            // console.log(result.items.slice(0, 5))
            // fiveRepos = result.items.slice(0, 5)
        })
    } else {
        console.log(`Ошибка HTTP: ${searchResult.status}`)
    }
}

const searchRepoDebounce = debounce(searchRepo, 1000)
const searchInput = document.querySelector('.search__input')

searchInput.addEventListener('input', function(e) {
    searchRepoDebounce(e.target.value)    
})

const testButton = document.querySelector('button')
testButton.addEventListener('click', function(e) {
    addRepo(fiveRepos[0])
})

function addRepo(repo) {
    let pinnedRepo = document.querySelector('.search__template').content
    let name = pinnedRepo.querySelector('.pinnedrepo__name')
    let owner = pinnedRepo.querySelector('.pinnedrepo__owner')
    let stars = pinnedRepo.querySelector('.pinnedrepo__stars')
    name.textContent = `Name: ${repo.name}`
    owner.textContent = `Owner: ${repo.owner.login}`
    stars.textContent = `Stars: ${repo.stargazers_count}`    
    
    let listOfRepost = document.querySelector('.search__pins')
    listOfRepost.append(pinnedRepo)
}