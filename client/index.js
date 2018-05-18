import React from 'react'
import P from 'prop-types'
import ReactDOM from 'react-dom'
import queryString from 'query-string'

import Search from './components/search.js'
import './styles/main.css'

const SERVER_URL = 'http://localhost:3000/repos'

class Repos extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      repos: [],
      search: {
        q: '',
        sort: 'stars',
        order: 'desc'
      }
    }

    this.getRepos = this.getRepos.bind(this)
    this.setSearch = this.setSearch.bind(this)
    this.validateSearch = this.validateSearch.bind(this)
  }

  validateSearch(key, val) {
    if (key === 'sort' && val !== 'stars' && val !== 'score') {
      throw(`${key} must be stars or scores`)
      return false
    }

    if (key === 'order' && val !== 'desc' && val !== 'asc') {
      throw(`${key} must be decs or asc`)
      return false
    }

    return true
  }

  getRepos() {
    const params = queryString.stringify(this.state.search)
    const url = `${SERVER_URL}?${params}`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({
          repos: data.items
        })
      })
      .catch(err => {
        throw(err)
      })
  }

  setSearch(key, val) {
    if (this.validateSearch(key, val)) {
      this.setState({
        search: Object.assign(
          {},
          this.state.search,
          { [key]: val }
        )
      })
    }

  }

  render() {
    return [
      <div className="repo_search_container">
        <div className="search_container">
          <Search
            value={ this.state.search.q }
            onChange={ this.setSearch }
            onFormSubmit={ this.getRepos } />
        </div>
        <div className="repo_list_container">
          {
            this.state.repos.map((repo, i) => {
              return <div key={i}>{ repo.name }</div>
            })
          }
        </div>
      </div>,
      <div className="selected_repo_container">

      </div>
    ]
  }
}


var mountNode = document.getElementById('app')
ReactDOM.render(<Repos />, mountNode)
