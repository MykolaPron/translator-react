import React from 'react';

import {BrowserRouter, Route, Routes} from 'react-router-dom';
import TranslationListPage from "../../pages/translationPage";
import Header from "../Header";
import {ERoute} from "../../shared/enums/ERoute";
import GroupPage from "../../pages/groupPage";
import GroupViewPage from "../../pages/groupViewPage";
import SettingsPage from "../../pages/settingsPage";

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path={ERoute.Main}>
                    <Route index element={<div>Main Page</div>}/>
                    <Route path={ERoute.Translation} element={<TranslationListPage/>}/>

                    <Route path={ERoute.Group}>
                        <Route index element={<GroupPage/>}/>
                        <Route path=":groupId/view" element={<GroupViewPage/>}/>
                    </Route>
                    <Route path={ERoute.Settings} element={<SettingsPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
