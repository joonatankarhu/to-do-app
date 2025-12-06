# Fullstack Todo App

Todo app using React.js (frontend) and Django REST Framework (backend).

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** version 20 or higher ([Download](https://nodejs.org/))
- **Python** version 3.10 or higher ([Download](https://www.python.org/downloads/))
- **PostgreSQL** ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js)

## Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory (if it doesn't exist) and add your API URL:

```bash
VITE_API_URL=http://localhost:8000
```

4. Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in the terminal).

## Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Create a virtual environment (if it doesn't exist):

```bash
python3 -m venv venv
```

3. Activate virtual environment:

**On macOS/Linux:**

```bash
source venv/bin/activate
```

**On Windows:**

```bash
venv\Scripts\activate
```

4. Install Python dependencies:

```bash
pip install -r requirements.txt
```

5. Set up PostgreSQL database:

   - Create a new PostgreSQL database named `todoapp` (or your preferred name)
   - Note your database credentials (username, password, host, port)

6. Create a `.env` file in the backend directory with your database configuration:

```bash
DB_NAME=todoapp
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

7. Run migrations:

```bash
python manage.py migrate
```

8. (Optional) Create a superuser account to access the Django admin:

```bash
python manage.py createsuperuser
```

9. Start development server:

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`
