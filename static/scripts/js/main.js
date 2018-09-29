// Handlers {
  function handleRepoClick (e) {
    e.preventDefault()
    const baseUrl = window.location.origin
    const repoName = e.target.getAttribute('data-full_name')

    const repoURL = e.target.getAttribute('data-url')

    loadRepoView(repoURL)
    // loadRepoView(`${baseUrl}/${repoName}`)
    window.location.href = baseUrl + '#' + repoName
  }
// Handlers END }

// Views {
  function loadHomeView (e) {
    e.preventDefault()
    console.log("loadHomeView")
    const baseUrl = window.location.origin
    window.location = baseUrl
  }

  function loadRepoView (repoURL) {

    fetch(`${repoURL}/stats/commit_activity`)
    // fetch(window.location.origin + '/src/js/mock-repo-activity.json')
      .then(res => {
        return res.json()
      })
      .then(activities => {
        if (!activities.length) {
          loadRepoView(repoURL)
          return
        }

        const actDiv = document.getElementById('stage')
        const acts = ['<div id="repo-activity" class="column"><div class="repo-activity-wrapper">']

        activities.forEach(act => {
          acts.push('<ul>')
          act.days.forEach(day => {
            let className = 'grey-zero'

            if (day > 0) {
              className = 'green'
            }

            acts.push(`<li class="${className}"></li>`)
          })
          acts.push('</ul>')
        });
        acts.push('</div></div>')

        actDiv.innerHTML = acts.join('')
      })
  }
// Views END }


// Everything begins here
window.onload = () => {
  const username = "sanjurosaves"
  const actualUrl = 'http://porpoise.holberton.us'

  // To grab user & repos
  fetch(actualUrl + '/repo', {method: 'GET'})
       .then(res => {
         return res.json()
       })
       .then(function(data) {
         const { user, repos } = data
         console.log(data)
         console.log(user)
         console.log(repos)
		 return [user, repos];
       })
    .then(function(newData) {
      const {
        avatar_url,
        login,
        name,
      } = newData[0]

      let {
        bio,
        company,
        email,
        location,
        blog,
        public_repos,
        followers,
        following
      } = newData[0]

      bio = bio ? `<p>${bio}</p>` : null
      company = company ? `<li>${company}</li>` : null
      email = email !== 'null' ? `<li>${email}</li>` : null
      location = location ? `<li>${location}</li>` : null
      blog = blog ? `<li>${blog}</li>` : null
      public_repos = public_repos ? `<li>${public_repos}</li>` : null
      followers = followers ? `<li>${followers}</li>` : null
      following = following ? `<li>${following}</li>` : null

      const userDiv = document.getElementById('user')
      userDiv.innerHTML = `
        <figure>
            <img id="avatar_url" src="${avatar_url}" alt="${login}">
        </figure>
        <h3>${name}</h3>
        <h4>${login}</h4>
        ${bio}
        <div class="user-extras">
            <ul>
              ${company}
              ${email}
              ${location}
              ${blog}
            </ul>
            <ul>
              ${public_repos}
              ${followers}
              ${following}
            </ul>
        </div>
      `
          console.log('repos:', newData[1])
          const reposDiv = document.getElementById('repos')

          if (newData[1].length > 0) {

            newData[1].forEach((repo, idx) => {

              if (idx === 0) {
                fetch(`${repo.url}/stats/commit_activity`)
                .then(function(res) {
                    return res.json()
                  })
                  .then(function(activities) {
                    console.log(activities)
                  })
              }

              const { html_url, url } = repo

				console.log(repo)

              let {
                full_name,
                private,
                fork,
                forks,
                forks_count,
                pushed_at,
                updated_at
              } = repo

              reposDiv.innerHTML = reposDiv.innerHTML + `
                <article>
                  <h5>
                    <a
                      data-full_name="${full_name}"
                      data-url="${url}"
                      href="#"
                      onClick="handleRepoClick(event)"
                    >
                      ${full_name}
                    </a>
                  </h5>
                  <div class="tags">
                      ${private}
                      ${fork}
                      ${forks}
                      ${forks_count}
                  </div>
                  <div class="time">
                      ${pushed_at}
                      ${updated_at}
                  </div>
                </article>
              `
            })
          } else {
            reposDiv.innerHTML = `<h4>No repos, nothing to show<h4>`
          }
       })
    }
