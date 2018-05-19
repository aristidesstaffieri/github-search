import React from 'react'
import P from 'prop-types'
import numeral from 'numeral'

class Repo extends React.Component {
  constructor(props) {
    super(props)
    this.clickRepo = this.clickRepo.bind(this)
  }

  clickRepo() {
    this.props.clickRepo(this.props.repo.id)
  }

  render() {
    const { active, repo } = this.props
    const { name, owner, stargazers_count, score } = repo
    return (
      <div className={ `repo ${active && 'active'}` } onClick={ this.clickRepo }>
        <div className="identity">
          <span>{ `${name} by ${owner.login}` }</span>
        </div>
        <div className="stats">
          <span>{ `stars: ${numeral(stargazers_count).format('0a')}` }</span>
          <span>{ `score: ${numeral(score).format('0.0')}` }</span>
        </div>
      </div>
    )
  }
}

Repo.propTypes = {
  repo: P.object,
  active: P.bool,
  clickRepo: P.func
}

Repo.defaultProps = {
  clickRepo: () => false //no op
}

export default Repo
