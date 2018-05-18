import React from 'react'
import ReactDOM from 'react-dom'

const SERVER_URL = 'http://localhost:3000/repos?q=react&sort=stars&order=desc'

class Repos extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      repos: []
    }
  }

  componentDidMount() {
    fetch(SERVER_URL)
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

  render() {
    return this.state.repos.map((repo, i) => {
      return (
        <div key={i}>
          { repo.name }
        </div>
      )
    })
  }
}


var mountNode = document.getElementById('app')
ReactDOM.render(<Repos />, mountNode)
