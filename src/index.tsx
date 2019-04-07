import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import axios from 'axios'
import Home from './Home'
import Event from './Event'
import Series from './Series'
import Colors from './Colors'
import { Provider } from 'mobx-react'
import PromoterStore from './stores/promoter'
import EventStore from './stores/event'
import RaceStore from './stores/race'
import RiderStore from './stores/rider'
import SeriesStore from './stores/series'
import BibStore from './stores/bib'
import PassingStore from './stores/passing'
import Hydrated from 'hydrated'
import Race from './Race'

axios.defaults.baseURL = 'https://api.critresult.com'
// axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.headers['content-type'] = 'application/json'

console.log(window.innerHeight)
Object.assign(document.body.style, {
  margin: 'auto',
  'font-family': 'Helvetica',
  'background-color': Colors.whiteDark,
  minHeight: window.innerHeight,
})

const stores = {
  promoter: new PromoterStore(),
  event: new EventStore(),
  race: new RaceStore(),
  rider: new RiderStore(),
  series: new SeriesStore(),
  bib: new BibStore(),
  passing: new PassingStore(),
}

Hydrated.stores = stores

const appDiv = document.getElementById('app')
appDiv.setAttribute(
  'style',
  `
min-height: ${window.innerHeight}px;
display: flex;
flex-direction: column;
`
)
ReactDOM.render(
  <Provider {...stores}>
    <Router>
      <Route path="/" component={Home} exact />
      <Route path="/event/:id" component={Event} />
      <Route path="/series/:id" component={Series} />
      <Route path="/race/:id" component={Race} />
    </Router>
  </Provider>,
  appDiv
)
