import {Switch, Route, Redirect} from 'react-router-dom'

import Home from './component/Home'
import Login from './component/Login'
import NotFound from './component/NotFound'
import JobsPage from './component/JobsPage'
import JobItemDetails from './component/JobItemDetails'
import ProviderRoute from './component/ProviderRoute'
import './App.css'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProviderRoute exact path="/" component={Home} />
    <ProviderRoute exact path="/jobs" component={JobsPage} />
    <ProviderRoute exact path="/jobs/:id" component={JobItemDetails} />
    <Route component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
