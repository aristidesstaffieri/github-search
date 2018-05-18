import React from 'react'
import P from 'prop-types'

const LANG_QUICK_FILTERS = [
  'react',
  'javascript',
  'clojure',
  'elixir',
  'go',
  'Rust',
  'Node.js'
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
     return [
       <form onSubmit={ this.handleSubmit }>
        <input
          type="text"
          placeholder="Github Repositories"
          className="repo_input"
          value={ this.props.value }
          onChange={ this.handleChange } />
        <button
          type="submit"
          className="submit_btn">
          Search
        </button>
      </form>,
      <div className="lang_filters">
        {
          LANG_QUICK_FILTERS.map(filter => {
            return <div key={filter} className="filter">{ filter }</div>
          })
        }
      </div>
     ]
   }
}

Search.propTypes = {
  onFormSubmit: P.func
}

Search.defaultProps = {
  onFormSubmit: () => false //default to no op
}

export default Search
