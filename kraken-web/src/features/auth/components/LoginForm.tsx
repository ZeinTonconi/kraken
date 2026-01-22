import './LoginForm.css';
import { FormEvent, MouseEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { clearError, login } from '../authSlice';
import bgImage from '../../../assets/login-placeholder.svg';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isLoading = status === 'loading';

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    dispatch(login({ email, password }));
  };

  const onForgot = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(clearError());
    setEmail('');
    setPassword('');
  };

  return (
    <div className="login-card">
      <div className="login-hero">
        <img src={bgImage} alt="Espacio de trabajo" className="login-hero__img" />
      </div>
      <div className="login-panel">
        <div className="login-panel__header">
          <p className="eyebrow">Bienvenido</p>
          <h1>Inicia sesión en tu cuenta</h1>
          <p className="subtext">Mantente al tanto de proyectos, equipos y recompensas.</p>
        </div>
        <form className="login-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Correo electrónico</span>
            <div className="input">
              <span className="icon">@</span>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  if (error) {
                    dispatch(clearError());
                  }
                  setEmail(e.target.value);
                }}
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
          </label>

          <label className="field">
            <span>Contraseña</span>
            <div className="input">
              <span className="icon">••</span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  if (error) {
                    dispatch(clearError());
                  }
                  setPassword(e.target.value);
                }}
                placeholder="••••••••"
                required
              />
            </div>
          </label>

          {error ? (
            <div className="form-error" role="alert">
              {error}
            </div>
          ) : null}

          <div className="actions">
            <button className="btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
            <button className="link" type="button" onClick={onForgot}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>

        <div className="social">
          <p>O continúa con</p>
          <div className="social__icons">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <p className="signup">
          ¿No tienes una cuenta? <a href="#">Regístrate</a>
        </p>
      </div>
    </div>
  );
}
