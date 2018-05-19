import React from 'react'
import P from 'prop-types'
import Toggle from 'react-toggle'

import "react-toggle/style.css"

const SORTS = [
  'stars',
  'scores'
]

class Search extends React.Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit(evt) {
    evt.preventDefault()
    this.props.onFormSubmit()
  }

  handleChange(evt) {
    this.props.onChange('q', evt.target.value)
  }

   render() {
     const {
       activeOrder,
       activeSort,
       value,
       activeFilters,
       filters,
       setOrder,
       setFilter,
       setSort,
       isLoading
     } = this.props

     return [
       <form onSubmit={ this.handleSubmit } key="search_form">
        <input
          type="text"
          placeholder="Github Repositories"
          className="repo_input"
          value={ value }
          onChange={ this.handleChange } />
        <button
          type="submit"
          className="submit_btn">
          { isLoading ? <Loader /> : 'Search' }
        </button>
      </form>,
      <div className="lang_filters" key="lang_filters">
        {
          filters.map(filter => {
            return (
              <div
                key={ filter }
                className={ `filter ${ activeFilters.indexOf(filter) >= 0 && 'active' }`}
                onClick={ setFilter.bind(this, filter)}
                >{ filter }
              </div>
            )
          })
        }
      </div>,
      <div className="sorts" key="sorts">
      <label className="toggle_label">
        <Toggle
          checked={ activeSort === 'stars' }
          name='starsOrScores'
          value={ activeSort }
          onChange={ setSort } />
          <span>{ `sort by ${ activeSort }` }</span>
      </label>
        <button className={ `order chevron_${ activeOrder }` } onClick={ setOrder } />
      </div>
     ]
   }
}

Search.propTypes = {
  onFormSubmit: P.func,
  value: P.string.isRequired,
  filters: P.array,
  activeFilters: P.array,
  activeOrder: P.string.isRequired,
  activeSort: P.string.isRequired,
  setOrder: P.func,
  setFilter: P.func,
  setSort: P.func,
  isLoading: P.bool
}

Search.defaultProps = {
  onFormSubmit: () => false, //default to no op
  setOrder: () => false,
  setFilter: () => false,
  setSort: () => false,
  activeFilters: [],
  isLoading: false
}

export default Search


class Loader extends React.Component {
  render() {
    return (
      <span className="loader">
        <ul>
           <li></li>
           <li></li>
           <li></li>
           <li></li>
           <li></li>
       </ul>
      </span>
    )
  }
}
