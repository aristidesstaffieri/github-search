import React from 'react'
import P from 'prop-types'
import ReactDOM from 'react-dom'
import queryString from 'query-string'
import ScrollArea from 'react-scrollbar'
import numeral from 'numeral'

import Search from './components/search.js'
import Repo from './components/repo.js'
import ActiveRepo from './components/active_repo.js'

import './styles/main.css'

const LANG_QUICK_FILTERS = [
  'react',
  'javascript',
  'clojure',
  'elixir',
  'go',
  'Rust',
  'Node.js'
]

const SERVER_URL = 'http://localhost:3000/repos'

class Repos extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      repos: [],
      search: {
        q: '',
        sort: 'stars', // or score
        order: 'desc' // or asc
      },
      activeLangFilters: [],
      isLoadingSearch: false,
      activeRepo: null
    }

    this.getRepos = this.getRepos.bind(this)
    this.setSearch = this.setSearch.bind(this)
    this.validateSearch = this.validateSearch.bind(this)
    this.setOrder = this.setOrder.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.setSort = this.setSort.bind(this)
    this.setActiveRepo = this.setActiveRepo.bind(this)
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
    this.setState({ isLoadingSearch: true })

    let search = Object.assign({}, this.state.search)
    if (search.sort === 'score') {
      delete search.sort //score only works as default sort
    }
    const params = queryString.stringify(search)
    const url = `${SERVER_URL}?${params}`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({
          repos: data.items,
          isLoadingSearch: false
        })
      })
      .catch(err => {
        this.setState({ isLoadingSearch: false })
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

  setOrder() {
    const newOrder = this.state.search.order === 'desc'
      ? 'asc'
      : 'desc'

    this.setSearch('order', newOrder)
  }

  setFilter(filter) {
    const { activeLangFilters } = this.state
    const newFilters = activeLangFilters.indexOf(filter) >= 0
      ? activeLangFilters.filter(f => f !== filter)
      : activeLangFilters.concat(filter)

    this.setState({
      activeLangFilters: newFilters
    })
  }

  setSort(filter) {
    const newOrder = this.state.search.sort === 'stars'
      ? 'score'
      : 'stars'

    this.setSearch('sort', newOrder)
  }

  setActiveRepo(repoId) {
    this.setState({
      activeRepo: repoId
    })
  }

  render() {
    const { activeLangFilters, search, isLoadingSearch, repos, activeRepo } = this.state
    const activeRepoObj = repos.find( repo => repo.id === activeRepo)

    return [
      <div className="repo_search_container" key="repo_search">
        <div className="search_container">
          <Search
            value={ this.state.search.q }
            filters={ LANG_QUICK_FILTERS }
            activeFilters={ activeLangFilters }
            activeOrder={ search.order }
            activeSort={ search.sort }
            onChange={ this.setSearch }
            onFormSubmit={ this.getRepos }
            setOrder={ this.setOrder }
            setFilter={ this.setFilter }
            setSort={ this.setSort }
            isLoading={ isLoadingSearch } />
        </div>
        <div className="repo_list_container">
          {
            repos.map((repo, i) => {
              return (
                <Repo
                  key={ `${repo.name}_${i}` }
                  repo={ repo }
                  active={ activeRepoObj && activeRepoObj.id === repo.id }
                  clickRepo={ this.setActiveRepo } />
              )
            })
          }
        </div>
      </div>,
      <div className="selected_repo_container" key="repo_container">
        <ActiveRepo
          repo={ activeRepoObj } />
      </div>
    ]
  }
}

var mountNode = document.getElementById('app')
ReactDOM.render(<Repos />, mountNode)
