import { useNavigate, useLocation } from 'react-router-dom';

export function Fab() {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = () => {
    if (location.pathname.startsWith('/members')) {
      navigate('/members');
      return;
    }

    if (location.pathname.startsWith('/networks')) {
      navigate('/networks/create');
      return;
    }

    navigate('/');
  };

  return (
    <button id="fab" type="button" aria-label="Quick action" onClick={onClick}>
      +
    </button>
  );
}
