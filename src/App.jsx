import React from "react";
import { Switch, Route } from "react-router-dom";
import NavMain from "./components/NavMain";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Profile from "./pages/Profile";

import Contacts from "./pages/Contacts/Contacts";
import CreateContact from "./pages/Contacts/CreateContact";
import EditContact from "./pages/Contacts/EditContact";
import OneContact from "./pages/Contacts/OneContact";

import Institutions from "./pages/Institutions/Institutions";
import CreateInstitution from "./pages/Institutions/CreateInstitution";
import EditInstitution from "./pages/Institutions/EditInstitution";
import OneInstitution from "./pages/Institutions/OneInstitution";

import Calls from "./pages/Calls/Calls";
import CreateCall from "./pages/Calls/CreateCall";
import EditCall from "./pages/Calls/EditCall";


import Users from "./pages/Users/Users";
import CreateUser from "./pages/Users/CreateUser";
import EditUser from "./pages/Users/EditUser";

import CreateVolunteer from "./components/Forms/FormVolunteer"

function App() {
  return (
    <div className="App">
      <NavMain />
      <Switch>
        <ProtectedRoute exact path="/" component={Home} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <ProtectedRoute exact path="/profile" component={Profile} />

        <ProtectedRoute exact path="/contacts" component={Contacts} />
        <ProtectedAdminRoute
          exact
          path="/contacts/create"
          component={CreateContact}
        />
        <ProtectedAdminRoute
          exact
          path="/contacts/:id/edit"
          component={EditContact}
        />
        <ProtectedRoute exact path="/contacts/:id" component={OneContact} />

        <ProtectedAdminRoute exact path="/institutions" component={Institutions} />
        <ProtectedAdminRoute
          exact
          path="/institutions/create"
          component={CreateInstitution}
        />
        <ProtectedAdminRoute
          exact
          path="/institutions/:id/edit"
          component={EditInstitution}
        />
        <ProtectedAdminRoute
          exact
          path="/institutions/:id"
          component={OneInstitution}
        />

        <ProtectedRoute exact path="/calls" component={Calls} />
        <ProtectedRoute exact path="/calls/create" component={CreateCall} />
        <ProtectedRoute exact path="/calls/:id/edit" component={EditCall} />

        <ProtectedAdminRoute exact path="/users" component={Users} />
        <ProtectedAdminRoute exact path="/users/create" component={CreateUser} />
        <ProtectedAdminRoute exact path="/users/:id/edit" component={EditUser} />

        <ProtectedAdminRoute exact path="/volunteers/create" component={CreateVolunteer} />

      </Switch>
    </div>
  );
}

export default App;
