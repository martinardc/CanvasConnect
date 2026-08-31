# CanvasConnect

CanvasConnect is a web application intended for independent visual artists.

The application enables users to publish and discover artworks, interact with other users, participate in competitions, browse digital galleries and purchase artworks.

The application was developed as part of a bachelor's thesis at the Faculty of Electrical Engineering and Computing, University of Zagreb.

## Technologies

### Frontend

- React
- Next.js
- JavaScript
- CSS

### Backend

- Python
- FastAPI
- MongoDB
- PyMongo

## Project structure

- `canvas-connect/` – frontend application
- `canvas-connect-py/` – backend application

## Running the application

### Backend

Navigate to the backend directory:

```bash
cd canvas-connect-py
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

The backend runs at:

`http://127.0.0.1:8000`

### Frontend

Navigate to the frontend directory:

```bash
cd canvas-connect
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application is available at:

`http://localhost:3000`

## Configuration

The backend requires MongoDB and JWT configuration.

An example configuration file is provided as:

`canvas-connect-py/config.example.py`

Create a local `config.py` file based on this example and provide the required MongoDB connection information and JWT secret.

Sensitive configuration files are excluded from the repository.

## Author

Martina Rodić