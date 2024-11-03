import PropTypes from 'prop-types';

function LanguageSelector({ onLanguageChange }) {
  const handleLanguageChange = (event) => {
    onLanguageChange(event.target.value);
  };

  return (
    <div className="language-selector">
      <select onChange={handleLanguageChange} aria-label="Select language"  className="custom-select">
        <option value="en">English</option>
        <option value="tr">Türkçe</option>
 
      </select>
    </div>
  );
}

LanguageSelector.propTypes = {
  onLanguageChange: PropTypes.func.isRequired,
};

export default LanguageSelector;