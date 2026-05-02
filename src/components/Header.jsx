import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__home">
        homefixscope
      </Link>
    </header>
  );
}