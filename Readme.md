# Návod pre spustenie aplikácie
- v zložke server použiť príkaz `node server`
- v zložke clients použiť príkaz `npm start`
- localhost:3000/user 
- psql -d pern_bp -f db.sql (naklonovat databazu)
- pridat .env file s obsahom : 
PORT = 8000
SECRET = krokorkorkorkaeo
CLIENT_URL = http://localhost:3001 (pripadne zmenit localhost na 3000)
SERVER_URL = http://localhost:8000

- http://localhost:8000/api/get-users
- http://localhost:3000/user
- prihlasit sa->geojsons->eye icon->get geojson from props(deserializacia)
- 