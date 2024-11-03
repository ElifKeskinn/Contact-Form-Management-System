
import  { useState } from 'react';
import { loginUser } from '../../utils/api'; 
import '../../assets/styles/global.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password);
      localStorage.setItem('token', response.token); 
      window.location.href = '/'; 
    } catch (err) {
      setError('Giriş başarısız. Lütfen kullanıcı adı ve şifreyi kontrol edin.');
    }
  };

  return (
    <div className="login-form">
      <h2>Giriş Yap</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Kullanıcı Adı:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default LoginForm;
