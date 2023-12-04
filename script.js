// нужно сокращение имени в списке и пине, если имя слишком большое
// скрытие списка, если ничего не введено - отловить баг того что что-то появляется
//// появляется если добавить символ и сразу удалить
//// надо сделать что бы если в поиске пусто - поиск не происходил
// запретить ввод пробела
//// сообщение о пробеле
// сообщение о проблеме с сетью при её отсутствии


// удаление из пина по нажатию на крест


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
    const searchInput = document.querySelector('input')
    if (searchResult.ok) {
        let autoComlite = document.querySelector('.search__autocomplite')
        const resultProm = searchResult.json()
        autoComlite.replaceChildren()
        resultProm.then((result) => {
            result.items.slice(0, 5).forEach(function(repo) {                
                let newLi = document.createElement('li')
                newLi.textContent = repo.name
                newLi.classList.add('search__result')
                newLi.dataset.name = repo.name
                newLi.dataset.owner = repo.owner.login
                newLi.dataset.stars = repo.stargazers_count
                autoComlite.appendChild(newLi)
            })
        })
    } else {
        console.log(`Ошибка HTTP: ${searchResult.status}`)
    }
}

const searchRepoDebounce = debounce(searchRepo, 400)

const searchInput = document.querySelector('.search__input')
searchInput.addEventListener('input', function(e) {
    let autoComlite = document.querySelector('.search__autocomplite')
    if (e.target.value === '') {
        autoComlite.replaceChildren()
    } else {
        searchRepoDebounce(e.target.value)
    }
})

function addRepo(repName, repOwner, repStars) {
    let pinnedRepo = document.querySelector('.search__template').content.cloneNode(true)
    let name = pinnedRepo.querySelector('.pinnedrepo__name')
    let owner = pinnedRepo.querySelector('.pinnedrepo__owner')
    let stars = pinnedRepo.querySelector('.pinnedrepo__stars')
    name.textContent = `Name: ${repName}`
    owner.textContent = `Owner: ${repOwner}`
    stars.textContent = `Stars: ${repStars}`    
    let listOfRepost = document.querySelector('.search__pins')
    listOfRepost.append(pinnedRepo)
}

const autoComliteZone = document.querySelector('.search__autocomplite')
autoComliteZone.addEventListener('click', function(e) {
    addRepo(e.target.dataset.name, e.target.dataset.owner, e.target.dataset.stars)
})

const searchPins = document.querySelector('.search__pins')
searchPins.addEventListener('click', function (e) {
    if (e.target.classList.contains('pinnedrepo__deleterepo')) {
        console.log(e.target)
        console.log(e.target.closest('.pinnedrepo'))
    }
})