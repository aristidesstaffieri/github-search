import React from 'react'
import P from 'prop-types'
import numeral from 'numeral'

class ActiveRepo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { repo } = this.props
    return repo
      ? (
        <div className="active_repo">
          <div className="active_repo_title_row">
            <div>
              <h1>{ repo.name }</h1>
              <h5>by { repo.owner.login }</h5>
            </div>
            <div className="active_repo_stats">
              <div>{ `stars: ${numeral(repo.stargazers_count).format('0a')}` }</div>
              <div>{ `score: ${numeral(repo.score).format('0.0')}` }</div>
            </div>
          </div>
          <div className="active_repo_info">
            <div>
              <p>Primary Language - { repo.language }</p>
              <p>{ repo.license ? repo.license.name : 'License Unknown' }</p>
            </div>
            <div>
              <p>{ repo.private ? 'private repository' : 'public repository' }</p>
              <p>{ repo.watchers_count} active watchers</p>
            </div>
          </div>
          <div className="active_repo_info">
            <div>
              <p>{ `git clone ${ repo.clone_url }`}</p>
            </div>
            <div>
              <p>{ repo.forks_count } forks</p>
            </div>
          </div>
          <div className="active_repo_desc">
            <p>{ repo.description }</p>
          </div>
        </div>
      )
      : (
        <div className="active_repo_empty">
          <h1>Explore Github Repositories</h1>
        </div>
      )
  }
}

ActiveRepo.propTypes = {
  repo: P.object
}

export default ActiveRepo
