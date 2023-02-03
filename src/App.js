import {observer} from "mobx-react-lite";
import useStore from "./hooks/useStore";

function App() {
    const {boards} = useStore()

    return (
        <div>
            STart
        </div>
    );
}

export default observer(App);
