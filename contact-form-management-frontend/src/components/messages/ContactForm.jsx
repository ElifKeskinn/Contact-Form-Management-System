import { useState } from 'react';
import { fetchWithAuth } from '../../utils/api';
import PropTypes from 'prop-types';
import '../../assets/styles/global.css';
import { useDarkMode } from "../context/DarkModeContext";

const ContactForm = ({ countries }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState(''); // Burada country'yi tanımladım deniyorum*****
  const [success, setSuccess] = useState(false);
  const { darkMode } = useDarkMode();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await fetchWithAuth('/api/message/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, message, gender, country }),
      });
      setSuccess(true);
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
    }
  };

  if (!Array.isArray(countries)) {
    console.error('countries prop bir dizi değil:', countries);
    return <p>Ülkeler yüklenirken bir hata oluştu.</p>;
  }

  return (
    <div className={darkMode ? "bg-dark text-light" : ""}>
    <div className="contact-form">
      <h2>İletişim Formu</h2>
      {success && <p>Mesajınız başarıyla gönderildi!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ad:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength="50"
            required
          />
        </div>
        <div>
          <label>Mesaj:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength="500"
            required
          />
        </div>
        <div>
          <label>Cinsiyet:</label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={gender === 'male'}
            onChange={() => setGender('male')}
          /> Erkek
          <input
            type="radio"
            name="gender"
            value="female"
            checked={gender === 'female'}
            onChange={() => setGender('female')}
          /> Kadın
        </div>
        <div>
          <label htmlFor="country">Ülke:</label>
          <select id="country" name="country" value={country} onChange={(e) => setCountry(e.target.value)}>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Gönder</button>
      </form>
    </div>
    </div>
  );
};

ContactForm.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.string).isRequired, 
};

export default ContactForm;
