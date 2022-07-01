import Header from './header'
import SelectButton from './SelectButton';

const Layout = ({ children }) => {
    return(
        <div className>
            <Header/>
            {children}
        </div>
    )
}

export default Layout;