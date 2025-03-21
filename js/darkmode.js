let darkmode = localStorage.getItem('dark-mode')
const themeSwitch = document.getElementById('theme-switch')


const enableDarkMode = () => {
    document.body.classList.add('dark-mode')
    localStorage.setItem('dark-mode', 'active')
}

const disableDarkMode = () => {
    document.body.classList.remove('dark-mode')
    localStorage.setItem('dark-mode', null)
}

if (darkmode === 'active') {
    enableDarkMode()
}

themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem('dark-mode')
    darkmode !== "active" ? enableDarkMode() : disableDarkMode()
})
