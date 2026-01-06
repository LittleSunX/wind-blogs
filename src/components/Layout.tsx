import { Link } from 'react-router-dom';
import '../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            Wind Blogs
          </Link>
          <nav className="nav">
            <Link to="/">首页</Link>
            <a href="https://github.com/LittleSunX/wind-blogs" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">{children}</div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Wind Blogs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
