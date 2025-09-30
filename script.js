const converterForm = document.getElementById("converter-form");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");

window.addEventListener("load", fetchCurrencies);
converterForm.addEventListener("submit", convertCurrency);

async function fetchCurrencies() {
  try {
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();

    const currencyOptions = Object.keys(data.rates);

    currencyOptions.forEach((currency) => {
      const option1 = document.createElement("option");
      option1.value = currency;
      option1.textContent = currency;
      fromCurrency.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = currency;
      option2.textContent = currency;
      toCurrency.appendChild(option2);
    });

    // ✅ عملة افتراضية USD -> EGP
    fromCurrency.value = "USD";
    toCurrency.value = "EGP";

    // ✅ تحميل آخر تحويل محفوظ
    loadLastConversion();
  } catch (error) {
    resultDiv.textContent = "⚠️ Error loading currencies.";
    resultDiv.classList.add("show");
  }
}

async function convertCurrency(e) {
  e.preventDefault();

  const amount = parseFloat(amountInput.value);
  const fromCurrencyValue = fromCurrency.value;
  const toCurrencyValue = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrencyValue}`
    );
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();

    const rate = data.rates[toCurrencyValue];
    const convertedAmount = (amount * rate).toFixed(2);

    resultDiv.textContent = `${amount} ${fromCurrencyValue} = ${convertedAmount} ${toCurrencyValue}`;
    resultDiv.classList.add("show");

    // ✅ حفظ آخر تحويل في Local Storage
    saveLastConversion(
      amount,
      fromCurrencyValue,
      toCurrencyValue,
      convertedAmount
    );
  } catch (error) {
    resultDiv.textContent = "⚠️ Error fetching exchange rate.";
    resultDiv.classList.add("show");
  }
}

function saveLastConversion(amount, from, to, result) {
  const lastConversion = { amount, from, to, result };
  localStorage.setItem("lastConversion", JSON.stringify(lastConversion));
}

function loadLastConversion() {
  const saved = localStorage.getItem("lastConversion");
  if (saved) {
    const { amount, from, to, result } = JSON.parse(saved);
    amountInput.value = amount;
    fromCurrency.value = from;
    toCurrency.value = to;
    resultDiv.textContent = `${amount} ${from} = ${result} ${to}`;
    resultDiv.classList.add("show");
  }
}
