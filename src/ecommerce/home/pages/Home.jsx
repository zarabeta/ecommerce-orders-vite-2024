import {Outlet} from "react-router-dom";
import AppBar from "../../../share/bars/components/CommerceAppBar";

export default function Home() {
    return (
        <div id='div-home'>
            {/* <h2>Home Page - Commerce Project</h2> */}
            <div id='div-appbar'>
                <AppBar/>
            </div>
            <div id="detail">
                <Outlet/>
            </div>
        </div>
    );
}