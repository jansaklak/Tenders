const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Importuj routes przed ich użyciem
const tendersRoutes = require('./routes/tenders');

// Ustawienia aplikacji
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Funkcje pomocnicze dostępne globalnie w szablonach
app.locals.formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

app.locals.formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Trasy
app.use('/tenders', tendersRoutes);

app.get('/', (req, res) => {
  res.render('index'); // Załaduj jakiś widok np. "index.ejs"
});

// Obsługa błędu 404
app.use((req, res, next) => {
  res.status(404).render('error', {
    message: 'Page not found',
    error: { status: 404 }
  });
});

// Obsługa innych błędów
app.use((err, req, res, next) => {
  res.status(err.status || 500).render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

// Start serwera
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
