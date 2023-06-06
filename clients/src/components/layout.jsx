//import Navbar from './Navbar/navbar'
import Navbar2 from './Navbar/Navbar2'

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar2 />
      <div className='container'>{children}</div>
    </div>
  )
}

export default Layout
