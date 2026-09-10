'use strict';
const calculator = document.querySelector('.calculator');
const number = new Intl.NumberFormat('tr-TR');
function updatePrice() {
  const rate = Number(calculator.querySelector('[name="rate"]:checked').value);
  const count = Number(calculator.querySelector('[name="count"]:checked').value);
  const group = {500: '14 kişilik sınıf', 800: '6 kişilik sınıf', 1100: 'birebir ders'}[rate];
  document.querySelector('#total').textContent = `${number.format(rate * count)} TL`;
  document.querySelector('#calculation').textContent = `${count} ders × ${number.format(rate)} TL · ${group}`;
  document.querySelector('#certificate').hidden = count < 32;
}
calculator.addEventListener('change', updatePrice);
updatePrice();
document.querySelector('#run').addEventListener('click', (event) => {
  document.querySelector('#code-output').textContent = event.currentTarget.dataset.result || 'Benim ilk oyunum';
});
