window.onload = () => {
  const h2 = document.createElement('h2')

  // h2.innerText = 'GitHub User Explorer'
  // document.body.appendChild(h2)

  const username = "Cu7ious"
  // const url = '//porpoise.holberton.us'

  // fetch(url + '/repo', {method: 'POST'})
  fetch(`https://api.github.com/users/${username}`)
    .then(res => {
      return res.json()
    })
    .then(user => {
      console.log('user:', user)
      const {
        avatar_url,
        login,
        name,
      } = user

      let {
        bio,
        company,
        email,
        location,
        blog,
        public_repos,
        followers,
        following
      } = user

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

      fetch(user.repos_url)
        .then(res => {
          return res.json()
        })
        .then(repos => {
          console.log('repos:', repos)
          const reposDiv = document.getElementById('repos')

          if (repos.length > 0) {

            repos.forEach((repo, idx) => {

              if (idx === 0) {
                fetch(`${repo.url}/stats/commit_activity`)
                .then(res => {
                    return res.json()
                  })
                  .then(activities => {
                    console.log(activities)
                  })
              }

              const {
                full_name,
                html_url
              } = repo

              let {
                private,
                fork,
                forks,
                forks_count,
                pushed_at,
                updated_at
              } = repo

              reposDiv.innerHTML = reposDiv.innerHTML + `
                <article>
                  <h5><a href="${html_url}">${full_name}</a></h5>
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
    })
}
