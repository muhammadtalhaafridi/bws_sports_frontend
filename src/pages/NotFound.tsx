import { Link } from "react-router-dom";
import { GiCricketBat } from "react-icons/gi";

export function NotFound() {
  return (
    <div className="container section center not-found">
      <GiCricketBat size={64} />
      <h1>404: Clean bowled!</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}
